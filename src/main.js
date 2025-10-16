import { Rive } from '@rive-app/canvas';

console.log('Script loading...');

// Initialize everything
function init() {
  console.log('Init function called');
  
  // Get DOM elements
  const modal = document.getElementById('modal');
  const openModalBtn = document.getElementById('openModalBtn');
  const closeBtn = document.querySelector('.close-btn');
  const continueBtn = document.querySelector('.continue-btn');
  const cardTypeOptions = document.querySelectorAll('.card-type-option');
  
  // Debug: Check if elements exist
  console.log('Elements found:', {
    modal: !!modal,
    openModalBtn: !!openModalBtn,
    closeBtn: !!closeBtn,
    continueBtn: !!continueBtn,
    cardTypeOptionsCount: cardTypeOptions.length
  });

  if (!modal || !openModalBtn) {
    console.error('Critical elements missing!');
    return;
  }

  let selectedCardType = 'physical';
  let cardFlipRive = null;
  let cardTypeInput = null;
  let riveInitialized = false;

  // Modal functions
  function openModal() {
    console.log('Opening modal...');
    modal.classList.add('show');
    console.log('Modal classes after open:', modal.className);
    
    // Initialize Rive animation when modal opens for the first time
    if (!riveInitialized) {
      setTimeout(() => {
        initRive();
        riveInitialized = true;
      }, 100);
    }
  }

  function closeModal() {
    console.log('Closing modal...');
    modal.classList.remove('show');
  }

  // Event: Open modal
  openModalBtn.addEventListener('click', (e) => {
    console.log('Button clicked!', e);
    openModal();
  });

  // Event: Close modal via close button
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  // Event: Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Event: Card type selection
  cardTypeOptions.forEach(option => {
    option.addEventListener('click', () => {
      console.log('Card option clicked:', option.dataset.type);
      
      // Update UI
      cardTypeOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      // Update selection
      selectedCardType = option.dataset.type;
      
      // Update Rive animation
      if (cardTypeInput) {
        const cardTypeValue = selectedCardType === 'physical' ? 2 : 1;
        cardTypeInput.value = cardTypeValue;
        console.log(`Card type changed to: ${selectedCardType} (value: ${cardTypeValue})`);
      }
    });
  });

  // Modal step management
  const step1 = document.getElementById('modal-step-1');
  const step2 = document.getElementById('modal-step-2');
  const modalTitle2 = document.getElementById('modal-title-2');

  function goToStep2() {
    console.log('Moving to step 2 with card type:', selectedCardType);
    
    // Update title based on card type
    const cardTypeText = selectedCardType.charAt(0).toUpperCase() + selectedCardType.slice(1);
    if (modalTitle2) {
      modalTitle2.textContent = `Issue a new ${selectedCardType} card`;
    }
    
    // Hide step 1, show step 2
    if (step1 && step2) {
      step1.classList.remove('active');
      step2.classList.add('active');
    }
  }

  function goToStep1() {
    console.log('Going back to step 1');
    if (step1 && step2) {
      step2.classList.remove('active');
      step1.classList.add('active');
    }
  }

  // Event: Continue button (go to step 2)
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      goToStep2();
    });
  }

  // Event: Issue card button
  const issueCardBtn = document.querySelector('.issue-card-btn');
  if (issueCardBtn) {
    issueCardBtn.addEventListener('click', () => {
      console.log('Issue card clicked');
      alert(`Card issued successfully!`);
      closeModal();
      // Reset to step 1
      setTimeout(() => goToStep1(), 300);
    });
  }

  // Address management
  const addressSelect = document.getElementById('address-select');
  const addressTrigger = addressSelect?.querySelector('.select-trigger');
  const addressValue = addressSelect?.querySelector('.select-value');
  const addressOptions = document.getElementById('address-options');
  
  // Address data
  const addresses = {
    business: '123 Business Plaza, Suite 400, New York, NY 10013',
    personal: '456 Maple Street, Apartment 2B, San Francisco, CA 94102',
    offices: [
      { name: 'New York Office', address: '250 Park Avenue, Floor 15, New York, NY 10177' },
      { name: 'San Francisco Office', address: '101 California Street, Suite 2100, San Francisco, CA 94111' },
      { name: 'Austin Office', address: '98 San Jacinto Blvd, Suite 1500, Austin, TX 78701' },
      { name: 'Miami Office', address: '1395 Brickell Avenue, Suite 800, Miami, FL 33131' }
    ]
  };

  let currentAddressType = 'business';
  let selectedAddress = addresses.business;

  // Update address dropdown based on type
  function updateAddressDropdown(type) {
    currentAddressType = type;
    
    if (type === 'business') {
      // Business address - disabled, show business address
      addressValue.textContent = addresses.business;
      selectedAddress = addresses.business;
      addressSelect.classList.add('disabled');
      addressOptions.innerHTML = '';
    } else if (type === 'personal') {
      // Personal address - disabled, show personal address
      addressValue.textContent = addresses.personal;
      selectedAddress = addresses.personal;
      addressSelect.classList.add('disabled');
      addressOptions.innerHTML = '';
    } else if (type === 'office') {
      // Office - enabled, show office options
      addressSelect.classList.remove('disabled');
      
      // Populate office options
      addressOptions.innerHTML = '';
      addresses.offices.forEach((office, index) => {
        const option = document.createElement('div');
        option.className = 'select-option' + (index === 0 ? ' selected' : '');
        option.dataset.value = office.address;
        option.innerHTML = `
          <div class="option-title">${office.name}</div>
          <div class="option-subtitle">${office.address}</div>
        `;
        
        option.addEventListener('click', () => {
          selectedAddress = office.address;
          addressValue.textContent = office.address;
          
          // Update selected state
          addressOptions.querySelectorAll('.select-option').forEach(opt => opt.classList.remove('selected'));
          option.classList.add('selected');
          
          // Close dropdown
          addressSelect.classList.remove('open');
          
          console.log('Office address selected:', office.name);
        });
        
        addressOptions.appendChild(option);
      });
      
      // Set first office as default
      selectedAddress = addresses.offices[0].address;
      addressValue.textContent = addresses.offices[0].address;
    }
    
    console.log('Address type changed to:', type, '- Address:', selectedAddress);
  }

  // Toggle address dropdown (only if not disabled)
  if (addressTrigger) {
    addressTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!addressSelect.classList.contains('disabled')) {
        addressSelect.classList.toggle('open');
      }
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (addressSelect && !addressSelect.contains(e.target)) {
      addressSelect.classList.remove('open');
    }
  });

  // Event: Segment control buttons
  const segmentBtns = document.querySelectorAll('.segment-btn');
  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segmentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const addressType = btn.dataset.address;
      updateAddressDropdown(addressType);
    });
  });

  // Initialize with business address
  updateAddressDropdown('business');

  // Categories limits toggle
  const categoriesToggle = document.getElementById('categories-limits');
  const categoriesContent = document.getElementById('categories-content');
  
  if (categoriesToggle && categoriesContent) {
    categoriesToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        categoriesContent.classList.add('show');
        console.log('Categories limits enabled');
      } else {
        categoriesContent.classList.remove('show');
        console.log('Categories limits disabled');
      }
    });
  }

  // Categories mode radio buttons
  const categoryModeRadios = document.querySelectorAll('input[name="category-mode"]');
  const categoriesSelectTitle = document.getElementById('categories-select-title');
  
  categoryModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'allow') {
        categoriesSelectTitle.textContent = 'Select allowed categories';
      } else {
        categoriesSelectTitle.textContent = 'Select blocked categories';
      }
      console.log('Category mode changed to:', e.target.value);
    });
  });

  // Categories multiselect
  const categoriesSelect = document.getElementById('categories-select');
  const categoriesTrigger = categoriesSelect?.querySelector('.select-trigger');
  const categoriesValue = categoriesSelect?.querySelector('.select-value');
  const categoriesCheckboxes = document.querySelectorAll('#categories-options input[type="checkbox"]');
  
  let selectedCategories = [];

  // Toggle dropdown
  if (categoriesTrigger) {
    categoriesTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      categoriesSelect.classList.toggle('open');
    });
  }

  // Handle checkbox changes
  categoriesCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateSelectedCategories();
    });
  });

  function updateSelectedCategories() {
    selectedCategories = [];
    const labels = [];
    
    categoriesCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const label = checkbox.nextElementSibling.textContent;
        selectedCategories.push(checkbox.id);
        labels.push(label);
      }
    });

    // Update display
    if (labels.length === 0) {
      categoriesValue.textContent = 'Placeholder';
      categoriesValue.classList.add('placeholder');
    } else if (labels.length === 1) {
      categoriesValue.textContent = labels[0];
      categoriesValue.classList.remove('placeholder');
    } else {
      categoriesValue.textContent = `${labels.length} categories selected`;
      categoriesValue.classList.remove('placeholder');
    }

    console.log('Selected categories:', selectedCategories);
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (categoriesSelect && !categoriesSelect.contains(e.target)) {
      categoriesSelect.classList.remove('open');
    }
  });

  // GL Categories toggle
  const glCategoriesToggle = document.getElementById('gl-categories');
  const glCategoriesContent = document.getElementById('gl-categories-content');
  
  if (glCategoriesToggle && glCategoriesContent) {
    glCategoriesToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        glCategoriesContent.classList.add('show');
        console.log('GL categories enabled');
      } else {
        glCategoriesContent.classList.remove('show');
        console.log('GL categories disabled');
      }
    });
  }

  // GL Categories multiselect
  const glCategoriesSelect = document.getElementById('gl-categories-select');
  const glCategoriesTrigger = glCategoriesSelect?.querySelector('.select-trigger');
  const glCategoriesValue = glCategoriesSelect?.querySelector('.select-value');
  const glCategoriesCheckboxes = document.querySelectorAll('#gl-categories-options input[type="checkbox"]');
  
  let selectedGLCategories = [];

  // Toggle dropdown
  if (glCategoriesTrigger) {
    glCategoriesTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      glCategoriesSelect.classList.toggle('open');
    });
  }

  // Handle checkbox changes
  glCategoriesCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateSelectedGLCategories();
    });
  });

  function updateSelectedGLCategories() {
    selectedGLCategories = [];
    const labels = [];
    
    glCategoriesCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const label = checkbox.nextElementSibling.textContent;
        selectedGLCategories.push(checkbox.id);
        labels.push(label);
      }
    });

    // Update display
    if (labels.length === 0) {
      glCategoriesValue.textContent = 'Select categories';
      glCategoriesValue.classList.add('placeholder');
    } else if (labels.length === 1) {
      glCategoriesValue.textContent = labels[0];
      glCategoriesValue.classList.remove('placeholder');
    } else {
      glCategoriesValue.textContent = `${labels.length} categories selected`;
      glCategoriesValue.classList.remove('placeholder');
    }

    console.log('Selected GL categories:', selectedGLCategories);
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (glCategoriesSelect && !glCategoriesSelect.contains(e.target)) {
      glCategoriesSelect.classList.remove('open');
    }
  });

  // Custom searchable select for "Issue for"
  const customSelect = document.getElementById('issue-for-select');
  const selectTrigger = customSelect?.querySelector('.select-trigger');
  const selectValue = customSelect?.querySelector('.select-value');
  const selectOptions = customSelect?.querySelectorAll('.select-option');
  const searchInput = document.getElementById('employee-search');
  
  let selectedEmployee = null;

  // Toggle dropdown
  if (selectTrigger) {
    selectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      customSelect.classList.toggle('open');
      
      if (customSelect.classList.contains('open')) {
        searchInput?.focus();
      }
    });
  }

  // Select option
  selectOptions?.forEach(option => {
    option.addEventListener('click', () => {
      selectedEmployee = option.dataset.value;
      selectValue.textContent = option.textContent;
      selectValue.classList.remove('placeholder');
      
      // Remove previous selected
      selectOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      // Close dropdown
      customSelect.classList.remove('open');
      
      console.log('Employee selected:', selectedEmployee);
    });
  });

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      selectOptions?.forEach(option => {
        const text = option.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          option.classList.remove('hidden');
        } else {
          option.classList.add('hidden');
        }
      });
    });

    // Clear search when dropdown opens
    customSelect?.addEventListener('click', () => {
      if (customSelect.classList.contains('open')) {
        searchInput.value = '';
        selectOptions?.forEach(option => option.classList.remove('hidden'));
      }
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (customSelect && !customSelect.contains(e.target)) {
      customSelect.classList.remove('open');
    }
  });

  // Custom select for "Limit type"
  const limitTypeSelect = document.getElementById('limit-type-select');
  const limitTypeTrigger = limitTypeSelect?.querySelector('.select-trigger');
  const limitTypeValue = limitTypeSelect?.querySelector('.select-value');
  const limitTypeOptions = limitTypeSelect?.querySelectorAll('.select-option');
  
  let selectedLimitType = 'daily';

  // Toggle dropdown
  if (limitTypeTrigger) {
    limitTypeTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      limitTypeSelect.classList.toggle('open');
    });
  }

  // Select option
  limitTypeOptions?.forEach(option => {
    option.addEventListener('click', () => {
      selectedLimitType = option.dataset.value;
      const title = option.querySelector('.option-title')?.textContent;
      limitTypeValue.textContent = title;
      
      // Remove previous selected
      limitTypeOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      // Close dropdown
      limitTypeSelect.classList.remove('open');
      
      console.log('Limit type selected:', selectedLimitType);
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (limitTypeSelect && !limitTypeSelect.contains(e.target)) {
      limitTypeSelect.classList.remove('open');
    }
  });

  // Amount input formatting
  const amountInput = document.getElementById('amount');
  
  if (amountInput) {
    // Format number with commas
    function formatCurrency(value) {
      // Remove all non-digit characters
      const numericValue = value.replace(/[^\d]/g, '');
      
      if (!numericValue) return '';
      
      // Convert to number and format with commas
      const number = parseInt(numericValue, 10);
      const formatted = number.toLocaleString('en-US');
      
      return `$${formatted}`;
    }

    // Handle input
    amountInput.addEventListener('input', (e) => {
      const cursorPosition = e.target.selectionStart;
      const oldValue = e.target.value;
      const oldLength = oldValue.length;
      
      // Format the value
      const formatted = formatCurrency(oldValue);
      e.target.value = formatted;
      
      // Adjust cursor position
      const newLength = formatted.length;
      const lengthDiff = newLength - oldLength;
      const newCursorPosition = cursorPosition + lengthDiff;
      
      // Set cursor position
      e.target.setSelectionRange(newCursorPosition, newCursorPosition);
    });

    // Handle focus - select all for easy replacement
    amountInput.addEventListener('focus', (e) => {
      if (e.target.value === '$0.00' || e.target.value === '') {
        e.target.value = '';
      }
    });

    // Handle blur - add default if empty
    amountInput.addEventListener('blur', (e) => {
      if (!e.target.value || e.target.value === '$') {
        e.target.value = '$0.00';
      } else if (!e.target.value.includes('.')) {
        // If no decimal, add .00
        e.target.value = e.target.value + '.00';
      }
    });

    // Initialize with default value
    if (!amountInput.value || amountInput.value === '$0.00') {
      amountInput.placeholder = '$0.00';
    }
  }

  // Initialize Rive animation
  function initRive() {
    console.log('Initializing Rive animation...');
    
    try {
      const canvas = document.getElementById('card-flip-canvas');
      
      if (!canvas) {
        console.warn('Card flip canvas not found');
        return;
      }

      cardFlipRive = new Rive({
        src: '/animations/card_flip.riv',
        canvas: canvas,
        autoplay: true,
        stateMachines: 'CardFlip',
        onLoad: () => {
          console.log('✓ Rive animation loaded successfully');
          cardFlipRive.resizeDrawingSurfaceToCanvas();
          
          // Get state machine inputs
          const inputs = cardFlipRive.stateMachineInputs('CardFlip');
          console.log('State machine inputs:', inputs);
          
          if (inputs) {
            cardTypeInput = inputs.find(input => input.name === 'cardType');
            
            if (cardTypeInput) {
              cardTypeInput.value = 2; // Physical by default
              console.log('✓ cardType input initialized to 2 (Physical)');
            } else {
              console.warn('cardType input not found in state machine');
            }
          }
        },
        onLoadError: (error) => {
          console.error('✗ Rive animation load error:', error);
        },
      });

      // Handle window resize
      window.addEventListener('resize', () => {
        if (cardFlipRive) {
          cardFlipRive.resizeDrawingSurfaceToCanvas();
        }
      });

    } catch (error) {
      console.error('✗ Error initializing Rive:', error);
    }
  }

  // Don't start Rive animation immediately - wait for modal to open
  // initRive will be called when modal opens

  console.log('✓ Initialization complete');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  console.log('Waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', init);
} else {
  console.log('DOM already loaded, initializing now...');
  init();
}
