// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePreloader();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeCounters();
    initializeParticles();
    initializeFormHandling();
    initializeScrollToTop();
    initializeSmoothScrolling();
    initializeTypingAnimation();
    initializeParallaxEffects();
    initializeIntersectionObserver();
});

// Preloader functionality
function initializePreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.loading-progress');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('hide');
                document.body.style.overflow = 'visible';
                // Initialize AOS after preloader
                AOS.init({
                    duration: 1000,
                    once: true,
                    offset: 100,
                    easing: 'ease-out-cubic'
                });
            }, 500);
        }
        progressBar.style.width = progress + '%';
    }, 100);
}

// Navigation functionality
function initializeNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'visible';
    });
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = 'visible';
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Active navigation link
    const sections = document.querySelectorAll('section[id]');
    
    function setActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveLink);
}

// Scroll effects
function initializeScrollEffects() {
    const heroScroll = document.querySelector('.hero-scroll');
    
    if (heroScroll) {
        heroScroll.addEventListener('click', () => {
            document.querySelector('#services').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-sphere');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Enhanced animations
function initializeAnimations() {
    // Service cards hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
            card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        });
    });
    
    // Project cards animations
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const overlay = card.querySelector('.project-overlay');
            const bg = card.querySelector('.project-bg');
            
            overlay.style.opacity = '1';
            bg.style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            const overlay = card.querySelector('.project-overlay');
            const bg = card.querySelector('.project-bg');
            
            overlay.style.opacity = '0';
            bg.style.transform = 'scale(1)';
        });
    });
    
    // Tech elements rotation animation
    const techElements = document.querySelectorAll('.tech-element');
    
    techElements.forEach((element, index) => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = `scale(1.2) rotate(${index * 45}deg)`;
            element.style.borderColor = 'var(--primary-color)';
            element.style.boxShadow = '0 10px 20px rgba(59, 130, 246, 0.3)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1) rotate(0deg)';
            element.style.borderColor = '';
            element.style.boxShadow = '';
        });
    });
}

// Animated counters
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const countUp = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const count = parseInt(counter.innerText);
        const inc = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(() => countUp(counter), 1);
        } else {
            counter.innerText = target;
        }
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                if (!counter.classList.contains('counted')) {
                    counter.classList.add('counted');
                    countUp(counter);
                }
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Enhanced particle effects
function initializeParticles() {
    const techGlobe = document.querySelector('.tech-globe');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'dynamic-particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--accent-color);
            border-radius: 50%;
            pointer-events: none;
            animation: particleMove 4s linear infinite;
        `;
        
        // Random starting position around the globe
        const angle = Math.random() * 360;
        const radius = 150;
        const x = Math.cos(angle * Math.PI / 180) * radius;
        const y = Math.sin(angle * Math.PI / 180) * radius;
        
        particle.style.left = `${150 + x}px`;
        particle.style.top = `${150 + y}px`;
        
        techGlobe.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 4000);
    }
    
    // Create particles periodically
    if (techGlobe) {
        setInterval(createParticle, 800);
    }
    
    // Add particle animation keyframes
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleMove {
            0% {
                opacity: 0;
                transform: scale(0);
            }
            10% {
                opacity: 1;
                transform: scale(1);
            }
            90% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0) translateY(-50px);
            }
        }
    `;
    document.head.appendChild(particleStyle);
}

// Form handling with enhanced validation
function initializeFormHandling() {
    const form = document.querySelector('.form');
    const inputs = document.querySelectorAll('.form-input');
    
    // Enhanced form validation
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearError);
    });
    
    function validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        const type = input.type;
        
        clearError(e);
        
        if (!value) {
            showError(input, 'This field is required');
            return false;
        }
        
        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(input, 'Please enter a valid email address');
                return false;
            }
        }
        
        if (input.classList.contains('form-textarea') && value.length < 10) {
            showError(input, 'Message must be at least 10 characters long');
            return false;
        }
        
        return true;
    }
    
    function showError(input, message) {
        const formGroup = input.parentElement;
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--danger-color);
            font-size: 0.875rem;
            margin-top: 0.5rem;
            animation: fadeInUp 0.3s ease;
        `;
        
        formGroup.appendChild(errorElement);
        input.style.borderColor = 'var(--danger-color)';
    }
    
    function clearError(e) {
        const input = e.target;
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.style.borderColor = '';
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput({ target: input })) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                showSuccessMessage();
                form.reset();
            }
        });
    }
    
    function showSuccessMessage() {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = 'Message sent successfully! We\'ll get back to you soon.';
        successElement.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.5s ease;
        `;
        
        document.body.appendChild(successElement);
        
        setTimeout(() => {
            successElement.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(successElement);
            }, 500);
        }, 3000);
    }
}

