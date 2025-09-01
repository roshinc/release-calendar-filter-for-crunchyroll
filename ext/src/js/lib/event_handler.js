import _ from "caldom/dist/caldom.min.mjs";

import preference from "../classes/pref";

import {reflowHiddenCount} from "./utils";
import {
    CRRS_FILTER_MENU_DUBS_RADIO_GROUP_NAME,
    CRRS_FILTER_MENU_PERMIERE_RADIO_GROUP_NAME,
    CRRS_FILTER_MENU_PICK_DUBS_DIV_ID,
    CRRS_FILTER_MENU_QUEUE_RADIO_GROUP_NAME,
    CRRS_FILTER_MENU_RADIO_GROUP_ONLY_VALUE,
    CRRS_FILTER_MENU_RADIO_GROUP_SHOW_VALUE
} from "./constants";
import {clearSavedFilter, saveFilter} from "./data_store";

export const handleDubPickerCheckbox = (event) => {
    reflowHiddenCount();
    let target = _(event.target);
    const isChecked = target.elem.checked;

    // let dubToggle = _(document.getElementById(CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID));
    let dubGroupSelectedValue = document.querySelector(`input[name="${CRRS_FILTER_MENU_DUBS_RADIO_GROUP_NAME}"]:checked`).value;
    let dubGroup = document.querySelectorAll(`input[name="${CRRS_FILTER_MENU_DUBS_RADIO_GROUP_NAME}"]`);
    let dubPicked = document.querySelectorAll(`#${CRRS_FILTER_MENU_PICK_DUBS_DIV_ID} input:checked`);
    let langsToShow = Array.from(dubPicked).flatMap(cb => {
        return _(cb).data("lang");
    });

    if (isChecked) {
        if (dubGroupSelectedValue == "hide") {
            for (const [i, elem] of dubGroup.entries()) {
                if (i == 1) {
                    elem.checked = true;
                    break;
                }
            }
        }
        preference.crrsFilter.showDubsOf(langsToShow);
    } else {
        if (dubPicked.length < 1) {

            for (const [i, elem] of dubGroup.entries()) {
                if (i == 2) {
                    elem.checked = true;
                    break;
                }
            }
            // dubToggle.elem.checked = false;

            //Hide all dubs 
            preference.crrsFilter.showAllSubsAndHideAllDubs();
        } else {
            let show = Array.from(dubPicked).flatMap(cb => {
                return _(cb).data("lang");
            });
            preference.crrsFilter.showDubsOf(show);
        }

    }

};

export const handleDubbedRadioGroup = (event) => {
    reflowHiddenCount();
    let selectedValue = document.querySelector(`input[name="${CRRS_FILTER_MENU_DUBS_RADIO_GROUP_NAME}"]:checked`).value;

    let dubPickers = _(`#${CRRS_FILTER_MENU_PICK_DUBS_DIV_ID} input`);
    let dubPickersChecked = _(`#${CRRS_FILTER_MENU_PICK_DUBS_DIV_ID} input:checked`);
    let langsToShow = Array.from(dubPickersChecked).flatMap(cb => {
        return _(cb).data("lang");
    });

    switch (selectedValue) {
        case CRRS_FILTER_MENU_RADIO_GROUP_ONLY_VALUE.toLowerCase():
            preference.crrsFilter.hideAllSubsAndShowWantedDubs(langsToShow);
            if (dubPickersChecked.elems.length < 1) {
                dubPickers.each((elem, i) => {
                    elem.checked = true;
                });
            }
            // } else {
            //     preference.crrsFilter.showDubsOf(langsToShow);
            // }
            break;
        case CRRS_FILTER_MENU_RADIO_GROUP_SHOW_VALUE.toLowerCase():
            preference.crrsFilter.showAllSubsAndWantedDubs(langsToShow);
            if (dubPickersChecked.elems.length < 1) {
                dubPickers.each((elem, i) => {
                    elem.checked = true;
                });
            }
            // } else {
            //     preference.crrsFilter.showDubsOf(langsToShow);
            // }
            break;
        case 'hide':
            preference.crrsFilter.showAllSubsAndHideAllDubs();
            dubPickers.each((elem, i) => {
                elem.checked = false;
            });
            break;
        default:
            throw `unknow selection ${selectedValue}.`;
    }
}

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
            preference.crrsFilter.showPremiereOnly();
            break;
        case 'show':
            preference.crrsFilter.showPremiere();
            break;
        case 'hide':
            preference.crrsFilter.hidePremiere();
            break;
        default:
            throw `unknow selection ${selectedValue}.`;
    }
}


export const handleLockBtn = (event, callbackFunction) => {
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

export const handleResetBtn = (event, callbackFunction) => {
    reflowHiddenCount();
    let dubGroup = document.querySelectorAll(`input[name="${CRRS_FILTER_MENU_DUBS_RADIO_GROUP_NAME}"]`);

    for (const [i, elem] of dubGroup.entries()) {
        if (i == 1) {
            elem.checked = true;
            break;
        }
    }

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