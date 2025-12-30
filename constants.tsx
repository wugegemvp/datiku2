
import React from 'react';
import { CategoryType, CategoryConfig, Character, GameLevel, Question } from './types';

export const CATEGORY_CONFIG: Record<CategoryType, CategoryConfig> = {
  [CategoryType.EXPERT]: { 
    icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Basketball.png" alt="Expert" className="w-[75%] h-[75%] object-contain drop-shadow-lg" />, 
    bgGradient: 'from-orange-500 to-red-600' 
  },
  [CategoryType.FOOTBALL]: { 
    icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Soccer%20Ball.png" alt="Football" className="w-[75%] h-[75%] object-contain drop-shadow-lg" />, 
    bgGradient: 'from-emerald-500 to-green-700' 
  },
  [CategoryType.LOL]: { 
    icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Video%20Game.png" alt="LOL" className="w-[75%] h-[75%] object-contain drop-shadow-lg" />, 
    bgGradient: 'from-violet-500 to-indigo-700' 
  },
  [CategoryType.HISTORY]: { icon: <span className="text-4xl">📜</span>, bgGradient: 'from-amber-400 to-yellow-700' },
  [CategoryType.RAP]: { icon: <span className="text-4xl">🎤</span>, bgGradient: 'from-slate-700 to-black' },
  [CategoryType.TFT]: { 
    icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Cooking.png" alt="TFT" className="w-[75%] h-[75%] object-contain drop-shadow-lg" />, 
    bgGradient: 'from-yellow-400 to-orange-500' 
  },
  [CategoryType.VOLLEYBALL]: { icon: <span className="text-4xl">🏐</span>, bgGradient: 'from-yellow-400 to-orange-500' },
  [CategoryType.BADMINTON]: { icon: <span className="text-4xl">🏸</span>, bgGradient: 'from-teal-400 to-emerald-600' },
  [CategoryType.TENNIS]: { icon: <span className="text-4xl">🎾</span>, bgGradient: 'from-lime-400 to-green-600' },
  [CategoryType.OLYMPICS]: { icon: <span className="text-4xl">🥇</span>, bgGradient: 'from-blue-500 to-indigo-700' },
  [CategoryType.TABLE_TENNIS]: { icon: <span className="text-4xl">🏓</span>, bgGradient: 'from-orange-400 to-red-600' },
  [CategoryType.SWIMMING]: { icon: <span className="text-4xl">🏊</span>, bgGradient: 'from-cyan-400 to-blue-600' },
  [CategoryType.TRACK_AND_FIELD]: { icon: <span className="text-4xl">🏃</span>, bgGradient: 'from-amber-500 to-orange-700' },
  [CategoryType.F1]: { icon: <span className="text-4xl">🏎️</span>, bgGradient: 'from-red-600 to-red-900' },
  [CategoryType.BILLIARDS]: { icon: <span className="text-4xl">🎱</span>, bgGradient: 'from-slate-600 to-slate-900' },
};

export const MAIN_MENU_ITEMS = [CategoryType.EXPERT, CategoryType.FOOTBALL, CategoryType.LOL, CategoryType.HISTORY, CategoryType.RAP, CategoryType.TFT];
export const TOTAL_ROUNDS = 5;
export const QUESTIONS_PER_ROUND = 10;
export const ROUND_TIME = 30; // Increased from 8 to 30 seconds

export const GAME_LEVELS: GameLevel[] = [
  // Added icons to GAME_LEVELS
  { id: 1, label: '第一关', color: 'from-blue-400 to-blue-600', desc: '牛刀小试', icon: '🌱' },
  { id: 2, label: '第二关', color: 'from-emerald-400 to-emerald-600', desc: '渐入佳境', icon: '🌿' },
  { id: 3, label: '第三关', color: 'from-amber-400 to-amber-600', desc: '智力博弈', icon: '🌳' },
  { id: 4, label: '第四关', color: 'from-orange-500 to-orange-700', desc: '巅峰对决', icon: '🏔️' },
  { id: 5, label: '第五关', color: 'from-purple-500 to-purple-800', desc: '终极挑战', icon: '👑' },
];

export const CHARACTERS: Character[] = [
  { name: "秦始皇", tags: ["HISTORY"], quotes: ["朕统六国，但这题朕不会", "修长城都没这题难"] },
  { name: "诸葛亮", tags: ["SMART"], quotes: ["略懂略懂，此题选C", "我看天象，今日宜选A"] },
  { name: "科比", tags: ["SPORTS"], quotes: ["你见过凌晨四点的题库吗？", "曼巴精神，永不言弃"] },
  { name: "爱因斯坦", tags: ["SCIENCE"], quotes: ["相对论告诉我选B", "E=mc²，答案=D"] },
  { name: "孙悟空", tags: ["FICTION"], quotes: ["吃俺老孙一棒！答案是A", "师父，这题有妖气"] }
];

export const MOCK_QUESTIONS: Partial<Record<CategoryType | "DEFAULT", Question[]>> = {
  "DEFAULT": [
    { questionText: "标准跑道一圈多少米？", options: ["200", "400", "800", "1000"], correctIndex: 1, explanation: "标准田径跑道最内圈为400米。" },
    { questionText: "篮球比赛每队上场几人？", options: ["4", "5", "6", "11"], correctIndex: 1, explanation: "篮球比赛每队上场5人。" }
  ]
};
