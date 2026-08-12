import { useExecutionStore } from '@/stores/executionStore';

export default function VariablePanel() {
  const currentStep = useExecutionStore((s) => s.getCurrentStep());

  if (!currentStep) {
    return (
      <div className="p-4 text-sm text-surface-500 text-center">
        No variables in scope.
      </div>
    );
  }

  const variables = Object.values(currentStep.variables);

  if (variables.length === 0) {
    return (
      <div className="p-4 text-sm text-surface-500 text-center">
        No variables in scope.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
        Local Variables
      </h3>
      <div className="flex flex-col gap-2">
        {variables.map((v) => (
          <div
            key={v.name}
            className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
              v.changed
                ? 'bg-warning-500/10 border-warning-500/30'
                : 'bg-surface-800 border-surface-700'
            } transition-colors duration-300`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-400 font-mono">{v.type}</span>
              <span className="text-sm text-accent-400 font-bold font-mono">
                {v.name}
              </span>
            </div>
            <span className="text-sm font-mono text-surface-200">
              {String(v.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
