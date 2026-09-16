if (!requireRole("recruiter")) {
    // Redirect already handled by auth.js
} else {
    initializeRecruiterDashboard();
}


function initializeRecruiterDashboard() {

   initializeInternships();
updateInternshipSeedData();
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    // Display recruiter name
    document.getElementById("recruiterName").textContent =
        currentUser.name;

    calculateRecruiterStats(currentUser.id);

    renderRecentInternships(currentUser.id);
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