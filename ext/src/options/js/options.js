import "./vendors/browser-polyfill.min.js";
import _ from "./vendors/caldom.min.mjs.js"
// import './vendors/petite-vue.iife.js'

let INTERVAL_ID;
let MENU_HTML;

function CRCheckbox(props) {
    return {
        $template: '#cr-checkbox-template',
        count: props.initialCount,
        inc() {
            this.count++
        }
    }
}


const renderQuickPickOptions = () => {
    PetiteVue.createApp({
        dubsLangListInternal: ["english", "spanish", "portuguese", "french", "german", "arabic", "italian", "russian"],
        CRCheckbox
    }).mount('#quick-select-options')
};

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