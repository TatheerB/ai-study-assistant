# AI Study Assistant

**Course:** INFS3203 -- Winter 2026\
**Team Members:** Tatheer Batool & Akmal Saleem\
**GitHub Repository:** https://github.com/TatheerB/ai-study-assistant

------------------------------------------------------------------------

# Project Description

**AI Study Assistant** is a web application that helps students learn
any topic faster by generating personalized study materials. Users
simply enter a topic, and the application generates concise summaries,
flashcards, and practice quizzes using Google Gemini AI.

The application is designed for high school and university students who
want to supplement their learning with AI-generated study aids. All
generated materials can be saved, organized by subject, and accessed
anytime for review.

------------------------------------------------------------------------

# Features

## Core Features

-   Topic input form with subject categorization\
-   Save study sets to personal library\
-   Browse and search previously created materials\
-   Delete and organize saved study sets

## AI-Powered Features (Google Gemini)

-   **Smart Summaries** -- Generate concise bullet-point summaries with
    key concepts highlighted\
-   **Flashcard Generator** -- Automatically create question-answer
    flashcards for active recall practice\
-   **Quiz Creator** -- Generate multiple-choice practice quizzes (5--10
    questions) to test knowledge retention

------------------------------------------------------------------------

# Tech Stack

  ------------------------------------------------------------------------
  Layer         Technology                 Justification
  ------------- -------------------------- -------------------------------
  Backend       Python + Flask             Lightweight framework and rapid
                                           development for a 3-week
                                           timeline

  AI / LLM      Google Gemini 2.5 Flash    Reliable API for text
                                           generation tasks

  Database      MongoDB Atlas              Free tier with flexible schema
                                           for study materials

  Frontend      HTML + CSS + JavaScript    Simple stack without framework
                                           complexity

  CI/CD         GitHub Actions             Integrates directly with GitHub
                                           repositories

  Deployment    Render.com                 Free hosting with automatic
                                           deployment and HTTPS
  ------------------------------------------------------------------------

------------------------------------------------------------------------

# Team Members & Roles

We use a **Feature-Based Division**, where each member owns complete
features end-to-end.

  -----------------------------------------------------------------------
  Member            Role              Primary Ownership End-to-End
                                                        Features
  ----------------- ----------------- ----------------- -----------------
  **Akmal Saleem**  Feature Owner:    Summary           Topic input,
                    Summaries +       generation,       summary display,
                    History           database setup    save/load study
                                                        sets, history
                                                        page

  **Tatheer         Feature Owner:    Flashcards,       Interactive
  Batool**          Flashcards +      quizzes, CI/CD    flashcards, quiz
                    Quizzes + DevOps  pipeline          system, live
                                                        deployment
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# Responsibilities

## Akmal Saleem -- Summaries + History

### Frontend UI

-   Build topic input form\
-   Build summary results page\
-   Build history page showing saved study sets\
-   Add buttons: Generate, Save, View History, Delete

### Backend APIs

-   POST /generate-summary -- calls Gemini and returns summary\
-   POST /save-study-set -- saves study set to MongoDB\
-   GET /get-history -- retrieves saved study sets\
-   DELETE /delete-study-set -- removes a saved set

### AI Prompt

Generate a concise summary of \[topic\] with key points.

### Database

-   Set up MongoDB Atlas\
-   Design schema for study sets

### Testing

-   Write 6 tests covering summary generation and history features

### GitHub Contribution

-   Create feature branches for summary and history features\
-   Open pull requests and review teammate PRs\
-   Update issues on the project board

------------------------------------------------------------------------

## Tatheer Batool -- Flashcards + Quizzes + DevOps

### Frontend UI

-   Build flashcard component (flip, next/prev navigation)\
-   Build quiz component (questions, options, scoring)\
-   Connect UI components to backend APIs

### Backend APIs

-   POST /generate-flashcards -- generates flashcards\
-   POST /generate-quiz -- generates quiz questions

### AI Prompts

Flashcards: Create 5 flashcards about \[topic\] in Q&A format.

Quiz: Create 5 multiple-choice questions about \[topic\] with 4 options
each and indicate the correct answer.

### DevOps

-   Write Dockerfile\
-   Configure GitHub Actions CI pipeline\
-   Deploy application to Render\
-   Maintain live deployment

### Testing

-   Write 6 tests covering flashcard and quiz features

### GitHub Contribution

-   Create feature branches for flashcards and quiz features\
-   Open pull requests and review teammate PRs\
-   Update issues on the project board

------------------------------------------------------------------------

# Shared Responsibilities

  -----------------------------------------------------------------------
  Task              How We Handle It
  ----------------- -----------------------------------------------------
  Daily Standup     Both members comment on a tracking issue with updates

  Pull Requests     Each member opens at least one PR per week

  Project Board     Issues move from To Do → In Progress → Done

  Commits           Each member commits regularly with clear messages

  Testing           Minimum 12 tests total (6 per member)

  Documentation     Both contribute to README

  Presentation      Equal speaking time (5--7 minutes each)
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 3-Week Timeline

## Week 11 -- Foundation

Goal: Set up project infrastructure and working app skeleton.

Backend & AI - Create Flask application skeleton\
- Set up MongoDB Atlas and test connection\
- Implement health check endpoint\
- Create requirements.txt\
- Test database connection\
- Document API design

Frontend & DevOps - Create HTML templates\
- Set up CSS styling\
- Create JavaScript structure\
- Prepare mock data\
- Set up project board and issues\
- Complete README proposal

------------------------------------------------------------------------

## Week 12 -- Core Development

Goal: Core features implemented and CI pipeline running.

Backend & AI - Integrate Google Gemini API\
- Implement summary generation endpoint\
- Implement flashcard generation endpoint\
- Implement quiz generation endpoint\
- Create database save/load endpoints\
- Write 6 backend tests

Frontend & DevOps - Build UI components for summary, flashcards, and
quizzes\
- Implement save/load interface\
- Add loading states and error handling\
- Write 6 frontend tests\
- Set up GitHub Actions CI pipeline

------------------------------------------------------------------------

## Week 13 -- Deployment & Polish

Goal: Full CI/CD pipeline and live deployment.

Backend & AI - Improve AI response formatting\
- Add additional error handling\
- Final backend testing\
- Complete API documentation

Frontend & DevOps - Configure CD pipeline\
- Deploy app to Render\
- Verify live URL\
- Cross-browser testing\
- Final UI polish

------------------------------------------------------------------------

# Final Milestones

-   CI/CD pipeline operational\
-   Live application deployed\
-   All AI features working in production\
-   Presentation and demo ready

------------------------------------------------------------------------

## 🗄️ Database Schema (Study Set)

The application stores study sets in MongoDB. Each study set follows this structure:

```json
{
  "topic": "string",
  "summary": "string",
  "flashcards": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "quiz": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "string"
    }
  ],
  "created_at": "timestamp"
}



