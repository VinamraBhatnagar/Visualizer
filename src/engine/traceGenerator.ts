import type { ExecutionTrace, Language } from '@/types/execution';

// This is a mock trace generator for Bubble Sort to prove the concept for the MVP.
// In Phase 7, this will be replaced by actual WebWorker-based AST instrumentation or Pyodide.

export const generateBubbleSortTrace = (language: Language): ExecutionTrace => {
  return {
    language,
    algorithmName: 'Bubble Sort',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    complexity: {
      time: 'O(n²)',
      space: 'O(1)',
      explanation: 'Time complexity is O(n²) because of the nested loops. Space complexity is O(1) as sorting is done in-place.'
    },
    code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

const arr = [64, 34, 25, 12, 22];
bubbleSort(arr);`,
    totalSteps: 13, // simplified steps for demonstration
    steps: [
      {
        id: 0,
        lineNumber: 17,
        explanation: 'Initialize the array with unsorted values.',
        variables: {},
        stackFrames: [],
        heapObjects: [],
        operations: [],
        arrayState: [64, 34, 25, 12, 22],
        sortedIndices: [],
      },
      {
        id: 1,
        lineNumber: 18,
        explanation: 'Call bubbleSort(arr).',
        variables: { arr: { name: 'arr', type: 'Array', value: '[64, 34, 25, 12, 22]', changed: false, scope: 'global' } },
        stackFrames: [{ functionName: 'bubbleSort', parameters: { arr: [64, 34, 25, 12, 22] }, localVariables: {}, lineNumber: 1 }],
        heapObjects: [],
        operations: [],
        arrayState: [64, 34, 25, 12, 22],
        sortedIndices: [],
      },
      {
        id: 2,
        lineNumber: 2,
        explanation: 'Get length of array (n = 5).',
        variables: { 
          arr: { name: 'arr', type: 'Array', value: '[64, 34, 25, 12, 22]', changed: false, scope: 'global' },
          n: { name: 'n', type: 'number', value: 5, changed: true, scope: 'local' } 
        },
        stackFrames: [{ functionName: 'bubbleSort', parameters: { arr: [64, 34, 25, 12, 22] }, localVariables: { n: 5 }, lineNumber: 2 }],
        heapObjects: [],
        operations: [],
        arrayState: [64, 34, 25, 12, 22],
        sortedIndices: [],
      },
      {
        id: 3,
        lineNumber: 4,
        explanation: 'Start inner loop (j = 0). Comparing elements at index 0 and 1.',
        variables: { 
          n: { name: 'n', type: 'number', value: 5, changed: false, scope: 'local' },
          i: { name: 'i', type: 'number', value: 0, changed: true, scope: 'local' },
          j: { name: 'j', type: 'number', value: 0, changed: true, scope: 'local' }
        },
        stackFrames: [],
        heapObjects: [],
        operations: [{ type: 'COMPARE', target: 'arr', indices: [0, 1] }],
        arrayState: [64, 34, 25, 12, 22],
        pointerLabels: { i: 0, j: 0, 'j+1': 1 },
        sortedIndices: [],
      },
      {
        id: 4,
        lineNumber: 5,
        explanation: '64 > 34, so we need to swap them.',
        variables: { 
          i: { name: 'i', type: 'number', value: 0, changed: false, scope: 'local' },
          j: { name: 'j', type: 'number', value: 0, changed: false, scope: 'local' }
        },
        stackFrames: [],
        heapObjects: [],
        operations: [{ type: 'SWAP', target: 'arr', indices: [0, 1] }],
        arrayState: [34, 64, 25, 12, 22], // swapped
        pointerLabels: { j: 0, 'j+1': 1 },
        sortedIndices: [],
      },
      {
        id: 5,
        lineNumber: 4,
        explanation: 'j = 1. Comparing 64 and 25.',
        variables: { 
          i: { name: 'i', type: 'number', value: 0, changed: false, scope: 'local' },
          j: { name: 'j', type: 'number', value: 1, changed: true, scope: 'local' }
        },
        stackFrames: [],
        heapObjects: [],
        operations: [{ type: 'COMPARE', target: 'arr', indices: [1, 2] }],
        arrayState: [34, 64, 25, 12, 22],
        pointerLabels: { j: 1, 'j+1': 2 },
        sortedIndices: [],
      },
      {
        id: 6,
        lineNumber: 5,
        explanation: '64 > 25, swapping them.',
        variables: { 
          i: { name: 'i', type: 'number', value: 0, changed: false, scope: 'local' },
          j: { name: 'j', type: 'number', value: 1, changed: false, scope: 'local' }
        },
        stackFrames: [],
        heapObjects: [],
        operations: [{ type: 'SWAP', target: 'arr', indices: [1, 2] }],
        arrayState: [34, 25, 64, 12, 22],
        pointerLabels: { j: 1, 'j+1': 2 },
        sortedIndices: [],
      },
      {
        id: 7,
        lineNumber: 4,
        explanation: 'j = 2. Comparing 64 and 12.',
        variables: { 
          i: { name: 'i', type: 'number', value: 0, changed: false, scope: 'local' },
          j: { name: 'j', type: 'number', value: 2, changed: true, scope: 'local' }
        },
        stackFrames: [],
        heapObjects: [],
        operations: [{ type: 'COMPARE', target: 'arr', indices: [2, 3] }],
        arrayState: [34, 25, 64, 12, 22],
        pointerLabels: { j: 2, 'j+1': 3 },
        sortedIndices: [],
      },
      {
        id: 8,
        lineNumber: 5,
        explanation: '64 > 12, swapping them.',
        variables: { 
          i: { name: 'i', type: 'number', value: 0, changed: false, scope: 'local' },
          j: { name: 'j', type: 'number', value: 2, changed: false, scope: 'local' }
        },
        stackFrames: [],
        heapObjects: [],
        operations: [{ type: 'SWAP', target: 'arr', indices: [2, 3] }],
        arrayState: [34, 25, 12, 64, 22],
        pointerLabels: { j: 2, 'j+1': 3 },
        sortedIndices: [],
      },
      {
        id: 9,
        lineNumber: 4,
        explanation: 'j = 3. Comparing 64 and 22.',
        variables: { 
          i: { name: 'i', type: 'number', value: 0, changed: false, scope: 'local' },
          j: { name: 'j', type: 'number', value: 3, changed: true, scope: 'local' }
        },
        stackFrames: [],
        heapObjects: [],
        operations: [{ type: 'COMPARE', target: 'arr', indices: [3, 4] }],
        arrayState: [34, 25, 12, 64, 22],
        pointerLabels: { j: 3, 'j+1': 4 },
        sortedIndices: [],
      },
      {
        id: 10,
        lineNumber: 5,
        explanation: '64 > 22, swapping them.',
        variables: { 
          i: { name: 'i', type: 'number', value: 0, changed: false, scope: 'local' },
          j: { name: 'j', type: 'number', value: 3, changed: false, scope: 'local' }
        },
        stackFrames: [],
        heapObjects: [],
        operations: [{ type: 'SWAP', target: 'arr', indices: [3, 4] }],
        arrayState: [34, 25, 12, 22, 64],
        pointerLabels: { j: 3, 'j+1': 4 },
        sortedIndices: [],
      },
      {
        id: 11,
        lineNumber: 3,
        explanation: 'Inner loop complete. The largest element (64) has bubbled to the end and is now in its final sorted position.',
        variables: { 
          i: { name: 'i', type: 'number', value: 0, changed: false, scope: 'local' },
        },
        stackFrames: [],
        heapObjects: [],
        operations: [{ type: 'SET_SORTED', target: 'arr', indices: [4] }],
        arrayState: [34, 25, 12, 22, 64],
        pointerLabels: { i: 0 },
        sortedIndices: [4],
      },
      {
        id: 12,
        lineNumber: 14,
        explanation: '(Skipping remaining passes for brevity in mock). Array is fully sorted!',
        variables: {},
        stackFrames: [],
        heapObjects: [],
        operations: [],
        arrayState: [12, 22, 25, 34, 64],
        pointerLabels: {},
        sortedIndices: [0, 1, 2, 3, 4],
        complexity: {
          time: 'O(n²)',
          space: 'O(1)',
          explanation: 'Algorithm completed successfully.'
        }
      }
    ]
  };
};
