/**
 * @fileoverview This file contains the functions that are used to initialize the event listeners for the "Quick Dubs" options page.
 */

import {
    ALL_DUB_LANGUAGES, DEFAULT_DUB_LANGUAGES,
} from "../../../js/lib/constants";

const AVAILABLE_LANGUAGES_COMBO_ID = 'available-languages';
const SHOWN_LANGUAGES_COMBO_ID = 'shown-languages';

const ADD_BUTTON_ID = 'add-language';
const REMOVE_BUTTON_ID = 'remove-language';


/**
 * Initializes the event listeners for the "Quick Dubs" options section.
 */
export const initializeEventListenersForQuickDubs = () => {
    // Get the "Available Languages" and "Shown Languages" combo boxes
    const availableLanguages = document.getElementById(AVAILABLE_LANGUAGES_COMBO_ID);
    const isAvailableLanguagesDisabled = availableLanguages.hasAttribute('disabled');

    const shownLanguages = document.getElementById(SHOWN_LANGUAGES_COMBO_ID);
    const isShownLanguagesDisabled = shownLanguages.hasAttribute('disabled');

    // Get the "Add" and "Remove" buttons
    const addButton = document.getElementById(ADD_BUTTON_ID);
    const removeButton = document.getElementById(REMOVE_BUTTON_ID);

    // Get the note div
    const note = document.getElementById('lang-select-note');

    /*Listeners for the avalible languages box */
    initializeComboBoxes(availableLanguages, isAvailableLanguagesDisabled, shownLanguages, addButton, removeButton);

    /*Listeners for the shown languages box */
    initializeComboBoxes(shownLanguages, isShownLanguagesDisabled, availableLanguages, removeButton, addButton);

    // Add an option from the "Available Languages" combo box to the "Shown Languages" combo box
    addButton.addEventListener('click', () => {
        const selectedLanguages = shownLanguages.querySelectorAll('.selected').length;
        const totalLanguages = shownLanguages.querySelectorAll('li').length;
        if (selectedLanguages + totalLanguages > 4) {
            const errorMessage = 'You can only add up to 4 languages. To add something else, remove some first.';
            addNoteWithTimeout(note, errorMessage, 5000);
        } else {
            const selectedOptions = availableLanguages.querySelectorAll('.selected');
            selectedOptions.forEach(option => {
                // Check if the option is not disabled
                if (!option.classList.contains('disabled')) {
                    // Move the option to the "Shown Languages" combo box
                    // and remove the "selected" class from the option
                    shownLanguages.appendChild(option);
                    option.classList.remove('selected');

                    // Get a list of all the "li" elements in "Shown Languages", except for the "Others" option
                    const languages = shownLanguages.querySelectorAll('li:not(.other)');
                    // Sort the languages alphabetically
                    sortLanguagesListItems(Array.from(languages), shownLanguages);

                    // Make sure the "Others" option is always the last option in the "Shown Languages" combo box
                    const othersElem = document.getElementById('others-option');
                    maintainTheOtherElemLocation(othersElem, shownLanguages);
                }
            });

        }

        // Disable the "Add" button if no options are selected in the "Available Languages" combo box
        addButton.disabled = !availableLanguages.querySelector('.selected');

        // Update the "Others" option explanation
        updateOthersExplanation(shownLanguages, availableLanguages);
    });
    // Disable the "Add" button if no options are selected in the "Available Languages" combo box
    addButton.disabled = !availableLanguages.querySelector('.selected');

    // Remove an option from the "Shown Languages" combo box
    removeButton.addEventListener('click', () => {
        const selectedOptions = shownLanguages.querySelectorAll('.selected');
        const numOptions = shownLanguages.querySelectorAll('li').length;
        if (numOptions - selectedOptions.length < 3) {
            const errorMessage = 'There must be at least 2 languages in the "Shown Languages" box';
            addNoteWithTimeout(note, errorMessage, 5000);
        } else {
            selectedOptions.forEach(option => {
                // Check if the option is not disabled
                if (!option.classList.contains('disabled')) {
                    availableLanguages.appendChild(option);
                    option.classList.remove('selected');

                    // Get a list of all the "li" elements in "Shown Languages", except for the "Others" option
                    const languages = availableLanguages.querySelectorAll('li:not(.other)');
                    // Sort the languages alphabetically
                    sortLanguagesListItems(Array.from(languages), availableLanguages);
                }
            });
        }
        // Disable the "Remove" button if no options are selected in the "Shown Languages" combo box
        removeButton.disabled = !shownLanguages.querySelector('.selected');

        // Update the "Others" option explanation
        updateOthersExplanation(shownLanguages, availableLanguages);
    });

    // Disable the "Remove" button if no options are selected in the "Shown Languages" combo box
    removeButton.disabled = !shownLanguages.querySelector('.selected');
};

