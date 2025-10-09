/**
 * Medical Clinic Website - Main JavaScript File
 * Handles all interactive functionality including navigation, forms, animations, and accessibility
 */

// Global variables
let currentTestimonialIndex = 0;
let testimonialInterval;
let isFormSubmitting = false;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize all app functionality
 */
function initializeApp() {
    // Core functionality
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeThemeToggle();
    
    // Page-specific functionality
    initializeTestimonials();
    initializeForms();
    initializeGallery();
    initializeAccessibility();
    
    // Performance optimizations
    initializeLazyLoading();
    
    console.log('Medical Clinic Website initialized successfully');
}

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update ARIA attributes for accessibility
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                navToggle.focus(); // Return focus to toggle button
            }
        });
    }
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll effects and header behavior
 */
function initializeScrollEffects() {
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (header) {
            // Add scrolled class for styling
            if (scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Back to top button
    createBackToTopButton();
}

/**
 * Create and manage back to top button
 */
function createBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-green);
        color: var(--white);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-fast);
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    }, { passive: true });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Scroll animations and intersection observer
 */
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Counter animations for statistics
    initializeCounters();
}

/**
 * Initialize counter animations
 */
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/**
 * Animate counter to target value
 */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const start = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/**
 * Theme toggle functionality (Dark/Light mode)
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get saved theme or default to system preference
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = prefersDark.matches ? 'dark' : 'light';
    }
    
    // Apply theme
    applyTheme(currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }
    
    // Listen for system theme changes
    prefersDark.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Apply theme to document
 */
function applyTheme(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    
    document.documentElement.setAttribute('data-theme', theme);
    
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        themeToggle.setAttribute('aria-label', 
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }
}

/**
 * Testimonials carousel functionality
 */
function initializeTestimonials() {
    const carousel = document.getElementById('testimonials-carousel');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    // Auto-play testimonials
    function startTestimonialAutoplay() {
        testimonialInterval = setInterval(() => {
            nextTestimonial();
        }, 5000); // Change every 5 seconds
    }
    
    function stopTestimonialAutoplay() {
        if (testimonialInterval) {
            clearInterval(testimonialInterval);
        }
    }
    
    function showTestimonial(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }
    
    function nextTestimonial() {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % totalSlides;
        showTestimonial(currentTestimonialIndex);
    }
    
    function prevTestimonial() {
        currentTestimonialIndex = (currentTestimonialIndex - 1 + totalSlides) % totalSlides;
        showTestimonial(currentTestimonialIndex);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopTestimonialAutoplay();
            nextTestimonial();
            startTestimonialAutoplay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopTestimonialAutoplay();
            prevTestimonial();
            startTestimonialAutoplay();
        });
    }
    
    // Pause on hover/focus
    carousel.addEventListener('mouseenter', stopTestimonialAutoplay);
    carousel.addEventListener('mouseleave', startTestimonialAutoplay);
    carousel.addEventListener('focusin', stopTestimonialAutoplay);
    carousel.addEventListener('focusout', startTestimonialAutoplay);
    
    // Keyboard navigation
    carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevTestimonial();
        } else if (e.key === 'ArrowRight') {
            nextTestimonial();
        }
    });
    
    // Start autoplay
    startTestimonialAutoplay();
}

/**
 * Form handling and validation
 */
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
        
        // Form submission
        form.addEventListener('submit', handleFormSubmit);
    });
    
    // Initialize specific forms
    initializeContactForm();
    initializeAppointmentForm();
}

/**
 * Validate individual form field
 */
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (required && !value) {
        isValid = false;
        errorMessage = 'આ ફીલ્ડ આવશ્યક છે / This field is required';
    }
    
    // Type-specific validation
    if (value && isValid) {
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'કૃપા કરીને માન્ય ઇમેઇલ દાખલ કરો / Please enter a valid email';
                }
                break;
                
            case 'tel':
                const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'કૃપા કરીને માન્ય ફોન નંબર દાખલ કરો / Please enter a valid phone number';
                }
                break;
                
            case 'date':
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    isValid = false;
                    errorMessage = 'કૃપા કરીને ભવિષ્યની તારીખ પસંદ કરો / Please select a future date';
                }
                break;
        }
    }
    
    // Custom validation for name fields
    if (field.name === 'name' && value) {
        const nameRegex = /^[a-zA-Zા-ૹ\s]{2,}$/;
        if (!nameRegex.test(value)) {
            isValid = false;
            errorMessage = 'કૃપા કરીને માન્ય નામ દાખલ કરો / Please enter a valid name';
        }
    }
    
    // Show/hide error message
    showFieldError(field, isValid ? '' : errorMessage);
    
    return isValid;
}

/**
 * Show field error message
 */
function showFieldError(field, message) {
    const errorElement = field.parentNode.querySelector('.form-error');
    
    if (message) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    } else {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
}

