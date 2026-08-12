/**
 * Web Worker for sandboxed code execution.
 *
 * Receives instrumented code from the main thread, evaluates it inside
 * an indirect-eval sandbox with a 5-second timeout, and posts back the
 * collected execution steps (or an error).
 */

self.onmessage = function (e: MessageEvent<{ code: string }>) {
  const { code } = e.data;

  // Set a hard timeout
  const timeoutId = setTimeout(() => {
    self.postMessage({
      success: false,
      error: 'Execution timed out (5 second limit). Check for infinite loops.',
    });
    self.close();
  }, 5000);

  try {
    // Indirect eval — runs in global scope of the worker, not the main thread
    const indirectEval = eval;
    const steps = indirectEval(code);

    clearTimeout(timeoutId);

    if (!Array.isArray(steps)) {
      self.postMessage({
        success: false,
        error: 'Code did not produce a valid trace. Make sure you use the tracing helpers.',
      });
      return;
    }

    self.postMessage({ success: true, steps });
  } catch (err: any) {
    clearTimeout(timeoutId);
    self.postMessage({
      success: false,
      error: err?.message || 'Unknown execution error',
    });
  }
};
