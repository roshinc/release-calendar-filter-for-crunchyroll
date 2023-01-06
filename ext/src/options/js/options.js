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
    const allLanguages = ["English", "Spanish", "Portuguese", "French", "German", "Arabic", "Italian", "Russian"];
    // default selected languages to the first 5 languages
    const shownLanguagesList = savedShownLanguages.length == 0 ? allLanguages.slice(0, 5) : savedShownLanguages;

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
    });
}

const restore_defaults = () => {
    document.getElementById('show-filter-input').checked = true;
    document.getElementById('reflow-hcount-input').checked = true;
    document.getElementById('show-hcount-input').checked = true;

    save_options();
}

document.addEventListener('DOMContentLoaded', () => {
    restore_options();
});
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


/** Add logic for the language boxes */
// Get the "Available Languages" and "Shown Languages" combo boxes
const availableLanguages = document.getElementById('available-languages');
const shownLanguages = document.getElementById('shown-languages');

console.log(availableLanguages);
console.log('shownLanguages');

// Add a click event listener to the options in both combo boxes
availableLanguages.addEventListener('click', event => {
    console.log('click');
    console.log(event.target.tagName);
    if (event.target.tagName === 'LI') {
        const selectedOption = event.target;
        selectedOption.classList.toggle('selected');
    }
});
shownLanguages.addEventListener('click', event => {
    if (event.target.tagName === 'LI') {
        const selectedOption = event.target;
        selectedOption.classList.toggle('selected');
    }
});

// Get the "Add" and "Remove" buttons
const addButton = document.getElementById('add-language');
const removeButton = document.getElementById('remove-language');

//Get the note div
const note = document.getElementById('lang-select-note');

// Add an option from the "Available Languages" combo box to the "Shown Languages" combo box
addButton.addEventListener('click', () => {
    const selectedLanguages = shownLanguages.querySelectorAll('.selected').length;
    const totalLanguages = shownLanguages.querySelectorAll('li').length;
    if (selectedLanguages + totalLanguages > 5) {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'You can only add up to 5 languages. To add more, remove some first.';
        errorMessage.classList.add('error-message');
        note.appendChild(errorMessage);
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    } else {
        const selectedOptions = availableLanguages.querySelectorAll('.selected');
        selectedOptions.forEach(option => {
            shownLanguages.appendChild(option);
            option.classList.remove('selected');
        });
    }

    // Disable the "Add" button if no options are selected in the "Available Languages" combo box
    addButton.disabled = !availableLanguages.querySelector('.selected');
});

// Remove an option from the "Shown Languages" combo box
removeButton.addEventListener('click', () => {
    const selectedOptions = shownLanguages.querySelectorAll('.selected');
    selectedOptions.forEach(option => {
        availableLanguages.appendChild(option);
        option.classList.remove('selected');
    });

    // Disable the "Remove" button if no options are selected in the "Shown Languages" combo box
    removeButton.disabled = !shownLanguages.querySelector('.selected');
});

// Disable the "Remove" button if no options are selected in the "Shown Languages" combo box
removeButton.disabled = !shownLanguages.querySelector('.selected');

// Disable the "Add" button if no options are selected in the "Available Languages" combo box
addButton.disabled = !availableLanguages.querySelector('.selected');

// Enable the "Add" button when the "Available Languages" combo box is focused or an item is selected in it
availableLanguages.addEventListener('focus', () => {
    addButton.disabled = false;
});
availableLanguages.addEventListener('click', () => {
    addButton.disabled = false;
});

// Enable the "Remove" button when the "Shown Languages" combo box is focused or an item is selected in it
shownLanguages.addEventListener('focus', () => {
    removeButton.disabled = false;
});

shownLanguages.addEventListener('click', () => {
    removeButton.disabled = false;
});

availableLanguages.addEventListener('focus', () => {
    shownLanguages.querySelectorAll('.selected').forEach(option => {
        option.classList.remove('selected');
    });
});
availableLanguages.addEventListener('click', () => {
    removeButton.disabled = true;
    shownLanguages.querySelectorAll('.selected').forEach(option => {
        option.classList.remove('selected');
    });
});

shownLanguages.addEventListener('focus', () => {
    availableLanguages.querySelectorAll('.selected').forEach(option => {
        option.classList.remove('selected');
    });
});
shownLanguages.addEventListener('click', () => {
    addButton.disabled = true;
    availableLanguages.querySelectorAll('.selected').forEach(option => {
        option.classList.remove('selected');
    });
});


// Logic for the "Others" option explanation

const othersExplanation = document.getElementById("others-explanation");
othersExplanation.textContent = '*The "Others" option refers to all the languages in "Available Languages" that are not in "Shown Languages".';
othersExplanation.classList.add('others-explanation');

addButton.addEventListener('click', updateOthersExplanation);
removeButton.addEventListener('click', updateOthersExplanation);

function updateOthersExplanation() {
    const shownLanguageOptions = shownLanguages.querySelectorAll('li:not(.others)');
    const availableLanguageOptions = availableLanguages.querySelectorAll('li');
    const shownLanguageValues = Array.from(shownLanguageOptions).map((option) => option.textContent);
    const availableLanguageValues = Array.from(availableLanguageOptions).map((option) => option.textContent);
    const otherLanguageValues = availableLanguageValues.filter((value) => !shownLanguageValues.includes(value));
    if (otherLanguageValues.length === 0) {
        othersExplanation.textContent = '*The "Others" option does not refer to any languages.';
    } else if (otherLanguageValues.length === 1) {
        othersExplanation.textContent = `*The "Others" option refers to the ${otherLanguageValues[0]} language.`;
    } else {
        const otherLanguageValuesString = otherLanguageValues.slice(0, -1).join(', ') + ' and ' + otherLanguageValues[otherLanguageValues.length - 1];
        othersExplanation.textContent = `*The "Others" option refers to the ${otherLanguageValuesString} languages.`;
    }
}