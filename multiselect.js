class MultiSelect extends HTMLElement {
  // Make a ShadowDOM
  shadowRoot = this.attachShadow({mode: "open"})

  connectedCallback() {
    this.shadowRoot.innerHTML = "<p>Hello world!</p>"
  }

  // disconnectedCallback() {

  // }

  // attributeChangedCallback() {

  // }
}

// Define element if not already defined
if (!customElements.get("multi-select")) {
  customElements.define("multi-select", MultiSelect)
}