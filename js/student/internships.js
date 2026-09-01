/* =========================================================
   CAMPUS2CAREER
   Student Internship Functions
   ========================================================= */


/* ================= PAGE PROTECTION ================= */

if (!requireRole("student")) {

    throw new Error("Unauthorized access.");

}


/* ================= INITIALIZE ================= */

initializeInternships();


/* ================= GET INTERNSHIP ID ================= */

const urlParams =
    new URLSearchParams(window.location.search);

const internshipId =
    urlParams.get("id");


/* ================= FIND INTERNSHIP ================= */

const internships =
    getInternships();

const internship =
    internships.find(
        item => item.id === internshipId
    );


/* ================= ELEMENTS ================= */

const detailsContainer =
    document.getElementById(
        "internshipDetails"
    );

const notFound =
    document.getElementById(
        "internshipNotFound"
    );


/* ================= RENDER ================= */

if (!internship) {

    if (detailsContainer) {
        detailsContainer.hidden = true;
    }

    if (notFound) {
        notFound.hidden = false;
    }

} else {

    renderInternshipDetails(internship);

}


/* =========================================================
   RENDER INTERNSHIP DETAILS
   ========================================================= */

function renderInternshipDetails(internship) {

    if (!detailsContainer) {
        return;
    }


    detailsContainer.innerHTML = `

        <div class="details-header">

            <div class="company-placeholder details-company-logo">
                ${internship.company.charAt(0)}
            </div>


            <div class="details-title">

                <span class="details-category">
                    ${internship.category}
                </span>

                <h1>
                    ${internship.title}
                </h1>

                <p class="details-company">
                    ${internship.company}
                </p>

            </div>

        </div>


        <div class="details-layout">


            <!-- ================= MAIN CONTENT ================= -->

            <div class="details-main">

                <section class="details-section">

                    <h2>
                        About this internship
                    </h2>

                    <p>
                        ${internship.description}
                    </p>

                </section>


                <section class="details-section">

                    <h2>
                        Required Skills
                    </h2>

                    <div class="details-skills">

                        ${internship.skills
                            .map(
                                skill =>
                                    `<span>${skill}</span>`
                            )
                            .join("")}

                    </div>

                </section>


                <section class="details-section">

                    <h2>
                        Internship Information
                    </h2>


                    <div class="details-info-grid">

                        <div class="details-info-item">

                            <span>
                                Location
                            </span>

                            <strong>
                                ${internship.location}
                            </strong>

                        </div>


                        <div class="details-info-item">

                            <span>
                                Type
                            </span>

                            <strong>
                                ${internship.type}
                            </strong>

                        </div>


                        <div class="details-info-item">

                            <span>
                                Duration
                            </span>

                            <strong>
                                ${internship.duration}
                            </strong>

                        </div>


                        <div class="details-info-item">

                            <span>
                                Posted
                            </span>

                            <strong>
                                ${formatDate(
                                    internship.postedAt
                                )}
                            </strong>

                        </div>

                    </div>

                </section>

            </div>


            <!-- ================= SIDEBAR ================= -->

            <aside class="details-sidebar">

                <div class="details-action-card">

                    <button
                        type="button"
                        class="btn btn-primary details-apply-btn"
                        onclick="handleApplyClick('${internship.id}')"
                    >
                        Apply Now
                    </button>


                    <button
                        type="button"
                        class="btn btn-outline details-save-btn"
                        onclick="handleSaveClick('${internship.id}')"
                    >
                        Save Internship
                    </button>

                </div>


                <div class="details-company-card">

                    <p>
                        Company
                    </p>

                    <h3>
                        ${internship.company}
                    </h3>

                    <span>
                        ${internship.location}
                    </span>

                </div>

            </aside>

        </div>

    `;
}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(dateString) {

    const date =
        new Date(dateString);

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
   APPLY
   ========================================================= */

function handleApplyClick(internshipId) {

    /*
        Application functionality will be implemented
        in the next iteration.
    */

    alert(
        "Application functionality will be available soon."
    );

}


/* =========================================================
   SAVE
   ========================================================= */

function handleSaveClick(internshipId) {

    /*
        Saved internship functionality will be implemented
        in a later iteration.
    */

    alert(
        "Save functionality will be available soon."
    );

}