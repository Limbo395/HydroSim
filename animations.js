// Smooth scroll function
function smoothScroll(target, duration) {
    const targetElement = document.querySelector(target);
    const targetPosition = targetElement.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, targetPosition, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animation);
}

// Add fade-in animation to elements
function addFadeInAnimation() {
    const elements = document.querySelectorAll('.content h2, .content p, .content ul, .content ol, .video-item, .quiz-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        element.classList.add('fade-element');
        observer.observe(element);
    });
}

// Tab switching with animation
function selectTab(tabName) {
    const contents = document.querySelectorAll('.content');
    const tabs = document.querySelectorAll('.tab');
    
    // Hide all contents and remove active class from tabs
    contents.forEach(content => {
        content.style.display = 'none';
    });
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected content and add active class to selected tab
    document.getElementById(tabName).style.display = 'block';
    document.querySelector(`.tab[onclick="selectTab('${tabName}')"]`).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    addFadeInAnimation();
    
    const initialContent = document.querySelector('.content');
    if (initialContent) {
        initialContent.style.opacity = '1';
        initialContent.style.transform = 'translateY(0)';
    }
});
