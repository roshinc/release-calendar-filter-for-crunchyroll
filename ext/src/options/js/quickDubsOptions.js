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
        // If the element does not have the attribute disabled, toggle the "selected" class
        if (!selectedOption.hasAttribute('disabled')) {
            selectedOption.classList.toggle('selected');
        }
    }
});
shownLanguages.addEventListener('click', event => {
    if (event.target.tagName === 'LI') {
        const selectedOption = event.target;
        // If the element does not have the attribute disabled, toggle the "selected" class
        if (!selectedOption.hasAttribute('disabled')) {
            selectedOption.classList.toggle('selected');
        }
    }
});

// Get the "Add" and "Remove" buttons
const addButton = document.getElementById('add-language');
const removeButton = document.getElementById('remove-language');

//Get the note div
const note = document.getElementById('lang-select-note');

// Make sure the "Others" option is the last option in the "Shown Languages" combo box
const updateOthersOption = (othersElem) => {
    const shownLanguagesElem = document.getElementById('shown-languages');
    // Check if the "Others" option is already the last child of "Shown Languages"
    if (shownLanguagesElem.lastChild !== othersElem) {
        shownLanguagesElem.appendChild(othersElem);
    }
};

const sortLanguages = (languages) => {
    console.log(languages);
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
        shownLanguages.appendChild(language);
    });
};

// Add an option from the "Available Languages" combo box to the "Shown Languages" combo box
addButton.addEventListener('click', () => {
    const selectedLanguages = shownLanguages.querySelectorAll('.selected').length;
    const totalLanguages = shownLanguages.querySelectorAll('li').length;
    if (selectedLanguages + totalLanguages > 5) {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'You can only add up to 5 languages. To add something else, remove some first.';
        errorMessage.classList.add('error-message');
        note.appendChild(errorMessage);
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    } else {
        const selectedOptions = availableLanguages.querySelectorAll('.selected');
        selectedOptions.forEach(option => {
            // Check if the option is not disabled
            if (!option.classList.contains('disabled')) {
                shownLanguages.appendChild(option);
                option.classList.remove('selected');

                // Get a list of all the "li" elements in "Shown Languages", except for the "Others" option
                const languages = shownLanguages.querySelectorAll('li:not(.other)');
                // Sort the languages alphabetically
                sortLanguages(Array.from(languages));

                // Make sure the "Others" option is always the last option in the "Shown Languages" combo box
                const othersElem = document.getElementById('others-option');
                updateOthersOption(othersElem);
            }
        });

    }

    // Disable the "Add" button if no options are selected in the "Available Languages" combo box
    addButton.disabled = !availableLanguages.querySelector('.selected');
});

// Remove an option from the "Shown Languages" combo box
removeButton.addEventListener('click', () => {
    const selectedOptions = shownLanguages.querySelectorAll('.selected');
    const numOptions = shownLanguages.querySelectorAll('li').length;
    if (numOptions - selectedOptions.length < 3) {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'There must be at least 2 languages in the "Shown Languages" box';
        errorMessage.classList.add('error-message');
        note.appendChild(errorMessage);
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    } else {
        selectedOptions.forEach(option => {
            // Check if the option is not disabled
            if (!option.classList.contains('disabled')) {
                availableLanguages.appendChild(option);
                option.classList.remove('selected');

                // Get a list of all the "li" elements in "Shown Languages", except for the "Others" option
                const languages = availableLanguages.querySelectorAll('li:not(.other)');
                // Sort the languages alphabetically
                sortLanguages(languages);
            }
        });
    }
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


