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

  useEffect(() => {
    if (status === 'countdown') {
      setSelectedAnswer(null);
    }
  }, [status, currentRound]);

  useEffect(() => {
    if (status === 'playing' && countdown === 0 && !buzzerWinner) {
      setCanBuzz(true);
    } else {
      setCanBuzz(false);
    }
  }, [status, countdown, buzzerWinner]);

  const handleBuzzer = useCallback(() => {
    if (canBuzz && !buzzerWinner) {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      onBuzzer();
    }
  }, [canBuzz, buzzerWinner, onBuzzer]);

  const handleSelectAnswer = (index: number) => {
    if (buzzerWinner !== playerId || selectedAnswer !== null || answerResult) {
      return;
    }
    
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    setSelectedAnswer(index);
    onAnswer(index);
  };

  const me = room?.players.find(p => p.id === playerId);
  const opponent = room?.players.find(p => p.id !== playerId);
  const isMyTurn = buzzerWinner === playerId;

  // Countdown Phase
  if (status === 'countdown' || (status === 'playing' && countdown > 0)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        {/* Score Board */}
        <div className="absolute top-6 left-4 right-4 flex justify-between items-center">
          <div className="text-center player-card active px-4 py-2">
            <div className="text-xs text-white/50 mb-1">{me?.name}</div>
            <div className="text-2xl font-pixel neon-cyan">{me?.score || 0}</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-white/30 uppercase tracking-wider">Round</div>
            <div className="text-xl font-bold">{currentRound}/{totalRounds}</div>
          </div>
          
          <div className="text-center player-card opponent px-4 py-2">
            <div className="text-xs text-white/50 mb-1">{opponent?.name}</div>
            <div className="text-2xl font-pixel neon-pink">{opponent?.score || 0}</div>
          </div>
        </div>

        {/* Countdown */}
        <div className="text-center">
          <div className="text-white/40 text-sm uppercase tracking-widest mb-6">准备抢答</div>
          <div 
            className="font-pixel text-8xl countdown-number"
            style={{ 
              color: countdown === 1 ? '#00f5d4' : '#ff006e',
              textShadow: countdown === 1 
                ? '0 0 30px #00f5d4, 0 0 60px #00f5d4' 
                : '0 0 30px #ff006e, 0 0 60px #ff006e'
            }}
          >
            {countdown === 0 ? 'GO!' : countdown}
          </div>
        </div>
      </div>
    );
  }

  // Game Phase
  return (
    <div className="min-h-screen flex flex-col p-4 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="player-card active px-3 py-2 flex items-center gap-2">
          <span className="text-2xl">{me?.avatar}</span>
          <div>
            <div className="text-xs text-white/50">{me?.name}</div>
            <div className="text-xl font-pixel neon-cyan">{me?.score || 0}</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-pixel">{currentRound}/{totalRounds}</div>
          <div className="text-xs text-white/40 uppercase">题</div>
        </div>

        <div className="player-card opponent px-3 py-2 flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-white/50">{opponent?.name}</div>
            <div className="text-xl font-pixel neon-pink">{opponent?.score || 0}</div>
          </div>
          <span className="text-2xl">{opponent?.avatar}</span>
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <div className="flex-1 flex flex-col">
          <div className="glass-card p-5 mb-4 border-l-4" style={{
            borderLeftColor: currentQuestion.category === 'ent' ? '#ff006e' : '#fee440'
          }}>
            <div 
              className="inline-block px-3 py-1 rounded text-xs font-bold mb-3 uppercase tracking-wider"
              style={{ 
                backgroundColor: currentQuestion.category === 'ent' ? '#ff006e30' : '#fee44030',
                color: currentQuestion.category === 'ent' ? '#ff006e' : '#fee440'
              }}
            >
              {currentQuestion.category === 'ent' ? '🎬 影视娱乐' : '🏠 生活常识'}
            </div>
            <h3 className="text-lg font-bold leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Buzzer or Options */}
          {!buzzerWinner ? (
            <div className="flex-1 flex flex-col justify-center">
              <button
                onClick={handleBuzzer}
                disabled={!canBuzz}
                className="buzzer-btn"
              >
                {canBuzz ? '🔥 抢答! 🔥' : '等待...'}
              </button>
              <p className="text-center text-white/30 text-xs mt-4 uppercase tracking-wider">
                倒计时结束后点击抢答
              </p>
            </div>
          ) : (
            <div className="flex-1">
              {/* Turn Indicator */}
              <div className={`text-center mb-4 p-3 rounded-lg font-bold uppercase text-sm tracking-wider ${
                isMyTurn 
                  ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30' 
                  : 'bg-neon-pink/10 text-neon-pink border border-neon-pink/30'
              }`}>
                {isMyTurn ? (
                  answerResult?.isSecondChance ? '⚡ 对手答错，轮到你了！' : '✓ 抢答成功！请作答'
                ) : (
                  `⚡ ${opponent?.name} 正在答题...`
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass = 'category-card w-full py-3 text-left px-4';
                  
                  if (answerResult) {
                    if (index === answerResult.correctAnswer) {
                      buttonClass += ' bg-green-500/20 border-green-500';
                    } else if (index === selectedAnswer && !answerResult.correct) {
                      buttonClass += ' bg-red-500/20 border-red-500';
                    }
                  } else if (isMyTurn) {
                    buttonClass += ' hover:bg-white/5';
                  } else {
                    buttonClass += ' opacity-40';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={!isMyTurn || selectedAnswer !== null || !!answerResult}
                      className={buttonClass}
                    >
                      <span className="inline-block w-8 h-8 rounded bg-white/10 text-center leading-8 mr-3 text-sm font-bold font-pixel">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-sm">{option}</span>
                      {answerResult && index === answerResult.correctAnswer && (
                        <span className="ml-auto text-green-400 text-sm">✓</span>
                      )}
                      {answerResult && index === selectedAnswer && !answerResult.correct && (
                        <span className="ml-auto text-red-400 text-sm">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Result */}
              {answerResult && !answerResult.isSecondChance && (
                <div className={`mt-4 p-4 rounded-lg text-center font-bold ${
                  answerResult.correct 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}>
                  {answerResult.correct ? '🎉 +10分!' : '❌ 错误!'}
                  {!answerResult.correct && (
                    <div className="text-xs text-white/50 mt-1 font-normal">
                      正确答案: {currentQuestion.options[answerResult.correctAnswer]}
                    </div>
                  )}
                </div>
              )}

              {answerResult?.isSecondChance && (
                <div className="mt-4 p-4 rounded-lg text-center bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-sm">
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
