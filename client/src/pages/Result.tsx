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
    <div className="min-h-screen flex flex-col p-6 safe-area-top safe-area-bottom">
      {/* 结果标题 */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">
          {isWinner ? '🏆' : isDraw ? '🤝' : '😢'}
        </div>
        <h2 className={`text-3xl font-bold ${
          isWinner ? 'text-neon-cyan neon-text-cyan' : 
          isDraw ? 'text-white' : 'text-white/60'
        }`}>
          {isWinner ? '你赢了！' : isDraw ? '平局！' : '你输了'}
        </h2>
        <p className="text-white/60 mt-2">
          {isWinner ? '太棒了！知识达人！' : isDraw ? '势均力敌！' : '再接再厉！'}
        </p>
      </div>

      {/* 分数对比 */}
      <div className="glass-card p-6 mb-6">
        <div className="flex justify-between items-center">
          {/* 我的分数 */}
          <div className="text-center flex-1">
            <div className="text-4xl mb-2">{me?.avatar}</div>
            <div className="font-semibold mb-1">{me?.name}</div>
            <div className={`text-4xl font-bold ${
              myScore > opponentScore ? 'text-neon-cyan' : 'text-white/60'
            }`}>
              {myScore}
            </div>
          </div>

          {/* VS */}
          <div className="text-2xl font-bold text-white/30 px-4">VS</div>

          {/* 对手分数 */}
          <div className="text-center flex-1">
            <div className="text-4xl mb-2">{opponent?.avatar}</div>
            <div className="font-semibold mb-1">{opponent?.name}</div>
            <div className={`text-4xl font-bold ${
              opponentScore > myScore ? 'text-neon-magenta' : 'text-white/60'
            }`}>
              {opponentScore}
            </div>
          </div>
        </div>

        {/* 分数差 */}
        <div className="mt-4 text-center">
          <span className="text-white/60">
            {myScore > opponentScore 
              ? `领先 ${myScore - opponentScore} 分` 
              : opponentScore > myScore 
              ? `落后 ${opponentScore - myScore} 分`
              : '分数相同'}
          </span>
        </div>
      </div>

      {/* 数据统计 */}
      <div className="glass-card p-4 mb-6">
        <h3 className="text-sm font-semibold text-white/60 mb-4">对战数据</h3>
        <div className="grid grid-cols-2 gap-4">
          {gameResult.stats.playerStats.map((stat) => {
            const isMe = stat.playerId === playerId;
            return (
              <div key={stat.playerId} className="text-center">
                <div className={`text-sm mb-1 ${isMe ? 'text-neon-cyan' : 'text-neon-magenta'}`}>
                  {isMe ? '你' : '对手'}
                </div>
                <div className="text-2xl font-bold">{stat.correctAnswers}</div>
                <div className="text-xs text-white/40">答对题数</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-auto space-y-3">
        <button
          onClick={onRestart}
          className="btn-primary w-full text-lg py-4"
        >
          再来一局
        </button>
        <button
          onClick={onExit}
          className="btn-secondary w-full text-lg py-4"
        >
          退出房间
        </button>
      </div>
    </div>
  );
}
