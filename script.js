(function () {
    var root = document.documentElement;
    var toggle = document.getElementById("themeToggle");
    var STORAGE_KEY = "theme-mode";
    var topbar = document.querySelector(".topbar");

    function setTheme(theme) {
        root.dataset.theme = theme;
        localStorage.setItem(STORAGE_KEY, theme);
    }

    var savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
        root.dataset.theme = savedTheme;
    } else if (globalThis.matchMedia && globalThis.matchMedia("(prefers-color-scheme: light)").matches) {
        root.dataset.theme = "light";
    } else {
        root.dataset.theme = "dark";
    }

    toggle.addEventListener("click", function () {
        var current = root.dataset.theme || "dark";
        setTheme(current === "dark" ? "light" : "dark");
    });

    // Scroll-based topbar visibility
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            topbar.classList.add("scrolled");
        } else {
            topbar.classList.remove("scrolled");
        }
    });

    // Burger menu – click/touch toggle (for mobile where hover isn't available)
    var burger = document.getElementById("navBurger");
    var burgerBtn = document.getElementById("burgerBtn");
    burgerBtn.addEventListener("click", function (e) {
        burger.classList.toggle("open");
        e.stopPropagation();
    });
    document.addEventListener("click", function (e) {
        if (!burger.contains(e.target)) {
            burger.classList.remove("open");
        }
    });
    // Close menu when a nav link is clicked
    var burgerLinks = burger.querySelectorAll("a");
    burgerLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            burger.classList.remove("open");
        });
    });

    // ── Blob random smooth movement ──
    var blob = document.querySelector(".blob");
    var positions = [
        { top: 40, left: 60 },
        { top: 55, left: 70 },
        { top: 50, left: 50 },
        { top: 45, left: 75 },
        { top: 60, left: 55 },
        { top: 35, left: 65 }
    ];
    var currentPosIndex = 0;

    function moveBlob() {
        currentPosIndex = (currentPosIndex + 1) % positions.length;
        var nextPos = positions[currentPosIndex];
        blob.style.animation = "none";
        setTimeout(function () {
            blob.style.transition = "all 15s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            blob.style.top = nextPos.top + "%";
            blob.style.left = nextPos.left + "%";
        }, 50);
    }

    setInterval(moveBlob, 16000);

    // ── Grid pulsation on interaction ──
    var gridPulseTimeout;
    var body = document.body;

    function pulseGrid() {
        body.style.setProperty("--grid-opacity", "0.6");
        clearTimeout(gridPulseTimeout);
        gridPulseTimeout = setTimeout(function () {
            body.style.transition = "all 600ms ease";
            body.style.setProperty("--grid-opacity", "0.3");
        }, 100);
    }

    document.addEventListener("mousemove", function () {
        pulseGrid();
    });

    document.addEventListener("click", function () {
        body.style.transition = "all 100ms ease";
        body.style.setProperty("--grid-opacity", "0.8");
        pulseGrid();
    });
})();
