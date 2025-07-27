// enable usage of browser. namespace
import "webextension-polyfill/dist/browser-polyfill.min"
import ExtensionCache from './extension_cache.js';
import TinyContent from './tiny_content.js';

/**
 * Handles fetching and caching of Crunchyroll simulcast calendar content
 */
export default class SimulcastCalendarFetcher {
    constructor(options = {}) {
        // Create a cache instance with TinyContent-specific serialization
        this.cache = new ExtensionCache({
            namespace: 'simulcast_calendar',
            maxCacheSize: options.maxCacheSize || 15,
            cacheTTL: options.cacheTTL || 24 * 60 * 60 * 1000, // 24 hours
            serialize: this.serializeTinyContents.bind(this),
            deserialize: this.deserializeTinyContents.bind(this)
        });
    }

    /**
     * Main method to fetch TinyContent objects with caching
     * @returns {Promise<Array<TinyContent>|null>} Array of TinyContent objects or null if failed
     */
    async fetchTinyContents() {
        try {
            const currentUrl = window.location.href;
            console.log(`Current URL: ${currentUrl}`);

            const language = this.detectLanguageFromUrl(currentUrl);
            console.log(`Detected language: ${language}`);

            if (language === "en") {
                console.log("Already on English page, no need to fetch");
                return null;
            }

            console.warn(`Language detected: ${language}`);
            const englishUrl = this.constructEnglishUrl(currentUrl);
            console.log(`English URL: ${englishUrl}`);

            // Check for new episodes by comparing current page article count with cached count
            const shouldClearCache = await this.checkForNewEpisodes(englishUrl);
            if (shouldClearCache) {
                console.log("New episodes detected, clearing cache to fetch fresh data");
                await this.cache.remove(englishUrl);
            }

            // Try to get from cache first
            const cachedContents = await this.cache.get(englishUrl);
            if (cachedContents) {
                console.log(`Retrieved ${cachedContents.length} cached content objects`);
                // Log cached content
                /*cachedContents.forEach((content, index) => {
                    console.log(`Cached Content ${index + 1}: ${content.blurb()}`);
                });*/
                return cachedContents;
            }

            // Fetch fresh data
            const tinyContents = await this.fetchFromUrl(englishUrl);
            if (tinyContents && tinyContents.length > 0) {
                // Save to cache
                const cached = await this.cache.set(englishUrl, tinyContents);
                if (cached) {
                    console.log(`Cached ${tinyContents.length} TinyContent objects`);
                }
            }

            return tinyContents;

        } catch (error) {
            console.error('Failed to fetch TinyContent objects:', error);
            return null;
        }
    }

    /**
     * Detects language from URL
     * @param {string} url - The current URL
     * @returns {string} Language code (defaults to "en")
     */
    detectLanguageFromUrl(url) {
        const match = url.match(/.+crunchyroll\.com\/(.+)\/simulcastcalendar.*/);
        return match?.[1] || "en";
    }

    /**
     * Constructs English URL from current URL
     * @param {string} currentUrl - Current page URL
     * @returns {string} English simulcast calendar URL
     */
    constructEnglishUrl(currentUrl) {
        let englishUrl = currentUrl.replace(
            /(crunchyroll\.com)\/[^/]+(\/simulcastcalendar.*)/,
            '$1$2'
        );

        // First, check if the head link has the filter query param
        const headLink = document.querySelector('head link[rel="alternate"][hreflang="en-us"]');

        if (headLink) {
            const url = new URL(headLink.href);
            const hasFilterParam = url.searchParams.has('filter');


            if (!hasFilterParam) {
                // Method 2: Get the current form value
                const form = document.getElementById('filter_toggle_form');
                const currentFilterValue = form.elements['filter'].value;

                // Add the filter parameter to the URL
                url.searchParams.set('filter', currentFilterValue);
                englishUrl = url.toString();

                console.log('Added filter parameter:', englishUrl);
            } else {
                // URL already has filter parameter, use as-is
                englishUrl = headLink.href;
                console.log('URL already has filter parameter:', englishUrl);
            }

            // Now you have the final URL with the filter parameter
            console.log('Final URL:', englishUrl);

        } else {
            console.log('Head link not found');
        }

        return englishUrl;
    }

