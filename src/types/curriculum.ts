import type { Difficulty } from './problem';

export type CollegeYear = 1 | 2 | 3 | 4;

export interface LeetCodeProblemReference {
  id: string;
  leetcodeNumber: number;
  title: string;
  difficulty: Difficulty;
  category: string;
  pattern: string;
  leetcodeUrl: string;
  platformProblemId?: string; // Links to internal problems if available
  visualizerTemplate?: string; // Template key to auto-load in Visualizer
  isCore: boolean; // Must-do problem
  acceptanceRate?: string;
  whyImportant: string;
  companies?: string[];
}

export interface CurriculumTopic {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  importance: 'Essential' | 'High' | 'Advanced';
  visualizerTemplate?: string;
  recommendedProblemsCount: number;
  subtopics: string[];
}

export interface SemesterMilestone {
  semester: number;
  title: string;
  academicCourses: string[];
  focusGoal: string;
  topics: CurriculumTopic[];
  problems: LeetCodeProblemReference[];
}

export interface YearCurriculum {
  year: CollegeYear;
  title: string;
  badge: string;
  subtitle: string;
  tagline: string;
  targetAudience: string;
  icon: string;
  color: string;
  accentGradient: string;
  primaryGoals: string[];
  academicSyllabusSubjects: string[];
  semesters: [SemesterMilestone, SemesterMilestone];
  proTips: string[];
  recommendedDailyMinutes: number;
  totalTargetProblems: number;
}
