import "./vendors/browser-polyfill.min.js";
import _ from "./vendors/caldom.min.mjs.js"
// import './vendors/petite-vue.iife.js'

let INTERVAL_ID;
let MENU_HTML;



const handleCheckbox = (event) => {
    console.log("in options");
    console.log(event);
}


const renderQuickPickOptions = () => {
    const languages = ["English", "Spanish", "Portuguese", "French", "German", "Arabic", "Italian", "Russian"];

    for (let language of languages) {
        let customCheckbox = _("+cr-checkbox")
            .attr("data-group", "quick-pick-cbs").attr("data-text", language).data("data-handler", handleCheckbox).on("check", handleCheckbox);
        _("#quick-select-options", customCheckbox);
    }
    const availableLanguages = document.getElementById('available-languages');
    languages.forEach(language => {
        const option = document.createElement('li');
        option.textContent = language;
        availableLanguages.appendChild(option);
    });
}

// Saves options to browser.storage
const save_options = () => {
    let showFilter = document.getElementById('show-filter-input').checked;
    let reflowHCount = document.getElementById('reflow-hcount-input').checked;
    let showHCount = document.getElementById('show-hcount-input').checked;
    browser.storage.sync.set({
        showFilter: showFilter,
        reflowHCount: reflowHCount,
        showHCount: showHCount,
    }).then(() => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
        setUISateOfMenu(showFilter, true);
        setUIStateOfHiddenCount(reflowHCount, showHCount);
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
    }).then((items) => {
        document.getElementById('show-filter-input').checked = items.showFilter;
        document.getElementById('reflow-hcount-input').checked = items.reflowHCount;
        document.getElementById('show-hcount-input').checked = items.showHCount;
        setUISateOfMenu(items.showFilter, items.filter != null);
        setUIStateOfHiddenCount(items.reflowHCount, items.showHCount);
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
    renderQuickPickOptions();
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

// Add an option from the "Available Languages" combo box to the "Shown Languages" combo box
addButton.addEventListener('click', () => {
    const selectedLanguages = shownLanguages.querySelectorAll('.selected').length;
    const totalLanguages = shownLanguages.querySelectorAll('li').length;
    if (selectedLanguages + totalLanguages > 4) {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'You can only add up to 5 languages.';
        errorMessage.classList.add('error-message');
        buttons.appendChild(errorMessage);
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    } else {
        const selectedOptions = availableLanguages.querySelectorAll('.selected');
        selectedOptions.forEach(option => {
            shownLanguages.appendChild(option);
            option.classList.remove('selected');
        })
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

/** Add logic for the other option in the "Shown Languages" combo box */
const othersOption = document.createElement('li');
othersOption.textContent = 'Others';
othersOption.classList.add('others');
shownLanguages.appendChild(othersOption);

const othersExplanation = document.createElement('p');
othersExplanation.textContent = 'The "Others" option refers to all the languages in "Available Languages" that are not in "Shown Languages".';
othersExplanation.classList.add('others-explanation');

document.body.appendChild(othersExplanation);

addButton.addEventListener('click', updateOthersExplanation);
removeButton.addEventListener('click', updateOthersExplanation);

function updateOthersExplanation() {
    const shownLanguageOptions = shownLanguages.querySelectorAll('li:not(.others)');
    const availableLanguageOptions = availableLanguages.querySelectorAll('li');
    const shownLanguageValues = Array.from(shownLanguageOptions).map((option) => option.textContent);
    const availableLanguageValues = Array.from(availableLanguageOptions).map((option) => option.textContent);
    const otherLanguageValues = availableLanguageValues.filter((value) => !shownLanguageValues.includes(value));
    if (otherLanguageValues.length === 0) {
        othersExplanation.textContent = 'The "Others" option does not refer to any languages.';
    } else if (otherLanguageValues.length === 1) {
        othersExplanation.textContent = `The "Others" option refers to the ${otherLanguageValues[0]} language.`;
    } else {
        const otherLanguageValuesString = otherLanguageValues.slice(0, -1).join(', ') + ' and ' + otherLanguageValues[otherLanguageValues.length - 1];
        othersExplanation.textContent = `The "Others" option refers to the ${otherLanguageValuesString} languages.`;
    }
}