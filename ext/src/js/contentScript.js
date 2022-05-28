/*
 * All JS in this file will be run on any pages that match the pattern defined in manifest.
 */

import preference from "./classes/pref";
import Week from "./classes/week";
import Filter from "./classes/filter";
import { createInlineMenu } from "./lib/ui_modifier";
import { restorePreference } from "./lib/data_store";
import { restoreFilterAndUI } from "./lib/event_handler"

window.onload = function () {

  // restore and apply filter and other preference
  restorePreference()
    .then((items) => {
      if (items.showFilter) {
        createInlineMenu(document.querySelector("header.simulcast-calendar-header"));
      }

      // if reflow is enabbled or not
      preference.reflowEnabled = items.reflowHCount;

      // parse week
      let week = new Week(document.querySelectorAll(".day"), items.showHCount);

      // global filter holder
      preference.crrsFilter = new Filter(week);

      // restore filter
      restoreFilterAndUI(items.filter, items.showFilter);

    });

}

