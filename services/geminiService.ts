import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface CombinedInput {
  text?: string;
  file?: { mimeType: string; data: string };
  githubData?: string;
  jobDescription?: string; 
}

/**
 * Parses resume content and generates a full Career Suite with deep analytics and 20+ features.
 */
export const parseResumeContent = async (input: CombinedInput): Promise<ResumeData> => {
  const modelId = "gemini-2.5-flash"; 

  // Updated System Instruction to prevent "abstract" output and enforce strict sectioning
  let systemInstruction = `You are an expert Resume Parser and Career Architect.
  
  CORE OBJECTIVE: 
  Convert the raw input data into a structured JSON Resume adhering strictly to the schema. 
  
  CRITICAL RULES FOR CONTENT GENERATION:
  1. **STRICT SECTION MAPPING**: You must organize content into the correct sections:
     - **Experience**: Must contain distinct roles, companies, and dates.
     - **Projects**: Must contain distinct project names and details.
     - **Skills**: Must be a list of specific hard/soft skills.
     - **Education**: Must contain degrees/schools.
     
  2. **PRESERVE DETAIL (NO ABSTRACT SUMMARIES)**: 
     - For 'experience.description', you MUST extract or generate multiple distinct bullet points (3-5 per role). 
     - **DO NOT** summarize a whole job into one abstract sentence like "Worked on various web development tasks." 
     - Use concrete action verbs, metrics, and technologies (e.g., "Increased load speed by 40% using React").

  3. **CONTEXTUAL ACCURACY**: 
     - If the input is a raw resume, extract the data exactly as is, improving grammar only.
     - If the input is just a job description + user background, tailor the resume bullet points to match the job keywords.

  4. **FORMATTING**: 
     - 'experience.description' must be an ARRAY of strings (bullet points).
     - 'projects.technologies' must be an ARRAY of strings.
  
  5. **ADVANCED SUITE**:
     - After structuring the core resume, generate the "Career Suite" insights (Critique, Variations, Strategic Tools) based on the extracted data.
  `;

  if (input.jobDescription) {
    systemInstruction += `
    **TARGET JOB MODE ACTIVE**:
    - Tailor the "Experience" bullet points and "Skills" to align with the provided [TARGET JOB DESCRIPTION].
    - Highlight matching keywords.
    `;
  }

  const parts: any[] = [];
  
  if (input.jobDescription) {
    parts.push({ text: `[TARGET JOB DESCRIPTION]\n${input.jobDescription}` });
  }

  if (input.githubData) {
    parts.push({ text: `[SOURCE: GITHUB DATA]\n${input.githubData}` });
  }

  if (input.text) {
    parts.push({ text: `[SOURCE: USER TEXT INPUT]\n${input.text}` });
  }

  if (input.file) {
    parts.push({ text: `[SOURCE: UPLOADED DOCUMENT]\n` });
    parts.push({ 
      inlineData: {
        mimeType: input.file.mimeType,
        data: input.file.data
      }
    });
  }

  if (parts.length === 0) {
    throw new Error("No input data provided.");
  }

  parts.push({ text: "Generate the complete JSON Resume based on the above sources. Ensure Experience descriptions are detailed bullet points." });

  // Define the schema
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      personalInfo: {
        type: Type.OBJECT,
        properties: {
          fullName: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          location: { type: Type.STRING },
          linkedin: { type: Type.STRING },
          website: { type: Type.STRING },
        },
        required: ["fullName", "email"],
      },
      summary: { type: Type.STRING },
      // Feature Group: Variations
      variations: {
        type: Type.OBJECT,
        properties: {
            summaryCreative: { type: Type.STRING },
            summaryCorporate: { type: Type.STRING },
            summaryTechnical: { type: Type.STRING },
        },
        required: ["summaryCreative", "summaryCorporate", "summaryTechnical"]
      },
      experience: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            company: { type: Type.STRING },
            duration: { type: Type.STRING },
            description: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["role", "company", "duration", "description"],
        },
      },
      projects: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
            link: { type: Type.STRING },
          },
          required: ["name", "description", "technologies"],
        }
      },
      education: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            degree: { type: Type.STRING },
            school: { type: Type.STRING },
            year: { type: Type.STRING },
          },
          required: ["degree", "school"],
        },
      },
      skills: { type: Type.ARRAY, items: { type: Type.STRING } },
      critique: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.INTEGER },
          feedback: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementPlan: { type: Type.STRING },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          // Feature Group: Deep Analytics
          analysis: {
            type: Type.OBJECT,
            properties: {
                tone: { type: Type.STRING },
                grammarScore: { type: Type.INTEGER },
                employmentGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                actionVerbStrength: { type: Type.STRING },
                quantificationScore: { type: Type.INTEGER },
                projectComplexity: { type: Type.STRING },
            },
            required: ["tone", "grammarScore", "actionVerbStrength"]
          }
        },
        required: ["score", "feedback", "improvementPlan", "analysis"]
      },
      careerTools: {
        type: Type.OBJECT,
        properties: {
          coverLetter: { type: Type.STRING },
          // Feature: Categorized Questions
          interviewPrep: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["Behavioral", "Technical", "Situational"] }
              }
            }
          },
          linkedinHeadline: { type: Type.STRING },
          linkedinAbout: { type: Type.STRING },
          // Feature Group: Strategic Tools & Social
          coldEmailRecruiter: { type: Type.STRING },
          linkedinPostOpenToWork: { type: Type.STRING },
          twitterBio: { type: Type.STRING },
          websiteBio: { type: Type.STRING },
          githubReadmeSnippet: { type: Type.STRING },
          salaryEstimation: { type: Type.STRING },
          suggestedCertifications: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
          softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          spanishSummary: { type: Type.STRING },
        },
        required: ["coverLetter", "interviewPrep", "linkedinHeadline", "linkedinAbout", "coldEmailRecruiter", "salaryEstimation"]
      }
    },
    required: ["personalInfo", "experience", "projects", "education", "skills", "careerTools", "variations", "critique"],
  };

  const response = await ai.models.generateContent({
    model: modelId,
    contents: { parts },
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  try {
    return JSON.parse(text) as ResumeData;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Failed to parse resume data.");
  }
};