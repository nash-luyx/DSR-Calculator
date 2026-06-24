/* DSR Calculator - Live Logic V2 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const netIncomeInput = document.getElementById('net-income');
  const maxDsrInput = document.getElementById('max-dsr');
  const commitmentsContainer = document.getElementById('commitments-container');
  const addCommitmentBtn = document.getElementById('add-commitment-btn');
  const resetBtn = document.getElementById('reset-btn');

  // Initial setup
  resetCalculator();

  // --- Event Listeners ---
  
  // Net Income Input
  netIncomeInput.addEventListener('input', (e) => {
    formatCurrencyLive(e.target);
    calculateDSR();
  });
  netIncomeInput.addEventListener('focus', (e) => {
    handleInputFocus(e.target);
  });
  netIncomeInput.addEventListener('blur', (e) => {
    handleInputBlur(e.target);
    calculateDSR();
  });

  // Maximum DSR Limit Input
  maxDsrInput.addEventListener('input', (e) => {
    let cleanVal = e.target.value.replace(/[^\d]/g, '');
    if (cleanVal !== '') {
      const parsed = parseInt(cleanVal, 10);
      if (parsed > 100) {
        e.target.value = '100';
      } else {
        e.target.value = parsed.toString();
      }
    } else {
      e.target.value = '';
    }
    calculateDSR();
  });
  maxDsrInput.addEventListener('focus', (e) => {
    setTimeout(() => {
      e.target.select();
    }, 0);
  });
  maxDsrInput.addEventListener('blur', (e) => {
    if (e.target.value.trim() === '') {
      e.target.value = '60';
    }
    calculateDSR();
  });

  // Add Commitment Row Button
  addCommitmentBtn.addEventListener('click', () => {
    addCommitmentRow();
    // Auto-focus the newly added row input for faster data entry
    const inputs = commitmentsContainer.querySelectorAll('.commitment-input');
    if (inputs.length > 0) {
      inputs[inputs.length - 1].focus();
    }
  });

  // Reset Button
  resetBtn.addEventListener('click', () => {
    resetCalculator();
  });

  // Commitment Container Event Delegation
  commitmentsContainer.addEventListener('input', (e) => {
    if (e.target.classList.contains('commitment-input')) {
      formatCurrencyLive(e.target);
      calculateDSR();
    }
  });

  commitmentsContainer.addEventListener('focusin', (e) => {
    if (e.target.classList.contains('commitment-input')) {
      handleInputFocus(e.target);
    }
  });

  commitmentsContainer.addEventListener('focusout', (e) => {
    if (e.target.classList.contains('commitment-input')) {
      handleInputBlur(e.target);
      calculateDSR();
    }
  });

  commitmentsContainer.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.btn-delete');
    if (deleteBtn) {
      const row = deleteBtn.closest('.commitment-row');
      if (row) {
        row.remove();
        calculateDSR();
      }
    }
  });

  // --- Functions ---

  // Reset calculator to defaults
  function resetCalculator() {
    netIncomeInput.value = '';
    maxDsrInput.value = '60';
    
    // Clear and build exactly 3 empty commitment rows
    commitmentsContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      addCommitmentRow();
    }
    
    calculateDSR();
  }

  // Create a new commitment row
  function addCommitmentRow(value = '') {
    const row = document.createElement('div');
    row.className = 'commitment-row';
    row.innerHTML = `
      <div class="input-wrapper">
        <span class="input-prefix">RM</span>
        <input type="text" class="currency-input commitment-input" placeholder="0.00" value="${value}" autocomplete="off" inputmode="decimal">
      </div>
      <button type="button" class="btn-delete" aria-label="Delete commitment">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    `;
    commitmentsContainer.appendChild(row);
  }

  // Calculate DSR values
  function calculateDSR() {
    const income = parseFormattedNumber(netIncomeInput.value);
    const dsrLimit = parseFormattedNumber(maxDsrInput.value);

    // 1. Max Eligible Commitment
    const maxEligible = (income * dsrLimit) / 100;
    document.getElementById('max-eligible-display').textContent = formatCurrencyDisplay(maxEligible);

    // 2. Total commitments
    let totalCommitment = 0;
    const commitmentInputs = commitmentsContainer.querySelectorAll('.commitment-input');
    commitmentInputs.forEach(input => {
      totalCommitment += parseFormattedNumber(input.value);
    });

    // 3. Balance
    const balance = maxEligible - totalCommitment;

    // Update Summary Display Elements
    document.getElementById('summary-max-eligible').textContent = formatCurrencyDisplay(maxEligible);
    document.getElementById('summary-total-commitment').textContent = formatCurrencyDisplay(totalCommitment);
    document.getElementById('summary-dsr-balance').textContent = formatCurrencyDisplay(balance);

    // Update Status Cards styling & text
    const summaryCard = document.getElementById('summary-card');
    const statusBadge = document.getElementById('status-badge');
    const statusIcon = statusBadge.querySelector('.status-icon');
    const statusText = statusBadge.querySelector('.status-text');

    if (balance < 0) {
      summaryCard.className = 'summary-card status-exceeded';
      statusIcon.textContent = '❌';
      statusText.textContent = 'Exceeded';
    } else {
      summaryCard.className = 'summary-card status-eligible';
      statusIcon.textContent = '✅';
      statusText.textContent = 'Eligible';
    }
  }

  // --- Utility Formatting Helpers ---

  // Clean formatted value to raw numeric float
  function parseFormattedNumber(val) {
    if (!val) return 0;
    const clean = val.replace(/[^\d.]/g, '');
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Format currency value into output display layout (e.g. -RM 1,234.56 or RM 1,234.56)
  function formatCurrencyDisplay(amount) {
    const isNegative = amount < 0;
    const absoluteAmount = Math.abs(amount);
    const formatted = absoluteAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return isNegative ? `-RM ${formatted}` : `RM ${formatted}`;
  }

  // Format the input field values as they type (with comma grouping)
  function formatCurrencyLive(input) {
    const cleanVal = input.value.replace(/[^\d]/g, '');
    if (cleanVal === '') {
      input.value = '';
      return;
    }

    const originalLength = input.value.length;
    const cursorPosition = input.selectionStart;

    const formatted = parseInt(cleanVal, 10).toLocaleString('en-US');
    input.value = formatted;

    const newLength = formatted.length;
    const diff = newLength - originalLength;
    let newCursorPos = cursorPosition + diff;
    input.setSelectionRange(newCursorPos, newCursorPos);
  }

  // Formats field values on blur (re-adding commas and .00 decimals suffix)
  function handleInputBlur(input) {
    const val = input.value.trim();
    if (val === '') return;

    const cleanVal = val.replace(/[^\d]/g, '');
    if (cleanVal === '') {
      input.value = '';
      return;
    }

    const num = parseInt(cleanVal, 10);
    input.value = num.toLocaleString('en-US') + '.00';
  }

  // Formats values on focus (stripping the decimal .00 and selecting all text)
  function handleInputFocus(input) {
    const val = input.value;
    if (val.endsWith('.00')) {
      input.value = val.substring(0, val.length - 3);
    }
    setTimeout(() => {
      input.select();
    }, 0);
  }
});
