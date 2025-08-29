import React from 'react';
import { Cpu, Activity } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 circuit-bg flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-50 pulse-ring"></div>
          <div className="relative p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border border-cyan-400/30 neon-glow">
            <Cpu size={64} className="text-cyan-400 mx-auto animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-cyan-400 mb-4 font-tech uppercase tracking-wider neon-text">
          Initializing System
        </h2>
        
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <Activity size={16} className="animate-pulse" />
          <span className="font-medium">Connecting to Firebase...</span>
        </div>
        
        <div className="mt-6 w-64 mx-auto">
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};