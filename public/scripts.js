const observerOptions = {threshold: 0.5, rootMargin: '0px 0px -25% 0px'};
const loader = document.getElementById('loading-screen');

// Create an IntersectionObserver to handle the fade-in effect
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
document.querySelectorAll('.interest-card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-5px) scale(1)';
    });
});


// Smooth scrolling for anchor links
// This will enable smooth scrolling when clicking on links that point to sections within the same page
// It prevents the default jump behavior and animates the scroll to the target element
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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


// Parallax effect for particles
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.5;
        particle.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
    });
});

// Fade out loader after page load
// This will add a fade-out effect to the loading screen once the page has fully loaded
window.addEventListener('load', () => {
    loader.classList.add('fade-out');
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500); // Adjust the timeout to match the CSS transition duration
});

document.querySelectorAll('a[href]').forEach(link => {
    if (link.target === '_blank' || 
        link.getAttribute('href').startsWith('#') ||
        link.getAttribute('href').startsWith('mailto:'))
    return; // Skip links that open in a new tab or are internal links
        
    // Add click event listener to open links in a new tab
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        loader.style.display = 'flex';
        loader.classList.remove('fade-out');
        setTimeout(() => {
            window.location.href = href;
        }, 300); // Adjust the delay as needed
    });
});

function toggleExpand(card) {
    document.querySelectorAll('.class-card.expanded').forEach(c => {
        if (c !== card) c.classList.remove('expanded');
    });
    card.classList.toggle('expanded');
}