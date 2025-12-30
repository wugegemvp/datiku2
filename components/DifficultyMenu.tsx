
import React from 'react';
import { CategoryType } from '../types';
import { GAME_LEVELS } from '../constants';

interface DifficultyMenuProps {
  category: CategoryType;
  onSelectDifficulty: (id: string) => void;
  onBack: () => void;
}

export const DifficultyMenu: React.FC<DifficultyMenuProps> = ({ category, onSelectDifficulty, onBack }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Header Section */}
      <div className="z-10 w-full mb-8 relative flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
        <button 
          onClick={onBack} 
          className="absolute left-0 top-0 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center group"
          aria-label="Back"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        <h1 className="text-2xl font-black text-white tracking-[0.1em] drop-shadow-2xl mb-1 uppercase">
          选择难度
        </h1>
        
        <div className="flex items-center gap-2 opacity-90">
            <span className="text-blue-300 text-[10px] font-bold tracking-[0.2em] uppercase drop-shadow-md">
              {category}
            </span>
        </div>
      </div>

      {/* Difficulty Cards List */}
      <div className="flex flex-col gap-3.5 z-10 w-full max-w-[320px]">
        {GAME_LEVELS.map((level, index) => (
          <button
            key={level.id}
            onClick={() => onSelectDifficulty(level.id.toString())}
            className="group relative w-full outline-none"
            style={{ animation: `fadeIn 0.4s ease-out ${index * 0.08}s backwards` }}
          >
             <div className="relative flex items-center p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 group-hover:scale-[1.03] group-hover:bg-white/10 group-active:scale-[0.97]">
                <div className={`absolute inset-0 bg-gradient-to-r ${level.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className={`relative w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center text-2xl shadow-lg border border-white/10`}>
                    <span className="drop-shadow-md filter">{level.icon}</span>
                </div>

                <div className="flex flex-col items-start ml-4 grow text-left z-10">
                    <span className="text-base font-bold text-white tracking-wide">
                        {level.label}
                    </span>
                    <span className="text-[10px] text-white/40 font-medium tracking-wider uppercase">
                        {level.desc}
                    </span>
                </div>

                <div className="text-white/20 group-hover:text-white/60 transition-all">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </div>
             </div>
          </button>
        ))}
      </div>
    </div>
  );
};
