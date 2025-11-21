// ========================================
// CONSULTATION FORM JAVASCRIPT
// Handles form validation, submission, and UX
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const consultationForm = document.getElementById('consultationForm');
    
    if (consultationForm) {
        // Form submission handler
        consultationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            if (!validateForm()) {
                return;
            }
            
            // Show loading state
            const submitButton = consultationForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.classList.add('loading');
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            try {
                // Collect form data
                const formData = new FormData(consultationForm);
                const data = Object.fromEntries(formData.entries());
                
                const response = await fetch('/request-consultation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showConsultationSuccessMessage();
                } else {
                    showConsultationErrorMessage(result.message || 'An error occurred. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting consultation form:', error);
                showConsultationErrorMessage('Network error. Please check your connection and try again.');
            } finally {
                // Reset button state
                submitButton.classList.remove('loading');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
        
        // Real-time validation for form fields
        const requiredFields = consultationForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                // Clear errors on input
                clearFieldError(this);
            });
        });
        
        // Email validation on input
        const emailField = consultationForm.querySelector('input[type="email"]');
        if (emailField) {
            emailField.addEventListener('input', function() {
                if (this.value.trim() && !isValidEmail(this.value.trim())) {
                    showFieldError(this, 'Please enter a valid email address');
                } else {
                    clearFieldError(this);
                }
            });
        }
        
        // Phone validation on input
        const phoneField = consultationForm.querySelector('input[type="tel"]');
        if (phoneField) {
            phoneField.addEventListener('input', function() {
                if (this.value.trim() && !isValidPhone(this.value.trim())) {
                    showFieldError(this, 'Please enter a valid phone number');
                } else {
                    clearFieldError(this);
                }
            });
        }
    }
    
    // Global function for back button
    window.goBack = function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Fallback to homepage if no history
            window.location.href = '/';
        }
    };
    
    function validateForm() {
        let isValid = true;
        const requiredFields = consultationForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            if (!isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            if (!isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        clearFieldError(field);
        return true;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        // Remove common formatting characters
        const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
        // Check for valid phone number (10-15 digits, optional country code)
        const phoneRegex = /^[\+]?[1-9][\d]{0,14}$/;
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        const parentGroup = field.closest('.form-group');
        if (parentGroup) {
            parentGroup.classList.add('error');
            const errorElement = parentGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
        }
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        
        const parentGroup = field.closest('.form-group');
        if (parentGroup) {
            parentGroup.classList.remove('error');
            const errorElement = parentGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    }
    
    function showConsultationSuccessMessage() {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <h2>Thank You!</h2>
            <p>Your consultation request has been submitted successfully. We'll contact you within 24 hours to schedule your personalized consultation.</p>
            <p><strong>What happens next?</strong></p>
            <ul style="text-align: left; margin: 1rem 0;">
                <li>Our team will review your request</li>
                <li>We'll contact you to schedule a convenient time</li>
                <li>During the consultation, we'll discuss your project vision</li>
                <li>We'll provide initial guidance and next steps</li>
            </ul>
            <p><em>We're excited to help bring your vision to life!</em></p>
        `;
        
        // Replace form with success message
        const formContainer = document.querySelector('.consultation-form-container');
        formContainer.innerHTML = '';
        formContainer.appendChild(successDiv);
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    function showConsultationErrorMessage(message) {
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = `
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            padding: 1rem;
            margin-bottom: 1rem;
            color: #721c24;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <strong>Error:</strong> ${message}
            <br><br>
            <button type="button" onclick="this.parentElement.remove()" style="
                background: #dc3545;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
            ">Dismiss</button>
        `;
        
        // Insert error message at top of form
        consultationForm.insertBefore(errorDiv, consultationForm.firstChild);
        
        // Scroll to error message
        errorDiv.scrollIntoView({ behavior: 'smooth' });
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 10000);
    }
    
    console.log('Consultation form JavaScript loaded successfully!');
});
