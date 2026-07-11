// ==========================================================
// FARMORA — script.js
// - Mobile menu toggle
// - Header color change on scroll
// - Auto-generate WhatsApp links (general & per-product)
// - Scroll-reveal animations + subtle parallax
// ==========================================================

// ---- CONFIG: UPDATE TO MATCH YOUR BUSINESS DATA ----
const WHATSAPP_NUMBER = "6281282333856"; // international format, no "+" and no leading "0"
const DEFAULT_MESSAGE = "Hello FARMORA, I'd like to ask about your coconut products.";

function buildProductMessage(productName) {
  return `Hello FARMORA, I'd like to order the following product:\n` + `Product: ${productName}\n\n` + `Please share availability, pricing, and estimated delivery. Thank you.`;
}

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Attach the general WA link to every ".whatsapp-btn" WITHOUT a data-product
document.querySelectorAll(".whatsapp-btn:not(.btn-pesan-produk)").forEach((btn) => {
  btn.setAttribute("href", waLink(DEFAULT_MESSAGE));
  btn.setAttribute("target", "_blank");
  btn.setAttribute("rel", "noopener noreferrer");
});

// Attach the per-product WA link (the "Order Now" button on each product card)
document.querySelectorAll(".btn-pesan-produk").forEach((btn) => {
  const productName = btn.getAttribute("data-product") || "FARMORA Product";
  btn.setAttribute("href", waLink(buildProductMessage(productName)));
  btn.setAttribute("target", "_blank");
  btn.setAttribute("rel", "noopener noreferrer");
});

// ---- Mobile menu ----
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

menuToggle?.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Close mobile menu when a link is clicked
mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
});

// ---- Header changes color on scroll ----
const header = document.getElementById("header");

function handleHeaderScroll() {
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", handleHeaderScroll);
handleHeaderScroll();

// ---- Scroll-reveal animations (IntersectionObserver, mobile-friendly) ----
const revealTargets = document.querySelectorAll(".reveal-up, .journey-line");

if ("IntersectionObserver" in window && revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // small stagger for elements revealing together
          const delay = Math.min(i * 60, 300);
          setTimeout(() => entry.target.classList.add("is-visible"), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  // Fallback: no IntersectionObserver support — just show everything
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

// ---- Subtle parallax on hero + section images (skipped on touch devices for performance) ----
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const heroImg = document.getElementById("hero-img");
  const parallaxImgs = document.querySelectorAll(".img-parallax");
  const isMobile = window.innerWidth < 768;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    const isMobile = window.innerWidth < 768;

    if (heroImg) {
      const heroSpeed = isMobile ? 0.08 : 0.15;
      heroImg.style.transform = `translateY(${scrollY * heroSpeed}px) scale(1.08)`;
    }

    parallaxImgs.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const speed = isMobile ? 0.02 : 0.04;
      const offset = (rect.top - window.innerHeight / 2) * speed;
      img.style.transform = `translateY(${offset}px)`;
    });

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  updateParallax();
}
