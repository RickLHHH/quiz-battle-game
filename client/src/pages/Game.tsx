import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';

interface GameProps {
  onBuzzer: () => void;
  onAnswer: (answer: number) => void;
}

export function Game({ onBuzzer, onAnswer }: GameProps) {
  const room = useGameStore((state) => state.room);
  const playerId = useGameStore((state) => state.playerId);
  const currentQuestion = useGameStore((state) => state.currentQuestion);
  const currentRound = useGameStore((state) => state.currentRound);
  const totalRounds = useGameStore((state) => state.totalRounds);
  const countdown = useGameStore((state) => state.countdown);
  const buzzerWinner = useGameStore((state) => state.buzzerWinner);
  const answerResult = useGameStore((state) => state.answerResult);
  const status = useGameStore((state) => state.status);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [canBuzz, setCanBuzz] = useState(false);
  const [isSecondChance, setIsSecondChance] = useState(false);

  // 重置状态当新题目开始
  useEffect(() => {
    if (status === 'countdown') {
      setSelectedAnswer(null);
      setIsSecondChance(false);
    }
  }, [status, currentRound]);

  // 监听答题结果
  useEffect(() => {
    if (answerResult?.isSecondChance) {
      setIsSecondChance(true);
    }
  }, [answerResult]);

  // 倒计时结束后可以抢答
  useEffect(() => {
    if (status === 'playing' && countdown === 0 && !buzzerWinner) {
      setCanBuzz(true);
    } else {
      setCanBuzz(false);
    }
  }, [status, countdown, buzzerWinner]);

  // 抢答
  const handleBuzzer = useCallback(() => {
    if (canBuzz && !buzzerWinner) {
      // 震动反馈
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      onBuzzer();
    }
  }, [canBuzz, buzzerWinner, onBuzzer]);

  // 选择答案
  const handleSelectAnswer = (index: number) => {
    if (buzzerWinner !== playerId || selectedAnswer !== null || answerResult) {
      return;
    }
    
    // 震动反馈
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    
    setSelectedAnswer(index);
    onAnswer(index);
  };

  // 获取玩家信息
  const me = room?.players.find(p => p.id === playerId);
  const opponent = room?.players.find(p => p.id !== playerId);
  const isMyTurn = buzzerWinner === playerId;

  // 倒计时阶段
  if (status === 'countdown' || (status === 'playing' && countdown > 0)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        {/* 比分 */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <div className="text-center">
            <div className="text-sm text-white/60">{me?.name}</div>
            <div className="text-2xl font-bold text-neon-cyan">{me?.score || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-white/40">{currentRound}/{totalRounds}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-white/60">{opponent?.name}</div>
            <div className="text-2xl font-bold text-neon-magenta">{opponent?.score || 0}</div>
          </div>
        </div>

        {/* 倒计时 */}
        <div className="text-center">
          <div className="text-white/60 mb-4">准备抢答...</div>
          <div 
            className="text-8xl font-bold animate-countdown"
            style={{ 
              color: countdown === 1 ? '#00f5ff' : '#ff00ff',
              textShadow: countdown === 1 
                ? '0 0 30px #00f5ff' 
                : '0 0 30px #ff00ff'
            }}
          >
            {countdown === 0 ? 'GO!' : countdown}
          </div>
        </div>
      </div>
    );
  }

  // 答题阶段
  return (
    <div className="min-h-screen flex flex-col p-4 safe-area-top safe-area-bottom">
      {/* 顶部信息栏 */}
      <div className="flex justify-between items-center mb-4">
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">{me?.avatar}</span>
          <div>
            <div className="text-xs text-white/60">{me?.name}</div>
            <div className="text-xl font-bold text-neon-cyan">{me?.score || 0}</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold">{currentRound}/{totalRounds}</div>
          <div className="text-xs text-white/40">题</div>
        </div>

        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-white/60">{opponent?.name}</div>
            <div className="text-xl font-bold text-neon-magenta">{opponent?.score || 0}</div>
          </div>
          <span className="text-2xl">{opponent?.avatar}</span>
        </div>
      </div>

      {/* 题目区域 */}
      {currentQuestion && (
        <div className="flex-1 flex flex-col">
          {/* 题目 */}
          <div className="glass-card p-5 mb-4">
            <div 
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{ 
                backgroundColor: currentQuestion.category === 'ent' ? '#e040fb30' : '#ffd60030',
                color: currentQuestion.category === 'ent' ? '#e040fb' : '#ffd600'
              }}
            >
              {currentQuestion.category === 'ent' ? '🎬 影视娱乐' : '🏠 生活常识'}
            </div>
            <h3 className="text-lg font-semibold leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* 抢答按钮 / 选项区域 */}
          {!buzzerWinner ? (
            // 抢答阶段
            <div className="flex-1 flex flex-col justify-center">
              <button
                onClick={handleBuzzer}
                disabled={!canBuzz}
                className="buzzer-btn"
              >
                {canBuzz ? '🔥 抢答! 🔥' : '等待中...'}
              </button>
              <p className="text-center text-white/40 text-sm mt-4">
                倒计时结束后点击抢答
              </p>
            </div>
          ) : (
            // 答题阶段
            <div className="flex-1">
              {/* 抢答结果 / 答题状态 */}
              <div className={`text-center mb-4 p-3 rounded-xl ${
                isMyTurn 
                  ? 'bg-neon-cyan/20 text-neon-cyan' 
                  : 'bg-neon-magenta/20 text-neon-magenta'
              }`}>
                {isMyTurn ? (
                  isSecondChance ? '⚡ 对手答错了，轮到你了！' : '✓ 抢答成功！请作答'
                ) : (
                  `⚡ ${opponent?.name} 正在答题...`
                )}
              </div>

              {/* 选项 */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass = 'category-card w-full py-4 text-left px-4';
                  
                  if (answerResult) {
                    // 显示结果
                    if (index === answerResult.correctAnswer) {
                      buttonClass += ' bg-green-500/30 border-green-500';
                    } else if (index === selectedAnswer && !answerResult.correct) {
                      buttonClass += ' bg-red-500/30 border-red-500';
                    }
                  } else if (isMyTurn) {
                    buttonClass += ' hover:bg-white/10';
                  } else {
                    buttonClass += ' opacity-50';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={!isMyTurn || selectedAnswer !== null || !!answerResult}
                      className={buttonClass}
                    >
                      <span className="inline-block w-8 h-8 rounded-full bg-white/10 text-center leading-8 mr-3 text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                      {answerResult && index === answerResult.correctAnswer && (
                        <span className="ml-auto text-green-400">✓ 正确答案</span>
                      )}
                      {answerResult && index === selectedAnswer && !answerResult.correct && (
                        <span className="ml-auto text-red-400">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 结果显示 */}
              {answerResult && !answerResult.isSecondChance && (
                <div className={`mt-4 p-4 rounded-xl text-center ${
                  answerResult.correct 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {answerResult.correct ? '🎉 回答正确！+10分' : '❌ 回答错误！'}
                  {!answerResult.correct && (
                    <div className="text-sm text-white/60 mt-1">
                      正确答案是：{currentQuestion.options[answerResult.correctAnswer]}
                    </div>
                  )}
                </div>
              )}

              {/* 第一轮答错的提示 */}
              {answerResult?.isSecondChance && (
                <div className="mt-4 p-4 rounded-xl text-center bg-yellow-500/20 text-yellow-400">
                  ❌ 回答错误！给对手机会...
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
