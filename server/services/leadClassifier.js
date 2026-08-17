// Classifies leads based on their responses
function classifyLead(studentData) {
    const { degreePlan, counselingHelp } = studentData;

    let leadType = "Undecided";
    let isLead = false;

    // Check if counseling intent is shown
    if (counselingHelp === "Yes, I want counseling" || counselingHelp === "Yes, I want more information") {
        isLead = true;
        if (counselingHelp === "Yes, I want counseling") {
            leadType = "Counseling Interested";
        }
    } else if (counselingHelp === "Maybe, I'm exploring options") {
        leadType = "Degree Explorer";
        isLead = true; // Potentially a lead
    } else if (counselingHelp === "No, I just want career guidance") {
        leadType = "Career Guidance Only";
        isLead = false;
    }

    // Refine lead type based on degree plan
    if (isLead && leadType !== "Counseling Interested") {
        if (degreePlan === "Online Degree" || degreePlan === "Distance Learning") {
            leadType = "Online Degree Lead";
        } else if (degreePlan === "Offline/Regular Degree") {
            leadType = "Offline Degree Lead";
        } else if (degreePlan === "Hybrid") {
            leadType = "Hybrid Degree Lead";
        }
    }

    return {
        isLead,
        leadType
    };
}

module.exports = {
    classifyLead
};
