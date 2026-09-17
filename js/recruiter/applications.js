if (!requireRole("recruiter")) {

    // Redirect already handled by auth.js

} else {

    if (
        document.getElementById(
            "recruiterApplicationList"
        )
    ) {
        initializeRecruiterApplications();
    }


    if (
        document.getElementById(
            "studentDetails"
        )
    ) {
        initializeApplicationDetails();
    }

}
/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeRecruiterApplications() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }


    const internships =
        getInternships();


    const recruiterInternships =
        internships.filter(
            internship =>
                internship.recruiterId === currentUser.id
        );


    const recruiterInternshipIds =
        recruiterInternships.map(
            internship =>
                internship.id
        );


    const applications =
        getApplications();


    const recruiterApplications =
        applications.filter(
            application =>
                recruiterInternshipIds.includes(
                    application.internshipId
                )
        );


    renderRecruiterApplications(
        recruiterApplications,
        recruiterInternships
    );


    updateApplicationSummary(
        recruiterApplications
    );
}


/* =========================================================
   RENDER APPLICATIONS
   ========================================================= */

function renderRecruiterApplications(
    applications,
    internships
) {

    const container =
        document.getElementById(
            "recruiterApplicationList"
        );

    const emptyState =
        document.getElementById(
            "noRecruiterApplications"
        );

    const listCount =
        document.getElementById(
            "applicationListCount"
        );


    listCount.textContent =
        `${applications.length} ${
            applications.length === 1
                ? "application"
                : "applications"
        }`;


    if (applications.length === 0) {

        container.innerHTML = "";

        emptyState.hidden = false;

        return;
    }


    emptyState.hidden = true;


    container.innerHTML =
        applications
            .map(
                application =>
                    createRecruiterApplicationCard(
                        application,
                        internships
                    )
            )
            .join("");
}


/* =========================================================
   APPLICATION CARD
   ========================================================= */

function createRecruiterApplicationCard(
    application,
    internships
) {

    const internship =
        internships.find(
            item =>
                item.id === application.internshipId
        );


   const studentProfiles =
    JSON.parse(
        localStorage.getItem(
            "campus2career_student_profiles"
        )
    ) || {};


const student =
    studentProfiles[
        application.studentId
    ];
    const interview =
        getInterviewByApplicationId(
            application.id
        );


    return `
        <article class="application-card">

            <div class="application-card-header">

                <div>

                    <h3>
                        ${
                            student
                                ? student.name
                                : "Unknown Student"
                        }
                    </h3>

                    <p>
                        ${
                            student
                                ? student.email
                                : "No email available"
                        }
                    </p>

                </div>


                <span class="application-status">
                    ${application.status}
                </span>

            </div>


            <div class="application-card-body">

                <p>
                    <strong>Internship:</strong>
                    ${
                        internship
                            ? internship.title
                            : "Unknown Internship"
                    }
                </p>


                <p>
                    <strong>Applied:</strong>
                    ${
                        application.appliedDate
                            ? new Date(
                                application.appliedDate
                            ).toLocaleDateString()
                            : "N/A"
                    }
                </p>


                ${renderInterviewBadge(interview)}

            </div>


            <div class="application-card-footer">

                ${
                    application.status === "pending"
                        ? `
                            <button
                                type="button"
                                class="btn btn-primary"
                                onclick="handleApplicationStatus('${application.id}', 'accepted')"
                            >
                                Accept
                            </button>

                            <button
                                type="button"
                                class="btn btn-outline"
                                onclick="handleApplicationStatus('${application.id}', 'rejected')"
                            >
                                Reject
                            </button>
                        `
                        : ""
                }


                <a
                    href="application-details.html?id=${application.id}"
                    class="btn btn-outline"
                >
                    View
                </a>

            </div>

        </article>
    `;
}

function renderInterviewBadge(interview) {

    if (!interview) {
        return "";
    }


    if (interview.status === "pending") {

        return `
            <p class="interview-badge">
                🕐 Interview invited —
                waiting for student
            </p>
        `;
    }


    if (interview.status === "accepted") {

        return `
            <p class="interview-badge">
                ✓ Interview accepted —
                ${interview.date} ${interview.time}
            </p>
        `;
    }


    if (interview.status === "declined") {

        return `
            <p class="interview-badge">
                ✕ Interview declined by student
            </p>
        `;
    }


    return "";
}

/* =========================================================
   SUMMARY
   ========================================================= */

