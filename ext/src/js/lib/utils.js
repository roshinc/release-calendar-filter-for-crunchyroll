import preference from "../classes/pref";

import { CRRS_HIDDEN_COUNT_CLASS_NAME } from "./constants";

export const reflowHiddenCount = () => {

    if (preference.reflowEnabled != undefined && preference.reflowEnabled != true)
        return;

    let hiddenCounts = document.querySelectorAll(`.${CRRS_HIDDEN_COUNT_CLASS_NAME}`);

    hiddenCounts.forEach(element => {
        element.classList.remove("changed");
        void element.offsetHeight;
    });
};