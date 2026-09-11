/* =========================================================
   CAMPUS2CAREER
   Student Dashboard
   ========================================================= */


/* ================= PAGE PROTECTION ================= */

/* ================= PAGE PROTECTION ================= */

if (!requireRole("student")) {
    throw new Error("Unauthorized access.");
}


/* ================= INITIALIZE DATA ================= */

initializeInternships();


/* ================= CURRENT USER ================= */

const currentUser = getCurrentUser();

/* ================= WELCOME ================= */

const studentName =
    document.getElementById("studentName");


if (studentName && currentUser) {

    studentName.textContent =
        currentUser.name;

}


/* ================= DASHBOARD DATA ================= */

/*
    Applications and saved internships will be connected
    to their real storage structures in later iterations.

    For now, the dashboard starts with zero values.
*/

const applications =
    getStudentApplications(currentUser.id);

const applicationCount =
    applications.length;

const pendingCount =
    applications.filter(
        application =>
            application.status === "pending"
    ).length;

const acceptedCount =
    applications.filter(
        application =>
            application.status === "accepted"
    ).length;

const savedCount =
    getSavedInternships().length;


/* ================= DISPLAY STATS ================= */

document.getElementById("applicationCount").textContent =
    applicationCount;

document.getElementById("pendingCount").textContent =
    pendingCount;

document.getElementById("acceptedCount").textContent =
    acceptedCount;

document.getElementById("savedCount").textContent =
    savedCount;


    



    /* =========================================================
   RECOMMENDED INTERNSHIPS
   ========================================================= */


function renderRecommendedInternships() {

    const container =
        document.getElementById(
            "recommendedInternships"
        );


    if (!container) {
        return;
    }


    const internships =
        getInternships();


    const activeInternships =
        internships.filter(
            internship =>
                internship.status === "active"
        );


    const recommended =
        activeInternships.slice(0, 3);


    if (recommended.length === 0) {

        container.innerHTML = `
            <p class="empty-state">
                No internships available right now.
            </p>
        `;

        return;
    }


    container.innerHTML =
        recommended
            .map(createInternshipCard)
            .join("");
}


/**
 * Create an internship card.
 */
function createInternshipCard(internship) {

    return `
        <article class="internship-card">

            <div class="internship-card-header">

                <div class="company-placeholder">
                    ${internship.company.charAt(0)}
                </div>

                <span class="internship-type">
                    ${internship.type}
                </span>

            </div>


            <div class="internship-card-body">

                <h3>
                    ${internship.title}
                </h3>

                <p class="company-name">
                    ${internship.company}
                </p>


                <div class="internship-meta">

                    <span>
                        📍 ${internship.location}
                    </span>

                    <span>
                        ⏱ ${internship.duration}
                    </span>

                </div>


                <div class="internship-skills">

                    ${internship.skills
                        .slice(0, 3)
                        .map(
                            skill =>
                                `<span>${skill}</span>`
                        )
                        .join("")}

                </div>

            </div>


            <div class="internship-card-footer">

                <a
                    href="internship-details.html?id=${internship.id}"
                    class="btn btn-outline"
                >
                    View Details
                </a>

            </div>

        </article>
    `;
}


renderRecommendedInternships();