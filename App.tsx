
import React, { useState, ErrorInfo, ReactNode, useRef, useEffect } from 'react';
import { GridMenu } from './components/GridMenu';
import { LevelMenu } from './components/LevelMenu';
import { LiveGame } from './components/LiveGame';
import { CategoryType } from './types';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: Readonly<ErrorBoundaryProps>;

  public state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-[#f1f5f9] text-[#334155] p-6 text-center">
          界面加载失败，请刷新页面重试
        </div>
      );
    }
    return this.props.children;
  }
}

// 配置专属前缀
const STORAGE_PREFIX = 'livequiz_config_v1_';

// 辅助函数：智能读取配置（优先读取新版前缀，如果没有则读取旧版无前缀数据）
const getSaved = (key: string, defaultValue: any) => {
  try {
    // 1. 尝试读取带版本前缀的配置
    let saved = localStorage.getItem(STORAGE_PREFIX + key);
    
    // 2. 如果没找到，尝试读取旧版配置 (兼容您之前的设置)
    if (saved === null) {
      saved = localStorage.getItem(key);
    }

    // 3. 校验数据有效性
    if (!saved || saved === 'undefined' || saved === 'null') return defaultValue;
    return JSON.parse(saved);
  } catch (e) {
    console.warn(`Config load failed for ${key}, using default.`);
    return defaultValue;
  }
};

const saveConfig = (key: string, value: any) => {
  try {
    // 保存时同时写入带前缀的key，确保后续稳定性
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error("Save config failed", e);
  }
};

