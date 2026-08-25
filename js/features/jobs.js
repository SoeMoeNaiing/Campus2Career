// ==========================================
// JOB LISTING, FILTERING & SEARCH
// ==========================================

// Wait for DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Only run if the jobs container exists (i.e., we are on jobs.html)
  const jobsContainer = document.getElementById('jobsContainer');
  if (!jobsContainer) return; // Not on the jobs page, exit

  // Load all jobs from DB
  const allJobs = DB.getJobs();

  // Set up filter listeners
  setupJobFilters();

  // Initial render (no filters applied)
  renderJobs(allJobs);
});

/**
 * Renders an array of job objects into the jobs container.
 * If the array is empty, shows a friendly message.
 */
function renderJobs(jobsToRender) {
  const container = document.getElementById('jobsContainer');
  if (!container) return;

  // Empty state
  if (jobsToRender.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <h3>No internships match your criteria</h3>
        <p>Try resetting filters or adjusting your search keyword.</p>
      </div>
    `;
    return;
  }

  // Build HTML for each job card
  container.innerHTML = jobsToRender.map(job => `
    <div class="job-card" data-id="${job.id}">
      <div class="job-card-header">
        <div class="job-title-group">
          <h3>${job.title}</h3>
          <span class="job-company">${job.company} • ${job.location}</span>
        </div>
        <div style="font-weight: 700; color: var(--primary);">
          $${job.stipend}/mo
        </div>
      </div>

      <div class="job-tags">
        <span class="job-tag primary">${job.domain}</span>
        <span class="job-tag">${job.type}</span>
        ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
      </div>

      <div class="job-card-footer">
        <span class="job-posted-time">Posted ${job.posted}</span>
        <div class="job-actions">
          <button class="btn btn-primary btn-sm btn-apply" data-id="${job.id}">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Attach click event to all "Apply" buttons
  document.querySelectorAll('.btn-apply').forEach(btn => {
    btn.addEventListener('click', (e) => {
  const jobId = e.target.getAttribute('data-id');
  openApplyModal(jobId);
});
  });
}

/**
 * Reads current filter values and returns a filtered subset of all jobs.
 * Then calls renderJobs with the filtered list.
 */
function filterJobs() {
  const allJobs = DB.getJobs(); // always start from full list

  // Search keyword
  const searchInput = document.getElementById('jobSearchInput');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  // Domain filter
  const domainSelect = document.getElementById('filterDomain');
  const selectedDomain = domainSelect ? domainSelect.value : 'all';

  // Job type checkboxes
  const typeCheckboxes = document.querySelectorAll('.filter-type:checked');
  const selectedTypes = Array.from(typeCheckboxes).map(cb => cb.value);

  // Stipend slider
  const stipendSlider = document.getElementById('filterStipend');
  const minStipend = stipendSlider ? parseInt(stipendSlider.value, 10) : 0;

  // Apply filters
  const filtered = allJobs.filter(job => {
    // Search matches title, company, or tags
    const matchesSearch =
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.tags.some(tag => tag.toLowerCase().includes(query));

    // Domain matches (if not 'all')
    const matchesDomain = selectedDomain === 'all' || job.domain === selectedDomain;

    // Type matches (if none selected, allow all)
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);

    // Stipend matches
    const matchesStipend = job.stipend >= minStipend;

    return matchesSearch && matchesDomain && matchesType && matchesStipend;
  });

  renderJobs(filtered);
}

/**
 * Attaches event listeners to all filter controls so they update the job list.
 */
function setupJobFilters() {
  // Search input
  const searchInput = document.getElementById('jobSearchInput');
  if (searchInput) searchInput.addEventListener('input', filterJobs);

  // Domain select
  const domainSelect = document.getElementById('filterDomain');
  if (domainSelect) domainSelect.addEventListener('change', filterJobs);

  // Job type checkboxes
  document.querySelectorAll('.filter-type').forEach(cb => {
    cb.addEventListener('change', filterJobs);
  });

  // Stipend slider
  const stipendSlider = document.getElementById('filterStipend');
  const stipendValue = document.getElementById('stipendValue');
  if (stipendSlider) {
    stipendSlider.addEventListener('input', (e) => {
      // Update displayed value
      if (stipendValue) stipendValue.textContent = `$${e.target.value}/mo`;
      filterJobs();
    });
  }

  // Reset button
  const resetBtn = document.getElementById('resetFilters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Reset all filter controls
      if (searchInput) searchInput.value = '';
      if (domainSelect) domainSelect.value = 'all';
      document.querySelectorAll('.filter-type').forEach(cb => cb.checked = false);
      if (stipendSlider) {
        stipendSlider.value = 0;
        if (stipendValue) stipendValue.textContent = '$0/mo';
      }
      // Re-render with all jobs
      renderJobs(DB.getJobs());
    });
  }
}