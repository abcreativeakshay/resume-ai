import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, TemplateType, ThemeConfig } from '../types';
import { parseResumeContent, CombinedInput } from '../services/geminiService';
import { getTemplateComponent } from './ResumeTemplates';
// @ts-ignore
import { asBlob } from 'html-docx-js-typescript';
// @ts-ignore
import saveAs from 'file-saver';

// --- INITIAL CONSTANTS & SAMPLE DATA ---
const SAMPLE_DATA: ResumeData = {
  personalInfo: {
    fullName: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/arivera"
  },
  summary: "Creative and detail-oriented Software Engineer with 5+ years of experience. I specialize in building scalable web applications and intuitive user interfaces.",
  variations: {
    summaryCreative: "I weave code into compelling user stories. As a Software Engineer, I treat every pixel as a promise kept to the user.",
    summaryCorporate: "Results-driven Software Engineer with 5 years of tenure in high-paced agile environments. Committed to operational excellence.",
    summaryTechnical: "Full-stack engineer proficient in React, Node.js, and AWS. Architected 15+ scalable microservices."
  },
  experience: [
    {
      role: "Senior Frontend Engineer",
      company: "TechNova Solutions",
      duration: "2021 - Present",
      description: [
        "Orchestrated a team of 4 developers to rebuild the core dashboard using React, improving load times by 40%.",
        "Engineered a comprehensive design system using Tailwind CSS, ensuring visual consistency across 15+ products."
      ]
    },
    {
      role: "Web Developer",
      company: "Creative Pulse Agency",
      duration: "2018 - 2021",
      description: [
        "Developed responsive websites for diverse clients including e-commerce and non-profit organizations.",
        "Collaborated with designers to translate Figma prototypes into pixel-perfect, accessible code."
      ]
    }
  ],
  projects: [
     {
        name: "E-Commerce Dashboard",
        description: "Built a real-time analytics dashboard for store owners to track sales and inventory.",
        technologies: ["React", "D3.js", "Firebase"],
        link: "github.com/alexr/dashboard"
     },
     {
        name: "TaskMaster AI",
        description: "An AI-powered todo list that prioritizes tasks based on deadlines and complexity.",
        technologies: ["TypeScript", "OpenAI API", "Node.js"],
        link: "taskmaster.io"
     }
  ],
  education: [
    { degree: "B.S. Computer Science", school: "University of California, Berkeley", year: "2018" }
  ],
  skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL", "AWS"],
  critique: {
    score: 85,
    feedback: ["Strong action verbs used.", "Good quantification of results.", "Clean layout."],
    improvementPlan: "Add more specific certifications or awards to stand out further.",
    missingKeywords: ["Docker", "Kubernetes", "CI/CD"],
    analysis: {
        tone: "Professional",
        grammarScore: 98,
        employmentGaps: ["No gaps detected"],
        actionVerbStrength: "Strong",
        quantificationScore: 80,
        projectComplexity: "High"
    }
  },
  careerTools: {
    coverLetter: "Dear Hiring Manager,\n\nI am writing to express my strong interest...",
    interviewPrep: [
        { question: "Tell me about a time you optimized a slow application.", answer: "Focus on the 40% load time...", type: 'Behavioral' },
        { question: "Explain the virtual DOM.", answer: "The Virtual DOM is a lightweight copy...", type: 'Technical' }
    ],
    linkedinHeadline: "Senior Frontend Engineer | React & TypeScript Expert",
    linkedinAbout: "Passionate Senior Frontend Engineer with 5+ years of experience...",
    coldEmailRecruiter: "Hi [Name], I'm a Senior Engineer admiring your work at [Company]...",
    linkedinPostOpenToWork: "🚀 Exciting news! I'm officially looking for my next challenge in Frontend Engineering...",
    twitterBio: "Building the web pixel by pixel. Sr. Frontend Engineer. #ReactJS",
    websiteBio: "Hi, I'm Alex. I build accessible, performant web applications.",
    githubReadmeSnippet: "## Hi there 👋\nI'm Alex, a Frontend Engineer...",
    salaryEstimation: "$140,000 - $180,000",
    suggestedCertifications: ["AWS Certified Developer", "Meta Frontend Developer"],
    suggestedRoles: ["Frontend Architect", "Full Stack Developer", "UI Engineer"],
    softSkills: ["Mentorship", "Communication", "Agile Leadership"],
    spanishSummary: "Ingeniero de software creativo y orientado a los detalles..."
  }
};

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
}

