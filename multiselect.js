class MultiSelect extends HTMLElement {
  static formAssociated = true;

  constructor() {
    super()

    const shadowRoot = this.attachShadow({mode: "open"})
    this.internals = this.attachInternals()
    
    // Add Bootstrap-inspired styles
    const style = document.createElement('style')
    style.textContent = `
      :host {
        display: block;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif;
        font-size: 1rem;
        line-height: 1.5;
        color: #212529;
        max-width: 100%;
      }
      
      .multiselect-container {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 1rem;
        align-items: start;
        max-width: 100%;
        padding: 1rem;
      }
      
      .select-column {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      
      .select-label {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #495057;
      }
      
      .select-box {
        width: 100%;
        min-width: 200px;
        height: 200px;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        color: #212529;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ced4da;
        border-radius: 0.375rem;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      }
      
      .select-box:focus {
        color: #212529;
        background-color: #fff;
        border-color: #86b7fe;
        outline: 0;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
      }
      
      .select-box option {
        padding: 0.25rem 0.5rem;
      }
      
      .button-column {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-self: center;
        min-width: 100px;
      }
      
      .btn {
        display: inline-block;
        padding: 0.375rem 0.75rem;
        margin-bottom: 0;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        text-align: center;
        text-decoration: none;
        vertical-align: middle;
        cursor: pointer;
        border: 1px solid transparent;
        border-radius: 0.375rem;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        white-space: nowrap;
      }
      
      .btn-primary {
        color: #fff;
        background-color: #0d6efd;
        border-color: #0d6efd;
      }
      
      .btn-primary:hover {
        color: #fff;
        background-color: #0b5ed7;
        border-color: #0a58ca;
      }
      
      .btn-primary:focus {
        color: #fff;
        background-color: #0b5ed7;
        border-color: #0a58ca;
        box-shadow: 0 0 0 0.25rem rgba(49, 132, 253, 0.5);
      }
      
      .btn-secondary {
        color: #fff;
        background-color: #6c757d;
        border-color: #6c757d;
      }
      
      .btn-secondary:hover {
        color: #fff;
        background-color: #5c636a;
        border-color: #565e64;
      }
      
      .btn-secondary:focus {
        color: #fff;
        background-color: #5c636a;
        border-color: #565e64;
        box-shadow: 0 0 0 0.25rem rgba(130, 138, 145, 0.5);
      }
      
      .btn:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
      
      @media (max-width: 768px) {
        .multiselect-container {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .button-column {
          flex-direction: row;
          justify-content: center;
          align-self: stretch;
        }
        
        .select-box {
          height: 150px;
          min-width: auto;
        }
      }
    `
    
    shadowRoot.appendChild(style)
    
    // Create main container
    this.container = document.createElement("div")
    this.container.className = "multiselect-container"
    
    // Create selected column
    this.selectedColumn = document.createElement("div")
    this.selectedColumn.className = "select-column"
    
    this.sel_label = document.createElement("div")
    this.sel_label.className = "select-label"
    this.sel_label.innerText = "Selected"
    
    this.selected = document.createElement("select")
    this.selected.multiple = true
    this.selected.className = "select-box"
    
    this.selectedColumn.appendChild(this.sel_label)
    this.selectedColumn.appendChild(this.selected)
    
    // Create button column
    this.buttonColumn = document.createElement("div")
    this.buttonColumn.className = "button-column"
    
    this.sel_btn = document.createElement("button")
    this.sel_btn.innerText = "Add →"
    this.sel_btn.className = "btn btn-primary"
    this.sel_btn.type = "button"
    
    this.desel_btn = document.createElement("button")
    this.desel_btn.innerText = "← Remove"
    this.desel_btn.className = "btn btn-secondary"
    this.desel_btn.type = "button"
    
    this.buttonColumn.appendChild(this.sel_btn)
    this.buttonColumn.appendChild(this.desel_btn)
    
    // Create unselected column
    this.unselectedColumn = document.createElement("div")
    this.unselectedColumn.className = "select-column"
    
    this.unsel_label = document.createElement("div")
    this.unsel_label.className = "select-label"
    this.unsel_label.innerText = "Available"
    
    this.unselected = document.createElement("select")
    this.unselected.multiple = true
    this.unselected.className = "select-box"
    
    this.unselectedColumn.appendChild(this.unsel_label)
    this.unselectedColumn.appendChild(this.unselected)
    
    // Assemble the component
    this.container.appendChild(this.selectedColumn)
    this.container.appendChild(this.buttonColumn)
    this.container.appendChild(this.unselectedColumn)
    
    shadowRoot.appendChild(this.container)

    // Initialize options
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
    this.updateButtonStates()

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

  updateButtonStates() {
    this.sel_btn.disabled = this.unselected.selectedIndex === -1
    this.desel_btn.disabled = this.selected.selectedIndex === -1
  }

  selBtnFunc = () => {
    const el = this.unselected
    const selectedOptions = Array.from(el.selectedOptions)
    
    selectedOptions.forEach(opt => {
      el.removeChild(opt)
      this.selected.appendChild(opt)
    })
    
    this.updateValue()
    this.updateButtonStates()
  }

  deselBtnFunc = () => {
    const el = this.selected
    const selectedOptions = Array.from(el.selectedOptions)
    
    selectedOptions.forEach(opt => {
      el.removeChild(opt)
      this.unselected.appendChild(opt)
    })
    
    this.updateValue()
    this.updateButtonStates()
  }

  updateButtonStatesOnChange = () => {
    this.updateButtonStates()
  }

  connectedCallback() {
    this.sel_btn.addEventListener("click", this.selBtnFunc)
    this.desel_btn.addEventListener("click", this.deselBtnFunc)
    this.selected.addEventListener("change", this.updateButtonStatesOnChange)
    this.unselected.addEventListener("change", this.updateButtonStatesOnChange)
  }

  disconnectedCallback() {
    this.sel_btn.removeEventListener("click", this.selBtnFunc)
    this.desel_btn.removeEventListener("click", this.deselBtnFunc)
    this.selected.removeEventListener("change", this.updateButtonStatesOnChange)
    this.unselected.removeEventListener("change", this.updateButtonStatesOnChange)
  }
}

// Define element if not already defined
if (!customElements.get("multi-select")) {
  customElements.define("multi-select", MultiSelect)
}