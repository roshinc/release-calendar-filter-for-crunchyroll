/*
 * All JS in this file will be run on any pages that match the pattern defined in manifest.
 */

window.onload = function () {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    showFilter: true,
    reflowHCount: true,
    showHCount: true,
  }, function (items) {
    if (items.showFilter) {
      const t0 = performance.now();
      createInlineMenu(document.querySelector("header.simulcast-calendar-header"));
      const t1 = performance.now();
      console.log(`Call to createInlineMenu took ${t1 - t0} milliseconds.`);
    }
    reflowEnabled = items.reflowHCount;
    const t2 = performance.now();
    let week = new Week(document.querySelectorAll(".day"), items.showHCount);
    const t3 = performance.now();
    console.log(`Call to new Week took ${t3 - t2} milliseconds.`);

    // global filter holder
    const t4 = performance.now();
    crrsFilter = new Filter(week);
    const t5 = performance.now();
    console.log(`Call to new Filter took ${t5 - t4} milliseconds.`);

    restoreFilter(restoreFilterAndUI, items.showFilter);

  });
  // createInlineMenu(document.querySelector("header.simulcast-calendar-header"));
  // let week = new Week(document.querySelectorAll(".day"));
  // // global filter holder
  // crrsFilter = new Filter(week);
  // restoreFilter(restoreFilterAndUI);
}

