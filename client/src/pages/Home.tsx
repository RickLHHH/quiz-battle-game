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
    onJoinRoom(roomId.trim(), playerName.trim());
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 safe-area-top safe-area-bottom relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 border border-neon-cyan/20 rotate-45" />
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-neon-pink/20 rotate-12" />
          <div className="absolute top-1/3 right-20 w-16 h-16 border border-neon-yellow/20 -rotate-12" />
        </div>

        {/* Logo */}
        <div className="text-center mb-12 relative">
          <div className="text-7xl mb-6 float">⚡</div>
          <h1 className="font-pixel text-2xl sm:text-3xl mb-3 neon-cyan leading-relaxed">
            答题<br/>大乱斗
          </h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">
            Knowledge Battle Arena
          </p>
        </div>

        {/* Mode Selection */}
        <div className="w-full max-w-xs space-y-4 relative z-10">
          <button
            onClick={() => setMode('create')}
            className="btn-arcade w-full text-sm py-5"
          >
            创建房间
          </button>
          <button
            onClick={() => setMode('join')}
            className="btn-arcade btn-arcade-pink w-full text-sm py-5"
          >
            加入房间
          </button>
        </div>

        {/* Game Rules */}
        <div className="mt-12 glass-card p-5 max-w-xs relative">
          <div className="absolute -top-2 left-4 px-2 bg-dark-bg">
            <span className="text-neon-yellow text-xs font-bold tracking-wider">游戏规则</span>
          </div>
          <ul className="text-sm text-white/60 space-y-2 mt-2">
            <li className="flex items-center gap-2">
              <span className="text-neon-cyan">►</span>
              <span>两人对战，共10题</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-neon-cyan">►</span>
              <span>各自选择题库</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-neon-cyan">►</span>
              <span>抢答成功后作答</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-neon-cyan">►</span>
              <span>答对+10分</span>
            </li>
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
        className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors text-sm flex items-center gap-1"
      >
        ← 返回
      </button>

      <div className="w-full max-w-xs">
        <h2 className="font-pixel text-xl text-center mb-8 neon-pink">
          {mode === 'create' ? '创建房间' : '加入房间'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">玩家昵称</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="输入昵称"
              maxLength={12}
              className="input-field text-center"
            />
          </div>

          {mode === 'join' && (
            <div>
              <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">房间号 (6位数字)</label>
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
                className="input-field text-center text-xl tracking-widest font-pixel"
              />
            </div>
          )}

          {error && (
            <div className="text-neon-pink text-sm text-center font-bold">{error}</div>
          )}

          <button
            onClick={mode === 'create' ? handleCreate : handleJoin}
            className={`btn-arcade w-full text-sm py-5 mt-6 ${mode === 'join' ? 'btn-arcade-pink' : ''}`}
          >
            {mode === 'create' ? '创建房间' : '加入房间'}
          </button>
        </div>
      </div>
    </div>
  );
}