function updateApplicationSummary(
    applications
) {

    const total =
        applications.length;


    const pending =
        applications.filter(
            application =>
                application.status === "pending"
        ).length;


    const accepted =
        applications.filter(
            application =>
                application.status === "accepted"
        ).length;


    const rejected =
        applications.filter(
            application =>
                application.status === "rejected"
        ).length;


    document.getElementById(
        "applicationCount"
    ).textContent = total;


    document.getElementById(
        "pendingApplicationCount"
    ).textContent = pending;


    document.getElementById(
        "acceptedApplicationCount"
    ).textContent = accepted;


    document.getElementById(
        "rejectedApplicationCount"
    ).textContent = rejected;
}


function handleApplicationStatus(
    applicationId,
    status
) {

    const currentUser =
        getCurrentUser();

    if (!currentUser) {
        return;
    }


    const applications =
        getApplications();

    const internships =
        getInternships();


    const application =
        applications.find(
            item =>
                item.id === applicationId
        );

    if (!application) {
        return;
    }


    const internship =
        internships.find(
            item =>
                item.id === application.internshipId &&
                item.recruiterId === currentUser.id
        );

    if (!internship) {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to ${status} this application?`
        );

    if (!confirmed) {
        return;
    }


    updateApplicationStatus(
        applicationId,
        status
    );


    // If we are on the application details page,
    // reload the details so the UI updates immediately.
    if (
        document.getElementById(
            "studentDetails"
        )
    ) {

        initializeApplicationDetails();

        return;
    }


    // Otherwise, we are on the applications list page.
    initializeRecruiterApplications();
}




function initializeApplicationDetails() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const applicationId =
        params.get("id");


    if (!applicationId) {
        showApplicationDetailsError(
            "Application not found."
        );

        return;
    }


    const currentUser =
        getCurrentUser();

    if (!currentUser) {
        return;
    }


    const applications =
        getApplications();

    const application =
        applications.find(
            item =>
                item.id === applicationId
        );


    if (!application) {
        showApplicationDetailsError(
            "Application not found."
        );

        return;
    }


    const internships =
        getInternships();

    const internship =
        internships.find(
            item =>
                item.id === application.internshipId &&
                item.recruiterId === currentUser.id
        );


    if (!internship) {
        showApplicationDetailsError(
            "Application not found or you do not have permission to view it."
        );

        return;
    }


    const studentProfiles =
        JSON.parse(
            localStorage.getItem(
                "campus2career_student_profiles"
            )
        ) || {};


    const student =
        studentProfiles[
            application.studentId
        ];


    if (!student) {
        showApplicationDetailsError(
            "Student profile not found."
        );

        return;
    }


    renderApplicationDetails(
        application,
        internship,
        student
    );
}



function renderApplicationDetails(
    application,
    internship,
    student
) {

    const studentContainer =
        document.getElementById(
            "studentDetails"
        );


    const applicationContainer =
        document.getElementById(
            "applicationDetails"
        );


    studentContainer.innerHTML = `

        <div class="section-heading">

            <h2>
                Student Information
            </h2>

        </div>


        <div class="profile-form-grid">

            <div class="form-group">

                <label>
                    Name
                </label>

                <p>
                    ${student.name || "N/A"}
                </p>

            </div>


            <div class="form-group">

                <label>
                    Email
                </label>

                <p>
                    ${student.email || "N/A"}
                </p>

            </div>


            <div class="form-group">

                <label>
                    Phone
                </label>

                <p>
                    ${student.phone || "N/A"}
                </p>

            </div>


            <div class="form-group">

                <label>
                    University
                </label>

                <p>
                    ${student.university || "N/A"}
                </p>

            </div>


            <div class="form-group">

                <label>
                    Roll No
                </label>

                <p>
                    ${student.rollNo || "N/A"}
                </p>

            </div>


            <div class="form-group">

                <label>
                    Skills
                </label>

                <p>
                    ${
                        student.skills
                            ? student.skills
                                .split(",")
                                .map(skill => skill.trim())
                                .join(", ")
                            : "N/A"
                    }
                </p>

            </div>

        </div>

    `;


    applicationContainer.innerHTML = `

        <div class="section-heading">

            <h2>
                Application Information
            </h2>

        </div>


        <div class="profile-form-grid">

            <div class="form-group">

                <label>
                    Internship
                </label>

                <p>
                    ${internship.title}
                </p>

            </div>


            <div class="form-group">

                <label>
                    Company
                </label>

                <p>
                    ${internship.company}
                </p>

            </div>


            <div class="form-group">

                <label>
                    Status
                </label>

                <p>
                    ${application.status}
                </p>

            </div>


            <div class="form-group">

                <label>
                    Applied Date
                </label>

                <p>
                    ${
                        application.appliedDate
                            ? new Date(
                                application.appliedDate
                            ).toLocaleDateString()
                            : "N/A"
                    }
                </p>

            </div>

        </div>

    `;


    renderApplicationActions(
        application
    );

}
function renderApplicationActions(
    application
) {

    const container =
        document.getElementById(
            "applicationActions"
        );

    if (!container) {
        return;
    }


    container.classList.remove("application-actions-stacked");

    container.innerHTML = "";


    /* ---------- PENDING ---------- */

    if (application.status === "pending") {

        container.innerHTML = `

            <button
                type="button"
                class="btn btn-primary"
                onclick="handleApplicationStatus('${application.id}', 'accepted')"
            >
                Accept Application
            </button>


            <button
                type="button"
                class="btn btn-outline"
                onclick="handleApplicationStatus('${application.id}', 'rejected')"
            >
                Reject Application
            </button>


            <a
                href="applications.html"
                class="btn btn-outline"
            >
                Back to Applications
            </a>

        `;

        return;
    }


    /* ---------- REJECTED ---------- */

    if (application.status === "rejected") {

        container.innerHTML = `

            <span class="application-status">
                Application rejected
            </span>


            <a
                href="applications.html"
                class="btn btn-outline"
            >
                Back to Applications
            </a>

        `;

        return;
    }


    /* ---------- ACCEPTED (interview stage) ---------- */

    if (application.status === "accepted") {

        renderAcceptedApplicationActions(
            application
        );

        return;
    }


    /* ---------- FINAL (selected / not_selected) ---------- */

    renderFinalApplicationActions(
        application
    );
}
/* =========================================================
   FINAL APPLICATION ACTIONS
   ========================================================= */

function renderFinalApplicationActions(
    application
) {

    const container =
        document.getElementById(
            "applicationActions"
        );

    if (!container) {
        return;
    }


    const interview =
        getInterviewByApplicationId(
            application.id
        );


    const label =
        application.status === "selected"
            ? "✓ Selected"
            : "✕ Not Selected";


    let noShowNote = "";


    if (
        interview &&
        interview.result === "no_show"
    ) {

        noShowNote = `
            <p class="interview-detail interview-warning">
                ⚠ Student did not attend the interview.
            </p>
        `;

    }


    container.innerHTML = `

        <span class="application-status">
            ${label}
        </span>


        ${noShowNote}


        <a
            href="applications.html"
            class="btn btn-outline"
        >
            Back to Applications
        </a>

    `;
}

/* =========================================================
   INTERVIEW TIME HELPERS
   ========================================================= */

function hasInterviewEnded(interview) {

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


    const diffMinutes =
        (Date.now() - startTime.getTime()) / 60000;


    // The window closes 30 minutes after start
    // (same rule as the student side).
    return diffMinutes >= 30;
}
/* =========================================================
   ACCEPTED APPLICATION ACTIONS
   ========================================================= */

function renderAcceptedApplicationActions(
    application
) {

    const container =
        document.getElementById(
            "applicationActions"
        );

    if (!container) {
        return;
    }

container.classList.remove("application-actions-stacked");
    const interview =
        getInterviewByApplicationId(
            application.id
        );


    /* ---------- No interview yet ---------- */

    if (!interview) {

        container.innerHTML = `

            <span class="application-status">
                Application accepted
            </span>


            <button
                type="button"
                class="btn btn-primary"
                onclick="showInterviewForm('${application.id}')"
            >
                Invite for Interview
            </button>


            <a
                href="applications.html"
                class="btn btn-outline"
            >
                Back to Applications
            </a>

        `;

        return;
    }


    /* ---------- Waiting for student ---------- */

    if (interview.status === "pending") {
         container.classList.add("application-actions-stacked");

        container.innerHTML = `

            <span class="application-status">
                ✓ Interview invitation sent
            </span>


            <p>
                <strong>Date:</strong>
                ${interview.date}
            </p>


            <p>
                <strong>Time:</strong>
                ${interview.time}
            </p>


            <p>
                <strong>Type:</strong>
                ${
                    interview.type === "online"
                        ? "Online"
                        : "In Person"
                }
            </p>


            <p>
                Waiting for student's response.
            </p>


            <a
                href="applications.html"
                class="btn btn-outline"
            >
                Back to Applications
            </a>

        `;

        return;
    }

        /* ---------- Student accepted ---------- */

    if (interview.status === "accepted") {
         container.classList.add("application-actions-stacked");

        /* ---------- Attendance line ---------- */

        let attendanceLine = "";


        if (interview.attendedAt) {

            attendanceLine = `
                <p class="interview-detail">
                    ✓ Student joined the interview at
                    ${new Date(interview.attendedAt).toLocaleTimeString()}
                </p>
            `;

        } else if (hasInterviewEnded(interview)) {

            attendanceLine = `
                <p class="interview-detail interview-warning">
                    ⚠ Student did not join the interview
                </p>
            `;

        } else {

            attendanceLine = `
                <p class="interview-detail">
                    Waiting for the interview to take place.
                </p>
            `;

        }


        container.innerHTML = `

            <span class="application-status">
                ✓ Student accepted the interview
            </span>


            <p>
                <strong>Date:</strong>
                ${interview.date}
            </p>


            <p>
                <strong>Time:</strong>
                ${interview.time}
            </p>


            <p>
                <strong>Type:</strong>
                ${
                    interview.type === "online"
                        ? "Online"
                        : "In Person"
                }
            </p>


            ${attendanceLine}


            <div class="form-group">

                <label for="interviewResult">
                    Interview Result
                </label>

                <select
                    id="interviewResult"
                    onchange="handleInterviewResultChange('${interview.id}')"
                >

                    <option
                        value="pending"
                        ${interview.result === "pending" ? "selected" : ""}
                    >
                        Pending
                    </option>

                    <option
                        value="selected"
                        ${interview.result === "selected" ? "selected" : ""}
                    >
                        Selected
                    </option>

                    <option
                        value="not_selected"
                        ${interview.result === "not_selected" ? "selected" : ""}
                    >
                        Not Selected
                    </option>

                    <option
                        value="no_show"
                        ${interview.result === "no_show" ? "selected" : ""}
                    >
                        No Show
                    </option>

                </select>

            </div>


            <a
                href="applications.html"
                class="btn btn-outline"
            >
                Back to Applications
            </a>

        `;

        return;
    }

    /* ---------- Student declined ---------- */

    if (interview.status === "declined") {

        container.innerHTML = `

            <span class="application-status">
                Student declined the interview
            </span>


            <a
                href="applications.html"
                class="btn btn-outline"
            >
                Back to Applications
            </a>

        `;

        return;
    }
}

/* =========================================================
   INTERVIEW RESULT
   ========================================================= */

function handleInterviewResultChange(
    interviewId
) {

    const select =
        document.getElementById(
            "interviewResult"
        );

    if (!select) {
        return;
    }


    const newResult =
        select.value;


    const labelMap = {
        pending: "Pending",
        selected: "Selected",
        not_selected: "Not Selected",
        no_show: "No Show"
    };


    const confirmed =
        confirm(
            `Set interview result to "${labelMap[newResult] || newResult}"? ` +
            `This will update the application status.`
        );


    if (!confirmed) {

        // Re-render to restore the previous selection.
        initializeApplicationDetails();

        return;

    }


    /* 1. Update the interview result */

    const interview =
        updateInterviewResult(
            interviewId,
            newResult
        );


    if (!interview) {
        return;
    }


    /* 2. Update the application status */

    let applicationStatus = null;


    if (newResult === "selected") {
        applicationStatus = "selected";
    }

    if (newResult === "not_selected") {
        applicationStatus = "not_selected";
    }

    if (newResult === "no_show") {
        applicationStatus = "not_selected";
    }


    if (applicationStatus) {

        updateApplicationStatus(
            interview.applicationId,
            applicationStatus
        );

    }


    /* 3. Re-render the details page */

    initializeApplicationDetails();
}

/* =========================================================
   INTERVIEW INVITE FORM
   ========================================================= */

function showInterviewForm(
    applicationId
) {

    const container =
        document.getElementById(
            "applicationActions"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `

        <form
            id="interviewInviteForm"
            onsubmit="handleInterviewInviteSubmit(event, '${applicationId}')"
        >

            <h3>
                Invite Student for Interview
            </h3>


            <div class="profile-form-grid">

                <div class="form-group">

                    <label for="interviewDate">
                        Date
                    </label>

                    <input
                        type="date"
                        id="interviewDate"
                        required
                    >

                </div>


                <div class="form-group">

                    <label for="interviewTime">
                        Time
                    </label>

                    <input
                        type="time"
                        id="interviewTime"
                        required
                    >

                </div>


                <div class="form-group">

                    <label for="interviewType">
                        Interview Type
                    </label>

                    <select
                        id="interviewType"
                        onchange="handleInterviewTypeChange()"
                    >

                        <option value="online">
                            Online
                        </option>

                        <option value="in_person">
                            In Person
                        </option>

                    </select>

                </div>


                <div
                    class="form-group"
                    id="meetingLinkGroup"
                >

                    <label for="interviewMeetingLink">
                        Meeting Link
                    </label>

                    <input
                        type="url"
                        id="interviewMeetingLink"
                        placeholder="https://meet.google.com/..."
                    >

                </div>


                <div
                    class="form-group"
                    id="locationGroup"
                    hidden
                >

                    <label for="interviewLocation">
                        Location
                    </label>

                    <input
                        type="text"
                        id="interviewLocation"
                        placeholder="Company Office, Yangon"
                    >

                </div>

            </div>


            <div class="form-group">

                <label for="interviewMessage">
                    Message
                </label>

                <textarea
                    id="interviewMessage"
                    rows="3"
                    placeholder="We would like to invite you for an interview."
                ></textarea>

            </div>


            <div class="profile-form-footer">

                <button
                    type="submit"
                    class="btn btn-primary"
                >
                    Send Interview Invitation
                </button>


                <button
                    type="button"
                    class="btn btn-outline"
                    onclick="initializeApplicationDetails()"
                >
                    Cancel
                </button>

            </div>

        </form>

    `;
}


function handleInterviewTypeChange() {

    const typeSelect =
        document.getElementById(
            "interviewType"
        );

    const meetingLinkGroup =
        document.getElementById(
            "meetingLinkGroup"
        );

    const locationGroup =
        document.getElementById(
            "locationGroup"
        );


    if (
        !typeSelect ||
        !meetingLinkGroup ||
        !locationGroup
    ) {
        return;
    }


    if (typeSelect.value === "online") {

        meetingLinkGroup.hidden = false;
        locationGroup.hidden = true;

    } else {

        meetingLinkGroup.hidden = true;
        locationGroup.hidden = false;

    }
}


function handleInterviewInviteSubmit(
    event,
    applicationId
) {

    event.preventDefault();


    const currentUser =
        getCurrentUser();

    if (!currentUser) {
        return;
    }


    /* Guard: one active interview per application */

    const existingInterview =
        getInterviewByApplicationId(
            applicationId
        );

    if (existingInterview) {

        alert(
            "An interview invitation has already been sent for this application."
        );

        initializeApplicationDetails();

        return;

    }


    const application =
        getApplications().find(
            item =>
                item.id === applicationId
        );

    if (!application) {
        return;
    }


    const date =
        document.getElementById(
            "interviewDate"
        ).value;

    const time =
        document.getElementById(
            "interviewTime"
        ).value;

    const type =
        document.getElementById(
            "interviewType"
        ).value;

    const meetingLink =
        document.getElementById(
            "interviewMeetingLink"
        ).value.trim();

    const location =
        document.getElementById(
            "interviewLocation"
        ).value.trim();

    const message =
        document.getElementById(
            "interviewMessage"
        ).value.trim();


    if (!date || !time) {

        alert(
            "Please provide a date and time for the interview."
        );

        return;

    }


    if (
        type === "online" &&
        !meetingLink
    ) {

        alert(
            "Please provide a meeting link for an online interview."
        );

        return;

    }


    if (
        type === "in_person" &&
        !location
    ) {

        alert(
            "Please provide a location for an in-person interview."
        );

        return;

    }


    createInterviewInvitation({

        applicationId: application.id,

        internshipId: application.internshipId,

        recruiterId: currentUser.id,

        studentId: application.studentId,

        date: date,

        time: time,

        type: type,

        location:
            type === "in_person"
                ? location
                : "",

        meetingLink:
            type === "online"
                ? meetingLink
                : "",

        message: message

    });


    initializeApplicationDetails();
}
function showApplicationDetailsError(
    message
) {

    const studentContainer =
        document.getElementById(
            "studentDetails"
        );

    if (studentContainer) {

        studentContainer.innerHTML = `
            <p class="profile-message error">
                ${message}
            </p>
        `;

    }
}