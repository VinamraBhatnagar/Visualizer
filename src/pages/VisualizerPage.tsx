import { useEffect } from 'react';
import CodeEditor from '@/components/editor/CodeEditor';
import EditorToolbar from '@/components/editor/EditorToolbar';
import ExecutionControls from '@/components/editor/ExecutionControls';
import ArrayVisualizer from '@/components/visualizers/ArrayVisualizer';
import VariablePanel from '@/components/panels/VariablePanel';
import ExplanationPanel from '@/components/panels/ExplanationPanel';
import { useExecutionStore } from '@/stores/executionStore';
import { useEditorStore } from '@/stores/editorStore';
import { useVisualizationStore } from '@/stores/visualizationStore';
import { generateBubbleSortTrace } from '@/engine/traceGenerator';
import { Settings, Play, BookOpen } from 'lucide-react';

export default function VisualizerPage() {
  const { setTrace, trace, currentStepIndex } = useExecutionStore();
  const { language, code } = useEditorStore();
  const { setActiveVisualizer, activeVisualizer } = useVisualizationStore();

  // Load mock trace on mount
  useEffect(() => {
    setActiveVisualizer('array');
    const mockTrace = generateBubbleSortTrace(language);
    setTrace(mockTrace);
  }, [language, setActiveVisualizer, setTrace]);

  const handleGenerateTrace = () => {
    // In a real implementation, this would parse the `code` from editor
    // and generate a new trace based on custom input.
    // For MVP, we'll just reload the mock.
    const mockTrace = generateBubbleSortTrace(language);
    setTrace(mockTrace);
  };

  return (
    <div className="flex flex-col h-full bg-surface-950 overflow-hidden relative">
      {/* Visualizer Header */}
      <div className="flex-none h-14 border-b border-surface-800 px-6 flex items-center justify-between bg-surface-900/50">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-surface-100">Bubble Sort</h1>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-600/20 text-brand-400 border border-brand-500/20">
            ARRAY
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-warning-500/10 text-warning-400 border border-warning-500/20">
            O(n²)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-surface-300 hover:text-surface-100 hover:bg-surface-800 transition-colors">
            <BookOpen className="w-4 h-4" />
            Learn
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-surface-300 hover:text-surface-100 hover:bg-surface-800 transition-colors">
            <Settings className="w-4 h-4" />
            Config
          </button>
          <button 
            onClick={handleGenerateTrace}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 transition-all"
          >
            <Play className="w-4 h-4" />
            Build Trace
          </button>
        </div>
      </div>

      {/* Main Workspace - 3 Column Layout on Desktop */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* Left Column: Editor */}
        <div className="flex-1 lg:w-1/3 flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r border-surface-800">
          <EditorToolbar />
          <div className="flex-1 min-h-[300px] lg:min-h-0 relative">
            <CodeEditor />
            {/* Simple Line Highlight overlay (since Monaco renderLineHighlight is tricky to sync dynamically without custom decorators) */}
            {trace && trace.steps[currentStepIndex] && (
               <div className="absolute top-4 right-4 bg-brand-500/20 text-brand-300 px-3 py-1 text-xs font-mono rounded border border-brand-500/30 backdrop-blur z-10 pointer-events-none">
                 Executing Line: {trace.steps[currentStepIndex].lineNumber}
               </div>
            )}
          </div>
          <ExecutionControls />
        </div>

        {/* Middle Column: Visualization Canvas */}
        <div className="flex-1 lg:w-[45%] flex flex-col min-h-0 bg-surface-950 border-b lg:border-b-0 lg:border-r border-surface-800 relative">
          <div className="absolute top-4 left-4 z-10">
            <h2 className="text-xs font-bold text-surface-500 uppercase tracking-widest">
              Canvas
            </h2>
          </div>
          
          <div className="flex-1 relative overflow-hidden">
             {activeVisualizer === 'array' && <ArrayVisualizer />}
             {/* Future visualizers will be conditionally rendered here */}
          </div>
        </div>

        {/* Right Column: Information Panels */}
        <div className="flex-1 lg:w-[22%] flex flex-col min-h-0 bg-surface-900">
          <div className="flex-1 overflow-y-auto border-b border-surface-800">
            <VariablePanel />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ExplanationPanel />
          </div>
        </div>

      </div>
    </div>
  );
}
