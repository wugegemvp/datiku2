import React from 'react';
import { CategoryType, CategoryConfig, Character, DifficultyLevel, Question } from './types';

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
  [CategoryType.GENERAL_SPORTS]: { 
    icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Trophy.png" alt="General Sports" className="w-[75%] h-[75%] object-contain drop-shadow-lg" />, 
    bgGradient: 'from-blue-400 to-blue-700' 
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

export const MAIN_MENU_ITEMS = [CategoryType.EXPERT, CategoryType.FOOTBALL, CategoryType.LOL, CategoryType.HISTORY, CategoryType.RAP, CategoryType.GENERAL_SPORTS];
export const GENERAL_SPORTS_SUB_ITEMS = [CategoryType.VOLLEYBALL, CategoryType.BADMINTON, CategoryType.TENNIS, CategoryType.OLYMPICS, CategoryType.TABLE_TENNIS, CategoryType.SWIMMING, CategoryType.TRACK_AND_FIELD, CategoryType.F1, CategoryType.BILLIARDS];

export const TOTAL_ROUNDS = 5;
export const QUESTIONS_PER_ROUND = 5;
export const ROUND_TIME = 8;

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { id: 'bronze', label: '青铜', color: 'from-orange-700 to-amber-900', icon: '🥉', desc: '新手入门' },
  { id: 'gold', label: '黄金', color: 'from-yellow-400 to-yellow-600', icon: '🥇', desc: '进阶挑战' },
  { id: 'platinum', label: '白金', color: 'from-slate-300 to-slate-500', icon: '💠', desc: '高手过招' },
  { id: 'diamond', label: '钻石', color: 'from-cyan-300 to-blue-500', icon: '💎', desc: '大师试炼' },
  { id: 'challenger', label: '王者', color: 'from-red-500 to-purple-600', icon: '👑', desc: '最强王者' },
];

