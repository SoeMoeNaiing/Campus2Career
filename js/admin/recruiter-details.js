/* =========================================================
   ADMIN — RECRUITER DETAILS
   ========================================================= */

if (!requireRole("admin")) {

    // Redirect handled by auth.js

} else {

    initializeAdminRecruiterDetails();

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeAdminRecruiterDetails() {

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

    updatePendingBadgeOnDetails();


    /* Load target recruiter */

    const params =
        new URLSearchParams(window.location.search);

    const recruiterId = params.get("id");


    if (!recruiterId) {
        showNotFound();
        return;
    }


    const users = getUsers();

    const user = users.find(
        u => u.id === recruiterId && u.role === "recruiter"
    );


    if (!user) {
        showNotFound();
        return;
    }


    const profile =
        getRecruiterProfile(recruiterId) || {};

    renderRecruiterDetails(user, profile);

}


/* =========================================================
   SIDEBAR BADGE
   ========================================================= */

function updatePendingBadgeOnDetails() {

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

}


/* =========================================================
   RENDER
   ========================================================= */

function renderRecruiterDetails(user, profile) {

    const container =
        document.getElementById("recruiterDetails");

    if (!container) {
        return;
    }


    const status =
        profile.verificationStatus || "unsubmitted";


    const badge = createStatusBadge(status);


    /* Extra info blocks that vary by status */

    let verificationInfo = "";


    if (status === "pending" && profile.verificationRequestedAt) {

        verificationInfo = `
            <p class="detail-note">
                Submitted for review on
                ${new Date(
                    profile.verificationRequestedAt
                ).toLocaleString()}
            </p>
        `;

    }


    if (status === "verified" && profile.verifiedAt) {

        verificationInfo = `
            <p class="detail-note detail-note-success">
                Verified on
                ${new Date(
                    profile.verifiedAt
                ).toLocaleDateString()}
            </p>
        `;

    }


    if (status === "rejected") {

        verificationInfo = `
            <p class="detail-note detail-note-danger">
                Reason:
                ${
                    profile.rejectionReason
                        ? profile.rejectionReason
                        : "No reason recorded"
                }
            </p>
        `;

    }
        if (status === "unsubmitted") {

        verificationInfo = `
            <p class="detail-note">
                This recruiter has not yet applied for verification.
                They cannot post internships until they submit a
                verification request from their profile page.
            </p>
        `;

    }


    container.innerHTML = `

        <!-- Header -->
        <div class="recruiter-details-header">

            <div class="recruiter-details-avatar">
                ${
                    (profile.companyName || user.name || "?")
                        .charAt(0)
                        .toUpperCase()
                }
            </div>

            <div class="recruiter-details-title">
                <h2>
                    ${profile.companyName || "(Company not set)"}
                </h2>

                <p>
                    ${user.name} · ${user.email}
                </p>

                ${badge}
            </div>

        </div>


        ${verificationInfo}


        <!-- Company Info -->
        <div class="details-section-block">

            <h3>Company Information</h3>

            <div class="admin-info-grid">

                ${infoRow("Company Name", profile.companyName)}
                ${infoRow("Industry", profile.industry)}
                ${infoRow("Website", profile.website)}
                ${infoRow("Company Address", profile.address)}
                ${infoRow("Phone", profile.phone)}
                ${infoRow("Email", user.email)}

            </div>

        </div>


        <!-- Description -->
        ${
            profile.description
                ? `
                    <div class="details-section-block">

                        <h3>About the Company</h3>

                        <p class="details-body">
                            ${profile.description}
                        </p>

                    </div>
                `
                : ""
        }


        <!-- Actions -->
        <div class="recruiter-details-actions">

            ${renderActions(status, user.id)}

        </div>

    `;

}


function infoRow(label, value) {

    return `
        <div class="admin-info-item">

            <span>${label}</span>

            <strong>
                ${value && value.trim()
                    ? value
                    : "—"
                }
            </strong>

        </div>
    `;

}


function createStatusBadge(status) {

    const labels = {
        verified: "Verified",
        pending: "Pending Review",
        rejected: "Rejected",
        unsubmitted: "Not Submitted"
    };


    return `
        <span class="verification-badge badge-${status}">
            ${labels[status] || status}
        </span>
    `;

}


/* =========================================================
   ACTIONS
   ========================================================= */

function renderActions(status, recruiterId) {

    const buttons = [];


    /* ---------- Pending ---------- */

    if (status === "pending") {

        buttons.push(`
            <button
                type="button"
                class="btn btn-primary"
                onclick="handleApprove('${recruiterId}')"
            >
                Approve Verification
            </button>
        `);


        buttons.push(`
            <button
                type="button"
                class="btn btn-outline"
                onclick="handleReject('${recruiterId}')"
            >
                Reject
            </button>
        `);

    }


    /* ---------- Verified ---------- */

    if (status === "verified") {

        buttons.push(`
            <button
                type="button"
                class="btn btn-outline"
                onclick="handleUnverify('${recruiterId}')"
            >
                Unverify
            </button>
        `);

    }


    /* ---------- Delete (always) ---------- */

    buttons.push(`
        <button
            type="button"
            class="btn btn-danger"
            onclick="handleDeleteRecruiter('${recruiterId}')"
        >
            Delete Account
        </button>
    `);


    return buttons.join("");

}

/* =========================================================
   HANDLERS
   ========================================================= */

function handleApprove(recruiterId) {

    const confirmed =
        confirm(
            "Approve this recruiter's verification?"
        );

    if (!confirmed) {
        return;
    }


    updateRecruiterVerification(
        recruiterId,
        "verified"
    );


    initializeAdminRecruiterDetails();

}


function handleReject(recruiterId) {

    const reason =
        prompt(
            "Reason for rejection (optional):"
        );


    /* If the admin cancelled the prompt, reason is null */

    if (reason === null) {
        return;
    }


    updateRecruiterVerification(
        recruiterId,
        "rejected",
        reason.trim()
    );


    initializeAdminRecruiterDetails();

}


function handleUnverify(recruiterId) {

    const confirmed =
        confirm(
            "Unverify this recruiter? " +
            "They will no longer be able to post internships " +
            "and existing posts will be hidden from students."
        );

    if (!confirmed) {
        return;
    }


    updateRecruiterVerification(
        recruiterId,
        "unsubmitted"
    );


    initializeAdminRecruiterDetails();

}


function handleDeleteRecruiter(recruiterId) {

    const confirmed =
        confirm(
            "Delete this recruiter account?\n\n" +
            "This will remove:\n" +
            "• the recruiter account\n" +
            "• all their internships\n" +
            "• all applications to those internships\n" +
            "• all interviews for those applications\n\n" +
            "This cannot be undone."
        );

    if (!confirmed) {
        return;
    }


    /* 1. Remove the user */

    const users = getUsers();

    const filteredUsers =
        users.filter(u => u.id !== recruiterId);

    saveUsers(filteredUsers);


    /* 2. Remove their profile */

    const profiles = getRecruiterProfiles();

    delete profiles[recruiterId];

    saveRecruiterProfiles(profiles);


    /* 3. Find their internships */

    const internships = getInternships();

    const removedInternshipIds =
        internships
            .filter(i => i.recruiterId === recruiterId)
            .map(i => i.id);


    const remainingInternships =
        internships.filter(i => i.recruiterId !== recruiterId);

    saveInternships(remainingInternships);


    /* 4. Remove applications to those internships */

    const applications = getApplications();

    const removedApplicationIds =
        applications
            .filter(a =>
                removedInternshipIds.includes(a.internshipId)
            )
            .map(a => a.id);


    const remainingApplications =
        applications.filter(a =>
            !removedInternshipIds.includes(a.internshipId)
        );

    saveApplications(remainingApplications);


    /* 5. Remove interviews for those applications */

    const interviews = getInterviews();

    const remainingInterviews =
        interviews.filter(i =>
            !removedApplicationIds.includes(i.applicationId)
        );

    saveInterviews(remainingInterviews);


    /* 6. Back to the list */

    toast.success("Recruiter account and all related data have been deleted."
    );

    window.location.href = "recruiters.html";

}


/* =========================================================
   NOT FOUND
   ========================================================= */

function showNotFound() {

    const details =
        document.getElementById("recruiterDetails");

    const notFound =
        document.getElementById("recruiterNotFound");

    if (details) {
        details.hidden = true;
    }

    if (notFound) {
        notFound.hidden = false;
    }

}