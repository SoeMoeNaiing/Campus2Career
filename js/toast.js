/* =========================================================
   CAMPUS2CAREER — TOAST NOTIFICATIONS
   Replaces alert() with non-blocking toasts.

   Usage:
     toast.success("Application submitted");
     toast.error("Please fill all fields");
     toast.info("Interview saved for later");
     toast.warn("Deadline is approaching");

   Optional second arg = duration in ms (default 3500).
   ========================================================= */

const toast = (function () {

    let container = null;


    /* ---------- Container ---------- */

    function ensureContainer() {

        if (container) {
            return container;
        }

        container = document.createElement("div");
        container.id = "c2c-toast-container";
        container.className = "toast-container";

        document.body.appendChild(container);

        return container;

    }


    /* ---------- Show ---------- */

    function show(type, message, duration) {

        ensureContainer();

        const el = document.createElement("div");
        el.className = `toast toast-${type}`;

        const iconName = {
            success: "check-circle",
            error: "x-circle",
            warn: "alert",
            info: "info"
        }[type] || "info";


        el.innerHTML = `
            <svg class="toast-icon" width="20" height="20" aria-hidden="true">
                <use href="#icon-${iconName}"></use>
            </svg>

            <span class="toast-message">${message}</span>

            <button
                type="button"
                class="toast-close"
                aria-label="Dismiss"
            >
                <svg width="14" height="14" aria-hidden="true">
                    <use href="#icon-x"></use>
                </svg>
            </button>
        `;


        /* Close button */

        el.querySelector(".toast-close")
            .addEventListener("click", function () {
                dismiss(el);
            });


        container.appendChild(el);


        /* Trigger entrance animation */

        requestAnimationFrame(function () {
            el.classList.add("toast-visible");
        });


        /* Auto-dismiss */

        const timeout = duration || 3500;

        setTimeout(function () {
            dismiss(el);
        }, timeout);

    }


    /* ---------- Dismiss ---------- */

    function dismiss(el) {

        if (!el || !el.parentNode) {
            return;
        }

        el.classList.add("toast-leaving");

        setTimeout(function () {

            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }

        }, 220);

    }


    /* ---------- Public API ---------- */

    return {

        success: (msg, ms) => show("success", msg, ms),
        error:   (msg, ms) => show("error", msg, ms),
        warn:    (msg, ms) => show("warn", msg, ms),
        info:    (msg, ms) => show("info", msg, ms),

        /** Generic — pass "success" | "error" | "warn" | "info" */
        show: show

    };

})();