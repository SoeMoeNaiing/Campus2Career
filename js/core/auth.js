// ==========================================
// AUTHENTICATION & SESSION MANAGEMENT
// ==========================================

// Attach event listeners on page load
document.addEventListener('DOMContentLoaded', () => {
  // Registration form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Update navbar with current user state
  updateNavbarUI();
});

/**
 * Handles the registration form submission.
 * Reads user input, validates, saves user, logs them in, and redirects.
 */
function handleRegister(e) {
  e.preventDefault();

  // Determine selected role (student or recruiter)
  const isStudent = document.getElementById('regRoleStudent').classList.contains('active');
  const role = isStudent ? 'student' : 'recruiter';

  // Gather form data
  const newUser = {
    id: 'user_' + Date.now(),
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
    role: role,
    // Role-specific fields
    university: isStudent ? document.getElementById('university').value.trim() : null,
    company: !isStudent ? document.getElementById('companyName').value.trim() : null
  };

  // Check if email already registered
  const users = DB.getUsers();
  if (users.some(u => u.email === newUser.email)) {
    alert('This email is already registered. Please log in instead.');
    return;
  }

  // Save user and set session
  users.push(newUser);
  DB.saveUsers(users);
  DB.setCurrentUser(newUser);

  alert('Registration successful!');
  // Redirect based on role
  window.location.href = role === 'student' ? 'student/dashboard.html' : 'recruiter/dashboard.html';
}

/**
 * Handles the login form submission.
 * Finds matching user, sets session, and redirects.
 */
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const users = DB.getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    DB.setCurrentUser(user);
    alert('Login successful!');
    // Redirect based on role
    if (user.role === 'student') {
      window.location.href = 'student/dashboard.html';
    } else if (user.role === 'recruiter') {
      window.location.href = 'recruiter/dashboard.html';
    }
  } else {
    alert('Invalid email or password.');
  }
}

/**
 * Logs out the current user and redirects to home page.
 */
function handleLogout() {
  DB.logout();
  window.location.href = 'index.html';
}
