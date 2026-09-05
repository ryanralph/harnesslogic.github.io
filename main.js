// Harness Logic — shared behaviours

(function mobileNav() {
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");
  if (!navToggle || !siteNav) return;

  navToggle.addEventListener("click", function () {
    var open = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  siteNav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") siteNav.classList.remove("is-open");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") siteNav.classList.remove("is-open");
  });
})();

(function scrollReveal() {
  var revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("reveal--visible"); });
    return;
  }

  var io = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach(function (el) { io.observe(el); });
})();

(function contactForm() {
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/mbgjkqbe";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var statusEl = document.getElementById("form-status");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var services = form.querySelectorAll('input[name="services"]:checked');
    if (services.length === 0) {
      statusEl.textContent = "Please select at least one service.";
      statusEl.className = "form-status form-status--error";
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    statusEl.textContent = "";
    statusEl.className = "form-status";

    try {
      var res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.hidden = true;
        statusEl.textContent = "Thanks — your enquiry has been sent. We'll be in touch shortly.";
        statusEl.className = "form-status form-status--success";
      } else {
        throw new Error("Submit failed");
      }
    } catch (err) {
      statusEl.textContent = "Something went wrong sending your enquiry. Please email info@harnesslogic.com directly.";
      statusEl.className = "form-status form-status--error";
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
})();
