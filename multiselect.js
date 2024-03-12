class MultiSelect extends HTMLElement {
  constructor() {
    super()

    const shadowRoot = this.attachShadow({mode: "open"})
    
    const unselected = document.createElement("select")
    const selected = document.createElement("select")
    
    let options = []
    for (let option of this.querySelectorAll("option")) {
      options.push(option.cloneNode(true))
    }

    for (let item of options) {
      if (item.selected) {
        item.selected = false
        selected.appendChild(item)
      } else {
        unselected.appendChild(item)
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
    // Not sure what to put here yet
  }

  disconnectedCallback() {
    // Not sure what to put here yet
  }
}

// Define element if not already defined
if (!customElements.get("multi-select")) {
  customElements.define("multi-select", MultiSelect)
}