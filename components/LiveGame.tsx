import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CategoryType, Question, DanmakuItem, ActiveDanmaku } from '../types';
import { CATEGORY_CONFIG, MOCK_QUESTIONS, ROUND_TIME, CHARACTERS, MOCKERY_QUOTES } from '../constants';
import { audioService } from '../utils/audioService';

// --- Types & State Machine Definition ---

type GamePhase = 'IDLE' | 'COUNTDOWN' | 'LOCKED' | 'REVEAL' | 'FINISHED';

interface QuizState {
  phase: GamePhase;
  questions: Question[];
  currentQIndex: number;
  score: number;
  streak: number;
  timeLeft: number;
  selectedOption: number | null;
}

interface Heart {
  id: number;
  left: number;
  sway: number;
  scale: number;
  color: string;
}

// --- Logic Hook (Separation of Concerns) ---

const useQuizStateMachine = (category: CategoryType, onExit: () => void) => {
  const [state, setState] = useState<QuizState>({
    phase: 'IDLE',
    questions: [],
    currentQIndex: 0,
    score: 0,
    streak: 0,
    timeLeft: ROUND_TIME,
    selectedOption: null,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Initialize & Fetch Data
  useEffect(() => {
    const initGame = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let rawQuestions = MOCK_QUESTIONS[category] || MOCK_QUESTIONS["DEFAULT"];
      if (!rawQuestions) rawQuestions = [];
      // Ensure we have enough questions
      while (rawQuestions.length < 3) { rawQuestions = [...rawQuestions, ...rawQuestions]; }
      
      // Randomize questions for replayability
      const shuffled = [...rawQuestions].sort(() => 0.5 - Math.random());
      const gameQuestions = shuffled.slice(0, 3).map(q => ({...q}));

      setState(prev => ({
        ...prev,
        phase: 'COUNTDOWN',
        questions: gameQuestions,
        currentQIndex: 0,
        timeLeft: ROUND_TIME
      }));
    };

    if (state.phase === 'IDLE') {
      initGame();
    }
    
    return () => clearTimer();
  }, [state.phase, category]); // Added state.phase dependency to allow restart

  // 2. Timer Logic (Only active in COUNTDOWN)
  useEffect(() => {
    if (state.phase === 'COUNTDOWN') {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeLeft <= 1) {
            // Time out -> Reveal as wrong
            return handleTimeOutTransition(prev);
          }
          if (prev.timeLeft <= 4) audioService.playTick(true);
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [state.phase]);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTimeOutTransition = (prev: QuizState): QuizState => {
    audioService.playWrong();
    return {
      ...prev,
      phase: 'REVEAL',
      selectedOption: -1, // -1 indicates timeout/no selection
      streak: 0, // Reset streak on timeout
    };
  };

  // 3. User Interaction
  const handleAnswer = (optionIndex: number) => {
    if (state.phase !== 'COUNTDOWN') return;

    setState(prev => ({
      ...prev,
      phase: 'LOCKED', // Prevent double clicks
      selectedOption: optionIndex
    }));

    // Small delay before reveal for visual feedback
    setTimeout(() => {
      setState(prev => {
        const currentQ = prev.questions[prev.currentQIndex];
        const isCorrect = optionIndex === currentQ.correctIndex;
        
        if (isCorrect) {
          audioService.playCorrect();
        } else {
          audioService.playWrong();
        }

        return {
          ...prev,
          phase: 'REVEAL',
          score: isCorrect ? prev.score + (100 + prev.streak * 10) : prev.score,
          streak: isCorrect ? prev.streak + 1 : 0
        };
      });
    }, 300); // 300ms lock phase
  };

  // 4. Auto-Advance after Reveal
  useEffect(() => {
    if (state.phase === 'REVEAL') {
      const timer = setTimeout(() => {
        setState(prev => {
          const nextIndex = prev.currentQIndex + 1;
          if (nextIndex >= prev.questions.length) {
             return { ...prev, phase: 'FINISHED' };
          }
          return {
            ...prev,
            phase: 'COUNTDOWN',
            currentQIndex: nextIndex,
            timeLeft: ROUND_TIME,
            selectedOption: null
          };
        });
      }, 2000); // Show answer for 2 seconds
      return () => clearTimeout(timer);
    } 
  }, [state.phase]);

  const restartGame = () => {
    setState({
        phase: 'IDLE',
        questions: [],
        currentQIndex: 0,
        score: 0,
        streak: 0,
        timeLeft: ROUND_TIME,
        selectedOption: null,
    });
  };

  return { state, handleAnswer, restartGame };
};

// --- Helper: Danmaku Logic (Preserved) ---
const useDanmakuSystem = (category: CategoryType, triggerMockery: boolean) => {
  const [activeDanmaku, setActiveDanmaku] = useState<ActiveDanmaku[]>([]);
  const danmakuPoolRef = useRef<DanmakuItem[]>([]);
  const lastSpawnTimeRef = useRef([0, 0]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const db: DanmakuItem[] = [];
    const pool = CHARACTERS;
    for(let i=0; i<100; i++) {
        const char = pool[Math.floor(Math.random() * pool.length)];
        db.push({ id: `d_${i}`, user: char.name, text: char.quotes[Math.floor(Math.random()*char.quotes.length)] });
    }
    danmakuPoolRef.current = db;

    const interval = setInterval(() => {
       if (!mountedRef.current) return;
       const now = Date.now();
       if (Math.random() > 0.4) {
         const row = Math.random() > 0.5 ? 0 : 1;
         if (now - lastSpawnTimeRef.current[row] > 2000) {
            lastSpawnTimeRef.current[row] = now;
            const item = danmakuPoolRef.current[Math.floor(Math.random() * danmakuPoolRef.current.length)];
             setActiveDanmaku(p => [...p, {
                 ...item,
                 id: now,
                 row,
                 color: Math.random() > 0.7 ? 'text-yellow-300' : 'text-white'
             }]);
             setTimeout(() => {
                 if (mountedRef.current) setActiveDanmaku(p => p.filter(i => i.id !== now));
             }, 6000);
         }
       }
    }, 500);

    return () => { 
        mountedRef.current = false; 
        clearInterval(interval);
    };
  }, [category]);

  useEffect(() => {
    if (triggerMockery) {
       const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
       const text = MOCKERY_QUOTES[Math.floor(Math.random() * MOCKERY_QUOTES.length)];
       const id = Date.now();
       setActiveDanmaku(p => [...p, { id, user: char.name, text, row: Math.random() > 0.5 ? 0 : 1, color: 'text-red-400 font-bold' }]);
       setTimeout(() => setActiveDanmaku(p => p.filter(i => i.id !== id)), 5000);
    }
  }, [triggerMockery]);

  return activeDanmaku;
};

// --- Helper: Hearts Logic (Preserved) ---
const useFloatingHearts = () => {
    const [hearts, setHearts] = useState<Heart[]>([]);
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.6) {
                const id = Date.now();
                setHearts(p => [...p, {
                    id,
                    left: Math.random() * 80 + 10,
                    sway: (Math.random() - 0.5) * 80,
                    scale: 0.8 + Math.random() * 0.7,
                    color: ['#ff4d4d', '#ff80bf', '#ff99cc', '#ffccdd'][Math.floor(Math.random() * 4)]
                }].slice(-15));
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);
    return hearts;
};

