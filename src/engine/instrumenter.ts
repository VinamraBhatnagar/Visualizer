/**
 * Instrumenter — transforms raw JavaScript code by injecting tracing calls.
 *
 * Approach: We wrap the user's code inside a tracing harness that overrides
 * array operations and tracks comparisons, swaps, assignments, and variable
 * state at each "step".  This is intentionally simple (no AST parser) so we
 * don't need heavy deps.  It works by providing a runtime `__trace` object
 * that the harness interacts with, then returning the collected steps.
 */

import type { ExecutionStep, ExecutionTrace } from '@/types/execution';

/**
 * Build the code string that will run inside the Web Worker.
 * The harness wraps the user code and records every interesting operation.
 */
export function buildInstrumentedCode(userCode: string): string {
  // We provide a runtime tracer that the user code doesn't know about.
  // The user's code runs normally; we capture state by wrapping certain
  // global helpers that the user is encouraged to use (or that we inject
  // around array operations).
  return `
"use strict";

// ── Trace Collector ──────────────────────────────────────────────
const __steps = [];
const __MAX_STEPS = 1000;
let __stepId = 0;
const __watchedArrays = new Map();   // name → Proxy
const __variables = {};              // name → { value, type }
let __sortedIndices = [];
let __pointerLabels = {};

function __snapshot() {
  // Deep-copy watched array states
  const firstArr = __watchedArrays.entries().next().value;
  const arrayState = firstArr ? [...firstArr[1].__raw] : undefined;

  return {
    variables: JSON.parse(JSON.stringify(__variables)),
    arrayState: arrayState ? [...arrayState] : undefined,
    sortedIndices: [...__sortedIndices],
    pointerLabels: { ...__pointerLabels },
  };
}

function __addStep(lineHint, explanation, operations) {
  if (__stepId >= __MAX_STEPS) return;
  const snap = __snapshot();
  __steps.push({
    id: __stepId++,
    lineNumber: lineHint || 0,
    explanation: explanation || '',
    variables: snap.variables,
    stackFrames: [],
    heapObjects: [],
    operations: operations || [],
    arrayState: snap.arrayState,
    sortedIndices: snap.sortedIndices,
    pointerLabels: snap.pointerLabels,
  });
}

// ── Traced Array Helper ──────────────────────────────────────────
function __traceArray(name, arr) {
  const raw = [...arr];
  const proxy = {
    __raw: raw,
    get length() { return raw.length; },
    get(i) { return raw[i]; },
    set(i, v) {
      raw[i] = v;
    },
    swap(i, j) {
      __variables['operation'] = { name: 'operation', value: 'swap', type: 'string', changed: true, scope: 'local' };
      const temp = raw[i];
      raw[i] = raw[j];
      raw[j] = temp;
      __addStep(0, name + '[' + i + ']=' + raw[i] + ' ↔ ' + name + '[' + j + ']=' + raw[j] + ' — Swapped!', [
        { type: 'SWAP', target: name, indices: [i, j] }
      ]);
      delete __variables['operation'];
    },
    compare(i, j) {
      const result = raw[i] > raw[j];
      __addStep(0,
        'Compare ' + name + '[' + i + ']=' + raw[i] + (result ? ' > ' : ' ≤ ') + name + '[' + j + ']=' + raw[j] + (result ? ' → Need to swap' : ' → No swap needed'),
        [{ type: 'COMPARE', target: name, indices: [i, j] }]
      );
      return result;
    },
    markSorted(i) {
      if (!__sortedIndices.includes(i)) __sortedIndices.push(i);
      __addStep(0, name + '[' + i + ']=' + raw[i] + ' is now in its final sorted position ✓', [
        { type: 'SET_SORTED', target: name, indices: [i] }
      ]);
    },
    toArray() { return [...raw]; }
  };
  __watchedArrays.set(name, proxy);
  return proxy;
}

function __setVar(name, value) {
  const prev = __variables[name];
  __variables[name] = {
    name,
    value,
    type: typeof value,
    changed: !prev || prev.value !== value,
    scope: 'local'
  };
}

function __setPointer(label, index) {
  __pointerLabels[label] = index;
}

function __clearPointers() {
  __pointerLabels = {};
}

function __log(msg) {
  __addStep(0, msg, []);
}

// ── User Code Execution ──────────────────────────────────────────
try {
  ${userCode}
} catch (e) {
  __addStep(0, '❌ Runtime Error: ' + e.message, []);
}

// Return the collected trace
__steps;
`;
}

/**
 * Parse the steps array returned from the worker into a full ExecutionTrace.
 */
export function buildTrace(steps: ExecutionStep[], userCode: string): ExecutionTrace {
  return {
    language: 'javascript',
    algorithmName: 'Custom Code',
    code: userCode,
    steps,
    totalSteps: steps.length,
    complexity: {
      time: '—',
      space: '—',
      explanation: 'Run your own code to see the visualization.',
    },
    description: 'User-submitted code execution trace.',
  };
}
