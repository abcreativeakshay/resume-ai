import React, { useState } from 'react';
import { ResumeBuilder } from './components/ResumeBuilder';
import { Home } from './components/Home';
import { Terms } from './components/Terms';
import { GlobalSidebar, ViewType } from './components/GlobalSidebar';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans text-gray-100">
      <GlobalSidebar currentView={currentView} onChange={setCurrentView} />
      
      <div className="flex-1 h-full relative overflow-hidden">
        {currentView === 'home' && (
            <Home 
                onStart={() => setCurrentView('builder')} 
                onLearnMore={() => setCurrentView('terms')} 
            />
        )}
        {currentView === 'builder' && <ResumeBuilder />}
        {currentView === 'terms' && <Terms />}
      </div>
    </div>
  );
};

export default App;