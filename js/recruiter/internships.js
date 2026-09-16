if (!requireRole("recruiter")) {
    // Redirect already handled in auth.js
} else {

    if (
        document.getElementById(
            "recruiterInternshipList"
        )
    ) {
        initializeRecruiterInternships();
    }

    if (
        document.getElementById(
            "internshipForm"
        )
    ) {
        initializeCreateInternshipForm();
    }
}

function initializeRecruiterInternships() {

    initializeInternships();

    updateInternshipSeedData();

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    const recruiterInternships =
        getRecruiterInternships(
            currentUser.id
        );

    renderRecruiterInternships(
        recruiterInternships
    );

    updateInternshipSummary(
        recruiterInternships
    );
}


/* =========================================================
   GET RECRUITER INTERNSHIPS
   ========================================================= */

function getRecruiterInternships(recruiterId) {

    const internships = getInternships();

    return internships.filter(
        internship =>
            internship.recruiterId === recruiterId
    );
}


/* =========================================================
   RENDER INTERNSHIPS
   ========================================================= */

function renderRecruiterInternships(
    internships
) {

    const container =
        document.getElementById(
            "recruiterInternshipList"
        );

    const emptyState =
        document.getElementById(
            "noRecruiterInternships"
        );

    const listCount =
        document.getElementById(
            "internshipListCount"
        );


    listCount.textContent =
        `${internships.length} ${
            internships.length === 1
                ? "internship"
                : "internships"
        }`;


    if (internships.length === 0) {

        container.innerHTML = "";

        emptyState.hidden = false;

        return;
    }


    emptyState.hidden = true;


    container.innerHTML =
        internships
            .map(
                internship =>
                    createRecruiterInternshipCard(
                        internship
                    )
            )
            .join("");
}


/* =========================================================
   INTERNSHIP CARD
   ========================================================= */

function createRecruiterInternshipCard(
    internship
) {

    const statusClass =
        internship.status === "active"
            ? "status-active"
            : "status-closed";


    const statusText =
        internship.status === "active"
            ? "Active"
            : "Closed";


    return `
        <article class="internship-card">

            <div class="internship-card-header">

                <div class="company-placeholder">
                    ${internship.company.charAt(0)}
                </div>

                <span class="${statusClass}">
                    ${statusText}
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

                <button
                    type="button"
                    class="btn btn-outline"
                    disabled
                >
                    Close
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   SUMMARY
   ========================================================= */

function updateInternshipSummary(
    internships
) {

    const total =
        internships.length;


    const active =
        internships.filter(
            internship =>
                internship.status === "active"
        ).length;


    const closed =
        internships.filter(
            internship =>
                internship.status === "closed"
        ).length;


    document.getElementById(
        "internshipCount"
    ).textContent = total;


    document.getElementById(
        "activeInternshipCount"
    ).textContent = active;


    document.getElementById(
        "closedInternshipCount"
    ).textContent = closed;
}


function createRecruiterInternshipCard(
    internship
) {

    const statusClass =
        internship.status === "active"
            ? "status-active"
            : "status-closed";


    const statusText =
        internship.status === "active"
            ? "Active"
            : "Closed";


    const postedDate =
        internship.postedDate
            ? new Date(
                internship.postedDate
            ).toLocaleDateString()
            : "N/A";


    return `
        <article class="internship-card">

            <div class="internship-card-header">

                <div class="company-placeholder">
                    ${internship.company.charAt(0)}
                </div>

                <span class="${statusClass}">
                    ${statusText}
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

                    <span>
                        📅 Posted ${postedDate}
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

                <button
                    type="button"
                    class="btn btn-outline"
                    disabled
                >
                    Close
                </button>

            </div>

        </article>
    `;
}





function initializeCreateInternshipForm() {

    const form =
        document.getElementById(
            "internshipForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        handleCreateInternshipSubmit
    );
}


function handleCreateInternshipSubmit(event) {

    event.preventDefault();

    const title =
        document.getElementById(
            "titleInput"
        ).value.trim();

    const company =
        document.getElementById(
            "companyInput"
        ).value.trim();

    const location =
        document.getElementById(
            "locationInput"
        ).value.trim();

    const type =
        document.getElementById(
            "typeInput"
        ).value;

    const category =
        document.getElementById(
            "categoryInput"
        ).value.trim();

    const duration =
        document.getElementById(
            "durationInput"
        ).value.trim();

    const skills =
        document.getElementById(
            "skillsInput"
        ).value.trim();

    const description =
        document.getElementById(
            "descriptionInput"
        ).value.trim();

    const requirements =
        document.getElementById(
            "requirementsInput"
        ).value.trim();


    if (
        !title ||
        !company ||
        !location ||
        !type ||
        !category ||
        !duration ||
        !description ||
        !requirements
    ) {

        showInternshipFormMessage(
            "Please fill in all required fields.",
            "error"
        );

        return;
    }


    const internshipData = {

        title: title,

        company: company,

        location: location,

        type: type,

        category: category,

        duration: duration,

        skills: skills
            ? skills
                .split(",")
                .map(skill => skill.trim())
                .filter(Boolean)
            : [],

        description: description,

        requirements: requirements
    };


    const currentUser = getCurrentUser();

if (!currentUser) {
    return;
}


const newInternship = {

    id: crypto.randomUUID(),

    recruiterId: currentUser.id,

    title: internshipData.title,

    company: internshipData.company,

    location: internshipData.location,

    type: internshipData.type,

    category: internshipData.category,

    duration: internshipData.duration,

    skills: internshipData.skills,

    description: internshipData.description,

    requirements: internshipData.requirements,

    postedDate: new Date().toISOString(),

    status: "active"
};


addInternship(newInternship);


showInternshipFormMessage(
    "Internship posted successfully.",
    "success"
);

document.getElementById(
    "internshipForm"
).reset();


setTimeout(() => {

    window.location.href =
        "internships.html";

}, 1000);


    showInternshipFormMessage(
        "Form is valid.",
        "success"
    );
}


function showInternshipFormMessage(
    message,
    type
) {

    const messageElement =
        document.getElementById(
            "formMessage"
        );

    messageElement.textContent =
        message;

    messageElement.className =
        `profile-message ${type}`;
}


