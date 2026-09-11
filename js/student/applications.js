/* =========================================================
   STUDENT APPLICATIONS
   ========================================================= */

requireRole("student");

initializeInternships();


const applicationsList =
    document.getElementById("applicationsList");

const applicationsCount =
    document.getElementById("applicationsCount");

const noApplications =
    document.getElementById("noApplications");


if (applicationsList) {

    loadStudentApplications();

}


/* =========================================================
   LOAD APPLICATIONS
   ========================================================= */

function loadStudentApplications() {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    const applications =
        getStudentApplications(
            currentUser.id
        );


    const internships =
        getInternships();


    const studentApplications =
        applications
            .map(application => {

                const internship =
                    internships.find(
                        internship =>
                            internship.id ===
                            application.internshipId
                    );


                return {
                    ...application,
                    internship
                };

            })
            .filter(
                application =>
                    application.internship
            );


    renderApplications(
        studentApplications
    );

}


/* =========================================================
   RENDER APPLICATIONS
   ========================================================= */

function renderApplications(applications) {

    applicationsCount.textContent =
        `${applications.length} ${
            applications.length === 1
                ? "application"
                : "applications"
        }`;


    if (applications.length === 0) {

        applicationsList.innerHTML = "";

        noApplications.hidden = false;

        return;
    }


    noApplications.hidden = true;


    applicationsList.innerHTML =
        applications
            .map(createApplicationCard)
            .join("");

}


/* =========================================================
   APPLICATION CARD
   ========================================================= */

function createApplicationCard(application) {

    const internship =
        application.internship;


    return `
        <article class="application-card">

            <div class="application-main">

                <div class="company-placeholder">
                    ${internship.company.charAt(0)}
                </div>


                <div class="application-info">

                    <span class="internship-type">
                        ${internship.type}
                    </span>

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
                            📅 Applied
                            ${formatApplicationDate(
                                application.appliedDate
                            )}
                        </span>

                    </div>

                </div>

            </div>


            <div class="application-actions">

                <span
                    class="application-status status-${application.status}"
                >
                    ${formatApplicationStatus(
                        application.status
                    )}
                </span>


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


/* =========================================================
   STATUS
   ========================================================= */

function formatApplicationStatus(status) {

    const statusNames = {

        pending: "Pending",

        accepted: "Accepted",

        rejected: "Rejected"

    };


    return statusNames[status] || status;

}


/* =========================================================
   DATE
   ========================================================= */

function formatApplicationDate(date) {

    return new Date(date).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}