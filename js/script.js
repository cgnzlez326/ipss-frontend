const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const form = document.getElementById('contactForm');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark');
    themeToggle.textContent = '☀️';
} else {
    themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', function () {
    body.classList.toggle('dark');
    if (body.classList.contains('dark')) {
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
});

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
