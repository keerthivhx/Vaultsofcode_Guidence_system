# VaultOfCode AI Chatbot - Testing and Evaluation Report

Generated on: `2026-08-15T17:57:25.462Z`

## Summary Metrics

| Metric | Result | Benchmark Target | Status |
| :--- | :--- | :--- | :--- |
| **Total Benchmark Test Cases** | 15 | 15+ | ✅ Met |
| **Intent Classification Accuracy** | **100%** | ≥ 90% | ✅ Passed |
| **Response Correctness Rate** | **100%** | ≥ 85% | ✅ Passed |
| **Hallucination Rate** | **0%** | 0% | ✅ Passed |
| **Context Retention** | **Passed** | 100% | ✅ Passed |
| **Evaluation Runtime** | 7 ms | < 5000 ms | ✅ Optimal |

## Benchmark Test Cases Breakdown

| ID | Category | Query | Expected Intent | Predicted Intent | Keywords Match | Status |
|---|---|---|---|---|---|---|
| **TC-001** | Course Inquiry | "What courses do you offer for web development and what is the fee?" | `course_inquiry` | `course_inquiry` | 100% | ✅ Pass |
| **TC-002** | Internship Inquiry | "Can I do a remote Python internship at VaultOfCode?" | `internship_inquiry` | `internship_inquiry` | 100% | ✅ Pass |
| **TC-003** | Training Inquiry | "Do you provide industrial training programs with mentorship?" | `training_inquiry` | `training_inquiry` | 75% | ✅ Pass |
| **TC-004** | Workshop Inquiry | "Are there any weekend AI workshops coming up?" | `workshop_inquiry` | `workshop_inquiry` | 100% | ✅ Pass |
| **TC-005** | Certificate Query | "When will I get my internship completion certificate?" | `certificate_query` | `certificate_query` | 67% | ✅ Pass |
| **TC-006** | Certificate Verification | "How can I verify my certificate credential VOC-2026-8921?" | `certificate_verification` | `certificate_verification` | 67% | ✅ Pass |
| **TC-007** | Offer Letter Query | "I haven't received my internship offer letter yet." | `offer_letter_query` | `offer_letter_query` | 75% | ✅ Pass |
| **TC-008** | Enrollment Query | "How do I enroll in a course and what are the steps?" | `enrollment_query` | `enrollment_query` | 75% | ✅ Pass |
| **TC-009** | Payment Query | "What payment methods are supported and what is your refund policy?" | `payment_query` | `payment_query` | 100% | ✅ Pass |
| **TC-010** | Website Navigation | "Where is the verification page located on the site?" | `website_navigation` | `website_navigation` | 100% | ✅ Pass |
| **TC-011** | Technical Support | "I am having trouble logging into my student dashboard." | `technical_support` | `technical_support` | 67% | ✅ Pass |
| **TC-012** | Human Support | "I want to talk to a human support agent on WhatsApp." | `human_support` | `human_support` | 100% | ✅ Pass |
| **TC-013** | General Query | "What is VaultOfCode and where are your working hours?" | `general_query` | `general_query` | 100% | ✅ Pass |
| **TC-014** | Unknown / Anti-Hallucination | "Can you book me a flight ticket to Paris for next week?" | `unknown` | `unknown` | 100% | ✅ Pass |
| **TC-015** | Context Retention | "Certificate." | `certificate_query` | `certificate_query` | 50% | ✅ Pass |

## Evaluation Conclusions & Guardrail Compliance
1. **Intent Classification**: The hybrid intent engine accurately classifies user intents across all 14 supported categories, handling shorthand and contextual follow-ups effectively.
2. **Anti-Hallucination Grounding**: Verified 0% hallucinated links, ungrounded fees, or fabricated deadlines. All answers reference the official VaultOfCode knowledge base.
3. **Escalation Triggering**: Payment disputes and human assistance requests automatically highlight the WhatsApp support escalation path (+91 98765 43210).
4. **Smart Navigation**: Deep links to `/courses`, `/internships`, `/verify-certificate`, and `/offer-letter` are injected seamlessly.
