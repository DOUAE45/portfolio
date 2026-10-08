const root = document.documentElement;
const themeToggle = document.querySelector("#themeToggle");
const menuToggle = document.querySelector("#menuToggle");
const nav = document.querySelector(".main-nav");
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.querySelector(".contact-form");
const profilePhoto = document.querySelector(".profile-photo");
const portraitFallback = document.querySelector(".portrait-fallback");

function showPortraitFallback() {
  if (!profilePhoto || !portraitFallback) return;
  profilePhoto.hidden = true;
  portraitFallback.hidden = false;
}

if (profilePhoto && portraitFallback) {
  profilePhoto.addEventListener("error", showPortraitFallback);
  if (profilePhoto.complete && profilePhoto.naturalWidth === 0) {
    showPortraitFallback();
  } else {
    portraitFallback.hidden = true;
  }
}

const savedTheme = localStorage.getItem("portfolio-theme");
root.dataset.theme = savedTheme || "dark";

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function updateThemeIcon() {
  const icon = themeToggle?.querySelector("i");
  if (!icon) return;
  icon.setAttribute(
    "data-lucide",
    root.dataset.theme === "dark" ? "moon" : "sun",
  );
  themeToggle.setAttribute(
    "aria-label",
    root.dataset.theme === "dark"
      ? "Activer le thème clair"
      : "Activer le thème sombre",
  );
  refreshIcons();
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  updateThemeIcon();
});

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fermer le menu" : "Ouvrir le menu",
  );
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Ouvrir le menu");
  }
});

filterButtons.forEach((button) => {
  button.setAttribute(
    "aria-pressed",
    String(button.classList.contains("active")),
  );
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    projectCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !matches);
    });
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const recipient = contactForm.dataset.recipient?.trim();
  const note = contactForm.querySelector(".form-note");

  if (!recipient || recipient === "votre.email@exemple.com") {
    note.textContent =
      "Ajoutez votre adresse email dans le formulaire avant de publier ce portfolio.";
    note.dataset.state = "error";
    return;
  }

  const formData = new FormData(contactForm);
  const subject = `Candidature stage PFE 2027 - ${formData.get("name")}`;
  const body = [
    `Nom : ${formData.get("name")}`,
    `Email : ${formData.get("email")}`,
    "",
    formData.get("message"),
  ].join("\n");
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  note.textContent =
    "Votre application de messagerie va s'ouvrir avec votre message prérempli.";
  note.dataset.state = "success";
  window.location.href = mailto;
});

const currentYear = document.querySelector("#currentYear");
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

updateThemeIcon();
refreshIcons();