export const CHARACTERS: Character[] = [
  { name: "秦始皇", tags: ["HISTORY", "GENERAL"], quotes: ["朕统六国，但这题朕不会", "修长城都没这题难", "把出题人拉出去斩了"] },
  { name: "武则天", tags: ["HISTORY", "GENERAL"], quotes: ["这天下都是朕的，选A", "来人，给朕把正确答案呈上来", "谁敢选错？拖出去"] },
  { name: "诸葛亮", tags: ["HISTORY", "GENERAL", "SMART"], quotes: ["略懂略懂，此题选C", "我看天象，今日宜选A", "臣本布衣，躬耕南阳，顺便刷题"] },
  { name: "曹操", tags: ["HISTORY", "GENERAL"], quotes: ["宁教我负天下人，不教天下人负我，选B", "何以解忧？唯有选D"] },
  { name: "李白", tags: ["HISTORY", "RAP", "ART"], quotes: ["举杯邀明月，答案是几？", "天生我材必有用，这题蒙对也行", "呼儿将出换美酒，不答了"] },
  { name: "鲁迅", tags: ["HISTORY", "GENERAL", "LIT"], quotes: ["我家门前有两道题，一道是A，另一道也是A", "学医救不了这道题", "这话我没说过"] },
  { name: "科比", tags: ["EXPERT", "SPORTS", "GENERAL"], quotes: ["你见过凌晨四点的题库吗？", "曼巴精神，永不言弃，选D", "MVP 选 B", "这题不仅要赢，还要赢得漂亮"] },
  { name: "张伯伦", tags: ["EXPERT", "SPORTS"], quotes: ["这题像砍下100分一样简单", "单手就能选对"] },
  { name: "樱木花道", tags: ["EXPERT", "SPORTS", "ANIME"], quotes: ["我是天才！选A！", "教练，我想答题...", "这题由我这个天才来终结"] },
  { name: "流川枫", tags: ["EXPERT", "SPORTS", "ANIME"], quotes: ["大白痴... 选C", "无聊（选了B）"] },
  { name: "马拉多纳", tags: ["FOOTBALL", "SPORTS", "GENERAL"], quotes: ["上帝之手帮我点了A", "这题为了阿根廷！", "像过五个人一样绕过陷阱"] },
  { name: "贝利", tags: ["FOOTBALL", "SPORTS"], quotes: ["我看好A（反向毒奶）", "这题是世界杯级别的难度", "足球是圆的，答案也是圆的"] },
  { name: "章鱼保罗", tags: ["FOOTBALL", "SPORTS", "ANIMAL"], quotes: ["(抱住C盒子)", "(吐泡泡) 选A！", "预言帝告诉你选B"] },
  { name: "李小龙", tags: ["SPORTS", "GENERAL"], quotes: ["Be water, my friend. 选D", "阿打！踢飞错误选项！"] },
  { name: "迈克尔·杰克逊", tags: ["RAP", "ART", "GENERAL"], quotes: ["Beat it! 错误选项都走开", "这题像太空步一样丝滑，选A", "Hee-hee! (选了C)"] },
  { name: "2Pac", tags: ["RAP", "ART"], quotes: ["All Eyez On Me，看我选B", "California Love，选D", "Thug Life，不解释"] },
  { name: "贝多芬", tags: ["ART", "GENERAL"], quotes: ["命运在敲门，选D！", "即使听不见，我也能感受到正确旋律", "欢乐颂为选对而奏"] },
  { name: "梵高", tags: ["ART"], quotes: ["这题的色彩像星空一样旋转", "向日葵告诉我选A"] },
  { name: "张国荣", tags: ["ART", "GENERAL"], quotes: ["不疯魔不成活，这题选A", "我就是我，是颜色不一样的烟火"] },
  { name: "邓丽君", tags: ["ART"], quotes: ["甜蜜蜜，你笑得甜蜜蜜", "任时光匆匆流去，我只在乎选B"] },
  { name: "爱因斯坦", tags: ["GENERAL", "SMART", "SCIENCE"], quotes: ["相对论告诉我选B", "上帝不掷骰子，但我敢赌A", "E=mc²，答案=D", "想象力比知识更重要"] },
  { name: "霍金", tags: ["GENERAL", "SMART", "SCIENCE"], quotes: ["宇宙的起源在选项D", "黑洞都吞噬不了我的智慧", "时间简史里没这题"] },
  { name: "乔布斯", tags: ["GENERAL", "SMART", "TECH"], quotes: ["One more thing... 答案是C", "保持饥饿，保持愚蠢，保持选A", "我们重新发明了做题"] },
  { name: "福尔摩斯", tags: ["GENERAL", "SMART", "FICTION"], quotes: ["排除所有不可能，剩下的就是真相C", "华生，你发现了盲点", "基础演绎法"] },
  { name: "孙悟空", tags: ["GENERAL", "FICTION"], quotes: ["吃俺老孙一棒！答案是A", "火眼金睛看出这题选B", "师父，这题有妖气", "俺老孙去问问菩萨"] },
  { name: "猪八戒", tags: ["GENERAL", "FICTION", "FUNNY"], quotes: ["猴哥，这题我选C，错了别打我", "分行李回高老庄算了", "俺老猪肚子饿了"] },
  { name: "钢铁侠", tags: ["GENERAL", "FICTION", "TECH"], quotes: ["我是钢铁侠，我选B", "贾维斯，分析一下", "爱你三千遍，但这题我不会"] },
  { name: "灭霸", tags: ["GENERAL", "FICTION"], quotes: ["一个响指，选项消失一半", "我是天命！选D", "这题需要完美的平衡"] },
  { name: "杰瑞(鼠)", tags: ["GENERAL", "ANIMAL", "FUNNY"], quotes: ["(吃奶酪点头) 吱吱吱！", "(举牌子) 选B！"] },
  { name: "伏地魔", tags: ["GENERAL", "FICTION"], quotes: ["那个人说选A", "阿瓦达索命！消灭错误选项！"] },
  { name: "容嬷嬷", tags: ["GENERAL", "HISTORY", "FUNNY"], quotes: ["是哪个小蹄子在乱选？", "扎针！扎针！选C！", "皇后的旨意是选D"] }
];

