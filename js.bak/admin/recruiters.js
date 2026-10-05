/* =========================================================
   ADMIN — RECRUITERS
   ========================================================= */

let allRecruiterRows = [];

let currentRecruiterFilter = "all";


if (!requireRole("admin")) {

    // Redirect handled by auth.js

} else {

    initializeAdminRecruiters();

}




/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeAdminRecruiters() {

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


    /* Build recruiter rows from users + profiles */

    allRecruiterRows =
        buildRecruiterRows();


    /* Sidebar badge */

    updatePendingBadge();


    /* Tab counts */

    updateTabCounts();


    /* Render */

    applyRecruiterFilter();

}


/* =========================================================
   DATA
   ========================================================= */

function buildRecruiterRows() {

    const users = getUsers();

    const recruiterUsers =
        users.filter(user => user.role === "recruiter");


    const profiles = getRecruiterProfiles();


    return recruiterUsers.map(user => {

        const profile = profiles[user.id] || {};


        return {

            userId: user.id,

            name: user.name || "Unknown",

            email: user.email || "",

            companyName:
                profile.companyName ||
                "(Company not set)",

            industry: profile.industry || "",

            verificationStatus:
                profile.verificationStatus ||
                "unsubmitted"

        };

    });

}


/* =========================================================
   SIDEBAR BADGE
   ========================================================= */

function updatePendingBadge() {

    const pendingCount =
        allRecruiterRows.filter(
            row =>
                row.verificationStatus === "pending"
        ).length;


    const badge =
        document.getElementById("pendingBadge");


    if (!badge) {
        return;
    }


    if (pendingCount > 0) {
        badge.textContent = pendingCount;
    } else {
        badge.textContent = "";
    }

}


/* =========================================================
   TAB COUNTS
   ========================================================= */

function updateTabCounts() {

    const counts = {
        all: allRecruiterRows.length,

        pending:
            allRecruiterRows.filter(
                r => r.verificationStatus === "pending"
            ).length,

        verified:
            allRecruiterRows.filter(
                r => r.verificationStatus === "verified"
            ).length,

        rejected:
            allRecruiterRows.filter(
                r => r.verificationStatus === "rejected"
            ).length,

        unsubmitted:
            allRecruiterRows.filter(
                r => r.verificationStatus === "unsubmitted"
            ).length

    };


    const map = {
        countAll: counts.all,
        countPending: counts.pending,
        countVerified: counts.verified,
        countRejected: counts.rejected,
        countUnsubmitted: counts.unsubmitted
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

function setRecruiterFilter(status) {

    currentRecruiterFilter = status;


    document
        .querySelectorAll("#recruiterFilterTabs .filter-tab")
        .forEach(tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.status === status
            );

        });


    applyRecruiterFilter();

}


function applyRecruiterFilter() {

    let filtered = allRecruiterRows;


    if (currentRecruiterFilter !== "all") {

        filtered = filtered.filter(
            row =>
                row.verificationStatus ===
                currentRecruiterFilter
        );

    }


    renderRecruiterList(filtered);


    /* Heading text reflects the filter */

    const headingMap = {
        all: "All Recruiters",
        pending: "Pending Verifications",
        verified: "Verified Recruiters",
        rejected: "Rejected Recruiters",
        unsubmitted: "Unsubmitted Recruiters"
    };


    const subMap = {
        all: "Every registered recruiter account",
        pending: "Recruiters waiting for your review",
        verified: "Approved recruiter accounts",
        rejected: "Recruiters whose verification was rejected",
        unsubmitted: "Recruiters who have not applied yet"
    };


    document.getElementById("listHeading")
        .textContent = headingMap[currentRecruiterFilter];

    document.getElementById("listSubheading")
        .textContent = subMap[currentRecruiterFilter];

}


/* =========================================================
   RENDER
   ========================================================= */

function renderRecruiterList(rows) {

    const container =
        document.getElementById("recruiterList");

    const empty =
        document.getElementById("noRecruiters");

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


    container.innerHTML =
        rows
            .map(createRecruiterRow)
            .join("");

}


function createRecruiterRow(row) {

    const badge = createStatusBadge(
        row.verificationStatus
    );


    return `
        <div class="admin-recruiter-row">

            <div class="admin-recruiter-main">

                <div class="admin-recruiter-avatar">
                    ${
                        row.companyName
                            .charAt(0)
                            .toUpperCase()
                    }
                </div>


                <div class="admin-recruiter-info">

                    <div class="admin-recruiter-name-row">

                        <strong>
                            ${row.companyName}
                        </strong>

                        ${badge}

                    </div>

                    <p class="admin-recruiter-sub">
                        ${row.name}
                        ·
                        ${row.email}
                    </p>

                    ${
                        row.industry
                            ? `
                                <p class="admin-recruiter-industry">
                                    ${row.industry}
                                </p>
                            `
                            : ""
                    }

                </div>

            </div>


            <div class="admin-recruiter-actions">

                <a
                    href="recruiter-details.html?id=${row.userId}"
                    class="btn btn-outline"
                >
                    View Details
                </a>

            </div>

        </div>
    `;

}


function createStatusBadge(status) {

    const labels = {
        verified: "Verified",
        pending: "Pending",
        rejected: "Rejected",
        unsubmitted: "Not Submitted"
    };


    return `
        <span class="verification-badge badge-${status}">
            ${labels[status] || status}
        </span>
    `;

}