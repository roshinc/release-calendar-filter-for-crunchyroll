// enable usage of browser. namespace
import "webextension-polyfill/dist/browser-polyfill.min"

/**
 * Saves the given filter json to sync
 * 
 * @param {JSON} filter the filter is json form
 */
export const saveFilter = (filter) => {
    const filterHolder = {};
    filterHolder["filter"] = filter;
    browser.storage.sync.set(filterHolder)
        .then((result) => {
            console.log('Value is set to ');
            console.log(result);
            console.log(filter);
            console.log(filterHolder);
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
    });
}

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