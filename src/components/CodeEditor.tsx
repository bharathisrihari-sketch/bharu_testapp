import React, { useState } from 'react';
import {
  FileCode,
  Layout,
  FileText,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Save,
  Code,
  Sparkles
} from 'lucide-react';
import { AndroidFile } from '../types/android';

interface CodeEditorProps {
  files: AndroidFile[];
  activeFileId: string;
  setActiveFileId: (id: string) => void;
  onUpdateFile: (id: string, newContent: string) => void;
  onResetFiles: () => void;
  openAiAssistantForFile: (file: AndroidFile) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFileId,
  setActiveFileId,
  onUpdateFile,
  onResetFiles,
  openAiAssistantForFile,
}) => {
  const activeFile = files.find(f => f.id === activeFileId) || files[0];
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  const getFileIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileCode':
        return <FileCode className="w-4 h-4 text-purple-400" />;
      case 'Layout':
        return <Layout className="w-4 h-4 text-emerald-400" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-blue-400" />;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = activeFile.content.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
      {/* File Tab Navigation Header */}
      <div className="flex items-center justify-between bg-slate-950 px-2 pt-2 border-b border-slate-800 overflow-x-auto">
        <div className="flex items-center space-x-1">
          {files.map((file) => {
            const isActive = file.id === activeFileId;
            return (
              <button
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs font-mono rounded-t-lg transition-colors border-t border-x ${
                  isActive
                    ? 'bg-slate-900 text-blue-400 border-slate-700 font-medium'
                    : 'bg-slate-950 text-slate-400 border-transparent hover:bg-slate-900/60 hover:text-slate-300'
                }`}
              >
                {getFileIcon(file.iconName)}
                <span>{file.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 pb-1.5 px-2">
          <button
            onClick={() => openAiAssistantForFile(activeFile)}
            className="flex items-center space-x-1.5 text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded transition-colors"
            title="Ask AI to improve this file"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Refactor File</span>
          </button>

          <button
            onClick={copyCode}
            className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1 rounded transition-colors"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          <button
            onClick={onResetFiles}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Reset All Files to Initial Prompt Template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Subheader & Path */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-2 truncate">
          <Code className="w-3.5 h-3.5 text-blue-400" />
          <span className="truncate">{activeFile.path}</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-slate-500">
          <span>{activeFile.language.toUpperCase()}</span>
          <span>{lineCount} lines</span>
        </div>
      </div>

      {/* Code Text Area with Line Numbers */}
      <div className="flex-1 relative font-mono text-xs overflow-hidden flex bg-slate-950">
        {/* Line Numbers Sidebar */}
        <div className="py-4 pl-3 pr-2 text-right text-slate-600 select-none bg-slate-950/80 border-r border-slate-800/60 min-w-[40px]">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Code Content Textarea */}
        <textarea
          value={activeFile.content}
          onChange={(e) => onUpdateFile(activeFile.id, e.target.value)}
          spellCheck={false}
          className="w-full h-full py-4 px-4 bg-transparent text-slate-200 leading-6 focus:outline-none resize-none font-mono selection:bg-blue-600/40"
        />
      </div>
    </div>
  );
};
