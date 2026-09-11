/* =========================================================
   CAMPUS2CAREER
   Local Storage Layer
   ========================================================= */


/* ================= STORAGE KEYS ================= */

const STORAGE_KEYS = {
    USERS: "campus2career_users",
    CURRENT_USER: "campus2career_current_user"
};


/* ================= USERS ================= */

/**
 * Get all registered users.
 * Returns an empty array if no users exist.
 */
function getUsers() {

    const users = localStorage.getItem(STORAGE_KEYS.USERS);

    return users ? JSON.parse(users) : [];
}


/**
 * Save the complete users array.
 */
function saveUsers(users) {

    localStorage.setItem(
        STORAGE_KEYS.USERS,
        JSON.stringify(users)
    );
}


/**
 * Find a user by email.
 */
function findUserByEmail(email) {

    const users = getUsers();

    return users.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    ) || null;
}


/**
 * Create a new user.
 */
function createUser(userData) {

    const users = getUsers();

    const newUser = {
        id: crypto.randomUUID(),
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: userData.password,
        role: userData.role,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);

    saveUsers(users);

    return newUser;
}


/* ================= CURRENT USER ================= */

/**
 * Store the currently logged-in user.
 *
 * We don't need to store the password here.
 */
function setCurrentUser(user) {

    const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    localStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(sessionUser)
    );
}


/**
 * Get currently logged-in user.
 */
function getCurrentUser() {

    const user = localStorage.getItem(
        STORAGE_KEYS.CURRENT_USER
    );

    return user ? JSON.parse(user) : null;
}


/**
 * Remove current login session.
 */
function logoutUser() {

    localStorage.removeItem(
        STORAGE_KEYS.CURRENT_USER
    );
}


/**
 * Check whether someone is logged in.
 */
function isLoggedIn() {

    return getCurrentUser() !== null;
}



/* ================= INTERNSHIPS ================= */


/**
 * Get all internships.
 */
function getInternships() {

    const internships =
        localStorage.getItem("campus2career_internships");

    return internships
        ? JSON.parse(internships)
        : [];
}


/**
 * Save internships.
 */
function saveInternships(internships) {

    localStorage.setItem(
        "campus2career_internships",
        JSON.stringify(internships)
    );
}


/**
 * Initialize internship data.
 *
 * Only seed data if internships don't already exist.
 */
function initializeInternships() {

    const existingInternships =
        getInternships();

    if (existingInternships.length === 0) {

        saveInternships(seedInternships);

    }

}
function updateInternshipSeedData() {

    const internships = getInternships();

    if (internships.length === 0) {
        return;
    }

    const updatedInternships = internships.map(internship => {

        const seedInternship =
            seedInternships.find(
                seed => seed.id === internship.id
            );

        if (!seedInternship) {
            return internship;
        }

        return {
            ...internship,
            recruiterId: seedInternship.recruiterId,
            status: seedInternship.status
        };
    });

    saveInternships(updatedInternships);
}



/* =========================================================
   SAVED INTERNSHIPS
   ========================================================= */

function getSavedInternships() {

    const saved = localStorage.getItem(
        "campus2career_saved_internships"
    );

    return saved ? JSON.parse(saved) : [];
}


function saveSavedInternships(savedInternships) {

    localStorage.setItem(
        "campus2career_saved_internships",
        JSON.stringify(savedInternships)
    );

}


function isInternshipSaved(internshipId) {

    const savedInternships = getSavedInternships();

    return savedInternships.includes(internshipId);

}


function toggleSavedInternship(internshipId) {

    let savedInternships = getSavedInternships();


    if (savedInternships.includes(internshipId)) {

        savedInternships =
            savedInternships.filter(
                id => id !== internshipId
            );

    } else {

        savedInternships.push(internshipId);

    }


    saveSavedInternships(savedInternships);

    return savedInternships.includes(internshipId);

}


/* =========================================================
   APPLICATIONS
   ========================================================= */

function getApplications() {

    const applications = localStorage.getItem(
        "campus2career_applications"
    );

    return applications
        ? JSON.parse(applications)
        : [];
}


function saveApplications(applications) {

    localStorage.setItem(
        "campus2career_applications",
        JSON.stringify(applications)
    );

}


function createApplication(internshipId, studentId) {

    const applications = getApplications();


    // Prevent duplicate applications
    const alreadyApplied = applications.some(
        application =>
            application.internshipId === internshipId &&
            application.studentId === studentId
    );


    if (alreadyApplied) {

        return {
            success: false,
            message: "You have already applied for this internship."
        };

    }


    const application = {

        id: "APP" + Date.now(),

        internshipId: internshipId,

        studentId: studentId,

        status: "pending",

        appliedDate: new Date().toISOString()

    };


    applications.push(application);

    saveApplications(applications);


    return {
        success: true,
        message: "Application submitted successfully."
    };

}


function getStudentApplications(studentId) {

    return getApplications().filter(
        application =>
            application.studentId === studentId
    );

}


function hasApplied(internshipId, studentId) {

    return getApplications().some(
        application =>
            application.internshipId === internshipId &&
            application.studentId === studentId
    );

}


/* =========================================================
   STUDENT PROFILES
   ========================================================= */

function getStudentProfiles() {

    const profiles = localStorage.getItem(
        "campus2career_student_profiles"
    );

    return profiles
        ? JSON.parse(profiles)
        : {};
}


function saveStudentProfiles(profiles) {

    localStorage.setItem(
        "campus2career_student_profiles",
        JSON.stringify(profiles)
    );

}


function getStudentProfile(studentId) {

    const profiles = getStudentProfiles();

    return profiles[studentId] || null;

}


function createDefaultStudentProfile(user) {

    const profiles = getStudentProfiles();


    if (profiles[user.id]) {
        return profiles[user.id];
    }


    const profile = {

        studentId: user.id,

        name: user.name || "",

        email: user.email || "",

        phone: "",

        university: "",

        major: "",

        year: "",

        skills: "",

        bio: ""

    };


    profiles[user.id] = profile;

    saveStudentProfiles(profiles);


    return profile;

}


function updateStudentProfile(
    studentId,
    profileData
) {

    const profiles = getStudentProfiles();


    profiles[studentId] = {

        ...profiles[studentId],

        ...profileData,

        studentId: studentId

    };


    saveStudentProfiles(profiles);


    return profiles[studentId];

}