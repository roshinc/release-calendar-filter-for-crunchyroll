import "./vendors/browser-polyfill.min.js";
import _ from "./vendors/caldom.min.mjs.js"
// import './vendors/petite-vue.iife.js'

let INTERVAL_ID;
let MENU_HTML;



const handleCheckbox = (event) => {
    console.log("in options");
    console.log(event);
}


const renderQuickPickOptions = (savedShownLanguages) => {
    const allLanguages = ["Arabic", "Castilian", "English", "English-IN", "French", "German", "Hindi", "Italian", "Portuguese", "Russian", "Spanish"];

    //create a default list of languages to show that is English, Spanish, French, German, and Italian
    const defaultShownLanguages = ["English", "Spanish", "French", "German", "Italian"];

    // default selected languages to the defaultShownLanguages
    const shownLanguagesList = savedShownLanguages.length == 0 ? defaultShownLanguages : savedShownLanguages;

    // remaining languages are the ones that are not in languages
    const availableLanguagesList = allLanguages.filter(language => !shownLanguagesList.includes(language));

    // Clear the shown languages checkboxes
    _("#quick-pick-dubs-checkboxes").html("");
    // Create the shown languages checkboxes
    for (let language of shownLanguagesList) {
        let customCheckbox = _("+cr-checkbox")
            .attr("data-group", "quick-pick-cbs").attr("data-text", language).attr("checked", true).attr("disabled", "true").data("data-handler", handleCheckbox).on("check", handleCheckbox);
        _("#quick-pick-dubs-checkboxes", customCheckbox);
    }

    // Create the checkbox for the "Others" option
    let othersCustomCheckbox = _("+cr-checkbox").attr("data-group", "quick-pick-cbs").attr("data-text", "Others").attr("disabled", "true").attr("checked", false).data("data-handler", handleCheckbox).on("check", handleCheckbox);
    _("#quick-pick-dubs-checkboxes", othersCustomCheckbox);

    // Create the remaining languages options
    const availableLanguagesElem = document.getElementById('available-languages');
    // Clear the available languages options
    availableLanguagesElem.innerHTML = "";
    // Add the remaining languages options
    availableLanguagesList.forEach(language => {
        const option = document.createElement('li');
        option.textContent = language;
        availableLanguagesElem.appendChild(option);
    });
    // Create the shown languages options
    const shownLanguagesElem = document.getElementById('shown-languages');
    // Clear the shown languages options
    shownLanguagesElem.innerHTML = "";
    // Add the shown languages options
    shownLanguagesList.forEach(language => {
        const option = document.createElement('li');
        option.textContent = language;
        shownLanguagesElem.appendChild(option);
    });
    /** Add logic for the other option in the "Shown Languages" combo box */
    const othersOption = document.createElement('li');
    othersOption.textContent = 'Others*';
    othersOption.id = 'others-option';
    othersOption.classList.add('others');
    shownLanguagesElem.appendChild(othersOption);
}

// Saves options to browser.storage
const save_options = () => {
    let showFilter = document.getElementById('show-filter-input').checked;
    let reflowHCount = document.getElementById('reflow-hcount-input').checked;
    let showHCount = document.getElementById('show-hcount-input').checked;
    //Get a list of the shown languages
    const shownLanguagesElem = document.getElementById('shown-languages');
    const shownLanguagesList = shownLanguagesElem.querySelectorAll('li:not(.others)');
    const shownLanguagesArray = [];
    shownLanguagesList.forEach(language => {
        shownLanguagesArray.push(language.textContent);
    });
    browser.storage.sync.set({
        showFilter: showFilter,
        reflowHCount: reflowHCount,
        showHCount: showHCount,
        savedShownLanguages: shownLanguagesArray,
    }).then(() => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
        setUISateOfMenu(showFilter, true);
        setUIStateOfHiddenCount(reflowHCount, showHCount);
        renderQuickPickOptions(shownLanguagesArray);
    });
}

// Restores select box and checkbox state using the preferences
// stored in browser.storage.
const restore_options = () => {

    browser.storage.sync.get({
        showFilter: true,
        reflowHCount: true,
        showHCount: true,
        filter: null,
        savedShownLanguages: [],
    }).then((items) => {
        document.getElementById('show-filter-input').checked = items.showFilter;
        document.getElementById('reflow-hcount-input').checked = items.reflowHCount;
        document.getElementById('show-hcount-input').checked = items.showHCount;
        setUISateOfMenu(items.showFilter, items.filter != null);
        setUIStateOfHiddenCount(items.reflowHCount, items.showHCount);
        renderQuickPickOptions(items.savedShownLanguages);
        setUIStateOfQuickPickOptions(items.filter != null);
    });
}


