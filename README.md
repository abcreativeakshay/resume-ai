
Project Name: ResumeAI Builder
Version: 1.0.0
Tech Stack: React 19, TypeScript, Tailwind CSS, Google Gemini API
1. Introduction
1.1 Purpose
The ResumeAI Builder is a client-side web application designed to transform unstructured user data (text, files, GitHub repositories) into professionally formatted, ATS-friendly resumes. It leverages Generative AI (Google Gemini 2.5 Flash) to not only format content but also provide deep career analytics, strategic advice, and tailored outreach tools.
1.2 Scope
The application functions as a single-page application (SPA) where users can:
Ingest data from multiple sources.
Generate a "Career Suite" containing a resume, cover letter, and analysis.
Customize the visual design via templates and themes.
Export the result to PDF or DOCX.
2. Technical Architecture
2.1 Technology Stack
Frontend Framework: React 19 (Functional Components, Hooks).
Language: TypeScript (Strict typing for Resume Data interfaces).
Styling: Tailwind CSS (Custom configuration for "Tech Grid" aesthetics).
AI Engine: Google Gemini API (gemini-2.5-flash model).
Document Handling: html-docx-js-typescript (DOCX generation), file-saver.
Icons/Assets: Inline SVG icons.
2.2 Data Flow
Input Layer: User provides raw text, uploads a PDF/TXT, or authenticates GitHub username.
Processing Layer:
Data is aggregated into a CombinedInput object.
A prompt with a specific JSON Schema is sent to ai.models.generateContent.
Gemini API returns a structured JSON object matching the ResumeData interface.
Presentation Layer: React components render the JSON into HTML templates.
Persistence Layer: localStorage is used to auto-save the session state (resumeData_v4).
3. Functional Requirements
3.1 Data Ingestion Modules
The system shall support the following input methods:
GitHub Import: Fetch public repositories, languages, and stars via GitHub API. It must retrieve README.md content for top repositories to analyze technical skills.
Text Input: A raw text area for pasting existing resume content.
File Upload: Support for .pdf and .txt files.
Constraint: PDF parsing is currently handled via text extraction or base64 encoding sent to the AI model.
Target Job Description: An optional input field to tailor the generated content specifically for a job listing.
3.2 AI Core Features (The "Career Suite")
Upon generation, the AI must produce a JSON object containing 20+ distinct features:
Standard Resume Data: Personal Info, Summary, Experience, Projects, Education, Skills.
Deep Analytics:
Tone analysis (Professional/Academic/Casual).
Grammar score (0-100).
Employment gap detection.
Action verb strength rating.
Quantification score.
Content Variations: Three versions of the professional summary (Creative, Corporate, Technical).
Strategic Tools:
Estimated Market Salary range.
Recommended Certifications.
Suggested Job Roles.
Soft Skills extraction.
Outreach Kit:
Cold Email draft to recruiters.
LinkedIn "Open to Work" post.
Twitter/X Bio.
GitHub Profile README snippet.
Global & Prep:
Spanish translation of the summary.
Interview Preparation (Behavioral, Technical, Situational questions).
3.3 Customization & Design
The builder must allow real-time customization:
Templates: Support for 20 distinct visual styles:
Core: Executive, Elegant, Modern, Creative, Minimal, Classic.
Advanced: Timeline, Grid, Startup, Academic, Tech, Swiss, Bold, Compact, Artistic, Infographic, Monochrome, Focused, Magazine, Glitch.
Typography: Switch between Sans, Serif, Mono, Display, Slab, Oswald, and Lato fonts.
Color Theme: 8 preset accent colors (Cyan, Black, Red, Green, Orange, Purple, Pink, White).
View Modes: Toggle between Resume View and Cover Letter View.
3.4 Export Capabilities
Print to PDF: Utilizes the browser's native print engine with @media print CSS overrides to ensure margins and backgrounds render correctly.
Download DOCX: Converts the active HTML template into a Microsoft Word compatible file, preserving basic layout and CSS styles.
4. User Interface (UI) Requirements
4.1 Global Layout
Sidebar:
Navigation (Home, Builder, Terms).
Branding: Custom abstract "Diamond/Infinity" SVG logo with gradient.
Builder Layout: Two-column split view (Left: Controls/Input, Right: Live Preview).
4.2 Visual Aesthetic
Theme: Dark Mode / Cyberpunk.
Background: Custom "Tech Grid" pattern (bg-tech-grid).
Feedback: "Confetti" animation triggers upon successful AI generation.
Responsiveness: The preview pane must scale (transform scale(...)) to fit different viewport sizes while maintaining A4 aspect ratio.
5. Non-Functional Requirements
5.1 Performance
Latency: AI generation usually takes 5-15 seconds depending on Gemini API load. The UI must show a "Thinking" state/pulse during this time.
Client-Side: The app must function without a traditional backend database; all state is local.
5.2 Privacy
User data (API Keys, Resume Content) is stored in localStorage only.
Data is sent to Google Gemini API for processing but is not stored by the application creators.
5.3 Reliability
Error Handling: The UI must display error messages for failed API calls, invalid file types, or empty inputs.
Fallbacks: If specific AI fields (like critique) are missing, the UI should handle the undefined state gracefully.
