/**
 * A utility class for displaying in-place loading indicators and toast notifications.
 */
export class InPlaceLoader {

    #activeLoaders;
    #toastContainer;

    constructor() {
        this.#activeLoaders = new Map();
        this.#toastContainer = null;
    }

    /**
     * Creates a loading placeholder where content will appear
     * @param {HTMLElement} container - Where to insert the loader
     * @param {string} message - Loading message
     * @param {Object} options - Configuration options
     * @returns {string} - Unique loader ID for later removal
     */
    showInPlace(container, message = 'Loading...', options = {}) {
        const loaderId = options.id || `loader-${Date.now()}`;

        // Check if loader already exists
        if (this.#activeLoaders.has(loaderId)) {
            return loaderId;
        }

        // Create loader element
        const loader = this.createLoaderElement(message, options);
        loader.id = loaderId;

        // Store reference
        this.#activeLoaders.set(loaderId, {
            element: loader,
            container: container,
            replacedContent: options.replaceContent ? container.innerHTML : null
        });

        // Insert loader
        if (options.replaceContent) {
            container.innerHTML = '';
            container.appendChild(loader);
        } else if (options.insertBefore) {
            container.insertBefore(loader, options.insertBefore);
        } else {
            container.appendChild(loader);
        }

        // Auto-hide timeout if specified
        if (options.timeout) {
            setTimeout(() => this.hide(loaderId), options.timeout);
        }

        return loaderId;
    }

    /**
     * Creates the loader DOM element
     * @param {string} message - Loading message
     * @param {Object} options - Configuration options
     * @returns {HTMLElement} - Loader element
     */
    createLoaderElement(message, options = {}) {
        const loader = document.createElement('div');
        loader.className = 'cr-rs-inline-loader';

        // Add custom classes if provided
        if (options.className) {
            loader.className += ` ${options.className}`;
        }

        loader.innerHTML = this.createSkeletonHTML(options);


        // Set ARIA attributes for accessibility
        loader.setAttribute('role', 'status');
        loader.setAttribute('aria-live', 'polite');
        loader.setAttribute('aria-label', message);

        return loader;
    }


    /**
     * Creates skeleton loader HTML (mimics filter menu structure)
     */
    createSkeletonHTML(options) {
        const lines = options.lines || 3;
        let skeletonHTML = '<div class="cr-rs-skeleton-container">';

        for (let i = 0; i < lines; i++) {
            skeletonHTML += `
                <div class="cr-rs-skeleton-line" style="width: ${85 + Math.random() * 15}%"></div>
            `;
        }

        skeletonHTML += '</div>';
        return skeletonHTML;
    }

    /**
     * Hides and removes a loader
     * @param {string} loaderId - Loader ID to remove
     */
    hide(loaderId) {
        const loaderInfo = this.#activeLoaders.get(loaderId);
        if (!loaderInfo) return;

        // Add fade-out animation
        loaderInfo.element.classList.add('cr-rs-loader-fadeout');

        // Remove after animation
        setTimeout(() => {
            if (loaderInfo.element.parentNode) {
                console.log("Remove loader");
                console.log(loaderInfo.element.parentNode);
                loaderInfo.element.remove();
            }

            // Restore original content if it was replaced
            if (loaderInfo.replacedContent !== null) {
                loaderInfo.container.innerHTML = loaderInfo.replacedContent;
            }

            this.#activeLoaders.delete(loaderId);
        }, 300);
    }

    /**
     * Shows a toast notification
     * @param {string} message - Message to display
     * @param {string} type - 'success', 'error', 'info'
     * @param {number} duration - How long to show (ms)
     */
    showToast(message, type = 'info', duration = 2000) {
        // Create toast container if it doesn't exist
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.className = 'cr-rs-toast-container';
            document.body.appendChild(this.toastContainer);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `cr-rs-toast cr-rs-toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');

        // Add to container
        this.toastContainer.appendChild(toast);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            toast.classList.add('cr-rs-toast-show');
        });

        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('cr-rs-toast-show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Clear all active loaders
     */
    clearAll() {
        this.#activeLoaders.forEach((_, loaderId) => {
            this.hide(loaderId);
        });
    }

    /**
     * Retrieves the current active loaders.
     *
     * @return {Map} The map of active loaders currently in use.
     */
    get activeLoaders() {
        return this.#activeLoaders;
    }
}

// Create singleton instance
export const loader = new InPlaceLoader();

/**
 * Shows loading state where the filter menu will appear
 * @param {HTMLElement} headerElement - The header where the menu will be inserted
 * @returns {string} - Loader ID
 */
export const showFilterMenuLoading = (headerElement) => {
    // Create a placeholder div that matches the expected filter menu size
    const placeholder = document.createElement('div');
    placeholder.className = 'cr-rs-filter-menu-placeholder';

    // Insert after header
    headerElement.append(placeholder);

    // Show loader in the placeholder
    return loader.showInPlace(placeholder, 'Loading filter ...', {
        lines: 1,
        className: 'cr-rs-filter-loader'
    });
}

/**
 * Replace loader with actual filter menu
 * @param {string} loaderId - The loader to hide
 * @param {ChildNode} filterMenu - The actual filter menu element
 */
export const replaceLoaderWithMenu = (loaderId, filterMenu) => {
    console.log("Replace loader with menu");
    const loaderInfo = loader.activeLoaders.get(loaderId);
    if (loaderInfo) {
        const placeholder = loaderInfo.container;
        // Insert the actual menu
        placeholder.parentNode.insertBefore(filterMenu, placeholder);

        // Remove loader and placeholder
        loader.hide(loaderId);
        setTimeout(() => placeholder.remove(), 300);
    }
}

/**
 * Removes loader and placeholder, in the event there is no filter menu to show
 * @param {string} loaderId - The loader to hide
 */
export const removeLoaderAndPlaceholder = (loaderId) => {
    const loaderInfo = loader.activeLoaders.get(loaderId);
    if (loaderInfo) {
        const placeholder = loaderInfo.container;
        loader.hide(loaderId);
        setTimeout(() => placeholder.remove(), 300);
    }
}