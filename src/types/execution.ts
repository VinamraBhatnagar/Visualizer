/** Core execution trace types used throughout the visualization engine */

export type Language = 'java' | 'python' | 'cpp' | 'javascript';

export type OperationType =
  | 'COMPARE'
  | 'SWAP'
  | 'ACCESS'
  | 'INSERT'
  | 'DELETE'
  | 'VISIT'
  | 'PUSH'
  | 'POP'
  | 'ENQUEUE'
  | 'DEQUEUE'
  | 'MOVE_POINTER'
  | 'CALL_FUNCTION'
  | 'RETURN_FUNCTION'
  | 'ASSIGN'
  | 'UPDATE_VALUE'
  | 'CREATE_NODE'
  | 'DELETE_NODE'
  | 'HIGHLIGHT'
  | 'UNHIGHLIGHT'
  | 'SET_SORTED'
  | 'SET_LABEL';

export interface VariableState {
  name: string;
  value: unknown;
  type: string;
  changed: boolean;
  scope: string;
}

export interface StackFrame {
  functionName: string;
  parameters: Record<string, unknown>;
  localVariables: Record<string, unknown>;
  returnValue?: unknown;
  lineNumber: number;
}

export interface HeapObject {
  id: string;
  type: string;
  properties: Record<string, unknown>;
  references: Record<string, string>;
}

export interface VisualizationOperation {
  type: OperationType;
  target: string;
  indices?: number[];
  from?: unknown;
  to?: unknown;
  label?: string;
  color?: string;
}

export interface ComplexityNote {
  time: string;
  space: string;
  explanation: string;
}

export interface ExecutionStep {
  id: number;
  lineNumber: number;
  previousLine?: number;
  code?: string;
  variables: Record<string, VariableState>;
  stackFrames: StackFrame[];
  heapObjects: HeapObject[];
  operations: VisualizationOperation[];
  explanation: string;
  complexity?: ComplexityNote;
  /** Array state for array visualizers */
  arrayState?: number[];
  /** Highlights for array cells */
  highlights?: Record<number, string>;
  /** Labels for pointer visualization */
  pointerLabels?: Record<string, number>;
  /** Whether the element at index is in sorted position */
  sortedIndices?: number[];
}

export interface ExecutionTrace {
  language: Language;
  algorithmName: string;
  code: string;
  steps: ExecutionStep[];
  totalSteps: number;
  complexity: ComplexityNote;
  description: string;
}

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'finished';

export type PlaybackSpeed = 0.25 | 0.5 | 1 | 2 | 4;
