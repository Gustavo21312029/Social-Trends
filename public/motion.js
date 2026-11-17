/* Progressive enhancement: the application works without animation APIs. */
const motion = (() => {
  const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;
  const watched = new Set();
  let transition = null;
  let pendingUpdate = null;
  let revision = 0;
  const reduced = () => Boolean(preference?.matches);
  const observer =
    typeof IntersectionObserver === "function"
      ? new IntersectionObserver(
          (entries) => {
            let order = 0;
            for (const entry of entries) {
              if (!entry.target.isConnected || entry.isIntersecting) {
                observer.unobserve(entry.target);
                watched.delete(entry.target);
                if (
                  entry.isIntersecting &&
                  entry.target.isConnected &&
                  !transition
                ) {
                  appear(entry.target, { delay: Math.min(order++, 4) * 45 });
                }
              }
            }
          },
          { threshold: 0.08, rootMargin: "0px 0px 35px 0px" },
        )
      : null;

  function appear(
    element,
    { delay = 0, duration = 380, distance = 12, scale = 1 } = {},
  ) {
    if (!element?.animate || reduced()) return;
    element.animate(
      [
        { opacity: 0, transform: `translateY(${distance}px) scale(${scale})` },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      {
        duration,
        delay,
        easing: "cubic-bezier(.2,.7,.2,1)",
        fill: "backwards",
      },
    );
  }

  function cards(container, previousIds = new Set()) {
    // Rerenders replace nodes; release removed nodes before observing the new set.
    for (const element of watched) {
      if (!element.isConnected) {
        observer?.unobserve(element);
        watched.delete(element);
      }
    }
    if (reduced()) return;
    [...container.querySelectorAll(".content-card")].forEach(
      (element, index) => {
        if (previousIds.has(element.dataset.id)) return;
        if (observer) {
          watched.add(element);
          observer.observe(element);
        } else if (!transition) {
          appear(element, { delay: Math.min(index, 4) * 45 });
        }
      },
    );
  }

  function themeFallback() {
    if (reduced()) return;
    appear(document.querySelector(".page-heading"), {
      duration: 280,
      distance: 6,
    });
    appear(document.querySelector(".hero-banner"), {
      duration: 420,
      distance: 14,
    });
  }

  function themeChange(update) {
    const ticket = ++revision;
    pendingUpdate = update;
    transition?.skipTransition();
    const apply = () => {
      if (ticket !== revision || !pendingUpdate) return;
      const work = pendingUpdate;
      pendingUpdate = null;
      work();
    };
    if (reduced() || typeof document.startViewTransition !== "function") {
      transition = null;
      root.classList.remove("theme-snapshot");
      apply();
      themeFallback();
      return;
    }
    root.classList.add("theme-snapshot");
    try {
      const current = document.startViewTransition(apply);
      transition = current;
      // Superseded transitions can reject ready; they must never break navigation.
      current.ready.catch(() => {});
      current.updateCallbackDone.catch(() => {});
      current.finished
        .catch(() => {})
        .then(() => {
          if (transition === current) {
            transition = null;
            root.classList.remove("theme-snapshot");
          }
        });
    } catch {
      transition = null;
      root.classList.remove("theme-snapshot");
      apply();
      themeFallback();
    }
  }

  function settleTheme() {
    ++revision;
    transition?.skipTransition();
    transition = null;
    root.classList.remove("theme-snapshot");
    const work = pendingUpdate;
    pendingUpdate = null;
    work?.();
  }

  function section(container) {
    if (reduced()) return;
    appear(document.querySelector(".page-heading"), {
      duration: 260,
      distance: 6,
    });
    appear(container, { duration: 350, distance: 10 });
  }

  function feedback(element) {
    if (!element?.animate || reduced()) return;
    element.animate(
      [
        { transform: "scale(.88)" },
        { transform: "scale(1.08)", offset: 0.65 },
        { transform: "scale(1)" },
      ],
      { duration: 250, easing: "ease-out" },
    );
  }

  preference?.addEventListener("change", () => {
    if (!reduced()) return;
    settleTheme();
    document.getAnimations?.().forEach((animation) => animation.cancel());
    observer?.disconnect();
    watched.clear();
  });

  function start() {
    requestAnimationFrame(() => {
      document.body.classList.add("motion-ready");
      if (reduced()) return;
      document
        .querySelectorAll(".page-heading, .platform-section, .hero-banner")
        .forEach((element, index) => appear(element, { delay: index * 55 }));
    });
  }

  return {
    appear,
    cards,
    themeChange,
    settleTheme,
    section,
    feedback,
    start,
    scrollBehavior: () => (reduced() ? "auto" : "smooth"),
  };
})();
