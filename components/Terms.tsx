import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="h-full w-full bg-black text-gray-300 overflow-y-auto custom-scrollbar p-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="border-b border-gray-800 pb-8 mb-8">
           <h1 className="text-4xl font-black text-white mb-2">Terms & Conditions</h1>
           <p className="text-gray-500">Last updated: February 2025</p>
        </header>

        <section className="space-y-4">
           <h2 className="text-xl font-bold text-white">1. Introduction</h2>
           <p className="leading-relaxed">
             Welcome to ResumeAI Builder. By using our website and services, you agree to comply with and be bound by the following terms and conditions. Please review them carefully.
           </p>
        </section>

        <section className="space-y-4">
           <h2 className="text-xl font-bold text-white">2. Use of Service</h2>
           <p className="leading-relaxed">
             Our service uses Artificial Intelligence to generate resume content. You are responsible for reviewing and verifying the accuracy of all generated content before use. We do not guarantee employment or specific job outcomes.
           </p>
        </section>

        <section className="space-y-4">
           <h2 className="text-xl font-bold text-white">3. Data Privacy</h2>
           <p className="leading-relaxed">
             We prioritize your privacy. Resume data is processed locally in your browser and temporarily via our AI providers to generate content. We do not store your personal resume data on our servers permanently.
           </p>
        </section>

        <section className="space-y-4">
           <h2 className="text-xl font-bold text-white">4. Intellectual Property</h2>
           <p className="leading-relaxed">
             The content you generate belongs to you. The templates, code, and design of the platform remain the property of ResumeAI Builder.
           </p>
        </section>
        
        <div className="pt-12 border-t border-gray-800 text-sm text-gray-600">
           © 2025 ResumeAI Builder. All rights reserved.
        </div>
      </div>
    </div>
  );
};