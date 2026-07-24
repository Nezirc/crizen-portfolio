(() => {
  const root = document.documentElement;
  const themeButtons = [
    document.getElementById("theme-toggle"),
    document.getElementById("mobile-theme-toggle"),
  ];
  const themeLabel = document.getElementById("theme-label");
  const themeIcon = document.getElementById("theme-icon");
  const mobileThemeLabel = document.getElementById("mobile-theme-label");
  const mobileThemeIcon = document.getElementById("mobile-theme-icon");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileToggle = document.getElementById("mobile-toggle");
  const views = [...document.querySelectorAll(".view")];
  const buttons = [...document.querySelectorAll("[data-view]")];

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Storage may be blocked in private browsing.
    }
  }

  function syncTheme() {
    const isLight = root.dataset.theme === "light";

    themeLabel.textContent = isLight ? "Dark mode" : "Light mode";
    mobileThemeLabel.textContent = isLight ? "Dark" : "Light";
    themeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(isLight));
    });
  }

  function toggleTheme() {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    writeStorage("crizen-theme", root.dataset.theme);
    syncTheme();
  }

  function showView(name, updateHash = true) {
    const target = document.getElementById(name) || document.getElementById("profile");

    views.forEach((view) => {
      view.classList.toggle("active", view === target);
    });

    buttons.forEach((button) => {
      const isActive = button.dataset.view === target.id;
      button.classList.toggle("active", isActive);

      if (isActive) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    const title = target.id === "profile"
      ? "My info"
      : target.querySelector(".page-title")?.textContent || target.id;

    document.title = `${title} | Crizen Sanchez`;
    mobileNav.classList.remove("open");
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileToggle.textContent = "Menu +";

    if (updateHash) {
      try {
        history.replaceState(null, "", `#${target.id}`);
      } catch (error) {
        window.location.hash = target.id;
      }
    }
  }

  function setupProfileImage() {
    const portrait = document.getElementById("portrait");
    const photo = document.getElementById("photo");

    photo.addEventListener("load", () => {
      portrait.classList.add("has-image");
    });

    photo.addEventListener("error", () => {
      portrait.classList.remove("has-image");
    });

    if (photo.complete && photo.naturalWidth > 0) {
      portrait.classList.add("has-image");
    }
  }

  if (readStorage("crizen-theme") === "light") {
    root.dataset.theme = "light";
  }

  themeButtons.forEach((button) => {
    button.addEventListener("click", toggleTheme);
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  window.addEventListener("hashchange", () => {
    showView(window.location.hash.slice(1), false);
  });

  mobileToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    mobileToggle.setAttribute("aria-expanded", String(isOpen));
    mobileToggle.textContent = isOpen ? "Close" : "Menu +";
  });

  const initialView = window.location.hash.slice(1);
  const validViews = ["profile", "experience", "stack", "contact"];

  showView(validViews.includes(initialView) ? initialView : "profile", false);
  syncTheme();
  setupProfileImage();
})();