/**
 * Clear field error message
 */
function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isFormSubmitting) return;
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('કૃપા કરીને બધા આવશ્યક ફીલ્ડ્સ ભરો / Please fill all required fields', 'error');
        return;
    }
    
    // Show loading state
    isFormSubmitting = true;
    if (submitButton) {
        submitButton.classList.add('loading');
        submitButton.disabled = true;
    }
    
    try {
        // Simulate API call (replace with actual endpoint)
        const response = await fetch('/api/book-appointment', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            handleFormSuccess(form, result);
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        handleFormError(form, error);
    } finally {
        isFormSubmitting = false;
        if (submitButton) {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }
}

/**
 * Handle successful form submission
 */
function handleFormSuccess(form, result) {
    showNotification(
        'તમારી વિનંતી સફળતાપૂર્વક મોકલવામાં આવી છે / Your request has been sent successfully',
        'success'
    );
    
    // Show confirmation modal
    showConfirmationModal(result);
    
    // Reset form
    form.reset();
    
    // Clear any error states
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => clearFieldError(field));
}

/**
 * Handle form submission error
 */
function handleFormError(form, error) {
    showNotification(
        'કંઈક ખોટું થયું છે. કૃપા કરીને ફરીથી પ્રયાસ કરો / Something went wrong. Please try again',
        'error'
    );
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}" aria-hidden="true"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${getNotificationColor(type)};
        color: var(--white);
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform var(--transition-fast);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Get notification icon based on type
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

/**
 * Get notification color based on type
 */
function getNotificationColor(type) {
    const colors = {
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
        info: 'var(--info)'
    };
    return colors[type] || colors.info;
}

/**
 * Show confirmation modal
 */
function showConfirmationModal(data) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" role="dialog" aria-labelledby="modal-title" aria-modal="true">
            <div class="modal-header">
                <h2 id="modal-title">
                    <i class="fas fa-check-circle text-success" aria-hidden="true"></i>
                    એપોઇન્ટમેન્ટ કન્ફર્મ / Appointment Confirmed
                </h2>
                <button class="modal-close" aria-label="Close modal">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <div class="modal-body">
                <p><strong>આભાર! તમારી એપોઇન્ટમેન્ટ બુક થઈ ગઈ છે.</strong></p>
                <p><strong>Thank you! Your appointment has been booked.</strong></p>
                
                <div class="appointment-details">
                    <h3>એપોઇન્ટમેન્ટ વિગતો / Appointment Details:</h3>
                    <ul>
                        <li><strong>બુકિંગ ID / Booking ID:</strong> ${data.bookingId || 'APT' + Date.now()}</li>
                        <li><strong>તારીખ / Date:</strong> ${data.date || 'To be confirmed'}</li>
                        <li><strong>સમય / Time:</strong> ${data.time || 'To be confirmed'}</li>
                        <li><strong>સેવા / Service:</strong> ${data.service || 'General Consultation'}</li>
                    </ul>
                </div>
                
                <div class="next-steps">
                    <h3>આગળના પગલાં / Next Steps:</h3>
                    <ol>
                        <li>અમે 24 કલાકમાં તમારી સાથે સંપર્ક કરીશું / We will contact you within 24 hours</li>
                        <li>કન્ફર્મેશન ઇમેઇલ મોકલવામાં આવશે / Confirmation email will be sent</li>
                        <li>એપોઇન્ટમેન્ટ પહેલાં જરૂરી દસ્તાવેજો તૈયાર રાખો / Prepare necessary documents before appointment</li>
                    </ol>
                </div>
                
                <div class="contact-info">
                    <p>
                        <i class="fas fa-phone" aria-hidden="true"></i>
                        કોઈ પ્રશ્ન માટે કૉલ કરો / For any questions call: 
                        <a href="tel:[PHONE]">[PHONE]</a>
                    </p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="generateAppointmentSlip()">
                    <i class="fas fa-print" aria-hidden="true"></i>
                    એપોઇન્ટમેન્ટ સ્લિપ પ્રિન્ટ કરો / Print Appointment Slip
                </button>
                <button class="btn btn-secondary modal-close">
                    બંધ કરો / Close
                </button>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        opacity: 0;
        transition: opacity var(--transition-fast);
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 100);
    
    // Close modal functionality
    const closeButtons = modal.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        });
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    // Focus management for accessibility
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        firstFocusable.focus();
    }
}

/**
 * Generate and print appointment slip
 */
