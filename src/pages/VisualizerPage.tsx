import { useEffect, useState, useCallback } from 'react';
import CodeEditor from '@/components/editor/CodeEditor';
import EditorToolbar from '@/components/editor/EditorToolbar';
import ExecutionControls from '@/components/editor/ExecutionControls';
import ArrayVisualizer from '@/components/visualizers/ArrayVisualizer';
import VariablePanel from '@/components/panels/VariablePanel';
import ExplanationPanel from '@/components/panels/ExplanationPanel';
import { useExecutionStore } from '@/stores/executionStore';
import { useEditorStore } from '@/stores/editorStore';
import { useVisualizationStore } from '@/stores/visualizationStore';
import { executeCode } from '@/engine/workerManager';
import { CODE_TEMPLATES } from '@/engine/codeTemplates';
import AiTutorPanel from '@/components/panels/AiTutorPanel';
import { Play, BookOpen, Loader2, AlertTriangle, ChevronDown, Bot, Variable, MessageCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function VisualizerPage() {
  const { setTrace, trace, currentStepIndex } = useExecutionStore();
  const { code, setCode } = useEditorStore();
  const { setActiveVisualizer, activeVisualizer } = useVisualizationStore();

  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);

  // Load default template on mount
  useEffect(() => {
    setActiveVisualizer('array');
    if (!code || code.trim() === '' || code.includes('function twoSum')) {
      setCode(CODE_TEMPLATES['bubble-sort'].code);
    }
  }, []);

  const handleExecute = useCallback(async () => {
    setIsExecuting(true);
    setError(null);
    try {
      const result = await executeCode(code);
      setTrace(result);
    } catch (err: any) {
      setError(err.message || 'Execution failed.');
    } finally {
      setIsExecuting(false);
    }
  }, [code, setTrace]);

  const handleLoadTemplate = (key: string) => {
    setCode(CODE_TEMPLATES[key].code);
    setTemplateMenuOpen(false);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full bg-surface-950 overflow-hidden relative">
      {/* Visualizer Header */}
      <div className="flex-none h-14 border-b border-surface-800 px-6 flex items-center justify-between bg-surface-900/50">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-surface-100">Code Visualizer</h1>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-600/20 text-brand-400 border border-brand-500/20">
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Template dropdown */}
          <div className="relative">
            <button
              onClick={() => setTemplateMenuOpen(!templateMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-surface-300 hover:text-surface-100 hover:bg-surface-800 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Templates
              <ChevronDown className="w-3 h-3" />
            </button>
            {templateMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setTemplateMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-52 bg-surface-800 border border-surface-700 rounded-lg shadow-xl z-50 py-1">
                  {Object.entries(CODE_TEMPLATES).map(([key, tmpl]) => (
                    <button
                      key={key}
                      onClick={() => handleLoadTemplate(key)}
                      className="w-full text-left px-4 py-2 text-sm text-surface-200 hover:bg-surface-700 transition-colors"
                    >
                      {tmpl.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg transition-all',
              isExecuting
                ? 'bg-surface-700 text-surface-400 cursor-wait'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/20'
            )}
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running…
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex-none px-6 py-3 bg-error-500/10 border-b border-error-500/30 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-error-400 shrink-0" />
          <p className="text-sm text-error-300 flex-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs text-error-400 hover:text-error-300 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace - 3 Column Layout on Desktop */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">

        {/* Left Column: Editor */}
        <div className="flex-1 lg:w-1/3 flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r border-surface-800">
          <EditorToolbar />
          <div className="flex-1 min-h-[300px] lg:min-h-0 relative">
            <CodeEditor />
            {trace && trace.steps[currentStepIndex] && (
              <div className="absolute top-4 right-4 bg-brand-500/20 text-brand-300 px-3 py-1 text-xs font-mono rounded border border-brand-500/30 backdrop-blur z-10 pointer-events-none">
                Step: {currentStepIndex + 1} / {trace.steps.length}
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
          </div>
        </div>

        {/* Right Column: Tabbed Info Panels */}
        <RightPanel />

      </div>
    </div>
  );
}

/* ── Right Panel with Tabs ── */

type RightTab = 'variables' | 'explanation' | 'tutor';

function RightPanel() {
  const [activeTab, setActiveTab] = useState<RightTab>('variables');

  const tabs: { id: RightTab; label: string; icon: React.ElementType }[] = [
    { id: 'variables', label: 'Vars', icon: Variable },
    { id: 'explanation', label: 'Steps', icon: MessageCircle },
    { id: 'tutor', label: 'AI Tutor', icon: Bot },
  ];

  return (
    <div className="flex-1 lg:w-[22%] flex flex-col min-h-0 bg-surface-900">
      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-surface-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors relative',
              activeTab === tab.id
                ? 'text-brand-400'
                : 'text-surface-500 hover:text-surface-300'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'variables' && (
          <div className="h-full overflow-y-auto">
            <VariablePanel />
          </div>
        )}
        {activeTab === 'explanation' && (
          <div className="h-full overflow-y-auto">
            <ExplanationPanel />
          </div>
        )}
        {activeTab === 'tutor' && (
          <div className="h-full">
            <AiTutorPanel />
          </div>
        )}
      </div>
    </div>
  );
}
