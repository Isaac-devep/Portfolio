"use strict";

// =========================
// EmailJS Configuration
// =========================
const emailjsServiceId = "service_d9mrm4a"; // tu Service ID
const emailjsTemplateId = "template_gnipza8"; // tu Template ID
const emailjsPublicKey = "1BBwYTR1TkHLkok0U"; // tu Public Key

// Init cuando la librería esté lista
document.addEventListener("DOMContentLoaded", () => {
  if (window.emailjs) {
    emailjs.init({ publicKey: emailjsPublicKey });
  }
});

// =========================
/* Helpers */
// =========================
const elementToggleFunc = (elem) => elem.classList.toggle("active");

// =========================
// Sidebar
// =========================
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener("click", () => {
    elementToggleFunc(sidebar);
    const expanded = sidebar.classList.contains("active");
    sidebarBtn.setAttribute("aria-expanded", String(expanded));
  });
}

// =========================
// Testimonials Modal (opcional)
// =========================
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

const testimonialsModalFunc = () => {
  if (!modalContainer || !overlay) return;
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};

if (testimonialsItem && modalContainer && overlay) {
  for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener("click", function () {
      const avatar = this.querySelector("[data-testimonials-avatar]");
      const title = this.querySelector("[data-testimonials-title]");
      const text = this.querySelector("[data-testimonials-text]");

      if (avatar && title && text && modalImg && modalTitle && modalText) {
        modalImg.src = avatar.src;
        modalImg.alt = avatar.alt || "Avatar";
        modalTitle.innerHTML = title.innerHTML;
        modalText.innerHTML = text.innerHTML;
      }
      testimonialsModalFunc();
    });
  }
}

if (modalCloseBtn)
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);

// =========================
/* Custom select + Filtros */
// =========================
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = (selectedValue) => {
  for (let i = 0; i < filterItems.length; i++) {
    if (
      selectedValue === "all" ||
      selectedValue === filterItems[i].dataset.category
    ) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

if (select) {
  select.addEventListener("click", function () {
    elementToggleFunc(this);
    const expanded = this.classList.contains("active");
    this.setAttribute("aria-expanded", String(expanded));
  });
}

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) select.classList.remove("active");
    filterFunc(selectedValue);
  });
}

// Botones de filtro en pantallas grandes
let lastClickedBtn = filterBtn[0];
for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// =========================
/* Contact Form + EmailJS */
// =========================
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// Habilitar/Deshabilitar botón según validación HTML5
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form && form.checkValidity()) {
      formBtn?.removeAttribute("disabled");
    } else {
      formBtn?.setAttribute("disabled", "");
    }
  });
}

// Envío
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) return;

    try {
      if (!window.emailjs) throw new Error("EmailJS no cargado");
      await emailjs.sendForm(emailjsServiceId, emailjsTemplateId, form);
      alert("Mensaje enviado exitosamente.");
      form.reset();
      formBtn?.setAttribute("disabled", "");
    } catch (error) {
      alert(
        "Error al enviar el mensaje: " +
          (error?.message || JSON.stringify(error))
      );
    }
  });
}

// =========================
/* Navegación entre páginas */
// =========================
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const target = this.innerHTML.trim().toLowerCase();

    // activar artículo
    for (let j = 0; j < pages.length; j++) {
      const isActive = target === pages[j].dataset.page;
      pages[j].classList.toggle("active", isActive);
    }

    // actualizar estados de los botones
    for (let k = 0; k < navigationLinks.length; k++) {
      const btn = navigationLinks[k];
      const isCurrent = btn === this;
      btn.classList.toggle("active", isCurrent);
      btn.toggleAttribute("aria-current", isCurrent);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}