/**
 * Enables the buttonToEnable and disables the buttonToDisable, and deselects all options in the comboToDeselect.
 * 
 * @param {HTMLButtonElement} buttonToEnable 
 * @param {HTMLButtonElement} buttonToDisable 
 * @param {HTMLUListElement} comboToDeselect 
 */
const enableSelectionForCombo = (buttonToEnable, buttonToDisable, comboToDeselect) => {
    buttonToEnable.disabled = false;
    buttonToDisable.disabled = true;
    comboToDeselect.querySelectorAll('.selected').forEach(option => {
        option.classList.remove('selected');
    });
};

/**
 * Toggles the "selected" class for the list item that was clicked.
 * 
 * @param {Event} clickEvent 
 */
const toggleSelectionForListItems = (clickEvent) => {
    if (clickEvent.target.tagName === 'LI') {
        const selectedOption = clickEvent.target;
        // If the element does not have the attribute disabled, toggle the "selected" class
        if (!selectedOption.hasAttribute('disabled')) {
            selectedOption.classList.toggle('selected');
        }
    }
};

/**
 * Sets up the event listeners for a combo box.
 * @param {HTMLUListElement} comoboxElement 
 * @param {boolean} isDisabled 
 * @param {HTMLUListElement} unakinComboBox 
 * @param {HTMLButtonElement} akinButton 
 * @param {HTMLButtonElement} unakinButton 
 */
const initializeComboBoxes = (comoboxElement, isDisabled, unakinComboBox, akinButton, unakinButton) => {
    // Add a click event listener to the options in the combo box
    comoboxElement.addEventListener('click', event => {
        // Toggle the "selected" class on the options in the "comoboxElement" combo box
        toggleSelectionForListItems(event);
        // Enable the "akinButton" button when the "comoboxElement" combo box has an item is selected in it
        // disable the "unakinButton" button
        // and remove the "selected" class from the options in the "unakinComboBox" combo box
        if (!(isDisabled || comoboxElement.hasAttribute('disabled'))) {
            enableSelectionForCombo(akinButton, unakinButton, unakinComboBox);
        }
    });
    // Enable the "akinButton" button when the "comoboxElement" combo box is focused,
    // disable the "unakinButton" button
    // and remove the "selected" class from the options in the "unakinComboBox" combo box
    comoboxElement.addEventListener('focus', () => {
        if (!(isDisabled || comoboxElement.hasAttribute('disabled'))) {
            enableSelectionForCombo(akinButton, unakinButton, unakinComboBox);
        }
    });
};

/**
 * Adds a note to the note div with a timeout.
 * 
 * @param {HTMLElement} note 
 * @param {string} message 
 * @param {number} timeout 
 */
const addNoteWithTimeout = (note, message, timeout) => {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.classList.add('error-message');
    note.appendChild(errorMessage);
    setTimeout(() => {
        errorMessage.remove();
    }, timeout);
};

/**
 * Sorts the given languages list items alphabetically.
 * @param {Array} languages 
 */
const sortLanguagesListItems = (languages, shownLanguagesElem) => {
    languages.sort((a, b) => {
        const languageA = a.textContent.toLowerCase();
        const languageB = b.textContent.toLowerCase();
        if (languageA < languageB) {
            return -1;
        }
        if (languageA > languageB) {
            return 1;
        }
        return 0;
    });
    languages.forEach((language) => {
        shownLanguagesElem.appendChild(language);
    });
};

