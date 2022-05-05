function createMenu() {
  /**
   * <div id="mySidebar" class="sidebar">
          <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">×</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Clients</a>
          <a href="#">Contact</a>
      </div>
   */

  let sidebarDiv = document.createElement("div");
  sidebarDiv.id = "mySidebar";
  sidebarDiv.classList.add("sidebar", "shadow-element");

  let closebtn = document.createElement("a");
  closebtn.href = "javascript:void(0)";
  closebtn.classList.add("closebtn");
  closebtn.textContent = "×";
  closebtn.onclick = closeNav;
  sidebarDiv.appendChild(closebtn);

  // =========================== ===========================
  let toggleHolderElement = document.createElement("div");

  sidebarDiv.classList.add("sidebar", "shadow-element");

  document.querySelector('#template_body').appendChild(sidebarDiv);


}

const CRRS_FILTER_MENU_DIV_ID = "cr-rs-filter-menu";
const CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID = "cr-rs-filter-menu-show-dubs";
const CRRS_FILTER_MENU_PICK_DUBS_DIV_ID = "cr-rs-filter-menu-pick-dubs";


const applyFilters = (event) => {
  console.log("clicked")
  console.log(event)
  console.log(`Shows Dubs? ${document.getElementById(CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID).checked}`);
  console.log();
};

const createToggleSwtich = (labelText, elementId, elementToAttachTo, checked) => {
  // ---- Add Toggle Switch ----
  // **1. The wraping Label element **
  let showDubsSwitchText = _("+label")
    .attr("for", elementId)
    .text(labelText)
    .addClass([CRRS_CLASS]);
  // **2. The Label element **
  let showDubsSwitchLabel = _("+label")
    .attr("for", elementId)
    .addClass([CRRS_CLASS, "switch"]);
  // **3. The Input element **
  let showDubsSwitchInput = _("+input")
    .attr("id", elementId)
    .attr("type", "checkbox")
    .attr("checked", checked)
    .on("change", applyFilters)
    .addClass(CRRS_CLASS);
  // **4. The Span element **
  let showDubsSwitchSpan = _("+span")
    .addClass([CRRS_CLASS, "slider", "round"]);
  // Connect elements
  showDubsSwitchText.append([showDubsSwitchLabel]);
  showDubsSwitchLabel.append([showDubsSwitchInput, showDubsSwitchSpan]);
  // Add to container
  elementToAttachTo.append(showDubsSwitchText);
};

const createVerticalDivider = (elementToAttachTo) => {
  // ---- Add Vertical Divider ---- 
  let dividerDivElement = _("+div")
    .attr("aria-hidden", "true")
    .addClass([CRRS_CLASS, "cr-rs-filter-vertical-divider"]);
  elementToAttachTo.append(dividerDivElement);
};

const addCheckBox = (labelText, elementId, elementToAttachTo, checked) => {
  // **2. The span element **
  let dubSelectionSpan = _("+span")
    .addClass(CRRS_CLASS);
  // **2. The span element **
  let dubSelectionInput = _("+input")
    .attr("id", elementId)
    .attr("type", "checkbox")
    .on("change", applyFilters)
    .addClass(CRRS_CLASS);

  if (checked) {
    dubSelectionInput.attr("checked", checked);
  }

  let fakeCheckSpan = _("+span")
    .addClass(CRRS_CLASS)
    .text(labelText);

  // **2. The label element **
  let dubSelectionLabel = _("+label")
    .attr("for", elementId)
    //.text(labelText)
    .addClass(CRRS_CLASS);
  dubSelectionLabel.append(dubSelectionInput);
  dubSelectionLabel.append(fakeCheckSpan);

  // Connect elements
  dubSelectionSpan.append([dubSelectionLabel]);
  // Add to container
  elementToAttachTo.append([dubSelectionSpan]);
};

const addRadioOption = (labelText, elementId, switchName, elementToAttachTo, checked) => {
  let firstOptionInput = _("+input")
    .attr("type", "radio")
    .on("change", applyFilters)
    .attr("id", elementId)
    .attr("name", switchName)
    .attr("value", labelText.toLowerCase())
    .addClass([CRRS_CLASS]);
  if (checked) {
    firstOptionInput.attr("checked", checked);
  }

  let firstOptionLabel = _("+label")
    .attr("for", elementId)
    .text(labelText)
    .attr("title", labelText)
    .addClass([CRRS_CLASS, "switch-field"]);

  // Add to container
  elementToAttachTo.append([firstOptionInput, firstOptionLabel]);
};

