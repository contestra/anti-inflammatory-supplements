// Application State
const appState = {
    currentTab: 'browse',
    currentView: 'grid',
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'antiInflammatory',
    myStack: [],
    expandedSupplement: null
};

// Load state from localStorage
function loadState() {
    const savedStack = localStorage.getItem('supplementStack');
    if (savedStack) {
        appState.myStack = JSON.parse(savedStack);
        updateStackCount();
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('supplementStack', JSON.stringify(appState.myStack));
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initializeEventListeners();
    renderSupplements();
    renderTemplates();
    updateStackUI();
    
    // Ensure icons are created after initial render
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
});

// Event Listeners
function initializeEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const tab = button.dataset.tab;
            switchTab(tab);
            // Force immediate repaint
            window.requestAnimationFrame(() => {
                void button.offsetHeight;
            });
        });
    });

    // Search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value.toLowerCase();
        renderSupplements();
    });

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        appState.sortBy = e.target.value;
        renderSupplements();
    });

    // View toggle
    document.querySelectorAll('.view-button').forEach(button => {
        button.addEventListener('click', () => {
            const view = button.dataset.view;
            switchView(view);
        });
    });

    // Category filters
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const category = chip.dataset.category;
            selectCategory(category);
        });
    });

    // Clear stack button
    document.querySelector('.clear-stack-btn')?.addEventListener('click', clearStack);

    // Export stack button
    document.querySelector('.export-stack-btn')?.addEventListener('click', exportStack);

    // Modal close
    document.querySelector('.modal-close')?.addEventListener('click', closeModal);
    document.getElementById('supplement-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'supplement-modal') {
            closeModal();
        }
    });
}

// Tab switching
function switchTab(tab) {
    appState.currentTab = tab;
    
    // Force immediate repaint by reading offsetHeight
    document.querySelectorAll('.tab-button').forEach(button => {
        if (button.dataset.tab === tab) {
            button.classList.remove('active');
            void button.offsetHeight; // Force reflow
            button.classList.add('active');
            button.style.borderBottom = '3px solid rgb(4, 61, 85)';
        } else {
            button.classList.remove('active');
            button.style.borderBottom = '';
        }
    });
    
    // Update tab panels immediately
    document.querySelectorAll('.tab-panel').forEach(panel => {
        if (panel.id === `${tab}-tab`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
    
    // Render content synchronously to avoid delays
    if (tab === 'browse') {
        renderSupplements();
    } else if (tab === 'templates') {
        renderTemplates();
    } else if (tab === 'mystack') {
        updateStackUI();
    }
}

// View switching
function switchView(view) {
    appState.currentView = view;
    
    // Update view buttons
    document.querySelectorAll('.view-button').forEach(button => {
        button.classList.toggle('active', button.dataset.view === view);
    });
    
    // Re-render supplements with new view
    renderSupplements();
}

// Category selection
function selectCategory(category) {
    appState.selectedCategory = category;
    
    // Update category chips
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.category === category);
    });
    
    // Re-render supplements
    renderSupplements();
}

// Render supplements
function renderSupplements() {
    const container = document.getElementById('supplements-container');
    if (!container) {
        console.error('Supplements container not found');
        return;
    }
    container.innerHTML = '';
    
    // Filter supplements
    let filteredSupplements = supplements.filter(supplement => {
        const matchesCategory = appState.selectedCategory === 'all' || supplement.category === appState.selectedCategory;
        const matchesSearch = supplement.name.toLowerCase().includes(appState.searchQuery) ||
                            supplement.description.toLowerCase().includes(appState.searchQuery);
        return matchesCategory && matchesSearch;
    });
    
    // Sort supplements
    filteredSupplements.sort((a, b) => {
        switch (appState.sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'antiInflammatory':
            default:
                return b.antiInflammatoryPotential - a.antiInflammatoryPotential;
        }
    });
    
    // Update container class based on view
    container.className = appState.currentView === 'grid' ? 'supplements-grid' : 'supplements-list';
    
    // Render each supplement
    filteredSupplements.forEach((supplement, index) => {
        const element = createSupplementElement(supplement);
        container.appendChild(element);
    });
    
    // Add a single banner after 6 items or at the end if fewer than 6
    if (filteredSupplements.length >= 6) {
        // Insert banner after the 6th item
        const sixthItem = container.children[5];
        if (sixthItem) {
            const banner = createProductBanner();
            sixthItem.insertAdjacentElement('afterend', banner);
        }
    } else if (filteredSupplements.length > 0) {
        // If less than 6 items, add banner at the end
        const banner = createProductBanner();
        container.appendChild(banner);
    }
    
    // Update icons
    lucide.createIcons();
}