    /**
     * Fetches TinyContent objects from given URL
     * @param {string} url - URL to fetch from
     * @returns {Promise<Array<TinyContent>|null>} Array of TinyContent objects
     */
    async fetchFromUrl(url) {
        try {
            const response = await fetch(url, {credentials: 'omit'});
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            console.log("Successfully fetched from URL, the document title is:", doc.title);

            const releaseArticles = doc.querySelectorAll("article.js-release");

            if (releaseArticles.length === 0) {
                console.log("No release articles found");
                return null;
            }

            const tinyContents = Array.from(releaseArticles).map(
                (article, index) => new TinyContent(article, index)
            );

            console.log(`Created ${tinyContents.length} TinyContent objects from fetch`);

            // Log the blurb of each TinyContent object
            // tinyContents.forEach((content, index) => {
            //     console.log(`Content ${index + 1}: ${content.blurb()}`);
            // });

            return tinyContents;

        } catch (error) {
            console.error('Failed to fetch from URL:', error);
            throw error;
        }
    }

    /**
     * Serializes TinyContent array for caching
     * @param {Array<TinyContent>} tinyContents - Array of TinyContent objects
     * @returns {Array<Object>} Serialized data
     */
    serializeTinyContents(tinyContents) {
        return tinyContents.map(content => ({
            popoverId: content.popoverId,
            contentIndex: content.contentIndex,
            showTitle: content.showTitle,
            seasonTitle: content.seasonTitle,
            // blurb: content.blurb(),
            timestamp: Date.now()
        }));
    }

    /**
     * Deserializes cached data back to content objects
     * @param {Array<Object>} contentDataArray - Array of serialized content data
     * @returns {Array<Object>} Array of cached content objects
     */
    deserializeTinyContents(contentDataArray) {
        return contentDataArray.map(contentData => ({
            popoverId: contentData.popoverId,
            contentIndex: contentData.contentIndex,
            showTitle: contentData.showTitle,
            seasonTitle: contentData.seasonTitle,
            // blurb: () => contentData.blurb,
            isCachedData: true,
            timestamp: contentData.timestamp
        }));
    }

    /**
     * Checks if new episodes have been added by comparing current page article count with cached count
     * @param {string} englishUrl - The English URL we're caching
     * @returns {Promise<boolean>} Whether cache should be cleared due to new episodes
     */
    async checkForNewEpisodes(englishUrl) {
        try {
            // Count articles on the current page (non-English page)
            const currentPageArticles = document.querySelectorAll("article.js-release");
            const currentCount = currentPageArticles.length;

            if (currentCount === 0) {
                // If current page has no articles, we can't make a comparison
                console.log("No articles found on current page, skipping new episode check");
                return false;
            }

            // Peek at cached data without triggering cache logic
            const cachedData = await this.cache.peek(englishUrl);

            if (!cachedData || !Array.isArray(cachedData)) {
                // No cached data exists, so no need to clear
                return false;
            }

            const cachedCount = cachedData.length;
            console.log(`Episode count comparison - Current page: ${currentCount}, Cached: ${cachedCount}`);

            // Clear cache if current page has more articles (new episodes added)
            if (currentCount > cachedCount) {
                console.log(`🆕 New episodes detected! Current: ${currentCount}, Cached: ${cachedCount}`);
                return true;
            }

            return false;

        } catch (error) {
            console.error('Failed to check for new episodes:', error);
            return false; // Don't clear cache on error
        }
    }

    /**
     * Gets cache statistics
     * @returns {Promise<Object>} Cache statistics
     */
    async getCacheStats() {
        return await this.cache.getStats();
    }

    /**
     * Clears the simulcast calendar cache
     * @returns {Promise<boolean>} Success status
     */
    async clearCache() {
        return await this.cache.clear();
    }

    /**
     * Manually cleanup expired cache entries
     * @returns {Promise<number>} Number of cleaned up entries
     */
    async cleanupExpiredCache() {
        return await this.cache.cleanupExpired();
    }
}