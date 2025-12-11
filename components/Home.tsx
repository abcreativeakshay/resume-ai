import React from 'react';

interface HomeProps {
  onStart: () => void;
  onLearnMore: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStart, onLearnMore }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-tech-grid relative overflow-hidden p-8 text-center">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-snow/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="z-10 max-w-4xl space-y-8 mb-32">
         <div className="inline-block px-4 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-xs font-bold text-snow tracking-widest uppercase mb-4 animate-[fadeIn_1s_ease-out]">
            Next Gen Career Builder
         </div>
         
         <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-tight">
            Build Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-snow to-purple-500">Future Career</span>
         </h1>
         
         <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            An AI-powered workspace that transforms your raw experience into a professional narrative. 
            Smart analytics, design systems, and career strategy in one platform.
         </p>

         <div className="flex gap-4 justify-center mt-8">
            <button 
                onClick={onStart}
                className="px-8 py-4 bg-snow text-black font-bold uppercase tracking-widest rounded-full hover:bg-snow-light hover:scale-105 transition-all shadow-[0_0_20px_rgba(41,181,232,0.4)]"
            >
                Launch Builder
            </button>
            <button 
                onClick={onLearnMore}
                className="px-8 py-4 bg-transparent border border-gray-700 text-white font-bold uppercase tracking-widest rounded-full hover:bg-white/5 transition-all">
                Learn More
            </button>
         </div>
      </div>
      
      {/* Stats Grid */}
      <div className="absolute bottom-0 w-full border-t border-gray-800 bg-black/50 backdrop-blur-sm p-6 grid grid-cols-3 gap-4 text-center">
         <div>
            <div className="text-2xl font-black text-white">20+</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">AI Features</div>
         </div>
         <div>
            <div className="text-2xl font-black text-white">100%</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Privacy Focused</div>
         </div>
         <div>
            <div className="text-2xl font-black text-white">20</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Pro Templates</div>
         </div>
      </div>
    </div>
  );
};