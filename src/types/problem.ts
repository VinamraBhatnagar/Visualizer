/** Types for the problem-solving system */

export type Difficulty = 'easy' | 'medium' | 'hard';

export type TopicCategory =
  | 'arrays'
  | 'strings'
  | 'linkedList'
  | 'stack'
  | 'queue'
  | 'hashing'
  | 'trees'
  | 'graphs'
  | 'recursion'
  | 'sorting'
  | 'searching'
  | 'twoPointers'
  | 'slidingWindow'
  | 'dynamicProgramming'
  | 'greedy'
  | 'backtracking'
  | 'oop';

export type PatternType =
  | 'twoPointer'
  | 'slidingWindow'
  | 'hashing'
  | 'binarySearch'
  | 'stack'
  | 'queue'
  | 'recursion'
  | 'backtracking'
  | 'greedy'
  | 'dynamicProgramming'
  | 'graph'
  | 'tree'
  | 'divideAndConquer';

export interface Hint {
  level: number;
  type: 'conceptual' | 'pattern' | 'algorithm' | 'pseudocode' | 'solution';
  content: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isEdgeCase: boolean;
  description: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: TopicCategory;
  pattern: PatternType;
  constraints: string[];
  examples: TestCase[];
  edgeCases: TestCase[];
  hints: Hint[];
  starterCode: Record<string, string>; // language -> code
  solutionCode: Record<string, string>; // language -> code
  complexity: {
    time: string;
    space: string;
    explanation: string;
  };
  tags: string[];
  relatedProblems: string[];
}

export interface TopicContent {
  id: string;
  title: string;
  category: TopicCategory;
  icon: string;
  description: string;
  whatIsIt: string;
  whyWeNeedIt: string;
  howItWorks: string;
  analogy: string;
  codeExamples: Record<string, string>;
  commonMistakes: string[];
  complexity: {
    time: Record<string, string>;
    space: Record<string, string>;
  };
  problems: string[];
}
