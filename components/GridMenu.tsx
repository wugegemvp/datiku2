import React from 'react';
import { CategoryType } from '../types';
import { CATEGORY_CONFIG, MAIN_MENU_ITEMS } from '../constants';
import { audioService } from '../utils/audioService';

interface GridMenuProps {
  onSelectCategory: (cat: CategoryType) => void;
}

export const GridMenu: React.FC<GridMenuProps> = ({ onSelectCategory }) => {
  const handleClick = (cat: CategoryType) => {
    audioService.check();
    onSelectCategory(cat);
  };

  return (
    <div className="min-h-screen ios-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* 装饰背景光斑 */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* 标题区域 */}
      <div className="z-10 text-center mb-12 relative animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-600 tracking-widest filter drop-shadow-[0_2px_10px_rgba(234,179,8,0.3)] mb-3 leading-tight">
          答题之王
        </h1>
        
        {/* 装饰性副标题 */}
        <div className="flex items-center justify-center gap-4">
           <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/30"></div>
           <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">
             LIVE QUIZ BATTLE
           </p>
           <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/30"></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-5 gap-y-8 z-10 w-full max-w-[360px] px-4">
        {MAIN_MENU_ITEMS.map((cat, index) => {
          const config = CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              onClick={() => handleClick(cat)}
              className="glossy-btn group flex flex-col items-center justify-center gap-3 focus:outline-none"
              style={{ animation: `fadeIn 0.4s ease-out ${index * 0.05}s backwards` }}
            >
              <div className={`glossy-icon w-[4.5rem] h-[4.5rem] flex items-center justify-center text-3xl bg-gradient-to-b ${config.bgGradient}`}>
                <span className="inner-symbol transform group-hover:scale-110 transition-transform duration-300 flex items-center justify-center w-full h-full">
                  {config.icon}
                </span>
              </div>
              <span className="icon-label text-white font-semibold text-[11px] tracking-wide opacity-90">{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};