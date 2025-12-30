
import React, { useState, useEffect, useRef } from 'react';
import { CategoryType, Question } from '../types';
import { CATEGORY_CONFIG, MOCK_QUESTIONS, ROUND_TIME, CHARACTERS, QUESTIONS_PER_ROUND } from '../constants';
import { audioService } from '../utils/audioService';
import { GoogleGenAI, Type } from "@google/genai";

const useQuizStateMachine = (category: CategoryType, levelId: number, revealTrigger: number, nextTrigger: number) => {
  const getInitialQuestions = () => {
    const raw = MOCK_QUESTIONS[category] || MOCK_QUESTIONS["DEFAULT"] || [];
    return [...raw].sort(() => 0.5 - Math.random()).slice(0, QUESTIONS_PER_ROUND);
  };

  const [state, setState] = useState({
    phase: 'READY' as 'READY' | 'COUNTDOWN' | 'REVEAL' | 'WRONG_GUESS' | 'FINISHED',
    questions: getInitialQuestions(),
    currentQIndex: 0,
    score: 0,
    streak: 0,
    timeLeft: ROUND_TIME,
    selectedOption: null as number | null,
    showExplanation: false,
    wasLastCorrect: false, 
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (revealTrigger > 0) {
      if (state.phase === 'COUNTDOWN') {
        handleAnswer(-1); 
      }
      setState(prev => ({ ...prev, showExplanation: true }));
    }
  }, [revealTrigger]);

  useEffect(() => {
    if (nextTrigger > 0) {
      handleNext();
    }
  }, [nextTrigger]);

  useEffect(() => {
    const fetchAIQuestions = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const difficultyContext = levelId <= 2 ? "基础" : levelId <= 4 ? "进阶" : "专家";
        const prompt = `JSON ONLY: Generate ${QUESTIONS_PER_ROUND} ${difficultyContext} level Chinese trivia questions for category "${category}". 
Format: Array of {questionText, options: string[4], correctIndex: number, explanation: string}.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionText: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["questionText", "options", "correctIndex", "explanation"]
              }
            }
          }
        });

        const generated = JSON.parse(response.text || "[]");
        if (generated && generated.length > 0) {
          setState(prev => {
            const newQuestions = [...prev.questions];
            generated.forEach((q: Question, i: number) => {
              newQuestions[i] = q;
            });
            return { ...prev, questions: newQuestions };
          });
        }
      } catch (error) {
        console.warn("AI Load fallback", error);
      }
    };
    fetchAIQuestions();
  }, [category, levelId]);

  useEffect(() => {
    if (state.phase === 'COUNTDOWN') {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeLeft <= 0) {
             if (timerRef.current) clearInterval(timerRef.current);
             return { ...prev, timeLeft: 0, phase: 'WRONG_GUESS' };
          }
          if (prev.timeLeft <= 4) audioService.playTick(true);
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.phase]);

  const startQuiz = () => {
    audioService.check();
    setState(prev => ({ ...prev, phase: 'COUNTDOWN', timeLeft: ROUND_TIME, showExplanation: false, wasLastCorrect: false }));
  };

  const handleAnswer = (idx: number) => {
    if (state.phase !== 'COUNTDOWN') return;
    if (idx === -1) {
      setState(prev => ({ ...prev, phase: 'REVEAL', selectedOption: -1, showExplanation: true, wasLastCorrect: false }));
      return;
    }

    const isCorrect = idx === state.questions[state.currentQIndex].correctIndex;
    if (isCorrect) {
      audioService.playCorrect();
      const earnedScore = state.timeLeft > 0 ? (100 * levelId) : 0;
      setState(prev => ({ 
        ...prev, 
        phase: 'REVEAL', 
        selectedOption: idx, 
        score: prev.score + earnedScore, 
        streak: prev.streak + 1,
        showExplanation: false, 
        wasLastCorrect: true
      }));
    } else {
      audioService.playWrong();
      setState(prev => ({ 
        ...prev, 
        phase: 'WRONG_GUESS', 
        selectedOption: idx, 
        streak: 0,
        showExplanation: false, 
        wasLastCorrect: false
      }));
    }
  };

  const handleNext = () => {
    setState(prev => {
      if (prev.phase === 'READY') return prev;
      const nextIdx = prev.currentQIndex + 1;
      if (nextIdx >= prev.questions.length) return { ...prev, phase: 'FINISHED' };
      return { 
        ...prev, 
        phase: 'COUNTDOWN', 
        currentQIndex: nextIdx, 
        timeLeft: ROUND_TIME, 
        selectedOption: null, 
        showExplanation: false,
        wasLastCorrect: false
      };
    });
  };

  return { state, handleAnswer, startQuiz, handleNext };
};

export const LiveGame: React.FC<{ 
  category: CategoryType, 
  levelId: number, 
  revealTrigger: number, 
  nextTrigger: number, 
  onExit: () => void,
  qScale?: number,
  qWidthScale?: number,
  qFontSize?: number,
  qOffset?: number,
  oScale?: number,
  oWidthScale?: number,
  oFontSize?: number,
  oOffset?: number
}> = ({ 
  category, levelId, revealTrigger, nextTrigger, onExit, 
  qScale = 1.0, qWidthScale = 1.2, qFontSize = 26, qOffset = 0, 
  oScale = 1.0, oWidthScale = 1.7, oFontSize = 24, oOffset = 0 
}) => {
  const { state, handleAnswer, startQuiz, handleNext } = useQuizStateMachine(category, levelId, revealTrigger, nextTrigger);
  const [danmaku, setDanmaku] = useState<any[]>([]);

  useEffect(() => {
    const itv = setInterval(() => {
      if (Math.random() > 0.6) {
        const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        const id = Date.now();
        const quote = char.quotes[Math.floor(Math.random() * char.quotes.length)];
        setDanmaku(p => [...p, { id, user: char.name, text: quote, row: Math.floor(Math.random() * 2) }]);
        setTimeout(() => setDanmaku(p => p.filter(i => i.id !== id)), 4000);
      }
    }, 1200);
    return () => clearInterval(itv);
  }, []);

  const config = CATEGORY_CONFIG[category];
  const currentQ = state.questions[state.currentQIndex];

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col pt-12 no-scrollbar">
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-20 z-0`}></div>

      {/* 顶部 HUD */}
      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-center">
        <div className="flex gap-2">
            <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-black tracking-widest text-white">
                第{levelId}关 · {state.currentQIndex + 1}/10
            </div>
            <div className="bg-yellow-500/40 backdrop-blur-md px-3 py-1 rounded-full border border-yellow-500/50 text-[10px] font-black text-yellow-300">
                ★ {state.score}
            </div>
        </div>
        
        <div className="flex items-center gap-3">
          {state.phase !== 'READY' && state.phase !== 'FINISHED' && (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${state.timeLeft <= 5 ? 'bg-red-500/80 border-white scale-110 animate-pulse' : 'bg-black/60 border-white/30'}`}>
              <span className="text-xl font-black text-white">{state.timeLeft}</span>
            </div>
          )}
          <button onClick={onExit} className="w-8 h-8 rounded-full bg-black/50 text-white/80 flex items-center justify-center hover:bg-black/70 transition-all border border-white/20">✕</button>
        </div>
      </div>

      {/* 弹幕区 */}
      <div className="h-16 relative overflow-hidden pointer-events-none z-20 mb-8 mt-2">
        {danmaku.map(d => (
            <div key={d.id} className="animate-danmaku absolute bg-black/70 px-3 py-1 rounded-full text-[10px] border border-white/10 whitespace-nowrap text-white font-bold shadow-xl" style={{ top: d.row * 30, animationDuration: '4s' }}>
                <span className="text-yellow-400 mr-1">{d.user}:</span> {d.text}
            </div>
        ))}
      </div>

      <div className="z-20 flex-1 overflow-y-auto pb-8 no-scrollbar flex flex-col items-center">
        {state.phase === 'READY' ? (
          <div className="flex-1 flex flex-col items-center justify-center animate-[fadeIn_0.5s_ease-out] w-full px-5">
             <div className="relative w-full max-w-[340px] aspect-[4/5] flex flex-col items-center justify-center p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]">
                
                <div className={`absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br ${config.bgGradient} opacity-30 blur-[60px]`}></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 blur-[60px]"></div>

                {/* 图标容器 */}
                <div className="relative w-44 h-44 mb-10 group">
                   <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} rounded-[3rem] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity animate-pulse`}></div>
                   <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.5)] border-4 border-white/40 flex items-center justify-center transition-transform group-hover:scale-105`}>
                      <div className="transform flex items-center justify-center w-full h-full scale-[2.2] group-hover:rotate-6 transition-transform duration-700 drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]">
                        {config.icon}
                      </div>
                   </div>
                </div>

                <h2 className="text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] text-center">
                  {category}
                </h2>
                
                <div className="mb-14 h-8"></div>

                <button 
                  onClick={startQuiz} 
                  className="group relative w-full py-6 rounded-3xl bg-white shadow-[0_20px_40px_rgba(255,255,255,0.15)] overflow-hidden transition-all hover:scale-105 active:scale-95"
                >
                   <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <span className="relative z-10 text-2xl font-black text-black tracking-[0.2em]">开始答题</span>
                </button>
             </div>
          </div>
        ) : currentQ && state.phase !== 'FINISHED' ? (
          <div className="flex flex-col relative h-full w-full items-center">
            
            {/* 1. 题目区 - 使用真实宽度百分比布局 */}
            <div 
              style={{ 
                width: `${qWidthScale * 100}%`,
                marginTop: `${qOffset}px`,
                transform: `scale(${qScale})`,
                transformOrigin: 'top center',
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              className="relative mb-6 z-10"
            >
              <div className="bg-[#0f172a] backdrop-blur-3xl p-8 rounded-[32px] border-2 border-white/20 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] animate-[fadeIn_0.3s_ease-out] ring-1 ring-white/10 flex items-center justify-center overflow-hidden min-h-[140px]">
                  <div 
                    className="font-black text-white text-center leading-relaxed tracking-wide"
                    style={{ fontSize: `${qFontSize}px` }}
                  >
                      {currentQ.questionText}
                  </div>
              </div>
            </div>

            {/* 2. 选项区 - 使用真实宽度百分比布局 */}
            <div 
              style={{ 
                width: `${oWidthScale * 100}%`,
                marginTop: `${oOffset}px`,
                transform: `scale(${oScale})`,
                transformOrigin: 'top center',
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              className="z-0"
            >
              <div className="space-y-4">
                  {currentQ.options.map((opt, idx) => {
                      const isSelected = state.selectedOption === idx;
                      const isCorrect = idx === currentQ.correctIndex;
                      let style = "bg-white/20 border-white/40 text-white shadow-xl";
                      
                      if (state.phase === 'REVEAL' || state.phase === 'WRONG_GUESS') {
                          if (isCorrect && (state.showExplanation || state.wasLastCorrect)) {
                            style = "bg-green-500/60 border-green-400 text-white scale-[1.03] shadow-[0_0_40px_rgba(34,197,94,0.5)] z-10";
                          } 
                          else if (isSelected && !isCorrect) {
                            style = "bg-red-500/60 border-red-400 text-white z-10";
                          }
                          else {
                            style = "bg-white/5 border-white/10 text-white/50";
                          }
                      } else if (isSelected) {
                          style = "bg-white/50 border-white/80 scale-[0.98] text-white";
                      }

                      return (
                          <button
                              key={idx}
                              onClick={() => handleAnswer(idx)}
                              disabled={state.phase !== 'COUNTDOWN'}
                              className={`w-full p-5 rounded-2xl border-2 text-left font-black transition-all duration-200 flex justify-between items-center active:scale-[0.97] overflow-hidden ${style}`}
                          >
                              <div className="flex items-center flex-1">
                                <span className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center mr-4 text-xs font-black ring-1 ring-white/20 shrink-0">{['A', 'B', 'C', 'D'][idx]}</span>
                                <span style={{ fontSize: `${oFontSize}px` }} className="flex-1 leading-snug">{opt}</span>
                              </div>
                              
                              <div className="shrink-0 ml-2">
                                {(isCorrect && (state.showExplanation || state.wasLastCorrect)) && <span className="text-2xl drop-shadow-lg">✅</span>}
                                {((state.phase === 'WRONG_GUESS') && isSelected && !isCorrect) && <span className="text-2xl drop-shadow-lg">❌</span>}
                              </div>
                          </button>
                      );
                  })}
              </div>

              {state.showExplanation && currentQ.explanation && (
                <div 
                  className="mt-8 p-6 rounded-[24px] bg-black/70 border-2 border-yellow-500/30 animate-[fadeIn_0.4s_ease-out] shadow-2xl"
                  style={{ width: '100%', marginInline: 'auto' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                     <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
                     <p className="text-[10px] text-yellow-400 font-black tracking-[0.3em] uppercase">答案深度解析</p>
                  </div>
                  <p className="text-base text-slate-100 font-bold leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              {/* Next Question Button - Manual Control */}
              {(state.phase === 'REVEAL' || state.phase === 'WRONG_GUESS') && (
                  <div className="mt-8 flex justify-center w-full animate-[fadeIn_0.3s_ease-out]">
                      <button 
                          onClick={handleNext}
                          className="px-10 py-4 bg-white text-black font-black text-xl rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all border-4 border-slate-100"
                      >
                          下一题 ➜
                      </button>
                  </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {state.phase === 'FINISHED' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl p-8 text-center animate-[fadeIn_0.5s_ease-out]">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center text-6xl mb-8 shadow-[0_0_60px_rgba(234,179,8,0.5)] border-4 border-white/30">🏆</div>
              <h2 className="text-5xl font-black mb-3 text-white uppercase tracking-tight drop-shadow-2xl leading-none">关卡大捷</h2>
              <p className="text-white/50 text-[10px] font-black mb-12 tracking-[0.6em] uppercase">第 {levelId} 关 · 完美通关</p>
              <div className="bg-white/5 border border-white/20 rounded-[48px] p-10 w-full mb-14 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                <span className="text-[10px] text-white/40 font-black mb-4 block uppercase tracking-widest">最终荣誉积分</span>
                <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-200 to-yellow-600 drop-shadow-2xl">{state.score}</div>
              </div>
              <button onClick={onExit} className="w-full py-6 rounded-[32px] bg-white text-black font-black text-2xl shadow-[0_25px_50px_rgba(255,255,255,0.15)] hover:scale-105 transition-transform active:scale-95">返回大厅</button>
          </div>
      )}
    </div>
  );
};
