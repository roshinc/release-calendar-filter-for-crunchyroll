/**
 * Create a UI element with a checkbox styled as a toggle switch
 * 
 * @param {string} labelText the label of the toggle switch
 * @param {string} elementId the ID of the toggle input
 * @param {HTMLElement} elementToAttachTo element the toggle should append to
 * @param {EventListener} eventHandlerMethod callback function for onchange
 * @param {boolean} checked {true} if the defalut state of the switch should be on
 */
const createToggleSwtich = (labelText, elementId, elementToAttachTo, eventHandlerMethod, checked) => {
  // ---- Add Toggle Switch ----
  // **1. The wraping Label element **
  let toggleSwitchText = _("+label")
    .attr("for", elementId)
    .text(labelText)
    .addClass([CRRS_CLASS]);
  // **2. The Label element **
  let toggleSwitchLabel = _("+label")
    .attr("for", elementId)
    .addClass([CRRS_CLASS, "switch"]);
  // **3. The Input element **
  let toggleSwitchInput = _("+input")
    .attr("id", elementId)
    .attr("type", "checkbox")
    .on("change", eventHandlerMethod)
    .addClass(CRRS_CLASS);
  if (checked) {
    toggleSwitchInput.attr("checked", checked);
  }
  // **4. The Span element **
  let toggleSwitchSpan = _("+span")
    .addClass([CRRS_CLASS, "slider", "round"]);
  // Connect elements
  toggleSwitchText.append([toggleSwitchLabel]);
  toggleSwitchLabel.append([toggleSwitchInput, toggleSwitchSpan]);
  // Add to container
  elementToAttachTo.append(toggleSwitchText);
};


/**
 * Creates a div thats styled to look like a vertical divider
 * 
 * @param {HTMLElement} elementToAttachTo element the div should append to
 */
const createVerticalDivider = (elementToAttachTo) => {
  // ---- Add Vertical Divider ---- 
  let dividerDivElement = _("+div")
    .attr("aria-hidden", "true")
    .addClass([CRRS_CLASS, "cr-rs-filter-vertical-divider"]);
  elementToAttachTo.append(dividerDivElement);
};

/**
 * Creates a div thats styled to look like a vertical divider
 * 
 * @param {HTMLElement} elementToAttachTo element the div should append to
 */
const createHiddenCount = (elementToAttachTo) => {
  let hiddenCount = _().react(
    {},
    {
      render: state => {
        let response = _("+div", `${state.count} Hidden`)
          .addClass([CRRS_CLASS, CRRS_HIDDEN_COUNT_CLASS_NAME]);
        if (state.changed) {
          response.addClass(["changed"]);
        }

        return response;
      } //This is XSS safe
    }
  )

  _(elementToAttachTo, hiddenCount);

  //Edit below line to update state
  hiddenCount.state.count = "0";
  // // ---- Add Vertical Divider ---- 
  // let dividerDivElement = _("+div")
  //   .text("0 Hidden")
  //   .addClass([CRRS_CLASS, "cr-rs-filter-hidden-count"]);
  // elementToAttachTo.append(dividerDivElement);
  return hiddenCount;

};


/**
 * Create a UI element with a custom checkbox 
 * 
 * @param {string} labelText the label of the checkbox
 * @param {string} elementId the ID of the checkbox
 * @param {HTMLElement} elementToAttachTo element the checkbox should append to
 * @param {EventListener} eventHandlerMethod callback function for onchange
 * @param {Array} dataAttrs data attributes to add to the input
 * @param {boolean} checked {true} if the defalut state of the switch should be on
 */
const addCheckBox = (labelText, elementId, elementToAttachTo, eventHandlerMethod, dataAttrs, checked) => {
  // **1. The wraping span element **
  let customCheckboxSpan = _("+span")
    .addClass(CRRS_CLASS);
  // **2. The input element **
  let customCheckboxInput = _("+input")
    .attr("id", elementId)
    .attr("type", "checkbox")
    .on("change", eventHandlerMethod)
    .addClass(CRRS_CLASS);
  for (const dataAttr in dataAttrs) {
    if (Object.hasOwnProperty.call(dataAttrs, dataAttr)) {
      const element = dataAttrs[dataAttr];
      customCheckboxInput.data(dataAttr, element);
    }
  }

  if (checked) {
    customCheckboxInput.attr("checked", checked);
  }
  // **3. The inner span element **
  let fakeCheckSpan = _("+span")
    .addClass(CRRS_CLASS)
    .text(labelText);

  // **4. The label element **
  let customCheckboxLabel = _("+label")
    .attr("for", elementId)
    //.text(labelText)
    .addClass(CRRS_CLASS);
  customCheckboxLabel.append(customCheckboxInput);
  customCheckboxLabel.append(fakeCheckSpan);

  // Connect elements
  customCheckboxSpan.append([customCheckboxLabel]);
  // Add to container
  elementToAttachTo.append([customCheckboxSpan]);
};


