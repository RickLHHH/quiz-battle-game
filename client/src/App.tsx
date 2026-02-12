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
    <div className="min-h-screen bg-dark-bg relative">
      {/* CRT Overlay Effect */}
      <div className="crt-overlay" />
      
      {/* Noise Texture */}
      <div className="noise-bg" />

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-neon-pink/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
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

      {/* Connection Status */}
      <ConnectionStatus />
    </div>
  );
}

function ConnectionStatus() {
  const isConnected = useGameStore((state) => state.isConnected);
  
  if (isConnected) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500/80 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 z-50">
      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
      连接中...
    </div>
  );
}

export default App;
