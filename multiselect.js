class MultiSelect extends HTMLElement {
  constructor() {
    super()

    const shadowRoot = this.attachShadow({mode: "open"})
    
    const unselected = document.createElement("ul")
    const selected = document.createElement("ul")
    
    let options = []
    for (let option of this.querySelectorAll("option")) {
      options.push(option.cloneNode(true))
    }

    for (let item of options) {
      let li = document.createElement("li")
      li.innerText = item.innerText

      if (item.selected) {
        selected.appendChild(li)
      } else {
        unselected.appendChild(li)
      }
    }
    
    const sel_label = document.createElement("h1")
    sel_label.innerText = "Selected:"
    const unsel_label = document.createElement("h1")
    unsel_label.innerText = "Unselected:"

    shadowRoot.appendChild(sel_label)
    shadowRoot.appendChild(selected)
    shadowRoot.appendChild(unsel_label)
    shadowRoot.appendChild(unselected)

  }

  connectedCallback() {

  }

  disconnectedCallback() {

  }
}

// Define element if not already defined
if (!customElements.get("multi-select")) {
  customElements.define("multi-select", MultiSelect)
}