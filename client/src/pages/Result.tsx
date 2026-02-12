import { useGameStore } from '../stores/gameStore';

interface ResultProps {
  onRestart: () => void;
  onExit: () => void;
}

export function Result({ onRestart, onExit }: ResultProps) {
  const room = useGameStore((state) => state.room);
  const playerId = useGameStore((state) => state.playerId);
  const gameResult = useGameStore((state) => state.gameResult);

  if (!room || !playerId || !gameResult) return null;

  const me = room.players.find(p => p.id === playerId);
  const opponent = room.players.find(p => p.id !== playerId);
  const isWinner = gameResult.winner?.id === playerId;
  const isDraw = !gameResult.winner;

  const myScore = gameResult.finalScores.find(s => s.playerId === playerId)?.score || 0;
  const opponentScore = gameResult.finalScores.find(s => s.playerId !== playerId)?.score || 0;

  return (
    <div className="min-h-screen flex flex-col p-5 safe-area-top safe-area-bottom">
      {/* Result Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-4 float">
          {isWinner ? '🏆' : isDraw ? '🤝' : '😢'}
        </div>
        <h2 className={`font-pixel text-xl sm:text-2xl mb-2 ${
          isWinner ? 'neon-cyan' : isDraw ? 'neon-yellow' : 'text-white/50'
        }`}>
          {isWinner ? '胜利!' : isDraw ? '平局!' : '失败'}
        </h2>
        <p className="text-white/40 text-sm">
          {isWinner ? '太棒了！知识达人！' : isDraw ? '势均力敌！' : '再接再厉！'}
        </p>
      </div>

      {/* Score Comparison */}
      <div className="glass-card p-5 mb-5">
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="text-3xl mb-2">{me?.avatar}</div>
            <div className="font-bold text-sm mb-1">{me?.name}</div>
            <div className={`text-4xl font-pixel ${
              myScore > opponentScore ? 'neon-cyan' : 'text-white/40'
            }`}>
              {myScore}
            </div>
          </div>

          <div className="text-xl font-pixel text-white/20 px-4">VS</div>

          <div className="text-center flex-1">
            <div className="text-3xl mb-2">{opponent?.avatar}</div>
            <div className="font-bold text-sm mb-1">{opponent?.name}</div>
            <div className={`text-4xl font-pixel ${
              opponentScore > myScore ? 'neon-pink' : 'text-white/40'
            }`}>
              {opponentScore}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-white/50">
          {myScore > opponentScore 
            ? `领先 ${myScore - opponentScore} 分` 
            : opponentScore > myScore 
            ? `落后 ${opponentScore - myScore} 分`
            : '分数相同'}
        </div>
      </div>

      {/* Stats */}
      <div className="glass-card p-4 mb-5">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4 text-center">对战数据</h3>
        <div className="grid grid-cols-2 gap-4">
          {gameResult.stats.playerStats.map((stat) => {
            const isMe = stat.playerId === playerId;
            return (
              <div key={stat.playerId} className="text-center">
                <div className={`text-xs mb-1 uppercase tracking-wider ${isMe ? 'text-neon-cyan' : 'text-neon-pink'}`}>
                  {isMe ? '你' : '对手'}
                </div>
                <div className="text-3xl font-pixel">{stat.correctAnswers}</div>
                <div className="text-xs text-white/40">答对题数</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-3">
        <button
          onClick={onRestart}
          className="btn-arcade w-full text-sm py-5"
        >
          再来一局
        </button>
        <button
          onClick={onExit}
          className="btn-secondary w-full text-sm py-4"
        >
          退出房间
        </button>
      </div>
    </div>
  );
}
