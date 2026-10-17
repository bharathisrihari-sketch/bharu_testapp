import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  Code2,
  Check,
  Bot,
  Lightbulb,
  Cpu,
  Layers,
  Smartphone,
  Wand2
} from 'lucide-react';
import { AndroidFile } from '../types/android';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  files: AndroidFile[];
  onApplyCodeSnippet: (fileName: string, snippet: string) => void;
  targetFile?: AndroidFile | null;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  isOpen,
  onClose,
  files,
  onApplyCodeSnippet,
  targetFile,
}) => {
  const [requestText, setRequestText] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "Add a Voice Search button to activity_main.xml and SpeechRecognizer in MainActivity.kt",
    "Add Image input capabilities to send photos to Gemini Vision",
    "Refactor MainActivity.kt to use Jetpack Compose instead of XML ViewBinding",
    "Add a Chat History RecyclerView to activity_main.xml",
    "Implement Material 3 Dynamic Color thematic styling"
  ];

  const handleAskAssistant = async (customRequest?: string) => {
    const promptToUse = customRequest || requestText;
    if (!promptToUse.trim()) return;

    setIsLoading(true);
    setAiResponse(null);

    try {
      const currentFilesSummary = files.map(f => ({
        name: f.name,
        path: f.path,
        content: f.content.substring(0, 1000) // excerpt
      }));

      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request: promptToUse,
          currentFiles: currentFilesSummary,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setAiResponse(`Error: ${data.error}`);
      } else {
        setAiResponse(data.text);
      }
    } catch (err: any) {
      setAiResponse(`Failed to call AI Assistant: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Assistant Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <span>Gemini Android Developer Assistant</span>
                <span className="text-[10px] bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700">
                  AI Studio
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {targetFile ? `Context: ${targetFile.name}` : 'Ask for code improvements, feature additions or debugging.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {/* Quick Suggestions */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5 text-purple-400" /> Quick Enhancements:
            </label>
            <div className="flex flex-col gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setRequestText(qp);
                    handleAskAssistant(qp);
                  }}
                  className="text-left text-xs p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-200 hover:bg-purple-950/40 hover:border-purple-500/50 transition-colors flex items-center justify-between group"
                >
                  <span className="line-clamp-2">{qp}</span>
                  <Sparkles className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input Box */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <textarea
              rows={3}
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="Describe what you want to add or change in your Android app..."
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <button
              disabled={isLoading || !requestText.trim()}
              onClick={() => handleAskAssistant()}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-xs rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Asking Gemini AI...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Generate Code Advice</span>
                </>
              )}
            </button>
          </div>

          {/* AI Output Result */}
          {aiResponse && (
            <div className="p-4 bg-slate-950 rounded-lg border border-purple-500/30 text-xs text-slate-200 space-y-3 font-mono leading-relaxed">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="font-bold text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Recommendation
                </span>
              </div>
              <div className="whitespace-pre-wrap font-sans text-xs text-slate-300">
                {aiResponse}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
