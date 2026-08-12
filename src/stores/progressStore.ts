import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress } from '@/types/progress';
import { LEVELS } from '@/types/progress';

interface ProgressState extends UserProgress {
  addXP: (amount: number) => void;
  completeTopic: (topicId: string) => void;
  solveProblem: (problemId: string) => void;
  failProblem: (problemId: string) => void;
  useHint: () => void;
  addTime: (seconds: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
  getLevel: () => { level: number; title: string; progress: number; color: string };
}

const getToday = () => new Date().toISOString().split('T')[0];

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: '',
      topicsCompleted: [],
      problemsSolved: [],
      problemsFailed: [],
      hintsUsed: 0,
      totalTime: 0,
      achievements: [],
      conceptsMastered: [],
      weakTopics: [],

      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = LEVELS.findIndex(
            (l) => newXP >= l.minXP && newXP < l.maxXP
          );
          return {
            xp: newXP,
            level: newLevel >= 0 ? LEVELS[newLevel].level : state.level,
          };
        }),

      completeTopic: (topicId) =>
        set((state) => ({
          topicsCompleted: state.topicsCompleted.includes(topicId)
            ? state.topicsCompleted
            : [...state.topicsCompleted, topicId],
        })),

      solveProblem: (problemId) =>
        set((state) => ({
          problemsSolved: state.problemsSolved.includes(problemId)
            ? state.problemsSolved
            : [...state.problemsSolved, problemId],
        })),

      failProblem: (problemId) =>
        set((state) => ({
          problemsFailed: state.problemsFailed.includes(problemId)
            ? state.problemsFailed
            : [...state.problemsFailed, problemId],
        })),

      useHint: () =>
        set((state) => ({ hintsUsed: state.hintsUsed + 1 })),

      addTime: (seconds) =>
        set((state) => ({ totalTime: state.totalTime + seconds })),

      unlockAchievement: (achievementId) =>
        set((state) => ({
          achievements: state.achievements.includes(achievementId)
            ? state.achievements
            : [...state.achievements, achievementId],
        })),

      updateStreak: () =>
        set((state) => {
          const today = getToday();
          const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .split('T')[0];

          if (state.lastActiveDate === today) {
            return state;
          }

          return {
            lastActiveDate: today,
            streak:
              state.lastActiveDate === yesterday ? state.streak + 1 : 1,
          };
        }),

      getLevel: () => {
        const { xp } = get();
        const levelInfo = LEVELS.find(
          (l) => xp >= l.minXP && xp < l.maxXP
        ) ?? LEVELS[0];
        const progress =
          ((xp - levelInfo.minXP) / (levelInfo.maxXP - levelInfo.minXP)) * 100;
        return {
          level: levelInfo.level,
          title: levelInfo.title,
          progress: Math.min(100, progress),
          color: levelInfo.color,
        };
      },
    }),
    {
      name: 'codepulse-progress',
    }
  )
);
