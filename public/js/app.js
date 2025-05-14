/**
 * Main application JavaScript
 * Cross-platform compatible with mobile and desktop browsers
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
        const isNavButton = event.target.closest('#nav-toggle');
        const isNavMenu = event.target.closest('.nav-menu');
        
        if (!isNavButton && !isNavMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
    
    // User dropdown toggle
    const userAvatar = document.querySelector('.user-avatar');
    const userMenu = document.querySelector('.user-menu');
    
    if (userAvatar) {
        userAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('active');
        });
        
        // Close user dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!userMenu.contains(event.target)) {
                userMenu.classList.remove('active');
            }
        });
    }
    
    // Handle touch events for mobile devices
    document.addEventListener('touchstart', function() {
        // This empty handler enables :active CSS states on mobile
    }, {passive: true});
    
    // Detect platform for platform-specific adjustments
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // Apply platform-specific classes to body
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        if (isIOS) {
            document.body.classList.add('ios-device');
        } else if (isAndroid) {
            document.body.classList.add('android-device');
        }
    }
    
    // Fix for 100vh issue on mobile browsers
    function setAppHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    
    // Handle back button behavior for SPAs
    window.addEventListener('popstate', function(event) {
        // Handle navigation state changes
        if (event.state && event.state.page) {
            // Navigate to the appropriate page
            console.log('Navigating to:', event.state.page);
        }
    });
    
    // Detect dark mode preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDarkMode) {
        // Apply dark mode if user prefers it
        // This would be expanded in a real implementation
        console.log('User prefers dark mode');
    }
    
    // Check for online/offline status
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    function updateOnlineStatus() {
        const isOnline = navigator.onLine;
        
        if (!isOnline) {
            showNotification('You are currently offline. Some features may be unavailable.');
        }
    }
    
    // Notification system
    function showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Auto dismiss
        const dismissTimeout = setTimeout(() => {
            dismissNotification(notification);
        }, duration);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(dismissTimeout);
            dismissNotification(notification);
        });
    }
    
    function dismissNotification(notification) {
        notification.classList.remove('active');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Modify the checkAuthStatus function
    function checkAuthStatus() {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                          sessionStorage.getItem('isLoggedIn') === 'true';
        
        // Get current page
        const currentPage = window.location.pathname.split('/').pop();
        
        // List of pages that require authentication
        const protectedPages = [
            'dashboard.html',
            'components.html',
            'projects.html',
            'analytics.html',
            'profile.html',
            'settings.html'
        ];
        
        // Check if current page requires authentication
        const requiresAuth = protectedPages.some(page => currentPage === page);
        
        // If page requires auth and user is not logged in, redirect to welcome page
        if (requiresAuth && !isLoggedIn) {
            window.location.href = 'welcome.html';
        }
    }
});