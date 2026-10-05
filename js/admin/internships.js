/* =========================================================
   ADMIN — INTERNSHIPS
   ========================================================= */

let allInternshipRows = [];

let currentInternshipFilter = "all";
let adminInternshipsPager = null;


if (!requireRole("admin")) {

    // Redirect handled by auth.js

} else {

    initializeAdminInternships();

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeAdminInternships() {

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

    allInternshipRows = buildInternshipRows();


    /* Counts + render */

    updateTabCounts();

    applyInternshipFilter();

}


/* =========================================================
   DATA
   ========================================================= */

function buildInternshipRows() {

    const internships = getInternships();

    const users = getUsers();

    const profiles = getRecruiterProfiles();


    return internships.map(internship => {

        const recruiterUser =
            users.find(u => u.id === internship.recruiterId);


        const recruiterProfile =
            profiles[internship.recruiterId] || {};


        return {

            id: internship.id,

            title: internship.title,

            company: internship.company,

            location: internship.location,

            status: internship.status || "active",

            postedAt:
                internship.postedAt ||
                internship.postedDate ||
                "",

            deadline: internship.deadline || "",

            recruiterId: internship.recruiterId,

            recruiterName:
                recruiterUser
                    ? recruiterUser.name
                    : "Unknown Recruiter",

            recruiterCompany:
                recruiterProfile.companyName ||
                ""

        };

    });

}


/* =========================================================
   TAB COUNTS
   ========================================================= */

function updateTabCounts() {

    const counts = {

        all: allInternshipRows.length,

        active:
            allInternshipRows.filter(
                r => r.status === "active"
            ).length,

        closed:
            allInternshipRows.filter(
                r => r.status === "closed"
            ).length

    };


    const map = {
        countAll: counts.all,
        countActive: counts.active,
        countClosed: counts.closed
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

function setInternshipFilter(status) {

    currentInternshipFilter = status;


    document
        .querySelectorAll("#internshipFilterTabs .filter-tab")
        .forEach(tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.status === status
            );

        });


    applyInternshipFilter();

}


function applyInternshipFilter() {

    let filtered = allInternshipRows;


    if (currentInternshipFilter !== "all") {

        filtered = filtered.filter(
            row => row.status === currentInternshipFilter
        );

    }


    renderInternshipList(filtered);


    const headingMap = {
        all: "All Internships",
        active: "Active Internships",
        closed: "Closed Internships"
    };


    const subMap = {
        all: "Every internship posted on the platform",
        active: "Internships currently visible to students",
        closed: "Internships no longer accepting applications"
    };


    document.getElementById("listHeading")
        .textContent = headingMap[currentInternshipFilter];

    document.getElementById("listSubheading")
        .textContent = subMap[currentInternshipFilter];

}


/* =========================================================
   RENDER
   ========================================================= */

function renderInternshipList(rows) {

    const empty =
        document.getElementById("noInternships");


    if (!adminInternshipsPager) {

        adminInternshipsPager = createPaginatedRenderer({
            containerId: "internshipList",
            counterId: null,
            pagerId: "adminInternshipsPager",
            perPage: 8
        });

    }


    if (rows.length === 0) {

        adminInternshipsPager.setItems([], createInternshipRow);

        if (empty) {
            empty.hidden = false;
        }

        return;

    }


    if (empty) {
        empty.hidden = true;
    }


    adminInternshipsPager.setItems(rows, createInternshipRow);

}


function createInternshipRow(row) {

    const statusClass =
        row.status === "active"
            ? "status-active"
            : "status-closed";


    const statusText =
        row.status === "active"
            ? "Active"
            : "Closed";


    const deadlineLine =
        row.deadline
            ? `<span>${icon("calendar", 14)} Closes ${formatAdminDate(row.deadline)}</span>`
            : "";


    const postedLine =
        row.postedAt
            ? `<span>${icon("calendar", 14)} ${formatAdminDate(row.postedAt)}</span>`
            : "";


    const closeButton =
        row.status === "active"
            ? `
                <button
                    type="button"
                    class="btn btn-outline"
                    onclick="handleForceClose('${row.id}')"
                >
                    Close
                </button>
            `
            : "";


    return `
        <div class="admin-internship-row">

            <div class="admin-internship-main">

                <div class="admin-internship-avatar">
                    ${row.company.charAt(0).toUpperCase()}
                </div>


                <div class="admin-internship-info">

                    <div class="admin-internship-title-row">

                        <strong>
                            ${row.title}
                        </strong>

                        <span class="${statusClass}">
                            ${statusText}
                        </span>

                    </div>

                    <p class="admin-recruiter-sub">
                        ${row.company}
                        ·
                        ${row.recruiterName}
                        ${
                            row.recruiterCompany
                                ? ` (${row.recruiterCompany})`
                                : ""
                        }
                    </p>

                    <p class="admin-recruiter-industry">
                        ${icon("location", 14)} ${row.location}
                        ${postedLine}
                        ${deadlineLine}
                    </p>

                </div>

            </div>


            <div class="admin-internship-actions">

                ${closeButton}

                <button
                    type="button"
                    class="btn btn-danger"
                    onclick="handleDeleteInternship('${row.id}')"
                >
                    Delete
                </button>

            </div>

        </div>
    `;

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


/* =========================================================
   FORCE CLOSE
   ========================================================= */

function handleForceClose(internshipId) {

    const confirmed =
        confirm(
            "Close this internship? " +
            "It will no longer be visible to students."
        );

    if (!confirmed) {
        return;
    }


    const internships = getInternships();

    const index =
        internships.findIndex(i => i.id === internshipId);

    if (index === -1) {
        return;
    }


    internships[index].status = "closed";

    saveInternships(internships);


    /* Refresh */

    allInternshipRows = buildInternshipRows();

    updateTabCounts();

    applyInternshipFilter();

}


/* =========================================================
   DELETE
   ========================================================= */

function handleDeleteInternship(internshipId) {

    const confirmed =
        confirm(
            "Delete this internship?\n\n" +
            "This will remove:\n" +
            "• the internship post\n" +
            "• all applications to it\n" +
            "• all interviews for those applications\n\n" +
            "This cannot be undone."
        );

    if (!confirmed) {
        return;
    }


    /* 1. Remove the internship */

    const internships = getInternships();

    const remainingInternships =
        internships.filter(i => i.id !== internshipId);

    saveInternships(remainingInternships);


    /* 2. Find applications to this internship */

    const applications = getApplications();

    const removedApplicationIds =
        applications
            .filter(a => a.internshipId === internshipId)
            .map(a => a.id);


    const remainingApplications =
        applications.filter(
            a => a.internshipId !== internshipId
        );

    saveApplications(remainingApplications);


    /* 3. Remove interviews for those applications */

    const interviews = getInterviews();

    const remainingInterviews =
        interviews.filter(i =>
            !removedApplicationIds.includes(i.applicationId)
        );

    saveInterviews(remainingInterviews);


    /* 4. Refresh */

    allInternshipRows = buildInternshipRows();

    updateTabCounts();

    applyInternshipFilter();

}