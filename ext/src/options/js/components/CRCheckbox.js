
import _ from "../vendors/caldom.min.mjs.js";

class CRCheckbox extends HTMLElement {

  #elemId = "cr-checkbox-input-";
  #fakeCheckSpan;
  #customCheckboxInput;


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


    // **1. The wraping span element **
    let customCheckboxSpan = _("+span")
      .addClass(CRRS_CLASS);
    // **2. The input element **
    this.#customCheckboxInput = _("+input")
      .attr("id", this.#elemId)
      .attr("type", "checkbox")
      .on("change", this.#propagateEvent)
      .addClass([CRRS_CLASS, CHECKBOX_INPUT_CLASS]);
    // for (const dataAttr in dataAttrs) {
    //   if (Object.hasOwnProperty.call(dataAttrs, dataAttr)) {
    //     const element = dataAttrs[dataAttr];
    //     customCheckboxInput.data(dataAttr, element);
    //   }
    // }
    // **3. The inner span element **
    this.#fakeCheckSpan = _("+span")
      .addClass([CRRS_CLASS, CHECKBOX_INNER_SPAN_CLASS])
      .text("this.getAttribute('data-text')");

    // **4. The label element **
    let customCheckboxLabel = _("+label")
      .attr("for", this.#elemId)
      .addClass(CRRS_CLASS);
    customCheckboxLabel.append(this.#customCheckboxInput);
    customCheckboxLabel.append(this.#fakeCheckSpan);

    // Connect elements
    customCheckboxSpan.append([customCheckboxLabel]);

    // Add to container
    _(this.shadowRoot, customCheckboxSpan);

    // Element functionality written in here
  }

  connectedCallback() {
    console.log('Custom checkbox element added to page.');
    //console.log(this.shadowRoot.querySelector('.rs-cr-checkbox-inner-span'));
    this.#fakeCheckSpan.text(this.getAttribute('data-text'));
    console.log(_(this).data('data-handler'));
    this.#customCheckboxInput.on("change", _(this).data('data-handler'));

    // check if the element has the attribute 'checked'
    if (this.hasAttribute('checked')) {
      this.#customCheckboxInput.attr("checked", true);
    };
    // check if the element has the attribute 'disabled'
    if (this.hasAttribute('disabled')) {
      this.#customCheckboxInput.attr("disabled", true);
    };
  }

  disconnectedCallback() {
    console.log('Custom checkbox element removed from page.');
  }

  adoptedCallback() {
    console.log('Custom checkbox element moved to new page.');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name);
    if (name == 'data-group') {
      this.#elemId = `cr-checkbox-input-${this.getAttribute('data-group')}`;
    }
    if (name == 'data-text') {
      this.#elemId = `${this.#elemId}-${this.getAttribute('data-text').toLocaleLowerCase()}`;
      //_(this.getElementsByClassName('rs-cr-checkbox-inner-span')).text(this.getAttribute('data-text'));
    }
  }

  #propagateEvent = (event) => {
    console.log(event);
    const checkEvent = new CustomEvent("check", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        event: event
      }
    });
    this.dispatchEvent(checkEvent);
  }
}

customElements.define('cr-checkbox', CRCheckbox);