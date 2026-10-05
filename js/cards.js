/* =========================================================
   CARD HELPERS
   Shared between student and recruiter card renderers.
   ========================================================= */

/* ---------- Format a short date ---------- */

function formatCardDate(dateString) {

    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

}


/* ---------- "New" badge ---------- */

function isNewPosting(postedAt) {

    if (!postedAt) return false;

    const posted = new Date(postedAt);

    if (isNaN(posted.getTime())) return false;

    const daysOld =
        (Date.now() - posted.getTime()) / 86400000;

    return daysOld >= 0 && daysOld <= 7;

}


/* ---------- "Verified" badge ---------- */

function isRecruiterVerified(recruiterId) {

    if (!recruiterId) return false;

    const profile = getRecruiterProfile(recruiterId);

    if (!profile) return false;

    return profile.verificationStatus === "verified";

}


/* ---------- Applicant count ---------- */

function countApplicants(internshipId) {

    return getApplications().filter(
        a => a.internshipId === internshipId
    ).length;

}


/* ---------- Deadline urgency ---------- */

function getDeadlineInfo(deadline) {

    if (!deadline) return null;

    const target = new Date(deadline);

    if (isNaN(target.getTime())) return null;


    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const t = new Date(target);
    t.setHours(0, 0, 0, 0);


    const days = Math.round(
        (t.getTime() - today.getTime()) / 86400000
    );


    let urgencyText = "";
    let urgencyClass = "";


    if (days < 0) {

        urgencyText = "Deadline passed";
        urgencyClass = "deadline-past";

    } else if (days === 0) {

        urgencyText = "Closes today";
        urgencyClass = "deadline-urgent";

    } else if (days === 1) {

        urgencyText = "Closes tomorrow";
        urgencyClass = "deadline-urgent";

    } else if (days <= 7) {

        urgencyText = `Closes in ${days} days`;
        urgencyClass = "deadline-warning";

    } else {

        urgencyText = `Closes in ${days} days`;

    }


    return {
        dateLabel: formatCardDate(deadline),
        urgencyText,
        urgencyClass
    };

}


/* ---------- Badge row ---------- */

function renderCardBadges(internship, showVerified) {

    const badges = [];


    if (isNewPosting(internship.postedAt || internship.postedDate)) {

        badges.push(`
            <span class="badge badge-new">New</span>
        `);

    }


    if (
        showVerified &&
        isRecruiterVerified(internship.recruiterId)
    ) {

        badges.push(`
            <span class="badge badge-verified">
                ${icon("check", 12)} Verified
            </span>
        `);

    }


    if (badges.length === 0) {
        return "";
    }


    return `
        <div class="internship-badges">
            ${badges.join("")}
        </div>
    `;

}


/* ---------- Applicant line ---------- */

function renderApplicantLine(internshipId, label) {

    const count = countApplicants(internshipId);

    return `
        <span>
            ${icon("send", 14)}
            ${count} ${label}
        </span>
    `;

}


/* ---------- Deadline line ---------- */

function renderDeadlineLine(internship) {

    const info = getDeadlineInfo(internship.deadline);

    if (!info) return "";


    return `
        <div class="internship-deadline">
            <span>
                ${icon("calendar", 14)}
                Apply by ${info.dateLabel}
            </span>

            ${
                info.urgencyText
                    ? `
                        <span class="deadline-tag ${info.urgencyClass}">
                            ${info.urgencyText}
                        </span>
                    `
                    : ""
            }
        </div>
    `;

}