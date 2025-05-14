/**
 * Welcome Page JavaScript
 * Handles welcome page functionality and user state
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                      sessionStorage.getItem('isLoggedIn') === 'true';
    
    // If not logged in, redirect to index page
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    // DOM Elements
    const welcomeUsername = document.getElementById('welcome-username');
    const welcomeAvatar = document.getElementById('welcome-avatar');
    const welcomeLogout = document.getElementById('welcome-logout');
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    
    if (currentUser) {
        // Show welcome message with username
        welcomeUsername.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        
        // Set avatar if available
        if (currentUser.avatar) {
            welcomeAvatar.src = currentUser.avatar;
        }
    }
    
    // Event Listeners
    if (welcomeLogout) {
        welcomeLogout.addEventListener('click', handleLogout);
    }
    
    // Initialize component form
    const componentForm = document.getElementById('component-form');
    if (componentForm) {
        componentForm.addEventListener('submit', handleAddComponent);
    }
    
    // Functions
    function handleLogout(e) {
        e.preventDefault();
        
        // Clear session storage
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('isLoggedIn');
        
        // If using localStorage for persistent login, clear that too
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        
        // Redirect to index page
        window.location.href = 'index.html';
    }
    
    function handleAddComponent(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('component-name').value;
        const type = document.getElementById('component-type').value;
        const specs = document.getElementById('component-specs').value;
        const status = document.getElementById('component-status').value;
        
        // Validate inputs
        if (!name) {
            alert('Please enter a component name');
            return;
        }
        
        // Create component object
        const component = {
            id: Date.now(),
            name,
            type,
            specs,
            status,
            createdBy: currentUser.id,
            createdAt: new Date().toISOString()
        };
        
        // Get existing components
        const components = JSON.parse(localStorage.getItem('components') || '[]');
        
        // Add new component
        components.push(component);
        
        // Save to localStorage
        localStorage.setItem('components', JSON.stringify(components));
        
        // Reset form
        componentForm.reset();
        
        // Show success message
        alert('Component added successfully!');
        
        // Optionally redirect to components page
        // window.location.href = 'components.html';
    }
});