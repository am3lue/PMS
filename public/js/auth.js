/**
 * Authentication JavaScript
 * Handles user authentication functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                      sessionStorage.getItem('isLoggedIn') === 'true';
    
    // If logged in, redirect to welcome page
    if (isLoggedIn) {
        window.location.href = 'welcome.html';
        return;
    }
    
    // DOM Elements - Forms
    const loginForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('register-form');
    const resetForm = document.getElementById('reset-form');
    
    // DOM Elements - Form Containers
    const loginFormContainer = document.getElementById('login-form');
    const signupFormContainer = document.getElementById('signup-form');
    const forgotFormContainer = document.getElementById('forgot-form');
    
    // DOM Elements - Links
    const signupLink = document.getElementById('signup-link');
    const loginLink = document.getElementById('login-link');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLoginLink = document.getElementById('back-to-login');
    
    // DOM Elements - Password Toggles
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    // DOM Elements - Terms and Privacy
    const termsLink = document.getElementById('terms-link');
    const privacyLink = document.getElementById('privacy-link');
    const termsModal = document.getElementById('terms-modal');
    const privacyModal = document.getElementById('privacy-modal');
    const closeTermsModal = document.getElementById('close-terms-modal');
    const closePrivacyModal = document.getElementById('close-privacy-modal');
    const acceptTerms = document.getElementById('accept-terms');
    const acceptPrivacy = document.getElementById('accept-privacy');
    
    // URL parameter handling for direct signup
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'signup' && signupFormContainer) {
        showForm(signupFormContainer);
    }
    
    // Event Listeners - Forms
    if (loginForm) {
        loginForm.addEventListener('submit', handleSignIn);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignUp);
    }
    
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetPassword);
    }
    
    // Event Listeners - Links
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            showForm(signupFormContainer);
        });
    }
    
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showForm(loginFormContainer);
        });
    }
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showForm(forgotFormContainer);
        });
    }
    
    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showForm(loginFormContainer);
        });
    }
    
    // Event Listeners - Password Toggles
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type');
            
            if (type === 'password') {
                passwordInput.setAttribute('type', 'text');
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordInput.setAttribute('type', 'password');
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
    
    // Event Listeners - Terms and Privacy
    if (termsLink) {
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            termsModal.classList.add('show');
        });
    }
    
    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            privacyModal.classList.add('show');
        });
    }
    
    if (closeTermsModal) {
        closeTermsModal.addEventListener('click', function() {
            termsModal.classList.remove('show');
        });
    }
    
    if (closePrivacyModal) {
        closePrivacyModal.addEventListener('click', function() {
            privacyModal.classList.remove('show');
        });
    }
    
    if (acceptTerms) {
        acceptTerms.addEventListener('click', function() {
            termsModal.classList.remove('show');
            document.getElementById('terms-agree').checked = true;
        });
    }
    
    if (acceptPrivacy) {
        acceptPrivacy.addEventListener('click', function() {
            privacyModal.classList.remove('show');
        });
    }
    
    // Functions
    function showForm(formToShow) {
        // Hide all forms
        const forms = [loginFormContainer, signupFormContainer, forgotFormContainer];
        forms.forEach(form => {
            if (form) form.classList.add('hidden');
        });
        
        // Show the requested form
        if (formToShow) formToShow.classList.remove('hidden');
    }
    
    function handleSignIn(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me')?.checked || false;
        
        // Validate inputs
        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Get stored users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user with matching email
        const user = users.find(u => u.email === email);
        
        if (!user) {
            showNotification('User not found. Please check your email or sign up.', 'error');
            return;
        }
        
        // Check password
        if (user.password !== password) {
            showNotification('Invalid password. Please try again.', 'error');
            return;
        }
        
        // Login successful
        // Store user data in localStorage or sessionStorage
        const storage = rememberMe ? localStorage : sessionStorage;
        
        // Don't store password in session
        const userSession = {...user};
        delete userSession.password;
        
        storage.setItem('currentUser', JSON.stringify(userSession));
        storage.setItem('isLoggedIn', 'true');
        
        showNotification('Login successful!', 'success');
        
        // Redirect to welcome page after short delay
        setTimeout(() => {
            window.location.href = 'welcome.html';
        }, 1500);
    }
    
    function handleSignUp(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const termsAgreed = document.getElementById('terms-agree').checked;
        
        // Validate inputs
        if (!firstName || !lastName || !email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (!termsAgreed) {
            showNotification('You must agree to the Terms of Service and Privacy Policy', 'error');
            return;
        }
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            showNotification('Email is already in use. Please use a different email or login.', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(), // Use timestamp as a simple ID
            firstName,
            lastName,
            email,
            password,
            role: 'user',
            createdAt: new Date().toISOString(),
            components: [],
            projects: []
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login after signup
        const userSession = {...newUser};
        delete userSession.password;
        
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        localStorage.setItem('isLoggedIn', 'true');
        
        showNotification('Registration successful! Redirecting to welcome page...', 'success');
        
        // Redirect to welcome page after short delay
        setTimeout(() => {
            window.location.href = 'welcome.html';
        }, 1500);
    }
    
    function handleResetPassword(e) {
        e.preventDefault();
        
        const email = document.getElementById('reset-email').value;
        
        // Validate input
        if (!email) {
            showNotification('Please enter your email address', 'error');
            return;
        }
        
        // Get stored users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email exists
        const userExists = users.some(user => user.email === email);
        
        if (!userExists) {
            showNotification('No account found with this email address', 'error');
            return;
        }
        
        // In a real application, you would send a password reset email here
        // For this demo, we'll just show a success message
        
        showNotification('Password reset link has been sent to your email address', 'success');
        
        // Redirect back to login after short delay
        setTimeout(() => {
            showForm(loginFormContainer);
        }, 3000);
    }
    
    function showNotification(message, type) {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set notification content and type
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Show notification
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});