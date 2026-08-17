const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Helper function to safely parse JSON from Gemini response
function parseJson(text) {
    try {
        // Strip out markdown formatting if present
        let cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error parsing JSON from Gemini:", text);
        throw new Error("Failed to parse AI response.");
    }
}

async function analyzeCareerFlow(studentData) {
    // 1. Student Profile Analysis
    const profilePrompt = `
    Analyze the following student profile and create a concise summary focusing on their strengths, current education level, and career aspirations.
    Student Data: ${JSON.stringify(studentData)}
    
    Return ONLY a JSON object with this structure:
    { "profileSummary": "string", "keyStrengths": ["string"], "educationLevel": "string" }
    `;
    
    const profileResult = await model.generateContent(profilePrompt);
    const profileAnalysis = parseJson(profileResult.response.text());

    // 2 & 4. Career Path Recommendation & Degree Recommendation (Run in Parallel)
    const careerPrompt = `
    Based on this profile analysis, recommend the top 3-5 career paths suitable for the student.
    Profile: ${JSON.stringify(profileAnalysis)}
    Student Interests: ${studentData.interests}
    Career Goals: ${studentData.careerGoals}
    
    Return ONLY a JSON object:
    {
        "careerPaths": [
            {
                "title": "Career Title",
                "whyItSuits": "Brief explanation",
                "jobRoles": ["Role 1", "Role 2"],
                "skillsRequired": ["Skill 1", "Skill 2"]
            }
        ]
    }
    `;

    const degreePrompt = `
    Based on this profile analysis and their career goal (${studentData.careerGoals}), suggest suitable degree programs and specializations.
    Profile: ${JSON.stringify(profileAnalysis)}
    
    Return ONLY a JSON object:
    {
        "degrees": [
            {
                "title": "Degree Name",
                "specialization": "Specialization Name",
                "type": "e.g., B.Tech, MSc, Diploma",
                "relevance": "Why this degree?"
            }
        ]
    }
    `;

    const [careerRes, degreeRes] = await Promise.all([
        model.generateContent(careerPrompt),
        model.generateContent(degreePrompt)
    ]);

    const careerRecommendations = parseJson(careerRes.response.text());
    const degreeRecommendations = parseJson(degreeRes.response.text());

    // 3 & 5. Skill Recommendation & University/College Suggestion (Run in Parallel)
    // Pass the top career path to the skill prompt
    const topCareer = careerRecommendations.careerPaths[0]?.title || studentData.careerGoals;
    const topDegree = degreeRecommendations.degrees[0]?.title || "Relevant Degree";

    const skillPrompt = `
    Identify the most important skills the student should develop for a career as a ${topCareer}.
    Current Skills: ${studentData.skills}
    Prioritize the list (do not generate a huge list, keep it to top 5-7 actionable skills).
    
    Return ONLY a JSON object:
    {
        "skillsToLearn": [
            { "skill": "Skill Name", "priority": "High/Medium", "reason": "Why learn this?" }
        ]
    }
    `;

    const universityPrompt = `
    Suggest suitable types of universities or specific popular institutions in their preferred location (${studentData.preferredLocation || 'Any'}) for a ${topDegree}.
    Budget preference: ${studentData.budget || 'Any'}
    Mode: ${studentData.degreePlan || 'Any'}
    
    Return ONLY a JSON object:
    {
        "universities": [
            { "name": "University/College Type or Name", "location": "Location", "why": "Why this fits their profile" }
        ]
    }
    `;

    const [skillRes, universityRes] = await Promise.all([
        model.generateContent(skillPrompt),
        model.generateContent(universityPrompt)
    ]);

    const skillRecommendations = parseJson(skillRes.response.text());
    const universityRecommendations = parseJson(universityRes.response.text());

    // 6. Final Career Report Compilation & Action Plan
    const reportPrompt = `
    You are an expert Career Counselor AI. Create a final, comprehensive, and student-friendly career report based on the following generated data.
    Do NOT overwhelm the student. Keep it structured, encouraging, and concise.

    Profile: ${JSON.stringify(profileAnalysis)}
    Careers: ${JSON.stringify(careerRecommendations)}
    Degrees: ${JSON.stringify(degreeRecommendations)}
    Skills: ${JSON.stringify(skillRecommendations)}
    Colleges: ${JSON.stringify(universityRecommendations)}
    
    Return ONLY a JSON object exactly matching this structure (this will be used directly in the UI):
    {
        "careerProfile": "A 2-3 sentence summary of their profile.",
        "recommendedCareerPaths": [
            { "title": "Career", "why": "Explanation", "roles": ["Role"], "skillsRequired": ["Skill"] }
        ],
        "skillsToLearn": ["Skill 1", "Skill 2", "Skill 3"],
        "recommendedDegrees": ["Degree 1", "Degree 2"],
        "recommendedUniversities": ["University 1", "University 2"],
        "shortTermPlan": ["Action 1", "Action 2", "Action 3"],
        "longTermPlan": ["Goal 1", "Goal 2", "Goal 3"],
        "overallRecommendation": "A concluding motivational paragraph summarizing their best path forward."
    }
    `;

    const reportRes = await model.generateContent(reportPrompt);
    const finalReport = parseJson(reportRes.response.text());

    return {
        aiRecommendedCareer: finalReport.recommendedCareerPaths[0]?.title || "Not specified",
        aiRecommendedDegree: finalReport.recommendedDegrees[0] || "Not specified",
        report: finalReport
    };
}

module.exports = {
    analyzeCareerFlow
};
