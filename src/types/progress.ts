import type { CollegeYear } from './curriculum';

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  topicsCompleted: string[];
  problemsSolved: string[];
  problemsFailed: string[];
  hintsUsed: number;
  totalTime: number; // seconds
  achievements: string[];
  conceptsMastered: string[];
  weakTopics: string[];
  selectedCollegeYear?: CollegeYear;
  solvedLeetCodeIds?: string[];
  completedCurriculumTopicIds?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  condition: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface DailyChallenge {
  id: string;
  date: string;
  problemId: string;
  completed: boolean;
  xpReward: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Novice', minXP: 0, maxXP: 100, color: '#6B7280' },
  { level: 2, title: 'Beginner', minXP: 100, maxXP: 300, color: '#10B981' },
  { level: 3, title: 'Apprentice', minXP: 300, maxXP: 600, color: '#3B82F6' },
  { level: 4, title: 'Intermediate', minXP: 600, maxXP: 1000, color: '#8B5CF6' },
  { level: 5, title: 'Advanced', minXP: 1000, maxXP: 1500, color: '#F59E0B' },
  { level: 6, title: 'Expert', minXP: 1500, maxXP: 2200, color: '#EF4444' },
  { level: 7, title: 'Master', minXP: 2200, maxXP: 3000, color: '#EC4899' },
  { level: 8, title: 'Grandmaster', minXP: 3000, maxXP: 4000, color: '#F97316' },
  { level: 9, title: 'Legend', minXP: 4000, maxXP: 5500, color: '#14B8A6' },
  { level: 10, title: 'Sage', minXP: 5500, maxXP: Infinity, color: '#FFD700' },
];
