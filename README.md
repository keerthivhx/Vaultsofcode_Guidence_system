# Implementation Plan - VaultOfCode AI Support Chatbot

Build a production-ready, full-stack AI Website Support Chatbot for **VaultOfCode** featuring intent classification, knowledge base retrieval, anti-hallucination safeguards, conversation context retention, smart website routing, WhatsApp escalation, comprehensive testing/evaluation, and a sleek, modern UI.

## User Review Required

> [!IMPORTANT]
> - **Dual-Mode AI Engine**: The backend will integrate Gemini API (`@google/generative-ai`) with a robust deterministic RAG fallback. This ensures the app operates smoothly out of the box even before adding an API key, while leveraging Gemini LLM capabilities when `.env` is configured.
> - **MongoDB Integration**: The application will include Mongoose schemas for chat history, query logs, and evaluation results, with automatic fallback to an in-memory/JSON store if `MONGODB_URI` is not provided.
> - **Evaluation Dashboard**: An interactive testing viewer tab will be embedded directly in the frontend alongside a dedicated evaluation script so test cases can be run and reviewed visually.

## Proposed Architecture & File Structure

```
Guidence_system/
├── package.json               # Monorepo root scripts (npm run dev, npm run build)
├── server/
│   ├── package.json
│   ├── .env.example
│   ├── server.js              # Express app entry point
│   ├── config/
│   │   ├── db.js              # MongoDB connection with fallback
│   │   └── systemPrompt.js    # VaultOfCode AI system instructions
│   ├── services/
│   │   ├── intentClassifier.js    # AI + NLP Intent Classifier (14 intents)
│   │   ├── knowledgeBaseService.js# Knowledge retrieval & anti-hallucination check
│   │   ├── aiService.js           # Gemini API integration & context manager
│   │   └── evaluationService.js   # Automated accuracy & hallucination testing
│   ├── routes/
│   │   ├── chatRoutes.js          # POST /api/chat, GET /api/chat/history
│   │   ├── knowledgeRoutes.js     # GET /api/knowledge, GET /api/routes
│   │   └── evalRoutes.js          # POST /api/eval/run, GET /api/eval/dataset
│   ├── data/
│   │   ├── knowledgeBase.json     # Verified VaultOfCode knowledge base
│   │   └── testDataset.json       # 15+ comprehensive benchmark test cases
│   └── middleware/
│       ├── rateLimiter.js         # Security rate limiting
│       ├── sanitizer.js           # Input validation & prompt injection defense
│       └── errorHandler.js        # Global error middleware
├── client/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── index.css              # Custom Tailwind & dark mode design system
│   │   ├── App.jsx                # Main Layout & Page router
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # VaultOfCode top header & route switcher
│   │   │   ├── ChatWidget.jsx     # Floating bottom-right widget trigger
│   │   │   ├── ChatWindow.jsx     # Core conversation UI (messages, auto-scroll, chips)
│   │   │   ├── SuggestedQuestions.jsx # Quick suggestion pills
│   │   │   ├── EscalationModal.jsx    # WhatsApp support trigger modal
│   │   │   ├── Pages.jsx          # Mock VaultOfCode site pages (Courses, Internships, Verification, etc.)
│   │   │   └── EvalReportView.jsx # Live Evaluation & Benchmark report UI
│   │   └── services/
│   │       └── api.js             # Client API service
└── README.md                      # Comprehensive production docs
```

---

## Detailed Intent System & Knowledge Base Design

### Supported Intents (14 Categories)
1. `course_inquiry` - Full-stack, Python, Data Science, Web Dev, Cyber Security course info.
2. `training_inquiry` - Industrial training, summer bootcamps, hands-on mentorship.
3. `internship_inquiry` - Web dev, AI/ML, Java, Python internship programs & duration.
4. `workshop_inquiry` - Weekend workshops, AI bootcamps, webinars.
5. `certificate_query` - Issues receiving, downloading, or generating certificates.
6. `certificate_verification` - Verifying certificate credentials & authenticating IDs.
7. `offer_letter_query` - Downloading, verifying, or requesting internship offer letters.
8. `enrollment_query` - Registration process, eligibility criteria, batches.
9. `payment_query` - Fee structures, payment gateways, receipts, refund policy.
10. `website_navigation` - Finding pages (Courses, Internships, Verification, Support).
11. `technical_support` - Login issues, video playback, dashboard bugs.
12. `human_support` - Direct requests for representative or WhatsApp support.
13. `general_query` - About VaultOfCode, mission, location, working hours.
14. `unknown` - Out-of-scope or unhandled queries (Anti-hallucination fallback).

---

## Verification Plan

### Automated Testing
- **Evaluation Runner**: Run `/api/eval/run` endpoint or local Node script `node server/scripts/runEval.js` across `testDataset.json` (15+ scenarios).
- Measure accuracy across:
  - Intent classification match rate
  - Knowledge retrieval accuracy
  - Hallucination prevention (0 hallucinated URLs/fees)
  - Context retention in multi-turn dialogue

### Manual Verification
- Visual UI test using modern dark/light mode responsive interface.
- Test floating widget vs full screen chat mode.
- Test smart navigation links within chat responses.
- Test WhatsApp escalation triggers on payment/custom certificate queries.
