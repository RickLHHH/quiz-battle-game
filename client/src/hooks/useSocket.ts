import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Room, Player } from '../../../shared/types';
import { useGameStore } from '../stores/gameStore';

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  return window.location.origin;
};

const SOCKET_URL = getSocketUrl();

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const storeRef = useRef(useGameStore);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;
    const store = storeRef.current;

    // 连接事件
    socket.on('connect', () => {
      console.log('Connected to server');
      store.getState().setConnected(true);
      store.getState().setConnectionError(null);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      store.getState().setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      store.getState().setConnectionError('连接服务器失败，请检查网络');
    });

    // 房间事件
    socket.on('room:joined', ({ room, playerId }: { room: Room; playerId: string }) => {
      console.log('Joined room:', room.id, 'Player ID:', playerId);
      store.getState().setRoom(room);
      store.getState().setPlayerId(playerId);
      store.getState().setStatus('lobby');
    });

    socket.on('room:playerJoined', ({ player }: { player: Player }) => {
      console.log('Player joined:', player.name, player.id);
      const currentRoom = store.getState().room;
      if (currentRoom) {
        const exists = currentRoom.players.some(p => p.id === player.id);
        if (!exists) {
          const newRoom: Room = {
            ...currentRoom,
            players: [...currentRoom.players, player],
          };
          store.getState().setRoom(newRoom);
          console.log('Updated room with new player:', newRoom.players.map(p => p.name));
        }
      }
    });

    socket.on('room:playerLeft', ({ playerId }: { playerId: string }) => {
      console.log('Player left:', playerId);
      const currentRoom = store.getState().room;
      if (currentRoom) {
        const newRoom: Room = {
          ...currentRoom,
          players: currentRoom.players.filter((p: Player) => p.id !== playerId),
        };
        store.getState().setRoom(newRoom);
      }
    });

    socket.on('room:playerReady', ({ playerId, categories }: { playerId: string; categories: string[] }) => {
      console.log('Player ready event received:', playerId, categories);
      const currentRoom = store.getState().room;
      console.log('Current room players:', currentRoom?.players.map(p => ({ id: p.id, name: p.name, isReady: p.isReady })));
      
      if (currentRoom) {
        const newPlayers = currentRoom.players.map((p: Player) => {
          if (p.id === playerId) {
            console.log('Setting player ready:', p.name);
            return { ...p, isReady: true, selectedCategories: categories };
          }
          return p;
        });
        
        const newRoom: Room = {
          ...currentRoom,
          players: newPlayers,
        };
        
        store.getState().setRoom(newRoom);
        console.log('Updated room:', newRoom.players.map(p => ({ id: p.id, name: p.name, isReady: p.isReady })));
      }
    });

    // 游戏事件
    socket.on('game:started', ({ room }: { room: Room }) => {
      console.log('Game started');
      store.getState().setRoom(room);
      store.getState().setStatus('waiting');
    });

    socket.on('round:countdown', ({ count }: { count: number }) => {
      store.getState().setStatus('countdown');
      store.getState().setCountdown(count);
    });

    socket.on('round:go', () => {
      store.getState().setCountdown(0);
    });

    socket.on('round:started', ({ question, round, totalRounds }: { question: any; round: number; totalRounds: number }) => {
      store.getState().setCurrentQuestion(question);
      store.getState().setCurrentRound(round);
      store.getState().setTotalRounds(totalRounds);
      store.getState().setBuzzerWinner(null);
      store.getState().setAnswerResult(null);
      store.getState().setStatus('playing');
    });

    socket.on('buzzer:pressed', ({ playerId }: { playerId: string }) => {
      store.getState().setBuzzerWinner(playerId);
    });

    socket.on('answer:result', ({ correct, scores, correctAnswer, isSecondChance }: { correct: boolean; scores: any[]; correctAnswer: number; isSecondChance?: boolean }) => {
      store.getState().setAnswerResult({ correct, scores, correctAnswer, isSecondChance });
      
      scores.forEach(({ playerId, score }: { playerId: string; score: number }) => {
        store.getState().updatePlayerScore(playerId, score);
      });
      
      if (isSecondChance) {
        store.getState().setBuzzerWinner(null);
      }
    });

    socket.on('round:ended', ({ scores, nextRound }: { scores: any[]; nextRound?: number }) => {
      if (nextRound) {
        store.getState().setCurrentRound(nextRound);
      }
      scores.forEach(({ playerId, score }: { playerId: string; score: number }) => {
        store.getState().updatePlayerScore(playerId, score);
      });
    });

    socket.on('game:ended', ({ winner, finalScores, stats }: { winner: any; finalScores: any[]; stats: any }) => {
      store.getState().setGameResult({ winner, finalScores, stats });
      store.getState().setStatus('ended');
    });

    socket.on('error', ({ message }: { message: string }) => {
      console.error('Socket error:', message);
      store.getState().setConnectionError(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = useCallback((playerName: string) => {
    socketRef.current?.emit('room:create', { playerName });
  }, []);

  const joinRoom = useCallback((roomId: string, playerName: string) => {
    socketRef.current?.emit('room:join', { roomId, playerName });
  }, []);

  const playerReady = useCallback((categories: string[]) => {
    socketRef.current?.emit('player:ready', { categories });
  }, []);

  const pressBuzzer = useCallback(() => {
    socketRef.current?.emit('buzzer:press');
  }, []);

  const submitAnswer = useCallback((answer: number) => {
    socketRef.current?.emit('answer:submit', { answer });
  }, []);

  const restartGame = useCallback(() => {
    socketRef.current?.emit('game:restart');
  }, []);

  return {
    socket: socketRef.current,
    createRoom,
    joinRoom,
    playerReady,
    pressBuzzer,
    submitAnswer,
    restartGame,
  };
}
