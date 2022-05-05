
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

/**
 * 
 * @param {HTMLElement} elementToAttachTo the element to append the menu to
 * @param {Week} week the content object
 */
const creatInlineMenu = (elementToAttachTo, week) => {
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
};