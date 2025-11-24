import React, { useState } from 'react';
import { CategoryType } from '../types';
import { CATEGORY_CONFIG, GENERAL_SPORTS_SUB_ITEMS, MAIN_MENU_ITEMS } from '../constants';
import { audioService } from '../utils/audioService';

interface GridMenuProps {
  onSelectCategory: (cat: CategoryType) => void;
}

export const GridMenu: React.FC<GridMenuProps> = ({ onSelectCategory }) => {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const itemsToShow = showSubMenu ? GENERAL_SPORTS_SUB_ITEMS : MAIN_MENU_ITEMS;

  const handleClick = (cat: CategoryType) => {
    audioService.check();
    if (cat === CategoryType.GENERAL_SPORTS && !showSubMenu) {
      setShowSubMenu(true);
    } else {
      onSelectCategory(cat);
    }
  };

  return (
    <div className="min-h-screen ios-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="z-10 text-center mb-8 relative animate-[fadeIn_0.5s_ease-out]">
        {showSubMenu && (
          <button 
            onClick={() => setShowSubMenu(false)} 
            className="absolute -left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 transition-colors"
          >
            ← 返回
          </button>
        )}
        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-2xl mb-1 italic">
          {showSubMenu ? '综合体育' : 'LIVE QUIZ'}
        </h1>
        <p className="text-blue-200/60 text-xs font-bold tracking-widest uppercase">Select Your Channel</p>
      </div>

      <div className="grid grid-cols-3 gap-x-5 gap-y-8 z-10 w-full max-w-[360px] px-4">
        {itemsToShow.map((cat, index) => {
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
