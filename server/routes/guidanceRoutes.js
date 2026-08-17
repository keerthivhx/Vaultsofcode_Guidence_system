const express = require('express');
const router = express.Router();
const { classifyLead } = require('../services/leadClassifier');
const { analyzeCareerFlow } = require('../services/careerGuidanceFlow');
const { appendLeadToSheet } = require('../services/googleSheetsService');

router.post('/analyze', async (req, res) => {
    try {
        const studentData = req.body;

        if (!studentData || !studentData.name || !studentData.email) {
            return res.status(400).json({ error: "Name and Email are required." });
        }

        // 1. Lead Classification
        const { isLead, leadType } = classifyLead(studentData);
        studentData.leadType = leadType;

        // 2. AI Career Analysis & Reporting Flow
        const { aiRecommendedCareer, aiRecommendedDegree, report } = await analyzeCareerFlow(studentData);

        // 3. Lead Capture to Google Sheets (if applicable)
        if (isLead) {
            // Append AI recommendations to the lead data
            const leadData = {
                ...studentData,
                aiRecommendedCareer,
                aiRecommendedDegree
            };
            
            // Send to Google Sheets (this runs asynchronously and we don't necessarily need to block the response, but we'll await it here for simplicity)
            await appendLeadToSheet(leadData);
        }

        // 4. Return Final Report to Client
        res.status(200).json({
            success: true,
            isLead,
            report
        });

    } catch (error) {
        console.error("Error in /analyze route:", error);
        res.status(500).json({ error: "An error occurred while generating the career guidance report." });
    }
});

module.exports = router;
