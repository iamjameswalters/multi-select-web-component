class MultiSelect extends HTMLElement {
  static formAssociated = true;

  constructor() {
    super()

    const shadowRoot = this.attachShadow({mode: "open"})
    this.internals = this.attachInternals()
    
    this.unselected = document.createElement("select")
    this.unselected.multiple = true
    this.selected = document.createElement("select")
    this.selected.multiple = true

    this.options = []
    for (let option of this.querySelectorAll("option")) {
      this.options.push(option.cloneNode(true))
    }

    for (let item of this.options) {
      if (item.selected) {
        item.selected = false 
        this.selected.appendChild(item)
      } else {
        this.unselected.appendChild(item)
      }
    }

    this.updateValue()
    
    this.sel_label = document.createElement("h1")
    this.sel_label.innerText = "Selected:"
    this.unsel_label = document.createElement("h1")
    this.unsel_label.innerText = "Unselected:"

    this.sel_btn = document.createElement("button")
    this.sel_btn.innerText = "Select"
    this.desel_btn = document.createElement("button")
    this.desel_btn.innerText = "Deselect"
    this.btn_div = document.createElement("div")
    this.btn_div.appendChild(this.sel_btn)
    this.btn_div.appendChild(this.desel_btn)

    shadowRoot.appendChild(this.sel_label)
    shadowRoot.appendChild(this.selected)
    shadowRoot.appendChild(this.btn_div)
    shadowRoot.appendChild(this.unsel_label)
    shadowRoot.appendChild(this.unselected)

  }

  set value(value) {
    this._value = value;
    this.internals.setFormValue(value);
  }
  
  get value() {
    return this._value
  }

  updateValue() {
    let valueArray = []
    for (let option of this.selected.options) {
      valueArray.push(option.value)
    }
    this.value = valueArray
  }

  selBtnFunc = () => {
    const el = this.unselected
    const opt = el.options[el.selectedIndex]
    el.removeChild(opt)
    this.selected.appendChild(opt)
    this.updateValue()
  }

  deselBtnFunc = () => {
    const el = this.selected
    const opt = el.options[el.selectedIndex]
    el.removeChild(opt)
    this.unselected.appendChild(opt)
    this.updateValue()
  }

  connectedCallback() {
    this.sel_btn.addEventListener("click", this.selBtnFunc)
    this.desel_btn.addEventListener("click", this.deselBtnFunc)
  }

  disconnectedCallback() {
    this.sel_btn.removeEventListener("click", this.selBtnFunc)
    this.desel_btn.removeEventListener("click", this.deselBtnFunc)
  }
}

// Define element if not already defined
if (!customElements.get("multi-select")) {
  customElements.define("multi-select", MultiSelect)
}