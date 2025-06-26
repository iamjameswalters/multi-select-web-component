class MultiSelect extends HTMLElement {
  static formAssociated = true;

  constructor() {
    super()

    const shadowRoot = this.attachShadow({mode: "open"})
    this.internals = this.attachInternals()
    
    // Get stylesheet URL from attribute or use default Bootstrap CDN
    const stylesheetUrl = this.getAttribute('stylesheet') || 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
    
    shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${stylesheetUrl}">
      <style>
        :host {
          display: block;
          max-width: 100%;
        }
        
        .multiselect-container {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 1rem;
          align-items: start;
          padding: 1rem;
        }
        
        .select-box {
          height: 200px;
        }
        
        .select-box option {
          padding: 0.5rem 0.5rem;
          border-bottom: 1px solid rgb(239, 239, 239);
        }
        
        .select-box option:last-child {
          border-bottom: none;
        }
        
        .btn-square {
          width: 42px;
          height: 42px;
          font-size: 1.25rem;
          font-weight: bold;
        }
        
        @media (max-width: 768px) {
          .multiselect-container {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .button-column {
            flex-direction: row !important;
            justify-content: center;
            align-self: stretch;
          }
          
        }
        
        @media (prefers-color-scheme: dark) {
          .form-select::-webkit-scrollbar {
            width: 14px;
          }

          .form-select::-webkit-scrollbar-track {
            background: rgb(45, 45, 45);
          }

          .form-select::-webkit-scrollbar-thumb {
            background-color: rgb(104, 104, 104);
            border-radius: 7px;
            border: 3px solid rgb(45, 45, 45);
          }
        }
      </style>
      <div class="multiselect-container">
        <div class="col">
          <div class="card">
            <div class="card-header">
              <h6 class="card-title mb-2"><slot name="available-label">Available</slot></h6>
              <input type="text" class="form-control available-filter" placeholder="Filter available...">
            </div>
            <select multiple class="form-select select-box unselected rounded-top-0"></select>
          </div>
        </div>
        
        <div class="d-flex flex-column gap-2 align-self-center button-column">
          <button type="button" class="btn btn-success btn-square sel-btn">+</button>
          <button type="button" class="btn btn-danger btn-square desel-btn">−</button>
        </div>
        
        <div class="col">
          <div class="card">
            <div class="card-header">
              <h6 class="card-title mb-2"><slot name="selected-label">Selected</slot></h6>
              <input type="text" class="form-control selected-filter" placeholder="Filter selected...">
            </div>
            <select multiple class="form-select select-box selected rounded-top-0"></select>
          </div>
        </div>
      </div>
    `;
    
    // Query for elements
    this.unselected = shadowRoot.querySelector('.unselected');
    this.selected = shadowRoot.querySelector('.selected');
    this.sel_btn = shadowRoot.querySelector('.sel-btn');
    this.desel_btn = shadowRoot.querySelector('.desel-btn');
    this.availableFilter = shadowRoot.querySelector('.available-filter');
    this.selectedFilter = shadowRoot.querySelector('.selected-filter');

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