/**
 * Makes sure the "Others" option is the last option in the "Shown Languages" combo box.
 * @param {HTMLElement} othersElem 
 * @param {HTMLElement} shownLanguagesElem
 */
const maintainTheOtherElemLocation = (othersElem, shownLanguagesElem) => {
    // Check if the "Others" option is already the last child of "Shown Languages"
    if (shownLanguagesElem.lastChild !== othersElem) {
        shownLanguagesElem.appendChild(othersElem);
    }
};

/**
 * Updates the "Others" explanation text.
 * 
 * @param {HTMLElement} shownLanguages 
 * @param {HTMLElement} availableLanguages 
 */
const updateOthersExplanation = (shownLanguages, availableLanguages) => {
    const shownLanguageOptions = shownLanguages.querySelectorAll('li:not(.others)');
    const availableLanguageOptions = availableLanguages.querySelectorAll('li');
    const shownLanguageValues = Array.from(shownLanguageOptions).map((option) => option.textContent);
    const availableLanguageValues = Array.from(availableLanguageOptions).map((option) => option.textContent);
    const otherLanguageValues = availableLanguageValues.filter((value) => !shownLanguageValues.includes(value));
    const othersExplanation = document.getElementById("others-explanation");

    othersExplanation.textContent = '*The "Others" option refers to all the languages in "Available Languages" that are not in "Shown Languages".';
    othersExplanation.classList.add('others-explanation');

    if (otherLanguageValues.length === 0) {
        othersExplanation.textContent = '*The "Others" option does not refer to any languages.';
    } else if (otherLanguageValues.length === 1) {
        othersExplanation.textContent = `*The "Others" option refers to the ${otherLanguageValues[0]} language.`;
    } else {
        const otherLanguageValuesString = otherLanguageValues.slice(0, -1).join(', ') + ' and ' + otherLanguageValues[otherLanguageValues.length - 1];
        othersExplanation.textContent = `*The "Others" option refers to the ${otherLanguageValuesString} languages.`;
    }
}

/**
 * Renders the quick pick options for the "Shown Languages" and "Available Languages" combo boxes and in the filter UI.
 * 
 * @param {Array} savedShownLanguages 
 */
export const renderQuickPickOptions = (savedShownLanguages) => {
    const allLanguages = ALL_DUB_LANGUAGES;
    //create a default list of languages to show that is English, Spanish, French, German, and Italian
    const defaultShownLanguages = DEFAULT_DUB_LANGUAGES;

    // default selected languages to the defaultShownLanguages
    const shownLanguagesList = savedShownLanguages.length == 0 ? defaultShownLanguages : savedShownLanguages;

    // remaining languages are the ones that are not in languages
    const availableLanguagesList = allLanguages.filter(language => !shownLanguagesList.includes(language));

    // Create the checkbox in the filter UI
    renderCheckboxesInFilterUI(shownLanguagesList);


    // Create the available languages options
    const availableLanguagesElem = document.getElementById(AVAILABLE_LANGUAGES_COMBO_ID);
    // Clear the available languages options
    availableLanguagesElem.innerHTML = "";
    addOptionstoComboBox(availableLanguagesElem, availableLanguagesList);

    // Create the shown languages options
    const shownLanguagesElem = document.getElementById(SHOWN_LANGUAGES_COMBO_ID);
    // Clear the shown languages options
    shownLanguagesElem.innerHTML = "";
    // Add the shown languages options
    addOptionstoComboBox(shownLanguagesElem, shownLanguagesList);

    /** Add logic for the other option in the "Shown Languages" combo box */
    const othersOption = document.createElement('li');
    othersOption.textContent = 'Others*';
    othersOption.id = 'others-option';
    othersOption.classList.add('others');
    shownLanguagesElem.appendChild(othersOption);
};

/**
 * Renders the checkboxes in the filter UI.
 * @param {Array} shownLanguagesList 
 */
