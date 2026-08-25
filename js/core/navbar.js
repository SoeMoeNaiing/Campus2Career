// ==========================================
// NAVBAR UI UPDATER
// ==========================================

/**
 * Updates the navigation bar's auth section based on current user session.
 * Called on every page load and after login/logout.
 */
function updateNavbarUI() {
  const navAuthContainer = document.getElementById('navAuthContainer');
  if (!navAuthContainer) return; // Skip if container doesn't exist

  const currentUser = DB.getCurrentUser();

  if (currentUser) {
    // User is logged in – show greeting and logout button
    navAuthContainer.innerHTML = `
      <span style="margin-right: 1rem; font-weight: 500;">
        Hi, ${currentUser.firstName}!
      </span>
      <button onclick="handleLogout()" class="btn btn-outline btn-sm">Log Out</button>
    `;
  } else {
    // User is not logged in – show login/signup buttons
    navAuthContainer.innerHTML = `
      <a href="login.html" class="btn btn-outline">Log In</a>
      <a href="register.html" class="btn btn-primary">Sign Up</a>
    `;
  }
}