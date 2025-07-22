/*
 * All JS in this file will be run on any pages that match the pattern defined in manifest.
 */

import preference from "./classes/pref";
import Week from "./classes/week";
import Filter from "./classes/filter";
import { createInlineMenu, lockFilters, restoreUI } from "./lib/ui_modifier";
import { restorePreference } from "./lib/data_store";
import { reflowHiddenCount } from "./lib/utils";

window.onload = function () {

  // restore and apply filter and other preference
  restorePreference()
    .then(processRestoredPreference);

};

/**
 * Function to process the restored preferences
 * @param {Object} items - The restored preferences from storage
 */
const processRestoredPreference = (items) => {
  if (items.showFilter) {
    createInlineMenu(document.querySelector("header.simulcast-calendar-header"), items.savedShownLanguages);
  };

  processWeek(items);
};

/**
 * Function to process the week
 * @param {Object} items - The restored preferences from storage
 */
const processWeek = (items) => {
  // parse week synchronously
  const week = parseWeek(document.querySelectorAll(".day"), items.showHCount);

  // if reflow is enabled or not
  preference.reflowEnabled = items.reflowHCount;

  // get saved show languages for dubs
  preference.savedLanguages = items.savedShownLanguages;

  // global filter holder
  preference.crrsFilter = new Filter(week, preference.savedLanguages);

  // restore filter
  if (items.filter != null) {
    if (items.filter != preference.crrsFilter.createJson()) {
      reflowHiddenCount();
      // modify ui only if the filter is shown
      if (items.showFilter) {
        restoreUI(items.filter);
      }
      preference.crrsFilter.restore(items.filter);
    }
    // if the filter is not null, the ui should show as locked
    lockFilters(true);
  }
}


/**
 * Function to parse the week from the day elements
 * @param {NodeList} dayElements - The elements representing the days of the week
 * @param {boolean} showHCount - Flag to indicate whether to show hidden count
 * @return {Week} - Returns a Week object
 */
const parseWeek = (dayElements, showHCount) => {
  // Synchronous execution for now
  return new Week(dayElements, showHCount);
};

