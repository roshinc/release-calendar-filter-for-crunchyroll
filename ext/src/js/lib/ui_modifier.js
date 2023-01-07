import _ from "caldom/dist/caldom.min.mjs";

import Filter from "../classes/filter";
import preference from "../classes/pref";

import {
  CRRS_FILTER_MENU_DIV_ID, CRRS_CLASS, CRRS_FILTER_MENU_PICK_DUBS_DIV_ID, CRRS_FILTER_MENU_PICK_DUBS_INPUT_ID_PREFIX,
  CRRS_FILTER_MENU_DUBS_RADIO_GROUP_NAME, CRRS_FILTER_MENU_QUEUE_RADIO_GROUP_NAME, CRRS_FILTER_MENU_PERMIERE_RADIO_GROUP_NAME,
  CRRS_FILTER_MENU_RADIO_GROUP_ONLY_VALUE, CRRS_FILTER_MENU_RADIO_GROUP_HIDE_VALUE, CRRS_FILTER_MENU_RADIO_GROUP_SHOW_VALUE,
  CRRS_FILTER_MENU_RADIO_GROUP_ONLY_INDEX, CRRS_FILTER_MENU_RADIO_GROUP_SHOW_INDEX, CRRS_FILTER_MENU_RADIO_GROUP_HIDE_INDEX,
  CRRS_FILTER_MENU_LOCK_BTN_ID, CRRS_HIDDEN_COUNT_CLASS_NAME, DEFAULT_DUB_LANGUAGES
} from "./constants";
import { handleDubbedRadioGroup, handleDubPickerCheckbox, handleQueueRadioGroup, handlePremiereRadioGroup, handelLockBtn, handelResetBtn } from "./event_handler";



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
  //class names
  const TOGGLE_CONTAINER_LABEL_CLASS = "rs-cr-toggle-container";
  const TOGGLE_INNER_LABEL_CLASS = "rs-cr-toggle-switch";
  const TOGGLE_INPUT_CLASS = "rs-cr-toggle-input";
  const TOGGLE_SPAN_CLASS = "rs-cr-toggle-slider";

  // ---- Add Toggle Switch ----
  // **1. The wraping Label element **
  let toggleSwitchText = _("+label")
    .attr("for", elementId)
    .text(labelText)
    .addClass([CRRS_CLASS, TOGGLE_CONTAINER_LABEL_CLASS]);
  // **2. The Label element **
  let toggleSwitchLabel = _("+span")
    .attr("for", elementId)
    .addClass([CRRS_CLASS, TOGGLE_INNER_LABEL_CLASS]);
  // **3. The Input element **
  let toggleSwitchInput = _("+input")
    .attr("id", elementId)
    .attr("type", "checkbox")
    .on("change", eventHandlerMethod)
    .addClass([CRRS_CLASS, TOGGLE_INPUT_CLASS]);
  if (checked) {
    toggleSwitchInput.attr("checked", checked);
  }
  // **4. The Span element **
  let toggleSwitchSpan = _("+span")
    .addClass([CRRS_CLASS, TOGGLE_SPAN_CLASS]);
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
 * Creates an element that shows the number of content being hidden  
 * 
 * @param {HTMLElement} elementToAttachTo element the div should append to
 */
export const createHiddenCount = (elementToAttachTo) => {
  let hiddenCount = _().react(
    {},
    {
      render: state => {
        let response = _("+div", `${state.count} Hidden`)
          .addClass([CRRS_CLASS, CRRS_HIDDEN_COUNT_CLASS_NAME]);
        if (state.changed && preference.reflowEnabled) {
          response.addClass(["changed"]);
        }

        return response;
      } //This is XSS safe
    }
  )

  _(elementToAttachTo, hiddenCount);

  //Edit below line to update state
  hiddenCount.state.count = "0";

  return hiddenCount;

};

