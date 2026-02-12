import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Room, Player } from '../../../shared/types';
import { useGameStore } from '../stores/gameStore';

// 自动检测 Socket 地址
const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  return window.location.origin;
};

const SOCKET_URL = getSocketUrl();

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const store = useGameStore();
  // 使用 ref 存储最新的 room 状态
  const roomRef = useRef<Room | null>(null);
  
  // 同步 roomRef 与 store.room
  roomRef.current = store.room;

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // 连接事件
    socket.on('connect', () => {
      console.log('Connected to server');
      store.setConnected(true);
      store.setConnectionError(null);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      store.setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      store.setConnectionError('连接服务器失败，请检查网络');
    });

    // 房间事件
    socket.on('room:joined', ({ room, playerId }: { room: Room; playerId: string }) => {
      console.log('Joined room:', room.id, 'Player ID:', playerId);
      store.setRoom(room);
      store.setPlayerId(playerId);
      store.setStatus('lobby');
    });

    socket.on('room:playerJoined', ({ player }: { player: Player }) => {
      console.log('Player joined:', player.name);
      const currentRoom = roomRef.current;
      if (currentRoom) {
        // 检查玩家是否已经在房间中（避免重复添加）
        const exists = currentRoom.players.some(p => p.id === player.id);
        if (!exists) {
          const newRoom: Room = {
            ...currentRoom,
            players: [...currentRoom.players, player],
          };
          store.setRoom(newRoom);
        }
      }
    });

    socket.on('room:playerLeft', ({ playerId }: { playerId: string }) => {
      console.log('Player left:', playerId);
      const currentRoom = roomRef.current;
      if (currentRoom) {
        const newRoom: Room = {
          ...currentRoom,
          players: currentRoom.players.filter((p: Player) => p.id !== playerId),
        };
        store.setRoom(newRoom);
      }
    });

    socket.on('room:playerReady', ({ playerId, categories }: { playerId: string; categories: string[] }) => {
      console.log('Player ready:', playerId, categories);
      const currentRoom = roomRef.current;
      if (currentRoom) {
        const newRoom: Room = {
          ...currentRoom,
          players: currentRoom.players.map((p: Player) => 
            p.id === playerId 
              ? { ...p, isReady: true, selectedCategories: categories }
              : p
          ),
        };
        store.setRoom(newRoom);
      }
    });

    // 游戏事件
    socket.on('game:started', ({ room }: { room: Room }) => {
      store.setRoom(room);
      store.setStatus('waiting');
    });

    socket.on('round:countdown', ({ count }: { count: number }) => {
      store.setStatus('countdown');
      store.setCountdown(count);
    });

    socket.on('round:go', () => {
      store.setCountdown(0);
    });

    socket.on('round:started', ({ question, round, totalRounds }: { question: any; round: number; totalRounds: number }) => {
      store.setCurrentQuestion(question);
      store.setCurrentRound(round);
      store.setTotalRounds(totalRounds);
      store.setBuzzerWinner(null);
      store.setAnswerResult(null);
      store.setStatus('playing');
    });

    socket.on('buzzer:pressed', ({ playerId }: { playerId: string }) => {
      store.setBuzzerWinner(playerId);
    });

    socket.on('answer:result', ({ correct, scores, correctAnswer, isSecondChance }: { correct: boolean; scores: any[]; correctAnswer: number; isSecondChance?: boolean }) => {
      store.setAnswerResult({ correct, scores, correctAnswer, isSecondChance });
      
      scores.forEach(({ playerId, score }: { playerId: string; score: number }) => {
        store.updatePlayerScore(playerId, score);
      });
      
      if (isSecondChance) {
        store.setBuzzerWinner(null);
      }
    });

    socket.on('round:ended', ({ scores, nextRound }: { scores: any[]; nextRound?: number }) => {
      if (nextRound) {
        store.setCurrentRound(nextRound);
      }
      scores.forEach(({ playerId, score }: { playerId: string; score: number }) => {
        store.updatePlayerScore(playerId, score);
      });
    });

    socket.on('game:ended', ({ winner, finalScores, stats }: { winner: any; finalScores: any[]; stats: any }) => {
      store.setGameResult({ winner, finalScores, stats });
      store.setStatus('ended');
    });

    socket.on('error', ({ message }: { message: string }) => {
      console.error('Socket error:', message);
      store.setConnectionError(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 发送事件的封装
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
