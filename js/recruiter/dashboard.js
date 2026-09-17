if (!requireRole("recruiter")) {
    // Redirect already handled by auth.js
} else {
    initializeRecruiterDashboard();
}
/* =========================================================
   VERIFICATION CHECK
   ========================================================= */

function isCurrentRecruiterVerified() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return false;
    }


    const profile =
        getRecruiterProfile(currentUser.id);

    if (!profile) {
        return false;
    }


    return profile.verificationStatus === "verified";

}

function initializeRecruiterDashboard() {

   initializeInternships();
updateInternshipSeedData();
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    // Display recruiter name
       // Display recruiter name
       // Display recruiter name
    document.getElementById("recruiterName").textContent =
        currentUser.name;

    calculateRecruiterStats(currentUser.id);

    renderRecentInternships(currentUser.id);

    renderQuickActions();
}


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

function renderQuickActions() {

    const container =
        document.querySelector(
            ".dashboard-section .quick-actions"
        );

    if (!container) {
        return;
    }


    const verified =
        isCurrentRecruiterVerified();


    if (!verified) {

        const profile =
            getRecruiterProfile(
                getCurrentUser().id
            );

        const status =
            profile
                ? (profile.verificationStatus || "unsubmitted")
                : "unsubmitted";


        let note = "";

        if (status === "pending") {

            note = "Your verification request is being reviewed by an admin.";

        } else if (status === "rejected") {

            note = "Your verification was rejected. Update your profile and re-apply.";

        } else {

            note = "Complete your company profile and apply for verification to start posting internships.";

        }


        container.innerHTML = `

            <a
                href="profile.html"
                class="quick-action-card verification-cta"
            >
                <h3>Get Verified</h3>
                <p>${note}</p>
            </a>


            <a
                href="applications.html"
                class="quick-action-card"
            >
                <h3>View Applications</h3>
                <p>
                    Review student applications.
                </p>
            </a>

        `;

        return;
    }


    /* Verified recruiter — same Quick Actions as before */

    container.innerHTML = `

        <a
            href="create-internship.html"
            class="quick-action-card"
        >
            <h3>Post Internship</h3>
            <p>
                Create a new internship opportunity.
            </p>
        </a>


        <a
            href="internships.html"
            class="quick-action-card"
        >
            <h3>My Internships</h3>
            <p>
                View and manage your internships.
            </p>
        </a>


        <a
            href="applications.html"
            class="quick-action-card"
        >
            <h3>View Applications</h3>
            <p>
                Review student applications.
            </p>
        </a>

    `;

}


function calculateRecruiterStats(recruiterId) {

    const internships = getInternships();

    const recruiterInternships =
        internships.filter(
            internship =>
                internship.recruiterId === recruiterId
        );

    const internshipCount =
        recruiterInternships.length;

    const activeInternshipCount =
        recruiterInternships.filter(
            internship =>
                internship.status === "active"
        ).length;

    const applications =
        getApplications();

    const recruiterInternshipIds =
        recruiterInternships.map(
            internship => internship.id
        );

    const recruiterApplications =
        applications.filter(
            application =>
                recruiterInternshipIds.includes(
                    application.internshipId
                )
        );

    const applicationCount =
        recruiterApplications.length;

    const pendingCount =
        recruiterApplications.filter(
            application =>
                application.status === "pending"
        ).length;


    document.getElementById(
        "internshipCount"
    ).textContent = internshipCount;

    document.getElementById(
        "activeInternshipCount"
    ).textContent = activeInternshipCount;

    document.getElementById(
        "applicationCount"
    ).textContent = applicationCount;

    document.getElementById(
        "pendingCount"
    ).textContent = pendingCount;
}


function renderRecentInternships(recruiterId) {

    const internships = getInternships();

    const recruiterInternships =
        internships.filter(
            internship =>
                internship.recruiterId === recruiterId
        );


    const recentInternships =
        recruiterInternships
            .sort(
                (a, b) =>
                    new Date(b.postedDate) -
                    new Date(a.postedDate)
            )
            .slice(0, 3);


    const container =
        document.getElementById(
            "recentInternships"
        );

    const emptyState =
        document.getElementById(
            "noInternships"
        );


       if (recentInternships.length === 0) {

        container.innerHTML = "";

        emptyState.style.display = "block";


        // Adjust the CTA based on verification status.
        const cta =
            emptyState.querySelector("a.btn");

        if (cta) {

            if (isCurrentRecruiterVerified()) {

                cta.href = "create-internship.html";

                cta.textContent =
                    "Post Your First Internship";

            } else {

                cta.href = "profile.html";

                cta.textContent =
                    "Get Verified to Post";

            }

        }


        return;
    }


    emptyState.style.display = "none";

    container.innerHTML =
        recentInternships
            .map(
                internship =>
                    createRecruiterInternshipCard(
                        internship
                    )
            )
            .join("");
}


function createRecruiterInternshipCard(internship) {

    return `
        <article class="internship-card">

            <div class="internship-card-header">

                <div class="company-placeholder">
                    ${internship.company.charAt(0)}
                </div>

                <span class="internship-type">
                    ${internship.type}
                </span>

            </div>


            <div class="internship-card-body">

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
                        🗓 ${internship.duration}
                    </span>

                </div>

            </div>


            <div class="internship-card-footer">

                <a
                    href="edit-internship.html?id=${internship.id}"
                    class="btn btn-outline"
                >
                    Edit
                </a>

            </div>

        </article>
    `;
}