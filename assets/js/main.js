/* ==========================================================================
   MUNICIPALIDAD DE CHOLCHOL - JS propio sobre Bootstrap 5.3
   file://-safe: sin fetch, sin módulos. Usa eventos de ciclo de vida de
   Bootstrap (carousel, offcanvas, modal) + reveal y filtro de tabla.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initHeroCarousel();
    initOffcanvasNav();
    initLightbox();
    initContactFilter();
    initContactForm();
    initReveal();
    initFooterYear();
  });

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ------------------------------------------------------------------
     Carousel hero: init manual (respeta reduced-motion) + ciclo de vida
     ------------------------------------------------------------------ */
  function initHeroCarousel() {
    var carouselEl = document.querySelector(".hero-carousel");
    if (!carouselEl || typeof bootstrap === "undefined") return;

    var opts = { wrap: true, pause: "hover", touch: true };
    if (reducedMotion()) {
      opts.ride = false;           // sin autoplay si el usuario lo prefiere
    } else {
      opts.ride = "carousel";
      opts.interval = 5000;
    }
    var carousel = new bootstrap.Carousel(carouselEl, opts);

    var counter = document.getElementById("heroCounter");
    var total = document.querySelectorAll(".hero-carousel .carousel-item").length;
    if (counter && total) {
      counter.textContent = "1";
      document.getElementById("heroTotal").textContent = total;
    }

    // Ciclo de vida: actualizar contador al terminar cada transición
    carouselEl.addEventListener("slid.bs.carousel", function (e) {
      if (counter) counter.textContent = e.to + 1;
    });

    // Hover: pausa y reanudación explícitas (además de la opción "hover")
    carouselEl.addEventListener("mouseenter", function () { carousel.pause(); });
    carouselEl.addEventListener("mouseleave", function () {
      if (!reducedMotion()) carousel.cycle();
    });
  }

  /* ------------------------------------------------------------------
     Offcanvas (menú móvil): gestión de foco al abrir/cerrar
     ------------------------------------------------------------------ */
  function initOffcanvasNav() {
    var canvas = document.getElementById("mainNav");
    if (!canvas) return;

    canvas.addEventListener("shown.bs.offcanvas", function () {
      var first = canvas.querySelector(".offcanvas-body .nav-link, .offcanvas-body a");
      if (first) first.focus();
    });

    canvas.addEventListener("hidden.bs.offcanvas", function () {
      var toggler = document.querySelector('[data-bs-toggle="offcanvas"][data-bs-target="#mainNav"]');
      if (toggler) toggler.focus();
    });
  }

  /* ------------------------------------------------------------------
     Modal lightbox para galerías: foco y limpieza en ciclo de vida
     ------------------------------------------------------------------ */
  function initLightbox() {
    var lb = document.getElementById("lightbox");
    if (!lb || typeof bootstrap === "undefined") return;

    var lbImg = lb.querySelector("img");
    var modal = new bootstrap.Modal(lb);
    var lastTrigger = null;

    var triggers = document.querySelectorAll(".gallery a, .lightbox-trigger");
    triggers.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        lastTrigger = link;
        lbImg.src = link.getAttribute("href");
        modal.show();
      });
    });

    lb.addEventListener("hidden.bs.modal", function () {
      lbImg.removeAttribute("src");
      if (lastTrigger) lastTrigger.focus();
    });
  }

  /* ------------------------------------------------------------------
     Filtro de la tabla de contactos
     ------------------------------------------------------------------ */
  function initContactFilter() {
    var filter = document.getElementById("contactFilter");
    var table = document.getElementById("contactTable");
    if (!filter || !table) return;

    var rows = table.querySelectorAll("tbody tr");

    filter.addEventListener("input", function () {
      var q = this.value.trim().toLowerCase();
      rows.forEach(function (tr) {
        tr.style.display = tr.textContent.toLowerCase().indexOf(q) !== -1 ? "" : "none";
      });
    });
  }

  /* ------------------------------------------------------------------
     Formulario de contacto: validación en tiempo real (input/blur)
     ------------------------------------------------------------------ */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var nameInput = document.getElementById("contactName");
    var emailInput = document.getElementById("contactEmail");
    var messageInput = document.getElementById("contactMessage");
    var nameFeedback = document.getElementById("contactNameFeedback");
    var emailFeedback = document.getElementById("contactEmailFeedback");
    var messageFeedback = document.getElementById("contactMessageFeedback");
    var success = document.getElementById("formSuccess");

    var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    var touched = { name: false, email: false, message: false };

    function markTouched(el) {
      if (el === nameInput) touched.name = true;
      else if (el === emailInput) touched.email = true;
      else touched.message = true;
    }

    function isTouched(el) {
      if (el === nameInput) return touched.name;
      if (el === emailInput) return touched.email;
      return touched.message;
    }

    function setState(input, feedback, valid, message) {
      input.classList.toggle("is-invalid", !valid);
      input.classList.toggle("is-valid", valid);
      input.setAttribute("aria-invalid", valid ? "false" : "true");
      feedback.textContent = valid ? "" : message;
      return valid;
    }

    function validateName() {
      var v = nameInput.value.trim();
      if (!v) return setState(nameInput, nameFeedback, false, "Ingresa tu nombre.");
      return setState(nameInput, nameFeedback, true, "");
    }

    function validateEmail() {
      var v = emailInput.value.trim();
      if (!v) return setState(emailInput, emailFeedback, false, "Ingresa tu correo electrónico.");
      if (!EMAIL_REGEX.test(v)) {
        return setState(emailInput, emailFeedback, false, "Ingresa un correo electrónico válido (ej: nombre@dominio.cl).");
      }
      return setState(emailInput, emailFeedback, true, "");
    }

    function validateMessage() {
      var v = messageInput.value.trim();
      if (!v) return setState(messageInput, messageFeedback, false, "Escribe tu mensaje.");
      return setState(messageInput, messageFeedback, true, "");
    }

    function validateField(el) {
      if (el === nameInput) return validateName();
      if (el === emailInput) return validateEmail();
      return validateMessage();
    }

    function validateAll() {
      markTouched(nameInput);
      markTouched(emailInput);
      markTouched(messageInput);
      var ok = true;
      if (!validateName()) ok = false;
      if (!validateEmail()) ok = false;
      if (!validateMessage()) ok = false;
      return ok;
    }

    function clearStates() {
      [nameInput, emailInput, messageInput].forEach(function (el) {
        el.classList.remove("is-valid", "is-invalid");
        el.setAttribute("aria-invalid", "false");
      });
      nameFeedback.textContent = "";
      emailFeedback.textContent = "";
      messageFeedback.textContent = "";
    }

    [nameInput, emailInput, messageInput].forEach(function (el) {
      el.addEventListener("input", function () {
        markTouched(this);
        validateField(this);
      });
      el.addEventListener("blur", function () {
        if (isTouched(this) || this.value.trim() !== "") {
          markTouched(this);
          validateField(this);
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateAll()) {
        var firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var data = {
        nombre: nameInput.value.trim(),
        correo: emailInput.value.trim(),
        mensaje: messageInput.value.trim()
      };
      console.log("Formulario de contacto enviado:", data);

      form.reset();
      success.textContent = "Mensaje enviado correctamente. Te contactaremos pronto.";
      success.hidden = false;
      nameInput.focus();
    });

    form.addEventListener("reset", function () {
      clearStates();
      touched.name = touched.email = touched.message = false;
      success.hidden = true;
    });
  }

  /* ------------------------------------------------------------------
     Revelado al scroll (IntersectionObserver, respeta reduced-motion)
     ------------------------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (reducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     Año en el footer
     ------------------------------------------------------------------ */
  function initFooterYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }
})();
