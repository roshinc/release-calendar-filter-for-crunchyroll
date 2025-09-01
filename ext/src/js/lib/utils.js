import preference from "../classes/pref";

import {CRRS_HIDDEN_COUNT_CLASS_NAME, ENGLISH_LANGUAGE_CODE} from "./constants";

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
/**
 * Detects language from Body or URL
 * @param {string} url - The current URL
 * @returns {string} Language code (defaults to "en")
 */
export const detectLanguageFromBodyOrUrl = (url) => {
    const lang = document.documentElement.lang;
    if (lang) {
        return lang;
    }
    const match = url.match(/.+crunchyroll\.com\/(.+)\/simulcastcalendar.*/);
    return match?.[1] || ENGLISH_LANGUAGE_CODE;
}

/**
 * Detects language from Body or URL and checks if the language is english
 * @param {string} url - The current URL
 * @returns {boolean} true if the language is english, false otherwise
 */
export const detectIfEnglishLanguageFromBodyOrUrl = (url) => {
    return detectLanguageFromBodyOrUrl(url) === ENGLISH_LANGUAGE_CODE;
}