export const createProgressBar = (elementToAttachTo, progressAmount) => {

  const PROGRESS_CLASS = "cr-rs-progress-on-closed";
  const PROGRESS_WRAPPING_DIV_CLASS = "cr-rs-progress-wraper-on-closed";
  const PROGRESS_DIV_CLASS = "cr-rs-progress-inner-on-closed";

  // **1. The wraping progress element **
  let progressElem = _("+progress")
    .addClass([CRRS_CLASS, PROGRESS_CLASS])
    .attr("value", progressAmount)
    .attr("max", "100");

  // Add to container
  _(elementToAttachTo, progressElem);

}


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

  const CHECKBOX_INPUT_CLASS = "rs-cr-checkbox-input";
  const CHECKBOX_INNER_SPAN_CLASS = "rs-cr-checkbox-inner-span";

  // **1. The wraping span element **
  let customCheckboxSpan = _("+span")
    .addClass(CRRS_CLASS);
  // **2. The input element **
  let customCheckboxInput = _("+input")
    .attr("id", elementId)
    .attr("type", "checkbox")
    .on("change", eventHandlerMethod)
    .addClass([CRRS_CLASS, CHECKBOX_INPUT_CLASS]);
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
    .addClass([CRRS_CLASS, CHECKBOX_INNER_SPAN_CLASS])
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

  const RADIO_BUTTON_INPUT_CLASS = "rs-cr-radio-button-input";
  const RADIO_BUTTON_LABEL_CLASS = "rs-cr-radio-button-label";

  // **1. The Input element **
  let optionInput = _("+input")
    .attr("type", "radio")
    .on("change", eventHandlerMethod)
    .attr("id", elementId)
    .attr("name", switchName)
    .attr("value", labelText.toLowerCase())
    .addClass([CRRS_CLASS, RADIO_BUTTON_INPUT_CLASS]);
  if (checked) {
    optionInput.attr("checked", checked);
  }
  // **1. The Label element **
  let optionLabel = _("+label")
    .attr("for", elementId)
    .text(labelText)
    .attr("title", labelText)
    .addClass([CRRS_CLASS, RADIO_BUTTON_LABEL_CLASS]);

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

  const RADIO_GROUP_CLASS = "rs-cr-radio-group";
  const RADIO_BUTTON_GROUP_CLASS = "rs-cr-radio-button-group";

  let buttonGroup = _("+div")
    .addClass([CRRS_CLASS, RADIO_GROUP_CLASS]);

  let buttonGroupText = _("+span")
    .text(groupText)
    .addClass([CRRS_CLASS, "switch-holder-text"]);

  let buttonGroupRadioContainer = _("+div")
    .addClass([CRRS_CLASS, RADIO_BUTTON_GROUP_CLASS]);

  const radioOptions = [CRRS_FILTER_MENU_RADIO_GROUP_ONLY_VALUE, CRRS_FILTER_MENU_RADIO_GROUP_SHOW_VALUE, CRRS_FILTER_MENU_RADIO_GROUP_HIDE_VALUE];

  for (let radioOption of radioOptions) {
    // console.log(radioOption);
    if (radioOption === CRRS_FILTER_MENU_RADIO_GROUP_SHOW_VALUE) {
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
export const createInlineMenu = (elementToAttachTo, savedShownLanguages) => {

  let containerDiv = _("+div")
    .attr("id", CRRS_FILTER_MENU_DIV_ID)
    .addClass(CRRS_CLASS);

  // ---- Add Toggle Switch for showing all dub ----
  //createToggleSwtich("Show Dubs", CRRS_FILTER_MENU_SHOW_DUBS_INPUT_ID, containerDiv, handleShowDubsToggle, true);
  // ---- Add Toggle Switch for showing in queue only ----
  addRadioButtonGroup("Dubbed:", "dubbed-toggle", CRRS_FILTER_MENU_DUBS_RADIO_GROUP_NAME, containerDiv, handleDubbedRadioGroup);


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

  // Default to DEFAULT_DUB_LANGUAGES constant if no saved languages
  const languages = savedShownLanguages && savedShownLanguages.length > 0 ? savedShownLanguages : DEFAULT_DUB_LANGUAGES;
  //Append the "Others" option
  languages.push("Others");

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
  addRadioButtonGroup("In Queue:", "in-queue-toggle", CRRS_FILTER_MENU_QUEUE_RADIO_GROUP_NAME, containerDiv, handleQueueRadioGroup);

  // ---- Add Vertical Divider ---- 
  createVerticalDivider(containerDiv);

  // ---- Add Toggle Switch for showing in queue only ----
  addRadioButtonGroup("Permiere:", "premier-toggle", CRRS_FILTER_MENU_PERMIERE_RADIO_GROUP_NAME, containerDiv, handlePremiereRadioGroup);

  // ---- Add End Button Group ---- 
  const END_BUTTON_GROUP_CLASS = "rs-cr-end-button-group";
  const END_BUTTON_CLASS = "rs-cr-end-button";

  const ORANGE_TEXT_CLASS = "rs-cr-orange-text";

  const END_BUTTON_UNLOCKED_CLASS = "rs-cr-unlocked";


  let lockDiv = _("+div")
    .addClass([CRRS_CLASS, END_BUTTON_GROUP_CLASS]);


  // ---- Add Lock Button ---- 
  let lockBtn = _("+button")
    .data("isLocked", "false")
    .attr("id", CRRS_FILTER_MENU_LOCK_BTN_ID)
    .attr("title", "Save Filters")
    .attr("aria-label", "Save Filters")
    .on("click", (event) => { handelLockBtn(event, lockFilters) })
    .addClass([CRRS_CLASS, END_BUTTON_CLASS]);

  // Add Lock icon
  let lockIcon = _("+i")
    .addClass(["fontello-icon", "icon-unlocked", END_BUTTON_UNLOCKED_CLASS]);


  lockBtn.append(lockIcon);

  // ---- Add Reset Button ---- 
  let resetBtn = _("+button")
    .attr("title", "Reset Filters")
    .attr("aria-label", "Reset Filters")
    .on("click", (event) => { handelResetBtn(event, lockFilters) })
    .addClass([CRRS_CLASS, END_BUTTON_CLASS]);

  //Add reset icon
  let resetIcon = _("+i")
    .addClass(["fontello-icon", "icon-reset", ORANGE_TEXT_CLASS]);

  resetBtn.append(resetIcon);

  lockDiv.append([lockBtn, resetBtn]);
  containerDiv.append([lockDiv]);

  //Add container to the given element
  _(elementToAttachTo).append(containerDiv);
};


const handleUIChangesOnSaveStatus = (status, icon) => {

  const END_BUTTON_LOCKED_CLASS = "rs-cr-locked";
  const END_BUTTON_UNLOCKED_CLASS = "rs-cr-unlocked";

  if (status) {

    icon.removeClass([END_BUTTON_UNLOCKED_CLASS, "icon-unlocked"]).addClass([END_BUTTON_LOCKED_CLASS, "icon-locked"]);

    _(`input[name="${CRRS_FILTER_MENU_DUBS_RADIO_GROUP_NAME}"]`).attr("disabled", status);

    _(`#${CRRS_FILTER_MENU_PICK_DUBS_DIV_ID} input`).attr("disabled", status);

    _(`input[name="${CRRS_FILTER_MENU_QUEUE_RADIO_GROUP_NAME}"]`).attr("disabled", status);
    _(`input[name="${CRRS_FILTER_MENU_PERMIERE_RADIO_GROUP_NAME}"]`).attr("disabled", status);

  } else {
    icon.removeClass([END_BUTTON_LOCKED_CLASS, "icon-locked"]).addClass([END_BUTTON_UNLOCKED_CLASS, "icon-unlocked"]);

    _(`input[name="${CRRS_FILTER_MENU_DUBS_RADIO_GROUP_NAME}"]`).each(function (elem, i) { elem.removeAttribute("disabled") });

    _(`#${CRRS_FILTER_MENU_PICK_DUBS_DIV_ID} input`).each(function (elem, i) { elem.removeAttribute("disabled") });

    _(`input[name="${CRRS_FILTER_MENU_QUEUE_RADIO_GROUP_NAME}"]`).each(function (elem, i) { elem.removeAttribute("disabled") });
    _(`input[name="${CRRS_FILTER_MENU_PERMIERE_RADIO_GROUP_NAME}"]`).each(function (elem, i) { elem.removeAttribute("disabled") });

  }
}


export const lockFilters = (status, lockBtn = _(`#${CRRS_FILTER_MENU_LOCK_BTN_ID}`), icon = _(`#${CRRS_FILTER_MENU_LOCK_BTN_ID} i`)) => {
  if (status) {
    //lock
    handleUIChangesOnSaveStatus(true, icon);
    lockBtn.data("isLocked", "true");
  } else {
    handleUIChangesOnSaveStatus(false, icon);
    lockBtn.data("isLocked", "false");
  }
}

export const restoreUI = (savedFilter) => {
  const hideAllDubs = savedFilter["hideAllDub"];
  const hideAllSubs = savedFilter["hideAllSubs"];

  let indexToPick;
  if (hideAllSubs) {
    indexToPick = CRRS_FILTER_MENU_RADIO_GROUP_ONLY_INDEX;
  } else if (hideAllDubs) {
    indexToPick = CRRS_FILTER_MENU_RADIO_GROUP_HIDE_INDEX;
  }

  let dubGroup = document.querySelectorAll(`input[name="${CRRS_FILTER_MENU_DUBS_RADIO_GROUP_NAME}"]`);

  for (const [i, elem] of dubGroup.entries()) {
    if (i == indexToPick) {
      elem.checked = true;
      break;
    }

  }

  let dubPickers = document.querySelectorAll(`#${CRRS_FILTER_MENU_PICK_DUBS_DIV_ID} input`);
  const dubsShown = savedFilter["dubsShown"];
  console.log(dubsShown);
  // if no dubs are shown uncheck all the langs
  if (hideAllDubs) {
    for (const [i, elem] of dubPickers.entries()) {
      elem.checked = false;
    }
  } else if (dubsShown.length > 0) {
    for (const [i, elem] of dubPickers.entries()) {
      if (dubsShown.includes(_(elem).data("lang")[0])) {
        elem.checked = true;
      } else {
        elem.checked = false;
      }
    }
  }

  const showInQueue = savedFilter["showInQueue"];
  const showOnlyInQueue = savedFilter["showOnlyInQueue"];

  indexToPick;
  if (showOnlyInQueue) {
    indexToPick = CRRS_FILTER_MENU_RADIO_GROUP_ONLY_INDEX;
  } else if (!showInQueue && !showOnlyInQueue) {
    indexToPick = CRRS_FILTER_MENU_RADIO_GROUP_HIDE_INDEX;
  }

  let queueGroup = document.querySelectorAll(`input[name="${CRRS_FILTER_MENU_QUEUE_RADIO_GROUP_NAME}"]`);

  for (const [i, elem] of queueGroup.entries()) {
    if (i == indexToPick) {
      elem.checked = true;
      break;
    }

  }

  const showPremiere = savedFilter["showPremiere"];
  const showOnlyPremiere = savedFilter["showOnlyPremiere"];

  indexToPick = CRRS_FILTER_MENU_RADIO_GROUP_SHOW_INDEX;
  if (showOnlyPremiere) {
    indexToPick = CRRS_FILTER_MENU_RADIO_GROUP_ONLY_INDEX;
  } else if (!showOnlyPremiere && !showPremiere) {
    indexToPick = CRRS_FILTER_MENU_RADIO_GROUP_HIDE_INDEX;
  }

  let premiereGroup = document.querySelectorAll(`input[name="${CRRS_FILTER_MENU_PERMIERE_RADIO_GROUP_NAME}"]`);
  for (const [i, elem] of premiereGroup.entries()) {
    if (i == indexToPick) {
      elem.checked = true;
      break;
    }
  }

}