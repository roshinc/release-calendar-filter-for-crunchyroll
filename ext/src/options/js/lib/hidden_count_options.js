let INTERVAL_ID;

export const initializeHiddenCountEventHandlers = () => {
    document.getElementById('show-hcount-input').addEventListener('click', (event) => {
        document.getElementById('reflow-hcount-input').checked = event.target.checked;
    });

    document.getElementById('reflow-hcount-input').addEventListener('click', (event) => {
        if (event.target.checked) {
            document.getElementById('show-hcount-input').checked = event.target.checked;
        }
    });
}

export const setUIStateOfHiddenCount = (reflowEnabled, showHCount) => {
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

const showHiddenCount = () => {
    let hiddenCounts = document.querySelectorAll(`.cr-rs-filter-hidden-count`);

    hiddenCounts.forEach(element => {
        element.classList.remove("cr-rs-hide");
    });
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

/**
 * Get a random integer between min and max
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns {number} a random integer between min and max
 */
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Hides all the hidden count elements
 */
const hideHiddenCount = () => {
    const hiddenCounts = document.querySelectorAll(`.cr-rs-filter-hidden-count`);

    hiddenCounts.forEach(element => {
        element.classList.add("cr-rs-hide");
    });
};

/**
 * Restores the default values for the hidden count options
 */
export const restoreDefaultsForHiddenCount = () => {
    document.getElementById('reflow-hcount-input').checked = true;
    document.getElementById('show-hcount-input').checked = true;
};

