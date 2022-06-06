
import _ from "../vendors/caldom.min.mjs.js";

class CRCheckbox extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    this.attachShadow({ mode: 'open' }); // sets and returns 'this.shadowRoot'

    //add styles
    // Apply external styles to the shadow DOM
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../../css/index.css');

    // Attach the created element to the shadow DOM
    this.shadowRoot.appendChild(linkElem);


    // Common class
    const CRRS_CLASS = "cr-rs-class";
    const CHECKBOX_INPUT_CLASS = "rs-cr-checkbox-input";
    const CHECKBOX_INNER_SPAN_CLASS = "rs-cr-checkbox-inner-span";

    const elementId = `cr-checkbox-input-${this.getAttribute('id')}`;

    // **1. The wraping span element **
    let customCheckboxSpan = _("+span")
      .addClass(CRRS_CLASS);
    // **2. The input element **
    let customCheckboxInput = _("+input")
      .attr("id", elementId)
      .attr("type", "checkbox")
      .on("change", this.#propagateEvent)
      .addClass([CRRS_CLASS, CHECKBOX_INPUT_CLASS]);
    // for (const dataAttr in dataAttrs) {
    //   if (Object.hasOwnProperty.call(dataAttrs, dataAttr)) {
    //     const element = dataAttrs[dataAttr];
    //     customCheckboxInput.data(dataAttr, element);
    //   }
    // }

    if (this.hasAttribute('checked')) {
      customCheckboxInput.attr("checked", true);
    }
    // **3. The inner span element **
    let fakeCheckSpan = _("+span")
      .addClass([CRRS_CLASS, CHECKBOX_INNER_SPAN_CLASS])
      .text(this.getAttribute('data-text'));

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
    _(this.shadowRoot, customCheckboxSpan);

    // Element functionality written in here
  }

  #propagateEvent = (event) => {
    console.log(event);
  }
}

customElements.define('cr-checkbox', CRCheckbox);