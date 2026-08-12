/** Types for the visualization system */

export type VisualizerType =
  | 'array'
  | 'linkedList'
  | 'stack'
  | 'queue'
  | 'tree'
  | 'graph'
  | 'recursion'
  | 'hashMap'
  | 'twoPointer'
  | 'slidingWindow'
  | 'oop'
  | 'memory';

export interface ArrayVisualizerState {
  values: number[];
  highlights: Record<number, string>;
  labels: Record<string, number>;
  sortedIndices: number[];
  windowStart?: number;
  windowEnd?: number;
}

export interface LinkedListNode {
  id: string;
  value: number;
  next: string | null;
  highlighted: boolean;
  color?: string;
}

export interface LinkedListVisualizerState {
  nodes: LinkedListNode[];
  pointers: Record<string, string>; // label -> nodeId
}

export interface StackVisualizerState {
  items: { value: number; highlighted: boolean }[];
  topIndex: number;
  operation?: 'push' | 'pop' | 'peek';
}

export interface QueueVisualizerState {
  items: { value: number; highlighted: boolean }[];
  frontIndex: number;
  rearIndex: number;
  operation?: 'enqueue' | 'dequeue' | 'peek';
}

export interface TreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  x: number;
  y: number;
  highlighted: boolean;
  color?: string;
  label?: string;
}

export interface TreeVisualizerState {
  nodes: Record<string, TreeNode>;
  rootId: string | null;
  visitedIds: string[];
  currentId: string | null;
}

export interface GraphNode {
  id: string;
  value: string;
  x: number;
  y: number;
  color?: string;
  label?: string;
  distance?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  highlighted: boolean;
  color?: string;
}

export interface GraphVisualizerState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
  weighted: boolean;
  visitedIds: string[];
  currentId: string | null;
  queueOrStack: string[];
  distances: Record<string, number>;
  parents: Record<string, string | null>;
}

export interface RecursionFrame {
  id: string;
  functionName: string;
  args: unknown[];
  returnValue?: unknown;
  depth: number;
  isBaseCase: boolean;
  isActive: boolean;
  children: string[];
}

export interface RecursionVisualizerState {
  frames: Record<string, RecursionFrame>;
  rootId: string | null;
  activeId: string | null;
  callOrder: string[];
  returnOrder: string[];
}

export interface HashMapBucket {
  index: number;
  entries: { key: string; value: unknown; highlighted: boolean }[];
}

export interface HashMapVisualizerState {
  buckets: HashMapBucket[];
  hashFunction: string;
  size: number;
  capacity: number;
  currentKey?: string;
  currentHash?: number;
}
