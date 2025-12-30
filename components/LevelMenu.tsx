
import React from 'react';
import { CategoryType } from '../types';
import { GAME_LEVELS } from '../constants';

interface LevelMenuProps {
  category: CategoryType;
  onSelectLevel: (id: number) => void;
  onBack: () => void;
}

export const LevelMenu: React.FC<LevelMenuProps> = ({ category, onSelectLevel, onBack }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="z-10 w-full mb-8 relative flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
        <button 
          onClick={onBack} 
          className="absolute left-0 top-0 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        <h1 className="text-2xl font-black text-white tracking-[0.1em] drop-shadow-2xl mb-1 uppercase">
          选择关卡
        </h1>
        
        <span className="text-blue-300 text-[10px] font-bold tracking-[0.2em] uppercase">
          {category} · 共五关
        </span>
      </div>

      <div className="flex flex-col gap-3 z-10 w-full max-w-[320px]">
        {GAME_LEVELS.map((level, index) => (
          <button
            key={level.id}
            onClick={() => onSelectLevel(level.id)}
            className="group relative w-full outline-none"
            style={{ animation: `fadeIn 0.4s ease-out ${index * 0.08}s backwards` }}
          >
             <div className="relative flex items-center p-3.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 group-hover:bg-white/15 group-hover:translate-x-1 group-active:scale-[0.98]">
                <div className={`w-12 h-12 shrink-0 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center text-xl font-black text-white shadow-lg border border-white/20`}>
                    {level.id}
                </div>

                <div className="flex flex-col items-start ml-4 grow text-left">
                    <span className="text-base font-bold text-white tracking-wide">
                        {level.label}
                    </span>
                    <span className="text-[9px] text-white/40 font-medium tracking-widest uppercase">
                        {level.desc}
                    </span>
                </div>

                <div className="text-white/20 group-hover:text-white/60 transition-all mr-2">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </div>
             </div>
          </button>
        ))}
      </div>
    </div>
  );
};
