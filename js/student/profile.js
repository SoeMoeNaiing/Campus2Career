/* =========================================================
   STUDENT PROFILE
   ========================================================= */

if (!requireRole("student")) {
    // Redirect already handled by auth.js
} else {

    initializeStudentProfile();

}


/* =========================================================
   INITIALIZE PROFILE
   ========================================================= */

function initializeStudentProfile() {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    const profile =
        createDefaultStudentProfile(
            currentUser
        );


    loadProfile(profile);


    const profileForm =
        document.getElementById(
            "profileForm"
        );


    profileForm.addEventListener(
        "submit",
        handleProfileSubmit
    );

}


/* =========================================================
   LOAD PROFILE
   ========================================================= */

function loadProfile(profile) {

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
            : "S";


    document.getElementById(
        "profileNameInput"
    ).value = profile.name;


    document.getElementById(
        "profileEmailInput"
    ).value = profile.email;


    document.getElementById(
        "phoneInput"
    ).value = profile.phone;


    document.getElementById(
        "universityInput"
    ).value = profile.university;


    document.getElementById(
        "majorInput"
    ).value = profile.major;


    document.getElementById(
        "yearInput"
    ).value = profile.year;


    document.getElementById(
        "skillsInput"
    ).value = profile.skills;


    document.getElementById(
        "bioInput"
    ).value = profile.bio;

}


/* =========================================================
   SAVE PROFILE
   ========================================================= */

function handleProfileSubmit(event) {

    event.preventDefault();


    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    const profileData = {

        name:
            document.getElementById(
                "profileNameInput"
            ).value.trim(),

        phone:
            document.getElementById(
                "phoneInput"
            ).value.trim(),

        university:
            document.getElementById(
                "universityInput"
            ).value.trim(),

        major:
            document.getElementById(
                "majorInput"
            ).value.trim(),

        year:
            document.getElementById(
                "yearInput"
            ).value,

        skills:
            document.getElementById(
                "skillsInput"
            ).value.trim(),

        bio:
            document.getElementById(
                "bioInput"
            ).value.trim()

    };


    const updatedProfile =
        updateStudentProfile(
            currentUser.id,
            profileData
        );
        updateCurrentUserName(
    profileData.name
);

    loadProfile(updatedProfile);


    const message =
        document.getElementById(
            "profileMessage"
        );


    message.textContent =
        "Profile updated successfully.";

    message.classList.add(
        "success"
    );


    setTimeout(() => {

        message.textContent = "";

        message.classList.remove(
            "success"
        );

    }, 3000);

}