# OmniDev - Autonomous AI Software Engineer

OmniDev is a web application that automates code modification workflows. It clones remote GitHub repositories, analyzes codebase structures, generates multi-file patches using Gemini models, executes local build checks, and submits Pull Requests upon user approval.

## Features

* Repository Parsing: Clones target GitHub repositories and creates file snapshots for processing.
* Code Patch Generation: Uses Gemini API models (gemini-3.6-flash, gemini-2.5-pro) to generate structured multi-file edits.
* Build Verification: Runs local validation checks (npm install / build scripts) before staging files.
* Human-in-the-Loop Approval: Real-time logs and visual diff inspection UI before pushing upstream.
* PR Automation: Integrates Octokit REST API and simple-git for automated branch handling and PR creation.

## Tech Stack

* Frontend: React.js, Vite, CSS
* Backend: Node.js, Express.js
* AI Integration: @google/genai
* Git Tools: Octokit REST API, simple-git

## Workflow

1. User submits task description and GitHub URL.
2. Server clones repository and reads project structure.
3. Gemini API evaluates codebase and returns code modifications.
4. Patch is applied locally and build integrity is verified.
5. User inspects modified files and approves execution.
6. Server pushes branch and opens Pull Request on GitHub.

## Environment Variables

Create a `.env` file inside the `backend` directory:

PORT=5000
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token

## Getting Started

### Backend
cd backend
npm install
node server.js

### Frontend
cd frontend
npm install
npm run dev

## Author

Vishal Gupta