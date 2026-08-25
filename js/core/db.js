// ==========================================
// CORE DATABASE LAYER (localStorage wrapper)
// ==========================================

// Default seed data for jobs (same as before)
const defaultJobs = [
  {
    id: "job_1",
    title: "Frontend Developer Intern",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    domain: "Web Development",
    type: "Remote",
    stipend: 2500,
    posted: "2 days ago",
    tags: ["React", "CSS", "JavaScript"]
  },
  {
    id: "job_2",
    title: "Data Science Intern",
    company: "DataIQ",
    location: "Austin, TX",
    domain: "Data Science",
    type: "Hybrid",
    stipend: 3000,
    posted: "1 week ago",
    tags: ["Python", "SQL", "Machine Learning"]
  },
  {
    id: "job_3",
    title: "UI/UX Design Intern",
    company: "Creative Studio",
    location: "New York, NY",
    domain: "UI/UX Design",
    type: "On-site",
    stipend: 1500,
    posted: "3 days ago",
    tags: ["Figma", "Prototyping", "Research"]
  }
];

// Initialize localStorage with default data if keys don't exist
function initDB() {
  if (!localStorage.getItem('c2c_users')) {
    localStorage.setItem('c2c_users', JSON.stringify([]));
  }
  if (!localStorage.getItem('c2c_jobs')) {
    localStorage.setItem('c2c_jobs', JSON.stringify(defaultJobs));
  }
  if (!localStorage.getItem('c2c_applications')) {
    localStorage.setItem('c2c_applications', JSON.stringify([]));
  }
}

// Run initialization immediately when script loads
initDB();

// ==========================================
// DATABASE API (DB object)
// ==========================================
const DB = {
  // --- Users ---
  getUsers: () => JSON.parse(localStorage.getItem('c2c_users')),
  saveUsers: (users) => localStorage.setItem('c2c_users', JSON.stringify(users)),

  // --- Jobs ---
  getJobs: () => JSON.parse(localStorage.getItem('c2c_jobs')),
  saveJobs: (jobs) => localStorage.setItem('c2c_jobs', JSON.stringify(jobs)),

  // --- Applications ---
  getApplications: () => JSON.parse(localStorage.getItem('c2c_applications')),
  saveApplications: (applications) => localStorage.setItem('c2c_applications', JSON.stringify(applications)),

  // --- Current User Session ---
  getCurrentUser: () => JSON.parse(localStorage.getItem('c2c_currentUser')),
  setCurrentUser: (user) => localStorage.setItem('c2c_currentUser', JSON.stringify(user)),
  logout: () => localStorage.removeItem('c2c_currentUser')
};