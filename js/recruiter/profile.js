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