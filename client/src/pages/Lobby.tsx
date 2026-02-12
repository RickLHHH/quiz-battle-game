import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

interface LobbyProps {
  onReady: (categories: string[]) => void;
}

const categories = [
  { id: 'ent', name: '影视娱乐', icon: '🎬', color: '#ff006e', desc: '电影、动画、明星' },
  { id: 'life', name: '生活常识', icon: '🏠', color: '#fee440', desc: '健康、日常、科学' },
];

export function Lobby({ onReady }: LobbyProps) {
  const room = useGameStore((state) => state.room);
  const playerId = useGameStore((state) => state.playerId);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  if (!room || !playerId) return null;

  const opponent = room.players.find(p => p.id !== playerId);
  const me = room.players.find(p => p.id === playerId);
  const isReady = me?.isReady || false;

  const toggleCategory = (categoryId: string) => {
    if (isReady) return;
    
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, categoryId];
    });
  };

  const handleReady = () => {
    if (selectedCategories.length === 0) {
      return;
    }
    onReady(selectedCategories);
  };

  const canStart = selectedCategories.length > 0;

  return (
    <div className="min-h-screen flex flex-col p-5 safe-area-top safe-area-bottom">
      {/* Room Info */}
      <div className="text-center mb-6">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">房间号</p>
        <div className="inline-block">
          <div className="font-pixel text-3xl sm:text-4xl neon-cyan tracking-widest px-4 py-2 border-2 border-neon-cyan/30 rounded-lg bg-black/30">
            {room.id}
          </div>
        </div>
        <p className="text-white/30 text-xs mt-2">分享给好友加入对战</p>
      </div>

      {/* Players */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {room.players.map((player) => (
          <div
            key={player.id}
            className={`player-card ${player.id === playerId ? 'active' : 'opponent'}`}
          >
            <div className="text-4xl mb-2">{player.avatar}</div>
            <div className="font-bold text-sm truncate">{player.name}</div>
            <div className="text-xs text-white/40 mt-1">
              {player.id === playerId ? '你' : '对手'}
            </div>
            {player.isReady ? (
              <div className="mt-2 text-xs font-bold uppercase tracking-wider" style={{ 
                color: player.id === playerId ? '#00f5d4' : '#ff006e',
                textShadow: player.id === playerId ? '0 0 10px #00f5d4' : '0 0 10px #ff006e'
              }}>
                ✓ 已准备
              </div>
            ) : (
              <div className="mt-2 text-xs text-white/30">
                等待中...
              </div>
            )}
          </div>
        ))}
        
        {room.players.length === 1 && (
          <div className="player-card opacity-50 border-dashed">
            <div className="text-4xl mb-2 animate-pulse">?</div>
            <div className="font-bold text-sm">等待加入</div>
            <div className="text-xs text-white/30 mt-1">...</div>
          </div>
        )}
      </div>

      {/* Category Selection */}
      {opponent ? (
        <div className="flex-1">
          <div className="text-center mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
              {isReady ? '等待对手准备...' : '选择题库 (1-2个)'}
            </h3>
          </div>
          
          <div className="space-y-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                disabled={isReady}
                className={`category-card w-full flex items-center gap-4 ${
                  selectedCategories.includes(cat.id) ? 'selected' : ''
                }`}
                style={{
                  borderColor: selectedCategories.includes(cat.id) ? cat.color : undefined,
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  {cat.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-sm" style={{ color: cat.color }}>
                    {cat.name}
                  </div>
                  <div className="text-xs text-white/40">{cat.desc}</div>
                </div>
                {selectedCategories.includes(cat.id) && (
                  <div className="text-xl" style={{ color: cat.color }}>
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>

          {!isReady && (
            <button
              onClick={handleReady}
              disabled={!canStart}
              className="btn-arcade w-full text-sm py-5 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              准备开始
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">⏳</div>
            <p className="text-white/50 text-sm">等待对手加入...</p>
          </div>
        </div>
      )}
    </div>
  );
}
