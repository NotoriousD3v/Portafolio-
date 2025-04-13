// main.js - Código JavaScript para el consultorio dental

document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle para móviles
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace (para móviles)
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    });

    // Sticky header con efecto de scroll
    const header = document.querySelector('.header-sticky');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Hero slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    let currentSlide = 0;

    function showSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroSlides[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % heroSlides.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        let prevIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        showSlide(prevIndex);
    }

    sliderNext.addEventListener('click', nextSlide);
    sliderPrev.addEventListener('click', prevSlide);

    // Auto-avance del slider cada 5 segundos
    let slideInterval = setInterval(nextSlide, 5000);

    // Pausar auto-avance cuando el mouse está sobre el slider
    const heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSection.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Testimonials slider
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialNext = document.querySelector('.testimonial-next');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        testimonialCards[index].classList.add('active');
        currentTestimonial = index;
    }

    testimonialNext.addEventListener('click', function() {
        let nextIndex = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(nextIndex);
    });

    testimonialPrev.addEventListener('click', function() {
        let prevIndex = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(prevIndex);
    });

    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header-sticky').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animación al hacer scroll (reveal effect)
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.experience-card, .service-card, .tech-content, .testimonial-card, .appointment-form, .contact-form');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Ejecutar una vez al cargar la página

    // Validación de formularios
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            // Validación especial para email
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && !isValidEmail(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
            }

            if (!isValid) {
                e.preventDefault();
                this.querySelector('.error').focus();
                showNotification('Por favor complete todos los campos requeridos correctamente', 'error');
            } else {
                // Simulación de envío exitoso (en un caso real sería una petición AJAX)
                e.preventDefault();
                showNotification('Su mensaje ha sido enviado con éxito. Nos pondremos en contacto pronto.', 'success');
                this.reset();
            }
        });
    });

    // Función para validar email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Mostrar notificación
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Contador de estadísticas (ejemplo: años de experiencia, pacientes atendidos)
    const statsSection = document.querySelector('#sobre-nosotros');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }

    function startCounters() {
        const counters = [
            { element: document.querySelector('.years-experience'), target: 15, suffix: '+' },
            { element: document.querySelector('.happy-patients'), target: 2500, suffix: '+' },
            { element: document.querySelector('.procedures'), target: 500, suffix: '+' }
        ];
        
        const duration = 2000; // 2 segundos
        const interval = 50; // ms
        const steps = duration / interval;
        
        counters.forEach(counter => {
            if (!counter.element) return;
            
            const start = 0;
            const increment = counter.target / steps;
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= counter.target) {
                    clearInterval(timer);
                    current = counter.target;
                }
                counter.element.textContent = Math.floor(current) + (counter.suffix || '');
            }, interval);
        });
    }
});

// Efecto de carga inicial
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Retraso para la animación de carga
    setTimeout(() => {
        const loader = document.querySelector('.page-loader');
        if (loader) loader.style.display = 'none';
    }, 500);
});