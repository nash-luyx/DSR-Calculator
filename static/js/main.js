// DSR Calculator - Client-side Interactive Logic

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const nettIncomeInput = document.getElementById('nettIncome');
    const maxDsrInput = document.getElementById('maxDsr');
    const maxCommitmentInput = document.getElementById('maxCommitment');
    const commitmentsList = document.getElementById('commitmentsList');
    const addCommitmentBtn = document.getElementById('addCommitmentBtn');
    const totalCommitmentDisplay = document.getElementById('totalCommitmentDisplay');
    const dsrBalanceCard = document.getElementById('dsrBalanceCard');
    const dsrBalanceVal = document.getElementById('dsrBalanceVal');
    const dsrBalanceStatus = document.getElementById('dsrBalanceStatus');
    const resetBtn = document.getElementById('resetBtn');

    let rowCounter = 0;

    // Format utility for RM Currency
    function formatCurrency(amount) {
        const isNegative = amount < 0;
        const absVal = Math.abs(amount);
        const formatted = absVal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return isNegative ? `-RM ${formatted}` : `RM ${formatted}`;
    }

    // Main DSR calculation logic
    function calculateDSR() {
        // 1. Get and parse inputs
        const nettIncome = parseFloat(nettIncomeInput.value) || 0;
        const maxDsr = parseFloat(maxDsrInput.value) || 0;

        // 2. Calculate Maximum Eligible Commitment
        const maxEligibleCommitment = nettIncome * (maxDsr / 100);
        maxCommitmentInput.value = maxEligibleCommitment.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        // 3. Sum up all active commitments
        let totalCommitment = 0;
        const commitmentFields = commitmentsList.querySelectorAll('.commitment-input');
        commitmentFields.forEach(input => {
            totalCommitment += parseFloat(input.value) || 0;
        });

        // 4. Update total commitments display
        totalCommitmentDisplay.textContent = formatCurrency(totalCommitment);

        // 5. Calculate DSR Balance
        const dsrBalance = maxEligibleCommitment - totalCommitment;
        dsrBalanceVal.textContent = formatCurrency(dsrBalance);

        // 6. Style spotlight card based on eligibility
        if (dsrBalance >= 0) {
            dsrBalanceCard.className = 'dsr-balance-card eligible';
            dsrBalanceStatus.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                <span>Customer Eligible</span>
            `;
        } else {
            dsrBalanceCard.className = 'dsr-balance-card exceeded';
            dsrBalanceStatus.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>Limit Exceeded</span>
            `;
        }
    }

    // Update commitment label indices sequentially
    function updateRowLabels() {
        const rows = commitmentsList.querySelectorAll('.commitment-row');
        rows.forEach((row, index) => {
            const label = row.querySelector('.commitment-label');
            label.textContent = `Commitment ${index + 1}`;
        });
    }

    // Create a new commitment row
    function createCommitmentRow(value = "") {
        rowCounter++;
        const rowId = `commitment-row-${rowCounter}`;
        const inputId = `commitment-input-${rowCounter}`;

        const row = document.createElement('div');
        row.className = 'commitment-row row-added';
        row.id = rowId;

        row.innerHTML = `
            <div class="commitment-inputs">
                <span class="commitment-label">Commitment</span>
                <div class="input-group">
                    <span class="input-addon">RM</span>
                    <input type="number" id="${inputId}" class="input-field commitment-input" placeholder="0.00" step="any" min="0" value="${value}">
                </div>
            </div>
            <button type="button" class="btn-delete" title="Remove Commitment">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;

        // Add event listener to delete button
        row.querySelector('.btn-delete').addEventListener('click', function() {
            row.remove();
            updateRowLabels();
            calculateDSR();
        });

        return row;
    }

    // Add commitment action
    function addCommitmentRow(value = "") {
        const row = createCommitmentRow(value);
        commitmentsList.appendChild(row);
        updateRowLabels();
        
        // Focus the newly added input field
        const inputField = row.querySelector('.commitment-input');
        if (inputField) {
            inputField.focus();
        }
    }

    // Reset the application to starting state
    function resetForm() {
        nettIncomeInput.value = '';
        maxDsrInput.value = '60';
        commitmentsList.innerHTML = '';
        
        // Load initial 3 commitment rows
        for (let i = 0; i < 3; i++) {
            const row = createCommitmentRow();
            commitmentsList.appendChild(row);
        }
        
        updateRowLabels();
        calculateDSR();
        nettIncomeInput.focus();
    }

    // --- Event Listeners ---

    // Listen to changes on inputs in Section 1
    nettIncomeInput.addEventListener('input', calculateDSR);
    maxDsrInput.addEventListener('input', calculateDSR);

    // Event delegation for dynamically added commitments
    commitmentsList.addEventListener('input', function(e) {
        if (e.target.classList.contains('commitment-input')) {
            calculateDSR();
        }
    });

    // Plus button click
    addCommitmentBtn.addEventListener('click', function() {
        addCommitmentRow();
        calculateDSR();
    });

    // Reset button click
    resetBtn.addEventListener('click', resetForm);

    // Initialize layout
    resetForm();
});
