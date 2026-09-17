/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

if (!requireRole("admin")) {

    // Redirect handled by auth.js

} else {

    initializeAdminDashboard();

}


function initializeAdminDashboard() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }


    document.getElementById("adminName")
        .textContent = currentUser.name;


    const users = getUsers();

    const students =
        users.filter(user => user.role === "student");

    const recruiters =
        users.filter(user => user.role === "recruiter");


    const recruiterProfiles =
        getRecruiterProfiles();

    const pendingVerifications =
        Object.values(recruiterProfiles)
            .filter(
                profile =>
                    (profile.verificationStatus || "unsubmitted") === "pending"
            )
            .length;


    const internships =
        getInternships();

    const activeInternships =
        internships.filter(
            internship =>
                internship.status === "active"
        );


    const applications =
        getApplications();


    document.getElementById("totalStudents")
        .textContent = students.length;

    document.getElementById("totalRecruiters")
        .textContent = recruiters.length;

    document.getElementById("pendingVerifications")
        .textContent = pendingVerifications;

    document.getElementById("totalInternships")
        .textContent = internships.length;

    document.getElementById("activeInternships")
        .textContent = activeInternships.length;

    document.getElementById("totalApplications")
        .textContent = applications.length;

}