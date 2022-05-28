import _ from "../vendors/caldom.min.mjs.js";

import preference from "../classes/pref";

import { reflowHiddenCount } from "./utils";
import {
    CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID, CRRS_FILTER_MENU_PICK_DUBS_DIV_ID,
    CRRS_FILTER_MENU_QUEUE_RADIO_GROUP_NAME, CRRS_FILTER_MENU_PERMIERE_RADIO_GROUP_NAME
} from "./constants";
import { clearSavedFilter, saveFilter } from "./data_store";

export const handleShowDubsToggle = (event) => {
    reflowHiddenCount();
    const isChecked = event.target.checked;

    let dubPickers = _(`#${CRRS_FILTER_MENU_PICK_DUBS_DIV_ID} input`);

    if (isChecked) {
        dubPickers.each((elem, i) => {
            //Show all dubs
            preference.crrsFilter.showAllDubs();
            elem.checked = true;
        });
    } else {
        dubPickers.each((elem, i) => {
            //Hide all dubs
            preference.crrsFilter.hideAllDubs();
            elem.checked = false;
        });
    }
};

export const handleDubPickerCheckbox = (event) => {
    reflowHiddenCount();
    let target = _(event.target);
    const isChecked = target.elem.checked;

    let dubToggle = _(document.getElementById(CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID));
    let dubPicked = document.querySelectorAll(`#${CRRS_FILTER_MENU_PICK_DUBS_DIV_ID} input:checked`);
    let langsToShow = Array.from(dubPicked).flatMap(cb => {
        return _(cb).data("lang");
    });

    if (isChecked) {
        dubToggle.elem.checked = true;
        preference.crrsFilter.showDubsOf(langsToShow);
    } else {
        if (dubPicked.length < 1) {
            dubToggle.elem.checked = false;
            //Hide all dubs
            preference.crrsFilter.hideAllDubs();
        } else {
            let show = Array.from(dubPicked).flatMap(cb => {
                return _(cb).data("lang");
            });
            preference.crrsFilter.showDubsOf(show);
        }

    }

};

export const handleQueueRadioGroup = (event) => {
    reflowHiddenCount();
    let selectedValue = document.querySelector(`input[name="${CRRS_FILTER_MENU_QUEUE_RADIO_GROUP_NAME}"]:checked`).value;

    switch (selectedValue) {
        case 'only':
            preference.crrsFilter.showInQueueOnly();
            break;
        case 'show':
            preference.crrsFilter.showInQueue();
            break;
        case 'hide':
            preference.crrsFilter.hideInQueue();
            break;
        default:
            throw `unknow selection ${selectedValue}.`;
    }
}

export const handlePremiereRadioGroup = (event) => {
    reflowHiddenCount();
    let selectedValue = document.querySelector(`input[name="${CRRS_FILTER_MENU_PERMIERE_RADIO_GROUP_NAME}"]:checked`).value;

    switch (selectedValue) {
        case 'only':
            preference.crrsFilter.showPermiereOnly();
            break;
        case 'show':
            preference.crrsFilter.showPermiere();
            break;
        case 'hide':
            preference.crrsFilter.hidePermiere();
            break;
        default:
            throw `unknow selection ${selectedValue}.`;
    }
}


export const handelLockBtn = (event, callbackFunction) => {
    reflowHiddenCount();

    let icon, lock;

    if (event.target.nodeName == 'I') {
        icon = _(event.target);
        lock = _(event.target.parentNode);
    } else {
        lock = _(event.target);
        icon = _(event.target.firstChild);
    }
    let isLocked = lock.data("isLocked");
    console.log(lock.elem);
    console.log(icon.elem);


    if (isLocked == "true") {
        //unlock
        clearSavedFilter();
        callbackFunction(false, lock, icon);
    } else {
        //lock
        saveFilter(preference.crrsFilter.createJson());
        callbackFunction(true, lock, icon);
    }

}

export const handelResetBtn = (event, callbackFunction) => {
    reflowHiddenCount();
    let dubToggle = _(document.getElementById(CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID));
    dubToggle.elem.checked = true;

    let dubPickers = _(`#${CRRS_FILTER_MENU_PICK_DUBS_DIV_ID} input`);
    dubPickers.each((elem, i) => {
        elem.checked = true;
    });

    let queueGroup = document.querySelectorAll(`input[name="${CRRS_FILTER_MENU_QUEUE_RADIO_GROUP_NAME}"]`);

    for (const [i, elem] of queueGroup.entries()) {
        if (i == 1) {
            elem.checked = true;
            break;
        }
    }

    let premiereGroup = document.querySelectorAll(`input[name="${CRRS_FILTER_MENU_PERMIERE_RADIO_GROUP_NAME}"]`);

    for (const [i, elem] of premiereGroup.entries()) {
        console.log(i);
        if (i == 1) {
            elem.checked = true;
            break;
        }
    }

    clearSavedFilter();
    callbackFunction(false);
    preference.crrsFilter.reset()

}