const restore_defaults = () => {
    document.getElementById('show-filter-input').checked = true;
    document.getElementById('reflow-hcount-input').checked = true;
    document.getElementById('show-hcount-input').checked = true;
    renderQuickPickOptions([]);
    save_options();
}

document.addEventListener('DOMContentLoaded', () => {
    restore_options();
});

const setUIStateOfQuickPickOptions = (isMenuLocked) => {
    if (isMenuLocked) {
        // Disable the available languages options
        const availableLanguagesElem = document.getElementById('available-languages');
        availableLanguagesElem.querySelectorAll('li').forEach(language => {
            //add disabled attribute
            language.setAttribute('disabled', true);
        });
        // Disable the shown languages options
        const shownLanguagesElem = document.getElementById('shown-languages');
        shownLanguagesElem.querySelectorAll('li').forEach(language => {
            //add disabled attribute
            language.setAttribute('disabled', true);
        });
        // Disable the add button
        document.getElementById('add-language').setAttribute('disabled', true);
        // Disable the remove button
        document.getElementById('remove-language').setAttribute('disabled', true);

        //Add the note about the locked filter
        document.getElementById('lang-select-note').textContent = "Your filter is locked, to change the languages return here after you go to the Release Calendar and unlock the filter. ";

    }
}

document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('resore-defaults').addEventListener('click',
    restore_defaults);

document.getElementById('show-hcount-input').addEventListener('click', (event) => {
    document.getElementById('reflow-hcount-input').checked = event.target.checked;
});

document.getElementById('reflow-hcount-input').addEventListener('click', (event) => {
    if (event.target.checked) {
        document.getElementById('show-hcount-input').checked = event.target.checked;
    }
});



const setUISateOfMenu = (show, hideable) => {
    if (show) {
        showMenu(hideable);
    } else {
        hideMenu();
    }
}

const hideMenu = () => {
    const menu = document.getElementById('cr-rs-filter-menu');
    MENU_HTML = menu.innerHTML;
    menu.textContent = 'Element Hidden';
}

const showMenu = (hideable) => {
    if (!hideable) {
        document.getElementById('show-filter-input').disabled = true;
        document.getElementById('show-filter-note').textContent = "Your filter is unlocked, hiding the filter without locking the filter would be equivalent to disabling this extension. In order to filter and hide the UI return here after you go to the Release Calendar and lock the filter you want. ";
    }
    if (MENU_HTML != undefined) {
        document.getElementById('cr-rs-filter-menu').innerHTML = MENU_HTML;
        MENU_HTML = undefined;
    }
}


const setUIStateOfHiddenCount = (reflowEnabled, showHCount) => {
    if (reflowEnabled && showHCount) {
        showHiddenCount();
        clearInterval(INTERVAL_ID);
        INTERVAL_ID = setInterval(changeHiddenValueWithReflow, 4000);
    } else if (showHCount) {
        showHiddenCount();
        clearInterval(INTERVAL_ID);
        INTERVAL_ID = setInterval(changeHiddenValueWithoutReflow, 4000);
    } else {
        clearInterval(INTERVAL_ID);
        hideHiddenCount();
    }
};






const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const changeHiddenValueWithoutReflow = () => {
    //console.log("Hello H")
    let hiddenCounts = document.querySelectorAll(`.cr-rs-filter-hidden-count`);

    hiddenCounts.forEach(element => {
        const chance = getRandomInt(0, 10);
        if (chance % 2 == 0) {
            element.textContent = chance + " Hidden"
        }
    });
};

const changeHiddenValueWithReflow = () => {
    //console.log("Hello H")
    let hiddenCounts = document.querySelectorAll(`.cr-rs-filter-hidden-count`);

    hiddenCounts.forEach(element => {
        const chance = getRandomInt(0, 10);
        if (chance % 2 == 0) {
            element.classList.remove("changed");
            void element.offsetHeight;
            element.textContent = chance + " Hidden"

            element.classList.add("changed");
        }
    });
};

const hideHiddenCount = () => {
    let hiddenCounts = document.querySelectorAll(`.cr-rs-filter-hidden-count`);

    hiddenCounts.forEach(element => {
        element.classList.add("cr-rs-hide");
    });
};

const showHiddenCount = () => {
    let hiddenCounts = document.querySelectorAll(`.cr-rs-filter-hidden-count`);

    hiddenCounts.forEach(element => {
        element.classList.remove("cr-rs-hide");
    });
};