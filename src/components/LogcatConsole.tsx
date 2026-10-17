import React, { useState } from 'react';
import { Terminal, Trash2, Download, Play, CheckCircle2, AlertTriangle, Bug } from 'lucide-react';
import { LogEntry, AndroidFile } from '../types/android';
import { exportProjectAsZip } from '../utils/projectExporter';

interface LogcatConsoleProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  files: AndroidFile[];
  addLog: (level: LogEntry['level'], tag: string, message: string) => void;
}

export const LogcatConsole: React.FC<LogcatConsoleProps> = ({
  logs,
  onClearLogs,
  files,
  addLog,
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStatus, setBuildStatus] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (filterLevel === 'ALL') return true;
    return log.level === filterLevel;
  });

  const handleSimulateGradleBuild = () => {
    setIsBuilding(true);
    setBuildStatus('Building Gradle project...');
    addLog('I', 'GradleBuild', 'Executing task :app:assembleDebug...');

    setTimeout(() => {
      addLog('I', 'GradleBuild', 'Configuring com.example.simpletestapp (compileSdk 34)...');
      addLog('I', 'GradleBuild', 'ViewBinding classes generated for activity_main.xml -> ActivityMainBinding.java');
    }, 400);

    setTimeout(() => {
      addLog('I', 'GradleBuild', 'Compiling Kotlin source files with GenerativeModel SDK...');
      addLog('I', 'GradleBuild', 'BUILD SUCCESSFUL in 1s (4 tasks executed)');
      setBuildStatus('BUILD SUCCESSFUL (0 errors)');
      setIsBuilding(false);
    }, 1200);
  };

  const handleDownloadZip = () => {
    addLog('I', 'ProjectExport', 'Exporting Android Studio project ZIP archive...');
    exportProjectAsZip(files, 'SimpleTestApp');
  };

  const getLevelBadgeColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'E':
        return 'bg-red-900/60 text-red-300 border-red-700/60';
      case 'W':
        return 'bg-amber-900/60 text-amber-300 border-amber-700/60';
      case 'I':
        return 'bg-blue-900/60 text-blue-300 border-blue-700/60';
      case 'D':
        return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
      {/* Console Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-2 border-b border-slate-800 text-slate-300">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">Logcat & Gradle Console</span>
          {buildStatus && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {buildStatus}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Level Filter */}
          <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[11px]">
            <span className="text-slate-500">Filter:</span>
            {['ALL', 'D', 'I', 'E'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  filterLevel === lvl
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            disabled={isBuilding}
            onClick={handleSimulateGradleBuild}
            className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded transition-colors text-xs font-medium shadow"
            title="Run Gradle Sync & Build Debug APK"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isBuilding ? 'Building...' : 'Gradle Sync'}</span>
          </button>

          <button
            onClick={handleDownloadZip}
            className="flex items-center space-x-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors text-xs font-medium shadow"
            title="Download complete Android Studio project as .zip"
          >
            <Download className="w-3 h-3" />
            <span>Export Zip</span>
          </button>

          <button
            onClick={onClearLogs}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Clear Logcat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Output Stream */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1.5 bg-slate-950 font-mono text-[11px] leading-relaxed">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 italic py-4 text-center">
            No logcat entries available. Submit prompts in the emulator to view live Android logs.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start space-x-2 py-0.5 border-b border-slate-900 hover:bg-slate-900/40 px-1 rounded transition-colors"
            >
              <span className="text-slate-500 shrink-0 text-[10px] pt-0.5">{log.timestamp}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0 ${getLevelBadgeColor(
                  log.level
                )}`}
              >
                {log.level}
              </span>
              <span className="text-purple-400 font-semibold shrink-0">{log.tag}:</span>
              <span className="text-slate-300 break-all">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
