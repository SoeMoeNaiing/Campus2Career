if (!requireRole("recruiter")) {
    // Redirect already handled by auth.js
} else {
    initializeRecruiterProfile();
}


function initializeRecruiterProfile() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

        const profile =
        createDefaultRecruiterProfile(currentUser);

    loadRecruiterProfile(profile);

    renderVerificationSection(profile);

    const profileForm =
        document.getElementById("profileForm");

    profileForm.addEventListener(
        "submit",
        handleRecruiterProfileSubmit
    );
}


function loadRecruiterProfile(profile) {

    document.getElementById(
        "profileName"
    ).textContent = profile.name;

    document.getElementById(
        "profileEmail"
    ).textContent = profile.email;

    document.getElementById(
        "profileInitial"
    ).textContent =
        profile.name
            ? profile.name.charAt(0).toUpperCase()
            : "R";


    document.getElementById(
        "profileNameInput"
    ).value = profile.name;

    document.getElementById(
        "profileEmailInput"
    ).value = profile.email;

    document.getElementById(
        "companyNameInput"
    ).value = profile.companyName;

    document.getElementById(
        "phoneInput"
    ).value = profile.phone;

    document.getElementById(
        "addressInput"
    ).value = profile.address;

    document.getElementById(
        "industryInput"
    ).value = profile.industry;

    document.getElementById(
        "websiteInput"
    ).value = profile.website;

    document.getElementById(
        "descriptionInput"
    ).value = profile.description;
}



function handleRecruiterProfileSubmit(event) {

    event.preventDefault();

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    const profileData = {

        name:
            document.getElementById(
                "profileNameInput"
            ).value.trim(),

        companyName:
            document.getElementById(
                "companyNameInput"
            ).value.trim(),

        phone:
            document.getElementById(
                "phoneInput"
            ).value.trim(),

        address:
            document.getElementById(
                "addressInput"
            ).value.trim(),

        industry:
            document.getElementById(
                "industryInput"
            ).value.trim(),

        website:
            document.getElementById(
                "websiteInput"
            ).value.trim(),

        description:
            document.getElementById(
                "descriptionInput"
            ).value.trim()
    };


   const updatedProfile =
    updateRecruiterProfile(
        currentUser.id,
        profileData
    );

updateCurrentUserName(
    profileData.name
);

    loadRecruiterProfile(updatedProfile);

    renderVerificationSection(updatedProfile);

    const message =
        document.getElementById(
            "profileMessage"
        );

    message.textContent =
        "Profile updated successfully.";

    message.classList.add("success");


    setTimeout(() => {

        message.textContent = "";

        message.classList.remove("success");

    }, 3000);
}


/* =========================================================
   VERIFICATION
   ========================================================= */

function renderVerificationSection(profile) {

    const container =
        document.getElementById(
            "verificationSection"
        );

    if (!container) {
        return;
    }


    const status =
        profile.verificationStatus ||
        "unsubmitted";


    let badgeHTML = "";
    let bodyHTML = "";


    /* ---------- Unsubmitted ---------- */

    if (status === "unsubmitted") {

        badgeHTML = `
            <span class="verification-badge badge-unsubmitted">
                Not Verified
            </span>
        `;

        bodyHTML = `
            <p>
                Your account is not verified yet.
                You cannot post internships until an
                admin verifies your profile.
            </p>

            <p>
                Please fill in your company details above,
                save, then apply for verification.
            </p>

            <button
                type="button"
                class="btn btn-primary"
                onclick="handleApplyForVerification()"
            >
                Apply for Verification
            </button>
        `;

    }


    /* ---------- Pending ---------- */

    if (status === "pending") {

        badgeHTML = `
            <span class="verification-badge badge-pending">
                Pending Review
            </span>
        `;

        bodyHTML = `
            <p>
                Your verification request has been submitted.
            </p>

            <p>
                An admin will review your profile soon.
                You cannot post internships until you are
                verified.
            </p>

            ${
                profile.verificationRequestedAt
                    ? `
                        <p class="verification-hint">
                            Submitted:
                            ${new Date(
                                profile.verificationRequestedAt
                            ).toLocaleString()}
                        </p>
                    `
                    : ""
            }
        `;

    }


    /* ---------- Verified ---------- */

    if (status === "verified") {

        badgeHTML = `
            <span class="verification-badge badge-verified">
                ✓ Verified
            </span>
        `;

        bodyHTML = `
            <p>
                Your account is verified. You can post
                internships and manage applications.
            </p>

            ${
                profile.verifiedAt
                    ? `
                        <p class="verification-hint">
                            Verified on:
                            ${new Date(
                                profile.verifiedAt
                            ).toLocaleDateString()}
                        </p>
                    `
                    : ""
            }
        `;

    }


    /* ---------- Rejected ---------- */

    if (status === "rejected") {

        badgeHTML = `
            <span class="verification-badge badge-rejected">
                ✕ Rejected
            </span>
        `;

        bodyHTML = `
            <p>
                Your verification request was rejected.
            </p>

            ${
                profile.rejectionReason
                    ? `
                        <p class="verification-hint">
                            <strong>Reason:</strong>
                            ${profile.rejectionReason}
                        </p>
                    `
                    : ""
            }

            <p>
                You can update your profile and re-apply.
            </p>

            <button
                type="button"
                class="btn btn-primary"
                onclick="handleApplyForVerification()"
            >
                Re-apply for Verification
            </button>
        `;

    }


    container.innerHTML = `

        <div class="section-heading">

            <h2>
                Verification
            </h2>

            ${badgeHTML}

        </div>


        <div class="verification-body">

            ${bodyHTML}

        </div>

    `;

}


function handleApplyForVerification() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }


    const profile =
        getRecruiterProfile(currentUser.id);

    if (!profile) {
        return;
    }


    /* Required fields for verification */

    const requiredFields = [
        "name",
        "companyName",
        "phone",
        "address",
        "industry"
    ];


    const missing =
        requiredFields.filter(
            field =>
                !profile[field] ||
                String(profile[field]).trim() === ""
        );


    if (missing.length > 0) {

        const pretty = missing
            .map(field => {

                if (field === "name") return "Full Name";
                if (field === "companyName") return "Company Name";
                if (field === "phone") return "Phone";
                if (field === "address") return "Company Address";
                if (field === "industry") return "Industry";

                return field;

            })
            .join(", ");


        alert(
            "Please complete the following before applying:\n\n" +
            pretty
        );

        return;

    }


    const confirmed =
        confirm(
            "Submit your profile for verification?"
        );


    if (!confirmed) {
        return;
    }


    const updated =
        updateRecruiterVerification(
            currentUser.id,
            "pending"
        );


    if (updated) {

        renderVerificationSection(updated);

    }

}