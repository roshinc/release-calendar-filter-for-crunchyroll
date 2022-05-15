/*
 * All JS in this file will be run on any pages that match the pattern defined in manifest.
 */

window.onload = function () {
  //createInlineMenu(document.querySelector("header.simulcast-calendar-header"));
  let week = new Week(document.querySelectorAll(".day"));
  // global filter holder
  crrsFilter = new Filter(week);
  restoreFilter(restoreFilterAndUI);
}

