import preference from "../classes/pref";
import Week from "../classes/week";
import Filter from "../classes/filter";
import SimulcastCalendarFetcher from "../classes/simulcast_calendar_fetcher.js";
import {
    loader,
    removeLoaderAndPlaceholder,
    replaceLoaderWithMenu,
    showFilterMenuLoading
} from "../classes/loading_state_manager";
import {createInlineMenu, lockFilters, restoreUI} from "./ui_modifier";
import {restorePreference} from "./data_store";
import {detectLanguageFromBodyOrUrl, reflowHiddenCount} from "./utils";
import {CR_HEADER_DIV_SELECTOR_PATH, ENGLISH_LANGUAGE_CODE, TWELVE_HOURS} from "./constants.js";

/**
 * Initialize the content script with shared functionality
 */
export const initializeContentScript = (passedInFilterLoaderId) => {

    // Use the passed in filter loader id if available, otherwise create a new one
    let filterLoaderId = passedInFilterLoaderId;
    if (!filterLoaderId) {
        const header = document.querySelector(CR_HEADER_DIV_SELECTOR_PATH);
        // Show loading state where the filter menu will appear
        filterLoaderId = showFilterMenuLoading(header);
    }

    // we don't need to spend time creating the fetcher if the page is in English
    const detectedLanguage = detectLanguageFromBodyOrUrl(window.location.href);
    if (detectedLanguage === ENGLISH_LANGUAGE_CODE) {
        console.log("English language detected, skipping fetcher initialization.");
        // restore and apply filter and other preference
        restorePreference()
            .then(items => {
                processRestoredPreference(items, null, filterLoaderId);
            });
    } else {
        console.log("Non-English language detected: ", detectedLanguage);
        // Create a fetcher instance
        const fetcher = new SimulcastCalendarFetcher({
            maxCacheSize: 20,              // Cache up to 20 different URLs (20 weeks)
            cacheTTL: TWELVE_HOURS // 12 hours cache expiration
        });
        // Fetch TinyContent objects, passing the detected language so that we don't have to parse the page again
        fetcher.fetchTinyContents(detectedLanguage).then(tinyContents => {
            if (tinyContents) {
                console.log("TinyContent objects retrieved successfully.");
            } else {
                console.log("No TinyContent objects fetched, no data available.");
            }

            // restore and apply filter and other preference
            restorePreference()
                .then(items => {
                    processRestoredPreference(items, tinyContents, filterLoaderId);
                });
        }).catch(error => {
            console.error('Initialization error:', error);
            removeLoaderAndPlaceholder(filterLoaderId);
            loader.showToast('Failed to initialize filter. Please refresh the page.', 'error', 3000);
        });
    }

};

/**
 * Function to process the restored preferences
 * @param {Object} items - The restored preferences from storage
 * @param {Array<TinyContent>} tinyContents - The fetched TinyContent objects, could be null
 * @param {string} filterLoaderId - The ID of the loader for the filter menu
 */
const processRestoredPreference = (items, tinyContents, filterLoaderId) => {
    if (items.showFilter) {

        // Create the filter menu (but don't insert it yet)
        const tempContainer = document.createElement('div');
        createInlineMenu(tempContainer, items.savedShownLanguages);
        const filterMenu = tempContainer.firstChild;

        // Replace loader with the actual menu
        console.log("Replacing loader with menu");
        replaceLoaderWithMenu(filterLoaderId, filterMenu);
    } else {
        // Just remove the loader if the filter is not shown
        console.log("Hiding loader");
        removeLoaderAndPlaceholder(filterLoaderId);
    }

    processWeek(items, tinyContents);
};

/**
 * Function to process the week
 * @param {Object} items - The restored preferences from storage
 * @param {Array<TinyContent>} tinyContents - The fetched TinyContent objects, could be null
 */
const processWeek = (items, tinyContents) => {
    // parse week synchronously
    const week = parseWeek(document.querySelectorAll(".day"), tinyContents, items.showHCount);

    // if reflow is enabled or not
    preference.reflowEnabled = items.reflowHCount;

    // get saved show languages for dubs
    preference.savedLanguages = items.savedShownLanguages;

    // global filter holder
    preference.crrsFilter = new Filter(week, preference.savedLanguages);

    // restore filter
    if (items.filter != null) {
        if (items.filter !== preference.crrsFilter.createJson()) {
            reflowHiddenCount();
            // modify ui only if the filter is shown
            if (items.showFilter) {
                restoreUI(items.filter);
            }
            preference.crrsFilter.restore(items.filter);
        }
        // if the filter is not null, the ui should show as locked
        lockFilters(true);
    }
};

/**
 * Function to parse the week from the day elements
 * @param {NodeList} dayElements - The elements representing the days of the week
 * @param {Array<TinyContent>} tinyContents - The fetched TinyContent objects, could be null
 * @param {boolean} showHCount - Flag to indicate whether to show hidden count
 * @return {Week} - Returns a Week object
 */
const parseWeek = (dayElements, tinyContents, showHCount) => {
    // Synchronous execution for now
    return new Week(dayElements, tinyContents, showHCount);
};