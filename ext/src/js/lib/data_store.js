// enable usage of browser. namespace
import "webextension-polyfill/dist/browser-polyfill.min"
import { CRRS_JSON_VERSION } from "./constants";

/**
 * Saves the given filter json to sync
 * 
 * @param {JSON} filter the filter is json form
 */
export const saveFilter = (filter) => {
    browser.storage.sync.set({
        filter: filter,
        jsonVersion: CRRS_JSON_VERSION,
    })
        .then((result) => {
            console.log('Value is set to ');
            console.log(result);
            console.log(filter);
        });
};

/**
 * 
 * @returns {Promise} the filter along with 
 * other preference from sync
 */
export const restorePreference = () => {
    return browser.storage.sync.get({
        filter: null,
        showFilter: true,
        reflowHCount: true,
        showHCount: true,
        savedShownLanguages: [],
        jsonVersion: 0,
    }).then((items) => {
        // if the version is not the same, clear the saved options
        if (items.jsonVersion != CRRS_JSON_VERSION) {
            clearAll();
            // set the default values
            items.showFilter = true;
            items.reflowHCount = true;
            items.showHCount = true;
            items.filter = null;
            items.savedShownLanguages = [];
        }
        // wrap the items in a promise and return it
        return new Promise((resolve, reject) => {
            resolve(items);
        });
    })
};

/**
 * Clears the saved filter from sync
 */
export const clearSavedFilter = () => {
    browser.storage.sync.remove(['filter']).
        then((result) => {
            console.log('Value cleared, currently is '
                + result);
        });
}

/**
 * Clears the saved filter from sync
 */
export const clearAll = () => {
    console.log('Clearing all saved data');
    browser.storage.sync.clear();
}