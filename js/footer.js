/* =========================================================
   SITE QUICK FOOTER
   Injects a role-aware footer at the bottom of every page.
   Skips admin pages and any page that already has a footer.
   ========================================================= */

(function injectFooter() {

    /* Skip admin console — it has its own chrome */
    if (window.location.pathname.includes("/pages/admin/")) {
        return;
    }


    document.addEventListener("DOMContentLoaded", function () {

        /* Skip pages that already have a footer (e.g. landing page) */
        if (document.querySelector(".site-footer, .site-quick-footer")) {
            return;
        }

        document.body.appendChild(buildFooter());

    });

})();


/* =========================================================
   BUILD
   ========================================================= */

function buildFooter() {

    const links = buildFooterLinks();


    const footer = document.createElement("footer");
    footer.className = "site-quick-footer";

    footer.innerHTML = `
        <div class="site-quick-footer-inner">

            <div class="site-quick-footer-brand">

                <a href="${links.homeHref}" class="footer-logo">
                    Campus<span>2</span>Career
                </a>

                <p>
                    Internship opportunities for students
                    and recruiters.
                </p>

            </div>


            <nav class="site-quick-footer-nav">
                ${
                    links.items
                        .map(item =>
                            `<a href="${item.href}">${item.label}</a>`
                        )
                        .join("")
                }
            </nav>


            <p class="site-quick-footer-copy">
                © ${new Date().getFullYear()} Campus2Career
            </p>

        </div>
    `;

    return footer;

}


/* =========================================================
   LINKS
   ========================================================= */

function buildFooterLinks() {

    const path = window.location.pathname;

    const inAuth = path.includes("/pages/auth/");
    const inPages = path.includes("/pages/");

    const user = getFooterUser();
    const role = user ? user.role : null;


    /* ---------- Logged out ---------- */

    if (!role) {

        return {

            homeHref:
                inPages
                    ? "../../index.html"
                    : "index.html",

            items: [

                {
                    label: "Home",
                    href: inPages
                        ? "../../index.html"
                        : "index.html"
                },

                {
                    label: "Login",
                    href: inAuth
                        ? "login.html"
                        : (inPages
                            ? "../auth/login.html"
                            : "pages/auth/login.html")
                },

                {
                    label: "Register",
                    href: inAuth
                        ? "register.html"
                        : (inPages
                            ? "../auth/register.html"
                            : "pages/auth/register.html")
                }

            ]

        };

    }


    /* ---------- Student ---------- */

    if (role === "student") {

        return {

            homeHref: "dashboard.html",

            items: [

                { label: "Dashboard", href: "dashboard.html" },
                { label: "Internships", href: "internships.html" },
                { label: "Applications", href: "applications.html" },
                { label: "Saved", href: "saved.html" },
                { label: "Profile", href: "profile.html" }

            ]

        };

    }


    /* ---------- Recruiter ---------- */

    if (role === "recruiter") {

        return {

            homeHref: "dashboard.html",

            items: [

                { label: "Dashboard", href: "dashboard.html" },
                { label: "My Internships", href: "internships.html" },
                { label: "Applications", href: "applications.html" },
                { label: "Profile", href: "profile.html" }

            ]

        };

    }


    /* ---------- Fallback ---------- */

    return {

        homeHref: "#",
        items: []

    };

}


/* =========================================================
   USER (works on any page, even if auth.js isn't loaded)
   ========================================================= */

function getFooterUser() {

    if (typeof getCurrentUser === "function") {
        return getCurrentUser();
    }


    try {

        const raw = sessionStorage.getItem(
            "campus2career_current_user"
        );

        return raw ? JSON.parse(raw) : null;

    } catch (e) {

        return null;

    }

}