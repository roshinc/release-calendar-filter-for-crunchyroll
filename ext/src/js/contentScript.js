/*
 * All JS in this file will be run on any pages that match the pattern defined in manifest.
 */

import preference from "./classes/pref";
import Week from "./classes/week";
import Filter from "./classes/filter";
import { createInlineMenu } from "./lib/ui_modifier";
import { restoreFilter } from "./lib/data_store";
import { restoreFilterAndUI } from "./lib/event_handler"

window.onload = function () {
  // Use default values
  chrome.storage.sync.get({
    showFilter: true,
    reflowHCount: true,
    showHCount: true,
  }, function (items) {
    if (items.showFilter) {
      createInlineMenu(document.querySelector("header.simulcast-calendar-header"));
    }
    preference.reflowEnabled = items.reflowHCount;
    let week = new Week(document.querySelectorAll(".day"), items.showHCount);

    // global filter holder
    preference.crrsFilter = new Filter(week);
    restoreFilter(restoreFilterAndUI, items.showFilter);

  });
}

