(function () {
    "use strict";

    const root = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");
    const themePreference = window.matchMedia("(prefers-color-scheme: light)");
    const storageKey = "theme-mode";
    let selectedTheme = null;

    // A blocked storage API must not prevent the navigation from starting.
    try {
        const storedTheme = localStorage.getItem(storageKey);
        if (storedTheme === "light" || storedTheme === "dark") {
            selectedTheme = storedTheme;
        }
    } catch (_) {
        // The selected theme still works for this visit in private contexts.
    }

    function applyTheme(theme) {
        root.dataset.theme = theme;
        if (!themeToggle) return;

        const nextMode = theme === "dark" ? "Light mode" : "Dark mode";
        themeToggle.setAttribute("aria-label", "Switch to " + nextMode.toLowerCase());
        themeToggle.title = "Switch to " + nextMode.toLowerCase();
        const label = themeToggle.querySelector(".theme-label");
        if (label) label.textContent = nextMode;
    }

    applyTheme(selectedTheme || (themePreference.matches ? "light" : "dark"));

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            selectedTheme = root.dataset.theme === "dark" ? "light" : "dark";
            applyTheme(selectedTheme);
            try {
                localStorage.setItem(storageKey, selectedTheme);
            } catch (_) {
                // Saving is optional; applying the theme is not.
            }
        });
    }

    themePreference.addEventListener("change", function (event) {
        if (!selectedTheme) applyTheme(event.matches ? "light" : "dark");
    });

    const navigation = document.getElementById("navBurger");
    const trigger = document.getElementById("burgerBtn");
    const menu = document.getElementById("mainMenu");
    if (!navigation || !trigger || !menu) return;

    const hoverNavigation = window.matchMedia("(min-width: 721px) and (hover: hover) and (pointer: fine)");
    const links = Array.from(menu.querySelectorAll('a[href^="#"]'));
    let menuOpen = false;
    let openedByHover = false;

    function setMenuOpen(open, fromHover = false) {
        // Never leave keyboard focus inside a menu that is about to become inert.
        if (!open && menu.contains(document.activeElement)) {
            trigger.focus({ preventScroll: true });
        }
        menuOpen = open;
        openedByHover = open && fromHover;
        menu.inert = !open;
        navigation.classList.toggle("open", open);
        trigger.setAttribute("aria-expanded", String(open));
        trigger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    trigger.addEventListener("click", function () {
        // Hover happens before a pointer click; the first click pins that preview open.
        setMenuOpen(!menuOpen || openedByHover);
    });

    trigger.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        setMenuOpen(true);
        const link = event.key === "ArrowDown" ? links[0] : links[links.length - 1];
        // Wait for the opening frame: visibility is still hidden when the transition starts.
        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
                if (link && menuOpen && document.activeElement === trigger) {
                    link.focus({ preventScroll: true });
                }
            });
        });
    });

    navigation.addEventListener("pointerenter", function (event) {
        if (!menuOpen && hoverNavigation.matches && event.pointerType !== "touch") {
            setMenuOpen(true, true);
        }
    });

    navigation.addEventListener("pointerleave", function () {
        if (openedByHover && hoverNavigation.matches && !navigation.contains(document.activeElement)) {
            setMenuOpen(false);
        }
    });

    navigation.addEventListener("focusout", function (event) {
        if (!navigation.contains(event.relatedTarget)) setMenuOpen(false);
    });

    document.addEventListener("pointerdown", function (event) {
        if (!navigation.contains(event.target)) setMenuOpen(false);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape" || !menuOpen) return;
        event.preventDefault();
        setMenuOpen(false);
        trigger.focus({ preventScroll: true });
    });

    hoverNavigation.addEventListener("change", function () {
        setMenuOpen(false);
    });

    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const section = document.getElementById(link.hash.slice(1));
            if (section) {
                if (!section.hasAttribute("tabindex")) section.setAttribute("tabindex", "-1");
                section.focus({ preventScroll: true });
            }
            setMenuOpen(false);
            // Keep native anchor scrolling, URL history, and reduced-motion CSS.
        });
    });

    const destinations = links.map(function (link) {
        return { link: link, section: document.getElementById(link.hash.slice(1)) };
    }).filter(function (destination) {
        return destination.section;
    });
    // A restored scroll position or deep link can start beyond the static Home marker.
    links.forEach(function (link) { link.removeAttribute("aria-current"); });
    let activeLink = null;
    let scrollFramePending = false;

    function updateActiveLink() {
        scrollFramePending = false;
        if (!destinations.length) return;

        const readingLine = Math.min(window.innerHeight * 0.28, 180);
        let current = destinations[0];
        destinations.forEach(function (destination) {
            if (destination.section.getBoundingClientRect().top <= readingLine) current = destination;
        });
        // Short final sections can never reach the reading line before the page ends.
        if (window.scrollY + window.innerHeight >= root.scrollHeight - 2) {
            current = destinations[destinations.length - 1];
        }
        if (current.link === activeLink) return;
        if (activeLink) activeLink.removeAttribute("aria-current");
        activeLink = current.link;
        activeLink.setAttribute("aria-current", "location");
    }

    function requestActiveLinkUpdate() {
        if (scrollFramePending) return;
        scrollFramePending = true;
        window.requestAnimationFrame(updateActiveLink);
    }

    window.addEventListener("scroll", requestActiveLinkUpdate, { passive: true });
    window.addEventListener("resize", requestActiveLinkUpdate, { passive: true });
    window.addEventListener("hashchange", requestActiveLinkUpdate);
    window.addEventListener("load", requestActiveLinkUpdate);

    setMenuOpen(false);
    updateActiveLink();
    // Without this class the links remain visible, so navigation also works without JS.
    navigation.classList.add("nav-ready");
})();