const renderCheckboxesInFilterUI = (shownLanguagesList) => {
    const targetElem = _("#quick-pick-dubs-checkboxes");
    // if the fiter UI is not rendered, return
    if (targetElem.elem == undefined) {
        return;
    }
    // Clear the shown languages checkboxes
    targetElem.html("");
    // Create the shown languages checkboxes
    for (let language of shownLanguagesList) {
        let customCheckbox = _("+cr-checkbox")
            .attr("data-group", "quick-pick-cbs").attr("data-text", language).attr("checked", true).attr("disabled", "true").data("data-handler", handleCheckboxInFilterUI).on("check", handleCheckboxInFilterUI);
        _("#quick-pick-dubs-checkboxes", customCheckbox);
    }

    // Create the checkbox for the "Others" option
    let othersCustomCheckbox = _("+cr-checkbox").attr("data-group", "quick-pick-cbs").attr("data-text", "Others").attr("disabled", "true").attr("checked", false).data("data-handler", handleCheckboxInFilterUI).on("check", handleCheckboxInFilterUI);
    _("#quick-pick-dubs-checkboxes", othersCustomCheckbox);
};

/**
 * Adds the given array of options to the given combo box.
 * 
 * @param {HTMLUListElement} comboBox 
 * @param {Array} options 
 */
const addOptionstoComboBox = (comboBox, options) => {
    // Add the remaining languages options
    options.forEach(language => {
        const option = document.createElement('li');
        option.textContent = language;
        comboBox.appendChild(option);
    });
};

/**
 * Placeholder function for the checkbox in the filter UI.
 * @param {Event} event 
 */
const handleCheckboxInFilterUI = (event) => {
    console.log("in options");
    console.log(event);
}

/**
 * Disables the quick pick options when the menu is locked.
 * 
 * @param {boolean} isMenuLocked 
 */
const setUIStateOfQuickPickOptions = (isMenuLocked) => {
    if (isMenuLocked) {
        // Disable the available languages options
        const availableLanguagesElem = document.getElementById(AVAILABLE_LANGUAGES_COMBO_ID);
        availableLanguagesElem.setAttribute('disabled', true);
        availableLanguagesElem.querySelectorAll('li').forEach(language => {
            //add disabled attribute
            language.setAttribute('disabled', true);
        });

        // Disable the shown languages options
        const shownLanguagesElem = document.getElementById(SHOWN_LANGUAGES_COMBO_ID);
        shownLanguagesElem.setAttribute('disabled', true);
        shownLanguagesElem.querySelectorAll('li').forEach(language => {
            //add disabled attribute
            language.setAttribute('disabled', true);
        });

        // Disable the add button
        document.getElementById(ADD_BUTTON_ID).setAttribute('disabled', true);
        // Disable the remove button
        document.getElementById(REMOVE_BUTTON_ID).setAttribute('disabled', true);

        //Add the note about the locked filter
        document.getElementById('lang-select-note').textContent = "Your filter is locked, to change the languages return here after you go to the Release Calendar and unlock the filter. ";

    }
}

/**
 * Does the rendering of the quick pick options amd sets the UI state of the quick pick options.
 * 
 * @param {Array} shownLanguagesList The list of languages that are shown in the filter UI.
 * @param {boolean} isMenuLocked Whether the menu is locked or not.
 */
export const resoreQuickPickOptions = (shownLanguagesList, isMenuLocked) => {
    if (isMenuLocked) {
        console.log("in restore quick pick options, locked");
        shownLanguagesList = getListOfShownLanguages();
    }
    renderQuickPickOptions(shownLanguagesList);
    setUIStateOfQuickPickOptions(isMenuLocked);
};

/**
 * Gets an Array of the languages that are shown in the filter UI.
 * @returns {Array} the list of languages that are shown in the filter UI.
 */
export const getListOfShownLanguages = () => {
    const shownLanguagesElem = document.getElementById(SHOWN_LANGUAGES_COMBO_ID);
    const shownLanguagesList = [];
    shownLanguagesElem.querySelectorAll('li:not(.others)').forEach(language => {
        shownLanguagesList.push(language.textContent);
    });
    return shownLanguagesList;
}

/**
 * 
 * @returns {boolean} true if the quick pick options are disabled, false otherwise.
 */
export const isQuickDubsOptionsDisabled = () => {
    // Both combo boxes would be disabled so we can just check one
    const shownLanguagesElem = document.getElementById(SHOWN_LANGUAGES_COMBO_ID);
    return shownLanguagesElem.hasAttribute('disabled');
}