export const MOCK_QUESTIONS: Partial<Record<CategoryType | "DEFAULT", Question[]>> = {
  [CategoryType.RAP]: [
    { questionText: "GAI的成名作《火锅底料》中，“老子吃火锅”的下一句是？", options: ["你吃火锅底料", "不管别人看", "开着法拉利", "生活多美好"], correctIndex: 0 },
    { questionText: "“成都集团”CDC的说唱代表人物之一是？", options: ["马思唯", "Jony J", "艾福杰尼", "黄旭"], correctIndex: 0 },
    { questionText: "《中国有嘻哈》第一季的双冠军是GAI和谁？", options: ["PG One", "VaVa", "Tizzy T", "艾热"], correctIndex: 0 },
    { questionText: "被誉为“幼稚园杀手”的说唱歌手以什么著称？", options: ["超快语速", "旋律说唱", "方言说唱", "爵士说唱"], correctIndex: 0 },
    { questionText: "法老是哪个说唱厂牌的主理人？", options: ["活死人", "GOSH", "NOUS", "CSC"], correctIndex: 0 }
  ],
  [CategoryType.OLYMPICS]: [
    { questionText: "夏季奥运会每几年举办一次？", options: ["1年", "2年", "3年", "4年"], correctIndex: 3 },
    { questionText: "2008年夏季奥运会是在哪个城市举办的？", options: ["伦敦", "悉尼", "北京", "雅典"], correctIndex: 2 },
    { questionText: "奥林匹克五环中不包含哪种颜色？", options: ["紫", "蓝", "黄", "黑"], correctIndex: 0 },
    { questionText: "中国第一块奥运金牌获得者是？", options: ["李宁", "许海峰", "刘翔", "郎平"], correctIndex: 1 },
    { questionText: "奥运会的发源地是？", options: ["古罗马", "古希腊", "古埃及", "古巴比伦"], correctIndex: 1 }
  ],
  [CategoryType.EXPERT]: [
    { questionText: "谁是NBA历史总得分王（截至2024年）？", options: ["乔丹", "詹姆斯", "贾巴尔", "科比"], correctIndex: 1 },
    { questionText: "金州勇士队的主场位于？", options: ["洛杉矶", "旧金山", "奥克兰", "萨克拉门托"], correctIndex: 1 },
    { questionText: "“黑曼巴”是谁的绰号？", options: ["奥尼尔", "艾弗森", "科比", "杜兰特"], correctIndex: 2 },
    { questionText: "NBA一次进攻时间限制是？", options: ["24秒", "30秒", "14秒", "20秒"], correctIndex: 0 },
    { questionText: "姚明曾效力于？", options: ["湖人", "火箭", "公牛", "马刺"], correctIndex: 1 }
  ],
  [CategoryType.FOOTBALL]: [
    { questionText: "2022年世界杯冠军是？", options: ["法国", "巴西", "阿根廷", "德国"], correctIndex: 2 },
    { questionText: "足球比赛每队上场人数？", options: ["9", "10", "11", "12"], correctIndex: 2 },
    { questionText: "“足球王国”是指？", options: ["英国", "巴西", "德国", "意大利"], correctIndex: 1 },
    { questionText: "谁被称为“外星人”？", options: ["梅西", "罗纳尔多(大罗)", "贝利", "马拉多纳"], correctIndex: 1 },
    { questionText: "C罗是哪国人？", options: ["葡萄牙", "巴西", "西班牙", "阿根廷"], correctIndex: 0 }
  ],
  [CategoryType.LOL]: [ 
    { questionText: "S11全球总决赛冠军战队是？", options: ["EDG", "RNG", "IG", "FPX"], correctIndex: 0 },
    { questionText: "Faker是哪款游戏的选手？", options: ["CS:GO", "DOTA2", "LOL", "王者荣耀"], correctIndex: 2 },
    { questionText: "召唤师峡谷中拥有几条分路？", options: ["2条", "3条", "4条", "5条"], correctIndex: 1 },
    { questionText: "以下哪个不是英雄联盟的位置？", options: ["上单", "打野", "中单", "自由人"], correctIndex: 3 },
    { questionText: "击杀纳什男爵会获得什么？", options: ["大龙Buff", "小龙Buff", "先锋之眼", "远古龙魂"], correctIndex: 0 }
  ],
  [CategoryType.HISTORY]: [
    { questionText: "中国第一个统一封建王朝？", options: ["汉", "唐", "秦", "明"], correctIndex: 2 },
    { questionText: "三国是指？", options: ["魏蜀吴", "秦楚燕", "韩赵魏", "宋辽金"], correctIndex: 0 },
    { questionText: "“诗仙”是？", options: ["杜甫", "白居易", "李白", "王维"], correctIndex: 2 },
    { questionText: "故宫建于哪个朝代？", options: ["元", "明", "清", "宋"], correctIndex: 1 },
    { questionText: "二战结束于？", options: ["1943", "1944", "1945", "1949"], correctIndex: 2 }
  ],
  "DEFAULT": [
    { questionText: "暂无该分类专属题目，请联系更新。", options: ["好的", "收到", "OK", "知道了"], correctIndex: 0 },
    { questionText: "标准跑道一圈多少米？", options: ["200", "400", "800", "1000"], correctIndex: 1 },
    { questionText: "奥林匹克格言是？", options: ["更快更高更强", "友谊第一", "重在参与", "和平与爱"], correctIndex: 0 },
    { questionText: "F1赛车的F1指？", options: ["一级方程式", "极速", "第一名", "飞行"], correctIndex: 0 },
    { questionText: "篮球比赛每队几人？", options: ["4", "5", "6", "11"], correctIndex: 1 }
  ]
};

export const MOCKERY_QUOTES = [
  "哎呀，这题选错啦！",
  "太遗憾了，差一点点！",
  "这题其实是个坑...",
  "没关系，下一题加油！",
  "看清楚题目再选呀！",
  "我就知道你会选错...",
  "这题很难吗？",
  "送分题啊兄弟！",
  "尴尬了..."
];
