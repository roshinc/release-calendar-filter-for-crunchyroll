// enable usage of browser. namespace
import "webextension-polyfill/dist/browser-polyfill.min"

import { resoreQuickPickOptions, getListOfShownLanguages, isQuickDubsOptionsDisabled } from "./quick_dubs_options"
import { setUISateOfMenu } from "./filter_ui_options"
import { setUIStateOfHiddenCount } from "./hidden_count_options"
import { CRRS_JSON_VERSION } from "../../../js/lib/constants"

/**
 * Saves options to browser.storage
 */
export const save_options = () => {
    let showFilter = document.getElementById('show-filter-input').checked;
    let reflowHCount = document.getElementById('reflow-hcount-input').checked;
    let showHCount = document.getElementById('show-hcount-input').checked;
    //Get a list of the shown languages, get disabled stause
    const shownLanguagesArray = getListOfShownLanguages();
    const quickDubsDisabled = isQuickDubsOptionsDisabled();

    browser.storage.sync.set({
        showFilter: showFilter,
        reflowHCount: reflowHCount,
        showHCount: showHCount,
        savedShownLanguages: shownLanguagesArray,
        jsonVersion: CRRS_JSON_VERSION,
    }).then(() => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
        setUISateOfMenu(showFilter, true);
        setUIStateOfHiddenCount(reflowHCount, showHCount);
        resoreQuickPickOptions(shownLanguagesArray, quickDubsDisabled);
    });
}

/**
 * Restores options from browser.storage and sets the UI states
 */
export const restore_options = () => {

    browser.storage.sync.get({
        showFilter: true,
        reflowHCount: true,
        showHCount: true,
        filter: null,
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
        document.getElementById('show-filter-input').checked = items.showFilter;
        document.getElementById('reflow-hcount-input').checked = items.reflowHCount;
        document.getElementById('show-hcount-input').checked = items.showHCount;
        setUISateOfMenu(items.showFilter, items.filter != null);
        setUIStateOfHiddenCount(items.reflowHCount, items.showHCount);
        resoreQuickPickOptions(items.savedShownLanguages, items.filter != null);
    });
}

/**
 * Clears the saved filter from sync
 */
const clearAll = () => {
    console.log("Clearing all saved options");
    browser.storage.sync.clear();
}