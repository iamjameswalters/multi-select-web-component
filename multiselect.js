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
      
      .select-header {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border: 1px solid #ced4da;
        border-bottom: none;
        border-radius: 0.375rem 0.375rem 0 0;
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .select-label {
        font-size: 1.125rem;
        font-weight: 600;
        color: #495057;
        margin: 0;
      }
      
      .filter-input {
        padding: 0.5rem;
        font-size: 0.875rem;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        background-color: #fff;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      }
      
      .filter-input:focus {
        border-color: #bebebe;
        outline: 0;
        box-shadow: 0 0 0 0.125rem rgba(125, 125, 125, 0.25);
      }
      
      .select-box {
        width: 100%;
        height: 200px;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        color: #212529;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ced4da;
        border-radius: 0 0 0.375rem 0.375rem;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      }
      
      .select-box:focus {
        color: #212529;
        background-color: #fff;
        border-color: #bebebe;
        outline: 0;
        box-shadow: 0 0 0 0.25rem rgba(125, 125, 125, 0.25);
      }
      
      .select-box option {
        padding: 0.5rem 0.5rem;
        border-bottom: 1px solid #e9ecef;
      }
      
      .select-box option:last-child {
        border-bottom: none;
      }
      
      .button-column {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-self: center;
        min-width: 38px;
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
        width: 42px;
        height: 42px;
      }
      
      .btn-success {
        color: #fff;
        background-color: #198754;
        border-color: #198754;
        font-weight: bold;
        font-size: 1.25rem;
      }
      
      .btn-success:hover {
        color: #fff;
        background-color: #157347;
        border-color: #146c43;
      }
      
      .btn-success:focus {
        color: #fff;
        background-color: #157347;
        border-color: #146c43;
        box-shadow: 0 0 0 0.25rem rgba(60, 153, 110, 0.5);
      }
      
      .btn-danger {
        color: #fff;
        background-color: #dc3545;
        border-color: #dc3545;
        font-weight: bold;
        font-size: 1.25rem;
      }
      
      .btn-danger:hover {
        color: #fff;
        background-color: #bb2d3b;
        border-color: #b02a37;
      }
      
      .btn-danger:focus {
        color: #fff;
        background-color: #bb2d3b;
        border-color: #b02a37;
        box-shadow: 0 0 0 0.25rem rgba(225, 83, 97, 0.5);
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
      
      @media (prefers-color-scheme: dark) {
        .select-header {
          background: linear-gradient(135deg, #3e3e3e 0%, #494949 100%);
          border-color: #4a5568;
        }
        
        .select-label {
          color: #e2e8f0;
        }
        
        .filter-input {
          background-color: #2d3748;
          border-color: #4a5568;
          color: #e2e8f0;
        }
        
        .filter-input::placeholder {
          color: #a0aec0;
        }
        
        .filter-input:focus {
          border-color: #acacac;
          box-shadow: 0 0 0 0.125rem rgba(172, 172, 172, 0.25);
        }
        
        .select-box {
          background-color: #2d3748;
          border-color: #4a5568;
          color: #e2e8f0;
        }
        
        .select-box:focus {
          background-color: #2d3748;
          border-color: #acacac;
          color: #e2e8f0;
          box-shadow: 0 0 0 0.25rem rgba(172, 172, 172, 0.25);
        }
        
        .select-box option {
          background-color: #2d3748;
          color: #e2e8f0;
          border-bottom-color: #4a5568;
        }
        
        :host {
          color: #e2e8f0;
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
    
    this.selectedHeader = document.createElement("div")
    this.selectedHeader.className = "select-header"
    
    this.sel_label = document.createElement("div")
    this.sel_label.className = "select-label"
    this.sel_label.innerText = "Selected"
    
    this.selectedFilter = document.createElement("input")
    this.selectedFilter.type = "text"
    this.selectedFilter.className = "filter-input"
    this.selectedFilter.placeholder = "Filter selected..."
    
    this.selectedHeader.appendChild(this.sel_label)
    this.selectedHeader.appendChild(this.selectedFilter)
    
    this.selected = document.createElement("select")
    this.selected.multiple = true
    this.selected.className = "select-box"
    
    this.selectedColumn.appendChild(this.selectedHeader)
    this.selectedColumn.appendChild(this.selected)
    
    // Create button column
    this.buttonColumn = document.createElement("div")
    this.buttonColumn.className = "button-column"
    
    this.sel_btn = document.createElement("button")
    this.sel_btn.innerText = "+"
    this.sel_btn.className = "btn btn-success"
    this.sel_btn.type = "button"
    
    this.desel_btn = document.createElement("button")
    this.desel_btn.innerText = "−"
    this.desel_btn.className = "btn btn-danger"
    this.desel_btn.type = "button"
    
    this.buttonColumn.appendChild(this.sel_btn)
    this.buttonColumn.appendChild(this.desel_btn)
    
    // Create unselected column
    this.unselectedColumn = document.createElement("div")
    this.unselectedColumn.className = "select-column"
    
    this.unselectedHeader = document.createElement("div")
    this.unselectedHeader.className = "select-header"
    
    this.unsel_label = document.createElement("div")
    this.unsel_label.className = "select-label"
    this.unsel_label.innerText = "Available"
    
    this.availableFilter = document.createElement("input")
    this.availableFilter.type = "text"
    this.availableFilter.className = "filter-input"
    this.availableFilter.placeholder = "Filter available..."
    
    this.unselectedHeader.appendChild(this.unsel_label)
    this.unselectedHeader.appendChild(this.availableFilter)
    
    this.unselected = document.createElement("select")
    this.unselected.multiple = true
    this.unselected.className = "select-box"
    
    this.unselectedColumn.appendChild(this.unselectedHeader)
    this.unselectedColumn.appendChild(this.unselected)
    
    // Assemble the component (flipped layout: Available - Buttons - Selected)
    this.container.appendChild(this.unselectedColumn)
    this.container.appendChild(this.buttonColumn)
    this.container.appendChild(this.selectedColumn)
    
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
    this.setupFiltering()

  }

  setupFiltering() {
    this.selectedFilter.addEventListener('input', () => {
      this.filterOptions(this.selected, this.selectedFilter.value)
    })
    
    this.availableFilter.addEventListener('input', () => {
      this.filterOptions(this.unselected, this.availableFilter.value)
    })
  }

  filterOptions(selectElement, filterValue) {
    const options = Array.from(selectElement.options)
    const searchText = filterValue.toLowerCase()
    
    options.forEach(option => {
      const optionText = option.textContent.toLowerCase()
      if (optionText.includes(searchText)) {
        option.style.display = ''
      } else {
        option.style.display = 'none'
      }
    })
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

  mutualExclusionHandler = (targetSelect, otherSelect) => {
    return () => {
      if (targetSelect.selectedIndex !== -1) {
        // Clear selection in the other select box
        for (let i = 0; i < otherSelect.options.length; i++) {
          otherSelect.options[i].selected = false;
        }
        this.updateButtonStates()
      }
    }
  }

  connectedCallback() {
    this.sel_btn.addEventListener("click", this.selBtnFunc)
    this.desel_btn.addEventListener("click", this.deselBtnFunc)
    this.selected.addEventListener("change", this.updateButtonStatesOnChange)
    this.unselected.addEventListener("change", this.updateButtonStatesOnChange)
    
    // Store handler references for proper cleanup
    this.selectedMutualExclusionHandler = this.mutualExclusionHandler(this.selected, this.unselected)
    this.unselectedMutualExclusionHandler = this.mutualExclusionHandler(this.unselected, this.selected)
    
    // Add mutual exclusion for selections
    this.selected.addEventListener("change", this.selectedMutualExclusionHandler)
    this.unselected.addEventListener("change", this.unselectedMutualExclusionHandler)
    
    this.setupFiltering()
  }

  disconnectedCallback() {
    this.sel_btn.removeEventListener("click", this.selBtnFunc)
    this.desel_btn.removeEventListener("click", this.deselBtnFunc)
    this.selected.removeEventListener("change", this.updateButtonStatesOnChange)
    this.unselected.removeEventListener("change", this.updateButtonStatesOnChange)
    
    // Remove mutual exclusion handlers
    if (this.selectedMutualExclusionHandler) {
      this.selected.removeEventListener("change", this.selectedMutualExclusionHandler)
    }
    if (this.unselectedMutualExclusionHandler) {
      this.unselected.removeEventListener("change", this.unselectedMutualExclusionHandler)
    }
  }
}

// Define element if not already defined
if (!customElements.get("multi-select")) {
  customElements.define("multi-select", MultiSelect)
}