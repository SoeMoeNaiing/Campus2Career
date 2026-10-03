/* =========================================================
   SITE QUICK FOOTER
   Injects a role-aware dark footer at the bottom of every page.
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

    const config = buildFooterConfig();


    const columnsHTML =
        config.columns
            .map(function (col) {

                const linksHTML =
                    col.items
                        .map(function (item) {

                            return `
                                <li>
                                    <a href="${item.href}">
                                        ${item.label}
                                    </a>
                                </li>
                            `;

                        })
                        .join("");


                return `
                    <div class="site-footer-col">

                        <h4>${col.heading}</h4>

                        <ul>
                            ${linksHTML}
                        </ul>

                    </div>
                `;

            })
            .join("");


    const footer = document.createElement("footer");

    footer.className = "site-quick-footer";

    footer.innerHTML = `
        <div class="site-quick-footer-inner">

            <div class="site-footer-brand-col">

                <a href="${config.homeHref}" class="footer-logo">
                    Campus<span>2</span>Career
                </a>

                <p class="site-footer-tagline">
                    ${config.tagline}
                </p>

            </div>


            <div class="site-footer-cols">
                ${columnsHTML}
            </div>

        </div>


        <div class="site-quick-footer-bottom">

            <div class="site-quick-footer-bottom-inner">

                <span>
                    © ${new Date().getFullYear()}
                    Campus2Career. All rights reserved.
                </span>

                <span class="site-footer-tag">
                    Built for students · recruiters · admins
                </span>

            </div>

        </div>
    `;

    return footer;

}


/* =========================================================
   CONFIG — role-aware
   ========================================================= */

function buildFooterConfig() {

    const user = getFooterUser();
    const role = user ? user.role : null;


    /* ---------- Logged out ---------- */

    if (!role) {

        return {

            homeHref: "../../index.html",

            tagline:
                "Internship opportunities for students " +
                "and recruiters, all in one place.",

            columns: [

                {

                    heading: "Platform",

                    items: [

                        { label: "Home", href: "../../index.html" },
                        { label: "Browse Internships", href: "../auth/login.html" },

                    ]

                },

                {

                    heading: "Get Started",

                    items: [

                        { label: "Login", href: "../auth/login.html" },
                        { label: "Register", href: "../auth/register.html" },

                    ]

                },

                {

                    heading: "About",

                    items: [

                        { label: "For Students", href: "../../index.html#students" },
                        { label: "For Recruiters", href: "../../index.html#recruiters" },

                    ]

                }

            ]

        };

    }


    /* ---------- Student ---------- */

    if (role === "student") {

        return {

            homeHref: "dashboard.html",

            tagline:
                "Find internships, apply with confidence, " +
                "and track your progress.",

            columns: [

                {

                    heading: "Navigation",

                    items: [

                        { label: "Dashboard", href: "dashboard.html" },
                        { label: "Internships", href: "internships.html" },
                        { label: "Applications", href: "applications.html" },

                    ]

                },

                {

                    heading: "Account",

                    items: [

                        { label: "Saved Internships", href: "saved.html" },
                        { label: "Profile", href: "profile.html" },

                    ]

                },

                {

                    heading: "Support",

                    items: [

                        { label: "Help", href: "#" },
                        { label: "Contact", href: "#" },

                    ]

                }

            ]

        };

    }


    /* ---------- Recruiter ---------- */

    if (role === "recruiter") {

        return {

            homeHref: "dashboard.html",

            tagline:
                "Post internships, manage applications, " +
                "and hire the next generation of talent.",

            columns: [

                {

                    heading: "Navigation",

                    items: [

                        { label: "Dashboard", href: "dashboard.html" },
                        { label: "My Internships", href: "internships.html" },
                        { label: "Applications", href: "applications.html" },

                    ]

                },

                {

                    heading: "Account",

                    items: [

                        { label: "Profile", href: "profile.html" },
                        { label: "Post Internship", href: "create-internship.html" },

                    ]

                },

                {

                    heading: "Support",

                    items: [

                        { label: "Help", href: "#" },
                        { label: "Contact", href: "#" },

                    ]

                }

            ]

        };

    }


    /* ---------- Fallback ---------- */

    return {

        homeHref: "#",
        tagline: "",
        columns: []

    };

}


/* =========================================================
   USER (works even if auth.js isn't loaded)
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