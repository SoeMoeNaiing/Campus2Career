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