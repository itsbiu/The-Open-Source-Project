// =============================================
//  The Open Source Project — main.js
// =============================================

// --- Typewriter effect ---
const TYPEWRITER_TEXT = "Bienvenido a The Open Source Project";
let twIndex = 0;

function typeEffect() {
    const titleEl = document.getElementById("title");
    if (!titleEl) return;

    if (twIndex < TYPEWRITER_TEXT.length) {
        titleEl.textContent += TYPEWRITER_TEXT.charAt(twIndex);
        twIndex++;
        requestAnimationFrame(() => setTimeout(typeEffect, 80));
    } else {
        const cursor = document.createElement("span");
        cursor.className = "cursor";
        cursor.setAttribute("aria-hidden", "true");
        cursor.textContent = "|";
        titleEl.appendChild(cursor);
    }
}

// --- Loading overlay ---
function hideLoadingOverlay() {
    const overlay = document.getElementById("loadingOverlay");
    if (!overlay) return;
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 500);
}

// --- Enter site transition ---
function enterSite() {
    const welcomePage = document.getElementById("welcomePage");
    const contenido = document.getElementById("contenido");

    welcomePage.classList.add("fade-out");

    setTimeout(() => {
        welcomePage.remove();
        contenido.hidden = false;
        contenido.classList.add("fade-in");

        document.querySelectorAll(".card-section").forEach(s => {
            revealObserver.observe(s);
        });

        setTimeout(() => {
            const header = document.getElementById("inicio");
            if (header) header.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, 500);
}

// --- Accordion ---
function toggleCard(btn) {
    const card = btn.closest(".accordion-card");
    const contentId = btn.getAttribute("aria-controls");
    const content = document.getElementById(contentId);
    const isOpen = btn.getAttribute("aria-expanded") === "true";

    btn.setAttribute("aria-expanded", String(!isOpen));
    content.hidden = isOpen;
    card.classList.toggle("active", !isOpen);
}

// --- Back to top button ---
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (backToTopBtn) {
        backToTopBtn.hidden = window.scrollY <= 500;
    }

    const nav = document.getElementById("siteNav");
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

// --- Newsletter con EmailJS ---
async function handleSubscribe() {
    const emailInput   = document.getElementById("email-sub");
    const privacyCheck = document.getElementById("privacy-check");
    const msg          = document.getElementById("newsletter-msg");

    if (!emailInput.value || !emailInput.validity.valid) {
        msg.textContent = "Por favor, introduce un email válido.";
        msg.className = "newsletter-msg error";
        emailInput.focus();
        return;
    }

    if (!privacyCheck.checked) {
        msg.textContent = "Debes aceptar la política de privacidad.";
        msg.className = "newsletter-msg error";
        privacyCheck.focus();
        return;
    }

    msg.textContent = "Enviando...";
    msg.className = "newsletter-msg";

    try {
        await emailjs.send(
            "service_bz5dvun",
            "template_g64mbp1",
            {
                user_email: emailInput.value,
                date: new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    year:    "numeric",
                    month:   "long",
                    day:     "numeric"
                })
            }
        );

        msg.textContent = "¡Gracias por suscribirte! 🌸 Te mantendremos al día.";
        msg.className = "newsletter-msg success";
        emailInput.value = "";
        privacyCheck.checked = false;

    } catch (error) {
        msg.textContent = "Algo falló. Por favor, inténtalo de nuevo.";
        msg.className = "newsletter-msg error";
        console.error("EmailJS error:", error);
    }
}

// --- Mobile menu ---
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = !mobileMenu.hidden;
        mobileMenu.hidden = isOpen;
        navToggle.setAttribute("aria-expanded", String(!isOpen));
        navToggle.querySelector("i").className = isOpen ? "fas fa-bars" : "fas fa-times";
    });
}

function closeMobileMenu() {
    if (mobileMenu) mobileMenu.hidden = true;
    if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.querySelector("i").className = "fas fa-bars";
    }
}

// --- Scroll-reveal via IntersectionObserver ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

// --- Smooth scroll for anchor links ---
document.addEventListener("click", e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
    }
});

// --- Init on load ---
window.addEventListener("load", () => {
    emailjs.init("hne1y0REm-3wem4nl");

    // Si venimos de una página de documentación, saltar la bienvenida
    if (window.location.hash === '#inicio') {
        const welcomePage = document.getElementById("welcomePage");
        const contenido   = document.getElementById("contenido");
        if (welcomePage && contenido) {
            welcomePage.remove();
            contenido.hidden = false;
            contenido.classList.add("fade-in");
            document.querySelectorAll(".card-section").forEach(s => revealObserver.observe(s));
            setTimeout(() => {
                const header = document.getElementById("inicio");
                if (header) header.scrollIntoView({ behavior: "smooth" });
            }, 150);
            hideLoadingOverlay();
            return;
        }
    }

    typeEffect();
    setTimeout(hideLoadingOverlay, 300);
});