function generateAppointmentSlip() {
    const printWindow = window.open('', '_blank');
    const appointmentData = {
        bookingId: 'APT' + Date.now(),
        date: new Date().toLocaleDateString(),
        time: 'To be confirmed',
        patientName: 'Patient Name',
        service: 'General Consultation'
    };
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Appointment Slip - [CLINIC_NAME]</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; border-bottom: 2px solid #2d7d32; padding-bottom: 10px; }
                .logo { color: #2d7d32; font-size: 24px; font-weight: bold; }
                .details { margin: 20px 0; }
                .details table { width: 100%; border-collapse: collapse; }
                .details td { padding: 8px; border-bottom: 1px solid #ddd; }
                .footer { margin-top: 30px; font-size: 12px; color: #666; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">[CLINIC_NAME]</div>
                <p>[ADDRESS], [CITY] - [ZIP]</p>
                <p>Phone: [PHONE] | Email: [EMAIL]</p>
            </div>
            
            <h2>Appointment Slip / એપોઇન્ટમેન્ટ સ્લિપ</h2>
            
            <div class="details">
                <table>
                    <tr>
                        <td><strong>Booking ID:</strong></td>
                        <td>${appointmentData.bookingId}</td>
                    </tr>
                    <tr>
                        <td><strong>Date:</strong></td>
                        <td>${appointmentData.date}</td>
                    </tr>
                    <tr>
                        <td><strong>Time:</strong></td>
                        <td>${appointmentData.time}</td>
                    </tr>
                    <tr>
                        <td><strong>Service:</strong></td>
                        <td>${appointmentData.service}</td>
                    </tr>
                    <tr>
                        <td><strong>Doctor:</strong></td>
                        <td>[DR_NAME]</td>
                    </tr>
                </table>
            </div>
            
            <div class="instructions">
                <h3>Instructions / સૂચનાઓ:</h3>
                <ul>
                    <li>Please arrive 15 minutes before your appointment time</li>
                    <li>Bring this slip and a valid ID proof</li>
                    <li>Carry your previous medical records if any</li>
                    <li>કૃપા કરીને એપોઇન્ટમેન્ટના સમય પહેલાં 15 મિનિટ પહોંચો</li>
                    <li>આ સ્લિપ અને માન્ય ID પ્રૂફ લાવો</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <p>For any queries, please contact: [PHONE]</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

/**
 * Initialize contact form specific functionality
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Auto-fill service if coming from services page
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const packageParam = urlParams.get('package');
    
    if (serviceParam) {
        const serviceSelect = contactForm.querySelector('select[name="service"]');
        if (serviceSelect) {
            serviceSelect.value = serviceParam;
        }
    }
    
    if (packageParam) {
        const packageSelect = contactForm.querySelector('select[name="package"]');
        if (packageSelect) {
            packageSelect.value = packageParam;
        }
    }
}

/**
 * Initialize appointment form specific functionality
 */
function initializeAppointmentForm() {
    const appointmentForm = document.getElementById('appointment-form');
    if (!appointmentForm) return;
    
    // Set minimum date to today
    const dateInputs = appointmentForm.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
    
    // Time slot management
    initializeTimeSlots();
}

/**
 * Initialize time slot functionality
 */
function initializeTimeSlots() {
    const timeSelect = document.querySelector('select[name="preferred-time"]');
    if (!timeSelect) return;
    
    // Generate time slots (9 AM to 6 PM, excluding lunch 1-2 PM)
    const timeSlots = [];
    
    // Morning slots (9 AM - 1 PM)
    for (let hour = 9; hour < 13; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    // Evening slots (2 PM - 6 PM)
    for (let hour = 14; hour < 18; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    // Clear existing options except the first one
    const firstOption = timeSelect.querySelector('option');
    timeSelect.innerHTML = '';
    if (firstOption) {
        timeSelect.appendChild(firstOption);
    }
    
    // Add time slot options
    timeSlots.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = formatTime(time);
        timeSelect.appendChild(option);
    });
}

/**
 * Format time for display
 */
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Initialize gallery functionality
 */
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            showLightbox(imgSrc, imgAlt);
        });
        
        // Keyboard accessibility
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const imgSrc = this.querySelector('img').src;
                const imgAlt = this.querySelector('img').alt;
                showLightbox(imgSrc, imgAlt);
            }
        });
    });
}

/**
 * Show image lightbox
 */
function showLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="${alt}" class="lightbox-image">
            <button class="lightbox-close" aria-label="Close lightbox">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
    `;
    
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10002;
        opacity: 0;
        transition: opacity var(--transition-fast);
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 100);
    
    // Close functionality
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
        }, 300);
    }
    
    // Focus management
    closeBtn.focus();
}

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    }
    
    // Keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll('[role="button"]:not(button)');
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Focus management for modals and dropdowns
    document.addEventListener('focusin', function(e) {
        const modal = e.target.closest('.modal-overlay, .lightbox-overlay');
        if (modal) {
            // Trap focus within modal
            trapFocus(modal, e);
        }
    });
}

/**
 * Trap focus within a container
 */
function trapFocus(container, event) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey && event.target === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && event.target === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility function to throttle function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error reporting service
});

// Performance monitoring
window.addEventListener('load', function() {
    // Log performance metrics
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}