import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

interface LobbyProps {
  onReady: (categories: string[]) => void;
}

const categories = [
  { id: 'ent', name: '影视娱乐', icon: '🎬', color: '#e040fb', desc: '电影、动画、明星' },
  { id: 'life', name: '生活常识', icon: '🏠', color: '#ffd600', desc: '健康、日常、科学' },
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
    <div className="min-h-screen flex flex-col p-6 safe-area-top safe-area-bottom">
      {/* 房间信息 */}
      <div className="text-center mb-8">
        <p className="text-white/60 text-sm mb-2">房间号</p>
        <div className="text-4xl font-bold tracking-widest neon-text-cyan">
          {room.id}
        </div>
        <p className="text-white/40 text-xs mt-2">分享给好友加入对战</p>
      </div>

      {/* 玩家列表 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {room.players.map((player) => (
          <div
            key={player.id}
            className={`glass-card p-4 text-center ${
              player.id === playerId ? 'neon-border-cyan' : ''
            }`}
          >
            <div className="text-4xl mb-2">{player.avatar}</div>
            <div className="font-semibold truncate">{player.name}</div>
            <div className="text-xs text-white/60">
              {player.id === playerId ? '(你)' : '(对手)'}
            </div>
            {player.isReady && (
              <div className="mt-2 text-neon-cyan text-sm font-semibold">
                ✓ 已准备
              </div>
            )}
          </div>
        ))}
        
        {room.players.length === 1 && (
          <div className="glass-card p-4 text-center opacity-50">
            <div className="text-4xl mb-2">?</div>
            <div className="font-semibold">等待加入...</div>
          </div>
        )}
      </div>

      {/* 题库选择 */}
      {opponent ? (
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4 text-center">
            {isReady ? '等待对手准备...' : '选择你擅长的题库 (1-2个)'}
          </h3>
          
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
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  {cat.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold" style={{ color: cat.color }}>
                    {cat.name}
                  </div>
                  <div className="text-xs text-white/50">{cat.desc}</div>
                </div>
                {selectedCategories.includes(cat.id) && (
                  <div className="text-2xl" style={{ color: cat.color }}>
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
              className="btn-primary w-full text-lg py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              准备开始
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-white/60">等待对手加入...</p>
          </div>
        </div>
      )}
    </div>
  );
}
