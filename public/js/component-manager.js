document.addEventListener('DOMContentLoaded', function() {
    // Component data
    const componentTypes = {
        'magnetic-sensor': 'Magnetic Sensors',
        'microcontroller': 'Microcontrollers',
        'display': 'Display Units',
        'power': 'Power Systems',
        'other': 'Other Components'
    };
    
    const componentStatuses = {
        'available': { label: 'Available', color: 'var(--success-color)' },
        'in-use': { label: 'In Use', color: 'var(--primary-color)' },
        'testing': { label: 'In Testing', color: 'var(--warning-color)' },
        'deprecated': { label: 'Deprecated', color: 'var(--danger-color)' }
    };
    
    // Initialize components
    loadComponents();
    
    // Component form handling
    const componentForm = document.getElementById('component-form');
    if (componentForm) {
        componentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addComponent();
        });
    }
    
    // New component button
    const newComponentBtn = document.getElementById('new-component-btn');
    if (newComponentBtn) {
        newComponentBtn.addEventListener('click', function() {
            openComponentModal();
        });
    }
    
    // Component modal
    const componentModal = document.getElementById('component-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelComponentBtn = document.getElementById('cancel-component');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeComponentModal);
    }
    
    if (cancelComponentBtn) {
        cancelComponentBtn.addEventListener('click', closeComponentModal);
    }
    
    // Close modal when clicking outside
    if (componentModal) {
        componentModal.addEventListener('click', function(e) {
            if (e.target === componentModal) {
                closeComponentModal();
            }
        });
        
        // Prevent closing when clicking inside modal content
        const modalContent = componentModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
    
    // Save component button
    const saveComponentBtn = document.getElementById('save-component');
    if (saveComponentBtn) {
        saveComponentBtn.addEventListener('click', function() {
            const form = document.getElementById('component-form');
            if (form.checkValidity()) {
                addComponent();
            } else {
                form.reportValidity();
            }
        });
    }
    
    // Component search
    const componentSearch = document.getElementById('component-search');
    if (componentSearch) {
        componentSearch.addEventListener('input', function() {
            filterComponents(this.value);
        });
        
        // Clear search on mobile when X is clicked
        componentSearch.addEventListener('search', function() {
            filterComponents(this.value);
        });
    }
    
    // Component filters
    const filterComponentsBtn = document.getElementById('filter-components');
    const filterMenu = document.getElementById('filter-menu');
    
    if (filterComponentsBtn && filterMenu) {
        filterComponentsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            filterMenu.classList.toggle('active');
        });
        
        // Close filter menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!filterMenu.contains(e.target) && e.target !== filterComponentsBtn) {
                filterMenu.classList.remove('active');
            }
        });
        
        // Filter checkboxes
        const filterCheckboxes = filterMenu.querySelectorAll('input[type="checkbox"]');
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
    }
    
    // Functions
    
    function loadComponents() {
        const componentList = document.getElementById('component-list');
        if (!componentList) return;
        
        // Show loading state
        componentList.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading components...</div>';
        
        // Fetch components from API
        fetch('/api/components')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(components => {
                displayComponents(components);
            })
            .catch(error => {
                console.error('Error fetching components:', error);
                componentList.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to load components. Please try again later.</p>
                        <button class="btn btn-primary btn-sm" onclick="loadComponents()">Retry</button>
                    </div>
                `;
            });
    }
    
    function displayComponents(components) {
        const componentList = document.getElementById('component-list');
        if (!componentList) return;
        
        if (components.length === 0) {
            componentList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-microchip"></i>
                    <p>No components found</p>
                    <button class="btn btn-primary btn-sm" id="empty-add-component">Add Component</button>
                </div>
            `;
            
            const emptyAddBtn = document.getElementById('empty-add-component');
            if (emptyAddBtn) {
                emptyAddBtn.addEventListener('click', openComponentModal);
            }
            
            return;
        }
        
        componentList.innerHTML = '';
        
        components.forEach(component => {
            const componentCard = document.createElement('div');
            componentCard.className = 'component-item';
            componentCard.dataset.id = component.id;
            componentCard.dataset.type = component.type;
            componentCard.dataset.status = component.status;
            
            const statusStyle = componentStatuses[component.status] || { label: 'Unknown', color: '#999' };
            
            componentCard.innerHTML = `
                <div class="component-header">
                    <h3 class="component-name">${component.name}</h3>
                    <span class="component-status" style="background-color: ${statusStyle.color}">
                        ${statusStyle.label}
                    </span>
                </div>
                <div class="component-type">${formatTypeLabel(component.type)}</div>
                <div class="component-specs">${component.specs || 'No specifications provided'}</div>
                <div class="component-actions">
                    <button class="btn-icon view-component" data-id="${component.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon edit-component" data-id="${component.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-component" data-id="${component.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            componentList.appendChild(componentCard);
            
            // Add event listeners
            const viewBtn = componentCard.querySelector('.view-component');
            const editBtn = componentCard.querySelector('.edit-component');
            const deleteBtn = componentCard.querySelector('.delete-component');
            
            viewBtn.addEventListener('click', function() {
                viewComponent(component.id);
            });
            
            editBtn.addEventListener('click', function() {
                editComponent(component.id);
            });
            
            deleteBtn.addEventListener('click', function() {
                deleteComponent(component.id);
            });
        });
    }
    
    function formatTypeLabel(type) {
        return componentTypes[type] || 'Other Components';
    }
    
    function openComponentModal(componentData = null) {
        const componentModal = document.getElementById('component-modal');
        const modalTitle = componentModal.querySelector('.modal-title');
        const componentForm = document.getElementById('component-form');
        const saveBtn = document.getElementById('save-component');
        
        // Reset form
        componentForm.reset();
        
        if (componentData) {
            // Edit mode
            modalTitle.textContent = 'Edit Component';
            saveBtn.textContent = 'Update Component';
            
            // Fill form with component data
            document.getElementById('component-id').value = componentData.id;
            document.getElementById('component-name').value = componentData.name;
            document.getElementById('component-type').value = componentData.type;
            document.getElementById('component-specs').value = componentData.specs || '';
            document.getElementById('component-status').value = componentData.status;
        } else {
            // Add mode
            modalTitle.textContent = 'Add New Component';
            saveBtn.textContent = 'Add Component';
            document.getElementById('component-id').value = '';
        }
        
        // Show modal
        componentModal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Focus first input
        setTimeout(() => {
            document.getElementById('component-name').focus();
        }, 100);
    }
    
    function closeComponentModal() {
        const componentModal = document.getElementById('component-modal');
        componentModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
    

function addComponent() {
    const componentId = document.getElementById('component-id').value;
    const componentName = document.getElementById('component-name').value;
    const componentType = document.getElementById('component-type').value;
    const componentSpecs = document.getElementById('component-specs').value;
    const componentStatus = document.getElementById('component-status').value;

    const componentData = {
        name: componentName,
        type: componentType,
        specs: componentSpecs,
        status: componentStatus
    };

    if (componentId) {
        // Update existing component
        componentData.id = componentId;
        fetch(`/api/components/${componentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(componentData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeComponentModal();
                loadComponents(); // Refresh the component list
                showNotification('Component updated successfully', 'success');
            } else {
                showNotification('Failed to update component', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred while updating the component', 'error');
        });
    } else {
        // Add new component
        fetch('/api/components', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(componentData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeComponentModal();
                loadComponents(); // Refresh the component list
                showNotification('Component added successfully', 'success');
            } else {
                showNotification('Failed to add component', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred while adding the component', 'error');
        });
    }
}})