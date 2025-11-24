import React, { useState, useEffect, useRef } from 'react';
import { CategoryType, Question, DanmakuItem, ActiveDanmaku } from '../types';
import { CATEGORY_CONFIG, MOCK_QUESTIONS, QUESTIONS_PER_ROUND, TOTAL_ROUNDS, ROUND_TIME, CHARACTERS, MOCKERY_QUOTES } from '../constants';
import { audioService } from '../utils/audioService';

interface LiveGameProps {
  category: CategoryType;
  difficulty: string;
  onExit: () => void;
}

const generateDanmakuForCategory = (category: CategoryType): DanmakuItem[] => {
  const db: DanmakuItem[] = [];
  const targetTags = ["GENERAL"];
  
  if (category === CategoryType.EXPERT) targetTags.push("NBA", "SPORTS");
  else if (category === CategoryType.FOOTBALL) targetTags.push("FOOTBALL", "SPORTS");
  else if ([CategoryType.VOLLEYBALL, CategoryType.BADMINTON, CategoryType.TENNIS, CategoryType.OLYMPICS, CategoryType.TABLE_TENNIS, CategoryType.SWIMMING, CategoryType.TRACK_AND_FIELD, CategoryType.F1, CategoryType.BILLIARDS, CategoryType.GENERAL_SPORTS].includes(category)) targetTags.push("SPORTS");
  else if (category === CategoryType.RAP) targetTags.push("RAP", "ART");
  else if (category === CategoryType.HISTORY) targetTags.push("HISTORY");
  else if (category === CategoryType.LOL) targetTags.push("ANIME", "FICTION", "TECH");
  
  const relevantChars = CHARACTERS.filter(char => char.tags.some(tag => targetTags.includes(tag)));

  while (db.length < 500) {
    const useRelevant = Math.random() > 0.3 && relevantChars.length > 0;
    const pool = useRelevant ? relevantChars : CHARACTERS;
    const char = pool[Math.floor(Math.random() * pool.length)];
    const quote = char.quotes[Math.floor(Math.random() * char.quotes.length)];
    const isForeign = /[·a-zA-Z]/.test(char.name) || ["2Pac", "钢铁侠", "灭霸", "杰瑞", "伏地魔", "科比", "乔布斯", "爱因斯坦"].some(n => char.name.includes(n));

    db.push({
      id: `${char.name}_${db.length}_${Date.now()}`,
      user: char.name,
      text: quote,
      isForeign: isForeign
    });
  }
  return db;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const fetchQuestions = async (category: CategoryType, round: number, count: number): Promise<Question[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  let list = MOCK_QUESTIONS[category] || MOCK_QUESTIONS["DEFAULT"];
  if (!list) list = [];
  while(list.length < count) { list = [...list, ...list]; }
  return list.slice(0, count).map(q => ({...q, difficulty: round}));
};

export const LiveGame: React.FC<LiveGameProps> = ({ category, difficulty, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answerState, setAnswerState] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showVote, setShowVote] = useState<number | null>(null);
  
  const [danmakuPool, setDanmakuPool] = useState<DanmakuItem[]>([]);
  const [activeDanmaku, setActiveDanmaku] = useState<ActiveDanmaku[]>([]);
  const [hearts, setHearts] = useState<{id: number, left: number}[]>([]);
  
  const lastSpawnTimeRef = useRef([0, 0]);
  const poolIndexRef = useRef(0);
  const mountedRef = useRef(true);

  // Initialize and load
  useEffect(() => {
    mountedRef.current = true;
    audioService.initialize();

    const rawPool = generateDanmakuForCategory(category);
    const shuffled = shuffleArray(rawPool);
    setDanmakuPool(shuffled);

    const load = async () => {
      setLoading(true);
      setQIndex(0);
      const data = await fetchQuestions(category, currentRound, QUESTIONS_PER_ROUND);
      if (mountedRef.current) {
        setQuestions(data);
        setLoading(false);
        setTimeLeft(ROUND_TIME);
        setAnswerState('IDLE');
        setSelectedOption(null);
      }
    };
    load();

    return () => { mountedRef.current = false; };
  }, [category, currentRound, difficulty]);

  // Timer
  useEffect(() => {
    if (loading || answerState !== 'IDLE') return;
    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }
    const timer = setInterval(() => {
      if (mountedRef.current) {
        setTimeLeft(t => {
          const next = t - 1;
          if (next <= 3 && next >= 0) audioService.playTick(true);
          return next;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, loading, answerState]);

  // Danmaku loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (!mountedRef.current) return;
      const now = Date.now();

      if (Math.random() > 0.7) setHearts(p => [...p, { id: now, left: Math.random() * 80 + 10 }].slice(-8));

      if (danmakuPool.length > 0 && Math.random() > 0.4) {
        const row = Math.random() > 0.5 ? 0 : 1; 
        if (now - lastSpawnTimeRef.current[row] > 2000) {
          lastSpawnTimeRef.current[row] = now;
          
          const nextComment = danmakuPool[poolIndexRef.current];
          poolIndexRef.current = (poolIndexRef.current + 1) % danmakuPool.length;

          const colorClass = nextComment.isForeign 
            ? (Math.random() > 0.5 ? 'text-cyan-300' : 'text-white')
            : (Math.random() > 0.7 ? 'text-yellow-300' : 'text-white');

          const newItem: ActiveDanmaku = {
            ...nextComment,
            id: now,
            row,
            color: colorClass
          };

          setActiveDanmaku(p => [...p, newItem]);
          setTimeout(() => {
            if (mountedRef.current) setActiveDanmaku(p => p.filter(i => i.id !== now));
          }, 6000);
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [danmakuPool]);

  const triggerMockery = () => {
    const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    const text = MOCKERY_QUOTES[Math.floor(Math.random() * MOCKERY_QUOTES.length)];
    const now = Date.now();
    const row = Math.random() > 0.5 ? 0 : 1;
    
    const newItem: ActiveDanmaku = {
      id: `mock_${now}`,
      user: char.name,
      text: text,
      row: row,
      color: 'text-red-400 font-bold'
    };
    
    setActiveDanmaku(p => [...p, newItem]);
    setTimeout(() => {
      if (mountedRef.current) setActiveDanmaku(p => p.filter(i => i.id !== newItem.id));
    }, 5000);
  };

  const handleTimeOut = () => {
    setAnswerState('WRONG');
    audioService.playWrong();
    triggerMockery();
    setTimeout(nextQuestion, 1500);
  };

  const handleAnswer = (idx: number) => {
    if (answerState !== 'IDLE') return;
    setSelectedOption(idx);
    setShowVote(idx);
    
    const isCorrect = idx === questions[qIndex]?.correctIndex;
    if (isCorrect) {
      if (mountedRef.current) {
        setScore(s => s + 100 * currentRound);
        setAnswerState('CORRECT');
      }
      audioService.playCorrect();
    } else {
      if (mountedRef.current) setAnswerState('WRONG');
      audioService.playWrong();
      triggerMockery();
    }
    setTimeout(() => {
       if(mountedRef.current) setShowVote(null);
       nextQuestion();
    }, 1500);
  };

  const nextQuestion = () => {
    if (!mountedRef.current) return;
    if (qIndex < questions.length - 1) {
      setQIndex(p => p + 1);
      setTimeLeft(ROUND_TIME);
      setAnswerState('IDLE');
      setSelectedOption(null);
    } else {
      if (currentRound < TOTAL_ROUNDS) {
        setCurrentRound(r => r + 1);
      } else {
        alert(`游戏结束！总得分: ${score}`);
        onExit();
      }
    }
  };

  const config = CATEGORY_CONFIG[category];
  const currentQ = questions[qIndex];
  const OPTION_LABELS = ['A.', 'B.', 'C.', 'D.'];

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center">
      <div className="w-full max-w-md h-full relative overflow-hidden bg-gray-900 shadow-2xl sm:rounded-2xl sm:h-[90vh] sm:border sm:border-gray-800">
        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-40 animate-pulse z-0`}></div>
        <button onClick={onExit} className="absolute top-6 right-6 z-50 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/50 backdrop-blur-sm">✕</button>

        <div className="absolute top-6 left-6 z-10">
          <span className="text-yellow-400 font-black italic text-2xl drop-shadow-lg">ROUND {currentRound}</span>
          <div className="h-1.5 w-24 bg-gray-800/50 rounded-full mt-1 overflow-hidden backdrop-blur-sm">
            <div className="h-full bg-yellow-400 transition-all duration-300" style={{ width: `${((qIndex + 1) / QUESTIONS_PER_ROUND) * 100}%` }}></div>
          </div>
        </div>

        {!loading && (
          <div className={`absolute top-6 right-20 z-10 transition-transform duration-200 ${timeLeft <= 3 ? 'scale-125' : ''}`}>
            <div className={`text-5xl font-black tracking-tighter drop-shadow-2xl ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {timeLeft}
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 top-24 h-32 pointer-events-none overflow-hidden z-30">
          {activeDanmaku.map(item => (
            <div key={item.id} className={`animate-danmaku flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10 shadow-lg`} style={{ top: item.row === 0 ? '10px' : '50px', animationDuration: '5s' }}>
              <span className="text-xs text-gray-200 font-bold">{item.user}:</span>
              <span className={`text-xs font-medium ${item.color}`}>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="absolute top-[35%] w-full px-6 z-20">
          {loading ? (
            <div className="text-center animate-bounce mt-10">
              <div className="text-5xl mb-4 flex justify-center">
                <div className="w-16 h-16 flex items-center justify-center">{config.icon}</div>
              </div>
              <p className="text-lg font-bold text-white/80">题目加载中...</p>
            </div>
          ) : currentQ ? (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl mb-6 min-h-[120px] flex items-center justify-center">
                <p className="text-xl font-bold text-center leading-snug text-white drop-shadow-sm">{currentQ.questionText}</p>
              </div>
              <div className="space-y-3 relative">
                {currentQ.options.map((opt, idx) => {
                  let btnClass = "bg-black/40 border-white/10 hover:bg-white/10";
                  if (answerState === 'CORRECT' && idx === currentQ.correctIndex) btnClass = "bg-green-600/90 border-green-400 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.5)]";
                  else if (answerState === 'WRONG' && idx === selectedOption) btnClass = "bg-red-600/90 border-red-400";
                  else if (answerState === 'WRONG' && idx === currentQ.correctIndex) btnClass = "bg-green-600/50 border-green-400/50";
                  
                  return (
                    <div key={idx} className="relative">
                      <button
                        disabled={answerState !== 'IDLE'}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full p-4 rounded-xl text-left border backdrop-blur-sm transition-all duration-200 active:scale-95 flex justify-between items-center group ${btnClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-yellow-400/80 font-mono text-sm">{OPTION_LABELS[idx]}</span>
                          <span className="font-semibold text-sm text-white/90 group-hover:text-white">{opt}</span>
                        </div>
                        {answerState !== 'IDLE' && idx === currentQ.correctIndex && <span>✅</span>}
                        {answerState === 'WRONG' && idx === selectedOption && <span>❌</span>}
                      </button>
                      
                      {showVote === idx && (
                        <div className="vote-popup right-4 top-2 text-green-400 text-lg drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]">
                          +1
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {hearts.map(h => (<div key={h.id} className="absolute bottom-0 text-2xl heart-anim" style={{ left: `${h.left}%` }}>❤️</div>))}
        </div>
      </div>
    </div>
  );
};
