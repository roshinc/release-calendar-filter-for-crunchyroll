
import "./components/CRCheckbox";

import { initializeEventListenersForQuickDubs, resoreQuickPickOptions, isQuickDubsOptionsDisabled } from "./lib/quick_dubs_options"
import { restoreDefaultsForFilterUI } from "./lib/filter_ui_options"
import { initializeHiddenCountEventHandlers, restoreDefaultsForHiddenCount } from "./lib/hidden_count_options"
import { save_options, restore_options } from "./lib/data_store"

const restore_defaults = () => {
    restoreDefaultsForFilterUI();
    restoreDefaultsForHiddenCount();
    resoreQuickPickOptions([], isQuickDubsOptionsDisabled());
    save_options();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListenersForQuickDubs();
    initializeHiddenCountEventHandlers();
    initializeEventListenersForOptions();
    restore_options();
});

const initializeEventListenersForOptions = () => {
    document.getElementById('save').addEventListener('click',
        save_options);
    document.getElementById('resore-defaults').addEventListener('click',
        restore_defaults);

};






