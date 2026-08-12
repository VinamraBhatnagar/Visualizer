import { create } from 'zustand';
import type { ExecutionStep, ExecutionTrace, PlaybackState, PlaybackSpeed } from '@/types/execution';

interface ExecutionState {
  trace: ExecutionTrace | null;
  currentStepIndex: number;
  playbackState: PlaybackState;
  speed: PlaybackSpeed;
  playbackInterval: ReturnType<typeof setInterval> | null;

  // Actions
  setTrace: (trace: ExecutionTrace) => void;
  clearTrace: () => void;
  stepForward: () => void;
  stepBack: () => void;
  goToStep: (index: number) => void;
  play: () => void;
  pause: () => void;
  restart: () => void;
  setSpeed: (speed: PlaybackSpeed) => void;

  // Computed
  getCurrentStep: () => ExecutionStep | null;
  getTotalSteps: () => number;
  getProgress: () => number;
  isAtStart: () => boolean;
  isAtEnd: () => boolean;
}

export const useExecutionStore = create<ExecutionState>()((set, get) => ({
  trace: null,
  currentStepIndex: 0,
  playbackState: 'idle',
  speed: 1,
  playbackInterval: null,

  setTrace: (trace) => {
    const { playbackInterval } = get();
    if (playbackInterval) clearInterval(playbackInterval);
    set({
      trace,
      currentStepIndex: 0,
      playbackState: 'paused',
      playbackInterval: null,
    });
  },

  clearTrace: () => {
    const { playbackInterval } = get();
    if (playbackInterval) clearInterval(playbackInterval);
    set({
      trace: null,
      currentStepIndex: 0,
      playbackState: 'idle',
      playbackInterval: null,
    });
  },

  stepForward: () => {
    const { trace, currentStepIndex } = get();
    if (!trace) return;
    if (currentStepIndex < trace.steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      const { playbackInterval } = get();
      if (playbackInterval) clearInterval(playbackInterval);
      set({ playbackState: 'finished', playbackInterval: null });
    }
  },

  stepBack: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1, playbackState: 'paused' });
    }
  },

  goToStep: (index) => {
    const { trace } = get();
    if (!trace) return;
    const clamped = Math.max(0, Math.min(index, trace.steps.length - 1));
    set({ currentStepIndex: clamped });
  },

  play: () => {
    const { trace, playbackInterval: existingInterval } = get();
    if (!trace) return;
    if (existingInterval) clearInterval(existingInterval);

    // If finished, restart
    const { playbackState, currentStepIndex } = get();
    if (playbackState === 'finished' || currentStepIndex >= trace.steps.length - 1) {
      set({ currentStepIndex: 0 });
    }

    const interval = setInterval(() => {
      const state = get();
      if (!state.trace) {
        clearInterval(interval);
        set({ playbackInterval: null, playbackState: 'idle' });
        return;
      }
      if (state.currentStepIndex < state.trace.steps.length - 1) {
        set({ currentStepIndex: state.currentStepIndex + 1 });
      } else {
        clearInterval(interval);
        set({ playbackState: 'finished', playbackInterval: null });
      }
    }, 1000 / get().speed);

    set({ playbackState: 'playing', playbackInterval: interval });
  },

  pause: () => {
    const { playbackInterval } = get();
    if (playbackInterval) clearInterval(playbackInterval);
    set({ playbackState: 'paused', playbackInterval: null });
  },

  restart: () => {
    const { playbackInterval } = get();
    if (playbackInterval) clearInterval(playbackInterval);
    set({
      currentStepIndex: 0,
      playbackState: 'paused',
      playbackInterval: null,
    });
  },

  setSpeed: (speed) => {
    const { playbackState, playbackInterval } = get();
    set({ speed });
    // If playing, restart the interval with new speed
    if (playbackState === 'playing' && playbackInterval) {
      clearInterval(playbackInterval);
      get().play();
    }
  },

  getCurrentStep: () => {
    const { trace, currentStepIndex } = get();
    if (!trace || trace.steps.length === 0) return null;
    return trace.steps[currentStepIndex] ?? null;
  },

  getTotalSteps: () => {
    const { trace } = get();
    return trace?.steps.length ?? 0;
  },

  getProgress: () => {
    const { trace, currentStepIndex } = get();
    if (!trace || trace.steps.length <= 1) return 0;
    return (currentStepIndex / (trace.steps.length - 1)) * 100;
  },

  isAtStart: () => get().currentStepIndex === 0,

  isAtEnd: () => {
    const { trace, currentStepIndex } = get();
    if (!trace) return true;
    return currentStepIndex >= trace.steps.length - 1;
  },
}));
