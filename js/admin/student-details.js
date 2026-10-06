/* =========================================================
   ADMIN — STUDENT DETAILS
   ========================================================= */

if (!requireRole("admin")) {

    // Redirect handled by auth.js

} else {

    initializeAdminStudentDetails();

}


/* =========================================================
   INIT
   ========================================================= */

function initializeAdminStudentDetails() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }


    /* Sidebar */

    document.getElementById("adminName")
        .textContent = currentUser.name;


    const initial = document.getElementById("adminInitial");

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
            .filter(p => (p.verificationStatus || "unsubmitted") === "pending")
            .length;

    const badge = document.getElementById("pendingBadge");

    if (badge && pending > 0) {
        badge.textContent = pending;
    }


    /* Load target student */

    const params = new URLSearchParams(window.location.search);
    const studentId = params.get("id");

    if (!studentId) {
        showNotFound();
        return;
    }


    const users = getUsers();

    const user = users.find(
        u => u.id === studentId && u.role === "student"
    );

    if (!user) {
        showNotFound();
        return;
    }


    const profile = getStudentProfile(studentId) || {};

    renderStudentDetails(user, profile);

}


/* =========================================================
   RENDER
   ========================================================= */

function renderStudentDetails(user, profile) {

    const container = document.getElementById("studentDetails");

    if (!container) {
        return;
    }


    const applications =
        getApplications().filter(a => a.studentId === user.id);

    const internships = getInternships();


    /* Applications list */

    let applicationsHTML = "";

    if (applications.length === 0) {

        applicationsHTML = `
            <p class="admin-empty" style="padding:20px 0;">
                This student has not submitted any applications.
            </p>
        `;

    } else {

        applicationsHTML =
            applications
                .sort((a, b) =>
                    new Date(b.appliedDate || 0) -
                    new Date(a.appliedDate || 0)
                )
                .map(app => {

                    const internship =
                        internships.find(i => i.id === app.internshipId);

                    const title =
                        internship
                            ? internship.title
                            : "Unknown Internship";

                    const company =
                        internship
                            ? internship.company
                            : "—";

                    return `
                        <div class="application-list-row">
                            <div>
                                <strong>${title}</strong>
                                <p>${company}</p>
                            </div>
                            <span class="application-status status-${app.status}">
                                ${formatStatusLabel(app.status)}
                            </span>
                        </div>
                    `;

                })
                .join("");

    }


    container.innerHTML = `

        <!-- Header -->
        <div class="recruiter-details-header">

            <div class="recruiter-details-avatar admin-student-avatar">
                ${
                    (profile.name || user.name || "?").charAt(0).toUpperCase()
                }
            </div>

            <div class="recruiter-details-title">
                <h2>
                    ${profile.name || user.name || "Unknown Student"}
                </h2>
                <p>${user.email}</p>
                <span class="badge badge-verified">
                    ${applications.length}
                    ${applications.length === 1 ? "application" : "applications"}
                </span>
            </div>

        </div>


        <!-- Student Profile -->
        <div class="details-section-block">

            <h3>Student Profile</h3>

            <div class="admin-info-grid">
                ${infoRow("Full Name", profile.name || user.name)}
                ${infoRow("Email", user.email)}
                ${infoRow("Phone", profile.phone)}
                ${infoRow("University", profile.university)}
                ${infoRow("Major", profile.major)}
                ${infoRow("Year", profile.year)}
                ${infoRow("Roll No", profile.rollNo)}
                ${infoRow("NRC", profile.nrc)}
            </div>

        </div>


        <!-- Skills -->
        ${
            profile.skills
                ? `
                    <div class="details-section-block">
                        <h3>Skills</h3>
                        <div class="details-skills">
                            ${profile.skills
                                .split(",")
                                .map(s => `<span>${s.trim()}</span>`)
                                .join("")}
                        </div>
                    </div>
                `
                : ""
        }


        <!-- Bio -->
        ${
            profile.bio
                ? `
                    <div class="details-section-block">
                        <h3>Bio</h3>
                        <p class="details-body">${profile.bio}</p>
                    </div>
                `
                : ""
        }


        <!-- Applications -->
        <div class="details-section-block">
            <h3>Applications (${applications.length})</h3>
            <div class="admin-application-mini-list">
                ${applicationsHTML}
            </div>
        </div>


        <!-- Actions -->
        <div class="recruiter-details-actions">

            <button
                type="button"
                class="btn btn-danger"
                onclick="handleDeleteStudent('${user.id}')"
            >
                Delete Account
            </button>

        </div>

    `;

}


/* =========================================================
   HELPERS
   ========================================================= */

function infoRow(label, value) {

    return `
        <div class="admin-info-item">
            <span>${label}</span>
            <strong>
                ${value && String(value).trim() ? value : "—"}
            </strong>
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


function showNotFound() {

    const details = document.getElementById("studentDetails");
    const notFound = document.getElementById("studentNotFound");

    if (details) details.hidden = true;
    if (notFound) notFound.hidden = false;

}


/* =========================================================
   DELETE
   ========================================================= */

function handleDeleteStudent(studentId) {

    const confirmed = confirm(
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


    /* Users */

    saveUsers(getUsers().filter(u => u.id !== studentId));


    /* Profile */

    const profiles = getStudentProfiles();
    delete profiles[studentId];
    saveStudentProfiles(profiles);


    /* Applications */

    const applications = getApplications();

    const removedAppIds =
        applications
            .filter(a => a.studentId === studentId)
            .map(a => a.id);

    saveApplications(
        applications.filter(a => a.studentId !== studentId)
    );


    /* Interviews */

    const interviews = getInterviews();

    saveInterviews(
        interviews.filter(i => !removedAppIds.includes(i.applicationId))
    );


    /* Saved */

    const savedMap = getSavedInternshipsMap();
    delete savedMap[studentId];
    saveSavedInternshipsMap(savedMap);


    alert("Student account and all related data have been deleted.");

    window.location.href = "students.html";

}