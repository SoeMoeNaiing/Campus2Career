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

let applicationsPager = null;


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

    const noApplications =
        document.getElementById("noApplications");


    /* Init pager once */

    if (!applicationsPager) {

        applicationsPager = createPaginatedRenderer({
            containerId: "applicationsList",
            counterId: "applicationsCount",
            pagerId: "studentApplicationsPager",
            perPage: 6
        });

    }


    if (applications.length === 0) {

        applicationsPager.setItems([], createApplicationCard);

        if (noApplications) noApplications.hidden = false;

        return;

    }


    if (noApplications) noApplications.hidden = true;


    const sorted =
        sortByNewest(applications, "appliedDate");


    applicationsPager.setItems(sorted, createApplicationCard);

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
                            ${icon("location", 14)} ${internship.location}
                        </span>

                        <span>
                            ${icon("calendar", 14)} Applied
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


    /* ---------- Final result already set ---------- */

    if (
        interview.result === "selected" ||
        interview.result === "not_selected" ||
        interview.result === "no_show"
    ) {

        return renderInterviewResult(
            interview
        );

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
                ${icon("calendar", 14)} ${formatApplicationDate(interview.date)}
            </p>

            <p class="interview-detail">
                ${icon("clock", 14)} ${interview.time}
            </p>

            <p class="interview-detail">
                ${icon("monitor", 14)} ${typeLabel}
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
   JOIN BUTTON TIMING
   ========================================================= */

function canJoinInterview(interview) {

    if (interview.type !== "online") {
        return false;
    }


    if (!interview.date || !interview.time) {
        return false;
    }


    const startTime =
        new Date(
            `${interview.date}T${interview.time}`
        );


    if (isNaN(startTime.getTime())) {
        return false;
    }


    const now = new Date();


    const diffMinutes =
        (startTime.getTime() - now.getTime()) / 60000;


    // Show 5 minutes before start
    // Hide 2 hours after start
   return diffMinutes <= 5 && diffMinutes >= -30;
}


function getJoinButtonMessage(interview) {

    if (interview.type !== "online") {
        return "";
    }


    const startTime =
        new Date(
            `${interview.date}T${interview.time}`
        );


    const now = new Date();


    const diffMinutes =
        (startTime.getTime() - now.getTime()) / 60000;


    /* ---------- Too early ---------- */

    if (diffMinutes > 5) {

        return `
            <p class="interview-detail interview-hint">
                The Join Interview button will
                appear 5 minutes before the interview.
            </p>
        `;

    }


    /* ---------- Window has closed ---------- */

    if (diffMinutes < -30) {

        if (interview.attendedAt) {

            return `
                <p class="interview-detail interview-hint">
                    ${icon("check", 14)} You joined this interview at
                    ${new Date(interview.attendedAt).toLocaleTimeString()}.
                </p>
            `;

        }


        return `
            <p class="interview-detail interview-hint">
                ${icon("x", 14)} This interview time has passed
                and you did not join.
            </p>
        `;

    }


    return "";
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


    const canJoin =
        canJoinInterview(interview);


    let joinSection = "";


    if (canJoin) {

        const attendedNote =
            interview.attendedAt
                ? `
                    <p class="interview-detail interview-hint">
                        ${icon("check", 14)} You joined at
                        ${new Date(interview.attendedAt).toLocaleTimeString()}
                    </p>
                `
                : "";


        joinSection = `

            ${attendedNote}

            <div class="interview-actions">

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="handleJoinInterview('${interview.id}', '${interview.meetingLink}')"
                >
                    Join Interview
                </button>

            </div>

        `;

    } else {

        joinSection =
            getJoinButtonMessage(interview);

    }


    return `
        <div class="interview-section">

            <h4 class="interview-section-title">
                ${icon("check-circle", 16)} Interview Accepted
            </h4>


            <p class="interview-detail">
                ${icon("calendar", 14)} ${formatApplicationDate(interview.date)}
            </p>

            <p class="interview-detail">
                ${icon("clock", 14)} ${interview.time}
            </p>

            <p class="interview-detail">
                ${icon("monitor", 14)} ${typeLabel}
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


            ${joinSection}

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
                ${icon("x-circle", 16)} Interview Declined
            </h4>


            <p class="interview-detail">
                You declined this interview invitation.
            </p>

        </div>
    `;
}

/* =========================================================
   FINAL INTERVIEW RESULT
   ========================================================= */

function renderInterviewResult(interview) {

    const typeLabel =
        interview.type === "online"
            ? "Online"
            : "In Person";


    let title = "";
    let message = "";
    let tone = "";


    if (interview.result === "selected") {

        title = icon("check", 14) + " You have been selected";
        message =
            "Congratulations! The recruiter has " +
            "selected you for this internship.";
        tone = "interview-result-success";

    }


    if (interview.result === "not_selected") {

        title = icon("x", 14) + " Not selected";
        message =
            "Unfortunately, the recruiter did not " +
            "select you for this internship.";
        tone = "interview-result-failure";

    }


    if (interview.result === "no_show") {

        title = icon("x", 14) + " Not selected";
        message =
            "You did not attend the interview, " +
            "so the application was not successful.";
        tone = "interview-result-failure";

    }


    return `
        <div class="interview-section ${tone}">

            <h4 class="interview-section-title">
                ${title}
            </h4>


            <p class="interview-detail">
                ${icon("calendar", 14)} ${formatApplicationDate(interview.date)}
            </p>

            <p class="interview-detail">
                ${icon("clock", 14)} ${interview.time}
            </p>

            <p class="interview-detail">
                ${icon("monitor", 14)} ${typeLabel}
            </p>


            <p class="interview-message">
                ${message}
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
   JOIN INTERVIEW
   ========================================================= */

function handleJoinInterview(
    interviewId,
    meetingLink
) {

    // 1. Record attendance (only records the first time).
    markInterviewAttended(interviewId);

    // 2. Open the meeting link in a new tab.
    window.open(
        meetingLink,
        "_blank",
        "noopener"
    );

    // 3. Refresh the card so the "${icon("check", 14)} You joined at ..." note appears.
    loadStudentApplications();

}
/* =========================================================
   STATUS
   ========================================================= */

function formatApplicationStatus(status) {

    const statusNames = {

        pending: "Pending",

        accepted: "Accepted",

        rejected: "Rejected",

        selected: "Selected",

        not_selected: "Not Selected"

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