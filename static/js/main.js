// ========================================
// DOSDALL CONSTRUCTION LLC - ENHANCED JAVASCRIPT
// Premium UX with Micro-Animations, Performance & Accessibility
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================
    // PERFORMANCE OPTIMIZATION UTILITIES
    // ================================
    
    // Debounce function for performance
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // ================================
    // ENHANCED NAVIGATION & MOBILE MENU
    // ================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Navbar scroll effect with performance optimization
    let lastScrollY = window.scrollY;
    
    const handleNavbarScroll = throttle(() => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    }, 16);
    
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Mobile menu toggle with smooth animations
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // ================================
    // ENHANCED PARALLAX SCROLLING EFFECTS
    // ================================
    const parallaxElements = document.querySelectorAll('.parallax, .hero-image, [data-parallax]');
    
    const updateParallax = throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            if (element) {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }, 16);
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', updateParallax);
    }
    
    // ================================
    // ENHANCED COUNTER ANIMATION
    // ================================
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach((counter, index) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            // Add a small delay for each counter
            setTimeout(() => {
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current);
                    
                    // Add loading effect
                    counter.parentElement.style.opacity = '1';
                    counter.parentElement.style.transform = 'translateY(0)';
                }, 16);
            }, index * 200);
        });
    }
    
    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const counterSection = document.querySelector('.counter-section');
    if (counterSection) {
        counterObserver.observe(counterSection);
        
        // Initial state for counters
        const counterItems = counterSection.querySelectorAll('.counter-item');
        counterItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease';
        });
    }
    
    // ================================
    // ENHANCED SCROLL ANIMATIONS & INTERSECTION OBSERVER
    // ================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Add staggered animation for service cards
                if (entry.target.classList.contains('service-card')) {
                    const cards = document.querySelectorAll('.service-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('fade-in-up');
                        }, index * 100);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.service-card, .project-card, .insight-card, .section-title, .testimonial, .counter-item'
    );
    
    animatedElements.forEach(el => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        
        observer.observe(el);
    });
    
    // ================================
    // ENHANCED BUTTON INTERACTIONS
    // ================================
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Enhanced focus states
        button.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 0 0 3px rgba(214, 158, 46, 0.3)';
        });
        
        button.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // ================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ================================
    // ENHANCED TESTIMONIAL CAROUSEL
    // ================================
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialTrack = document.querySelector('.testimonial-track');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;
    
    function updateTestimonialCarousel() {
        if (testimonialTrack && testimonials.length > 0) {
            const translateX = -currentIndex * 100;
            testimonialTrack.style.transform = `translateX(${translateX}%)`;
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }
    }
    
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateTestimonialCarousel();
    }
    
    function goToTestimonial(index) {
        currentIndex = index;
        updateTestimonialCarousel();
    }
    
    // Auto-advance carousel every 6 seconds
    if (testimonials.length > 0) {
        setInterval(nextTestimonial, 6000);
    }
    
    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToTestimonial(index));
    });
    
    // ================================
    // ENHANCED FORM HANDLING
    // ================================
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearErrors);
            
            // Add focus and blur effects
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
    });
    
    function validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        
        // Remove previous error states
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Validate based on input type
        if (input.hasAttribute('required') && !value) {
            showInputError(input, 'This field is required');
            return false;
        }
        
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showInputError(input, 'Please enter a valid email address');
                return false;
            }
        }
        
        if (input.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                showInputError(input, 'Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }
    
    function showInputError(input, message) {
        input.classList.add('error');
        
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        input.parentNode.appendChild(errorElement);
    }
    
    function clearErrors(e) {
        const input = e.target;
        input.classList.remove('error');
        
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // ================================
    // ENHANCED SERVICE CARD INTERACTIONS
    // ================================
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
        
        // Keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('.service-link');
                if (link) {
                    link.click();
                }
            }
        });
    });
    
    // ================================
    // LOADING & PROGRESSIVE ENHANCEMENT
    // ================================
    window.addEventListener('load', () => {
        // Hide any loading spinners
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
        
        // Trigger hero animation
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('hero-loaded');
        }
        
        // Staggered animation for initial load
        const initialElements = document.querySelectorAll('.service-card, .testimonial');
        initialElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('fade-in-up');
            }, index * 100);
        });
    });
    
    // ================================
    // ACCESSIBILITY ENHANCEMENTS
    // ================================
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.setAttribute('role', 'link');
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Keyboard navigation for carousel
    if (testimonials.length > 0) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                currentIndex = currentIndex > 0 ? currentIndex - 1 : testimonials.length - 1;
                updateTestimonialCarousel();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % testimonials.length;
                updateTestimonialCarousel();
            }
        });
    }
    
    // ARIA live region for dynamic content updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    
    function announceToScreenReader(message) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
    
    // ================================
    // PERFORMANCE OPTIMIZATIONS
    // ================================
    
    // Lazy load images with Intersection Observer
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
                
                announceToScreenReader('Image loaded');
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });
    
    // Preload critical resources
    function preloadResources() {
        const criticalResources = [
            '/static/css/style.css',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Text:wght@400;600&display=swap'
        ];
        
        criticalResources.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = href;
            link.as = href.includes('.css') ? 'style' : 'font';
            if (href.includes('.css')) {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    }
    
    preloadResources();
    
    // ================================
    // ERROR HANDLING & FALLBACKS
    // ================================
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        // Could send to error tracking service
        
        // Announce errors to screen readers
        if (e.error) {
            announceToScreenReader('An error occurred. Please refresh the page if problems persist.');
        }
    });
    
    // Service Worker Registration (Optional - for caching)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully:', registration.scope);
                })
                .catch(registrationError => {
                    console.log('Service Worker registration failed:', registrationError);
                });
        });
    }
    
    // ================================
    // REDUCED MOTION SUPPORT
    // ================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion() {
        if (prefersReducedMotion.matches) {
            // Disable animations for users who prefer reduced motion
            document.documentElement.style.setProperty('--transition-fast', '0.01ms');
            document.documentElement.style.setProperty('--transition-normal', '0.01ms');
            document.documentElement.style.setProperty('--transition-slow', '0.01ms');
        }
    }
    
    prefersReducedMotion.addListener(handleReducedMotion);
    handleReducedMotion();
    
    // ================================
    // HIGH CONTRAST MODE SUPPORT
    // ================================
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    function handleHighContrast() {
        if (prefersHighContrast.matches) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }
    
    prefersHighContrast.addListener(handleHighContrast);
    handleHighContrast();
    
    // ================================
    // FINAL INITIALIZATION
    // ================================
    
    // Announce page load to screen readers
    setTimeout(() => {
        announceToScreenReader('Dosdall Construction website loaded successfully');
    }, 1000);
    
    console.log('Dosdall Construction LLC website initialized with enhanced features!');
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            }, 0);
        });
    }
});

// ================================
// UTILITY FUNCTIONS (Global Scope)
// ================================

// Smooth scroll to element
window.scrollToElement = function(elementId, offset = 80) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
};

// Validate email format
window.isValidEmail = function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Format phone number
window.formatPhoneNumber = function(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
};