// Back to top functionality
function initializeScrollToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Typing animation for hero title
function initializeTypingAnimation() {
    const titleElement = document.querySelector('.title-line');
    if (!titleElement) return;
    
    const text = 'NovasphereeTech';
    const speed = 100;
    let index = 0;
    
    titleElement.textContent = '';
    
    function typeChar() {
        if (index < text.length) {
            titleElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeChar, speed);
        } else {
            // Add blinking cursor effect
            const cursor = document.createElement('span');
            cursor.textContent = '|';
            cursor.style.animation = 'blink 1s infinite';
            titleElement.appendChild(cursor);
            
            // Add cursor animation
            const cursorStyle = document.createElement('style');
            cursorStyle.textContent = `
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `;
            document.head.appendChild(cursorStyle);
        }
    }
    
    // Start typing animation after a delay
    setTimeout(typeChar, 1000);
}

// Parallax effects
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.floating-sphere, .tech-globe, .central-sphere');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Intersection Observer for advanced animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animations for different elements
                if (entry.target.classList.contains('service-card')) {
                    animateServiceCard(entry.target);
                } else if (entry.target.classList.contains('project-card')) {
                    animateProjectCard(entry.target);
                } else if (entry.target.classList.contains('tech-showcase')) {
                    animateTechShowcase(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToObserve = document.querySelectorAll(
        '.service-card, .project-card, .tech-showcase, .contact-form, .about-stats'
    );
    
    elementsToObserve.forEach(element => observer.observe(element));
}

// Specialized animation functions
function animateServiceCard(card) {
    const icon = card.querySelector('.service-icon');
    const features = card.querySelectorAll('.service-features li');
    
    icon.style.animation = 'bounceIn 0.6s ease';
    
    features.forEach((feature, index) => {
        setTimeout(() => {
            feature.style.animation = 'fadeInUp 0.4s ease forwards';
            feature.style.opacity = '0';
            feature.style.transform = 'translateY(20px)';
        }, index * 100);
    });
}

function animateProjectCard(card) {
    const content = card.querySelector('.project-content');
    const tags = card.querySelectorAll('.tech-tag');
    
    content.style.animation = 'fadeInUp 0.6s ease';
    
    tags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.animation = 'zoomIn 0.3s ease forwards';
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0)';
        }, index * 100);
    });
}

function animateTechShowcase(showcase) {
    const elements = showcase.querySelectorAll('.tech-element');
    const centralSphere = showcase.querySelector('.central-sphere');
    
    centralSphere.style.animation = 'pulse 1s ease';
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.animation = 'techElementAppear 0.5s ease forwards';
            element.style.opacity = '0';
            element.style.transform = 'scale(0) rotate(180deg)';
        }, index * 200);
    });
}

// Add additional animation keyframes
const additionalAnimations = document.createElement('style');
additionalAnimations.textContent = `
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes techElementAppear {
        from {
            opacity: 0;
            transform: scale(0) rotate(180deg);
        }
        to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(additionalAnimations);

// Mouse cursor effects
function initializeCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        opacity: 0;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '0.5';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '0.5';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Enlarge cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .project-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'var(--secondary-color)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'var(--primary-color)';
        });
    });
}

// Initialize cursor effects (optional - can be enabled/disabled)
// initializeCursorEffects();

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
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

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Add any scroll-based animations here that need throttling
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = 'visible';
        }
    }
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}