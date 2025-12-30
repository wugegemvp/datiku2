
import { ReactNode } from 'react';

export enum CategoryType {
  EXPERT = '答题专家',
  FOOTBALL = '足球',
  LOL = 'LOL',
  HISTORY = '历史',
  RAP = '中国说唱',
  TFT = '金铲铲',
  VOLLEYBALL = '排球',
  BADMINTON = '羽毛球',
  TENNIS = '网球',
  OLYMPICS = '奥运会',
  TABLE_TENNIS = '乒乓球',
  SWIMMING = '游泳',
  TRACK_AND_FIELD = '田径',
  F1 = 'F1赛车',
  BILLIARDS = '台球'
}

export interface CategoryConfig {
  icon: ReactNode;
  bgGradient: string;
}

export interface Question {
  questionText: string;
  options: string[];
  correctIndex: number;
  difficulty?: number;
  explanation?: string;
}

export interface DanmakuItem {
  id: string | number;
  user: string;
  text: string;
  isForeign?: boolean;
}

export interface ActiveDanmaku extends DanmakuItem {
  row: number;
  color: string;
}

export interface Character {
  name: string;
  tags: string[];
  quotes: string[];
}

export interface GameLevel {
  id: number;
  label: string;
  color: string;
  desc: string;
  // Added icon property to support DifficultyMenu
  icon?: ReactNode;
}