type TabName = 'github' | 'text' | 'file' | 'job';

const COLORS = ['#29B5E8', '#000000', '#DC2626', '#16A34A', '#D97706', '#7C3AED', '#DB2777', '#FFFFFF'];
const FONTS = ['sans', 'serif', 'mono', 'display', 'slab', 'oswald', 'lato'];

export const ResumeBuilder: React.FC = () => {
  // --- Data State ---
  const [inputText, setInputText] = useState<string>("");
  const [inputJob, setInputJob] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [githubUsername, setGithubUsername] = useState<string>("");
  const [fetchedRepos, setFetchedRepos] = useState<GithubRepo[]>([]);
  const [selectedRepoIds, setSelectedRepoIds] = useState<Set<number>>(new Set());
  
  // --- App State ---
  const [activeInputTab, setActiveInputTab] = useState<TabName>('github'); 
  const [resumeData, setResumeData] = useState<ResumeData>(SAMPLE_DATA);
  const [theme, setTheme] = useState<ThemeConfig>({ color: '#29B5E8', font: 'sans' });
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(TemplateType.EXECUTIVE);
  const [activeMainTab, setActiveMainTab] = useState<'input' | 'customize' | 'career'>('input');
  const [previewMode, setPreviewMode] = useState<'resume' | 'coverLetter'>('resume');
  const [showConfetti, setShowConfetti] = useState(false);
  
  // --- Status State ---
  const [isFetchingList, setIsFetchingList] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>("INITIALIZING AI AGENT...");
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Auto-Save Effect (Local Storage) ---
  useEffect(() => {
    const saved = localStorage.getItem('resumeData_v4');
    if (saved) {
      try { setResumeData(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('resumeData_v4', JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    if (showConfetti) {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // --- Helpers ---
  const hasGithubData = selectedRepoIds.size > 0;
  const hasTextData = inputText.trim().length > 0;
  const hasFileData = selectedFile !== null;
  const hasJobData = inputJob.trim().length > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
        setError("Please upload a PDF or TXT file.");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleFetchRepoList = async () => {
    if (!githubUsername.trim()) { setError("Please enter a GitHub username."); return; }
    setIsFetchingList(true); setError(null); setFetchedRepos([]);
    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=pushed&per_page=30`);
        if (!response.ok) throw new Error("Failed to fetch repositories.");
        const data = await response.json();
        const mapped: GithubRepo[] = data.map((r: any) => ({
            id: r.id, name: r.name, description: r.description || "", language: r.language, stars: r.stargazers_count, url: r.html_url
        }));
        setFetchedRepos(mapped);
        setSelectedRepoIds(new Set(mapped.slice(0, 5).map(r => r.id)));
    } catch (e: any) { setError(e.message); } finally { setIsFetchingList(false); }
  };

  const toggleRepo = (id: number) => {
      const next = new Set(selectedRepoIds);
      if (next.has(id)) next.delete(id); else next.add(id);
      setSelectedRepoIds(next);
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleGenerate = async () => {
    if (!hasGithubData && !hasTextData && !hasFileData) {
        setError("Please provide at least one input source."); return;
    }
    setIsGenerating(true); setError(null); setShowConfetti(false);

    try {
      const inputs: CombinedInput = {};
      if (hasJobData) inputs.jobDescription = inputJob;

      if (hasGithubData) {
         setLoadingStatus("SCANNING REPOSITORIES...");
         const selectedRepos = fetchedRepos.filter(r => selectedRepoIds.has(r.id));
         const reposWithReadme = await Promise.all(selectedRepos.map(async (r) => {
            let readmeContent = "";
            try {
              const res = await fetch(`https://api.github.com/repos/${githubUsername}/${r.name}/readme`, { headers: { 'Accept': 'application/vnd.github.raw' }});
              if (res.ok) readmeContent = (await res.text()).substring(0, 4000);
            } catch (e) {}
            return { ...r, readmeContent };
         }));
         inputs.githubData = JSON.stringify({ username: githubUsername, repositories: reposWithReadme }, null, 2);
      }

      if (hasFileData && selectedFile) {
        setLoadingStatus("PARSING DOCUMENTS...");
        if (selectedFile.type === 'text/plain') inputs.text = (inputs.text || "") + "\n\n" + await readFileAsText(selectedFile);
        else inputs.file = { mimeType: selectedFile.type, data: await readFileAsBase64(selectedFile) };
      }

      if (hasTextData) inputs.text = (inputs.text ? inputs.text + "\n\n" : "") + inputText;

      setLoadingStatus("ANALYZING CAREER DATA...");
      const resultData = await parseResumeContent(inputs);
      setResumeData(resultData);
      setActiveMainTab('customize');
      setPreviewMode('resume');
      setShowConfetti(true);
    } catch (err: any) { setError(err.message || "Generation failed."); } finally { setIsGenerating(false); }
  };

  const handlePrint = () => {
    // Standard System Print (Vector Quality)
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('resume-preview-content');
    if (!element) return;
    
    // @ts-ignore
    const html2pdf = (window as any).html2pdf;
    if (typeof html2pdf !== 'function') {
        setError("PDF Generator not ready. Please refresh.");
        return;
    }

    setLoadingStatus("GENERATING PDF...");
    setIsGenerating(true);

    try {
        // Clone the element to avoid messing with the live view
        const clone = element.cloneNode(true) as HTMLElement;
        
        // Reset scaling and positioning on the clone for the PDF generator
        clone.style.transform = 'none';
        clone.style.margin = '0';
        clone.style.width = '210mm'; 
        clone.style.minHeight = '297mm';
        clone.style.boxShadow = 'none';
        
        // Ensure the clone is visible for html2canvas but not to user
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.appendChild(clone);
        document.body.appendChild(container);

        const opt = {
            margin: 0,
            filename: `Resume_${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(clone).save();
        
        // Cleanup
        document.body.removeChild(container);
    } catch (e: any) {
        console.error(e);
        setError("PDF generation failed. Please use 'Print' -> 'Save as PDF' instead.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSendEmail = () => {
    const email = resumeData.personalInfo.email;
    if (!email) {
        setError("No email address found in Personal Info. Please generate or edit the resume.");
        return;
    }
    
    // Construct a rich text body for the email
    const subject = encodeURIComponent(`Resume Draft: ${resumeData.personalInfo.fullName}`);
    const bodyText = `Hi ${resumeData.personalInfo.fullName},

Here is the content of your generated resume:

SUMMARY
${resumeData.summary}

LINKS
${resumeData.personalInfo.linkedin || ''}
${resumeData.personalInfo.website || ''}

(Note: To attach the formatted PDF, please download it from the app and attach it to this email manually.)

Generated by ResumeAI Builder`;

    const body = encodeURIComponent(bodyText);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleDownloadDocx = async () => {
    const element = document.getElementById('resume-preview-content');
    if (!element) {
        setError("Preview not found.");
        return;
    }

    try {
        setLoadingStatus("CONVERTING...");
        setIsGenerating(true);

        // Capture styles (Tailwind CDN)
        let cssString = "";
        const styleTags = document.querySelectorAll('style');
        styleTags.forEach(tag => { cssString += tag.innerHTML; });

        // Construct full HTML for conversion
        const htmlString = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <style>
                    ${cssString}
                    body { font-family: sans-serif; background: white; color: black; }
                    /* Force black text for print/doc */
                    * { -webkit-print-color-adjust: exact; }
                </style>
            </head>
            <body>
                ${element.outerHTML}
            </body>
            </html>
        `;

        const buffer = await asBlob(htmlString, {
            orientation: 'portrait',
            margins: { top: 720, right: 720, bottom: 720, left: 720 }
        });

        saveAs(buffer, `Resume_${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}.docx`);
    } catch (e: any) {
        console.error(e);
        setError("DOCX conversion failed. Try PDF export.");
    } finally {
        setIsGenerating(false);
    }
  };

  const renderTemplate = () => {
    const props = { data: resumeData, theme };
    
    // --- COVER LETTER MODE ---
    if (previewMode === 'coverLetter' && resumeData.careerTools?.coverLetter) {
        return (
            <div className={`w-full h-full bg-white text-gray-900 p-16 ${theme.font === 'serif' ? 'font-serif' : 'font-sans'} leading-relaxed`}>
                <header className="mb-12 border-b pb-8" style={{ borderColor: theme.color }}>
                    <h1 className="text-3xl font-bold mb-2 uppercase tracking-wide" style={{ color: theme.color }}>{resumeData.personalInfo.fullName}</h1>
                    <div className="text-sm text-gray-500 space-x-3">
                        <span>{resumeData.personalInfo.email}</span>
                        <span>•</span>
                        <span>{resumeData.personalInfo.phone}</span>
                    </div>
                </header>
                <div className="whitespace-pre-wrap text-base text-gray-800 text-justify">
                    {resumeData.careerTools.coverLetter}
                </div>
            </div>
        );
    }

    // --- RESUME MODE ---
    const TemplateComponent = getTemplateComponent(selectedTemplate);
    return <TemplateComponent {...props} />;
  };

  // --- RENDER ---
  return (
    <div className="flex h-full w-full font-sans text-gray-100 overflow-hidden relative selection:bg-snow selection:text-black">
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex justify-center">
             <div className="absolute top-0 w-2 h-2 bg-snow rounded-full animate-[fall_3s_ease-in-out_infinite] left-[10%] opacity-80"></div>
             <div className="absolute top-0 w-3 h-3 bg-white rounded-full animate-[fall_2.5s_ease-in-out_infinite] left-[30%] opacity-60"></div>
             <div className="absolute top-0 w-2 h-2 bg-snow-light rounded-full animate-[fall_3.2s_ease-in-out_infinite] left-[50%] opacity-90"></div>
             <div className="absolute top-0 w-2 h-2 bg-white rounded-full animate-[fall_2.8s_ease-in-out_infinite] left-[70%] opacity-70"></div>
             <div className="absolute top-0 w-3 h-3 bg-snow rounded-full animate-[fall_3.5s_ease-in-out_infinite] left-[90%] opacity-80"></div>
             <style>{`@keyframes fall { 0% { transform: translateY(-10px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`}</style>
        </div>
      )}

      {/* --- LEFT SIDEBAR (BUILDER SPECIFIC) --- */}
      <aside className="w-[420px] flex-shrink-0 bg-black border-r border-gray-800 flex flex-col no-print z-20 overflow-hidden relative">
        
        {/* Header Branding */}
        <div className="p-8 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-2">
             <h1 className="text-4xl font-black tracking-tighter text-white">
                <span className="text-white">[</span>RESUME<span className="text-white">]</span>
             </h1>
             <span className="text-2xl font-light text-snow">AI</span>
          </div>
          <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Global Career Builder</p>
        </div>

        {/* Main Tabs */}
        <div className="flex border-b border-gray-800">
          <button onClick={() => setActiveMainTab('input')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeMainTab === 'input' ? 'text-snow border-b-2 border-snow bg-gray-900' : 'text-gray-500 hover:text-white hover:bg-gray-900/50'}`}>Input</button>
          <button onClick={() => setActiveMainTab('customize')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeMainTab === 'customize' ? 'text-snow border-b-2 border-snow bg-gray-900' : 'text-gray-500 hover:text-white hover:bg-gray-900/50'}`}>Design</button>
          <button onClick={() => setActiveMainTab('career')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeMainTab === 'career' ? 'text-snow border-b-2 border-snow bg-gray-900' : 'text-gray-500 hover:text-white hover:bg-gray-900/50'}`}>Tools</button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-black">
          
          {/* --- TAB: INPUTS --- */}
          {activeMainTab === 'input' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'github', label: 'Git', icon: 'M16 8C16 3.58 12.42 0 8 0 3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8z' },
                  { id: 'text', label: 'Text', icon: 'M4 4h16v16H4z' }, 
                  { id: 'file', label: 'File', icon: 'M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z' },
                  { id: 'job', label: 'Target', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveInputTab(tab.id as TabName)}
                    className={`tech-card flex flex-col items-center justify-center py-3 rounded text-[10px] font-bold tracking-wider uppercase transition-all ${activeInputTab === tab.id ? 'border-snow text-snow bg-gray-900' : 'text-gray-500 hover:text-white'}`}
                  >
                    <span className="mb-1">{tab.label}</span>
                    {(tab.id === 'github' && hasGithubData) || (tab.id === 'text' && hasTextData) || (tab.id === 'file' && hasFileData) || (tab.id === 'job' && hasJobData) ? <div className="w-1.5 h-1.5 rounded-full bg-snow shadow-[0_0_8px_#29B5E8]"></div> : null}
                  </button>
                ))}
              </div>

              {/* Dynamic Input Area */}
              <div className="min-h-[320px]">
                {activeInputTab === 'github' && (
                  <>
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest border-l-2 border-snow pl-2">GitHub Sources</h3>
                    <div className="flex gap-2 mb-4">
                        <input value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} placeholder="GitHub Username" className="flex-1 bg-gray-900 border border-gray-700 rounded p-3 text-sm text-white focus:border-snow focus:outline-none placeholder-gray-600 font-mono" onKeyDown={(e) => e.key === 'Enter' && handleFetchRepoList()} />
                        <button onClick={handleFetchRepoList} disabled={isFetchingList} className="bg-gray-800 text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-gray-700 disabled:opacity-50 border border-gray-700">Fetch</button>
                    </div>
                    <div className="space-y-2 h-[220px] overflow-y-auto custom-scrollbar">
                      {fetchedRepos.map(r => (
                        <div key={r.id} onClick={() => toggleRepo(r.id)} className={`p-3 rounded border cursor-pointer transition-all flex justify-between items-center ${selectedRepoIds.has(r.id) ? 'bg-snow/10 border-snow' : 'bg-transparent border-gray-800 hover:border-gray-600'}`}>
                          <div className="overflow-hidden">
                             <div className="text-sm font-bold text-white truncate">{r.name}</div>
                             <div className="text-xs text-gray-500 truncate font-mono">{r.language} • {r.stars} ★</div>
                          </div>
                          {selectedRepoIds.has(r.id) && <span className="text-snow font-bold">✓</span>}
                        </div>
                      ))}
                      {fetchedRepos.length === 0 && <div className="text-center text-gray-600 text-xs mt-10 font-mono">ENTER USERNAME TO SCAN REPOS</div>}
                    </div>
                  </>
                )}
                
                {activeInputTab === 'job' && (
                  <>
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest border-l-2 border-snow pl-2">Target Role</h3>
                    <div className="bg-gray-900/50 text-gray-400 text-xs p-3 rounded mb-3 border border-gray-800 font-mono">
                        > Paste the JD here.<br/>> Agent will analyze keywords.
                    </div>
                    <textarea value={inputJob} onChange={(e) => setInputJob(e.target.value)} className="w-full h-56 bg-gray-900 border border-gray-700 rounded p-3 text-sm text-white focus:border-snow outline-none resize-none font-mono leading-relaxed" placeholder="// Paste Job Description..." />
                  </>
                )}

                {activeInputTab === 'text' && (
                  <>
                     <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest border-l-2 border-snow pl-2">Manual Data</h3>
                     <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full h-72 bg-gray-900 border border-gray-700 rounded p-3 text-sm text-white focus:border-snow outline-none resize-none font-mono leading-relaxed" placeholder="// Paste resume text..." />
                  </>
                )}

                {activeInputTab === 'file' && (
                   <div className="h-72 flex flex-col items-center justify-center border border-dashed border-gray-700 rounded-lg hover:border-snow hover:bg-gray-900/50 transition-all cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.txt" onChange={handleFileChange} />
                      <div className="text-4xl mb-3 text-gray-600 group-hover:text-snow transition-colors">{selectedFile ? '📄' : 'DATA'}</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-400">{selectedFile ? selectedFile.name : 'Upload PDF / TXT'}</div>
                      {selectedFile && <button className="text-[10px] text-red-500 mt-4 hover:underline uppercase" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}>Remove Source</button>}
                   </div>
                )}
              </div>

              {error && <div className="p-3 bg-red-900/20 border-l-2 border-red-500 text-red-400 text-xs font-mono">{error}</div>}

              <button onClick={handleGenerate} disabled={isGenerating} className="btn-snow w-full py-4 text-sm shadow-[0_0_20px_rgba(41,181,232,0.3)]">
                {isGenerating ? <span className="animate-pulse">{loadingStatus}</span> : <span>GENERATE NOW</span>}
              </button>
            </div>
          )}

          {/* --- TAB: DESIGN & ANALYTICS --- */}
          {activeMainTab === 'customize' && (
            <div className="space-y-8 animate-fadeIn">
               
               {/* AI Scorecard & Deep Analytics */}
               {resumeData.critique && (
                 <div className="tech-card rounded-lg p-5 relative overflow-hidden space-y-4">
                    <div className="flex justify-between items-start">
                       <div>
                            <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-1">AI Audit</h3>
                            <p className="text-[10px] text-gray-400 font-mono">Optimization Score</p>
                       </div>
                       <div className="text-4xl font-black text-white">{resumeData.critique.score}</div>
                    </div>
                    
                    {/* Simplified Analytics View */}
                    {resumeData.critique.analysis && (
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                                <div className="text-[9px] text-gray-500 uppercase font-bold">Tone</div>
                                <div className="text-xs text-snow font-bold">{resumeData.critique.analysis.tone}</div>
                            </div>
                            <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                                <div className="text-[9px] text-gray-500 uppercase font-bold">Grammar</div>
                                <div className="text-xs text-green-400 font-bold">{resumeData.critique.analysis.grammarScore}/100</div>
                            </div>
                        </div>
                    )}
                 </div>
               )}

               {/* View Toggle */}
               <div className="flex bg-gray-900 p-1 rounded">
                    <button onClick={() => setPreviewMode('resume')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${previewMode === 'resume' ? 'bg-gray-800 text-white shadow' : 'text-gray-600 hover:text-gray-400'}`}>Resume</button>
                    <button onClick={() => setPreviewMode('coverLetter')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${previewMode === 'coverLetter' ? 'bg-gray-800 text-white shadow' : 'text-gray-600 hover:text-gray-400'}`}>Cover Letter</button>
               </div>

               <div>
                 <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Templates (20 Styles)</label>
                 <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar border border-gray-800 rounded p-2">
                    {Object.values(TemplateType).map(t => (
                      <button key={t} onClick={() => setSelectedTemplate(t)} className={`p-3 rounded border text-left text-[10px] font-bold uppercase tracking-wide transition-all ${selectedTemplate === t ? 'bg-snow/10 border-snow text-snow' : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-600'}`}>
                        {t}
                      </button>
                    ))}
                 </div>
               </div>

               {/* Typography Config */}
               <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Typography</label>
                  <div className="flex flex-wrap gap-2">
                      {FONTS.map(f => (
                          <button key={f} onClick={() => setTheme({...theme, font: f as any})} className={`px-2 py-1 text-[10px] uppercase border rounded ${theme.font === f ? 'bg-white text-black border-white' : 'border-gray-700 text-gray-500'}`}>
                              {f}
                          </button>
                      ))}
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Accent Color</label>
                  <div className="flex flex-wrap gap-3">
                     {COLORS.map(c => (
                       <button key={c} onClick={() => setTheme({ ...theme, color: c })} className={`w-6 h-6 rounded-full transition-transform hover:scale-125 ${theme.color === c ? 'ring-2 ring-white scale-125' : 'ring-1 ring-gray-700'}`} style={{ backgroundColor: c }} />
                     ))}
                  </div>
               </div>

               <div className="space-y-2">
                 <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleDownloadPDF} disabled={isGenerating} className="py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded hover:bg-gray-200 transition-colors shadow flex items-center justify-center gap-2">
                        {isGenerating ? 'Generating...' : 'Download PDF'}
                    </button>
                    <button onClick={handlePrint} className="py-3 bg-gray-800 text-white font-bold uppercase tracking-widest text-[10px] rounded hover:bg-gray-700 transition-colors shadow flex items-center justify-center gap-2">
                        Print / Save PDF
                    </button>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleDownloadDocx} disabled={isGenerating} className="py-3 bg-blue-600 text-white font-bold uppercase tracking-widest text-[10px] rounded hover:bg-blue-500 transition-colors shadow flex items-center justify-center gap-2">
                        Download DOCX
                    </button>
                    <button onClick={handleSendEmail} className="py-3 bg-green-600 text-white font-bold uppercase tracking-widest text-[10px] rounded hover:bg-green-500 transition-colors shadow flex items-center justify-center gap-2">
                        Send to Email
                    </button>
                 </div>
               </div>
            </div>
          )}

          {/* --- TAB: CAREER KIT & NEW TOOLS --- */}
          {activeMainTab === 'career' && resumeData.careerTools && (
             <div className="space-y-6 animate-fadeIn">
                
                {/* 1. Strategy & Market Value */}
                <div className="tech-card rounded-lg p-4">
                   <h3 className="text-xs font-bold text-snow mb-4 flex items-center gap-2 uppercase tracking-widest">
                       Strategic Value
                   </h3>
                   <div className="space-y-3">
                       <div className="bg-gray-900 p-3 rounded border border-gray-800">
                            <label className="text-[10px] text-gray-500 uppercase font-bold">Estimated Market Salary</label>
                            <div className="text-lg text-white font-mono">{resumeData.careerTools.salaryEstimation}</div>
                       </div>
                       <div className="bg-gray-900 p-3 rounded border border-gray-800">
                            <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Recommended Certifications</label>
                            <div className="flex flex-wrap gap-1">
                                {resumeData.careerTools.suggestedCertifications?.map((c, i) => (
                                    <span key={i} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">{c}</span>
                                ))}
                            </div>
                       </div>
                   </div>
                </div>

                {/* 2. Content Variations */}
                {resumeData.variations && (
                    <div className="tech-card rounded-lg p-4">
                        <h3 className="text-xs font-bold text-snow mb-4 flex items-center gap-2 uppercase tracking-widest">
                            Elevator Pitches
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-gray-900 p-3 rounded border border-gray-800">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Creative Story</div>
                                <div className="text-xs text-gray-300 font-serif italic">"{resumeData.variations.summaryCreative}"</div>
                            </div>
                            <div className="bg-gray-900 p-3 rounded border border-gray-800">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Corporate Formal</div>
                                <div className="text-xs text-gray-300">"{resumeData.variations.summaryCorporate}"</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Outreach & Social */}
                <div className="tech-card rounded-lg p-4">
                   <h3 className="text-xs font-bold text-snow mb-4 flex items-center gap-2 uppercase tracking-widest">
                       Outreach Kit
                   </h3>
                   <div className="space-y-4">
                       <ToolItem label="Cold Email Draft" content={resumeData.careerTools.coldEmailRecruiter} />
                       <ToolItem label="LinkedIn 'Open to Work'" content={resumeData.careerTools.linkedinPostOpenToWork} />
                   </div>
                </div>
             </div>
          )}

          {activeMainTab === 'career' && !resumeData.careerTools && (
              <div className="text-center text-gray-600 text-xs py-10 font-mono border border-dashed border-gray-800 rounded">
                  [NO DATA GENERATED]
              </div>
          )}

        </div>
      </aside>

      {/* --- RIGHT PREVIEW AREA --- */}
      <main className="flex-1 bg-tech-grid relative overflow-hidden flex flex-col items-center justify-center">
         
         {/* Main Preview Container */}
         <div className="flex-1 w-full overflow-y-auto p-8 flex justify-center z-10 print-container custom-scrollbar">
            {/* The Paper */}
            <div id="resume-preview-content" className="bg-white w-[210mm] min-h-[297mm] flex flex-col origin-top transform scale-[0.55] sm:scale-[0.65] md:scale-[0.75] lg:scale-[0.85] xl:scale-[0.9] transition-transform duration-500 ease-out shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               {renderTemplate()}
            </div>
         </div>
      </main>

    </div>
  );
};

// Helper Component for Tools
const ToolItem = ({ label, content }: { label: string, content: string }) => (
    <div>
        <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">{label}</label>
        <div className="bg-gray-900 p-3 rounded text-xs text-gray-300 border border-gray-800 relative group font-mono leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
            {content}
            <button onClick={() => navigator.clipboard.writeText(content)} className="absolute right-2 top-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 rounded">COPY</button>
        </div>
    </div>
);