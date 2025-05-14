/**
 * Projects Management JavaScript
 * Handles project-related functionality
 * Cross-platform compatible with mobile and desktop browsers
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize projects
    loadProjects();
    
    // Project form handling
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProject();
        });
    }
    
    // New project button
    const newProjectBtn = document.getElementById('new-project-btn');
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', function() {
            openProjectModal();
        });
    }
    
    // Project modal controls
    const projectModal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelProjectBtn = document.getElementById('cancel-project');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeProjectModal);
    }
    
    if (cancelProjectBtn) {
        cancelProjectBtn.addEventListener('click', closeProjectModal);
    }
    
    // Close modal when clicking outside
    if (projectModal) {
        projectModal.addEventListener('click', function(e) {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });
        
        // Prevent closing when clicking inside modal content
        const modalContent = projectModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
    
    // Save project button
    const saveProjectBtn = document.getElementById('save-project');
    if (saveProjectBtn) {
        saveProjectBtn.addEventListener('click', function() {
            const form = document.getElementById('project-form');
            if (form.checkValidity()) {
                saveProject();
            } else {
                form.reportValidity();
            }
        });
    }
    
    // Project search
    const projectSearch = document.getElementById('project-search');
    if (projectSearch) {
        projectSearch.addEventListener('input', function() {
            filterProjects(this.value);
        });
        
        // Clear search on mobile when X is clicked
        projectSearch.addEventListener('search', function() {
            filterProjects(this.value);
        });
    }
    
    // Project filters
    const filterProjectsBtn = document.getElementById('filter-projects');
    const filterMenu = document.getElementById('filter-menu');
    
    if (filterProjectsBtn && filterMenu) {
        filterProjectsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            filterMenu.classList.toggle('active');
        });
        
        // Close filter menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!filterMenu.contains(e.target) && e.target !== filterProjectsBtn) {
                filterMenu.classList.remove('active');
            }
        });
        
        // Filter checkboxes
        const filterCheckboxes = filterMenu.querySelectorAll('input[type="checkbox"]');
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
    }
    
    // Project details modal
    const projectDetailsModal = document.getElementById('project-details-modal');
    const closeDetailsModalBtn = document.getElementById('close-details-modal');
    const closeDetailsBtn = document.getElementById('close-details');
    
    if (closeDetailsModalBtn) {
        closeDetailsModalBtn.addEventListener('click', closeProjectDetailsModal);
    }
    
    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', closeProjectDetailsModal);
    }
    
    // Close details modal when clicking outside
    if (projectDetailsModal) {
        projectDetailsModal.addEventListener('click', function(e) {
            if (e.target === projectDetailsModal) {
                closeProjectDetailsModal();
            }
        });
        
        // Prevent closing when clicking inside modal content
        const modalContent = projectDetailsModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
    
    // Initialize charts
    initCharts();
    
    // Functions
    
    function loadProjects() {
        const projectList = document.getElementById('project-list');
        if (!projectList) return;
        
        // Show loading state
        projectList.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading projects...</div>';
        
        // Fetch projects from API
        fetch('/api/projects')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(projects => {
                displayProjects(projects);
                updateCharts(projects);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
                projectList.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to load projects. Please try again later.</p>
                        <button class="btn btn-primary btn-sm" onclick="loadProjects()">Retry</button>
                    </div>
                `;
            });
    }
    
    function displayProjects(projects) {
        const projectList = document.getElementById('project-list');
        if (!projectList) return;
        
        if (projects.length === 0) {
            projectList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-project-diagram"></i>
                    <p>No projects found</p>
                    <button class="btn btn-primary btn-sm" id="empty-add-project">Create Project</button>
                </div>
            `;
            
            const emptyAddBtn = document.getElementById('empty-add-project');
            if (emptyAddBtn) {
                emptyAddBtn.addEventListener('click', openProjectModal);
            }
            
            return;
        }
        
        projectList.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-item';
            projectCard.dataset.id = project.id;
            projectCard.dataset.status = project.status;
            
            const statusClass = `status-${project.status}`;
            const daysLeft = calculateDaysLeft(project.end_date);
            const daysLeftText = daysLeft > 0 ? `${daysLeft} days left` : 'Overdue';
            
            projectCard.innerHTML = `
                <div class="project-header">
                    <h3 class="project-name">${project.name}</h3>
                    <span class="project-status ${statusClass}">${formatStatus(project.status)}</span>
                </div>
                <div class="project-description">${truncateText(project.description, 100)}</div>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${project.progress}%"></div>
                    </div>
                    <span class="progress-text">${project.progress}%</span>
                </div>
                <div class="project-meta">
                    <div class="project-date">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(project.end_date)} (${daysLeftText})</span>
                    </div>
                    <div class="project-team">
                        <i class="fas fa-users"></i>
                        <span>${project.team.length} members</span>
                    </div>
                </div>
                <div class="project-actions">
                    <button class="btn-icon view-project" data-id="${project.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon edit-project" data-id="${project.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            `;
            
            projectList.appendChild(projectCard);
            
            // Add event listeners
            const viewBtn = projectCard.querySelector('.view-project');
            const editBtn = projectCard.querySelector('.edit-project');
            
            viewBtn.addEventListener('click', function() {
                viewProject(project.id);
            });
            
            editBtn.addEventListener('click', function() {
                editProject(project.id);
            });
            
            // Make the entire card clickable for viewing project details
            projectCard.addEventListener('click', function(e) {
                // Ignore clicks on buttons
                if (!e.target.closest('.project-actions')) {
                    viewProject(project.id);
                }
            });
        });
    }
    
    function viewProject(projectId) {
        // Fetch project details
        fetch(`/api/projects/${projectId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(project => {
                displayProjectDetails(project);
            })
            .catch(error => {
                console.error('Error fetching project details:', error);
                showNotification('Failed to load project details. Please try again.', 'error');
            });
    }
    
    function displayProjectDetails(project) {
        // Set project details in modal
        document.getElementById('detail-project-name').textContent = project.name;
        document.getElementById('detail-project-description').textContent = project.description;
        document.getElementById('detail-start-date').textContent = formatDate(project.start_date);
        document.getElementById('detail-end-date').textContent = formatDate(project.end_date);
        
        // Calculate duration
        const startDate = new Date(project.start_date);
        const endDate = new Date(project.end_date);
        const durationDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
        document.getElementById('detail-duration').textContent = `${durationDays} days`;
        
        // Set status
        const statusElement = document.getElementById('detail-status');
        statusElement.textContent = formatStatus(project.status);
        statusElement.className = `status-badge status-${project.status}`;
        
        // Set progress
        document.getElementById('detail-progress').style.width = `${project.progress}%`;
        document.getElementById('detail-progress-text').textContent = `${project.progress}%`;
        
        // Set components
        const componentsContainer = document.getElementById('detail-components');
        componentsContainer.innerHTML = '';
        
        if (project.components && project.components.length > 0) {
            // Fetch component details
            fetchComponentDetails(project.components).then(components => {
                components.forEach(component => {
                    const tag = document.createElement('span');
                    tag.className = 'component-tag';
                    tag.textContent = component.name;
                    componentsContainer.appendChild(tag);
                });
            });
        } else {
            componentsContainer.innerHTML = '<p class="text-muted">No components assigned</p>';
        }
        
        // Set team members
        const teamContainer = document.getElementById('detail-team');
        teamContainer.innerHTML = '';
        
        if (project.team && project.team.length > 0) {
            // Fetch team member details
            fetchTeamDetails(project.team).then(members => {
                members.forEach(member => {
                    const memberItem = document.createElement('div');
                    memberItem.className = 'team-member';
                    memberItem.innerHTML = `
                        <img src="${member.avatar || 'img/default-avatar.jpg'}" alt="${member.name}" class="team-avatar">
                        <div class="team-info">
                            <div class="team-name">${member.name}</div>
                            <div class="team-role">${member.role}</div>
                        </div>
                    `;
                    teamContainer.appendChild(memberItem);
                });
            });
        } else {
            teamContainer.innerHTML = '<p class="text-muted">No team members assigned</p>';
        }
        
        // Set updates
        const updatesContainer = document.getElementById('detail-updates');
        updatesContainer.innerHTML = '';
        
        if (project.updates && project.updates.length > 0) {
            project.updates.forEach(update => {
                const updateItem = document.createElement('li');
                updateItem.className = 'update-item';
                updateItem.innerHTML = `
                    <div class="update-meta">
                        <span class="update-date">${formatDate(update.date)}</span>
                        <span class="update-user">${update.user}</span>
                    </div>
                    <div class="update-message">${update.message}</div>
                `;
                updatesContainer.appendChild(updateItem);
            });
        } else {
            updatesContainer.innerHTML = '<p class="text-muted">No recent updates</p>';
        }
        
        // Set up action buttons
        const editProjectBtn = document.getElementById('edit-project');
        const deleteProjectBtn = document.getElementById('delete-project');
        
        editProjectBtn.onclick = function() {
            closeProjectDetailsModal();
            editProject(project.id);
        };
        
        deleteProjectBtn.onclick = function() {
            if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
                deleteProject(project.id);
            }
        };
        
        // Show modal
        const projectDetailsModal = document.getElementById('project-details-modal');
        projectDetailsModal.classList.add('active');
        document.body.classList.add('modal-open');
    }
    
    function closeProjectDetailsModal() {
        const projectDetailsModal = document.getElementById('project-details-modal');
        projectDetailsModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
    
    function editProject(projectId) {
        // Fetch project details
        fetch(`/api/projects/${projectId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(project => {
                openProjectModal(project);
            })
            .catch(error => {
                console.error('Error fetching project details:', error);
                showNotification('Failed to load project details for editing. Please try again.', 'error');
            });
    }
    
    function openProjectModal(projectData = null) {
        // Load components and team members for selection
        Promise.all([
            loadComponentsForSelection(),
            loadTeamMembersForSelection()
        ]).catch(error => {
            console.error('Error loading modal data:', error);
            showNotification('Failed to load required data. Please try again.', 'error');
        });
        
        const projectModal = document.getElementById('project-modal');
        const modalTitle = projectModal.querySelector('.modal-title');
        const projectForm = document.getElementById('project-form');
        const saveBtn = document.getElementById('save-project');
        
        // Reset form and set default dates
        projectForm.reset();
        
        const today = new Date();
        const defaultEndDate = new Date(today);
        defaultEndDate.setDate(today.getDate() + 30);
        
        document.getElementById('project-start-date').value = formatDate(today);
        document.getElementById('project-end-date').value = formatDate(defaultEndDate);
        
        // Helper function to format date to YYYY-MM-DD
        function formatDate(date) {
            return date.toISOString().split('T')[0];
        }
    }
})