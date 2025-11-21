// ========================================
// QUOTE REQUEST FORM SPECIFIC JAVASCRIPT
// Handles multi-step form validation, submission, and UX
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quoteForm');
    let currentStep = 1;
    const totalSteps = 3;
    
    if (quoteForm) {
        // Initialize form
        showStep(currentStep);
        updateProgressBar();
        
        // Radio button validation and visual feedback
        const radioButtons = document.querySelectorAll('input[name="project_type"]');
        const radioGroup = document.querySelector('.radio-group');
        
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                // Remove error state when selection is made
                if (radioGroup) {
                    radioGroup.classList.remove('error');
                    const existingError = radioGroup.querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                }
                
                // Visual feedback for selected radio
                document.querySelectorAll('.radio-option').forEach(option => {
                    option.classList.remove('selected');
                });
                this.closest('.radio-option').classList.add('selected');
            });
        });
        
        // Form submission (only for final step)
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (currentStep !== totalSteps) {
                return; // Should not happen, but safety check
            }
            
            // Validate all steps before final submission
            if (!validateCurrentStep()) {
                return;
            }
            
            if (!validateAllSteps()) {
                return;
            }
            
            // Show loading state
            const submitButton = quoteForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.classList.add('loading');
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            try {
                // Collect form data
                const formData = new FormData(quoteForm);
                const data = Object.fromEntries(formData.entries());
                
                const response = await fetch('/request-quote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showQuoteSuccessMessage();
                } else {
                    showQuoteErrorMessage(result.message || 'An error occurred. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting quote form:', error);
                showQuoteErrorMessage('Network error. Please check your connection and try again.');
            } finally {
                // Reset button state
                submitButton.classList.remove('loading');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
        
        // Real-time validation for form fields
        const requiredFields = quoteForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                // Clear errors on input
                if (this.classList.contains('error') || this.closest('.form-group')?.classList.contains('error')) {
                    clearFieldError(this);
                }
            });
            
            // Special handling for select elements
            if (field.tagName === 'SELECT') {
                field.addEventListener('change', function() {
                    if (this.classList.contains('error') || this.closest('.form-group')?.classList.contains('error')) {
                        clearFieldError(this);
                    }
                });
            }
        });
    }
    
    // Multi-step navigation functions
    window.nextStep = function() {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
                updateProgressBar();
                scrollToTop();
            }
        }
    };
    
    window.prevStep = function() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
            updateProgressBar();
            scrollToTop();
        }
    };
    
    function showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Show current step
        const currentStepEl = document.getElementById(`step${step}`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }
    }
    
    function updateProgressBar() {
        document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
            stepEl.classList.remove('active', 'completed');
            
            if (index + 1 < currentStep) {
                stepEl.classList.add('completed');
            } else if (index + 1 === currentStep) {
                stepEl.classList.add('active');
            }
        });
    }
    
    function scrollToTop() {
        const formContainer = document.querySelector('.quote-form-container');
        if (formContainer) {
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    function validateCurrentStep() {
        let isValid = true;
        
        // Get current step's required fields
        const currentStepEl = document.getElementById(`step${currentStep}`);
        if (!currentStepEl) return false;
        
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        
        // Check if at least one radio button is selected in step 1
        if (currentStep === 1) {
            const selectedRadio = document.querySelector('input[name="project_type"]:checked');
            const radioGroup = document.querySelector('.radio-group');
            
            if (!selectedRadio) {
                showFieldError(radioGroup, 'Please select a project type');
                isValid = false;
            } else {
                clearFieldError(radioGroup);
            }
        }
        
        // Validate required fields in current step
        requiredFields.forEach(field => {
            if (field.name === 'project_type') return; // Skip radio groups (handled above)
            
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });
        
        // Special validation for email
        if (currentStep === 3) {
            const emailField = currentStepEl.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value.trim())) {
                    showFieldError(emailField, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        }
        
        // Special validation for phone
        if (currentStep === 3) {
            const phoneField = currentStepEl.querySelector('input[type="tel"]');
            if (phoneField && phoneField.value.trim()) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                const cleanPhone = phoneField.value.replace(/[\s\-\(\)]/g, '');
                if (!phoneRegex.test(cleanPhone)) {
                    showFieldError(phoneField, 'Please enter a valid phone number');
                    isValid = false;
                }
            }
        }
        
        // Scroll to first error if any
        if (!isValid) {
            const firstError = currentStepEl.querySelector('.error') || currentStepEl.querySelector('.radio-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        return isValid;
    }
    
    function validateAllSteps() {
        // For final submission, validate all required fields
        let isValid = true;
        
        const allRequiredFields = quoteForm.querySelectorAll('[required]');
        allRequiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
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
        
        // Special validation for location field
        if (field.name === 'project_location' && value) {
            if (value.length < 3) {
                showFieldError(field, 'Please enter a more specific location');
                return false;
            }
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        clearFieldError(field);
        return true;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        // For radio groups, handle differently
        if (field.classList.contains('radio-group')) {
            field.classList.add('error');
            let errorElement = field.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                field.appendChild(errorElement);
            }
            errorElement.textContent = message;
        } else {
            // For regular form fields
            const parentGroup = field.closest('.form-group');
            if (parentGroup) {
                parentGroup.classList.add('error');
                let errorElement = parentGroup.querySelector('.error-message');
                if (!errorElement) {
                    errorElement = document.createElement('span');
                    errorElement.className = 'error-message';
                    parentGroup.appendChild(errorElement);
                }
                errorElement.textContent = message;
            }
        }
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        
        // For radio groups
        if (field.classList.contains('radio-group')) {
            field.classList.remove('error');
            const errorElement = field.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        } else {
            // For regular form fields
            const parentGroup = field.closest('.form-group');
            if (parentGroup) {
                parentGroup.classList.remove('error');
                const errorElement = parentGroup.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                }
            }
        }
    }
    
    function showQuoteSuccessMessage() {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <h2>Thank You!</h2>
            <p>Your multi-step quote request has been submitted successfully. We'll review your project details and get back to you within 24 hours.</p>
            <p><strong>What happens next?</strong></p>
            <ul style="text-align: left; margin: 1rem 0;">
                <li>Our team will review your complete project details</li>
                <li>We'll contact you to discuss your vision and timeline</li>
                <li>We'll provide a detailed quote based on your budget range</li>
                <li>Schedule a consultation to finalize the project scope</li>
            </ul>
        `;
        
        // Replace form with success message
        const formContainer = document.querySelector('.quote-form-container');
        formContainer.innerHTML = '';
        formContainer.appendChild(successDiv);
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    function showQuoteErrorMessage(message) {
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
        const form = document.getElementById('quoteForm');
        form.insertBefore(errorDiv, form.firstChild);
        
        // Scroll to error message
        errorDiv.scrollIntoView({ behavior: 'smooth' });
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 10000);
    }
    
    console.log('Multi-step quote form JavaScript loaded successfully!');
});
