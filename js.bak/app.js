/* =========================================================
   CAMPUS2CAREER
   Global Application JavaScript
   ========================================================= */


/* ================= MOBILE NAVIGATION ================= */

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mainNav =
    document.getElementById("mainNav");


if (mobileMenuButton && mainNav) {

    mobileMenuButton.addEventListener("click", () => {

        mainNav.classList.toggle("active");

    });


    mainNav.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("active");

        });

    });

}


/* ================= CURRENT YEAR ================= */

const currentYear =
    document.getElementById("currentYear");


if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* ================= INTERNSHIP SEARCH ================= */

const internshipSearch =
    document.getElementById("internshipSearch");

const searchMessage =
    document.getElementById("searchMessage");


if (internshipSearch) {

    internshipSearch.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const keyword =
                document
                    .getElementById("searchKeyword")
                    .value
                    .trim();

            const location =
                document
                    .getElementById("searchLocation")
                    .value
                    .trim();


            if (!keyword && !location) {

                searchMessage.textContent =
                    "Please enter a keyword or location.";

                return;

            }


            /*
             * Real internship search will be implemented
             * in the student/internships iteration.
             */

            const searchParts = [];

            if (keyword) {
                searchParts.push(`"${keyword}"`);
            }

            if (location) {
                searchParts.push(`in ${location}`);
            }


            searchMessage.textContent =
                `Searching for internships ${searchParts.join(" ")}...`;

        }
    );

}
/* ================= SCROLL REVEAL ================= */

const revealElements = document.querySelectorAll(
    ".feature-card, .step, .audience-card, .recruiter-content"
);

const revealObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.15
    }
);


revealElements.forEach((element) => {

    element.classList.add("reveal");

    revealObserver.observe(element);

});