// --- Main Component ---

interface LiveGameProps {
  category: CategoryType;
  difficulty: string;
  onExit: () => void;
}

export const LiveGame: React.FC<LiveGameProps> = ({ category, difficulty, onExit }) => {
  // 1. Hook into State Machine
  const { state, handleAnswer, restartGame } = useQuizStateMachine(category, onExit);
  
  // 2. Auxiliary Systems
  const showMockery = state.phase === 'REVEAL' && state.selectedOption !== state.questions[state.currentQIndex]?.correctIndex;
  const activeDanmaku = useDanmakuSystem(category, showMockery);
  const hearts = useFloatingHearts();
  
  // 3. UI States (Shake)
  const [isShaking, setIsShaking] = useState(false);

  // Trigger Shake on Wrong Answer
  useEffect(() => {
    if (state.phase === 'REVEAL') {
        const isWrong = state.selectedOption !== state.questions[state.currentQIndex]?.correctIndex;
        if (isWrong) {
            setIsShaking(true);
            const timer = setTimeout(() => setIsShaking(false), 500);
            return () => clearTimeout(timer);
        }
    }
  }, [state.phase, state.selectedOption, state.questions, state.currentQIndex]);

  // Keyboard Support (1-4, A-D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (state.phase !== 'COUNTDOWN') return;
        
        const keyMap: Record<string, number> = {
            '1': 0, '2': 1, '3': 2, '4': 3,
            'a': 0, 'b': 1, 'c': 2, 'd': 3,
            'A': 0, 'B': 1, 'C': 2, 'D': 3
        };
        
        if (e.key in keyMap) {
            handleAnswer(keyMap[e.key]);
        }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.phase, handleAnswer]);

  const config = CATEGORY_CONFIG[category];
  const currentQ = state.questions[state.currentQIndex];
  const OPTION_LABELS = ['A.', 'B.', 'C.', 'D.'];

  // Render Helpers
  const getButtonStateClass = (index: number) => {
    if (state.phase !== 'REVEAL') {
        if (state.selectedOption === index) return "bg-white/20 border-white/40 click-animate";
        return "bg-gradient-to-r from-white/10 to-transparent border-white/15 hover:from-white/20 hover:to-white/5 hover:border-white/30";
    }
    
    // REVEAL Phase Logic
    const isCorrectOption = index === currentQ.correctIndex;
    const isUserSelected = index === state.selectedOption;

    if (isCorrectOption) {
        return "bg-gradient-to-r from-green-500/30 to-green-500/10 border-green-400/50 shadow-[0_0_20px_rgba(74,222,128,0.2)]";
    }
    if (isUserSelected && !isCorrectOption) {
        return "bg-gradient-to-r from-red-500/30 to-red-500/10 border-red-400/50";
    }
    return "opacity-50 bg-white/5 border-white/5"; // Dim other options
  };

  return (
    <div className={`fixed inset-0 bg-black flex justify-center items-center ${isShaking ? 'animate-shake' : ''}`}>
      <div className="w-full max-w-md h-full relative overflow-hidden bg-gray-900 shadow-2xl sm:rounded-3xl sm:h-[90vh] sm:border sm:border-gray-800">
        
        {/* Background Layers */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-30 z-0`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-0 pointer-events-none"></div>

        {/* Top Controls */}
        <button onClick={onExit} className="absolute top-6 right-6 z-50 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/50 backdrop-blur-sm border border-white/10 transition-colors">✕</button>

        {/* Score & Streak Board */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
            <div className="flex items-center gap-3">
                 <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    <span className="text-yellow-400 text-sm font-black">★ {state.score}</span>
                 </div>
                 {state.streak > 1 && (
                     <div className="bg-orange-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-orange-500/30 animate-pulse">
                        <span className="text-orange-400 text-xs font-black tracking-wider">🔥 {state.streak} COMBO</span>
                     </div>
                 )}
            </div>
            
            {/* Progress Bar REMOVED */}
        </div>

        {/* Countdown Timer */}
        {state.phase !== 'IDLE' && state.phase !== 'FINISHED' && (
          <div className={`absolute top-6 right-20 z-10 transition-transform duration-200 ${state.timeLeft <= 3 ? 'scale-125' : ''}`}>
            <div className={`text-5xl font-black tracking-tighter drop-shadow-2xl ${state.timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {state.timeLeft}
            </div>
          </div>
        )}

        {/* Danmaku Layer */}
        <div className="absolute inset-x-0 top-24 h-32 pointer-events-none overflow-hidden z-30">
          {activeDanmaku.map(item => (
            <div key={item.id} className={`animate-danmaku flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10 shadow-lg`} style={{ top: item.row === 0 ? '10px' : '50px', animationDuration: '5s' }}>
              <span className="text-xs text-gray-200 font-bold">{item.user}:</span>
              <span className={`text-xs font-medium ${item.color}`}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* --- Result Overlay (Broadcast Friendly) --- */}
        {state.phase === 'FINISHED' && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-xl animate-[fadeIn_0.5s_ease-out]">
                <div className="text-center mb-8">
                    <h2 className="text-5xl font-black text-white italic tracking-tighter mb-2" style={{textShadow: '0 0 30px rgba(255,255,255,0.3)'}}>GAME OVER</h2>
                    <p className="text-blue-300 text-sm font-bold tracking-[0.3em] uppercase opacity-80">CHALLENGE COMPLETE</p>
                </div>

                <div className="relative mb-12 transform hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 animate-pulse"></div>
                    <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 drop-shadow-2xl">
                        {state.score}
                    </div>
                </div>
                
                <div className="flex flex-col gap-4 w-64">
                    <button 
                        onClick={restartGame}
                        className="w-full py-4 rounded-xl bg-white text-black font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2"
                    >
                        <span>↺</span> 再来一局
                    </button>
                    <button 
                        onClick={onExit}
                        className="w-full py-4 rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 active:scale-95 transition-all border border-white/5"
                    >
                        返回主页
                    </button>
                </div>
            </div>
        )}

        {/* Main Quiz Area (Hidden when finished) */}
        {state.phase !== 'FINISHED' && (
        <div className="absolute top-[28%] w-full px-5 z-20">
          {state.phase === 'IDLE' ? (
            <div className="text-center animate-bounce mt-10">
              <div className="text-5xl mb-4 flex justify-center">
                <div className="w-16 h-16 flex items-center justify-center">{config.icon}</div>
              </div>
              <p className="text-lg font-bold text-white/80">Loading...</p>
            </div>
          ) : currentQ ? (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              {/* Question Card */}
              <div className="bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-3xl p-5 rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] mb-5 min-h-[100px] flex items-center justify-center relative overflow-hidden">
                 <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                <p className="text-lg font-bold text-center leading-relaxed text-white drop-shadow-sm relative z-10">
                    {currentQ.questionText}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3 relative">
                {currentQ.options.map((opt, idx) => {
                  const btnClass = getButtonStateClass(idx);
                  
                  return (
                    <div key={idx} className="relative">
                      <button
                        disabled={state.phase !== 'COUNTDOWN'}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full p-3.5 rounded-xl text-left border backdrop-blur-xl transition-all duration-300 flex justify-between items-center group relative overflow-hidden ${btnClass}`}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <span className={`font-black font-mono text-sm tracking-wider transition-colors duration-300 ${state.selectedOption === idx ? 'text-white scale-110' : 'text-yellow-400/80'}`}>
                            {OPTION_LABELS[idx]}
                          </span>
                          <span className="font-semibold text-sm text-white/90 transition-colors">
                            {opt}
                          </span>
                        </div>
                        {state.phase === 'REVEAL' && idx === currentQ.correctIndex && <span className="text-lg filter drop-shadow">✅</span>}
                        {state.phase === 'REVEAL' && idx === state.selectedOption && idx !== currentQ.correctIndex && <span className="text-lg filter drop-shadow">❌</span>}
                      </button>
                      
                      {/* +1 Vote/Score Animation placeholder */}
                      {state.phase === 'LOCKED' && state.selectedOption === idx && (
                         <div className="vote-popup right-4 top-2 text-green-400 text-lg drop-shadow-[0_0_5px_rgba(74,222,128,0.8)] z-50">
                          Waiting...
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        )}

        {/* Floating Hearts */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {hearts.map(h => (
            <div 
              key={h.id} 
              className="absolute bottom-0 heart-anim pointer-events-none" 
              style={{ 
                left: `${h.left}%`, 
                '--sway': `${h.sway}px`, 
                transformOrigin: 'center bottom',
                fontSize: `${h.scale}rem`,
                color: h.color,
                textShadow: '0 0 10px rgba(255,100,100,0.5)'
              } as React.CSSProperties}
            >
              ❤️
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};