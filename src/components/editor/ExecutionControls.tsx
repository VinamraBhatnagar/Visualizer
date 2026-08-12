import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Gauge,
} from 'lucide-react';
import { useExecutionStore } from '@/stores/executionStore';
import type { PlaybackSpeed } from '@/types/execution';
import { cn } from '@/utils/cn';

const SPEEDS: PlaybackSpeed[] = [0.25, 0.5, 1, 2, 4];

export default function ExecutionControls() {
  const {
    playbackState,
    speed,
    currentStepIndex,
    trace,
    play,
    pause,
    stepForward,
    stepBack,
    restart,
    setSpeed,
    goToStep,
  } = useExecutionStore();

  const totalSteps = trace?.steps.length ?? 0;
  const progress = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;
  const hasTrace = !!trace;

  return (
    <div className="bg-surface-900 border-t border-surface-800 px-4 py-3 space-y-3">
      {/* Progress bar */}
      <div className="relative">
        <div className="w-full h-1 bg-surface-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {hasTrace && (
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => goToStep(Number(e.target.value))}
            className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
            aria-label="Execution progress"
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        {/* Main controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={restart}
            disabled={!hasTrace}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
              hasTrace
                ? 'text-surface-400 hover:text-surface-100 hover:bg-surface-800'
                : 'text-surface-700 cursor-not-allowed'
            )}
            title="Restart (R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={stepBack}
            disabled={!hasTrace || currentStepIndex === 0}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
              hasTrace && currentStepIndex > 0
                ? 'text-surface-400 hover:text-surface-100 hover:bg-surface-800'
                : 'text-surface-700 cursor-not-allowed'
            )}
            title="Step Back (←)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={playbackState === 'playing' ? pause : play}
            disabled={!hasTrace}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
              hasTrace
                ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                : 'bg-surface-800 text-surface-700 cursor-not-allowed'
            )}
            title={playbackState === 'playing' ? 'Pause (Space)' : 'Play (Space)'}
          >
            {playbackState === 'playing' ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={stepForward}
            disabled={!hasTrace || currentStepIndex >= totalSteps - 1}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
              hasTrace && currentStepIndex < totalSteps - 1
                ? 'text-surface-400 hover:text-surface-100 hover:bg-surface-800'
                : 'text-surface-700 cursor-not-allowed'
            )}
            title="Step Forward (→)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Step counter */}
        <div className="text-xs font-mono text-surface-500">
          <span className="text-surface-300 font-semibold">{currentStepIndex + 1}</span>
          <span className="mx-1">/</span>
          <span>{totalSteps || '—'}</span>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <Gauge className="w-3.5 h-3.5 text-surface-600" />
          <div className="flex items-center gap-0.5">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-bold transition-all',
                  speed === s
                    ? 'bg-brand-600/20 text-brand-400'
                    : 'text-surface-600 hover:text-surface-400'
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
