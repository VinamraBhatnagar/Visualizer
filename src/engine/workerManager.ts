/**
 * Worker Manager — manages the lifecycle of the execution Web Worker.
 *
 * Exposes a simple `executeCode(code)` API that returns a Promise
 * resolving to an ExecutionTrace (or rejecting with an error).
 */

import { buildInstrumentedCode, buildTrace } from './instrumenter';
import { executeJavaCode } from './java/javaInterpreter';
import type { ExecutionTrace } from '@/types/execution';

let currentWorker: Worker | null = null;

function terminateExisting() {
  if (currentWorker) {
    currentWorker.terminate();
    currentWorker = null;
  }
}

/**
 * Check if the provided code looks like Java source code
 */
function isJavaCode(code: string): boolean {
  return (
    code.includes('class ') ||
    code.includes('public static void main') ||
    code.includes('System.out.') ||
    /\b(public|private|protected|static|void|int|double|boolean|String)\s+[a-zA-Z0-9_$]+\s*\(/.test(code) ||
    /int\s+[a-zA-Z0-9_$]+\[\s*\]/.test(code) ||
    /new\s+int\[/.test(code)
  );
}

/**
 * Execute user code and return an ExecutionTrace.
 * If Java code is detected, executes using the in-browser Java Execution Engine.
 * Otherwise runs JavaScript instrumented execution.
 */
export async function executeCode(userCode: string): Promise<ExecutionTrace> {
  // If Java code, execute directly with zero-annotation Java engine
  if (isJavaCode(userCode)) {
    try {
      return executeJavaCode(userCode);
    } catch (err: any) {
      throw new Error(err?.message || 'Java execution failed.');
    }
  }

  return new Promise((resolve, reject) => {
    terminateExisting();

    const instrumentedCode = buildInstrumentedCode(userCode);

    // Create worker from a blob URL so we don't need a separate bundled file
    const workerSource = `
      self.onmessage = function (e) {
        const { code } = e.data;

        const timeoutId = setTimeout(function () {
          self.postMessage({
            success: false,
            error: 'Execution timed out (5 second limit). Check for infinite loops.',
          });
          self.close();
        }, 5000);

        try {
          var indirectEval = eval;
          var steps = indirectEval(code);
          clearTimeout(timeoutId);

          if (!Array.isArray(steps)) {
            self.postMessage({
              success: false,
              error: 'Code did not produce a valid trace.',
            });
            return;
          }

          self.postMessage({ success: true, steps: steps });
        } catch (err) {
          clearTimeout(timeoutId);
          self.postMessage({
            success: false,
            error: err && err.message ? err.message : 'Unknown execution error',
          });
        }
      };
    `;

    const blob = new Blob([workerSource], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    currentWorker = worker;

    // Overall timeout from the main thread side (6s, slightly longer than worker's 5s)
    const mainTimeout = setTimeout(() => {
      terminateExisting();
      URL.revokeObjectURL(workerUrl);
      reject(new Error('Execution timed out.'));
    }, 6000);

    worker.onmessage = (event) => {
      clearTimeout(mainTimeout);
      terminateExisting();
      URL.revokeObjectURL(workerUrl);

      const { success, steps, error } = event.data;
      if (success) {
        resolve(buildTrace(steps, userCode));
      } else {
        reject(new Error(error || 'Execution failed.'));
      }
    };

    worker.onerror = (event) => {
      clearTimeout(mainTimeout);
      terminateExisting();
      URL.revokeObjectURL(workerUrl);
      reject(new Error(event.message || 'Worker error.'));
    };

    // Send the instrumented code to the worker
    worker.postMessage({ code: instrumentedCode });
  });
}
