// State Management
let facilities = [];
let idCounter = 0;

// DOM Elements
const entryForm = document.getElementById('entryForm');
const facilityList = document.getElementById('facilityList');
const emptyState = document.getElementById('emptyState');
const clearAllBtn = document.getElementById('clearAllBtn');

// Dashboard Elements
const totalCommitmentDisplay = document.getElementById('totalCommitmentDisplay');
const consoCard = document.getElementById('consoCard');
const projectedCommitmentDisplay = document.getElementById('projectedCommitmentDisplay');
const consoSavingsDisplay = document.getElementById('consoSavingsDisplay');

// Sub-totals Elements
const slCount = document.getElementById('slCount');
const slCommitment = document.getElementById('slCommitment');
const plCount = document.getElementById('plCount');
const plCommitment = document.getElementById('plCommitment');
const ccCount = document.getElementById('ccCount');
const ccCommitment = document.getElementById('ccCommitment');

// Input Formatters
function formatCurrency(amount) {
    return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function parseCurrency(str) {
    if (!str) return 0;
    const num = parseFloat(str.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
}

// Add Facility Event
entryForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const category = document.getElementById('inputCategory').value;
    const name = document.getElementById('inputName').value.trim() || 'Unnamed Facility';
    const limit = parseCurrency(document.getElementById('inputLimit').value);
    const outstanding = parseCurrency(document.getElementById('inputOutstanding').value);
    let commitmentInput = document.getElementById('inputCommitment').value;
    const isConso = document.getElementById('inputConso').checked;

    // specific Credit Card rule: Auto-calculate 5% of outstanding if commitment is empty
    let commitment = 0;
    if (category === 'Credit Cards' && outstanding > 0 && !commitmentInput) {
        commitment = outstanding * 0.05;
    } else {
        commitment = parseCurrency(commitmentInput);
    }

    const facility = {
        id: idCounter++,
        category,
        name,
        limit,
        outstanding,
        commitment,
        isConso
    };

    facilities.push(facility);
    
    // Reset Form
    entryForm.reset();
    document.getElementById('inputCategory').focus();

    renderFacilities();
});

// Remove Facility
function removeFacility(id) {
    const row = document.getElementById(`row-${id}`);
    if (row) {
        row.classList.add('row-exit');
        setTimeout(() => {
            facilities = facilities.filter(f => f.id !== id);
            renderFacilities();
        }, 200); // Wait for animation to finish
    } else {
        facilities = facilities.filter(f => f.id !== id);
        renderFacilities();
    }
}

// Render the List and Update Dashboard
function renderFacilities() {
    facilityList.innerHTML = '';
    
    if (facilities.length === 0) {
        emptyState.style.display = 'flex';
        updateDashboard();
        return;
    }

    emptyState.style.display = 'none';

    facilities.forEach(facility => {
        const row = document.createElement('div');
        row.id = `row-${facility.id}`;
        // Determine icons based on category
        let iconHtml = '';
        if (facility.category === 'Secure Loans') {
            iconHtml = `<i class="fa-solid fa-house text-blue-500"></i>`;
        } else if (facility.category === 'PLOANS') {
            iconHtml = `<i class="fa-solid fa-money-bill-wave text-purple-500"></i>`;
        } else {
            iconHtml = `<i class="fa-solid fa-credit-card text-orange-500"></i>`;
        }

        // Apply Conso styling
        let rowClasses = "row-enter bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-12 gap-4 items-center text-sm shadow-sm transition-all";
        if (facility.isConso) {
            rowClasses += " row-conso";
        }

        row.className = rowClasses;
        row.innerHTML = `
            <div class="col-span-2 flex items-center space-x-2 font-medium text-slate-700">
                ${iconHtml}
                <span class="truncate" title="${facility.category}">${facility.category.replace('Loans', '').replace('Cards', '').trim()}</span>
            </div>
            <div class="col-span-3 font-semibold text-slate-800 truncate" title="${facility.name}">
                ${facility.name}
                ${facility.isConso ? '<span class="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">Conso</span>' : ''}
            </div>
            <div class="col-span-2 text-right text-slate-600">
                ${facility.limit > 0 ? formatCurrency(facility.limit) : '-'}
            </div>
            <div class="col-span-2 text-right text-slate-600">
                ${facility.outstanding > 0 ? formatCurrency(facility.outstanding) : '-'}
            </div>
            <div class="col-span-2 text-right font-bold text-slate-800">
                ${formatCurrency(facility.commitment)}
            </div>
            <div class="col-span-1 text-center flex justify-center">
                <button onclick="removeFacility(${facility.id})" class="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors" title="Delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        facilityList.appendChild(row);
    });

    updateDashboard();
}

// Calculate and Update Dashboard Numbers
function updateDashboard() {
    let totals = {
        slCount: 0, slCommitment: 0,
        plCount: 0, plCommitment: 0,
        ccCount: 0, ccCommitment: 0,
        masterCommitment: 0,
        consoCommitment: 0,
        hasConso: false
    };

    facilities.forEach(f => {
        totals.masterCommitment += f.commitment;
        
        if (f.isConso) {
            totals.consoCommitment += f.commitment;
            totals.hasConso = true;
        }

        if (f.category === 'Secure Loans') {
            totals.slCount++;
            totals.slCommitment += f.commitment;
        } else if (f.category === 'PLOANS') {
            totals.plCount++;
            totals.plCommitment += f.commitment;
        } else if (f.category === 'Credit Cards') {
            totals.ccCount++;
            totals.ccCommitment += f.commitment;
        }
    });

    // Update Sub-totals
    slCount.textContent = totals.slCount;
    slCommitment.textContent = formatCurrency(totals.slCommitment);
    
    plCount.textContent = totals.plCount;
    plCommitment.textContent = formatCurrency(totals.plCommitment);
    
    ccCount.textContent = totals.ccCount;
    ccCommitment.textContent = formatCurrency(totals.ccCommitment);

    // Update Master Total
    totalCommitmentDisplay.textContent = formatCurrency(totals.masterCommitment);

    // Update Conso Card
    if (totals.hasConso) {
        consoCard.classList.remove('hidden');
        const projected = totals.masterCommitment - totals.consoCommitment;
        projectedCommitmentDisplay.textContent = formatCurrency(projected);
        consoSavingsDisplay.textContent = `RM ${formatCurrency(totals.consoCommitment)}`;
    } else {
        consoCard.classList.add('hidden');
    }
}

// Clear All Functionality
clearAllBtn.addEventListener('click', () => {
    if (facilities.length > 0 && confirm('Are you sure you want to clear all data?')) {
        facilities = [];
        renderFacilities();
        entryForm.reset();
    }
});

// Initial Render
renderFacilities();
