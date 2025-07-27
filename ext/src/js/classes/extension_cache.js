// enable usage of browser. namespace
import "webextension-polyfill/dist/browser-polyfill.min"

/**
 * Cache class
 */
export default class ExtensionCache {

    #version;
    #namespace;
    #maxCacheSize;
    #cacheTTL;
    #cacheKeyPrefix;
    #cacheIndexKey;
    #extensionVersionKey;
    #versionChecked = false;
    #serialize;
    #deserialize;


    constructor(options = {}) {
        // Use the manifest version as the cache version by default
        const manifestVersion = browser.runtime.getManifest().version;
        this.#version = options.version || manifestVersion
        this.#namespace = options.namespace || 'default_cache';
        this.#maxCacheSize = options.maxCacheSize || 15;
        this.#cacheTTL = options.cacheTTL || 24 * 60 * 60 * 1000; // 24 hours
        this.#cacheKeyPrefix = `${this.#namespace}_cache_`;
        this.#cacheIndexKey = `${this.#namespace}_cache_index`;
        this.#extensionVersionKey = 'extension_version_' + this.#namespace;

        // Optional serialization functions
        this.#serialize = options.serialize || this.#defaultSerialize;
        this.#deserialize = options.deserialize || this.#defaultDeserialize;
    }

    /**
     * Gets data from cache
     * @param {string} key - Cache key
     * @returns {Promise<any|null>} Cached data or null if not found/expired
     */
    async get(key) {
        try {
            // Check the extension version on first access
            await this.#ensureVersionChecked();

            const cacheKey = this.#getStorageKey(key);
            const result = await browser.storage.local.get(cacheKey);
            const cachedData = result[cacheKey];

            if (!cachedData) {
                return null;
            }

            // Verify the original key matches
            if (cachedData.originalKey !== key) {
                // Key mismatch, treat as cache miss
                return null;
            }

            // Check if the cache entry has expired
            const now = Date.now();
            if (now - cachedData.timestamp > this.#cacheTTL) {
                console.log(`Cache entry expired for key: ${key}`);
                await this.remove(key);
                return null;
            }

            // Deserialize the data
            return this.#deserialize(cachedData.data);

        } catch (error) {
            console.error(`Failed to retrieve from cache for key ${key}:`, error);
            return null;
        }
    }


    /**
     * Sets data in cache
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     * @returns {Promise<boolean>} Success status
     */
    async set(key, data) {

        try {
            // Check extension version before setting
            await this.#ensureVersionChecked();

            // Enforce cache size before adding the new entry
            await this.#enforceCacheSize();

            const cacheKey = this.#getStorageKey(key);
            const timestamp = Date.now();

            // Serialize the data
            const serializedData = this.#serialize(data);

            const cacheData = {
                data: serializedData,
                timestamp: timestamp,
                originalKey: key
            };

            // Save to storage
            try {
                await browser.storage.local.set({
                    [cacheKey]: cacheData
                });
            } catch (e) {
                console.warn('set() failed; attempting extra eviction then retry...', e);
                // remove a few more entries
                await this.#evictExtra(3);
                // retry once
                await browser.storage.local.set({
                    [cacheKey]: cacheData
                });
            }

            // Update cache index
            await this.#updateCacheIndex(key, timestamp);

            return true;

        } catch (error) {
            console.error(`Failed to save to cache for key ${key}:`, error);
            return false;
        }
    }


