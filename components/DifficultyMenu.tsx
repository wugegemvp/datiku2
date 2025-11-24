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
    <div className="min-h-screen ios-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="z-10 w-full max-w-[300px] mb-6 relative flex items-center justify-center animate-[fadeIn_0.3s_ease-out]">
        <button 
          onClick={onBack} 
          className="absolute left-0 text-white/50 hover:text-white p-2 transition-colors flex items-center gap-1 -ml-4 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-xs font-bold">返回</span>
        </button>
        
        <div className="text-center pt-2">
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-2xl mb-1 italic">
            选择难度
          </h1>
          <p className="text-blue-200/60 text-xs font-bold tracking-widest uppercase">{category} CHALLENGE</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 z-10 w-full max-w-[300px]">
        {DIFFICULTY_LEVELS.map((level, index) => (
          <button
            key={level.id}
            onClick={() => onSelectDifficulty(level.id)}
            className={`difficulty-btn flex items-center p-4 rounded-2xl bg-gradient-to-r ${level.color} bg-opacity-80 border border-white/20 shadow-lg group relative overflow-hidden backdrop-blur-md transition-all duration-300 active:scale-95`}
            style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s backwards` }}
          >
            <span className="rank-icon mr-4 text-2xl group-hover:scale-110 transition-transform filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{level.icon}</span>
            <div className="text-left">
              <div className="text-white font-bold text-lg tracking-wide shadow-black drop-shadow-md">{level.label}</div>
              <div className="text-white/70 text-xs font-medium">{level.desc}</div>
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-white">
              ▶
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