/**
 * Create a UI element with a custom radio option for the group 'switchName'
 * 
 * @param {string} labelText the label of the radio
 * @param {string} elementId the ID of the radio
 * @param {string} switchName the name of ratio group
 * @param {HTMLElement} elementToAttachTo element the radio should append to
 * @param {EventListener} eventHandlerMethod callback function for onchange
 * @param {boolean} checked {true} if the defalut state of the switch should be on
 */
const addRadioOption = (labelText, elementId, switchName, elementToAttachTo, eventHandlerMethod, checked) => {
  // **1. The Input element **
  let optionInput = _("+input")
    .attr("type", "radio")
    .on("change", eventHandlerMethod)
    .attr("id", elementId)
    .attr("name", switchName)
    .attr("value", labelText.toLowerCase())
    .addClass([CRRS_CLASS]);
  if (checked) {
    optionInput.attr("checked", checked);
  }
  // **1. The Label element **
  let optionLabel = _("+label")
    .attr("for", elementId)
    .text(labelText)
    .attr("title", labelText)
    .addClass([CRRS_CLASS, "switch-field"]);

  // Add to container
  elementToAttachTo.append([optionInput, optionLabel]);
};

/**
 * 
 * @param {string} groupText the label for the group
 * @param {string} idPrefix the perfix of the id for the options
 * @param {string} switchName name of the group
 * @param {HTMLElement} elementToAttachTo element the radio should append to
 * @param {EventListener} eventHandlerMethod callback function for onchange
 */
const addRadioButtonGroup = (groupText, idPrefix, switchName, elementToAttachTo, eventHandlerMethod) => {
  let buttonGroup = _("+div")
    .addClass([CRRS_CLASS, "switch-holder"]);

  let buttonGroupText = _("+span")
    .text(groupText)
    .addClass([CRRS_CLASS, "switch-holder-text"]);

  let buttonGroupRadioContainer = _("+div")
    .addClass([CRRS_CLASS, "switch-field"]);

  const radioOptions = ["Only", "Show", "Hide"];

  for (let radioOption of radioOptions) {
    // console.log(radioOption);
    if (radioOption === "Show") {
      addRadioOption(radioOption, `cr-rs-filter-menu-${idPrefix}-${radioOption.toLowerCase()}`, switchName, buttonGroupRadioContainer, eventHandlerMethod, true);
    } else {
      addRadioOption(radioOption, `cr-rs-filter-menu-${idPrefix}-${radioOption.toLowerCase()}`, switchName, buttonGroupRadioContainer, eventHandlerMethod, false);
    }
  }

  buttonGroup.append([buttonGroupText, buttonGroupRadioContainer]);
  elementToAttachTo.append(buttonGroup);
};

/**
 * 
 * @param {HTMLElement} elementToAttachTo the element to append the menu to
 */
const createInlineMenu = (elementToAttachTo) => {
  let containerDiv = _("+div")
    .attr("id", CRRS_FILTER_MENU_DIV_ID)
    .addClass(CRRS_CLASS);

  // ---- Add Toggle Switch for showing all dub ----
  createToggleSwtich("Show Dubs", CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID, containerDiv, handleShowDubsToggle, true);


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

  const languages = Filter.dubLangs();

  for (let language of languages) {
    let map = [];
    map['lang'] = language.toLowerCase()
    addCheckBox(language, `${CRRS_FILTER_MENU_PICK_DUBS_INPUT_ID_PREFIX}${language.toLowerCase()}`, dubSelectionDiv, handleDubPickerCheckbox, map, true);
  }

  // Add to container
  containerDiv.append(dubSelectionDiv);


  // ---- Add Vertical Divider ---- 
  createVerticalDivider(containerDiv);


  // ---- Add Toggle Switch for showing in queue only ----
  //createToggleSwtich("In Queue Only", CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID + "q", containerDiv, false);
  addRadioButtonGroup("In Queue:", "in-queue-toggle", CRRS_FILTER_MENU_QUEUE_RADIO_GROUP_NAME, containerDiv, handleQueueRadioGroup);

  // ---- Add Vertical Divider ---- 
  createVerticalDivider(containerDiv);

  // ---- Add Toggle Switch for showing in queue only ----
  //createToggleSwtich("Permiere Only", CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID + "p", containerDiv, false);
  addRadioButtonGroup("Permiere:", "premier-toggle", CRRS_FILTER_MENU_PERMIERE_RADIO_GROUP_NAME, containerDiv, handlePremiereRadioGroup);

  // ---- Add Vertical Divider ---- 
  createVerticalDivider(containerDiv);

  // ---- Add Reset Button ---- 
  let resetBtn = _("+button")
    .text("Reset")
    .attr("title", "Reset Filters")
    .attr("aria-label", "Reset Filters")
    .on("click", handelResetBtn)
    .addClass(CRRS_CLASS);

  containerDiv.append([resetBtn]);

  // Creat 3 button toggle

  _(elementToAttachTo).append(containerDiv);
};