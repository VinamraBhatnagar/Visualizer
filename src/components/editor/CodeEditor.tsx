import { useRef, useCallback } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { useEditorStore } from '@/stores/editorStore';
import { useThemeStore } from '@/stores/themeStore';

const LANGUAGE_MAP: Record<string, string> = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
};

export default function CodeEditor() {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const { code, language, fontSize, showMinimap, wordWrap, setCode } = useEditorStore();
  const { mode } = useThemeStore();

  const handleEditorMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.focus();
  }, []);

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) setCode(value);
    },
    [setCode]
  );

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-surface-800">
      <Editor
        height="100%"
        language={LANGUAGE_MAP[language] || 'javascript'}
        value={code}
        onChange={handleChange}
        onMount={handleEditorMount}
        theme={mode === 'dark' ? 'vs-dark' : 'vs'}
        options={{
          fontSize,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          minimap: { enabled: showMinimap },
          wordWrap: wordWrap ? 'on' : 'off',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          roundedSelection: true,
          contextmenu: true,
          suggest: {
            showMethods: true,
            showFunctions: true,
            showVariables: true,
            showKeywords: true,
          },
        }}
      />
    </div>
  );
}
