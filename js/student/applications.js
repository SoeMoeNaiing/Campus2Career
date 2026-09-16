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


            ${renderInterviewSection(application)}

        </article>
    `;

}
/* =========================================================
   INTERVIEW SECTION
   ========================================================= */

function renderInterviewSection(application) {

    const interview =
        getInterviewByApplicationId(
            application.id
        );


    // No interview invitation yet.
    if (!interview) {
        return "";
    }


    if (interview.status === "pending") {

        return renderInterviewInvitation(
            interview
        );

    }


    if (interview.status === "accepted") {

        return renderInterviewAccepted(
            interview
        );

    }


    if (interview.status === "declined") {

        return renderInterviewDeclined(
            interview
        );

    }


    return "";
}


/* =========================================================
   PENDING INVITATION
   ========================================================= */

function renderInterviewInvitation(interview) {

    const typeLabel =
        interview.type === "online"
            ? "Online"
            : "In Person";


    const contactLine =
        interview.type === "online"
            ? `
                <p class="interview-detail">
                    <strong>Meeting Link:</strong>
                    <a
                        href="${interview.meetingLink}"
                        target="_blank"
                        rel="noopener"
                    >
                        ${interview.meetingLink}
                    </a>
                </p>
            `
            : `
                <p class="interview-detail">
                    <strong>Location:</strong>
                    ${interview.location || "N/A"}
                </p>
            `;


    return `
        <div class="interview-section">

            <h4 class="interview-section-title">
                Interview Invitation
            </h4>


            <p class="interview-detail">
                📅 ${formatApplicationDate(interview.date)}
            </p>

            <p class="interview-detail">
                🕐 ${interview.time}
            </p>

            <p class="interview-detail">
                💻 ${typeLabel}
            </p>

            ${contactLine}


            ${
                interview.message
                    ? `
                        <p class="interview-message">
                            "${interview.message}"
                        </p>
                    `
                    : ""
            }


            <div class="interview-actions">

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="handleAcceptInterview('${interview.id}')"
                >
                    Accept Interview
                </button>


                <button
                    type="button"
                    class="btn btn-outline"
                    onclick="handleDeclineInterview('${interview.id}')"
                >
                    Decline Interview
                </button>

            </div>

        </div>
    `;
}


/* =========================================================
   ACCEPTED INTERVIEW
   ========================================================= */

function renderInterviewAccepted(interview) {

    const typeLabel =
        interview.type === "online"
            ? "Online"
            : "In Person";


    const contactLine =
        interview.type === "online"
            ? `
                <p class="interview-detail">
                    <strong>Meeting Link:</strong>
                    <a
                        href="${interview.meetingLink}"
                        target="_blank"
                        rel="noopener"
                    >
                        ${interview.meetingLink}
                    </a>
                </p>
            `
            : `
                <p class="interview-detail">
                    <strong>Location:</strong>
                    ${interview.location || "N/A"}
                </p>
            `;


    const joinButton =
        interview.type === "online"
            ? `
                <a
                    href="${interview.meetingLink}"
                    target="_blank"
                    rel="noopener"
                    class="btn btn-primary"
                >
                    Join Interview
                </a>
            `
            : "";


    return `
        <div class="interview-section">

            <h4 class="interview-section-title">
                ✓ Interview Accepted
            </h4>


            <p class="interview-detail">
                📅 ${formatApplicationDate(interview.date)}
            </p>

            <p class="interview-detail">
                🕐 ${interview.time}
            </p>

            <p class="interview-detail">
                💻 ${typeLabel}
            </p>

            ${contactLine}


            ${
                interview.message
                    ? `
                        <p class="interview-message">
                            "${interview.message}"
                        </p>
                    `
                    : ""
            }


            ${
                joinButton
                    ? `<div class="interview-actions">${joinButton}</div>`
                    : ""
            }

        </div>
    `;
}


/* =========================================================
   DECLINED INTERVIEW
   ========================================================= */

function renderInterviewDeclined(interview) {

    return `
        <div class="interview-section">

            <h4 class="interview-section-title">
                ✕ Interview Declined
            </h4>


            <p class="interview-detail">
                You declined this interview invitation.
            </p>

        </div>
    `;
}


/* =========================================================
   STUDENT RESPONSE HANDLERS
   ========================================================= */

function handleAcceptInterview(interviewId) {

    const confirmed =
        confirm(
            "Accept this interview invitation?"
        );

    if (!confirmed) {
        return;
    }


    updateInterviewStatus(
        interviewId,
        "accepted"
    );


    loadStudentApplications();
}


function handleDeclineInterview(interviewId) {

    const confirmed =
        confirm(
            "Are you sure you want to decline this interview invitation?"
        );

    if (!confirmed) {
        return;
    }


    updateInterviewStatus(
        interviewId,
        "declined"
    );


    loadStudentApplications();
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