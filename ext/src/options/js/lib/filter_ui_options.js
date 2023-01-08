

let MENU_HTML;

/**
 * 
 * @param {boolean} show whether to show or hide the menu
 * @param {*} hideable whether the menu is locked or not
 */
export const setUISateOfMenu = (show, hideable) => {
    if (show) {
        showMenu(hideable);
    } else {
        hideMenu();
    }
}

/**
 * Hides the filter ui element
 */
const hideMenu = () => {
    const menu = document.getElementById('cr-rs-filter-menu');
    MENU_HTML = menu.innerHTML;
    menu.textContent = 'Element Hidden';
}

/**
 * Restores the filter ui element
 * 
 * @param {boolean} hideable Whether the menu is locked or not
 */
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


/**
 * Restores the default values for the filter ui options
 */
export const restoreDefaultsForFilterUI = () => {
    document.getElementById('show-filter-input').checked = true;
};