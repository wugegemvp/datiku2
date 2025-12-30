
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
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 装饰背景光斑 */}
      <div className="absolute top-[-5%] left-[-5%] w-[80%] h-[40%] bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[80%] h-[40%] bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>

      {/* 标题区域 - 移除斜体，增强中文美感 */}
      <div className="z-10 text-center mb-10 relative animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-600 tracking-tight filter drop-shadow-[0_4px_15px_rgba(234,179,8,0.4)] mb-2 leading-tight">
          答题之王
        </h1>
        
        <div className="flex items-center justify-center gap-3">
           <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-white/30"></div>
           <p className="text-white/40 text-[9px] font-bold tracking-[0.3em] uppercase">
             LIVE QUIZ BATTLE
           </p>
           <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-white/30"></div>
        </div>
      </div>

      {/* 网格菜单 */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-6 z-10 w-full max-w-[320px]">
        {MAIN_MENU_ITEMS.map((cat, index) => {
          const config = CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              onClick={() => handleClick(cat)}
              className="glossy-btn group flex flex-col items-center justify-center gap-2 focus:outline-none"
              style={{ animation: `fadeIn 0.4s ease-out ${index * 0.05}s backwards` }}
            >
              <div className={`glossy-icon w-20 h-20 flex items-center justify-center text-3xl bg-gradient-to-b ${config.bgGradient}`}>
                <span className="inner-symbol transform group-hover:scale-110 transition-transform duration-300 flex items-center justify-center w-full h-full">
                  {config.icon}
                </span>
              </div>
              <span className="icon-label text-white font-bold text-[11px] tracking-wide opacity-80">{cat}</span>
            </button>
          );
        })}
      </div>
      
      {/* 底部装饰 */}
      <div className="absolute bottom-10 text-[10px] text-white/20 font-medium tracking-widest uppercase pointer-events-none">
        探索更多精彩题库
      </div>
    </div>
  );
};