const addRadioButtonGroup = (groupText, idPrefix, switchName, elementToAttachTo) => {
  let buttonGroup = _("+div")
    .addClass([CRRS_CLASS, "switch-holder"]);

  let buttonGroupText = _("+span")
    .text(groupText)
    .addClass([CRRS_CLASS, "switch-holder-text"]);

  let buttonGroupRadioContainer = _("+div")
    .addClass([CRRS_CLASS, "switch-field"]);

  const radioOptions = ["Only", "Show", "Hide"];

  for (let radioOption of radioOptions) {
    console.log(radioOption);
    if (radioOption === "Show") {
      addRadioOption(radioOption, `cr-rs-filter-menu-${idPrefix}-${radioOption.toLowerCase()}`, switchName, buttonGroupRadioContainer, true);
    } else {
      addRadioOption(radioOption, `cr-rs-filter-menu-${idPrefix}-${radioOption.toLowerCase()}`, switchName, buttonGroupRadioContainer, false);
    }
  }

  buttonGroup.append([buttonGroupText, buttonGroupRadioContainer]);
  elementToAttachTo.append(buttonGroup);
};



function createInlineCalDomMenu(elementToAttachTo, week) {
  let containerDiv = _("+div")
    .attr("id", CRRS_FILTER_MENU_DIV_ID)
    .addClass(CRRS_CLASS);

  // ---- Add Toggle Switch for showing all dub ----
  createToggleSwtich("Show Dubs", CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID, containerDiv, true);
  // ---- Add Vertical Divider ---- 
  createVerticalDivider(containerDiv);
  // ---- Add Checkbox for showing specific dubs ----
  // **1. The wraping div element **
  let dubSelectionDiv = _("+div")
    .attr("id", CRRS_FILTER_MENU_PICK_DUBS_DIV_ID)
    .addClass(CRRS_CLASS);
  // **2. The text element **
  let dubSelectionText = _("+p")
    .text("Enable Dubs for")
    .addClass(CRRS_CLASS);

  dubSelectionDiv.append([dubSelectionText]);

  const languages = ["English", "Spanish", "French", "German", "Portuguese", "Others"];

  for (let language of languages) {
    console.log(language);
    addCheckBox(language, `cr-rs-filter-menu-pick-dubs-lang-${language.toLowerCase()}`, dubSelectionDiv, true);
  }

  // Add to container
  containerDiv.append(dubSelectionDiv);

  // ---- Add Vertical Divider ---- 
  createVerticalDivider(containerDiv);

  // ---- Add Toggle Switch for showing in queue only ----
  //createToggleSwtich("In Queue Only", CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID + "q", containerDiv, false);
  addRadioButtonGroup("In Queue:", "in-queue-toggle", "in-queue-switch", containerDiv);

  // ---- Add Vertical Divider ---- 
  createVerticalDivider(containerDiv);

  // ---- Add Toggle Switch for showing in queue only ----
  //createToggleSwtich("Permier Only", CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID + "p", containerDiv, false);
  addRadioButtonGroup("Permier:", "premier-toggle", "permier-switch", containerDiv);

  // ---- Add Vertical Divider ---- 
  createVerticalDivider(containerDiv);

  // ---- Add Reset Button ---- 
  let resetBtn = _("+button")
    .text("Reset")
    .attr("title", "Reset Filters")
    .attr("aria-label", "Reset Filters")
    .addClass(CRRS_CLASS);

  containerDiv.append([resetBtn]);

  // Creat 3 button toggle

  _(elementToAttachTo).append(containerDiv);
}







const CRRS_FILTER_TOGGLE_DIV_ID = "cr-rs-filter-toggle";



