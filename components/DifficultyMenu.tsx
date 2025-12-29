import React from 'react';
import { CategoryType } from '../types';
import { DIFFICULTY_LEVELS } from '../constants';

interface DifficultyMenuProps {
  category: CategoryType;
  onSelectDifficulty: (id: string) => void;
  onBack: () => void;
}

export const DifficultyMenu: React.FC<DifficultyMenuProps> = ({ category, onSelectDifficulty, onBack }) => {
  return (
    <div className="min-h-screen ios-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[100px] rounded-full"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Header Section */}
      <div className="z-10 w-full max-w-md mb-8 relative flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
        <button 
          onClick={onBack} 
          className="absolute left-0 top-1.5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center group"
          aria-label="Back"
        >
          <svg className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        <h1 className="text-3xl font-black text-white tracking-wider drop-shadow-2xl mb-2 text-center uppercase">
          Select Difficulty
        </h1>
        
        <div className="flex items-center gap-3 opacity-90">
            <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-white/40"></div>
            <span className="text-blue-200 text-xs font-bold tracking-[0.2em] uppercase drop-shadow-md">
              {category}
            </span>
            <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-white/40"></div>
        </div>
      </div>

      {/* Difficulty Cards List */}
      <div className="flex flex-col gap-4 z-10 w-full max-w-md">
        {DIFFICULTY_LEVELS.map((level, index) => (
          <button
            key={level.id}
            onClick={() => onSelectDifficulty(level.id)}
            className="group relative w-full outline-none"
            style={{ animation: `fadeIn 0.4s ease-out ${index * 0.08}s backwards` }}
          >
             {/* Card Container */}
             <div className="relative flex items-center p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:border-white/20 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] group-active:scale-[0.98]">
                
                {/* Background Glow Effect based on level color */}
                <div className={`absolute inset-0 bg-gradient-to-r ${level.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className={`relative w-16 h-16 shrink-0 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center text-3xl shadow-lg border border-white/10 group-hover:rotate-3 transition-transform duration-300`}>
                    <span className="drop-shadow-md filter">{level.icon}</span>
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-start ml-4 grow text-left z-10">
                    <span className="text-lg font-bold text-white tracking-wide drop-shadow-sm group-hover:text-yellow-50 transition-colors">
                        {level.label}
                    </span>
                    <span className="text-[11px] text-white/50 font-medium tracking-wider uppercase mt-0.5">
                        {level.desc}
                    </span>
                </div>

                {/* Arrow Icon */}
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-white/10 group-hover:text-white transition-all">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </div>
             </div>
          </button>
        ))}
      </div>
    </div>
  );
};