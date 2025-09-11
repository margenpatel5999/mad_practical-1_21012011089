// NGmars Solutions - Main JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initMegaMenu();
    initMobileMenu();
    initScrollAnimations();
    initCustomerSolutions();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    
    // Add scroll effect to navbar (optional enhancement)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(12px) saturate(130%)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            navbar.style.backdropFilter = 'blur(8px) saturate(120%)';
        }
    });
}

// Mega menu functionality
function initMegaMenu() {
    const megaItems = document.querySelectorAll('.has-mega');
    const megaCats = document.querySelectorAll('.mega-cat');
    const megaPanels = document.querySelectorAll('.mega-panel');
    
    // Handle mega menu category switching
    megaCats.forEach(cat => {
        cat.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Remove active class from all categories and panels
            megaCats.forEach(c => c.classList.remove('active'));
            megaPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked category and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(`panel-${target}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
    // Handle mega menu hover/focus
    megaItems.forEach(item => {
        const megaMenu = item.querySelector('.mega');
        
        item.addEventListener('mouseenter', () => {
            item.classList.add('open');
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('open');
        });
        
        // Handle keyboard navigation
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                item.classList.remove('open');
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navOverlayClose = document.getElementById('nav-overlay-close');
    const body = document.body;
    
    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle aria-expanded
            this.setAttribute('aria-expanded', !isExpanded);
            
            // For desktop dropdown
            if (window.innerWidth > 760) {
                navMenu.classList.toggle('open');
            } else {
                // For mobile overlay
                navOverlay.classList.toggle('open');
                body.classList.toggle('menu-open');
            }
        });
    }
    
    // Close mobile overlay
    if (navOverlayClose) {
        navOverlayClose.addEventListener('click', function() {
            navOverlay.classList.remove('open');
            body.classList.remove('menu-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    }
    
    // Close overlay when clicking on overlay background
    if (navOverlay) {
        navOverlay.addEventListener('click', function(e) {
            if (e.target === navOverlay) {
                navOverlay.classList.remove('open');
                body.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 760) {
            navOverlay.classList.remove('open');
            body.classList.remove('menu-open');
            navMenu.classList.remove('open');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

// Scroll animations for customer solutions
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe solution cards
    const solutionCards = document.querySelectorAll('.solution-card');
    const ctaSection = document.querySelector('.solutions-cta');
    
    solutionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    if (ctaSection) {
        ctaSection.style.opacity = '0';
        ctaSection.style.transform = 'translateY(30px)';
        ctaSection.style.transition = 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s';
        observer.observe(ctaSection);
    }
}

// Customer solutions interactive features
function initCustomerSolutions() {
    const solutionCards = document.querySelectorAll('.solution-card');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    // Add hover effects to solution cards
    solutionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-8px) scale(1)';
        });
    });
    
    // Add interactive floating animation
    floatingCards.forEach((card, index) => {
        const delay = index * 2000; // 2 second delay between cards
        
        setInterval(() => {
            card.style.transform += ' scale(1.1)';
            setTimeout(() => {
                card.style.transform = card.style.transform.replace(' scale(1.1)', '');
            }, 300);
        }, 6000 + delay);
    });
    
    // Add click tracking for portfolio button (optional analytics)
    const portfolioButton = document.querySelector('.cta-button');
    if (portfolioButton) {
        portfolioButton.addEventListener('click', function(e) {
            // Add any analytics tracking here if needed
            console.log('Portfolio button clicked');
        });
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation (optional enhancement)
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        
        if (heroTitle) {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }
        
        if (heroSubtitle) {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }
    }, 100);
});

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Any scroll-based functionality can go here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);