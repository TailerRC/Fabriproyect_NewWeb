const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

let currentHeroIndex = 0;
const heroSlides = document.querySelectorAll('.hero-slide');
const heroIntervalTime = 5000; 
let heroInterval;

function showHeroSlide(index) {
    if (heroSlides.length === 0) return;
    if (index >= heroSlides.length) currentHeroIndex = 0;
    else if (index < 0) currentHeroIndex = heroSlides.length - 1;
    else currentHeroIndex = index;
    heroSlides.forEach(slide => slide.classList.remove('active'));
    heroSlides[currentHeroIndex].classList.add('active');
}

function moveHeroSlide(direction) {
    showHeroSlide(currentHeroIndex + direction);
    resetHeroTimer();
}

function startHeroTimer() {
    if (heroSlides.length > 1) {
        heroInterval = setInterval(() => {
            moveHeroSlide(1);
        }, heroIntervalTime);
    }
}

function resetHeroTimer() {
    clearInterval(heroInterval);
    startHeroTimer();
}

const observerOptions = {
    threshold: 0.15, 
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    startHeroTimer();
    const animatedElements = document.querySelectorAll('.feature-card, .detail-row, .cta-content');
    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s ease-out";
        observer.observe(el);
    });
});