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
        console.log("TODO: unlock filters");
        lock.data("isLocked", "false");
        icon.html('&#xe803;').removeClass("locked").addClass("unlocked");
    } else {
        //lock
        console.log("TODO: lock filters");
        lock.data("isLocked", "true");
        icon.html('&#xe802;').removeClass("unlocked").addClass("locked");
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

    let queueGroup = _(`input[name="${CRRS_FILTER_MENU_QUEUE_RADIO_GROUP_NAME}"]`);
    queueGroup.each((elem, i) => {
        if (i == 1) {
            elem.checked = true;
        }
    });

    let premiereGroup = _(`input[name="${CRRS_FILTER_MENU_PERMIERE_RADIO_GROUP_NAME}"]`);
    premiereGroup.each((elem, i) => {
        if (i == 1) {
            elem.checked = true;
        }
    });
    crrsFilter.reset()

}