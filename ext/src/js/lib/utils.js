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

/**
 * Function to get the popover ID from the release article dataset
 * @param releaseArticleDataset a dataset object from a release article that may contain a popoverUrl
 * @returns {string|null} The popover ID if available, otherwise null
 */
export const getPopoverID = (releaseArticleDataset) => {
    const popoverUrl = releaseArticleDataset.popoverUrl;
    if (popoverUrl) {
        // get the last part of the url
        return popoverUrl.split("/").pop();
    }
    return null;
}