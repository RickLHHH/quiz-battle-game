import { useSocket } from './hooks/useSocket';
import { useGameStore } from './stores/gameStore';
import { Home } from './pages/Home';
import { Lobby } from './pages/Lobby';
import { Game } from './pages/Game';
import { Result } from './pages/Result';

function App() {
  const status = useGameStore((state) => state.status);
  const { createRoom, joinRoom, playerReady, pressBuzzer, submitAnswer, restartGame } = useSocket();

  const handleExit = () => {
    useGameStore.getState().reset();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-magenta/5 rounded-full blur-3xl" />
      </div>

      {/* 主内容 */}
      <div className="relative z-10">
        {status === 'home' && (
          <Home
            onCreateRoom={createRoom}
            onJoinRoom={joinRoom}
          />
        )}

        {status === 'lobby' && (
          <Lobby
            onReady={playerReady}
          />
        )}

        {(status === 'waiting' || status === 'countdown' || status === 'playing') && (
          <Game
            onBuzzer={pressBuzzer}
            onAnswer={submitAnswer}
          />
        )}

        {status === 'ended' && (
          <Result
            onRestart={restartGame}
            onExit={handleExit}
          />
        )}
      </div>

      {/* 连接状态指示器 */}
      <ConnectionStatus />
    </div>
  );
}

function ConnectionStatus() {
  const isConnected = useGameStore((state) => state.isConnected);
  
  if (isConnected) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500/80 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 z-50">
      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
      连接中...
    </div>
  );
}

export default App;
