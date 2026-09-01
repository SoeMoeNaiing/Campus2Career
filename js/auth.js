/* =========================================================
   CAMPUS2CAREER
   Authentication
   ========================================================= */


/* ================= REGISTER ================= */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        handleRegister
    );

}


/**
 * Handle registration form submission.
 */
function handleRegister(event) {

    event.preventDefault();


    clearRegisterErrors();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    const role =
        document.querySelector(
            'input[name="role"]:checked'
        )?.value;


    let isValid = true;


    /* ---------- NAME ---------- */

    if (!name) {

        showError(
            "name",
            "nameError",
            "Please enter your name."
        );

        isValid = false;

    } else if (name.length < 2) {

        showError(
            "name",
            "nameError",
            "Name must contain at least 2 characters."
        );

        isValid = false;
    }


    /* ---------- EMAIL ---------- */

    if (!email) {

        showError(
            "email",
            "emailError",
            "Please enter your email."
        );

        isValid = false;

    } else if (!isValidEmail(email)) {

        showError(
            "email",
            "emailError",
            "Please enter a valid email address."
        );

        isValid = false;

    } else if (findUserByEmail(email)) {

        showError(
            "email",
            "emailError",
            "An account with this email already exists."
        );

        isValid = false;
    }


    /* ---------- PASSWORD ---------- */

    if (!password) {

        showError(
            "password",
            "passwordError",
            "Please enter a password."
        );

        isValid = false;

    } else if (password.length < 6) {

        showError(
            "password",
            "passwordError",
            "Password must contain at least 6 characters."
        );

        isValid = false;
    }


    /* ---------- CONFIRM PASSWORD ---------- */

    if (!confirmPassword) {

        showError(
            "confirmPassword",
            "confirmPasswordError",
            "Please confirm your password."
        );

        isValid = false;

    } else if (password !== confirmPassword) {

        showError(
            "confirmPassword",
            "confirmPasswordError",
            "Passwords do not match."
        );

        isValid = false;
    }


    /* ---------- ROLE ---------- */

    if (!role) {

        document.getElementById("roleError")
            .textContent =
            "Please select an account type.";

        isValid = false;
    }


    /* ---------- STOP IF INVALID ---------- */

    if (!isValid) {
        return;
    }


    /* ---------- CREATE USER ---------- */

    const newUser = createUser({
        name,
        email,
        password,
        role
    });


    /* ---------- LOGIN USER ---------- */

    setCurrentUser(newUser);


    /* ---------- REDIRECT ---------- */

    redirectAfterLogin(newUser.role);

}


/* ================= VALIDATION ================= */


/**
 * Validate email format.
 */
function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


/**
 * Display a field error.
 */
function showError(
    inputId,
    errorId,
    message
) {

    const input =
        document.getElementById(inputId);

    const error =
        document.getElementById(errorId);


    if (input) {
        input.classList.add("input-error");
    }

    if (error) {
        error.textContent = message;
    }

}


/**
 * Clear registration errors.
 */
function clearRegisterErrors() {

    document
        .querySelectorAll(".form-error")
        .forEach((error) => {

            error.textContent = "";

        });


    document
        .querySelectorAll(".input-error")
        .forEach((input) => {

            input.classList.remove("input-error");

        });


    const message =
        document.getElementById("registerMessage");


    if (message) {
        message.textContent = "";
    }

}


/* ================= REDIRECTION ================= */


/**
 * Redirect user according to their role.
 */
function redirectAfterLogin(role) {

    if (role === "student") {

        window.location.href =
            "../student/dashboard.html";

        return;

    }


    if (role === "recruiter") {

        window.location.href =
            "../recruiter/dashboard.html";

        return;

    }

}



/* =========================================================
   LOGIN
   ========================================================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        handleLogin
    );

}


/**
 * Handle login form submission.
 */
function handleLogin(event) {

    event.preventDefault();

    clearLoginErrors();


    const email =
        document.getElementById("email")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value;


    let isValid = true;


    /* ================= EMAIL ================= */

    if (!email) {

        showError(
            "email",
            "emailError",
            "Please enter your email."
        );

        isValid = false;

    } else if (!isValidEmail(email)) {

        showError(
            "email",
            "emailError",
            "Please enter a valid email address."
        );

        isValid = false;
    }


    /* ================= PASSWORD ================= */

    if (!password) {

        showError(
            "password",
            "passwordError",
            "Please enter your password."
        );

        isValid = false;
    }


    /* ================= STOP ================= */

    if (!isValid) {
        return;
    }


    /* ================= FIND USER ================= */

    const user =
        findUserByEmail(email);


    if (!user) {

        showLoginMessage(
            "Invalid email or password."
        );

        return;
    }


    /* ================= VERIFY PASSWORD ================= */

    if (user.password !== password) {

        showLoginMessage(
            "Invalid email or password."
        );

        return;
    }


    /* ================= LOGIN ================= */

    setCurrentUser(user);


    /* ================= REDIRECT ================= */

    redirectAfterLogin(user.role);

}

/* =========================================================
   LOGIN HELPERS
   ========================================================= */


/**
 * Clear login errors.
 */
function clearLoginErrors() {

    document
        .querySelectorAll(".form-error")
        .forEach((error) => {

            error.textContent = "";

        });


    document
        .querySelectorAll(".input-error")
        .forEach((input) => {

            input.classList.remove("input-error");

        });


    const message =
        document.getElementById("loginMessage");


    if (message) {

        message.textContent = "";

    }

}


/**
 * Display a general login error.
 */
function showLoginMessage(message) {

    const loginMessage =
        document.getElementById("loginMessage");


    if (loginMessage) {

        loginMessage.textContent = message;

    }

}

/* =========================================================
   SESSION MANAGEMENT
   ========================================================= */


/**
 * Logout the current user.
 */
function logout() {

    logoutUser();

    window.location.href =
        "../../index.html";
}


/**
 * Protect a page from unauthenticated users.
 */
function requireLogin() {

    if (!isLoggedIn()) {

        window.location.href =
            "../auth/login.html";

        return false;
    }

    return true;
}


/**
 * Get the current user's role.
 */
function requireRole(role) {

    const currentUser = getCurrentUser();

    if (!currentUser) {

        window.location.href =
            "../auth/login.html";

        return false;
    }


    if (currentUser.role !== role) {

        redirectAfterLogin(currentUser.role);

        return false;
    }


    return true;
}