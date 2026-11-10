const CONFIG = { FORM_ENDPOINT: "" };
const btn = document.getElementById("menu-btn"), links = document.getElementById("nav-links");
const icon = btn.querySelector("i"), nav = document.querySelector("nav");
btn.addEventListener("click", () => {
  links.classList.toggle("open");
  icon.className = links.classList.contains("open") ? "ri-close-line" : "ri-menu-3-line";
});
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 10);
addEventListener("scroll", onScroll, { passive: true }); onScroll();

const form = document.getElementById("contact-form");
if (form) {
  const p = new URLSearchParams(location.search).get("destination");
  if (p && form.destination) form.destination.value = p;
  const status = document.getElementById("form-status");
  const rules = {
    name: (v) => v.trim().length >= 2 || "Veuillez saisir votre nom.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Veuillez saisir une adresse e-mail valide.",
    message: (v) => v.trim().length >= 10 || "Votre message doit contenir au moins 10 caractères.",
  };
  const check = (n) => {
    const f = form[n], r = rules[n](f.value), err = document.getElementById("err-" + n);
    f.setAttribute("aria-invalid", r !== true); err.textContent = r === true ? "" : r; return r === true;
  };
  Object.keys(rules).forEach((n) => form[n].addEventListener("blur", () => check(n)));
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); status.textContent = "";
    const ok = Object.keys(rules).map(check).every(Boolean);
    if (!ok || form.website.value) return;
    if (!CONFIG.FORM_ENDPOINT) { status.textContent = "Le formulaire n'est pas encore relié à une boîte mail. Votre message n'a pas été envoyé."; return; }
    try {
      const r = await fetch(CONFIG.FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.value, email: form.email.value, destination: form.destination.value, message: form.message.value }) });
      if (!r.ok) throw new Error();
      form.reset(); status.textContent = "Merci, votre message a bien été envoyé.";
    } catch (x) { status.textContent = "Une erreur est survenue. Veuillez réessayer plus tard."; }
  });
}
