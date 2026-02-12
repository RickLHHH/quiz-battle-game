import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

interface HomeProps {
  onCreateRoom: (playerName: string) => void;
  onJoinRoom: (roomId: string, playerName: string) => void;
}

export function Home({ onCreateRoom, onJoinRoom }: HomeProps) {
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const connectionError = useGameStore((state) => state.connectionError);

  const handleCreate = () => {
    if (!playerName.trim()) {
      setError('请输入玩家昵称');
      return;
    }
    onCreateRoom(playerName.trim());
  };

  const handleJoin = () => {
    if (!playerName.trim()) {
      setError('请输入玩家昵称');
      return;
    }
    if (!roomId.trim()) {
      setError('请输入房间号');
      return;
    }
    onJoinRoom(roomId.trim().toUpperCase(), playerName.trim());
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 safe-area-top safe-area-bottom">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-4xl font-bold mb-2 neon-text-cyan">答题大乱斗</h1>
          <p className="text-white/60 text-sm">Knowledge Battle Arena</p>
        </div>

        {/* 模式选择 */}
        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={() => setMode('create')}
            className="btn-primary w-full text-lg py-4"
          >
            创建房间
          </button>
          <button
            onClick={() => setMode('join')}
            className="btn-secondary w-full text-lg py-4"
          >
            加入房间
          </button>
        </div>

        {/* 游戏规则 */}
        <div className="mt-12 glass-card p-4 max-w-xs">
          <h3 className="text-neon-cyan font-semibold mb-2">游戏规则</h3>
          <ul className="text-sm text-white/70 space-y-1">
            <li>• 两人对战，共10题</li>
            <li>• 各自选择题库，系统随机出题</li>
            <li>• 抢答成功后10秒内作答</li>
            <li>• 答对+10分，都答错不计分</li>
            <li>• 提前抢答视为犯规</li>
          </ul>
        </div>

        {connectionError && (
          <div className="fixed bottom-4 left-4 right-4 bg-red-500/80 text-white p-3 rounded-lg text-center text-sm">
            {connectionError}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 safe-area-top safe-area-bottom">
      <button
        onClick={() => setMode('select')}
        className="absolute top-6 left-6 text-white/60 hover:text-white"
      >
        ← 返回
      </button>

      <div className="w-full max-w-xs">
        <h2 className="text-2xl font-bold text-center mb-8">
          {mode === 'create' ? '创建房间' : '加入房间'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">你的昵称</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="输入昵称"
              maxLength={12}
              className="input-field text-center text-lg"
            />
          </div>

          {mode === 'join' && (
            <div>
              <label className="block text-sm text-white/60 mb-2">房间号（6位数字）</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={roomId}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setRoomId(value);
                }}
                placeholder="例如: 123456"
                maxLength={6}
                className="input-field text-center text-lg tracking-widest"
              />
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            onClick={mode === 'create' ? handleCreate : handleJoin}
            className="btn-primary w-full text-lg py-4 mt-4"
          >
            {mode === 'create' ? '创建房间' : '加入房间'}
          </button>
        </div>
      </div>
    </div>
  );
}
