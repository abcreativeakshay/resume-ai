import React from 'react';
import { ResumeData, ThemeConfig, TemplateType } from '../types';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

const getFontClass = (font: string) => {
  switch (font) {
    case 'serif': return 'font-serif';
    case 'mono': return 'font-mono';
    case 'display': return 'font-display';
    case 'slab': return 'font-slab';
    case 'lato': return 'font-lato';
    case 'oswald': return 'font-oswald';
    default: return 'font-sans';
  }
};

// --- HELPER ---
const RenderBullets = ({ items }: { items: string[] }) => {
    if (!items || items.length === 0) return null;
    return (
        <ul className="list-disc ml-4 space-y-1 mt-1 opacity-90 text-justify">
            {items.map((item, i) => (
                <li key={i} className="text-inherit leading-relaxed pl-1">{item}</li>
            ))}
        </ul>
    );
};

// --- CLASSIC TEMPLATES ---

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.font);
  return (
    <div className={`w-full min-h-full bg-white text-gray-900 p-10 leading-normal ${fontClass}`}>
      <header className="border-b-2 pb-6 mb-6" style={{ borderColor: theme.color }}>
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-3" style={{ color: theme.color }}>{data.personalInfo.fullName}</h1>
        <div className="text-sm text-gray-700 flex flex-wrap gap-y-1 gap-x-4 font-medium">
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.email && <span className="text-black">| {data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span className="text-black">| {data.personalInfo.phone}</span>}
          {data.personalInfo.linkedin && <span className="text-black">| {data.personalInfo.linkedin}</span>}
        </div>
      </header>
      
      {data.summary && <section className="mb-6"><p className="text-gray-800 text-justify leading-relaxed">{data.summary}</p></section>}
      
      <section className="mb-8">
        <h2 className="font-bold text-lg uppercase tracking-wider mb-4 border-b pb-1" style={{ borderColor: theme.color }}>Experience</h2>
        {(data.experience || []).map((e,i)=>(
            <div key={i} className="mb-5 break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-lg">{e.role}</h3>
                    <span className="text-sm font-medium text-gray-600">{e.duration}</span>
                </div>
                <div className="text-sm italic font-semibold text-gray-700 mb-2">{e.company}</div>
                <div className="text-sm text-gray-700"><RenderBullets items={e.description} /></div>
            </div>
        ))}
      </section>

      {(data.projects || []).length > 0 && <section className="mb-8">
        <h2 className="font-bold text-lg uppercase tracking-wider mb-4 border-b pb-1" style={{ borderColor: theme.color }}>Projects</h2>
        {data.projects.slice(0, 5).map((p,i)=>(
            <div key={i} className="mb-4 break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base">{p.name}</h3>
                    {p.link && <span className="text-sm text-blue-600 underline">{p.link}</span>}
                </div>
                <div className="text-xs font-bold text-gray-500 mb-1 italic">{p.technologies.join(', ')}</div>
                <p className="text-sm text-gray-700 text-justify leading-relaxed">{p.description}</p>
            </div>
        ))}
      </section>}

      <section className="mb-8">
          <h2 className="font-bold text-lg uppercase tracking-wider mb-4 border-b pb-1" style={{ borderColor: theme.color }}>Education</h2>
          {(data.education || []).map((e,i)=>(
              <div key={i} className="mb-2 break-inside-avoid">
                  <div className="flex justify-between">
                      <span className="font-bold">{e.school}</span>
                      <span className="text-sm">{e.year}</span>
                  </div>
                  <div className="text-sm">{e.degree}</div>
              </div>
          ))}
      </section>

      <section className="mb-8 break-inside-avoid">
          <h2 className="font-bold text-lg uppercase tracking-wider mb-4 border-b pb-1" style={{ borderColor: theme.color }}>Skills</h2>
          <p className="text-sm text-gray-700 text-justify leading-relaxed">
              {(data.skills || []).join(' • ')}
          </p>
      </section>
    </div>
  );
};

export const ElegantTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
    <div className={`p-12 bg-white min-h-full ${getFontClass('serif')} text-gray-800`}>
        <div className="text-center mb-10">
            <h1 className="text-4xl italic mb-3 font-bold" style={{ color: theme.color }}>{data.personalInfo.fullName}</h1>
            <div className="text-sm text-gray-500 uppercase tracking-widest">{data.personalInfo.location} • {data.personalInfo.email}</div>
        </div>
        <hr className="w-16 mx-auto border-t-2 mb-10" style={{ borderColor: theme.color }}/>
        
        <p className="text-center italic mb-10 max-w-xl mx-auto text-gray-600 text-justify leading-relaxed">{data.summary}</p>
        
        <div className="grid grid-cols-1 gap-8">
            <section>
                <h3 className="text-center text-sm font-bold uppercase tracking-widest mb-6 text-gray-400">Professional History</h3>
                {(data.experience || []).map((e,i) => (
                    <div key={i} className="mb-8 break-inside-avoid">
                        <div className="text-center mb-2">
                            <div className="font-bold text-lg">{e.company}</div>
                            <div className="text-sm italic">{e.role}</div>
                            <div className="text-xs text-gray-400 mt-1">{e.duration}</div>
                        </div>
                        <div className="text-sm text-justify max-w-2xl mx-auto"><RenderBullets items={e.description} /></div>
                    </div>
                ))}
            </section>
            {(data.projects || []).length > 0 && <section>
                <h3 className="text-center text-sm font-bold uppercase tracking-widest mb-6 text-gray-400">Selected Projects</h3>
                {data.projects.slice(0, 5).map((p,i) => (
                    <div key={i} className="mb-6 max-w-2xl mx-auto break-inside-avoid">
                        <div className="text-center mb-1">
                             <div className="font-bold text-base">{p.name}</div>
                             <div className="text-xs text-gray-500 italic">{p.technologies.join(' / ')}</div>
                        </div>
                        <p className="text-sm text-gray-600 text-justify leading-relaxed">{p.description}</p>
                    </div>
                ))}
            </section>}
            
            <section>
                 <h3 className="text-center text-sm font-bold uppercase tracking-widest mb-6 text-gray-400">Skills & Education</h3>
                 <div className="text-center max-w-xl mx-auto mb-6">
                    <p className="italic text-gray-700 leading-loose">{(data.skills || []).join(' • ')}</p>
                 </div>
                 <div className="text-center space-y-2">
                    {(data.education || []).map((e,i) => (
                        <div key={i} className="text-sm">
                            <span className="font-bold">{e.school}</span>, {e.degree}
                        </div>
                    ))}
                 </div>
            </section>
        </div>
    </div>
);

// --- MODERN TEMPLATES ---

const TimelineTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-white p-10 ${getFontClass(theme.font)}`}>
    <header className="flex justify-between items-center mb-10 border-b pb-6">
       <div>
         <h1 className="text-5xl font-bold text-gray-800">{data.personalInfo.fullName}</h1>
         <p className="text-lg text-gray-500 mt-2">{data.personalInfo.location} • {data.personalInfo.email}</p>
       </div>
       <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg" style={{ backgroundColor: theme.color }}>
          {data.personalInfo.fullName.charAt(0)}
       </div>
    </header>
    <div className="mb-8"><p className="text-gray-600 text-justify leading-relaxed">{data.summary}</p></div>
    <div className="relative border-l-2 border-gray-200 ml-4 space-y-10 pl-8 pb-4">
        {(data.experience || []).map((exp, i) => (
            <div key={i} className="relative group break-inside-avoid">
                <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-white transition-transform group-hover:scale-125" style={{ backgroundColor: theme.color }}></div>
                <h3 className="text-xl font-bold">{exp.role}</h3>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{exp.company} | {exp.duration}</div>
                <div className="text-gray-600 text-sm"><RenderBullets items={exp.description} /></div>
            </div>
        ))}
    </div>
    
    {(data.projects || []).length > 0 && <div className="mt-8 ml-4 pl-8">
        <h3 className="font-bold text-xl mb-6 uppercase tracking-widest text-gray-400">Projects</h3>
        {data.projects.slice(0, 5).map((p,i) => (
            <div key={i} className="mb-6 border-b pb-4 last:border-0 break-inside-avoid">
                <div className="flex justify-between items-center mb-1">
                     <div className="font-bold text-lg">{p.name}</div>
                     <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{p.technologies.join(', ')}</div>
                </div>
                <p className="text-sm text-gray-600 text-justify leading-relaxed">{p.description}</p>
            </div>
        ))}
    </div>}

    <div className="grid grid-cols-2 gap-8 mt-10 border-t pt-8 bg-gray-50 -mx-10 px-10 pb-10 -mb-10 break-inside-avoid">
        <div>
            <h3 className="font-bold mb-4 uppercase tracking-widest text-gray-400">Education</h3>
            {(data.education || []).map((e,i)=>(<div key={i} className="mb-2 font-bold text-gray-700">{e.school}<span className="block text-sm font-normal text-gray-500">{e.degree}</span></div>))}
        </div>
        <div>
            <h3 className="font-bold mb-4 uppercase tracking-widest text-gray-400">Skills</h3>
            <div className="flex flex-wrap gap-2">{(data.skills || []).map((s,i)=><span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold shadow-sm">{s}</span>)}</div>
        </div>
    </div>
  </div>
);

const GridTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-gray-50 p-8 grid grid-cols-12 gap-6 ${getFontClass(theme.font)}`}>
     <header className="col-span-12 bg-white p-8 rounded shadow-sm border-t-4" style={{ borderColor: theme.color }}>
        <h1 className="text-4xl font-bold">{data.personalInfo.fullName}</h1>
        <div className="text-sm text-gray-500 mt-2">{data.personalInfo.email} • {data.personalInfo.phone}</div>
        <p className="mt-4 text-gray-600 max-w-3xl text-justify leading-relaxed">{data.summary}</p>
     </header>
     <div className="col-span-8 space-y-6">
        <section className="bg-white p-6 rounded shadow-sm">
           <h3 className="font-bold uppercase text-sm mb-4 text-gray-400">Experience</h3>
           {(data.experience || []).map((exp, i) => (
               <div key={i} className="mb-6 last:mb-0 border-b last:border-0 pb-6 last:pb-0 border-gray-100 break-inside-avoid">
                   <div className="flex justify-between items-center"><span className="font-bold text-lg">{exp.role}</span><span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{exp.duration}</span></div>
                   <div className="text-sm font-bold mb-3" style={{ color: theme.color }}>{exp.company}</div>
                   <div className="text-sm text-gray-600"><RenderBullets items={exp.description} /></div>
               </div>
           ))}
        </section>
        {(data.projects || []).length > 0 && <section className="bg-white p-6 rounded shadow-sm">
           <h3 className="font-bold uppercase text-sm mb-4 text-gray-400">Projects</h3>
           {data.projects.slice(0,5).map((p, i) => (
               <div key={i} className="mb-4 break-inside-avoid">
                   <div className="flex justify-between"><span className="font-bold text-sm">{p.name}</span>{p.link && <span className="text-xs text-blue-500 underline">{p.link}</span>}</div>
                   <div className="text-xs text-gray-500 mb-1 italic">{p.technologies.join(', ')}</div>
                   <p className="text-xs text-gray-600 text-justify leading-relaxed">{p.description}</p>
               </div>
           ))}
        </section>}
     </div>
     <div className="col-span-4 space-y-6">
        <section className="bg-white p-6 rounded shadow-sm">
            <h3 className="font-bold uppercase text-sm mb-4 text-gray-400">Skills</h3>
            <div className="flex flex-wrap gap-2">{(data.skills || []).map((s,i) => <span key={i} className="text-xs border border-gray-200 px-2 py-1 rounded bg-gray-50">{s}</span>)}</div>
        </section>
        <section className="bg-white p-6 rounded shadow-sm">
            <h3 className="font-bold uppercase text-sm mb-4 text-gray-400">Education</h3>
            {(data.education || []).map((e,i) => <div key={i} className="text-sm mb-3"><strong>{e.degree}</strong><div className="text-gray-500">{e.school}</div><div className="text-xs text-gray-400">{e.year}</div></div>)}
        </section>
     </div>
  </div>
);

const StartupTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-white p-12 ${getFontClass('lato')}`}>
     <h1 className="text-6xl font-black mb-2 tracking-tighter" style={{ color: theme.color }}>{data.personalInfo.fullName.toLowerCase()}.</h1>
     <p className="text-xl text-gray-400 mb-12 border-l-4 border-black pl-4 text-justify leading-relaxed">{data.summary}</p>
     <div className="grid grid-cols-3 gap-12">
        <div className="col-span-1 border-t-2 pt-4 border-black h-fit">
            <h3 className="font-bold text-black mb-4 tracking-tight">CONTACT</h3>
            <p className="text-sm mb-1">{data.personalInfo.email}</p>
            <p className="text-sm mb-1">{data.personalInfo.phone}</p>
            <p className="text-sm">{data.personalInfo.linkedin}</p>
            
            <h3 className="font-bold text-black mt-8 mb-4 tracking-tight">SKILLS</h3>
            {(data.skills || []).map((s,i)=><div key={i} className="text-sm border-b border-gray-100 py-1">{s}</div>)}
            
            <h3 className="font-bold text-black mt-8 mb-4 tracking-tight">EDUCATION</h3>
            {(data.education || []).map((e,i)=><div key={i} className="text-sm mb-2 font-bold">{e.school}<br/><span className="font-normal text-gray-500">{e.degree}</span></div>)}
        </div>
        <div className="col-span-2 border-t-2 pt-4 border-black">
            <h3 className="font-bold text-black mb-6 tracking-tight">WORK HISTORY</h3>
            {(data.experience || []).map((exp, i) => (
                <div key={i} className="mb-10 break-inside-avoid">
                    <h4 className="text-3xl font-bold mb-1">{exp.role}</h4>
                    <div className="text-sm font-mono text-gray-500 mb-4 bg-gray-100 inline-block px-2 py-1">@{exp.company} // {exp.duration}</div>
                    <div className="text-gray-700 text-sm leading-relaxed"><RenderBullets items={exp.description} /></div>
                </div>
            ))}
            {(data.projects || []).length > 0 && <div className="mt-12">
                 <h3 className="font-bold text-black mb-6 tracking-tight">PROJECTS</h3>
                 {data.projects.slice(0,5).map((p,i) => (
                     <div key={i} className="mb-8 break-inside-avoid">
                         <div className="font-bold text-xl">{p.name}</div>
                         <div className="text-xs font-mono text-gray-400 mb-2">{p.technologies.join(' + ')}</div>
                         <p className="text-sm text-gray-700 text-justify leading-relaxed">{p.description}</p>
                     </div>
                 ))}
            </div>}
        </div>
     </div>
  </div>
);

const AcademicTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-white p-16 ${getFontClass('serif')} leading-relaxed text-gray-900`}>
     <div className="text-center border-b-2 border-gray-900 pb-6 mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-widest">{data.personalInfo.fullName}</h1>
        <p className="text-sm mt-3 font-medium">{data.personalInfo.location} | {data.personalInfo.email} | {data.personalInfo.phone}</p>
     </div>
     <section className="mb-8">
        <h2 className="text-md font-bold uppercase border-b border-gray-300 mb-4 pb-1">Education</h2>
        {(data.education || []).map((e,i) => <div key={i} className="mb-3 break-inside-avoid"><span className="font-bold">{e.school}</span>, {e.degree}, <span className="italic">{e.year}</span></div>)}
     </section>
     <section className="mb-8">
        <h2 className="text-md font-bold uppercase border-b border-gray-300 mb-4 pb-1">Professional Experience</h2>
        {(data.experience || []).map((e,i) => (
            <div key={i} className="mb-6 break-inside-avoid">
                <div className="flex justify-between font-bold text-lg"><span>{e.company}</span><span>{e.duration}</span></div>
                <div className="italic mb-2">{e.role}</div>
                <div className="text-sm ml-2"><RenderBullets items={e.description} /></div>
            </div>
        ))}
     </section>
     {(data.projects || []).length > 0 && <section className="mb-8">
        <h2 className="text-md font-bold uppercase border-b border-gray-300 mb-4 pb-1">Key Projects</h2>
        {data.projects.slice(0,5).map((p,i) => (
            <div key={i} className="mb-4 break-inside-avoid">
                <div className="font-bold text-base">{p.name} <span className="font-normal italic text-sm text-gray-600">({p.technologies.join(', ')})</span></div>
                <p className="text-sm text-justify mt-1">{p.description}</p>
            </div>
        ))}
     </section>}
     <section className="mb-8 break-inside-avoid">
        <h2 className="text-md font-bold uppercase border-b border-gray-300 mb-4 pb-1">Technical Skills</h2>
        <p className="text-sm text-justify leading-relaxed">{(data.skills || []).join(', ')}</p>
     </section>
  </div>
);

const TechTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-[#fdf6e3] text-[#657b83] p-10 ${getFontClass('mono')} text-sm`}>
     <header className="mb-8 border-b-2 border-dashed border-[#93a1a1] pb-6">
        <h1 className="text-2xl font-bold text-[#268bd2] mb-2">{`const candidate = "${data.personalInfo.fullName}";`}</h1>
        <div className="text-[#586e75]">{`// Contact: ${data.personalInfo.email}`}</div>
        <div className="text-[#586e75]">{`// Location: ${data.personalInfo.location}`}</div>
     </header>
     
     <div className="mb-8">
        <div className="text-[#d33682] font-bold mb-2">class Experience extends Career {'{'}</div>
        <div className="pl-6 border-l-2 border-[#eee8d5] ml-2 space-y-6">
            {(data.experience || []).map((e,i) => (
                <div key={i} className="break-inside-avoid">
                    <div className="text-[#b58900] font-bold">function {e.company.replace(/\s/g,'')}_{i}() {'{'}</div>
                    <div className="pl-4 text-[#859900]">// {e.role} ({e.duration})</div>
                    <div className="pl-4 text-[#2aa198]">
                        {e.description.map((d,j) => <div key={j} className="text-justify">log("{d}");</div>)}
                    </div>
                    <div className="text-[#b58900]">{'}'}</div>
                </div>
            ))}
        </div>
        <div className="text-[#d33682] font-bold">{'}'}</div>
     </div>

     {(data.projects || []).length > 0 && <div className="mb-8">
        <div className="text-[#d33682] font-bold mb-2">class Projects extends Side_Hustle {'{'}</div>
        <div className="pl-6 border-l-2 border-[#eee8d5] ml-2 space-y-4">
            {data.projects.slice(0,5).map((p,i) => (
                <div key={i} className="break-inside-avoid">
                    <div className="text-[#b58900] font-bold">function {p.name.replace(/\s|[^a-zA-Z]/g,'_')}() {'{'}</div>
                    <div className="pl-4 text-[#859900]">// Stack: {p.technologies.join(', ')}</div>
                    <div className="pl-4 text-[#2aa198] text-justify">return "{p.description}";</div>
                    <div className="text-[#b58900]">{'}'}</div>
                </div>
            ))}
        </div>
        <div className="text-[#d33682] font-bold">{'}'}</div>
     </div>}
     
     <div className="break-inside-avoid">
        <div className="text-[#cb4b16] font-bold mb-2">const stack = [</div>
        <div className="pl-4 flex flex-wrap gap-2 text-[#2aa198]">
            {(data.skills || []).map((s,i) => <span key={i}>"{s}",</span>)}
        </div>
        <div className="text-[#cb4b16] font-bold">];</div>
     </div>
  </div>
);

const SwissTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-white p-12 ${getFontClass('sans')}`}>
     <h1 className="text-7xl font-black mb-8 tracking-tighter leading-none">{data.personalInfo.fullName}</h1>
     <div className="grid grid-cols-4 gap-12 border-t-8 border-black pt-12">
        <div className="col-span-1 font-bold text-lg space-y-2">
            <p>{data.personalInfo.location}</p>
            <p className="text-blue-600 font-black">{data.personalInfo.email}</p>
            <p>{data.personalInfo.phone}</p>
            <div className="mt-12">
                <h4 className="font-black uppercase mb-4">Competencies</h4>
                {(data.skills || []).map((s,i)=><div key={i} className="border-b border-gray-200 py-1 text-sm">{s}</div>)}
            </div>
        </div>
        <div className="col-span-3">
             <h2 className="text-4xl font-bold mb-12 flex items-center gap-4">Experience <div className="h-1 bg-black flex-1"></div></h2>
             {(data.experience || []).map((e,i) => (
                 <div key={i} className="grid grid-cols-4 gap-6 mb-10 break-inside-avoid">
                     <div className="font-bold text-right pt-1">{e.duration}</div>
                     <div className="col-span-3">
                         <div className="text-2xl font-bold mb-1">{e.role}</div>
                         <div className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">{e.company}</div>
                         <div className="text-lg leading-relaxed text-gray-800"><RenderBullets items={e.description} /></div>
                     </div>
                 </div>
             ))}
             {(data.projects || []).length > 0 && <div className="mt-12">
                 <h2 className="text-4xl font-bold mb-12 flex items-center gap-4">Projects <div className="h-1 bg-black flex-1"></div></h2>
                 {data.projects.slice(0,5).map((p,i) => (
                     <div key={i} className="grid grid-cols-4 gap-6 mb-8 break-inside-avoid">
                         <div className="text-xs font-bold text-right pt-1 text-gray-500">{p.technologies.slice(0,3).join(', ')}</div>
                         <div className="col-span-3">
                             <div className="text-xl font-bold mb-1">{p.name}</div>
                             <p className="text-gray-700 text-justify leading-relaxed">{p.description}</p>
                         </div>
                     </div>
                 ))}
             </div>}
             <h2 className="text-4xl font-bold mb-8 mt-16 flex items-center gap-4">Education <div className="h-1 bg-black flex-1"></div></h2>
             {(data.education || []).map((e,i)=>(<div key={i} className="mb-4 text-xl"><strong>{e.school}</strong>, {e.degree}</div>))}
        </div>
     </div>
  </div>
);

const BoldTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-white ${getFontClass('oswald')}`}>
      <header className="bg-gray-900 text-white p-16">
          <h1 className="text-7xl font-bold uppercase tracking-widest text-center leading-none">{data.personalInfo.fullName}</h1>
          <div className="flex justify-center gap-8 mt-8 text-gray-400 font-sans text-sm tracking-widest uppercase">
             <span>{data.personalInfo.email}</span>
             <span>•</span>
             <span>{data.personalInfo.phone}</span>
          </div>
      </header>
      <div className="p-16 max-w-4xl mx-auto font-sans">
          <section className="mb-16 text-center">
              <p className="text-2xl font-light italic text-gray-600 leading-relaxed text-justify">{data.summary}</p>
          </section>
          {(data.experience || []).map((e,i) => (
              <div key={i} className="mb-12 border-l-8 pl-8 break-inside-avoid" style={{ borderColor: theme.color }}>
                  <div className="flex justify-between items-end mb-2">
                      <h3 className="text-3xl font-bold uppercase text-gray-800">{e.role}</h3>
                      <span className="font-mono text-gray-500">{e.duration}</span>
                  </div>
                  <div className="text-xl text-gray-600 mb-4 font-bold">{e.company}</div>
                  <div className="text-gray-700 text-lg leading-relaxed"><RenderBullets items={e.description} /></div>
              </div>
          ))}
          {(data.projects || []).length > 0 && <div className="mb-16">
              <h3 className="text-3xl font-bold uppercase mb-8 border-b-4 pb-2 inline-block">Notable Projects</h3>
              {data.projects.slice(0,5).map((p,i) => (
                  <div key={i} className="mb-8 break-inside-avoid">
                      <div className="flex items-baseline gap-4 mb-2">
                          <h4 className="text-xl font-bold">{p.name}</h4>
                          <span className="text-sm font-mono text-gray-500">[{p.technologies.join(', ')}]</span>
                      </div>
                      <p className="text-gray-700 text-justify leading-relaxed">{p.description}</p>
                  </div>
              ))}
          </div>}
          <div className="grid grid-cols-2 gap-12 mt-16 pt-8 border-t break-inside-avoid">
              <div>
                  <h3 className="text-2xl font-bold uppercase mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-3">{(data.skills || []).map((s,i)=><span key={i} className="bg-gray-100 px-3 py-1 font-bold">{s}</span>)}</div>
              </div>
              <div>
                  <h3 className="text-2xl font-bold uppercase mb-4">Education</h3>
                  {(data.education || []).map((e,i)=><div key={i} className="mb-2"><div className="font-bold">{e.school}</div><div>{e.degree}</div></div>)}
              </div>
          </div>
      </div>
  </div>
);

const ArtisticTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-white flex ${getFontClass('sans')}`}>
      <div className="w-24 bg-gray-50 flex flex-col items-center py-16 space-y-8 border-r">
         <div className="w-3 h-3 rounded-full bg-black"></div>
         <div className="w-3 h-3 rounded-full bg-black"></div>
         <div className="w-3 h-3 rounded-full bg-black"></div>
         <div className="flex-1 w-[1px] bg-gray-300"></div>
         <div className="writing-vertical-rl text-gray-400 font-bold tracking-widest uppercase transform rotate-180">Curriculum Vitae</div>
      </div>
      <div className="flex-1 p-16">
          <h1 className="text-6xl font-light mb-4" style={{ color: theme.color }}>{data.personalInfo.fullName}</h1>
          <p className="text-xl text-gray-400 mb-12 font-light text-justify leading-relaxed">{data.summary}</p>
          
          <div className="grid grid-cols-12 gap-12">
             <div className="col-span-8">
                <h3 className="text-xl font-bold mb-8 bg-gray-100 inline-block px-4 py-1 rounded-full uppercase text-xs tracking-widest">Experience</h3>
                {(data.experience || []).map((e,i) => (
                    <div key={i} className="mb-10 break-inside-avoid">
                        <div className="font-bold text-2xl mb-1">{e.role}</div>
                        <div className="text-sm font-bold text-gray-400 mb-4 uppercase">{e.company} | {e.duration}</div>
                        <div className="text-gray-600 leading-relaxed"><RenderBullets items={e.description} /></div>
                    </div>
                ))}
                
                {(data.projects || []).length > 0 && <div className="mt-12">
                    <h3 className="text-xl font-bold mb-8 bg-gray-100 inline-block px-4 py-1 rounded-full uppercase text-xs tracking-widest">Projects</h3>
                    {data.projects.slice(0,5).map((p,i) => (
                        <div key={i} className="mb-8 break-inside-avoid">
                            <div className="font-bold text-lg mb-1">{p.name}</div>
                            <div className="text-xs text-gray-400 mb-2 italic">{p.technologies.join(', ')}</div>
                            <p className="text-gray-600 text-justify leading-relaxed">{p.description}</p>
                        </div>
                    ))}
                </div>}
             </div>
             <div className="col-span-4 space-y-12">
                 <div>
                    <h3 className="text-xl font-bold mb-6 bg-gray-100 inline-block px-4 py-1 rounded-full uppercase text-xs tracking-widest">Skills</h3>
                    <div className="flex flex-wrap gap-2">{(data.skills || []).map((s,i)=><span key={i} className="border border-black px-3 py-1 text-xs font-bold rounded-full hover:bg-black hover:text-white transition-colors">{s}</span>)}</div>
                 </div>
                 <div>
                     <h3 className="text-xl font-bold mb-6 bg-gray-100 inline-block px-4 py-1 rounded-full uppercase text-xs tracking-widest">Contact</h3>
                     <p className="mb-2 font-bold">{data.personalInfo.email}</p>
                     <p>{data.personalInfo.phone}</p>
                     <p>{data.personalInfo.location}</p>
                 </div>
                 <div>
                     <h3 className="text-xl font-bold mb-6 bg-gray-100 inline-block px-4 py-1 rounded-full uppercase text-xs tracking-widest">Education</h3>
                     {(data.education || []).map((e,i)=><div key={i} className="mb-2 text-sm"><strong>{e.degree}</strong><br/>{e.school}</div>)}
                 </div>
             </div>
          </div>
      </div>
  </div>
);

const InfographicTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-white p-8 ${getFontClass('sans')}`}>
     <header className="bg-gray-900 text-white p-10 rounded-2xl mb-8 flex justify-between items-center shadow-xl">
         <div>
             <h1 className="text-4xl font-bold mb-2">{data.personalInfo.fullName}</h1>
             <p className="text-gray-400">{data.personalInfo.location} | {data.personalInfo.email}</p>
         </div>
         <div className="text-right hidden sm:block">
             <div className="text-3xl font-black" style={{ color: theme.color }}>PRO</div>
             <div className="text-xs uppercase tracking-widest text-gray-500">Profile</div>
         </div>
     </header>
     <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-black shadow-sm" style={{ color: theme.color }}>XP</span> Experience</h2>
            {(data.experience || []).map((e,i) => (
                <div key={i} className="bg-white border-2 border-gray-100 p-6 rounded-2xl hover:border-gray-300 transition-colors break-inside-avoid">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl">{e.role}</h3>
                        <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded">{e.duration}</span>
                    </div>
                    <div className="text-sm text-gray-500 font-bold uppercase tracking-wide mb-4">{e.company}</div>
                    <div className="text-sm text-gray-700"><RenderBullets items={e.description} /></div>
                </div>
            ))}
            
            {(data.projects || []).length > 0 && <h2 className="text-2xl font-bold flex items-center gap-3 mt-8"><span className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-black shadow-sm" style={{ color: theme.color }}>PJ</span> Projects</h2>}
            {data.projects.slice(0,5).map((p,i) => (
                <div key={i} className="bg-white border-2 border-gray-100 p-6 rounded-2xl break-inside-avoid">
                     <div className="font-bold text-lg mb-1">{p.name}</div>
                     <div className="text-xs text-gray-400 mb-3">{p.technologies.join(' • ')}</div>
                     <p className="text-sm text-gray-700 text-justify leading-relaxed">{p.description}</p>
                </div>
            ))}
        </div>
        <div className="col-span-1 space-y-8">
             <div className="bg-gray-50 p-6 rounded-2xl break-inside-avoid">
                <h2 className="text-xl font-bold mb-4">Skills Analysis</h2>
                <div className="space-y-3">
                    {(data.skills || []).slice(0,8).map((s,i) => (
                        <div key={i}>
                            <div className="flex justify-between text-xs font-bold mb-1"><span>{s}</span><span>{85 + (i%3)*5}%</span></div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${85 + (i%3)*5}%`, backgroundColor: theme.color }}></div></div>
                        </div>
                    ))}
                </div>
             </div>
             <div className="bg-gray-50 p-6 rounded-2xl break-inside-avoid">
                 <h2 className="text-xl font-bold mb-4">Education</h2>
                 {(data.education || []).map((e,i)=><div key={i} className="text-sm border-b last:border-0 pb-2 last:pb-0 border-gray-200"><strong>{e.degree}</strong><div className="text-gray-500">{e.school}</div></div>)}
             </div>
        </div>
     </div>
  </div>
);

const GlitchTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-[#111] text-[#0f0] p-10 ${getFontClass('mono')} overflow-hidden relative`}>
      <div className="absolute top-0 left-0 w-full h-2 bg-[#0f0] opacity-50 shadow-[0_0_20px_#0f0]"></div>
      <h1 className="text-5xl font-bold mb-12 uppercase tracking-widest border-b border-green-900 pb-4 flex justify-between items-end">
          <span className="drop-shadow-[2px_2px_0px_rgba(255,0,0,0.5)]">{data.personalInfo.fullName}</span>
          <span className="text-sm font-normal opacity-70 animate-pulse">{data.personalInfo.email}</span>
      </h1>
      <div className="grid grid-cols-3 gap-12">
          <div className="col-span-2">
              <h2 className="text-[#0f0] mb-6 uppercase tracking-widest text-xl bg-green-900/30 inline-block px-2">[ SYSTEM_LOG: EXPERIENCE ]</h2>
              {(data.experience || []).map((e,i) => (
                  <div key={i} className="mb-10 border-l border-green-900 pl-6 relative break-inside-avoid">
                      <div className="absolute -left-1.5 top-0 w-3 h-3 bg-black border border-[#0f0]"></div>
                      <div className="text-2xl font-bold mb-1">{e.role}</div>
                      <div className="text-xs text-green-600 mb-4 font-bold">>> EXEC @ {e.company} [{e.duration}]</div>
                      <div className="text-sm opacity-80 leading-relaxed"><RenderBullets items={e.description} /></div>
                  </div>
              ))}
              
              {(data.projects || []).length > 0 && <div className="mt-12">
                   <h2 className="text-[#0f0] mb-6 uppercase tracking-widest text-xl bg-green-900/30 inline-block px-2">[ SYSTEM_LOG: PROJECTS ]</h2>
                   {data.projects.slice(0,5).map((p,i) => (
                       <div key={i} className="mb-8 border-l border-green-900 pl-6 relative break-inside-avoid">
                           <div className="absolute -left-1.5 top-0 w-3 h-3 bg-black border border-[#0f0]"></div>
                           <div className="text-xl font-bold mb-1">{p.name}</div>
                           <div className="text-xs text-green-600 mb-2 font-bold">>> {p.technologies.join(' + ')}</div>
                           <div className="text-sm opacity-80 text-justify leading-relaxed">{p.description}</div>
                       </div>
                   ))}
              </div>}
          </div>
          <div>
              <h2 className="text-[#0f0] mb-6 uppercase tracking-widest text-xl bg-green-900/30 inline-block px-2">[ INSTALLED_MODULES ]</h2>
              <ul className="text-sm space-y-2 mb-10">
                  {(data.skills || []).map((s,i) => <li key={i} className="opacity-80 hover:opacity-100 cursor-default">> {s}</li>)}
              </ul>
              <h2 className="text-[#0f0] mb-6 uppercase tracking-widest text-xl bg-green-900/30 inline-block px-2">[ KERNEL_INFO ]</h2>
              {(data.education || []).map((e,i)=>(<div key={i} className="text-sm mb-4">root@{e.school}:~# <span className="opacity-70">{e.degree}</span></div>))}
          </div>
      </div>
  </div>
);

// --- SIMPLE PLACEHOLDERS UPDATED TO FULL ---

const MinimalTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
    <div className={`p-16 bg-white min-h-full ${getFontClass(theme.font)}`}>
        <h1 className="font-light text-5xl mb-12 tracking-tight">{data.personalInfo.fullName}</h1>
        <div className="grid grid-cols-4 gap-8">
            <div className="col-span-1 font-bold text-sm uppercase tracking-widest mt-1">Contact</div>
            <div className="col-span-3 mb-8 text-gray-600">{data.personalInfo.email} • {data.personalInfo.phone}</div>
            
            <div className="col-span-1 font-bold text-sm uppercase tracking-widest mt-1">Summary</div>
            <div className="col-span-3 mb-8 text-gray-800 leading-relaxed text-justify">{data.summary}</div>
            
            <div className="col-span-1 font-bold text-sm uppercase tracking-widest mt-1">Experience</div>
            <div className="col-span-3 space-y-8">
                {(data.experience || []).map((e,i)=>(
                    <div key={i} className="break-inside-avoid">
                        <div className="font-bold text-lg">{e.role}</div>
                        <div className="text-gray-500 mb-2">{e.company}, {e.duration}</div>
                        <div className="text-gray-700 text-sm"><RenderBullets items={e.description}/></div>
                    </div>
                ))}
            </div>

            {(data.projects || []).length > 0 && <div className="col-span-1 font-bold text-sm uppercase tracking-widest mt-1">Projects</div>}
            {data.projects.length > 0 && <div className="col-span-3 space-y-6">
                {data.projects.slice(0,5).map((p,i) => (
                    <div key={i} className="break-inside-avoid">
                        <div className="font-bold text-base">{p.name}</div>
                        <div className="text-xs text-gray-500 mb-1">{p.technologies.join(', ')}</div>
                        <p className="text-sm text-gray-700 text-justify leading-relaxed">{p.description}</p>
                    </div>
                ))}
            </div>}
            
            <div className="col-span-1 font-bold text-sm uppercase tracking-widest mt-1">Skills</div>
            <div className="col-span-3 text-sm text-gray-700 leading-loose">
               {(data.skills || []).join('  //  ')}
            </div>
            
            <div className="col-span-1 font-bold text-sm uppercase tracking-widest mt-1">Education</div>
            <div className="col-span-3">
               {(data.education || []).map((e,i)=>(<div key={i} className="mb-2"><strong>{e.school}</strong>, {e.degree} ({e.year})</div>))}
            </div>
        </div>
    </div>
);

const CreativeTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
     <div className={`p-10 bg-white min-h-full ${getFontClass(theme.font)}`}>
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">{data.personalInfo.fullName.split(' ')[0]}</h1>
        <h1 className="text-6xl font-black text-gray-900 mb-12">{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</h1>
        <div className="grid grid-cols-2 gap-12">
            <div>
                <h2 className="font-bold text-3xl mb-6 text-blue-600">Work.</h2>
                {(data.experience || []).map((e,i)=>(
                    <div key={i} className="mb-8 break-inside-avoid">
                        <div className="font-bold text-xl">{e.role}</div>
                        <div className="text-gray-400 font-bold uppercase text-xs mb-2">{e.company}</div>
                        <div className="text-gray-700"><RenderBullets items={e.description}/></div>
                    </div>
                ))}
                {(data.projects || []).length > 0 && <h2 className="font-bold text-3xl mb-6 text-blue-600 mt-12">Projects.</h2>}
                {data.projects.slice(0,5).map((p,i) => (
                    <div key={i} className="mb-6 break-inside-avoid">
                        <div className="font-bold text-lg">{p.name}</div>
                        <div className="text-xs text-gray-400 mb-1">{p.technologies.join(', ')}</div>
                        <p className="text-gray-700 text-sm text-justify leading-relaxed">{p.description}</p>
                    </div>
                ))}
            </div>
            <div>
                <h2 className="font-bold text-3xl mb-6 text-purple-600">Profile.</h2>
                <p className="mb-8 text-lg font-light leading-relaxed text-justify">{data.summary}</p>
                <h3 className="font-bold text-xl mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">{(data.skills || []).map((s,i)=><span key={i} className="border-b-2 border-gray-200">{s}</span>)}</div>
                
                <h3 className="font-bold text-xl mb-4 mt-8">Education</h3>
                {(data.education || []).map((e,i)=><div key={i} className="mb-2"><strong>{e.school}</strong><br/>{e.degree}</div>)}
            </div>
        </div>
     </div>
);

const ModernTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
    <div className={`bg-white flex min-h-full ${getFontClass(theme.font)}`}>
        <div className="w-1/3 bg-slate-900 text-white p-10 flex flex-col justify-between">
            <div>
                <h1 className="font-bold text-4xl mb-2 leading-none">{data.personalInfo.fullName}</h1>
                <p className="text-slate-400 mb-10">{data.personalInfo.email}</p>
                
                <h2 className="font-bold uppercase tracking-widest text-sm mb-4 border-b border-slate-700 pb-2">Skills</h2>
                <div className="flex flex-wrap gap-2 mb-10">{(data.skills || []).map((s,i)=><span key={i} className="bg-slate-800 px-2 py-1 rounded text-xs">{s}</span>)}</div>
                
                <h2 className="font-bold uppercase tracking-widest text-sm mb-4 border-b border-slate-700 pb-2">Education</h2>
                {(data.education || []).map((e,i)=><div key={i} className="mb-4 text-sm"><strong className="block text-white">{e.school}</strong><span className="text-slate-400">{e.degree}</span></div>)}
            </div>
        </div>
        <div className="w-2/3 p-10">
            <h2 className="font-bold text-2xl mb-8 uppercase text-slate-900 border-b-2 border-slate-900 pb-2">Experience</h2>
            {(data.experience || []).map((e,i)=>(
                <div key={i} className="mb-8 break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-xl text-slate-800">{e.role}</h3>
                        <span className="text-sm font-bold text-slate-500">{e.duration}</span>
                    </div>
                    <div className="text-slate-600 font-medium mb-2">{e.company}</div>
                    <div className="text-slate-700 leading-relaxed"><RenderBullets items={e.description}/></div>
                </div>
            ))}
            
            {(data.projects || []).length > 0 && <h2 className="font-bold text-2xl mb-8 uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mt-12">Projects</h2>}
            {data.projects.slice(0,5).map((p,i) => (
                <div key={i} className="mb-6 break-inside-avoid">
                    <div className="font-bold text-lg text-slate-800">{p.name}</div>
                    <div className="text-xs font-bold text-slate-500 mb-2">{p.technologies.join(', ')}</div>
                    <p className="text-slate-700 text-justify text-sm leading-relaxed">{p.description}</p>
                </div>
            ))}
        </div>
    </div>
);

const ClassicTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
    <div className={`p-12 bg-white min-h-full ${getFontClass(theme.font)} text-gray-800`}>
        <div className="border-b-2 border-gray-800 pb-8 mb-8">
            <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{data.personalInfo.fullName}</h1>
            <p className="text-gray-600 font-medium">{data.personalInfo.location} | {data.personalInfo.email} | {data.personalInfo.phone}</p>
        </div>
        
        <div className="mb-8">
            <h2 className="font-bold text-xl uppercase mb-4 bg-gray-100 p-2">Professional Summary</h2>
            <p className="px-2 leading-relaxed text-justify">{data.summary}</p>
        </div>
        
        <div className="mb-8">
            <h2 className="font-bold text-xl uppercase mb-4 bg-gray-100 p-2">Work Experience</h2>
            {(data.experience || []).map((e,i)=>(
                <div key={i} className="mb-6 px-2 break-inside-avoid">
                    <div className="flex justify-between font-bold text-lg">
                        <span>{e.role}</span>
                        <span>{e.duration}</span>
                    </div>
                    <div className="italic mb-2 text-gray-600">{e.company}</div>
                    <div className="pl-2"><RenderBullets items={e.description}/></div>
                </div>
            ))}
        </div>

        {(data.projects || []).length > 0 && <div className="mb-8">
             <h2 className="font-bold text-xl uppercase mb-4 bg-gray-100 p-2">Projects</h2>
             {data.projects.slice(0,5).map((p,i) => (
                 <div key={i} className="mb-4 px-2 break-inside-avoid">
                     <div className="font-bold text-lg">{p.name}</div>
                     <div className="text-sm italic text-gray-500 mb-1">{p.technologies.join(', ')}</div>
                     <p className="text-gray-700 text-justify pl-2 leading-relaxed">{p.description}</p>
                 </div>
             ))}
        </div>}
        
        <div className="mb-8 break-inside-avoid">
            <h2 className="font-bold text-xl uppercase mb-4 bg-gray-100 p-2">Education</h2>
            {(data.education || []).map((e,i)=>(<div key={i} className="px-2"><strong>{e.school}</strong> - {e.degree} ({e.year})</div>))}
        </div>

        <div className="mb-8 break-inside-avoid">
            <h2 className="font-bold text-xl uppercase mb-4 bg-gray-100 p-2">Skills</h2>
            <p className="px-2 leading-relaxed text-justify">{(data.skills || []).join(' • ')}</p>
        </div>
    </div>
);

// --- OTHER TEMPLATES ---

const MonochromeTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-white p-10 text-black border-[12px] border-black ${getFontClass('mono')}`}>
     <h1 className="text-5xl font-bold uppercase border-b-4 border-black pb-4 mb-8 text-center">{data.personalInfo.fullName}</h1>
     <div className="grid grid-cols-2 gap-10">
         <div>
             <h2 className="bg-black text-white px-2 py-1 font-bold uppercase mb-4 inline-block">Experience</h2>
             {(data.experience || []).map((e,i) => (
                 <div key={i} className="mb-6 break-inside-avoid">
                     <div className="font-bold text-lg">{e.role}</div>
                     <div className="text-sm underline mb-2">{e.company}</div>
                     <div className="text-sm"><RenderBullets items={e.description} /></div>
                 </div>
             ))}
             {(data.projects || []).length > 0 && <div className="mt-8">
                 <h2 className="bg-black text-white px-2 py-1 font-bold uppercase mb-4 inline-block">Projects</h2>
                 {data.projects.slice(0,5).map((p,i) => (
                     <div key={i} className="mb-6 break-inside-avoid">
                         <div className="font-bold">{p.name}</div>
                         <div className="text-xs mb-1">[{p.technologies.join(', ')}]</div>
                         <p className="text-sm text-justify leading-relaxed">{p.description}</p>
                     </div>
                 ))}
             </div>}
         </div>
         <div>
             <h2 className="bg-black text-white px-2 py-1 font-bold uppercase mb-4 inline-block">Education</h2>
             {(data.education || []).map((e,i) => <div key={i} className="mb-4"><strong>{e.school}</strong><br/>{e.degree}</div>)}
             <h2 className="bg-black text-white px-2 py-1 font-bold uppercase mb-4 inline-block mt-8">Skills</h2>
             <div className="flex flex-wrap gap-2">{(data.skills || []).map((s,i)=><span key={i} className="border border-black px-2 text-xs font-bold">{s}</span>)}</div>
         </div>
     </div>
  </div>
);

const FocusedTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-white p-16 ${getFontClass('sans')} flex flex-col items-center text-center`}>
     <h1 className="text-4xl font-bold tracking-widest uppercase mb-2">{data.personalInfo.fullName}</h1>
     <div className="w-16 h-1 bg-black mb-10"></div>
     <p className="max-w-2xl text-gray-600 mb-16 italic text-lg leading-relaxed text-justify">{data.summary}</p>
     <div className="w-full max-w-2xl space-y-16 text-left">
        {(data.experience || []).map((e,i) => (
            <div key={i} className="break-inside-avoid">
                <div className="flex flex-col items-center mb-4">
                    <h3 className="text-2xl font-bold">{e.role}</h3>
                    <div className="text-gray-400 text-sm uppercase tracking-widest mt-1">{e.company} • {e.duration}</div>
                </div>
                <div className="text-gray-700 leading-loose text-justify"><RenderBullets items={e.description} /></div>
            </div>
        ))}
        {(data.projects || []).length > 0 && <div className="pt-8 border-t break-inside-avoid">
            <h3 className="text-center font-bold uppercase tracking-widest mb-8">Selected Work</h3>
            {data.projects.slice(0,5).map((p,i) => (
                <div key={i} className="mb-8">
                     <div className="text-center font-bold text-lg">{p.name}</div>
                     <div className="text-center text-xs text-gray-500 mb-2">{p.technologies.join(' • ')}</div>
                     <p className="text-gray-700 text-justify leading-relaxed">{p.description}</p>
                </div>
            ))}
        </div>}
        <div className="pt-8 border-t text-center break-inside-avoid">
            <h3 className="font-bold uppercase tracking-widest mb-6">Capabilities</h3>
            <p className="text-gray-600 italic leading-loose">{(data.skills || []).join(' / ')}</p>
        </div>
        <div className="pt-8 border-t text-center break-inside-avoid">
            <h3 className="font-bold uppercase tracking-widest mb-6">Education</h3>
            {(data.education || []).map((e,i) => <div key={i} className="mb-2"><strong>{e.school}</strong>, {e.degree}</div>)}
        </div>
     </div>
  </div>
);

const MagazineTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-white p-12 ${getFontClass('serif')}`}>
     <div className="columns-2 gap-12 h-full">
         <header className="break-inside-avoid mb-10">
             <h1 className="text-7xl font-bold leading-none mb-6" style={{ color: theme.color }}>{data.personalInfo.fullName}</h1>
             <p className="font-sans text-sm font-bold uppercase tracking-widest border-t border-b py-3 border-black">{data.personalInfo.email} • {data.personalInfo.location}</p>
         </header>
         <section className="break-inside-avoid mb-10">
             <p className="text-xl leading-relaxed font-light text-gray-800 text-justify">{data.summary}</p>
         </section>
         {(data.experience || []).map((e,i) => (
             <section key={i} className="break-inside-avoid mb-8">
                 <h3 className="font-bold text-2xl uppercase italic border-l-4 pl-4 border-gray-900 mb-2">{e.company}</h3>
                 <div className="font-sans text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">{e.role} | {e.duration}</div>
                 <div className="text-base text-justify leading-relaxed text-gray-700"><RenderBullets items={e.description} /></div>
             </section>
         ))}
         {(data.projects || []).length > 0 && <section className="break-inside-avoid mb-8">
             <h3 className="font-bold text-2xl uppercase italic border-l-4 pl-4 border-gray-900 mb-4">Projects</h3>
             {data.projects.slice(0,5).map((p,i) => (
                 <div key={i} className="mb-6">
                     <div className="font-bold text-lg">{p.name}</div>
                     <p className="text-justify text-gray-700 leading-relaxed">{p.description}</p>
                 </div>
             ))}
         </section>}
          <section className="break-inside-avoid bg-gray-100 p-8 text-center mt-8">
             <h3 className="font-sans font-bold uppercase mb-4 tracking-widest">Core Competencies</h3>
             <p className="italic text-lg leading-loose text-justify">{(data.skills || []).join(' • ')}</p>
         </section>
         <section className="break-inside-avoid mt-8 p-8 border-t-2 border-black">
             <h3 className="font-sans font-bold uppercase mb-4 tracking-widest">Education</h3>
             {(data.education || []).map((e,i) => <div key={i} className="mb-2 font-bold">{e.school}, <span className="font-normal italic">{e.degree}</span></div>)}
         </section>
     </div>
  </div>
);

const CompactTemplate: React.FC<TemplateProps> = ({ data, theme }) => (
  <div className={`w-full min-h-full bg-white p-8 ${getFontClass('sans')} text-xs`}>
     <div className="flex justify-between border-b-2 border-gray-800 pb-4 mb-6 align-bottom">
        <h1 className="text-4xl font-bold tracking-tighter">{data.personalInfo.fullName}</h1>
        <div className="text-right text-gray-600 font-medium">{data.personalInfo.email}<br/>{data.personalInfo.phone}</div>
     </div>
     <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
           <h2 className="font-bold border-b mb-3 uppercase text-gray-900 tracking-wider">Experience</h2>
           {(data.experience || []).map((e,i) => (
               <div key={i} className="mb-4 break-inside-avoid">
                   <div className="flex justify-between items-baseline">
                       <div className="font-bold text-base">{e.role}</div>
                       <div className="text-gray-500 italic">{e.duration}</div>
                   </div>
                   <div className="text-gray-600 font-bold mb-1">{e.company}</div>
                   <div className="ml-2"><RenderBullets items={e.description} /></div>
               </div>
           ))}
           {(data.projects || []).length > 0 && <div className="mt-6">
               <h2 className="font-bold border-b mb-3 uppercase text-gray-900 tracking-wider">Projects</h2>
               {data.projects.slice(0,5).map((p,i) => (
                   <div key={i} className="mb-3 break-inside-avoid">
                       <span className="font-bold">{p.name}: </span>
                       <span className="text-justify">{p.description}</span>
                   </div>
               ))}
           </div>}
        </div>
        <div className="col-span-4 space-y-6">
            <div>
                <h2 className="font-bold border-b mb-3 uppercase text-gray-900 tracking-wider">Summary</h2>
                <p className="mb-4 text-justify leading-relaxed text-gray-700">{data.summary}</p>
            </div>
            <div>
                <h2 className="font-bold border-b mb-3 uppercase text-gray-900 tracking-wider">Skills</h2>
                <div className="flex flex-wrap gap-1">{(data.skills || []).map((s,i)=><span key={i} className="bg-gray-100 px-1 rounded">{s}</span>)}</div>
            </div>
            <div>
                <h2 className="font-bold border-b mb-3 uppercase text-gray-900 tracking-wider">Education</h2>
                {(data.education || []).map((e,i) => <div key={i} className="mb-2"><strong>{e.degree}</strong><div className="text-gray-500">{e.school}</div></div>)}
            </div>
        </div>
     </div>
  </div>
);

export const getTemplateComponent = (type: TemplateType): React.FC<TemplateProps> => {
  switch (type) {
    case TemplateType.TIMELINE: return TimelineTemplate;
    case TemplateType.GRID: return GridTemplate;
    case TemplateType.STARTUP: return StartupTemplate;
    case TemplateType.ACADEMIC: return AcademicTemplate;
    case TemplateType.TECH: return TechTemplate;
    case TemplateType.SWISS: return SwissTemplate;
    case TemplateType.BOLD: return BoldTemplate;
    case TemplateType.COMPACT: return CompactTemplate;
    case TemplateType.ARTISTIC: return ArtisticTemplate;
    case TemplateType.INFOGRAPHIC: return InfographicTemplate;
    case TemplateType.MONOCHROME: return MonochromeTemplate;
    case TemplateType.FOCUSED: return FocusedTemplate;
    case TemplateType.MAGAZINE: return MagazineTemplate;
    case TemplateType.GLITCH: return GlitchTemplate;
    case TemplateType.ELEGANT: return ElegantTemplate;
    case TemplateType.MODERN: return ModernTemplate;
    case TemplateType.CREATIVE: return CreativeTemplate;
    case TemplateType.MINIMAL: return MinimalTemplate;
    case TemplateType.CLASSIC: return ClassicTemplate;
    case TemplateType.EXECUTIVE: 
    default: return ExecutiveTemplate;
  }
};