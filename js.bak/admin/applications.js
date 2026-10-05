/* =========================================================
   ADMIN — APPLICATIONS (READ-ONLY AUDIT)
   ========================================================= */

let allApplicationRows = [];

let currentApplicationFilter = "all";


if (!requireRole("admin")) {

    // Redirect handled by auth.js

} else {

    initializeAdminApplications();

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeAdminApplications() {

    initializeInternships();

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }


    /* Sidebar */

    document.getElementById("adminName")
        .textContent = currentUser.name;


    const initial =
        document.getElementById("adminInitial");

    if (initial) {
        initial.textContent =
            currentUser.name
                ? currentUser.name.charAt(0).toUpperCase()
                : "A";
    }


    /* Sidebar badge */

    const profiles = getRecruiterProfiles();

    const pending =
        Object.values(profiles)
            .filter(p =>
                (p.verificationStatus || "unsubmitted") === "pending"
            ).length;


    const badge =
        document.getElementById("pendingBadge");

    if (badge && pending > 0) {
        badge.textContent = pending;
    }


    /* Build rows */

    allApplicationRows = buildApplicationRows();


    /* Counts + render */

    updateTabCounts();

    applyApplicationFilter();

}


/* =========================================================
   DATA
   ========================================================= */

function buildApplicationRows() {

    const applications = getApplications();

    const users = getUsers();

    const studentProfiles = getStudentProfiles();

    const internships = getInternships();

    const interviews = getInterviews();


    return applications.map(application => {

        /* Student */

        const studentUser =
            users.find(u => u.id === application.studentId);

        const studentProfile =
            studentProfiles[application.studentId] || {};


        /* Internship */

        const internship =
            internships.find(
                i => i.id === application.internshipId
            );


        /* Recruiter */

        const recruiterUser =
            internship
                ? users.find(u => u.id === internship.recruiterId)
                : null;


        /* Interview */

        const interview =
            interviews.find(
                i => i.applicationId === application.id
            );


        return {

            id: application.id,

            status: application.status,

            appliedDate: application.appliedDate || "",

            studentId: application.studentId,

            studentName:
                studentUser
                    ? studentUser.name
                    : (studentProfile.name || "Unknown Student"),

            studentEmail:
                studentUser
                    ? studentUser.email
                    : (studentProfile.email || ""),

            internshipTitle:
                internship
                    ? internship.title
                    : "Unknown Internship",

            internshipCompany:
                internship
                    ? internship.company
                    : "",

            recruiterName:
                recruiterUser
                    ? recruiterUser.name
                    : "Unknown Recruiter",

            interviewStatus:
                interview
                    ? interview.status
                    : "",

            interviewResult:
                interview
                    ? interview.result
                    : ""

        };

    });

}


/* =========================================================
   TAB COUNTS
   ========================================================= */

function updateTabCounts() {

    const counts = {

        all: allApplicationRows.length,

        pending:
            allApplicationRows.filter(
                r => r.status === "pending"
            ).length,

        accepted:
            allApplicationRows.filter(
                r => r.status === "accepted"
            ).length,

        rejected:
            allApplicationRows.filter(
                r => r.status === "rejected"
            ).length,

        selected:
            allApplicationRows.filter(
                r => r.status === "selected"
            ).length,

        not_selected:
            allApplicationRows.filter(
                r => r.status === "not_selected"
            ).length

    };


    const map = {
        countAll: counts.all,
        countPending: counts.pending,
        countAccepted: counts.accepted,
        countRejected: counts.rejected,
        countSelected: counts.selected,
        countNotSelected: counts.not_selected
    };


    Object.keys(map).forEach(id => {

        const el = document.getElementById(id);

        if (el) {
            el.textContent =
                map[id] > 0
                    ? `· ${map[id]}`
                    : "";
        }

    });

}


/* =========================================================
   FILTER
   ========================================================= */

function setApplicationFilter(status) {

    currentApplicationFilter = status;


    document
        .querySelectorAll("#applicationFilterTabs .filter-tab")
        .forEach(tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.status === status
            );

        });


    applyApplicationFilter();

}


