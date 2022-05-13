const handleShowDubsToggle = (event) => {
    reflowHiddenCount();
    const isChecked = event.target.checked;

    let dubPickers = _(`#${CRRS_FILTER_MENU_PICK_DUBS_DIV_ID} input`);

    if (isChecked) {
        dubPickers.each((elem, i) => {
            //TODO: Show all dubs
            crrsFilter.showAllDubs();
            elem.checked = true;
        });
    } else {
        dubPickers.each((elem, i) => {
            //TODO: Hide all dubs
            crrsFilter.hideAllDubs();
            elem.checked = false;
        });
    }
};

const handleDubPickerCheckbox = (event) => {
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
        crrsFilter.showDubsOf(langsToShow);
    } else {
        if (dubPicked.length < 1) {
            dubToggle.elem.checked = false;
            //TODO: Hide all dubs
            crrsFilter.hideAllDubs();
        } else {
            let show = Array.from(dubPicked).flatMap(cb => {
                return _(cb).data("lang");
            });
            crrsFilter.showDubsOf(show);
        }

    }

};

const handleQueueRadioGroup = (event) => {
    reflowHiddenCount();
    let selectedValue = document.querySelector(`input[name="${CRRS_FILTER_MENU_QUEUE_RADIO_GROUP_NAME}"]:checked`).value;

    switch (selectedValue) {
        case 'only':
            crrsFilter.showInQueueOnly();
            break;
        case 'show':
            crrsFilter.showInQueue();
            break;
        case 'hide':
            crrsFilter.hideInQueue();
            break;
        default:
            throw `unknow selection ${selectedValue}.`;
    }
}

const handlePremiereRadioGroup = (event) => {
    reflowHiddenCount();
    let selectedValue = document.querySelector(`input[name="${CRRS_FILTER_MENU_PERMIERE_RADIO_GROUP_NAME}"]:checked`).value;

    switch (selectedValue) {
        case 'only':
            crrsFilter.showPermiereOnly();
            break;
        case 'show':
            crrsFilter.showPermiere();
            break;
        case 'hide':
            crrsFilter.hidePermiere();
            break;
        default:
            throw `unknow selection ${selectedValue}.`;
    }
}


const handelLockBtn = (event) => {
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
        lockFilters(false, lock, icon);
    } else {
        //lock
        saveFilter(crrsFilter.createJson());
        lockFilters(true, lock, icon);
    }

}

const handelResetBtn = (event) => {
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
    lockFilters(false);
    crrsFilter.reset()

}

const restoreFilterAndUI = (savedFilter) => {
    if (savedFilter == crrsFilter.createJson()) {
        return;
    }

    reflowHiddenCount();

    const hideAllDubs = savedFilter["hideAllDub"];
    let dubToggle = document.getElementById(CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID);
    dubToggle.checked = !hideAllDubs;

    let dubPickers = document.querySelectorAll(`#${CRRS_FILTER_MENU_PICK_DUBS_DIV_ID} input`);
    const dubsShown = savedFilter["dubsShown"];
    console.log(dubToggle);
    console.log(dubsShown);
    // if no dubs are shown uncheck all the langs
    if (hideAllDubs) {
        for (const [i, elem] of dubPickers.entries()) {
            elem.checked = false;
        }
    } else if (dubsShown.length > 0) {
        for (const [i, elem] of dubPickers.entries()) {
            if (dubsShown.includes(_(elem).data("lang")[0])) {
                elem.checked = true;
            } else {
                elem.checked = false;
            }
        }
    }

    const showInQueue = savedFilter["showInQueue"];
    const showOnlyInQueue = savedFilter["showOnlyInQueue"];

    let indexToPick;
    if (showOnlyInQueue) {
        indexToPick = 0;
    } else if (!showInQueue && !showOnlyInQueue) {
        indexToPick = 2;
    }

    let queueGroup = document.querySelectorAll(`input[name="${CRRS_FILTER_MENU_QUEUE_RADIO_GROUP_NAME}"]`);

    for (const [i, elem] of queueGroup.entries()) {
        if (i == indexToPick) {
            elem.checked = true;
            break;
        }

    }

    const showPremiere = savedFilter["showPremiere"];
    const showOnlyPremiere = savedFilter["showOnlyPremiere"];

    indexToPick = 1;
    if (showOnlyPremiere) {
        indexToPick = 0;
    } else if (!showOnlyPremiere && !showPremiere) {
        indexToPick = 2;
    }

    let premiereGroup = document.querySelectorAll(`input[name="${CRRS_FILTER_MENU_PERMIERE_RADIO_GROUP_NAME}"]`);
    for (const [i, elem] of premiereGroup.entries()) {
        if (i == indexToPick) {
            elem.checked = true;
            break;
        }
    }
    crrsFilter.restore(savedFilter);

    lockFilters(true);
}