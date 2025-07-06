const observerOptions = {
    threshold: 0.25,   // lower = more sensitive
     rootMargin: '0px 0px -20% 0px'};

// Create an IntersectionObserver to handle the fade-in effect
// This observer will trigger when the element is at least 25% visible in the viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Select all interest cards and apply initial styles
document.querySelectorAll('.interest-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// interactive hover effect for interest cards
// This will add a hover effect that slightly lifts the card and scales it up
// when the mouse is over the card, and returns it to normal when the mouse leaves
document.querySelectorAll('.interest-card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-5px) scale(1)';
    });
});

// Parallax effect for particles
// This will create a parallax effect where particles move at different speeds based on scroll position
// Each particle will move at a speed proportional to its index
// This creates a layered effect as the user scrolls down the page
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.5;
        particle.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
    });
});

