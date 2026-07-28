(function () {
    'use strict';

    var body = document.body;
    var savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        body.classList.add('dark');
    }

    var themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.title = 'Alternar modo día/noche';
    themeToggle.setAttribute('aria-label', 'Alternar modo día/noche');
    themeToggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener('click', function () {
        body.classList.toggle('dark');
        themeToggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
        localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    });

    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var data = {
                nombreCompleto: document.getElementById('nombre').value.trim(),
                servicio: document.getElementById('servicio').value,
                mensaje: document.getElementById('mensaje').value.trim()
            };

            if (!data.nombreCompleto || !data.servicio || !data.mensaje) {
                console.warn('Formulario incompleto: todos los campos son obligatorios.');
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }

            console.log('===== DATOS DEL FORMULARIO DE CONTACTO =====');
            console.log('Nombre completo:', data.nombreCompleto);
            console.log('Servicio:', data.servicio);
            console.log('Mensaje:', data.mensaje);
            console.log('Fecha de envío:', new Date().toLocaleString('es-CO'));
            console.log('============================================');

            form.reset();
            alert('Formulario enviado. Revisa la consola del navegador (F12) para ver los datos.');
        });
    }

    var hamburger = document.getElementById('hamburger');
    var navbarMenu = document.getElementById('navbarMenu');
    var navLinks = document.querySelectorAll('.navbar-links a');

    if (hamburger && navbarMenu) {
        hamburger.addEventListener('click', function () {
            var isActive = hamburger.classList.toggle('active');
            navbarMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            hamburger.setAttribute('aria-label', isActive ? 'Cerrar menú' : 'Abrir menú');
            body.classList.toggle('menu-open', isActive);
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navbarMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'Abrir menú');
                body.classList.remove('menu-open');
            });
        });

        document.addEventListener('click', function (e) {
            var isClickInside = navbarMenu.contains(e.target) || hamburger.contains(e.target);
            if (!isClickInside && navbarMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navbarMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'Abrir menú');
                body.classList.remove('menu-open');
            }
        });
    }


    var navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    var sections = document.querySelectorAll('section[id]');
    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            var currentId = '';

            sections.forEach(function (section) {
                var sectionTop = section.offsetTop - 100;
                var sectionHeight = section.offsetHeight;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    currentId = section.getAttribute('id');
                }
            });

            navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentId) {
                    link.classList.add('active');
                }
            });
        });
    }

})();