function applyApplicationFilter() {

    let filtered = allApplicationRows;


    if (currentApplicationFilter !== "all") {

        filtered = filtered.filter(
            row => row.status === currentApplicationFilter
        );

    }


    renderApplicationList(filtered);


    const labels = {
        all: "All Applications",
        pending: "Pending Applications",
        accepted: "Accepted Applications",
        rejected: "Rejected Applications",
        selected: "Selected Applications",
        not_selected: "Not Selected Applications"
    };


    const subs = {
        all: "Every application submitted on the platform",
        pending: "Waiting for recruiter review",
        accepted: "Advanced to interview stage",
        rejected: "Rejected at application stage",
        selected: "Offered the internship",
        not_selected: "Declined after interview"
    };


    document.getElementById("listHeading")
        .textContent = labels[currentApplicationFilter];

    document.getElementById("listSubheading")
        .textContent = subs[currentApplicationFilter];

}


/* =========================================================
   RENDER
   ========================================================= */

function renderApplicationList(rows) {

    const container =
        document.getElementById("applicationList");

    const empty =
        document.getElementById("noApplications");

    if (!container) {
        return;
    }


    if (rows.length === 0) {

        container.innerHTML = "";

        if (empty) {
            empty.hidden = false;
        }

        return;

    }


    if (empty) {
        empty.hidden = true;
    }


    /* Sort: most recent first */

    const sorted = rows.slice().sort((a, b) => {

        const dateA = a.appliedDate
            ? new Date(a.appliedDate).getTime()
            : 0;

        const dateB = b.appliedDate
            ? new Date(b.appliedDate).getTime()
            : 0;

        return dateB - dateA;

    });


    container.innerHTML =
        sorted
            .map(createApplicationRow)
            .join("");

}


function createApplicationRow(row) {

    const statusClass =
        `status-${row.status}`;


    const statusLabel =
        formatStatusLabel(row.status);


    const interviewLine =
        row.interviewStatus
            ? `<span>· Interview: ${formatInterviewLabel(row)}</span>`
            : "";


    return `
        <div class="admin-application-row">

            <div class="admin-application-main">

                <div class="admin-recruiter-avatar admin-student-avatar">
                    ${
                        row.studentName
                            .charAt(0)
                            .toUpperCase()
                    }
                </div>


                <div class="admin-recruiter-info">

                    <div class="admin-recruiter-name-row">

                        <strong>
                            ${row.studentName}
                        </strong>

                        <span class="application-status ${statusClass}">
                            ${statusLabel}
                        </span>

                    </div>

                    <p class="admin-recruiter-sub">
                        Applied to
                        <strong>${row.internshipTitle}</strong>
                        at
                        ${row.internshipCompany || "—"}
                    </p>

                    <p class="admin-recruiter-industry">
                        Recruiter: ${row.recruiterName}
                        ·
                        ${icon("calendar", 14)} ${formatAdminDate(row.appliedDate)}
                        ${interviewLine}
                    </p>

                </div>

            </div>

        </div>
    `;

}


function formatStatusLabel(status) {

    const labels = {
        pending: "Pending",
        accepted: "Accepted",
        rejected: "Rejected",
        selected: "Selected",
        not_selected: "Not Selected"
    };

    return labels[status] || status;

}


function formatInterviewLabel(row) {

    if (row.interviewResult === "selected") {
        return icon("check", 14) + " Selected";
    }

    if (row.interviewResult === "not_selected") {
        return icon("x", 14) + " Not Selected";
    }

    if (row.interviewResult === "no_show") {
        return icon("alert", 14) + " No Show";
    }

    if (row.interviewStatus === "pending") {
        return "waiting for student";
    }

    if (row.interviewStatus === "accepted") {
        return "accepted by student";
    }

    if (row.interviewStatus === "declined") {
        return "declined by student";
    }

    if (row.interviewStatus === "completed") {
        return "completed";
    }

    return row.interviewStatus;

}


function formatAdminDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}