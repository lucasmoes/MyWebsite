(function () {
    "use strict";

    const scene = document.querySelector(".ambient-scene");
    if (!scene || !window.matchMedia) return;

    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const glassSelector = ".glass[data-glass]";
    let width = Math.max(1, window.innerWidth);
    let height = Math.max(1, window.innerHeight);
    const current = { x: width / 2, y: height / 2, opacity: 0, glassX: 50, glassY: 50 };
    const target = { ...current };
    let pointerX = current.x;
    let pointerY = current.y;
    let pointerInside = false;
    let pageActive = true;
    let frame = 0;
    let lastTime = 0;
    let activeGlass = null;
    let nextGlass = null;
    let glassBounds = null;
    let geometryDirty = false;
    let hitTestDirty = false;

    const resizeObserver = window.ResizeObserver ? new ResizeObserver(function () {
        geometryDirty = true;
        requestFrame();
    }) : null;

    function enabled() {
        return pageActive && !document.hidden && !reducedMotion.matches && finePointer.matches;
    }

    function requestFrame() {
        if (!frame && enabled()) frame = requestAnimationFrame(render);
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function writeScene() {
        const x = clamp((current.x / width - 0.5) * 2, -1, 1);
        const y = clamp((current.y / height - 0.5) * 2, -1, 1);
        scene.style.setProperty("--scene-x", (x * 35).toFixed(2) + "px");
        scene.style.setProperty("--scene-y", (y * 35).toFixed(2) + "px");
        scene.style.setProperty("--pointer-x", current.x.toFixed(2) + "px");
        scene.style.setProperty("--pointer-y", current.y.toFixed(2) + "px");
        scene.style.setProperty("--pointer-opacity", current.opacity.toFixed(3));
    }

    function render(time) {
        frame = 0;
        if (!enabled()) return;

        // Read geometry before any style writes; scrolling may change the hovered card.
        if (hitTestDirty && pointerInside) {
            const element = document.elementFromPoint(pointerX, pointerY);
            nextGlass = element ? element.closest(glassSelector) : null;
            hitTestDirty = false;
        }
        const changedGlass = nextGlass !== activeGlass;
        if (changedGlass || geometryDirty) {
            glassBounds = nextGlass ? nextGlass.getBoundingClientRect() : null;
            geometryDirty = false;
        }
        if (glassBounds && glassBounds.width && glassBounds.height) {
            target.glassX = clamp((pointerX - glassBounds.left) / glassBounds.width * 100, 0, 100);
            target.glassY = clamp((pointerY - glassBounds.top) / glassBounds.height * 100, 0, 100);
        }

        if (changedGlass) {
            if (activeGlass) activeGlass.style.setProperty("--glass-active", "0");
            if (resizeObserver) resizeObserver.disconnect();
            activeGlass = nextGlass;
            current.glassX = target.glassX;
            current.glassY = target.glassY;
            if (activeGlass) {
                activeGlass.style.setProperty("--glass-active", "1");
                if (resizeObserver) resizeObserver.observe(activeGlass);
            }
        }

        // A time-based response feels the same on 60 Hz and high-refresh displays.
        const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16;
        const ease = 1 - Math.exp(-elapsed / 90);
        lastTime = time;
        let unsettled = false;
        Object.keys(current).forEach(function (key) {
            const difference = target[key] - current[key];
            const threshold = key === "opacity" ? 0.002 : 0.025;
            if (Math.abs(difference) <= threshold) {
                current[key] = target[key];
            } else {
                current[key] += difference * ease;
                unsettled = true;
            }
        });

        writeScene();
        if (activeGlass) {
            activeGlass.style.setProperty("--glass-x", current.glassX.toFixed(2) + "%");
            activeGlass.style.setProperty("--glass-y", current.glassY.toFixed(2) + "%");
        }
        if (unsettled) requestFrame();
        else lastTime = 0;
    }

    function onPointerMove(event) {
        if (!enabled() || event.pointerType === "touch") return;
        pointerInside = true;
        pointerX = clamp(event.clientX, 0, width);
        pointerY = clamp(event.clientY, 0, height);
        target.x = pointerX;
        target.y = pointerY;
        target.opacity = 1;
        nextGlass = event.target instanceof Element ? event.target.closest(glassSelector) : null;
        requestFrame();
    }

    function resetPointer(immediate) {
        pointerInside = false;
        nextGlass = null;
        target.x = width / 2;
        target.y = height / 2;
        target.opacity = 0;
        target.glassX = current.glassX;
        target.glassY = current.glassY;
        if (immediate) {
            cancelAnimationFrame(frame);
            frame = 0;
            lastTime = 0;
            if (activeGlass) activeGlass.style.setProperty("--glass-active", "0");
            activeGlass = null;
            glassBounds = null;
            if (resizeObserver) resizeObserver.disconnect();
            Object.assign(current, target);
            writeScene();
        } else {
            requestFrame();
        }
    }

    function updateEnvironment() {
        root.toggleAttribute("data-motion-paused", !pageActive || document.hidden || reducedMotion.matches);
        if (!enabled()) resetPointer(true);
    }

    function updateGeometry() {
        const resized = width !== window.innerWidth || height !== window.innerHeight;
        width = Math.max(1, window.innerWidth);
        height = Math.max(1, window.innerHeight);
        if (!pointerInside) {
            if (resized) resetPointer(true);
            return;
        }
        pointerX = clamp(pointerX, 0, width);
        pointerY = clamp(pointerY, 0, height);
        target.x = pointerX;
        target.y = pointerY;
        geometryDirty = true;
        hitTestDirty = true;
        requestFrame();
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", function () { resetPointer(false); });
    window.addEventListener("blur", function () { resetPointer(true); });
    window.addEventListener("scroll", updateGeometry, { passive: true });
    window.addEventListener("resize", updateGeometry, { passive: true });
    document.addEventListener("visibilitychange", updateEnvironment);
    reducedMotion.addEventListener("change", updateEnvironment);
    finePointer.addEventListener("change", updateEnvironment);
    window.addEventListener("pagehide", function () {
        pageActive = false;
        updateEnvironment();
    });
    window.addEventListener("pageshow", function () {
        pageActive = true;
        updateEnvironment();
    });
    updateEnvironment();
})();