    /**
     * Removes entry from cache
     * @param {string} key - Cache key to remove
     * @returns {Promise<boolean>} Success status
     */
    async remove(key) {
        try {
            const cacheKey = this.#getStorageKey(key);
            await browser.storage.local.remove(cacheKey);

            // Update cache index
            const index = await this.#getCacheIndex();
            const updatedIndex = index.filter(entry => entry.key !== key);
            await browser.storage.local.set({
                [this.#cacheIndexKey]: updatedIndex
            });

            return true;

        } catch (error) {
            console.error(`Failed to remove from cache for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Checks if the key exists in cache (and is not expired)
     * <p>
     *     This method retrieves the data for the key and checks if it is not null.
     * @param {string} key - Cache key to check
     * @returns {Promise<boolean>} Whether key exists and is valid
     */
    async has(key) {
        const data = await this.get(key);
        return data !== null;
    }

    /**
     * Peeks at cached data without triggering version checks or TTL validation
     * Useful for comparing data without affecting cache state
     * @param {string} key - Cache key
     * @returns {Promise<any|null>} Raw cached data or null if not found
     */
    async peek(key) {
        try {
            const cacheKey = this.#getStorageKey(key);
            const result = await browser.storage.local.get(cacheKey);
            const cachedData = result[cacheKey];

            if (!cachedData) {
                return null;
            }

            if (cachedData.originalKey !== key) return null;

            // Return raw deserialized data without TTL or version checks
            return this.#deserialize(cachedData.data);

        } catch (error) {
            console.error(`Failed to peek at cache for key ${key}:`, error);
            return null;
        }
    }

    /**
     * Gets all cache keys
     * @param {Object} [options]
     * @param {boolean} [options.includeExpired=false]
     * @returns {Promise<string[]>}
     */
    async keys(options = {}) {
        const {includeExpired = false} = options;
        try {
            const index = await this.#getCacheIndex();
            if (includeExpired) {
                return index.map(e => e.key);
            }
            const now = Date.now();
            return index
                .filter(e => now - e.timestamp <= this.#cacheTTL)
                .map(e => e.key);
        } catch (error) {
            console.error('Failed to get cache keys:', error);
            return [];
        }
    }

    /**
     * Gets cache statistics
     * @returns {Promise<Object>} Cache stats
     */
    async getStats() {
        try {
            const index = await this.#getCacheIndex();
            const now = Date.now();
            const validEntries = index.filter(entry =>
                now - entry.timestamp <= this.#cacheTTL
            );

            return {
                namespace: this.#namespace,
                version: this.#version,
                totalEntries: index.length,
                validEntries: validEntries.length,
                expiredEntries: index.length - validEntries.length,
                maxSize: this.#maxCacheSize,
                cacheTTL: this.#cacheTTL
            };
        } catch (error) {
            console.error('Failed to get cache stats:', error);
            return null;
        }
    }

    /**
     * Clears all cache entries for this namespace
     * @returns {Promise<boolean>} Success status
     */
    async clear() {
        try {
            const index = await this.#getCacheIndex();
            const keysToRemove = [this.#cacheIndexKey];

            // Add all cache entry keys
            for (const entry of index) {
                keysToRemove.push(this.#getStorageKey(entry.key));
            }

            await browser.storage.local.remove(keysToRemove);
            console.log(`Cleared ${index.length} cache entries from namespace: ${this.#namespace}`);
            return true;

        } catch (error) {
            console.error(`Failed to clear cache for namespace ${this.#namespace}:`, error);
            return false;
        }
    }

    /**
     * Manual version check (can be called explicitly)
     * @returns {Promise<boolean>} Whether cache was cleared
     */
    async forceVersionCheck() {
        try {
            const result = await browser.storage.local.get(this.#extensionVersionKey);
            const storedVersion = result[this.#extensionVersionKey];

            if (storedVersion && storedVersion !== this.#version) {
                await this.clear();
                await browser.storage.local.set({
                    [this.#extensionVersionKey]: this.#version
                });
                return true; // Cache was cleared
            }

            return false; // Cache was not cleared
        } catch (error) {
            console.error(`Failed to force version check for ${this.#namespace}:`, error);
            return false;
        }
    }

    /**
     * Cleans up expired entries manually
     * @returns {Promise<number>} Number of entries cleaned up
     */
    async cleanupExpired() {
        try {
            const index = await this.#getCacheIndex();
            const now = Date.now();
            let cleanedCount = 0;

            const validIndex = [];
            const keysToRemove = [];

            for (const entry of index) {
                if (now - entry.timestamp > this.#cacheTTL) {
                    keysToRemove.push(this.#cacheKeyPrefix + this.#hashKey(entry.key));
                    cleanedCount++;
                } else {
                    validIndex.push(entry);
                }
            }

            if (cleanedCount > 0) {
                // Remove all expired data entries in one call
                await browser.storage.local.remove(keysToRemove);
                // Write the new, smaller index in one call
                await browser.storage.local.set({[this.#cacheIndexKey]: validIndex});
                console.log(`Cleaned up ${cleanedCount} expired entries from ${this.#namespace}`);
            }

            return cleanedCount;

        } catch (error) {
            console.error(`Failed to cleanup expired entries for ${this.#namespace}:`, error);
            return 0;
        }
    }

    /**
     * Evicts the given number of extra entries from the cache
     * @param {number} n - Number of entries to evict
     */
    async #evictExtra(n) {
        try {
            const index = await this.#getCacheIndex();
            // If there are no entries, nothing to evict
            if (index.length === 0) return;

            // Sort by timestamp to find the oldest entries
            index.sort((a, b) => a.timestamp - b.timestamp);

            const evictCount = Math.min(n, index.length);
            const entriesToEvict = index.slice(0, evictCount);
            const updatedIndex = index.slice(evictCount);

            if (entriesToEvict.length > 0) {
                const keysToRemoveFromStorage = entriesToEvict.map(entry =>
                    this.#getStorageKey(entry.key)
                );

                // Perform bulk removal
                await browser.storage.local.remove(keysToRemoveFromStorage);
                await browser.storage.local.set({[this.#cacheIndexKey]: updatedIndex});

                console.log(`Force-evicted ${entriesToEvict.length} extra entries from ${this.#namespace}.`);
            }
        } catch (e) {
            console.error(`Failed to evict extra entries for ${this.#namespace}:`, e);
        }
    }

    /**
     * Ensures the extension version is checked before any cache operations
     * @returns {Promise<void>}
     */
    async #ensureVersionChecked() {
        if (!this.#versionChecked) {
            await this.#checkExtensionVersion();
            this.#versionChecked = true;
        }
    }

    /**
     * Checks if the extension version changed and clears the cache if needed
     * @private
     */
    async #checkExtensionVersion() {
        try {
            const result = await browser.storage.local.get(this.#extensionVersionKey);
            const storedVersion = result[this.#extensionVersionKey];

            if (storedVersion && storedVersion !== this.#version) {
                console.log(`Extension updated: ${storedVersion} → ${this.#version}. Clearing ${this.#namespace} cache.`);
                await this.clear();
                console.log(`Cache cleared for namespace: ${this.#namespace}`);
            }

            // Update stored version
            await browser.storage.local.set({
                [this.#extensionVersionKey]: this.#version
            });

        } catch (error) {
            console.error(`Failed to check extension version for ${this.#namespace}:`, error);
        }
    }

    /**
     * Generates a storage key for the given key
     * @param key - key to generate a storage key for
     * @returns {string} Storage key with namespace prefix
     */
    #getStorageKey(key) {
        return this.#cacheKeyPrefix + this.#hashKey(key);
    }

    /**
     * Enforces cache size limit by evicting the oldest entries
     * @private
     */
    async #enforceCacheSize() {
        try {
            const index = await this.#getCacheIndex();

            // The check is >= because this function is called right before adding a new item
            if (index.length >= this.#maxCacheSize) {
                // Sort by timestamp (oldest first) and remove excess entries
                index.sort((a, b) => a.timestamp - b.timestamp);

                const evictCount = index.length - this.#maxCacheSize + 1;
                const entriesToEvict = index.slice(0, evictCount);
                const updatedIndex = index.slice(evictCount);

                if (entriesToEvict.length > 0) {
                    // Get the keys to remove
                    const keysToRemoveFromStorage = entriesToEvict.map(entry =>
                        this.#getStorageKey(entry.key)
                    );

                    // Preform bulk removal of data entries
                    await browser.storage.local.remove(keysToRemoveFromStorage);
                    // Update the cache index
                    await browser.storage.local.set({[this.#cacheIndexKey]: updatedIndex});
                    console.log(`Evicted ${entriesToEvict.length} old cache entries to maintain size.`);
                }
            }
        } catch (error) {
            console.error(`Failed to enforce cache size for ${this.#namespace}:`, error);
        }
    }

    /**
     * Updates the cache index with new entry
     * @private
     * @param {string} key - Cache key
     * @param {number} timestamp - Timestamp of cached entry
     */
    async #updateCacheIndex(key, timestamp) {
        try {
            let index = await this.#getCacheIndex();

            // Remove existing entry if it exists
            index = index.filter(entry => entry.key !== key);

            // Add new entry
            index.push({key, timestamp});

            await browser.storage.local.set({
                [this.#cacheIndexKey]: index
            });
        } catch (error) {
            console.error(`Failed to update cache index for ${this.#namespace}:`, error);
        }
    }

    /**
     * Gets the current cache index
     * @private
     * @returns {Promise<Array>} Cache index array
     */
    async #getCacheIndex() {
        try {
            const result = await browser.storage.local.get(this.#cacheIndexKey);
            return result[this.#cacheIndexKey] || [];
        } catch (error) {
            console.error(`Failed to get cache index for ${this.#namespace}:`, error);
            return [];
        }
    }

    /**
     * Creates a simple hash from key for storage
     * @private
     * @param {string} key - Key to hash
     * @returns {string} Simple hash of the key
     */
    #hashKey(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            const char = key.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & 0xffffffff; // 32-bit conversion
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * Default serialization function
     * @private
     * @param {any} data - Data to serialize
     * @returns {any} Serialized data
     */
    #defaultSerialize(data) {
        return data; // Pass through - works for plain objects and primitives
    }

    /**
     * Default deserialization function
     * @private
     * @param {any} data - Data to deserialize
     * @returns {any} Deserialized data
     */
    #defaultDeserialize(data) {
        return data; // Pass through - works for plain objects and primitives
    }
}