function createInlineMenu(elementToAttachTo, week) {

  let aDivElem = document.createElement("div");
  aDivElem.classList.add("CRRS_CLASS", "cr-rs-filter-menu");
  //aDivElem.textContent = " Access the latest anime and drama on the same day it is broadcast in Japan.ry 14 days of ";

  // let aStrongElem = document.createElement("strong");
  // aStrongElem.classList.add("CRRS_CLASS", "premium-membership-text", "js-premium-membership-text");
  // aStrongElem.textContent="Strong";

  // let aAElem = document.createElement("a");
  // aAElem.href= "/welcome?return_url=https://www.crunchyroll.com/simulcastcalendar";
  // aAElem.classList.add("CRRS_CLASS", "js-upsell-link");
  // aAElem.textContent="link";

  let aPElem = document.createElement("p");
  aPElem.textContent = " Show Dubs"
  let aLabelElem = document.createElement("label");
  aLabelElem.classList.add("CRRS_CLASS", "switch");
  let aInputElem = document.createElement("input");
  aInputElem.id = "togle";
  aInputElem.type = "checkbox";
  aInputElem.onchange = function (event) {
    const checked = event.target.checked;
    console.log(checked);

    if (checked) {
      week.hideDubs();
    } else {
      week.showDubs();
    }
  }
  let aSpanElem = document.createElement("span");
  aSpanElem.classList.add("CRRS_CLASS", "slider", "round");
  aPElem.appendChild(aLabelElem);
  aLabelElem.appendChild(aInputElem);
  aLabelElem.appendChild(aSpanElem);
  aDivElem.appendChild(aPElem);

  let avDivElem = document.createElement("div");
  avDivElem.classList.add("CRRS_CLASS", "vl");
  aDivElem.appendChild(avDivElem);


  //show dubs for
  let showDubsForDivElem = document.createElement("div");
  showDubsForDivElem.classList.add("CRRS_CLASS", "cr-rs-filter-checkbox-menu");

  let showDubsForPElem = document.createElement("p");
  showDubsForPElem.textContent = " Enable Dubs for";

  let showDubsForSpanElem = document.createElement("span");
  showDubsForSpanElem.classList.add("CRRS_CLASS");

  let englishInputElem = document.createElement("input");
  englishInputElem.type = "checkbox";
  englishInputElem.id = "vehicle1";
  englishInputElem.name = "vehicle1";
  englishInputElem.value = "Bike";

  let englishLabelElem = document.createElement("label");
  englishLabelElem.for = "vehicle1";
  englishLabelElem.textContent = " English"

  englishInputElem.onchange = function (event) {
    const checked = event.target.checked;
    console.log(checked);

    if (checked) {
      week.hideDubs();
    } else {
      week.showDubs();
    }
  }

  showDubsForDivElem.appendChild(showDubsForPElem);
  showDubsForSpanElem.appendChild(englishInputElem);
  showDubsForSpanElem.appendChild(englishLabelElem);
  showDubsForDivElem.appendChild(showDubsForSpanElem);

  aDivElem.appendChild(showDubsForDivElem);

  //aDivElem.appendChild(aAElem);

  /*
      let containerDiv = document.createElement("div");
      containerDiv.id = CRRS_FILTER_TOGGLE_DIV_ID;
      containerDiv.classList.add(CRRS_CLASS, "filter-form");
  
      let contentDiv = document.createElement("div");
      contentDiv.classList.add(CRRS_CLASS, "content");
      containerDiv.appendChild(contentDiv);
  
      //====================
  
      let filterLabel = document.createElement("label");
      filterLabel.classList.add(CRRS_CLASS, "filter-toggle");
      contentDiv.appendChild(filterLabel);
  
      let contentSpan = document.createElement("span");
      contentSpan.classList.add(CRRS_CLASS, "content");
      filterLabel.appendChild(contentSpan);
  
      let toggleInput = document.createElement("input");
      toggleInput.type = "checkbox";
      toggleInput.classList.add(CRRS_CLASS, "filter-button", "js-filter-button", "js-premium-episodes-button");
      toggleInput.onchange = function (event) {
          const checked = event.target.checked;
          console.log(checked);
  
          if(checked){
              week.hideDubs();
          } else {
              week.showDubs();
          }
      }
      contentSpan.appendChild(toggleInput);
  
      let labelSpan = document.createElement("span");
      labelSpan.classList.add(CRRS_CLASS, "label-text");
      labelSpan.textContent = "Hide Dubs";
      contentSpan.appendChild(labelSpan);
      **/

  //====================


  // add menu to body
  elementToAttachTo.appendChild(aDivElem);

  /**
   <div id="cr-rs-filter_toggle_form" class="filter-form">
  <div class="content">
    <label class="filter-toggle">
      <span class="content">
        <input class="filter-button js-filter-button js-premium-episodes-button" name="filter" type="radio" value="premium" checked="" data-np-checked="1">
        <span class="label-text">
          Premium Episodes
        </span>
      </span>
    </label>

    <label class="filter-toggle">
      <span class="content">
        <input class="filter-button js-filter-button js-free-episodes-button" name="filter" type="radio" value="free" data-np-checked="1">
        <span class="label-text">
          Free New Episodes
        </span>
      </span>
    </label>
  </div>

    </div>
   */
}

function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.querySelector('main').style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.querySelector('main').style.marginLeft = "0";
}