// Create product banner
function createProductBanner() {
    const banner = document.createElement('a');
    banner.href = 'https://corhealth.com/#product';
    banner.className = 'product-banner';
    banner.style.gridColumn = '1 / -1'; // Span full width in grid
    banner.innerHTML = `
        <div class="product-banner-content">
            <div class="product-banner-text">
                Get the COR One™ and get clear, actionable data about your inflammation
            </div>
            <div class="product-banner-arrow">
                <i data-lucide="arrow-right"></i>
            </div>
        </div>
    `;
    return banner;
}

// Create supplement element
function createSupplementElement(supplement) {
    const template = appState.currentView === 'grid' 
        ? document.getElementById('supplement-card-template')
        : document.getElementById('supplement-list-item-template');
    
    const clone = template.content.cloneNode(true);
    const element = clone.querySelector('.supplement-card, .supplement-list-item');
    
    element.dataset.supplementId = supplement.id;
    element.querySelector('.supplement-name').textContent = supplement.name;
    element.querySelector('.supplement-description').textContent = supplement.description;
    element.querySelector('.supplement-category').textContent = supplement.category;
    element.querySelector('.supplement-dose').textContent = supplement.recommendedDose;
    element.querySelector('.evidence-badge').textContent = `Evidence: ${(supplement.evidence.score / 10).toFixed(1)}/10`;
    element.querySelector('.safety-badge').textContent = `Anti-Inflammatory: ${supplement.antiInflammatoryPotential.toFixed(1)}/10`;
    
    // Check if already in stack
    const inStack = appState.myStack.some(item => item.supplement.id === supplement.id);
    const addBtn = element.querySelector('.add-to-stack-btn');
    
    if (inStack) {
        addBtn.innerHTML = '<i data-lucide="check"></i> In Stack';
        addBtn.classList.add('in-stack');
    }
    
    // Add event listeners - handle both grid and list views
    const detailsBtn = element.querySelector('.view-details-btn');
    if (detailsBtn) {
        detailsBtn.addEventListener('click', () => showSupplementDetails(supplement));
    }
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (inStack) {
                removeFromStack(supplement.id);
            } else {
                addToStack(supplement);
            }
        });
    }
    
    return element;
}

