# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Phase 2 Environmental Site Assessment (ESA) report generation prototype for West Earth Sciences. The application is a single-page web application that automates the creation of Phase 2 ESA reports for environmental consulting in the oil and gas industry.

## Application Architecture

### Single File Structure
- **index.tsx**: Contains the complete application including HTML, CSS, and JavaScript
- This is a monolithic single-file application with no external dependencies
- No build process or package manager configuration exists

### Key Components

**Frontend Architecture:**
- Pure HTML5 with embedded CSS and JavaScript
- No frameworks or libraries (vanilla JavaScript)
- Responsive design with CSS Grid and Flexbox
- Progress bar UI for 5-step workflow navigation

**Data Flow:**
- Client-side state management via `appState` global object
- Form data collection and processing for each step
- Google Sheets integration for data persistence
- Local HTML file download for report generation

### Application Workflow

The application follows a 5-step process:

1. **Step 1: Site Information & Context** - Collects basic site details, client info, and Phase 1 ESA summary
2. **Step 2: Data Integration** - Processes field investigation data and laboratory results
3. **Step 3: Contamination Analysis** - Analyzes Areas of Environmental Concern (AECs) and calculates impact volumes
4. **Step 4: Content Generation** - Generates report sections using template-based content
5. **Step 5: Report Assembly** - Combines all sections into final Phase 2 ESA report

### Key Features

**Google Sheets Integration:**
- Sends data to Google Apps Script Web App URL
- Tracks execution IDs and scoring data
- Handles CORS restrictions with no-cors mode
- Configurable via `GOOGLE_SCRIPT_URL` constant

**Scoring System:**
- Each step includes quality scoring (0-100 scale)
- Multiple criteria per step (completeness, accuracy, etc.)
- Feedback collection for each step
- Final report scoring and average calculation

**Report Generation:**
- Template-based content generation
- Professional formatting with proper ESA structure
- HTML download with embedded styles
- Includes executive summary, methodology, results, conclusions, and recommendations

## Development Commands

### AI-Powered Version (Recommended)
1. **Install dependencies**: `npm install`
2. **Set up environment**: Copy `.env` and add your API keys
3. **Start server**: `npm start` or `npm run dev` (with auto-reload)
4. **Access application**: `http://localhost:3001`

### Static Version (Fallback)
1. **Running the application**: Open `index.html` directly in a web browser
2. **Testing**: Manual testing through the web interface
3. **Deployment**: Upload the single HTML file to a web server

## AI Integration Setup

1. **Copy environment file**: `cp .env.example .env`
2. **Add your API keys**:
  ```
  OPENAI_API_KEY=sk-your-openai-key-here
  ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
  ```
3. **Start the backend server**: `npm start`
4. **The application will use AI for content generation when keys are configured**

## Environmental Context

The application is specifically designed for:
- Alberta Environmental Site Assessment Standards (2024)
- CSA Standard Z769-00 "Phase II Environmental Site Assessment"
- Alberta Tier 1 Soil and Groundwater Remediation Guidelines
- Oil and gas industry environmental consulting workflows

## Google Sheets Integration Setup

To enable Google Sheets integration:
1. Create a Google Apps Script project
2. Deploy as a Web App with execute permissions for "Anyone"
3. Replace the `GOOGLE_SCRIPT_URL` constant with your deployed URL
4. The script should accept POST requests and write data to spreadsheet rows

## Code Conventions

- Uses ES6+ JavaScript features
- Event-driven architecture with onclick handlers
- CSS-in-JS styling within template literals
- Semantic HTML structure
- Professional environmental consulting report formatting
- Defensive programming with error handling for external API calls

## User Feedback System

Enhanced User Feedback System

 1. Step 4 (Content Generation) - AI Processing Indicators:

 - Progressive loading messages showing which section is being generated:
   - "Initializing AI content generation..."
   - "Generating Executive Summary... (1/6)"
   - "Generating Site Description... (2/6)"
   - etc.
 - Visual progress indicators with green styling to show AI work

 2. Button Loading States for All Steps:

 - Processing buttons now show loading spinners and disable when clicked
 - Clear visual feedback that processing is happening
 - Buttons re-enable when processing completes

 3. Which Steps Use AI:

 - Step 1-3: Static content generation (fast)
 - Step 4: AI-powered content generation (6 sections generated with OpenAI)
 - Step 5: Report assembly (static)

 4. Better Error Handling:

 - Clear error messages if AI generation fails
 - Fallback content if AI services are unavailable
 - Console logging for debugging

 User Experience Improvements:

 1. No more confusion about when processing is happening
 2. Clear progress indication for AI generation steps
 3. Visual button feedback for all processing steps
 4. Informative loading messages explaining what's happening
 5. Professional appearance with consistent styling

 Now when users click "Generate Content" on Step 4, they'll see:
 - Button changes to "Processing..." with spinner
 - Progressive messages showing AI generation progress
 - Clear indication when each section is being generated
 - Final completion message

 ## Complete Feedback System Explanation

 Current System: Data Collection for Training

 The system collects rich training data including:

 1. Input Context: Site details, land use, contamination data
 2. Generated Content: Both AI and static versions
 3. Human Feedback: Scores (0-100) and qualitative feedback
 4. Quality Metrics: Professional quality, technical language, completeness

 Enhanced System: Real-Time Improvement

 I've added a framework that can:

 1. Query Historical Data: Find similar site contexts and scores
 2. Identify Patterns: Common issues in low-scoring content
 3. Extract Best Practices: Patterns from high-scoring content
 4. Enhance Prompts: Add feedback-based requirements to AI prompts

 How It Works in Practice

 // When generating content, the system now:
 1. Analyzes similar historical sites
 2. Identifies common feedback patterns
 3. Enhances the AI prompt with specific improvements
 4. Generates better content based on lessons learned

 Example of Feedback Enhancement

 Original Prompt:
 Generate an executive summary for a Phase II ESA...

 Enhanced Prompt:
 Generate an executive summary for a Phase II ESA...

 FEEDBACK-BASED IMPROVEMENTS (based on 5 similar sites, avg score: 82):
 - Common issues to avoid: Missing regulatory details; Unclear volume calculations
 - Best practices to follow: Include specific guidelines; Use professional terminology
 - Ensure regulatory compliance language is prominent

 To Fully Implement Real Feedback Learning

 You would need to:

 1. Google Sheets API Integration: Query the StructuredData sheet
 2. Pattern Analysis: Analyze feedback text for common themes
 3. Similarity Matching: Find sites with similar characteristics
 4. Score Correlation: Identify what makes high-scoring content

 The foundation is now in place - the system collects comprehensive feedback data and has the framework to use it
 for improvement. The next step would be implementing the actual Google Sheets API queries to make it fully
 functional.
