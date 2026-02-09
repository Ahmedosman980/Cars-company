// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

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

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.firstName || !data.lastName || !data.email || !data.message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your message! We will contact you within 24 hours.', 'success');
        this.reset();
    });
}

// Test Drive Form Handling
const testDriveForm = document.getElementById('testDriveForm');
if (testDriveForm) {
    testDriveForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.testVehicle || !data.testDate || !data.testTime) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you! Your test drive has been scheduled. We will send you a confirmation email shortly.', 'success');
        this.reset();
    });
}

// Vehicle Filtering
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const sortFilter = document.getElementById('sortFilter');

function filterVehicles() {
    const vehicles = document.querySelectorAll('.vehicle-card');
    const category = categoryFilter ? categoryFilter.value : 'all';
    const priceRange = priceFilter ? priceFilter.value : 'all';
    const sortBy = sortFilter ? sortFilter.value : 'featured';
    
    let visibleVehicles = [];
    
    vehicles.forEach(vehicle => {
        const vehicleCategory = vehicle.dataset.category;
        const vehiclePrice = parseInt(vehicle.dataset.price);
        
        let showVehicle = true;
        
        // Category filter
        if (category !== 'all' && vehicleCategory !== category) {
            showVehicle = false;
        }
        
        // Price filter
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
            if (max) {
                if (vehiclePrice < parseInt(min) || vehiclePrice > parseInt(max)) {
                    showVehicle = false;
                }
            } else {
                if (vehiclePrice < parseInt(min)) {
                    showVehicle = false;
                }
            }
        }
        
        if (showVehicle) {
            vehicle.style.display = 'block';
            visibleVehicles.push(vehicle);
        } else {
            vehicle.style.display = 'none';
        }
    });
    
    // Sort vehicles
    if (sortBy !== 'featured') {
        const sortedVehicles = sortVehicles(visibleVehicles, sortBy);
        const container = document.querySelector('.vehicle-grid');
        if (container) {
            sortedVehicles.forEach(vehicle => container.appendChild(vehicle));
        }
    }
}

function sortVehicles(vehicles, sortBy) {
    return Array.from(vehicles).sort((a, b) => {
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);
        
        switch (sortBy) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'year':
                // For demo purposes, we'll sort by price as year proxy
                return priceB - priceA;
            default:
                return 0;
        }
    });
}

// Add event listeners for filters
if (categoryFilter) categoryFilter.addEventListener('change', filterVehicles);
if (priceFilter) priceFilter.addEventListener('change', filterVehicles);
if (sortFilter) sortFilter.addEventListener('change', filterVehicles);

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#27ae60';
            break;
        case 'error':
            notification.style.backgroundColor = '#e74c3c';
            break;
        default:
            notification.style.backgroundColor = '#3498db';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Interactive Functions
function scheduleTestDrive(vehicleName) {
    showNotification(`Scheduling test drive for ${vehicleName}. Please fill out the form below.`, 'info');
    
    // Scroll to test drive form if it exists
    const testDriveSection = document.getElementById('testDriveForm');
    if (testDriveSection) {
        testDriveSection.scrollIntoView({ behavior: 'smooth' });
        
        // Pre-fill vehicle if possible
        const vehicleSelect = document.getElementById('testVehicle');
        if (vehicleSelect) {
            // Try to match the vehicle name
            const options = Array.from(vehicleSelect.options);
            const matchingOption = options.find(option => 
                option.text.toLowerCase().includes(vehicleName.toLowerCase())
            );
            if (matchingOption) {
                vehicleSelect.value = matchingOption.value;
            }
        }
    } else {
        // Redirect to contact page
        window.location.href = 'contact.html#test-drive-section';
    }
}

function viewDetails(vehicleName) {
    showNotification(`Loading details for ${vehicleName}...`, 'info');
    // In a real application, this would open a modal or navigate to a detail page
}

function scheduleConsultation() {
    showNotification('Redirecting to consultation scheduling...', 'info');
    // In a real application, this would open a scheduling system
}

function applyFinancing() {
    showNotification('Opening financing application...', 'info');
    // In a real application, this would open a financing application form
}

function scheduleService() {
    showNotification('Opening service scheduling...', 'info');
    // In a real application, this would open a service scheduling system
}

function getTradeValue() {
    showNotification('Opening trade-in valuation tool...', 'info');
    // In a real application, this would open a trade-in valuation tool
}

function getProtectionQuote() {
    showNotification('Loading protection plan options...', 'info');
    // In a real application, this would load protection plan options
}

function getDirections() {
    // In a real application, this would open Google Maps or similar
    showNotification('Opening directions to our showroom...', 'info');
}

function callEmergency() {
    showNotification('Calling emergency support line...', 'info');
    // In a real application, this would initiate a phone call
}

function locationDetails(location) {
    showNotification(`Loading details for ${location} location...`, 'info');
    // In a real application, this would show location details
}

function contactTeamMember(member) {
    showNotification(`Opening contact form for ${member}...`, 'info');
    // In a real application, this would open a contact form for the specific team member
}

function scrollToForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form Input Enhancements
document.querySelectorAll('input, textarea, select').forEach(element => {
    // Add focus effects
    element.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    element.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// Date Input Validation
const dateInputs = document.querySelectorAll('input[type="date"]');
dateInputs.forEach(input => {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    input.min = today;
    
    // Add date validation
    input.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('Please select a future date', 'error');
            this.value = '';
        }
    });
});

// Phone Number Formatting
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
        // Remove all non-numeric characters
        let value = e.target.value.replace(/\D/g, '');
        
        // Format as (XXX) XXX-XXXX
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        
        e.target.value = value;
    });
});

// Scroll Animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .vehicle-card, .testimonial-card, .leader-card, .service-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .vehicle-card, .testimonial-card, .leader-card, .service-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});

// Lazy Loading for Images (if implemented in the future)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Print Styles
function handlePrint() {
    window.addEventListener('beforeprint', function() {
        // Add print-specific styles
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', function() {
        // Remove print-specific styles
        document.body.classList.remove('printing');
    });
}

// Initialize print handling
handlePrint();

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Tab key navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

// Remove keyboard navigation class when using mouse
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});

// Performance Optimization
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

// Debounce scroll events
const debouncedScroll = debounce(animateOnScroll, 100);
window.addEventListener('scroll', debouncedScroll);

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In a real application, you might send this to an error tracking service
});

// Page Load Optimization
window.addEventListener('load', function() {
    // Hide loading spinner if it exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
});

// Service Worker Registration (for PWA functionality in the future)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // In a real application, you would register a service worker here
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Analytics and Tracking (placeholder)
function trackEvent(eventName, properties) {
    // In a real application, you would send this to Google Analytics or similar
    console.log('Track Event:', eventName, properties);
}

// Track button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('Button Click', {
            buttonText: this.textContent,
            buttonType: this.className
        });
    });
});

// Track form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        trackEvent('Form Submission', {
            formId: this.id,
            formClass: this.className
        });
    });
});

console.log('Prestige Motors website loaded successfully!');