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

document.querySelectorAll('.info-card, .map-section, .form-section').forEach(section => {
    observer.observe(section);
});

// Form submission handler
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Obtener valores del formulario
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        asunto: document.getElementById('asunto').value,
        mensaje: document.getElementById('mensaje').value
    };
    
    // Aquí puedes agregar la lógica para enviar el formulario
    // Por ahora solo mostramos un alert
    console.log('Datos del formulario:', formData);
    
    alert('¡Gracias por contactarnos! Hemos recibido tu mensaje y te responderemos pronto.\n\n(En producción, esto enviará el formulario a tu servidor)');
    
    // Limpiar formulario
    contactForm.reset();
});

// Validación en tiempo real
const inputs = document.querySelectorAll('.form-group input, .form-group textarea');

inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.style.borderColor = '#ff4444';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = '#0033cc';
    });
});