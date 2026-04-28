(function () {
  const modernHeader = document.querySelector(".wa-header");
  const modernToggle = document.querySelector(".wa-menu-btn");
  const modernNav = document.querySelector("#wa-nav");

  if (modernHeader && modernToggle && modernNav) {
    modernToggle.addEventListener("click", function () {
      const open = modernHeader.classList.toggle("is-open");
      modernToggle.setAttribute("aria-expanded", open ? "true" : "false");
      modernToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    modernNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        modernHeader.classList.remove("is-open");
        modernToggle.setAttribute("aria-expanded", "false");
        modernToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  let parallaxBg = document.querySelector("[data-parallax-bg]");
  if (!parallaxBg && document.body.classList.contains("wa-body")) {
    parallaxBg = document.createElement("div");
    parallaxBg.className = "wa-parallax-bg";
    parallaxBg.setAttribute("data-parallax-bg", "");
    parallaxBg.setAttribute("aria-hidden", "true");
    document.body.insertBefore(parallaxBg, document.body.firstChild);
  }

  if (document.body.classList.contains("wa-body")) {
    const homeBackgroundImage = "../assets/backgrounds/IMG_2427.jpeg";
    document.body.style.setProperty("--wa-bg-image", 'url("' + homeBackgroundImage + '")');
  }

  if (parallaxBg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY || window.pageYOffset;
      const y = (scrollY * 0.07).toFixed(2);
      parallaxBg.style.transform = "translate3d(0, " + y + "px, 0)";
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateParallax();
  }

  const header = document.querySelector(".app-bar");
  const toggle = document.querySelector(".app-bar__icon-btn");
  const nav = document.querySelector("#primary-nav");
  const scrim = document.querySelector(".app-bar__scrim");

  if (header && toggle && nav) {
    function setOpen(open) {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
      setOpen(!header.classList.contains("is-open"));
    });

    if (scrim) {
      scrim.addEventListener("click", function () {
        setOpen(false);
      });
    }

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 899px)").matches) {
          setOpen(false);
        }
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 900px)").matches) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const slides = root.querySelectorAll(".screen-hero__slide");
  const dots = root.querySelectorAll("[data-carousel-dot]");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let index = 0;
  let timerId = null;

  function goTo(next) {
    if (!slides.length) return;
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });
    dots.forEach(function (dot, i) {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function schedule() {
    if (reduceMotion || slides.length < 2) return;
    clearInterval(timerId);
    timerId = window.setInterval(function () {
      goTo(index + 1);
    }, 6500);
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      const i = parseInt(dot.getAttribute("data-carousel-dot"), 10);
      if (!Number.isNaN(i)) {
        goTo(i);
        schedule();
      }
    });
  });

  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
      schedule();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
      schedule();
    }
  });

  if (!root.hasAttribute("tabindex")) {
    root.setAttribute("tabindex", "0");
  }

  schedule();
})();