// 默认安全配置 (90%宽度，防止溢出)
const DEFAULTS = {
  qScale: 0.9,
  qWidthScale: 0.9,
  qFontSize: 20,
  qOffset: 0,
  oScale: 0.9,
  oWidthScale: 0.9,
  oFontSize: 16,
  oOffset: 0,
  dims: { w: 375, h: 620 },
  pos: { x: 50, y: 50 }
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [isLevelMenuVisible, setIsLevelMenuVisible] = useState(false);
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const [revealTrigger, setRevealTrigger] = useState<number>(0);
  const [nextTrigger, setNextTrigger] = useState<number>(0);
  
  // 保存状态反馈
  const [isSaved, setIsSaved] = useState(false);
  const [isReset, setIsReset] = useState(false);
  
  /**
   * --- 布局参数 (State) ---
   * 初始化时通过 getSaved 读取，包含旧数据兼容逻辑
   */
  const [qScale, setQScale] = useState(() => getSaved('qScale', DEFAULTS.qScale));
  const [qWidthScale, setQWidthScale] = useState(() => getSaved('qWidthScale', DEFAULTS.qWidthScale)); 
  const [qFontSize, setQFontSize] = useState(() => getSaved('qFontSize', DEFAULTS.qFontSize));       
  const [qOffset, setQOffset] = useState(() => getSaved('qOffset', DEFAULTS.qOffset));

  const [oScale, setOScale] = useState(() => getSaved('oScale', DEFAULTS.oScale));
  const [oWidthScale, setOWidthScale] = useState(() => getSaved('oWidthScale', DEFAULTS.oWidthScale)); 
  const [oFontSize, setOFontSize] = useState(() => getSaved('oFontSize', DEFAULTS.oFontSize));       
  const [oOffset, setOOffset] = useState(() => getSaved('oOffset', DEFAULTS.oOffset));             

  const [dims, setDims] = useState(() => getSaved('dims', DEFAULTS.dims));
  const [pos, setPos] = useState(() => getSaved('pos', DEFAULTS.pos));
  
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  // 实时保存：每当状态变化，自动写入 LocalStorage
  useEffect(() => {
    saveConfig('qScale', qScale);
    saveConfig('qWidthScale', qWidthScale);
    saveConfig('qFontSize', qFontSize);
    saveConfig('qOffset', qOffset);
    saveConfig('oScale', oScale);
    saveConfig('oWidthScale', oWidthScale);
    saveConfig('oFontSize', oFontSize);
    saveConfig('oOffset', oOffset);
    saveConfig('dims', dims);
    saveConfig('pos', pos);
  }, [qScale, qWidthScale, qFontSize, qOffset, oScale, oWidthScale, oFontSize, oOffset, dims, pos]);

  const adjustDim = (axis: 'w' | 'h', delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDims(prev => ({
      ...prev,
      [axis]: Math.max(280, Math.min(1200, prev[axis] + delta))
    }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: pos.x, y: pos.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      setPos({
        x: initialPos.current.x + dx,
        y: initialPos.current.y + dy
      });
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleCategorySelect = (cat: CategoryType) => {
    setSelectedCategory(cat);
    setSelectedLevelId(1); 
    setIsLevelMenuVisible(false);
    setActiveControl(null);
  };

  const handleLevelSelect = (id: number) => {
    setSelectedLevelId(id);
    setIsLevelMenuVisible(false);
    setActiveControl(null);
  };

  const handleBackToMenu = () => {
    setSelectedCategory(null);
    setSelectedLevelId(null);
    setIsLevelMenuVisible(false);
    setActiveControl(null);
  };

  // 设为默认功能 (Visual Feedback only, as data is auto-saved)
  const handleSetDefault = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // 重置功能
  const handleReset = () => {
    if (confirm('确定要重置所有布局设置吗？')) {
        setQScale(DEFAULTS.qScale);
        setQWidthScale(DEFAULTS.qWidthScale);
        setQFontSize(DEFAULTS.qFontSize);
        setQOffset(DEFAULTS.qOffset);
        setOScale(DEFAULTS.oScale);
        setOWidthScale(DEFAULTS.oWidthScale);
        setOFontSize(DEFAULTS.oFontSize);
        setOOffset(DEFAULTS.oOffset);
        setDims(DEFAULTS.dims);
        setPos(DEFAULTS.pos);
        
        setIsReset(true);
        setTimeout(() => setIsReset(false), 2000);
    }
  };

  return (
    <ErrorBoundary>
      <div className="w-full h-screen bg-[#f5f7fa] flex justify-start items-center pl-4 sm:pl-24 overflow-hidden relative">
        
        {/* 悬浮调节器 */}
        <div 
          className="absolute z-50 transition-shadow duration-200 select-none cursor-move"
          style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
          onMouseDown={handleMouseDown}
        >
            <div className={`main-regulator bg-white/40 p-1.5 rounded-[30px] backdrop-blur-sm border border-slate-100/50 shadow-sm transition-transform ${isDragging ? 'scale-105' : 'scale-100'}`}>
                <div className="up-row">
                    <button onMouseDown={e => e.stopPropagation()} onClick={e => adjustDim('h', 40, e)} className="card1 flex items-start justify-start cursor-default" title="变高">
                        <svg className="icon-svg card1-icon" viewBox="0 0 24 24"><path d="M12 4l-8 8h6v8h4v-8h6l-8-8z"/></svg>
                    </button>
                    <button onMouseDown={e => e.stopPropagation()} onClick={e => adjustDim('w', 40, e)} className="card2 flex items-start justify-end cursor-default" title="变胖">
                        <svg className="icon-svg card2-icon" viewBox="0 0 24 24"><path d="M18 10V4l6 8-6 8v-6H6v6l-6-8 6-8v6h12z"/></svg>
                    </button>
                </div>
                <div className="down-row">
                    <button onMouseDown={e => e.stopPropagation()} onClick={e => adjustDim('h', -40, e)} className="card3 flex items-end justify-start cursor-default" title="变矮">
                        <svg className="icon-svg card3-icon" viewBox="0 0 24 24"><path d="M12 20l8-8h-6V4h-4v8H4l8 8z"/></svg>
                    </button>
                    <button onMouseDown={e => e.stopPropagation()} onClick={e => adjustDim('w', -40, e)} className="card4 flex items-end justify-end cursor-default" title="变瘦">
                        <svg className="icon-svg card4-icon" viewBox="0 0 24 24"><path d="M6 14v6l-6-8 6-8v6h12V4l6 8-6 8v-6H6z"/></svg>
                    </button>
                </div>
            </div>
            <div className="mt-3 px-3 py-1 bg-slate-200/50 rounded-full text-[9px] font-mono text-slate-500 text-center border border-slate-300/30">
                {dims.w} × {dims.h}
            </div>
        </div>

        {/* 游戏主容器 */}
        <div 
          className="relative transition-all duration-300 ease-in-out flex items-center justify-center shrink-0 z-10"
          style={{ width: `${dims.w}px`, height: `${dims.h}px` }}
        >
          <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-[100px] scale-110 opacity-30 animate-pulse"></div>
          <div className="absolute inset-0 bg-black/10 blur-[80px] rounded-[50px] scale-90 opacity-40"></div>
          
          <div className="w-full h-full relative overflow-hidden bg-[#0a0c10] shadow-[0_60px_120px_rgba(0,0,0,0.6)] sm:rounded-[44px] sm:border-[10px] sm:border-[#1a1c22] ring-1 ring-black/20 flex flex-col">
            <div className="flex-1 relative overflow-hidden ios-bg">
              {!selectedCategory ? (
                <GridMenu onSelectCategory={handleCategorySelect} />
              ) : isLevelMenuVisible ? (
                <LevelMenu 
                  category={selectedCategory} 
                  onSelectLevel={handleLevelSelect} 
                  onBack={() => setIsLevelMenuVisible(false)}
                />
              ) : (
                <LiveGame 
                  key={`${selectedCategory}-${selectedLevelId}`}
                  category={selectedCategory} 
                  levelId={selectedLevelId || 1}
                  revealTrigger={revealTrigger}
                  nextTrigger={nextTrigger}
                  qScale={qScale}
                  qWidthScale={qWidthScale}
                  qFontSize={qFontSize}
                  qOffset={qOffset}
                  oScale={oScale}
                  oWidthScale={oWidthScale}
                  oFontSize={oFontSize}
                  oOffset={oOffset}
                  onExit={() => setSelectedCategory(null)} 
                />
              )}
            </div>
          </div>
        </div>

        {/* 侧边辅助控制区 */}
        <div className="ml-16 flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out_0.2s_backwards] z-10">
          
          <div className="radio-input">
            <label className="label">
              <input type="radio" name="control" checked={activeControl === 'answer'} onChange={() => { setActiveControl('answer'); setRevealTrigger(p => p+1); }} />
              <p className="text">查看答案</p>
            </label>
            <label className="label">
              <input type="radio" name="control" checked={activeControl === 'next'} onChange={() => { setActiveControl('next'); setNextTrigger(p => p+1); }} />
              <p className="text">下一题</p>
            </label>
            <label className="label">
              <input type="radio" name="control" checked={activeControl === 'jump'} onChange={() => { setActiveControl('jump'); setIsLevelMenuVisible(true); }} />
              <p className="text">跳转关卡</p>
            </label>
            <label className="label">
              <input type="radio" name="control" checked={activeControl === 'back'} onChange={() => { setActiveControl('back'); handleBackToMenu(); }} />
              <p className="text">返回菜单</p>
            </label>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm flex flex-col gap-4 w-[240px]">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
               <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
               <span className="text-xs font-black text-slate-800 tracking-wider">双区独立调节</span>
            </div>

            <div className="flex flex-col gap-2">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">题目区 (红框)</span>
                  <span className="text-[9px] text-slate-400 font-bold">{Math.round(qWidthScale*100)}%W / {qFontSize}px</span>
               </div>
               <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setQScale(s => Number((Math.min(1.5, s + 0.05)).toFixed(2)))} className="py-1 bg-red-50 text-red-600 rounded-lg text-xs font-black border border-red-100 hover:bg-red-100">放+</button>
                  <button onClick={() => setQScale(s => Number((Math.max(0.5, s - 0.05)).toFixed(2)))} className="py-1 bg-red-50 text-red-600 rounded-lg text-xs font-black border border-red-100 hover:bg-red-100">缩-</button>
                  <button onClick={() => setQWidthScale(s => Number((Math.min(2.0, s + 0.1)).toFixed(1)))} className="py-1 bg-slate-50 text-slate-700 rounded-lg text-xs font-black border border-slate-200 hover:bg-slate-100">宽+</button>
                  <button onClick={() => setQWidthScale(s => Number((Math.max(0.5, s - 0.1)).toFixed(1)))} className="py-1 bg-slate-50 text-slate-700 rounded-lg text-xs font-black border border-slate-200 hover:bg-slate-100">宽-</button>
                  <button onClick={() => setQFontSize(s => Math.min(48, s + 1))} className="py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-black border border-blue-100 hover:bg-blue-100">字+</button>
                  <button onClick={() => setQFontSize(s => Math.max(12, s - 1))} className="py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-black border border-blue-100 hover:bg-blue-100">字-</button>
                  <button onClick={() => setQOffset(o => o - 5)} className="py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-black border border-slate-100 hover:bg-slate-200">↑</button>
                  <button onClick={() => setQOffset(o => o + 5)} className="py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-black border border-slate-100 hover:bg-slate-200">↓</button>
               </div>
            </div>

            <div className="h-[1px] bg-slate-100"></div>

            <div className="flex flex-col gap-2">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">选项区 (黄框)</span>
                  <span className="text-[9px] text-slate-400 font-bold">{Math.round(oWidthScale*100)}%W / {oFontSize}px</span>
               </div>
               <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setOScale(s => Number((Math.min(1.5, s + 0.05)).toFixed(2)))} className="py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-black border border-amber-100 hover:bg-amber-100">放+</button>
                  <button onClick={() => setOScale(s => Number((Math.max(0.5, s - 0.05)).toFixed(2)))} className="py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-black border border-amber-100 hover:bg-amber-100">缩-</button>
                  <button onClick={() => setOWidthScale(s => Number((Math.min(2.0, s + 0.1)).toFixed(1)))} className="py-1 bg-slate-50 text-slate-700 rounded-lg text-xs font-black border border-slate-200 hover:bg-slate-100">宽+</button>
                  <button onClick={() => setOWidthScale(s => Number((Math.max(0.5, s - 0.1)).toFixed(1)))} className="py-1 bg-slate-50 text-slate-700 rounded-lg text-xs font-black border border-slate-200 hover:bg-slate-100">宽-</button>
                  <button onClick={() => setOFontSize(s => Math.min(32, s + 1))} className="py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-black border border-blue-100 hover:bg-blue-100">字+</button>
                  <button onClick={() => setOFontSize(s => Math.max(10, s - 1))} className="py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-black border border-blue-100 hover:bg-blue-100">字-</button>
                  <button onClick={() => setOOffset(o => o - 5)} className="py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-black border border-slate-100 hover:bg-slate-200">↑</button>
                  <button onClick={() => setOOffset(o => o + 5)} className="py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-black border border-slate-100 hover:bg-slate-200">↓</button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
                <button 
                onClick={handleReset}
                className={`text-[10px] font-black uppercase tracking-widest py-3 rounded-lg transition-all duration-300 ${
                    isReset
                    ? 'bg-red-500 text-white shadow-red-500/30 shadow-lg' 
                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                }`}
                >
                {isReset ? '已重置' : '重置配置'}
                </button>
                <button 
                onClick={handleSetDefault} 
                className={`text-[10px] font-black uppercase tracking-widest py-3 rounded-lg transition-all duration-300 ${
                    isSaved 
                    ? 'bg-green-500 text-white shadow-green-500/30 shadow-lg scale-[1.02]' 
                    : 'bg-slate-800 text-white hover:bg-slate-700 shadow-slate-500/30 shadow-md hover:scale-[1.02] active:scale-[0.98]'
                }`}
                >
                {isSaved ? '✅ 已保存' : '设为默认'}
                </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
