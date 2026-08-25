// ==========================================
// APPLICATION HANDLING & STUDENT DASHBOARD
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initApplications();
});

/**
 * Sets up modal event listeners and dashboard rendering if applicable.
 */
function initApplications() {
  // Modal close button
  const closeBtn = document.getElementById('closeModal');
  if (closeBtn) closeBtn.addEventListener('click', closeApplyModal);

  // Close modal when clicking on the overlay (outside card)
  const modalOverlay = document.getElementById('applyModal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeApplyModal();
    });
  }

  // Application form submission
  const applyForm = document.getElementById('applyForm');
  if (applyForm) applyForm.addEventListener('submit', submitApplication);

  // If we're on student dashboard, render it
  if (document.getElementById('colPending')) {
    renderStudentDashboard();
  }
}

/**
 * Opens the apply modal for a given job ID.
 * Checks if user is logged in and has student role.
 */
function openApplyModal(jobId) {
  const user = DB.getCurrentUser();

  // Guard: Not logged in
  if (!user) {
    alert('Please log in as a student to apply.');
    window.location.href = '../login.html'; // adjust path if needed
    return;
  }

  // Guard: Recruiter cannot apply
  if (user.role !== 'student') {
    alert('Recruiter accounts cannot apply for internships.');
    return;
  }

  // Find job
  const job = DB.getJobs().find(j => j.id === jobId);
  if (!job) {
    alert('Job not found.');
    return;
  }

  // Populate modal
  document.getElementById('modalJobTitle').textContent = `Apply to ${job.company}`;
  document.getElementById('modalJobId').value = job.id;
  document.getElementById('modalStudentInfo').textContent = 
    `${user.firstName} ${user.lastName} (${user.email}) - ${user.university || 'Student'}`;

  // Show modal
  const modal = document.getElementById('applyModal');
  if (modal) modal.classList.add('active');
}

/**
 * Closes the apply modal and resets the form.
 */
function closeApplyModal() {
  const modal = document.getElementById('applyModal');
  if (modal) modal.classList.remove('active');

  const form = document.getElementById('applyForm');
  if (form) form.reset();
}

/**
 * Handles the apply form submission: saves application to DB.
 */
function submitApplication(e) {
  e.preventDefault();

  const currentUser = DB.getCurrentUser();
  if (!currentUser) {
    alert('You must be logged in to apply.');
    return;
  }

  const jobId = document.getElementById('modalJobId').value;
  const coverNote = document.getElementById('coverNote').value.trim();

  // Get existing applications
  const applications = DB.getApplications();

  // Check for duplicate
  const alreadyApplied = applications.some(
    app => app.jobId === jobId && app.studentId === currentUser.id
  );

  if (alreadyApplied) {
    alert('You have already applied for this internship.');
    closeApplyModal();
    return;
  }

  // Create new application object
  const newApplication = {
    id: 'app_' + Date.now(),
    jobId: jobId,
    studentId: currentUser.id,
    studentName: `${currentUser.firstName} ${currentUser.lastName}`,
    studentEmail: currentUser.email,
    coverNote: coverNote,
    status: 'Pending',
    appliedAt: new Date().toLocaleDateString()
  };

  applications.push(newApplication);
  DB.saveApplications(applications);

  alert('Application submitted successfully!');
  closeApplyModal();

  // If on student dashboard, re-render
  if (document.getElementById('colPending')) {
    renderStudentDashboard();
  }
}

/**
 * Renders the student dashboard: metrics and kanban columns.
 * Called when on student/dashboard.html.
 */
function renderStudentDashboard() {
  const currentUser = DB.getCurrentUser();
  if (!currentUser || currentUser.role !== 'student') {
    // Not logged in as student, redirect
    window.location.href = '../login.html';
    return;
  }

  const applications = DB.getApplications().filter(app => app.studentId === currentUser.id);
  const jobs = DB.getJobs();

  // Update metrics
  const total = applications.length;
  const underReview = applications.filter(app => app.status === 'Under Review').length;
  const shortlisted = applications.filter(app => 
    app.status === 'Shortlisted' || app.status === 'Interviewing'
  ).length;

  document.getElementById('countTotal').textContent = total;
  document.getElementById('countUnderReview').textContent = underReview;
  document.getElementById('countShortlisted').textContent = shortlisted;

  // Kanban columns
  const colPending = document.getElementById('colPending');
  const colReview = document.getElementById('colReview');
  const colInterview = document.getElementById('colInterview');
  const colHired = document.getElementById('colHired');

  // Clear columns
  colPending.innerHTML = '';
  colReview.innerHTML = '';
  colInterview.innerHTML = '';
  colHired.innerHTML = '';

  // Helper to create application card
  function createAppCard(app) {
    const job = jobs.find(j => j.id === app.jobId);
    const jobTitle = job ? job.title : 'Unknown Job';
    const company = job ? job.company : 'Unknown Company';
    return `
      <div class="job-card" style="margin-bottom: 0.75rem;">
        <div class="job-title-group">
          <h4 style="font-size: 1rem;">${jobTitle}</h4>
          <span style="font-size: 0.85rem; color: var(--text-muted);">${company}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
          Applied: ${app.appliedAt}
        </div>
        ${app.coverNote ? `<div style="font-size: 0.85rem; margin-top: 0.5rem; font-style: italic;">"${app.coverNote}"</div>` : ''}
      </div>
    `;
  }

  // Sort applications into columns by status
  applications.forEach(app => {
    const cardHTML = createAppCard(app);
    if (app.status === 'Pending' || app.status === 'Applied') {
      colPending.innerHTML += cardHTML;
    } else if (app.status === 'Under Review') {
      colReview.innerHTML += cardHTML;
    } else if (app.status === 'Shortlisted' || app.status === 'Interviewing') {
      colInterview.innerHTML += cardHTML;
    } else if (app.status === 'Hired') {
      colHired.innerHTML += cardHTML;
    } else {
      // Default to pending if status unrecognized
      colPending.innerHTML += cardHTML;
    }
  });
}