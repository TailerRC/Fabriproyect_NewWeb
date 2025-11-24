// Navbar sticky con efecto de transparencia
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Prevenir navegación en enlaces deshabilitados (pero permitir click)
document.querySelectorAll('a.disabled').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // El link es clickeable pero no hace nada aún
    });
});

// Smooth scroll para los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (!this.classList.contains('disabled')) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Animación de entrada para las secciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-section, .cta-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    observer.observe(section);
});

// Sistema de Carruseles Múltiples
const carousels = {
    corte: { current: 0, interval: null },
    rolado: { current: 0, interval: null },
    torneado: { current: 0, interval: null }
};

// Función para mostrar slide específico de un carrusel
function showSlideCarousel(carouselName, index) {
    const container = document.getElementById(`carousel-${carouselName}`);
    if (!container) return;
    
    const slides = container.querySelectorAll('.carousel-slide');
    const indicators = container.querySelectorAll('.carousel-indicator');
    
    if (slides.length === 0) return;
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    if (index >= slides.length) carousels[carouselName].current = 0;
    else if (index < 0) carousels[carouselName].current = slides.length - 1;
    else carousels[carouselName].current = index;
    
    slides[carousels[carouselName].current].classList.add('active');
    if (indicators[carousels[carouselName].current]) {
        indicators[carousels[carouselName].current].classList.add('active');
    }
}

// Cambiar slide (siguiente/anterior)
function changeSlideCarousel(carouselName, direction) {
    const newIndex = carousels[carouselName].current + direction;
    showSlideCarousel(carouselName, newIndex);
    resetAutoSlideCarousel(carouselName);
}

// Ir a slide específico
function goToSlideCarousel(carouselName, index) {
    showSlideCarousel(carouselName, index);
    resetAutoSlideCarousel(carouselName);
}

// Auto-slide para un carrusel específico
function autoSlideCarousel(carouselName) {
    const container = document.getElementById(`carousel-${carouselName}`);
    if (!container) return;
    
    const slides = container.querySelectorAll('.carousel-slide');
    if (slides.length <= 1) return;
    
    carousels[carouselName].current++;
    showSlideCarousel(carouselName, carousels[carouselName].current);
}

// Resetear auto-slide
function resetAutoSlideCarousel(carouselName) {
    const container = document.getElementById(`carousel-${carouselName}`);
    if (!container) return;
    
    const slides = container.querySelectorAll('.carousel-slide');
    if (slides.length <= 1) return;
    
    clearInterval(carousels[carouselName].interval);
    carousels[carouselName].interval = setInterval(() => {
        autoSlideCarousel(carouselName);
    }, 4000);
}

// Inicializar todos los carruseles
window.addEventListener('DOMContentLoaded', () => {
    ['corte', 'rolado', 'torneado'].forEach(carouselName => {
        const container = document.getElementById(`carousel-${carouselName}`);
        if (container) {
            showSlideCarousel(carouselName, 0);
            
            const slides = container.querySelectorAll('.carousel-slide');
            if (slides.length > 1) {
                carousels[carouselName].interval = setInterval(() => {
                    autoSlideCarousel(carouselName);
                }, 4000);
            }
        }
    });
});