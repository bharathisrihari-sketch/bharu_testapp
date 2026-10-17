import React, { useState } from 'react';
import {
  Smartphone,
  Send,
  Sparkles,
  Copy,
  Check,
  RotateCw,
  Moon,
  Sun,
  Wifi,
  Battery,
  User,
  Zap,
  Info,
  Layers,
  Terminal,
  Clock,
  MessageSquare
} from 'lucide-react';
import { DeviceSettings, LogEntry, UserProfile } from '../types/android';

interface AndroidDeviceProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  deviceSettings: DeviceSettings;
  setDeviceSettings: React.Dispatch<React.SetStateAction<DeviceSettings>>;
  addLog: (level: LogEntry['level'], tag: string, message: string) => void;
  xmlContent: string;
}

export const AndroidDevice: React.FC<AndroidDeviceProps> = ({
  userProfile,
  setUserProfile,
  deviceSettings,
  setDeviceSettings,
  addLog,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const samplePrompts = [
    "Explain Kotlin Coroutines in 2 short sentences.",
    "What are the top 3 features of Gemini 3.8 Flash?",
    "Write a Android jetpack compose snippet for a card view.",
    "Give me 5 best practices for Android App security."
  ];

  const handleSendPrompt = async (textToSend?: string) => {
    const text = textToSend || promptInput;
    if (!text.trim()) return;

    setIsLoading(true);
    setResponseText('');
    setResponseTimeMs(null);

    const startTime = performance.now();
    addLog('D', 'MainActivity', `btnSend clicked with prompt: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
    addLog('I', 'GenerativeModel', `Sending generateContent request to Gemini API...`);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          modelName: userProfile.selectedModel,
        }),
      });

      const duration = Math.round(performance.now() - startTime);
      setResponseTimeMs(duration);

      const data = await res.json();

      if (data.error) {
        addLog('E', 'GenerativeModel', `Error: ${data.error}`);
        setResponseText(`Error: ${data.error}`);
      } else {
        addLog('I', 'GenerativeModel', `Response received in ${duration}ms (${data.text.length} chars)`);
        addLog('D', 'MainActivity', `textResponse.text updated successfully`);
        setResponseText(data.text);
      }
    } catch (err: any) {
      addLog('E', 'MainActivity', `Network request failed: ${err.message}`);
      setResponseText(`Network Error: ${err.message || 'Failed to reach backend'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!responseText) return;
    navigator.clipboard.writeText(responseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetActivity = () => {
    setPromptInput('');
    setResponseText('');
    setResponseTimeMs(null);
    addLog('I', 'MainActivity', 'Activity recreated / layout reset');
  };

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col items-center justify-start h-full p-2 md:p-4 bg-slate-900/50 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Emulator Control Bar */}
      <div className="w-full max-w-sm flex items-center justify-between px-3 py-2 bg-slate-800/90 rounded-lg text-slate-300 text-xs mb-3 border border-slate-700/60 shadow-sm">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="font-medium text-slate-200">Pixel 8 Pro Simulator</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setDeviceSettings(s => ({ ...s, darkMode: !s.darkMode }))}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-slate-200"
            title={deviceSettings.darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {deviceSettings.darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </button>

          <button
            onClick={() => setDeviceSettings(s => ({
              ...s,
              orientation: s.orientation === 'portrait' ? 'landscape' : 'portrait'
            }))}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-slate-200"
            title="Rotate Device"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetActivity}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-slate-200"
            title="Restart Android Activity"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          <button
            onClick={() => setShowProfileEdit(!showProfileEdit)}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-slate-200"
            title="Edit User Profile"
          >
            <User className="w-3.5 h-3.5 text-blue-400" />
          </button>
        </div>
      </div>

      {/* User Profile Config Popover */}
      {showProfileEdit && (
        <div className="w-full max-w-sm mb-3 p-3 bg-slate-800 rounded-lg border border-slate-700 text-xs space-y-2 text-slate-200 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center pb-1 border-b border-slate-700 font-semibold text-slate-300">
            <span>Configure User Profile</span>
            <button onClick={() => setShowProfileEdit(false)} className="text-slate-400 hover:text-slate-200">✕</button>
          </div>
          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Display Name (textTitle)</label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Email (textEmail)</label>
            <input
              type="text"
              value={userProfile.email}
              onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Gemini Model</label>
            <select
              value={userProfile.selectedModel}
              onChange={(e) => setUserProfile({ ...userProfile, selectedModel: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fastest)</option>
              <option value="gemini-4-argon">gemini-4-argon (Complex reasoning)</option>
            </select>
          </div>
        </div>
      )}

      {/* Outer Phone Chassis */}
      <div
        className={`relative transition-all duration-300 shadow-2xl rounded-[40px] border-[10px] border-slate-800 bg-slate-950 p-2 flex flex-col justify-between overflow-hidden ${
          deviceSettings.orientation === 'portrait'
            ? 'w-[320px] sm:w-[350px] h-[640px]'
            : 'w-[580px] h-[340px]'
        }`}
      >
        {/* Camera Punch Hole */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-30 ring-2 ring-slate-800 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
        </div>

        {/* Phone Screen Container */}
        <div
          className={`w-full h-full rounded-[30px] flex flex-col overflow-hidden relative transition-colors duration-200 ${
            deviceSettings.darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'
          }`}
        >
          {/* Android Status Bar */}
          <div className={`px-5 pt-2 pb-1 flex justify-between items-center text-[11px] font-medium z-20 ${
            deviceSettings.darkMode ? 'text-slate-300 bg-slate-900' : 'text-slate-700 bg-white'
          }`}>
            <span>{timeString}</span>
            <div className="flex items-center space-x-1.5">
              <Wifi className="w-3 h-3" />
              <span className="text-[10px]">5G</span>
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Android App Bar Header */}
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-blue-600 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                S
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-tight">SimpleTestApp</h1>
                <p className="text-[10px] text-blue-100 opacity-90">com.example.simpletestapp</p>
              </div>
            </div>
            <span className="text-[10px] bg-blue-700/70 text-blue-100 px-2 py-0.5 rounded-full font-mono">
              ViewBinding
            </span>
          </div>

          {/* Simulated App Screen (Representing activity_main.xml) */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-left">
            {/* User Title & Email Views */}
            <div className="space-y-1 bg-blue-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-blue-100/50 dark:border-slate-700/50">
              <h2 id="textTitle" className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {userProfile.name}
              </h2>
              <p id="textEmail" className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Email: {userProfile.email}
              </p>
            </div>

            {/* Prompt EditText Input */}
            <div className="space-y-1.5">
              <label htmlFor="inputPrompt" className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                inputPrompt (EditText)
              </label>
              <div className="relative">
                <textarea
                  id="inputPrompt"
                  rows={2}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Ask Gemini something..."
                  className={`w-full p-3 rounded-xl text-xs border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    deviceSettings.darkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
                {promptInput && (
                  <button
                    onClick={() => setPromptInput('')}
                    className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-slate-700/50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Quick Sample Prompts Pills */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Quick Android Prompts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPromptInput(sp);
                      handleSendPrompt(sp);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </div>

            {/* Send Button */}
            <div>
              <button
                id="btnSend"
                disabled={isLoading || !promptInput.trim()}
                onClick={() => handleSendPrompt()}
                className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs shadow-md flex items-center justify-center space-x-2 transition-all active:scale-[0.98] ${
                  isLoading || !promptInput.trim()
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Gemini is thinking...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Gemini</span>
                  </>
                )}
              </button>
            </div>

            {/* Response Area (textResponse TextView) */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-blue-500" /> textResponse (TextView)
                </span>
                {responseTimeMs !== null && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {responseTimeMs}ms
                  </span>
                )}
              </div>

              <div
                id="textResponse"
                className={`min-h-[120px] p-3.5 rounded-xl border text-xs leading-relaxed transition-all relative ${
                  deviceSettings.darkMode
                    ? 'bg-slate-800/80 border-slate-700 text-slate-100'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                {isLoading ? (
                  <div className="space-y-2 py-4">
                    <div className="flex items-center space-x-2 text-blue-500 text-xs font-medium animate-pulse">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>GenerativeModel.generateContent() in progress...</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse" />
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse" />
                  </div>
                ) : responseText ? (
                  <div className="space-y-2">
                    <div className="whitespace-pre-wrap font-sans">{responseText}</div>
                    <div className="pt-2 flex justify-end border-t border-slate-200/50 dark:border-slate-700/50">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center space-x-1 text-[10px] text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-1 rounded bg-slate-200/50 dark:bg-slate-700/50 transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Text</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">
                    Gemini response will appear here after clicking "Send to Gemini".
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Android Navigation Bar */}
          <div className={`py-1.5 px-8 flex justify-between items-center z-20 ${
            deviceSettings.darkMode ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-600'
          }`}>
            <div className="w-3 h-3 border-l-2 border-b-2 border-current rotate-45" />
            <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
            <div className="w-3 h-3 border-2 border-current rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
