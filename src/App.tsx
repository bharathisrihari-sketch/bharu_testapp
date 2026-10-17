/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Smartphone,
  Code2,
  Terminal,
  Download,
  BookOpen,
  Sparkles,
  Layers,
  Cpu,
  User,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { AndroidFile, DeviceSettings, LogEntry, UserProfile } from './types/android';
import { INITIAL_FILES } from './data/defaultProject';
import { AndroidDevice } from './components/AndroidDevice';
import { CodeEditor } from './components/CodeEditor';
import { LogcatConsole } from './components/LogcatConsole';
import { AiAssistant } from './components/AiAssistant';
import { GuideModal } from './components/GuideModal';
import { exportProjectAsZip } from './utils/projectExporter';

export default function App() {
  const [files, setFiles] = useState<AndroidFile[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState<string>('main-activity');

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Hello, Bharathi Purushothaman',
    email: 'bharathi.srihari@gmail.com',
    apiKey: 'YOUR_GEMINI_API_KEY',
    selectedModel: 'gemini-3.8-flash',
  });

  const [deviceSettings, setDeviceSettings] = useState<DeviceSettings>({
    orientation: 'portrait',
    darkMode: false,
    accentColor: '#2563EB',
    showStatusBar: true,
    batteryLevel: 98,
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'I',
      tag: 'System.out',
      message: 'Android Studio project initialized for com.example.simpletestapp',
    },
    {
      id: 'log-2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'D',
      tag: 'MainActivity',
      message: 'ViewBinding activity_main layout inflated for user Bharathi Purushothaman',
    },
    {
      id: 'log-3',
      timestamp: new Date().toLocaleTimeString(),
      level: 'I',
      tag: 'GenerativeModel',
      message: 'GenerativeModel com.google.ai.client:generativeai ready on Dispatchers.Main',
    },
  ]);

  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [targetFileForAi, setTargetFileForAi] = useState<AndroidFile | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const addLog = (level: LogEntry['level'], tag: string, message: string) => {
    const newEntry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      level,
      tag,
      message,
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 99)]);
  };

  const handleUpdateFile = (id: string, newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, content: newContent } : f))
    );
  };

  const handleResetFiles = () => {
    setFiles(INITIAL_FILES);
    addLog('I', 'AndroidStudio', 'Project files reset to initial prompt template');
  };

  const handleApplyCodeSnippet = (fileName: string, snippet: string) => {
    const fileToUpdate = files.find((f) => f.name.toLowerCase().includes(fileName.toLowerCase()));
    if (fileToUpdate) {
      handleUpdateFile(fileToUpdate.id, snippet);
      addLog('I', 'AIAssistant', `Applied code updates to ${fileToUpdate.name}`);
    }
  };

  const openAiAssistantForFile = (file: AndroidFile) => {
    setTargetFileForAi(file);
    setIsAiAssistantOpen(true);
  };

  const activeXml = files.find((f) => f.id === 'activity-main-xml')?.content || '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-white">
      {/* App Navigation Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-white tracking-wide">Android Studio Gemini App Workbench</h1>
              <span className="text-[10px] bg-blue-900/60 text-blue-300 border border-blue-700/60 px-2 py-0.5 rounded-full font-mono">
                Kotlin & Gemini API
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              com.example.simpletestapp • User: <span className="text-slate-200 font-medium">{userProfile.email}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Play Store Guide</span>
          </button>

          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition-colors shadow-md shadow-purple-500/20"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Developer Assistant</span>
          </button>

          <button
            onClick={() => exportProjectAsZip(files, 'SimpleTestApp')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-md shadow-blue-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export Project (.zip)</span>
          </button>
        </div>
      </header>

      {/* Main Grid Workbench Layout */}
      <main className="flex-1 p-3 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1800px] w-full mx-auto overflow-hidden">
        {/* Left Column: Interactive Android Device Emulator */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col h-[780px]">
          <AndroidDevice
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            deviceSettings={deviceSettings}
            setDeviceSettings={setDeviceSettings}
            addLog={addLog}
            xmlContent={activeXml}
          />
        </div>

        {/* Right Column: Code Editor & Logcat Console */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col space-y-4 h-[780px]">
          {/* Top: Code Editor */}
          <div className="flex-1 min-h-[460px]">
            <CodeEditor
              files={files}
              activeFileId={activeFileId}
              setActiveFileId={setActiveFileId}
              onUpdateFile={handleUpdateFile}
              onResetFiles={handleResetFiles}
              openAiAssistantForFile={openAiAssistantForFile}
            />
          </div>

          {/* Bottom: Logcat & Gradle Terminal */}
          <div className="h-[280px]">
            <LogcatConsole
              logs={logs}
              onClearLogs={() => setLogs([])}
              files={files}
              addLog={addLog}
            />
          </div>
        </div>
      </main>

      {/* AI Assistant Modal */}
      <AiAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        files={files}
        onApplyCodeSnippet={handleApplyCodeSnippet}
        targetFile={targetFileForAi}
      />

      {/* Play Store & Testing Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
