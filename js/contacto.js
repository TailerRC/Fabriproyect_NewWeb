// ==========================================
// ZOHO FORMS VALIDATION SCRIPT
// ==========================================

// Verificar si el formulario fue enviado exitosamente (redirección desde Zoho)
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('enviado') === 'true') {
        // Mostrar mensaje de éxito
        showSuccessMessage();
        // Limpiar el parámetro de la URL sin recargar la página
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Configurar hora local de Perú automáticamente
    setPeruvianDateTime();
});

// Función para establecer la fecha y hora de Perú
function setPeruvianDateTime() {
    try {
        // Crear fecha actual en zona horaria de Perú (UTC-5)
        const now = new Date();
        const peruTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Lima"}));
        
        // Formatear la fecha y hora
        const day = peruTime.getDate().toString().padStart(2, '0');
        const month = (peruTime.getMonth() + 1).toString().padStart(2, '0');
        const year = peruTime.getFullYear();
        const hours = peruTime.getHours().toString().padStart(2, '0');
        const minutes = peruTime.getMinutes().toString().padStart(2, '0');
        const seconds = peruTime.getSeconds().toString().padStart(2, '0');
        
        const peruDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} (Hora Perú)`;
        
        // Establecer el valor en el campo oculto
        const horaLocalField = document.getElementById('horaLocal');
        if (horaLocalField) {
            horaLocalField.value = peruDateTime;
        }
    } catch (error) {
        console.log('Error al configurar hora de Perú:', error);
        // Fallback: usar hora local del sistema
        const now = new Date();
        const fallbackDateTime = now.toLocaleString('es-PE') + ' (Hora Local)';
        const horaLocalField = document.getElementById('horaLocal');
        if (horaLocalField) {
            horaLocalField.value = fallbackDateTime;
        }
    }
}

function showSuccessMessage() {
    // Crear el overlay de éxito
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    overlay.innerHTML = `
        <div class="success-modal">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>¡Mensaje Enviado!</h2>
            <p>Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.</p>
            <button class="btn-success-close" onclick="closeSuccessMessage()">Aceptar</button>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Agregar estilos dinámicamente
    const style = document.createElement('style');
    style.textContent = `
        .success-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        .success-modal {
            background: white;
            padding: 50px;
            border-radius: 20px;
            text-align: center;
            max-width: 450px;
            margin: 20px;
            animation: slideUp 0.4s ease;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .success-icon {
            font-size: 80px;
            color: #28a745;
            margin-bottom: 20px;
        }
        .success-icon i {
            animation: scaleIn 0.5s ease 0.2s backwards;
        }
        .success-modal h2 {
            color: #333;
            margin-bottom: 15px;
            font-size: 28px;
        }
        .success-modal p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
            font-size: 16px;
        }
        .btn-success-close {
            background: linear-gradient(135deg, #0033cc 0%, #0055ff 100%);
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-success-close:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 51, 204, 0.3);
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Scroll al formulario
    const formSection = document.querySelector('.form-section');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function closeSuccessMessage() {
    const overlay = document.querySelector('.success-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => overlay.remove(), 300);
    }
}

// Configuración de campos obligatorios y campos del formulario
var zf_MandArray = ["SingleLine1", "Email", "SingleLine", "MultiLine"];
var zf_FieldArray = ["SingleLine1", "Email", "PhoneNumber_countrycode", "SingleLine", "MultiLine", "SingleLine2"];
var isSalesIQIntegrationEnabled = false;
var salesIQFieldsArray = [];

// Configuración de formato de fecha
function zf_SetDateAndMonthRegexBasedOnDateFormate(dateFormat) {
    var dateRegex, monthYearRegex;
    if (dateFormat === 'dd-MMM-yyyy') {
        dateRegex = '^([0-2][0-9]|3[0-1])-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9]{4}$';
        monthYearRegex = '^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9]{4}$';
    } else if (dateFormat === 'MM-dd-yyyy') {
        dateRegex = '^(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])-[0-9]{4}$';
        monthYearRegex = '^(0[1-9]|1[0-2])-[0-9]{4}$';
    } else {
        dateRegex = '^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-[0-9]{4}$';
        monthYearRegex = '^(0[1-9]|1[0-2])-[0-9]{4}$';
    }
    return [dateRegex, monthYearRegex];
}

var dateAndMonthRegexFormateArray = zf_SetDateAndMonthRegexBasedOnDateFormate('dd-MMM-yyyy');
var zf_DateRegex = new RegExp(dateAndMonthRegexFormateArray[0]);
var zf_MonthYearRegex = new RegExp(dateAndMonthRegexFormateArray[1]);

// Función para remover espacios en blanco
function zf_trim(val) {
    return val.replace(/^\s+|\s+$/g, '');
}

// Validar campos obligatorios
function zf_ValidateMandatory(elem) {
    var elemValue = zf_trim(elem.value);
    if (elemValue === '') {
        return true;
    }
    return false;
}

// Validar formato de email
function zf_ValidateEmail(elem) {
    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var elemValue = zf_trim(elem.value);
    if (elemValue !== '' && !emailRegex.test(elemValue)) {
        return true;
    }
    return false;
}

// Validar número de teléfono
function zf_ValidatePhone(elem) {
    var phoneRegex = /^[+]?[0-9\s\-()]*$/;
    var elemValue = zf_trim(elem.value);
    if (elemValue !== '' && !phoneRegex.test(elemValue)) {
        return true;
    }
    return false;
}

// Mostrar mensaje de error
function zf_ShowErrorMsg(elemId) {
    var errorElem = document.getElementById(elemId + '_error');
    if (errorElem) {
        errorElem.style.display = 'block';
    }
}

// Ocultar mensaje de error
function zf_HideErrorMsg(elemId) {
    var errorElem = document.getElementById(elemId + '_error');
    if (errorElem) {
        errorElem.style.display = 'none';
    }
}

// Ocultar todos los mensajes de error
function zf_HideAllErrors() {
    var errorMessages = document.querySelectorAll('.zf-errorMessage');
    errorMessages.forEach(function(elem) {
        elem.style.display = 'none';
    });
}

// Función principal de validación y envío
function zf_ValidateAndSubmit() {
    zf_HideAllErrors();
    var isValid = true;
    
    // Validar campos obligatorios
    for (var i = 0; i < zf_MandArray.length; i++) {
        var fieldName = zf_MandArray[i];
        var elem = document.getElementsByName(fieldName)[0];
        if (elem && zf_ValidateMandatory(elem)) {
            zf_ShowErrorMsg(fieldName);
            if (isValid) {
                elem.focus();
            }
            isValid = false;
        }
    }
    
    // Validar email
    var emailElem = document.getElementsByName('Email')[0];
    if (emailElem && zf_ValidateEmail(emailElem)) {
        zf_ShowErrorMsg('Email');
        if (isValid) {
            emailElem.focus();
        }
        isValid = false;
    }
    
    // Validar teléfono (si tiene valor)
    var phoneElem = document.getElementsByName('PhoneNumber_countrycode')[0];
    if (phoneElem && zf_ValidatePhone(phoneElem)) {
        zf_ShowErrorMsg('PhoneNumber');
        if (isValid) {
            phoneElem.focus();
        }
        isValid = false;
    }
    
    // Si es válido, actualizar hora antes de enviar y mostrar mensaje de éxito
    if (isValid) {
        // Actualizar la hora justo antes de enviar
        setPeruvianDateTime();
        
        setTimeout(function() {
            showSuccessMessage();
            // Limpiar el formulario
            document.getElementById('contactForm').reset();
            // Volver a configurar la hora para el próximo uso
            setPeruvianDateTime();
        }, 1000);
    }
    
    return isValid;
}

// ==========================================
// CÓDIGO ORIGINAL DE CONTACTO.JS
// ==========================================

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

// Form submission handler - El formulario ahora se envía directamente a Zoho Forms
// La validación se maneja a través de zf_ValidateAndSubmit()
const contactForm = document.getElementById('contactForm');

// Configurar el selector de teléfono
function setupPhoneInput() {
    const countrySelect = document.getElementById('country-code');
    const phoneInput = document.getElementById('phone-number');
    const hiddenPhoneField = document.getElementById('international_PhoneNumber_countrycode');
    
    function updateHiddenField() {
        if (phoneInput && countrySelect && hiddenPhoneField) {
            const countryCode = countrySelect.value;
            const phoneNumber = phoneInput.value.replace(/\s+/g, ''); // Remover espacios
            
            if (phoneNumber) {
                // Combinar código de país + número sin espacios
                hiddenPhoneField.value = countryCode + phoneNumber;
            } else {
                hiddenPhoneField.value = '';
            }
        }
    }
    
    // Actualizar cuando cambie el país o el número
    if (countrySelect) {
        countrySelect.addEventListener('change', updateHiddenField);
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Permitir solo números y limitar a 9 dígitos
            let numbers = this.value.replace(/[^0-9]/g, '');
            
            // Limitar a 9 dígitos máximo
            if (numbers.length > 9) {
                numbers = numbers.substring(0, 9);
            }
            
            // Formatear según la cantidad de dígitos
            if (numbers.length >= 7) {
                // Formato: 999 123 456
                this.value = numbers.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
            } else if (numbers.length >= 4) {
                // Formato: 999 123
                this.value = numbers.replace(/(\d{3})(\d{3})/, '$1 $2');
            } else if (numbers.length > 0) {
                // Solo números sin formato
                this.value = numbers;
            }
            
            updateHiddenField();
            zf_HideErrorMsg('PhoneNumber');
        });
        
        phoneInput.addEventListener('blur', function() {
            // Validar que tenga exactamente 9 dígitos si no está vacío
            const numbers = this.value.replace(/[^0-9]/g, '');
            if (numbers.length > 0 && numbers.length !== 9) {
                this.style.borderColor = '#ff4444';
                zf_ShowErrorMsg('PhoneNumber');
                // Actualizar mensaje de error
                const errorMsg = document.getElementById('PhoneNumber_error');
                if (errorMsg) {
                    errorMsg.textContent = 'El teléfono debe tener exactamente 9 dígitos';
                    errorMsg.style.display = 'block';
                }
            } else {
                updateHiddenField();
            }
        });
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', setupPhoneInput);

// Opcional: Agregar evento para limpiar errores cuando el usuario empieza a escribir
if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            zf_HideErrorMsg(this.name);
            // También ocultar error de teléfono si es el campo de teléfono
            if (this.name === 'PhoneNumber_countrycode') {
                zf_HideErrorMsg('PhoneNumber');
            }
        });
    });
}

// Validación en tiempo real para los campos del formulario Zoho
const inputs = document.querySelectorAll('.form-group input, .form-group textarea, .country-code-select, .phone-number-input, .subject-select');

inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.style.borderColor = '#ff4444';
            zf_ShowErrorMsg(this.name);
        } else if (this.name === 'Email' && this.value.trim()) {
            // Validar formato de email
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!emailRegex.test(this.value.trim())) {
                this.style.borderColor = '#ff4444';
                zf_ShowErrorMsg('Email');
            } else {
                this.style.borderColor = '#e0e0e0';
                zf_HideErrorMsg(this.name);
            }
        } else if (this.id === 'phone-number' && this.value.trim()) {
            // Validar que tenga exactamente 9 dígitos
            const numbers = this.value.replace(/[^0-9]/g, '');
            if (numbers.length !== 9) {
                this.style.borderColor = '#ff4444';
                zf_ShowErrorMsg('PhoneNumber');
                const errorMsg = document.getElementById('PhoneNumber_error');
                if (errorMsg) {
                    errorMsg.textContent = 'El teléfono debe tener exactamente 9 dígitos';
                }
            } else {
                this.style.borderColor = '#e0e0e0';
                zf_HideErrorMsg('PhoneNumber');
            }
        } else {
            this.style.borderColor = '#e0e0e0';
            zf_HideErrorMsg(this.name);
            if (this.name === 'PhoneNumber_countrycode' || this.id === 'phone-number') {
                zf_HideErrorMsg('PhoneNumber');
            }
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = '#0033cc';
    });
    
    // Para select: ocultar error cuando cambia
    if (input.tagName === 'SELECT') {
        input.addEventListener('change', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#e0e0e0';
                zf_HideErrorMsg(this.name);
            }
        });
    }
});