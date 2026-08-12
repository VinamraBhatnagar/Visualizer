import { motion } from 'motion/react';
import { useExecutionStore } from '@/stores/executionStore';
import { useCallback } from 'react';
import { cn } from '@/utils/cn';

export default function ArrayVisualizer() {
  const currentStep = useExecutionStore((s) => s.getCurrentStep());

  const getCellColor = useCallback(
    (index: number) => {
      if (!currentStep) return 'from-brand-500 to-brand-600';
      
      if (currentStep.sortedIndices?.includes(index)) {
        return 'from-success-500 to-success-600';
      }
      
      const isComparing = currentStep.operations.some(
        (op) => op.type === 'COMPARE' && op.indices?.includes(index)
      );
      if (isComparing) return 'from-warning-400 to-warning-500';

      const isSwapping = currentStep.operations.some(
        (op) => op.type === 'SWAP' && op.indices?.includes(index)
      );
      if (isSwapping) return 'from-error-400 to-error-500';
      
      if (currentStep.highlights?.[index]) {
         return currentStep.highlights[index]; // Custom highlight class
      }

      return 'from-brand-500 to-brand-600';
    },
    [currentStep]
  );

  if (!currentStep || !currentStep.arrayState) {
    return (
      <div className="flex items-center justify-center h-full text-surface-500">
        No array data to visualize.
      </div>
    );
  }

  const { arrayState, pointerLabels = {} } = currentStep;

  // Invert pointerLabels map to group pointers by index
  const pointersByIndex: Record<number, string[]> = {};
  Object.entries(pointerLabels).forEach(([label, index]) => {
    if (!pointersByIndex[index]) pointersByIndex[index] = [];
    pointersByIndex[index].push(label);
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 relative">
      <div className="flex items-end justify-center gap-2 sm:gap-4 flex-wrap">
        {arrayState.map((val, idx) => (
          <div key={`${idx}-${val}`} className="flex flex-col items-center gap-2">
            {/* Value box */}
            <motion.div
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={cn(
                'relative flex items-center justify-center rounded-lg shadow-lg text-white font-bold transition-all duration-300',
                'bg-gradient-to-br',
                getCellColor(idx),
                // Dynamic sizing based on value for a bar-chart like feel, or just fixed square
                'w-12 h-12 sm:w-16 sm:h-16 text-lg sm:text-xl'
              )}
            >
              {val}
            </motion.div>
            
            {/* Index label */}
            <span className="text-xs text-surface-500 font-mono">{idx}</span>

            {/* Pointers */}
            {pointersByIndex[idx] && (
              <div className="flex flex-col items-center gap-1 mt-1">
                <motion.div
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-xs text-brand-400"
                >
                  ▲
                </motion.div>
                {pointersByIndex[idx].map((label) => (
                  <span
                    key={label}
                    className="text-[10px] font-bold text-accent-400 font-mono bg-accent-400/10 px-1.5 py-0.5 rounded"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
