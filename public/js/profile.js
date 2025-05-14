/**
 * Profile JavaScript
 * Handles user profile functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to welcome page if not logged in
        window.location.href = 'welcome.html';
        return;
    }
    
    // DOM Elements - Profile Tabs
    const profileTabs = document.querySelectorAll('.profile-tab');
    const profileTabContents = document.querySelectorAll('.profile-tab-content');
    
    // DOM Elements - Profile Form
    const profileForm = document.getElementById('profile-form');
    
    // DOM Elements - Profile Data
    const profileName = document.querySelector('.profile-info h2');
    const profileRole = document.querySelector('.profile-role');
    const profileEmail = document.querySelector('.profile-email');
    const profileAvatar = document.querySelector('.profile-avatar');
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    
    // DOM Elements - Project and Component Lists
    const profileProjectList = document.getElementById('profile-project-list');
    const profileComponentList = document.getElementById('profile-component-list');
    
    // Initialize profile data
    initializeProfile();
    
    // Load user projects and components
    loadUserProjects();
    loadUserComponents();
    
    // Event Listeners - Profile Tabs
    profileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Event Listeners - Profile Form
    if (profileForm) {
        profileForm.addEventListener('submit', updateProfile);
    }
    
    // Event Listeners - Change Avatar
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', changeAvatar);
    }
    
    // Functions
    function initializeProfile() {
        // Set profile data from current user
        if (profileName) profileName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        if (profileRole) profileRole.textContent = currentUser.role || 'User';
        if (profileEmail) profileEmail.textContent = currentUser.email;
        
        // Set form values
        document.getElementById('first-name').value = currentUser.firstName || '';
        document.getElementById('last-name').value = currentUser.lastName || '';
        document.getElementById('email').value = currentUser.email || '';
        document.getElementById('phone').value = currentUser.phone || '';
        document.getElementById('job-title').value = currentUser.jobTitle || '';
        document.getElementById('department').value = currentUser.department || '';
        document.getElementById('bio').value = currentUser.bio || '';
        document.getElementById('skills').value = currentUser.skills || '';
        
        // Set avatar if available
        if (currentUser.avatar) {
            document.querySelectorAll('.user-avatar, .profile-avatar').forEach(avatar => {
                avatar.src = currentUser.avatar;
            });
        }
        
        // Update user name in header
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            el.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        });
    }
    
    function switchTab(tabId) {
        // Remove active class from all tabs and content
        profileTabs.forEach(tab => tab.classList.remove('active'));
        profileTabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        document.querySelector(`.profile-tab[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }
    
    function updateProfile(e) {
        e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const jobTitle = document.getElementById('job-title').value;
        const department = document.getElementById('department').value;
        const bio = document.getElementById('bio').value;
        const skills = document.getElementById('skills').value;
        
        // Validate required fields
        if (!firstName || !lastName || !email) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Get all users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find current user in users array
        const userIndex = users.findIndex(user => user.id === currentUser.id);
        
        if (userIndex === -1) {
            showNotification('User not found', 'error');
            return;
        }
        
        // Update user data
        users[userIndex] = {
            ...users[userIndex],
            firstName,
            lastName,
            email,
            phone,
            jobTitle,
            department,
            bio,
            skills
        };
        
        // Save updated users to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user in session
        const updatedUser = {
            ...currentUser,
            firstName,
            lastName,
            email,
            phone,
            jobTitle,
            department,
            bio,
            skills
        };
        
        // Save to session/localStorage
        if (localStorage.getItem('currentUser')) {
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        if (sessionStorage.getItem('currentUser')) {
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        
        // Update profile display
        profileName.textContent = `${firstName} ${lastName}`;
        profileEmail.textContent = email;
        profileRole.textContent = jobTitle || 'User';
        
        // Update user name in header
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            el.textContent = `${firstName} ${lastName}`;
        });
        
        showNotification('Profile updated successfully', 'success');
    }
    
    function changeAvatar() {
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        // Listen for file selection
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (!file) return;
            
            // Check file type
            if (!file.type.match('image.*')) {
                showNotification('Please select an image file', 'error');
                return;
            }
            
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showNotification('Image size should be less than 2MB', 'error');
                return;
            }
            
            // Read file as data URL
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageDataUrl = e.target.result;
                
                // Update avatar in UI
                document.querySelectorAll('.user-avatar, .profile-avatar').forEach(avatar => {
                    avatar.src = imageDataUrl;
                });
                
                // Get all users
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                
                // Find current user in users array
                const userIndex = users.findIndex(user => user.id === currentUser.id);
                
                if (userIndex === -1) {
                    showNotification('User not found', 'error');
                    return;
                }
                
                // Update user avatar
                users[userIndex].avatar = imageDataUrl;
                
                // Save updated users to localStorage
                localStorage.setItem('users', JSON.stringify(users));
                
                // Update current user in session
                const updatedUser = {
                    ...currentUser,
                    avatar: imageDataUrl
                };
                
                // Save to session/localStorage
                if (localStorage.getItem('currentUser')) {
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                }
                if (sessionStorage.getItem('currentUser')) {
                    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
                }
                
                showNotification('Profile picture updated successfully', 'success');
            };
            reader.readAsDataURL(file);
        });
        
        // Trigger file selection dialog
        fileInput.click();
    }
    
    function loadUserProjects() {
        // Get user projects (in a real app, this would come from a database)
        // For demo, we'll create some sample projects
        const projects = currentUser.projects || [];
        
        if (projects.length === 0) {
            // Add sample projects for demo
            projects.push(
                {
                    id: 1,
                    name: 'Marine Compass v2',
                    description: 'Next generation marine compass with advanced magnetic sensors',
                    status: 'In Progress',
                    progress: 65,
                    dueDate: '2023-12-15'
                },
                {
                    id: 2,
                    name: 'Digital Compass Integration',
                    description: 'Integration of digital compass with navigation systems',
                    status: 'Planning',
                    progress: 25,
                    dueDate: '2024-02-28'
                }
            );
        }
        
        // Render projects
        if (profileProjectList) {
            profileProjectList.innerHTML = '';
            
            if (projects.length === 0) {
                profileProjectList.innerHTML = '<div class="empty-state">No projects found</div>';
                return;
            }
            
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'profile-project-card';
                projectCard.innerHTML = `
                    <div class="project-card-header">
                        <h4>${project.name}</h4>
                        <span class="project-status ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>
                    </div>
                    <p>${project.description}</p>
                    <div class="project-progress">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${project.progress}%"></div>
                        </div>
                        <span class="progress-text">${project.progress}%</span>
                    </div>
                    <div class="project-footer">
                        <span class="project-due-date">Due: ${formatDate(project.dueDate)}</span>
                        <a href="projects.html?id=${project.id}" class="btn-link">View Details</a>
                    </div>
                `;
                profileProjectList.appendChild(projectCard);
            });
        }
    }
    
    function loadUserComponents() {
        // Get user components (in a real app, this would come from a database)
        // For demo, we'll create some sample components
        const components = currentUser.components || [];
        
        if (components.length === 0) {
            // Add sample components for demo
            components.push(
                {
                    id: 1,
                    name: 'HMC5883L',
                    type: 'magnetic-sensor',
                    status: 'available',
                    specs: '3-Axis Digital Compass IC'
                },
                {
                    id: 2,
                    name: 'STM32F103',
                    type: 'microcontroller',
                    status: 'in-use',
                    specs: '32-bit ARM Cortex-M3 microcontroller'
                },
                {
                    id: 3,
                    name: 'OLED SSD1306',
                    type: 'display',
                    status: 'testing',
                    specs: '128x64 OLED Display Module'
                }
            );
        }
        
        // Render components
        if (profileComponentList) {
            profileComponentList.innerHTML = '';
            
            if (components.length === 0) {
                profileComponentList.innerHTML = '<div class="empty-state">No components found</div>';
                return;
            }
            
            components.forEach(component => {
                const componentCard = document.createElement('div');
                componentCard.className = 'profile-component-card';
                componentCard.innerHTML = `
                    <div class="component-card-header">
                        <h4>${component.name}</h4>
                        <span class="component-type">${formatTypeLabel(component.type)}</span>
                    </div>
                    <p>${component.specs}</p>
                    <div class="component-footer">
                        <span class="component-status ${component.status}">${formatStatusLabel(component.status)}</span>
                        <a href="components.html?id=${component.id}" class="btn-link">View Details</a>
                    </div>
                `;
                profileComponentList.appendChild(componentCard);
            });
        }
    }
    
    function formatTypeLabel(type) {
        const labels = {
            'magnetic-sensor': 'Magnetic Sensors',
            'microcontroller': 'Microcontrollers',
            'display': 'Display Units',
            'power': 'Power Systems',
            'other': 'Other'
        };
        
        return labels[type] || type;
    }
    
    function formatStatusLabel(status) {
        const labels = {
            'available': 'Available',
            'in-use': 'In Use',
            'testing': 'In Testing',
            'deprecated': 'Deprecated'
        };
        
        return labels[status] || status;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getIconForType(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Add show class after a small delay (for animation)
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Add close event
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    function getIconForType(type) {
        switch(type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            case 'info':
            default:
                return 'fa-info-circle';
        }
    }
});