import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useExecutionStore } from '@/stores/executionStore';
import { useEditorStore } from '@/stores/editorStore';
import { askTutor } from '@/services/tutorService';
import { Bot, Send, Loader2, Key, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

const QUICK_PROMPTS = [
  'Explain this step',
  'What is the time complexity?',
  'Give me a hint',
  'Why do we need this swap?',
  'What happens next?',
];

export default function AiTutorPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your AI Tutor 🤖. Ask me anything about the code, the algorithm, or the current step. I'm here to help you **understand**, not just solve.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('codepulse-gemini-key') || '');

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const code = useEditorStore((s) => s.code);
  const currentStepIndex = useExecutionStore((s) => s.currentStepIndex);
  const trace = useExecutionStore((s) => s.trace);

  const currentStep = trace?.steps[currentStepIndex] ?? null;

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askTutor({ code, step: currentStep, question: question.trim() });
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      if (err.message?.startsWith('NO_API_KEY')) {
        setShowApiKeyInput(true);
        const sysMsg: Message = {
          id: `sys-${Date.now()}`,
          role: 'system',
          content: 'Please enter your free Gemini API key to use the AI Tutor. Get one at [ai.google.dev](https://ai.google.dev)',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, sysMsg]);
      } else {
        const errMsg: Message = {
          id: `err-${Date.now()}`,
          role: 'system',
          content: `Error: ${err.message}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('codepulse-gemini-key', apiKey.trim());
      setShowApiKeyInput(false);
      const sysMsg: Message = {
        id: `sys-${Date.now()}`,
        role: 'system',
        content: '✅ API key saved! You can now ask me questions.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, sysMsg]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-800 shrink-0">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-brand-500 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="text-sm font-bold text-surface-200">AI Tutor</h3>
        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full ml-auto">
          Gemini
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[90%] px-3 py-2 rounded-xl text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-br-sm'
                    : msg.role === 'system'
                      ? 'bg-warning-500/10 text-warning-300 border border-warning-500/20'
                      : 'bg-surface-800 text-surface-200 border border-surface-700 rounded-bl-sm'
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-800 border border-surface-700 px-3 py-2 rounded-xl rounded-bl-sm">
              <div className="flex items-center gap-2 text-sm text-surface-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Thinking…
              </div>
            </div>
          </div>
        )}
      </div>

      {/* API Key Input */}
      {showApiKeyInput && (
        <div className="px-3 py-2 border-t border-surface-800 bg-surface-850">
          <div className="flex items-center gap-2 text-xs text-surface-400 mb-2">
            <Key className="w-3 h-3" />
            <span>Enter your free Gemini API key</span>
            <button onClick={() => setShowApiKeyInput(false)} className="ml-auto">
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza..."
              className="flex-1 px-3 py-1.5 bg-surface-900 border border-surface-700 rounded-lg text-sm focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-3 py-1.5 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-500 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Quick Prompts */}
      <div className="px-3 py-2 border-t border-surface-800 shrink-0">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="shrink-0 px-2.5 py-1 text-[11px] font-medium text-surface-400 bg-surface-800 hover:bg-surface-700 hover:text-surface-200 rounded-full border border-surface-700 transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t border-surface-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the code…"
            disabled={isLoading}
            className="flex-1 px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm focus:outline-none focus:border-brand-500 transition-colors disabled:opacity-50 placeholder:text-surface-600"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-9 h-9 rounded-lg bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