// Show supplement details modal
function showSupplementDetails(supplement) {
    const modal = document.getElementById('supplement-modal');
    const modalBody = modal.querySelector('.modal-body');
    const inStack = appState.myStack.some(item => item.supplement.id === supplement.id);
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${supplement.name}</h2>
            <div class="modal-badges">
                <span class="evidence-badge">Evidence: ${(supplement.evidence.score / 10).toFixed(1)}/10 (${supplement.evidence.studies} studies)</span>
                <span class="safety-badge">Anti-Inflammatory: ${supplement.antiInflammatoryPotential.toFixed(1)}/10</span>
            </div>
        </div>
        
        <div class="modal-section">
            <h3>Description</h3>
            <p>${supplement.description}</p>
        </div>
        
        <div class="modal-section">
            <h3>Dosage Information</h3>
            <p><strong>Recommended Dose:</strong> ${supplement.recommendedDose}</p>
            <p><strong>Timing:</strong> ${supplement.timing}</p>
            <p><strong>Estimated Daily Cost:</strong> $${supplement.costPerDay.toFixed(2)}</p>
            <p><strong>Pills per Day:</strong> ${supplement.pillsPerDay}</p>
        </div>
        
        <div class="modal-section">
            <h3>Benefits</h3>
            <ul>
                ${supplement.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
        </div>
        
        <div class="modal-section">
            <h3>Available Forms</h3>
            <ul>
                ${supplement.forms.map(form => `<li>${form}</li>`).join('')}
            </ul>
        </div>
        
        ${supplement.sideEffects.length > 0 ? `
            <div class="modal-section">
                <h3>Potential Side Effects</h3>
                <ul>
                    ${supplement.sideEffects.map(effect => `<li>${effect}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        
        ${supplement.interactions.length > 0 ? `
            <div class="modal-section">
                <h3>Drug Interactions</h3>
                <ul>
                    ${supplement.interactions.map(interaction => `<li>${interaction}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        
        ${supplement.evidenceBreakdown ? `
            <div class="modal-section">
                <h3>Evidence Breakdown</h3>
                <div class="evidence-breakdown">
                    <p><strong>Study Portfolio:</strong><br>
                    ${supplement.evidenceBreakdown.studyCount} total studies<br>
                    ${supplement.evidenceBreakdown.studyTypes.map(type => `• ${type}`).join('<br>')}</p>
                    
                    <p><strong>Effect Size:</strong><br>
                    ${supplement.evidenceBreakdown.effectSize}</p>
                    
                    <p><strong>Mechanism:</strong><br>
                    ${supplement.evidenceBreakdown.mechanism}</p>
                    
                    <p><strong>Safety:</strong><br>
                    ${supplement.evidenceBreakdown.safety}</p>
                    
                    <p><strong>Key Study:</strong><br>
                    ${supplement.evidenceBreakdown.bestStudy}</p>
                </div>
            </div>
        ` : ''}
        
        <div class="modal-section">
            <button class="btn-primary ${inStack ? 'in-stack' : ''}" onclick="toggleStackItem(supplements.find(s => s.id === '${supplement.id}'))">
                <i data-lucide="${inStack ? 'check' : 'plus'}"></i>
                ${inStack ? 'In Stack' : 'Add to Stack'}
            </button>
        </div>
    `;
    
    modal.classList.remove('hidden');
    lucide.createIcons();
}

// Close modal
function closeModal() {
    document.getElementById('supplement-modal').classList.add('hidden');
}

// Toggle stack item
function toggleStackItem(supplement) {
    const inStack = appState.myStack.some(item => item.supplement.id === supplement.id);
    
    if (inStack) {
        removeFromStack(supplement.id);
    } else {
        addToStack(supplement);
    }
}

// Add to stack
function addToStack(supplement) {
    // Check if already in stack
    if (appState.myStack.some(item => item.supplement.id === supplement.id)) {
        return;
    }
    
    // Add to stack
    appState.myStack.push({
        supplement: supplement,
        multiplier: 1
    });
    
    // Update UI
    updateStackCount();
    updateStackUI();
    renderSupplements(); // Re-render to update button states
    saveState();
    
    // Close modal if open
    closeModal();
    
    // Show success message
    showNotification(`${supplement.name} added to your stack!`);
}

// Remove from stack
function removeFromStack(supplementId) {
    const supplement = appState.myStack.find(item => item.supplement.id === supplementId)?.supplement;
    appState.myStack = appState.myStack.filter(item => item.supplement.id !== supplementId);
    updateStackCount();
    updateStackUI();
    renderSupplements(); // Re-render to update button states
    saveState();
    
    if (supplement) {
        showNotification(`${supplement.name} removed from your stack`);
    }
}

// Update stack count
function updateStackCount() {
    const countElement = document.querySelector('.stack-count');
    if (countElement) {
        countElement.textContent = `(${appState.myStack.length})`;
    }
}

// Update stack UI
function updateStackUI() {
    const container = document.getElementById('stack-items');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (appState.myStack.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="package"></i>
                <p>Your stack is empty. Add supplements to get started!</p>
            </div>
        `;
    } else {
        appState.myStack.forEach(item => {
            const element = createStackItemElement(item);
            container.appendChild(element);
        });
    }
    
    // Update interactions
    updateInteractions();
    
    // Update summary
    updateStackSummary();
    
    // Add banner at the bottom of My Stack page
    const stackContainer = document.querySelector('.stack-container');
    if (stackContainer) {
        // Remove any existing banner first
        const existingBanner = stackContainer.querySelector('.product-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        // Add new banner
        const banner = createProductBanner();
        banner.style.marginTop = '3rem';
        stackContainer.appendChild(banner);
    }
    
    // Update icons
    lucide.createIcons();
}

// Create stack item element
function createStackItemElement(item) {
    const template = document.getElementById('stack-item-template');
    const clone = template.content.cloneNode(true);
    const element = clone.querySelector('.stack-item');
    
    element.dataset.supplementId = item.supplement.id;
    element.querySelector('.stack-item-name').textContent = item.supplement.name;
    element.querySelector('.stack-item-dose').textContent = item.supplement.recommendedDose;
    
    const multiplierInput = element.querySelector('.dose-multiplier');
    multiplierInput.value = item.multiplier;
    multiplierInput.addEventListener('change', (e) => {
        const newMultiplier = parseFloat(e.target.value);
        if (newMultiplier >= 0.5 && newMultiplier <= 5) {
            item.multiplier = newMultiplier;
            updateStackSummary();
            saveState();
        }
    });
    
    element.querySelector('.remove-from-stack-btn').addEventListener('click', () => {
        removeFromStack(item.supplement.id);
    });
    
    return element;
}

// Update interactions
function updateInteractions() {
    const panel = document.getElementById('interactions-panel');
    const list = document.getElementById('interactions-list');
    if (!panel || !list) return;
    
    list.innerHTML = '';
    
    const stackIds = appState.myStack.map(item => item.supplement.id);
    const relevantInteractions = interactions.filter(interaction => {
        const [supp1, supp2] = interaction.supplements;
        return stackIds.includes(supp1) && stackIds.includes(supp2);
    });
    
    if (relevantInteractions.length === 0) {
        panel.classList.add('hidden');
    } else {
        panel.classList.remove('hidden');
        
        relevantInteractions.forEach(interaction => {
            const item = document.createElement('div');
            item.className = 'interaction-item';
            
            const [supp1Id, supp2Id] = interaction.supplements;
            const supp1 = supplements.find(s => s.id === supp1Id);
            const supp2 = supplements.find(s => s.id === supp2Id);
            
            item.innerHTML = `
                <span class="interaction-severity ${interaction.severity}">${interaction.severity.toUpperCase()}</span>
                <strong>${supp1.name} + ${supp2.name}:</strong> ${interaction.description}
            `;
            
            list.appendChild(item);
        });
    }
}

// Update stack summary
function updateStackSummary() {
    const totalCost = appState.myStack.reduce((sum, item) => {
        return sum + (item.supplement.costPerDay * item.multiplier);
    }, 0);
    
    const totalPills = appState.myStack.reduce((sum, item) => {
        return sum + (item.supplement.pillsPerDay * item.multiplier);
    }, 0);
    
    document.getElementById('total-cost').textContent = `$${totalCost.toFixed(2)}`;
    document.getElementById('total-pills').textContent = Math.round(totalPills);
}

// Clear stack
function clearStack() {
    if (confirm('Are you sure you want to clear your entire stack?')) {
        appState.myStack = [];
        updateStackCount();
        updateStackUI();
        renderSupplements();
        saveState();
        showNotification('Stack cleared!');
    }
}

// Export stack
function exportStack() {
    if (appState.myStack.length === 0) {
        alert('Your stack is empty!');
        return;
    }
    
    let exportText = 'MY ANTI-INFLAMMATORY SUPPLEMENT STACK\n';
    exportText += '=====================================\n\n';
    
    appState.myStack.forEach(item => {
        exportText += `${item.supplement.name}\n`;
        exportText += `Dose: ${item.supplement.recommendedDose}`;
        if (item.multiplier !== 1) {
            exportText += ` (${item.multiplier}x)`;
        }
        exportText += `\nTiming: ${item.supplement.timing}\n`;
        exportText += `Cost: $${(item.supplement.costPerDay * item.multiplier).toFixed(2)}/day\n\n`;
    });
    
    const totalCost = appState.myStack.reduce((sum, item) => {
        return sum + (item.supplement.costPerDay * item.multiplier);
    }, 0);
    
    exportText += `\nTOTAL ESTIMATED DAILY COST: $${totalCost.toFixed(2)}\n`;
    
    // Check for interactions
    const stackIds = appState.myStack.map(item => item.supplement.id);
    const relevantInteractions = interactions.filter(interaction => {
        const [supp1, supp2] = interaction.supplements;
        return stackIds.includes(supp1) && stackIds.includes(supp2);
    });
    
    if (relevantInteractions.length > 0) {
        exportText += '\nPOTENTIAL INTERACTIONS:\n';
        relevantInteractions.forEach(interaction => {
            const [supp1Id, supp2Id] = interaction.supplements;
            const supp1 = supplements.find(s => s.id === supp1Id);
            const supp2 = supplements.find(s => s.id === supp2Id);
            exportText += `- ${supp1.name} + ${supp2.name}: ${interaction.description}\n`;
        });
    }
    
    // Create download
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-supplement-stack.txt';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Stack exported successfully!');
}

// Render templates
function renderTemplates() {
    const container = document.querySelector('.templates-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    stackTemplates.forEach(template => {
        const element = createTemplateElement(template);
        container.appendChild(element);
    });
    
    // Add banner at the end
    const banner = createProductBanner();
    banner.style.marginTop = '3rem';
    container.appendChild(banner);
    
    lucide.createIcons();
}

// Create template element
function createTemplateElement(template) {
    const div = document.createElement('div');
    div.className = 'template-card';
    
    div.innerHTML = `
        <div class="template-icon">
            <i data-lucide="${template.icon}"></i>
        </div>
        <h3 class="template-name">${template.name}</h3>
        <p class="template-description">${template.description}</p>
        <p class="template-count">${template.supplements.length} supplements</p>
    `;
    
    div.addEventListener('click', () => applyTemplate(template));
    
    return div;
}

// Apply template
function applyTemplate(template) {
    if (appState.myStack.length > 0) {
        if (!confirm('This will replace your current stack. Continue?')) {
            return;
        }
    }
    
    appState.myStack = [];
    
    template.supplements.forEach(supplementId => {
        const supplement = supplements.find(s => s.id === supplementId);
        if (supplement) {
            appState.myStack.push({
                supplement: supplement,
                multiplier: 1
            });
        }
    });
    
    updateStackCount();
    updateStackUI();
    renderSupplements();
    saveState();
    
    // Switch to My Stack tab
    switchTab('mystack');
    
    showNotification(`Applied "${template.name}" template!`);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #2ecc71;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        notification.style.animationFillMode = 'forwards';
        
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}