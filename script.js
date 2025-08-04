// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initParticles();
    initScrollAnimations();
    initSkillsAnimations();
    initCounterAnimations();
    initTestimonialCarousel();
    initContactForm();
    initSmoothScrolling();
    initParallaxEffects();
    initHoverEffects();
});

// Navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Floating particles animation
function initParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    const particleCount = 50;

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random positioning and animation duration
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() - 0.5) * 200;
        const animationDuration = 6 + Math.random() * 4;
        const delay = Math.random() * 6;
        
        particle.style.left = startX + 'px';
        particle.style.animationDuration = animationDuration + 's';
        particle.style.animationDelay = delay + 's';
        particle.style.setProperty('--end-x', endX + 'px');
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (animationDuration + delay) * 1000);
    }

    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => createParticle(), i * 100);
    }

    // Continue creating particles
    setInterval(createParticle, 300);
}

// Scroll-based animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Stagger animations for child elements
                const children = entry.target.querySelectorAll('.text-block, .project-card, .skill-category');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate');
                    }, index * 200);
                });
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.section-header, .about-text, .contact-info, .contact-form, .skill-category, .project-card'
    );

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Skills progress bar animations
function initSkillsAnimations() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width + '%';
                }, 500);
                
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Counter animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Testimonial carousel
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    function showCard(index) {
        cards.forEach((card, i) => {
            card.classList.remove('active', 'prev');
            if (i === index) {
                card.classList.add('active');
            } else if (i === index - 1 || (index === 0 && i === totalCards - 1)) {
                card.classList.add('prev');
            }
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    function nextCard() {
        currentIndex = (currentIndex + 1) % totalCards;
        showCard(currentIndex);
    }
    
    function prevCard() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        showCard(currentIndex);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextCard);
    prevBtn.addEventListener('click', prevCard);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showCard(currentIndex);
        });
    });
    
    // Auto-play carousel
    setInterval(nextCard, 5000);
    
    // Initialize first card
    showCard(0);
}

// Contact form functionality
function initContactForm() {
    const form = document.querySelector('.contact-form');
    const inputs = form.querySelectorAll('input, textarea');
    const submitBtn = form.querySelector('.btn-submit');
    
    // Form field animations
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Add floating label animation
        input.addEventListener('input', () => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Animate submit button
        submitBtn.style.transform = 'scale(0.95)';
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
                submitBtn.style.background = '';
                submitBtn.style.transform = '';
                form.reset();
                inputs.forEach(input => {
                    input.classList.remove('has-value');
                    input.parentElement.classList.remove('focused');
                });
            }, 2000);
        }, 1500);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const heroButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            smoothScroll(target);
        });
    });
    
    // Hero button actions
    document.querySelector('.btn-primary').addEventListener('click', () => {
        smoothScroll('#projects');
    });
    
    document.querySelector('.btn-secondary').addEventListener('click', () => {
        smoothScroll('#contact');
    });
}

// Parallax effects
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-card, .floating-icon, .floating-skill');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Hover effects and interactions
function initHoverEffects() {
    // Project cards hover effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    // Floating skills 3D effect
    const floatingSkills = document.querySelectorAll('.floating-skill');
    floatingSkills.forEach(skill => {
        skill.addEventListener('mouseenter', () => {
            skill.style.transform = 'scale(1.1) rotateY(180deg)';
        });
        
        skill.addEventListener('mouseleave', () => {
            skill.style.transform = '';
        });
    });
    
    // Social links hover effect
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-5px) rotate(360deg)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });
    
    // Button ripple effect
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-submit');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Blob morphing animation
function initBlobMorphing() {
    const blobs = document.querySelectorAll('.blob');
    
    blobs.forEach((blob, index) => {
        setInterval(() => {
            const randomScale = 0.8 + Math.random() * 0.4;
            const randomRotate = Math.random() * 360;
            const randomBorderRadius = `${30 + Math.random() * 40}% ${60 + Math.random() * 40}% ${30 + Math.random() * 40}% ${60 + Math.random() * 40}%`;
            
            blob.style.transform = `scale(${randomScale}) rotate(${randomRotate}deg)`;
            blob.style.borderRadius = randomBorderRadius;
        }, 3000 + index * 1000);
    });
}

// Mouse cursor effects
function initCursorEffects() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    const cursorFollower = document.createElement('div');
    cursorFollower.classList.add('cursor-follower');
    document.body.appendChild(cursorFollower);
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-category');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('cursor-hover');
        });
    });
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress');
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollTop = window.pageYOffset;
        const progress = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = progress + '%';
    });
}

// Preloader
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.classList.add('preloader');
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="logo">Alex<span>.</span></div>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    `;
    document.body.appendChild(preloader);
    
    let progress = 0;
    const loadingProgress = preloader.querySelector('.loading-progress');
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }, 500);
        }
        loadingProgress.style.width = progress + '%';
    }, 100);
}

// Initialize additional effects
document.addEventListener('DOMContentLoaded', function() {
    initBlobMorphing();
    initCursorEffects();
    initScrollProgress();
    initPreloader();
});

// CSS for dynamic elements
const dynamicStyles = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .custom-cursor {
        position: fixed;
        width: 10px;
        height: 10px;
        background: var(--accent-purple);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
    }
    
    .cursor-follower {
        position: fixed;
        width: 30px;
        height: 30px;
        border: 2px solid var(--accent-purple);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        transition: all 0.3s ease;
        opacity: 0.5;
    }
    
    .cursor-hover {
        transform: translate(-50%, -50%) scale(1.5);
    }
    
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: var(--gradient-primary);
        z-index: 9999;
        transition: width 0.1s ease;
    }
    
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--primary-navy);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    }
    
    .preloader-content {
        text-align: center;
    }
    
    .preloader .logo {
        font-family: var(--font-primary);
        font-size: 3rem;
        font-weight: 700;
        color: var(--white);
        margin-bottom: 2rem;
    }
    
    .preloader .logo span {
        color: var(--accent-purple);
    }
    
    .loading-bar {
        width: 200px;
        height: 4px;
        background: var(--dark-gray);
        border-radius: 2px;
        overflow: hidden;
        margin: 0 auto;
    }
    
    .loading-progress {
        height: 100%;
        background: var(--gradient-primary);
        border-radius: 2px;
        transition: width 0.3s ease;
    }
    
    .form-group.focused label {
        top: -0.5rem;
        left: 1rem;
        font-size: 0.85rem;
        color: var(--accent-purple);
        background: var(--primary-navy);
        padding: 0 0.5rem;
    }
    
    @media (max-width: 768px) {
        .custom-cursor,
        .cursor-follower {
            display: none;
        }
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// Performance optimization
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

// Optimized scroll handler
window.addEventListener('scroll', debounce(() => {
    // Handle scroll-based animations here if needed
}, 10));

// Resize handler
window.addEventListener('resize', debounce(() => {
    // Handle resize-based updates here if needed
}, 250));