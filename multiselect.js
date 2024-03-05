class MultiSelect extends HTMLElement {
  constructor() {
    super()

    const shadowRoot = this.attachShadow({mode: "open"})
    
    const unselected = document.createElement("ul")
    const selected = document.createElement("ul")
    
    let options = []
    for (option of this.querySelectorAll("option")) {
      options.push(option.cloneNode(true))
    }

    console.log(options)
    for (item of options) {
      let li = document.createElement("li")
      li.innerText = item.innerText

      console.log(li)
      if (item.selected) {
        selected.appendChild(li)
      } else {
        unselected.appendChild(li)
      }
    }
    let borg = document.createElement("li")
    borg.innerText = "default"
    selected.appendChild(borg)
    const sel_label = document.createElement("h1")
    sel_label.innerText = "Selected:"
    const unsel_label = document.createElement("h1")
    unsel_label.innerText = "Unselected:"

    // shadowRoot.appendChild(sel_label)
    shadowRoot.appendChild(selected)
    // shadowRoot.appendChild(unsel_label)
    shadowRoot.appendChild(unselected)

  }

  // shadowRoot = this.attachShadow({mode: "open"})

  connectedCallback() {
    let greeting = document.createElement("h1")
    greeting.innerHTML = "Houston"
    // let template = document.createElement("template")
    // template.innerHTML = "<ul><slot></slot></ul>"
    // let templateContent = template.content
    // this.shadowRoot.appendChild(greeting)
    // this.shadowRoot.appendChild(templateContent.cloneNode(true))
  }
}

// Define element if not already defined
if (!customElements.get("multi-select")) {
  customElements.define("multi-select", MultiSelect)
}