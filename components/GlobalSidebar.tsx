import React from 'react';

export type ViewType = 'home' | 'builder' | 'terms';

interface SidebarProps {
  currentView: ViewType;
  onChange: (view: ViewType) => void;
}

export const GlobalSidebar: React.FC<SidebarProps> = ({ currentView, onChange }) => {
  
  const NavItem = ({ view, icon, label }: { view: ViewType; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => onChange(view)}
      className={`relative group w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${
        currentView === view 
          ? 'bg-snow/20 text-snow shadow-[0_0_15px_rgba(41,181,232,0.3)]' 
          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
      }`}
      title={label}
    >
      {icon}
      {/* Tooltip */}
      <span className="absolute left-14 bg-black/80 text-white text-[10px] font-bold uppercase px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-md pointer-events-none border border-gray-700">
        {label}
      </span>
      {/* Active Indicator */}
      {currentView === view && (
         <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-snow rounded-r-full"></div>
      )}
    </button>
  );

  return (
    <nav className="w-20 h-screen flex flex-col items-center py-8 z-50 border-r border-white/10 bg-black/40 backdrop-blur-xl relative no-print">
       
       <div className="mb-12">
          {/* New Logo: Abstract Interlocking Infinity/Diamond Shape */}
          <div 
             onClick={() => onChange('home')}
             className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 transition-all cursor-pointer border border-white/10 shadow-[0_0_25px_rgba(139,92,246,0.3)] group overflow-hidden relative"
          >
             {/* Gradient Background Glow */}
             <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             
             {/* Logo SVG */}
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:scale-110 transition-transform duration-500 ease-out z-10">
                <defs>
                   <linearGradient id="logoGradient2" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#A78BFA" /> {/* Soft Purple */}
                      <stop offset="100%" stopColor="#3B82F6" /> {/* Blue */}
                   </linearGradient>
                </defs>
                
                {/* Top Right Ribbon */}
                <path 
                   d="M12 2L15.5 5.5L12 9L8.5 5.5L12 2Z" 
                   fill="url(#logoGradient2)" 
                   fillOpacity="0.8"
                />
                <path 
                    d="M12 22L8.5 18.5L12 15L15.5 18.5L12 22Z"
                    fill="url(#logoGradient2)"
                    fillOpacity="0.8"
                />
                <path 
                    d="M22 12L18.5 15.5L15 12L18.5 8.5L22 12Z"
                    fill="url(#logoGradient2)"
                    fillOpacity="0.6"
                />
                <path 
                    d="M2 12L5.5 8.5L9 12L5.5 15.5L2 12Z"
                    fill="url(#logoGradient2)"
                    fillOpacity="0.6"
                />
                
                {/* Central Core */}
                <circle cx="12" cy="12" r="2" fill="white" className="animate-pulse" />
             </svg>
          </div>
       </div>

       <div className="flex-1 flex flex-col gap-6">
          <NavItem 
            view="home" 
            label="Home"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} 
          />
          <NavItem 
            view="builder" 
            label="Builder"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>} 
          />
          <NavItem 
            view="terms" 
            label="Terms"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} 
          />
       </div>

       <div className="mt-auto">
          <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
       </div>

    </nav>
  );
};