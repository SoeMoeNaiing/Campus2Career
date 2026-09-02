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


/* =========================================================
   INTERNSHIP LISTING
   ========================================================= */

const internshipList =
    document.getElementById("internshipList");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const locationFilter =
    document.getElementById("locationFilter");

const typeFilter =
    document.getElementById("typeFilter");

const resultsCount =
    document.getElementById("resultsCount");

const noResults =
    document.getElementById("noResults");


/* ================= INITIALIZE LISTING ================= */

if (internshipList) {

    initializeInternshipListing();

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeInternshipListing() {

    const internships =
        getInternships()
            .filter(
                internship =>
                    internship.status === "active"
            );


    populateFilters(internships);

    renderInternshipList(internships);


    searchInput.addEventListener(
        "input",
        applyFilters
    );


    categoryFilter.addEventListener(
        "change",
        applyFilters
    );


    locationFilter.addEventListener(
        "change",
        applyFilters
    );


    typeFilter.addEventListener(
        "change",
        applyFilters
    );

}


/* =========================================================
   FILTER OPTIONS
   ========================================================= */

function populateFilters(internships) {

    const categories =
        [...new Set(
            internships.map(
                internship => internship.category
            )
        )];


    const locations =
        [...new Set(
            internships.map(
                internship => internship.location
            )
        )];


    const types =
        [...new Set(
            internships.map(
                internship => internship.type
            )
        )];


    categories.forEach(category => {

        categoryFilter.innerHTML += `
            <option value="${category}">
                ${category}
            </option>
        `;

    });


    locations.forEach(location => {

        locationFilter.innerHTML += `
            <option value="${location}">
                ${location}
            </option>
        `;

    });


    types.forEach(type => {

        typeFilter.innerHTML += `
            <option value="${type}">
                ${type}
            </option>
        `;

    });

}


/* =========================================================
   APPLY FILTERS
   ========================================================= */

function applyFilters() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedCategory =
        categoryFilter.value;


    const selectedLocation =
        locationFilter.value;


    const selectedType =
        typeFilter.value;


    const internships =
        getInternships()
            .filter(
                internship =>
                    internship.status === "active"
            );


    const filtered =
        internships.filter(internship => {

            const matchesSearch =
                internship.title
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                internship.company
                    .toLowerCase()
                    .includes(searchTerm);


            const matchesCategory =
                selectedCategory === "all"
                ||
                internship.category ===
                    selectedCategory;


            const matchesLocation =
                selectedLocation === "all"
                ||
                internship.location ===
                    selectedLocation;


            const matchesType =
                selectedType === "all"
                ||
                internship.type ===
                    selectedType;


            return (
                matchesSearch
                &&
                matchesCategory
                &&
                matchesLocation
                &&
                matchesType
            );

        });


    renderInternshipList(filtered);

}


/* =========================================================
   RENDER LIST
   ========================================================= */

function renderInternshipList(internships) {

    if (!internshipList) {
        return;
    }


    resultsCount.textContent =
        `${internships.length} ${
            internships.length === 1
                ? "internship"
                : "internships"
        }`;


    if (internships.length === 0) {

        internshipList.innerHTML = "";

        noResults.hidden = false;

        return;
    }


    noResults.hidden = true;


    internshipList.innerHTML =
        internships
            .map(createListingCard)
            .join("");

}


/* =========================================================
   LISTING CARD
   ========================================================= */

function createListingCard(internship) {

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
                        ⏱ ${internship.duration}
                    </span>

                </div>


                <div class="internship-skills">

                    ${internship.skills
                        .slice(0, 4)
                        .map(
                            skill =>
                                `<span>${skill}</span>`
                        )
                        .join("")}

                </div>

            </div>


            <div class="internship-card-footer">

                <a
                    href="internship-details.html?id=${internship.id}"
                    class="btn btn-outline"
                >
                    View Details
                </a>

            </div>

        </article>
    `;

}