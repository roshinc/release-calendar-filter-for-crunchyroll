/*
 * All JS in this file will be run on any pages that match the pattern defined in manifest.
 */

import preference from "./classes/pref";
import Week from "./classes/week";
import Filter from "./classes/filter";
import SimulcastCalendarFetcher from "./classes/simulcast_calendar_fetcher";
import {createInlineMenu, lockFilters, restoreUI} from "./lib/ui_modifier";
import {restorePreference} from "./lib/data_store";
import {reflowHiddenCount} from "./lib/utils";

window.onload = function () {

    // Create a fetcher instance with custom cache options
    const fetcher = new SimulcastCalendarFetcher({
        maxCacheSize: 20,              // Cache up to 20 different URLs
        cacheTTL: 12 * 60 * 60 * 1000  // 12 hours cache expiration
    });

    fetcher.fetchTinyContents().then(tinyContents => {
        if (tinyContents) {
            console.log("TinyContent objects retrieved successfully.");
        } else {
            console.log("No TinyContent objects fetched, already on English page or no data available.");
        }

        // restore and apply filter and other preference
        restorePreference()
            .then(items => processRestoredPreference(items, tinyContents));
    });


};

/**
 * Function to process the restored preferences
 * @param {Object} items - The restored preferences from storage
 * @param {Array<TinyContent>} tinyContents - The fetched TinyContent objects, could be null
 */
const processRestoredPreference = (items, tinyContents) => {
    if (items.showFilter) {
        createInlineMenu(document.querySelector("header.simulcast-calendar-header"), items.savedShownLanguages);
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
        if (items.filter != preference.crrsFilter.createJson()) {
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
}


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

