/*
 * All JS in this file will be run on any pages that match the pattern defined in manifest.
 */

window.onload = function () {
  console.log("%cHello from your Release Calendar Fixer for CR!", "color: #fff; background: #F78C24; font-size: 20px; padding: 5px;");
  //let index = 0;

  console.log("Create Menu");
  let week = new Week(document.querySelectorAll(".day"));
  crrsFilter = new Filter(week);
  createInlineMenu(document.querySelector("header.simulcast-calendar-header"), week);
  console.log("Done Create Menu");

  /*  let observer = new MutationObserver(function (mutations, me) {
      if (document.querySelector('#template_body')) {
        // resolve(document.querySelector(selector));
  
        me.disconnect();
        console.log(index++);
        console.log("Create Menu");
        //createMenu();
        // let week = new Week(document.querySelectorAll(".day"));
        // createInlineCalDomMenu(document.querySelector("header.simulcast-calendar-header"), week);
        // console.log("Done Create Menu");
        //openNav();
        return;
      }
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  */
}

