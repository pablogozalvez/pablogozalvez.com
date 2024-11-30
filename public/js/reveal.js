// Reveal functionality
function setupRevealElements() {
    const revealElements = document.querySelectorAll('.card-grid > .card, .reveal-element');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// Modify existing section navigation script to add reveal effect
const menuItems = document.querySelectorAll('#menu ul li a');

menuItems.forEach(item => {
    item.addEventListener('click', function() {
        // Remove active state from all menu items
        menuItems.forEach(menuItem => menuItem.classList.remove('active'));
        this.classList.add('active');

        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(this.dataset.category);
        targetSection.classList.add('active');

        // Trigger reveal for new section's elements
        setTimeout(() => {
            setupRevealElements();
        }, 50);
    });
});

// Scroll-based menu effect (existing code)
document.addEventListener('scroll', function() {
    var menu = document.getElementById('menu');
    if (window.scrollY > 0) {
        menu.classList.add('nav');
    } else {
        menu.classList.remove('nav');
    }
});

// Highlight code and setup reveal on page load
document.addEventListener('DOMContentLoaded', (event) => {
    hljs.highlightAll();
    setupRevealElements();
});