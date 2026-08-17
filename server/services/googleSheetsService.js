const { google } = require('googleapis');
require('dotenv').config();

// Create an OAuth2 client or JWT client
// We will use a JWT client for service accounts
async function appendLeadToSheet(leadData) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                // Replace escaped newlines if passed through env
                private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : null
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        // For local dev without credentials, just log and return
        if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.SPREADSHEET_ID) {
            console.warn("⚠️ Google Sheets credentials not found. Mocking lead capture.");
            console.log("Mock Lead Captured:", leadData);
            return { success: true, mocked: true };
        }

        const client = await auth.getClient();
        const googleSheets = google.sheets({ version: 'v4', auth: client });
        const spreadsheetId = process.env.SPREADSHEET_ID;

        // Map leadData to a row array based on requirements:
        // Name, Phone Number, Email, Current Education, Current Course/Degree, College, 
        // Career Interest, Preferred Degree Mode, Counseling Required, Preferred Specialization,
        // AI Recommended Career, AI Recommended Degree, Date/Time, Lead Source, Lead Type
        const row = [
            leadData.name || '',
            leadData.phone || '',
            leadData.email || '',
            leadData.currentEducation || '',
            leadData.degreeCourse || '',
            leadData.college || '',
            leadData.careerGoals || leadData.careerInterest || '',
            leadData.preferredDegreeMode || '',
            leadData.counselingRequired || '',
            leadData.preferredSpecialization || '',
            leadData.aiRecommendedCareer || '',
            leadData.aiRecommendedDegree || '',
            new Date().toISOString(),
            'AI Career Guidance System',
            leadData.leadType || ''
        ];

        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: 'Sheet1', // Make sure the sheet name is 'Sheet1'
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [row]
            }
        });

        console.log("✅ Lead successfully appended to Google Sheet");
        return { success: true };

    } catch (error) {
        console.error("❌ Error appending lead to Google Sheet:", error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    appendLeadToSheet
};
