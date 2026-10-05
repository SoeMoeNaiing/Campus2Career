/* =========================================================
   ADMIN — STUDENTS
   ========================================================= */

let allStudentRows = [];
let adminStudentsPager = null;


if (!requireRole("admin")) {

    // Redirect handled by auth.js

} else {

    initializeAdminStudents();

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeAdminStudents() {

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

    allStudentRows = buildStudentRows();


    /* Search */

    const searchInput =
        document.getElementById("studentSearchInput");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderStudentList
        );

    }


    /* Initial render */

    renderStudentList();

}


/* =========================================================
   DATA
   ========================================================= */

function buildStudentRows() {

    const users = getUsers();

    const studentUsers =
        users.filter(user => user.role === "student");


    const profiles = getStudentProfiles();

    const applications = getApplications();


    return studentUsers.map(user => {

        const profile = profiles[user.id] || {};


        const applicationCount =
            applications.filter(
                a => a.studentId === user.id
            ).length;


        return {

            userId: user.id,

            name: user.name || "Unknown",

            email: user.email || "",

            university: profile.university || "",

            major: profile.major || "",

            applicationCount: applicationCount

        };

    });

}


/* =========================================================
   RENDER
   ========================================================= */

function renderStudentList() {

    const empty =
        document.getElementById("noStudents");

    const searchInput =
        document.getElementById("studentSearchInput");

    const term =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    let filtered = allStudentRows;


    if (term) {

        filtered = filtered.filter(row => {

            const haystack = (
                row.name + " " +
                row.email + " " +
                row.university
            ).toLowerCase();

            return haystack.includes(term);

        });

    }


    /* Update heading */

    const heading =
        document.getElementById("listHeading");

    const subheading =
        document.getElementById("listSubheading");


    if (heading) {

        heading.textContent =
            term ? "Search Results" : "All Students";

    }


    if (subheading) {

        subheading.textContent =
            term
                ? `${filtered.length} ${
                      filtered.length === 1 ? "match" : "matches"
                  } for "${searchInput.value.trim()}"`
                : `${allStudentRows.length} registered ${
                      allStudentRows.length === 1 ? "account" : "accounts"
                  }`;

    }


    /* Pager */

    if (!adminStudentsPager) {

        adminStudentsPager = createPaginatedRenderer({
            containerId: "studentList",
            counterId: null,
            pagerId: "adminStudentsPager",
            perPage: 12
        });

    }


    /* Empty state */

    if (filtered.length === 0) {

        adminStudentsPager.setItems([], createStudentRow);

        if (empty) {
            empty.hidden = false;
        }

        return;

    }


    if (empty) {
        empty.hidden = true;
    }


    /* Render via pager */

    adminStudentsPager.setItems(filtered, createStudentRow);

}

function createStudentRow(row) {

    const subParts = [];

    if (row.university) {
        subParts.push(row.university);
    }

    if (row.major) {
        subParts.push(row.major);
    }


    const sub =
        subParts.length > 0
            ? subParts.join(" · ")
            : "—";


    return `
        <div class="admin-recruiter-row">

            <div class="admin-recruiter-main">

                <div class="admin-recruiter-avatar admin-student-avatar">
                    ${
                        row.name
                            .charAt(0)
                            .toUpperCase()
                    }
                </div>


                <div class="admin-recruiter-info">

                    <div class="admin-recruiter-name-row">

                        <strong>
                            ${row.name}
                        </strong>

                        <span class="student-app-count">
                            ${row.applicationCount}
                            ${
                                row.applicationCount === 1
                                    ? "application"
                                    : "applications"
                            }
                        </span>

                    </div>

                    <p class="admin-recruiter-sub">
                        ${row.email}
                    </p>

                    <p class="admin-recruiter-industry">
                        ${sub}
                    </p>

                </div>

            </div>


            <div class="admin-recruiter-actions">

                <button
                    type="button"
                    class="btn btn-danger"
                    onclick="handleDeleteStudent('${row.userId}')"
                >
                    Delete Account
                </button>

            </div>

        </div>
    `;

}


/* =========================================================
   DELETE
   ========================================================= */

function handleDeleteStudent(studentId) {

    const confirmed =
        confirm(
            "Delete this student account?\n\n" +
            "This will remove:\n" +
            "• the student account\n" +
            "• their profile\n" +
            "• all their applications\n" +
            "• all interviews for those applications\n\n" +
            "This cannot be undone."
        );

    if (!confirmed) {
        return;
    }


    /* 1. Remove the user */

    const users = getUsers();

    saveUsers(
        users.filter(u => u.id !== studentId)
    );


    /* 2. Remove their profile */

    const profiles = getStudentProfiles();

    delete profiles[studentId];

    saveStudentProfiles(profiles);


    /* 3. Find their applications */

    const applications = getApplications();

    const removedApplicationIds =
        applications
            .filter(a => a.studentId === studentId)
            .map(a => a.id);


    const remainingApplications =
        applications.filter(a => a.studentId !== studentId);

    saveApplications(remainingApplications);


    /* 4. Remove interviews for those applications */

    const interviews = getInterviews();

    const remainingInterviews =
        interviews.filter(i =>
            !removedApplicationIds.includes(i.applicationId)
        );

    saveInterviews(remainingInterviews);


    /* 5. Remove saved internships for that user */

    const savedMap = getSavedInternshipsMap();

    delete savedMap[studentId];

    saveSavedInternshipsMap(savedMap);


    /* 6. Refresh */

    allStudentRows = buildStudentRows();

    renderStudentList();

}