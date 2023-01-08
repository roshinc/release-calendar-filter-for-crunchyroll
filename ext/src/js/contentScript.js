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
    .then((items) => {
      if (items.showFilter) {
        console.log(items.savedShownLanguages);
        console.log(items);
        createInlineMenu(document.querySelector("header.simulcast-calendar-header"), items.savedShownLanguages);
      }

      // if reflow is enabbled or not
      preference.reflowEnabled = items.reflowHCount;

      // parse week
      let week = new Week(document.querySelectorAll(".day"), items.showHCount);

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

    });

}

