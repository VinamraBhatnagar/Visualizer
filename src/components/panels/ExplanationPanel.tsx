import { useExecutionStore } from '@/stores/executionStore';
import { motion, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';

export default function ExplanationPanel() {
  const currentStep = useExecutionStore((s) => s.getCurrentStep());
  const currentStepIndex = useExecutionStore((s) => s.currentStepIndex);

  if (!currentStep) {
    return (
      <div className="p-4 text-sm text-surface-500 flex flex-col items-center justify-center h-full gap-3 text-center">
        <Play className="w-8 h-8 text-brand-500/50" />
        <p>Press Play or Step Forward to start execution.</p>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
        Execution Explanation
      </h3>
      
      <div className="flex-1 overflow-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-base text-surface-200 leading-relaxed"
          >
            {currentStep.explanation}
          </motion.div>
        </AnimatePresence>
      </div>

      {currentStep.complexity && (
        <div className="mt-4 pt-4 border-t border-surface-800">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-surface-500 mr-2">Time:</span>
              <span className="font-mono text-warning-400 font-bold">
                {currentStep.complexity.time}
              </span>
            </div>
            <div>
              <span className="text-surface-500 mr-2">Space:</span>
              <span className="font-mono text-success-400 font-bold">
                {currentStep.complexity.space}
              </span>
            </div>
          </div>
          <p className="text-xs text-surface-400 mt-2">
            {currentStep.complexity.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
