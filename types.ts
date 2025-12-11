export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  description: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface EducationItem {
  degree: string;
  school: string;
  year: string;
}

export interface InterviewPrep {
  question: string;
  answer: string;
  type: 'Behavioral' | 'Technical' | 'Situational';
}

export interface AnalysisMetrics {
  tone: string;
  grammarScore: number;
  employmentGaps: string[];
  actionVerbStrength: string;
  quantificationScore: number;
  projectComplexity: string;
}

export interface ContentVariations {
  summaryCreative: string;
  summaryCorporate: string;
  summaryTechnical: string;
}

export interface ResumeCritique {
  score: number;
  feedback: string[];
  improvementPlan: string;
  missingKeywords?: string[];
  analysis?: AnalysisMetrics;
}

export interface CareerTools {
  coverLetter: string;
  interviewPrep: InterviewPrep[];
  linkedinHeadline: string;
  linkedinAbout: string;
  coldEmailRecruiter: string;
  linkedinPostOpenToWork: string;
  twitterBio: string;
  websiteBio: string;
  githubReadmeSnippet: string;
  salaryEstimation: string;
  suggestedCertifications: string[];
  suggestedRoles: string[];
  softSkills: string[];
  spanishSummary: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  skills: string[];
  critique?: ResumeCritique; 
  careerTools?: CareerTools; 
  variations?: ContentVariations;
}

export interface ThemeConfig {
  color: string;
  font: 'sans' | 'serif' | 'mono' | 'display' | 'slab';
}

export enum TemplateType {
  EXECUTIVE = 'EXECUTIVE',
  ELEGANT = 'ELEGANT',
  MODERN = 'MODERN',
  CREATIVE = 'CREATIVE',
  MINIMAL = 'MINIMAL',
  CLASSIC = 'CLASSIC',
  // New Templates
  TIMELINE = 'TIMELINE',
  GRID = 'GRID',
  STARTUP = 'STARTUP',
  ACADEMIC = 'ACADEMIC',
  TECH = 'TECH',
  SWISS = 'SWISS',
  BOLD = 'BOLD',
  COMPACT = 'COMPACT',
  ARTISTIC = 'ARTISTIC',
  INFOGRAPHIC = 'INFOGRAPHIC',
  MONOCHROME = 'MONOCHROME',
  FOCUSED = 'FOCUSED',
  MAGAZINE = 'MAGAZINE',
  GLITCH = 'GLITCH',
}