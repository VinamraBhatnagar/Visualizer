import { create } from 'zustand';
import type { VisualizerType } from '@/types/visualization';

interface VisualizationState {
  activeVisualizer: VisualizerType | null;
  isAnimating: boolean;
  animationDuration: number; // ms

  setActiveVisualizer: (type: VisualizerType | null) => void;
  setIsAnimating: (animating: boolean) => void;
  setAnimationDuration: (duration: number) => void;
}

export const useVisualizationStore = create<VisualizationState>()((set) => ({
  activeVisualizer: null,
  isAnimating: false,
  animationDuration: 500,

  setActiveVisualizer: (type) => set({ activeVisualizer: type }),
  setIsAnimating: (animating) => set({ isAnimating: animating }),
  setAnimationDuration: (duration) => set({ animationDuration: duration }),
}));
