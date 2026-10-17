import React from 'react';
import { X, CheckCircle, Code, ShieldCheck, PlayCircle, Store, ExternalLink } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      title: 'Add Gemini SDK to build.gradle (Module: app)',
      icon: <Code className="w-4 h-4 text-purple-400" />,
      code: `dependencies {\n    implementation("com.google.ai.client:generativeai:0.7.0")\n}`,
    },
    {
      num: '2',
      title: 'Add Internet Permission in AndroidManifest.xml',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      code: `<uses-permission android:name="android.permission.INTERNET" />`,
    },
    {
      num: '3',
      title: 'Configure ViewBinding in build.gradle',
      icon: <Code className="w-4 h-4 text-blue-400" />,
      code: `android {\n    buildFeatures {\n        viewBinding true\n    }\n}`,
    },
    {
      num: '4',
      title: 'Test in Google AI Studio / Live Simulator',
      icon: <PlayCircle className="w-4 h-4 text-amber-400" />,
      desc: 'Get your Gemini API Key from Google AI Studio, paste into MainActivity.kt or set env vars, and run prompt tests instantly.',
    },
    {
      num: '5',
      title: 'Deploy to Google Play Store',
      icon: <Store className="w-4 h-4 text-rose-400" />,
      desc: 'In Android Studio: Build → Generate Signed Bundle / APK → Select Android App Bundle (.aab). Upload .aab to Google Play Console and Publish!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-100">Android Studio Integration & Play Store Checklist</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {steps.map((step) => (
            <div key={step.num} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-semibold text-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">
                    {step.num}
                  </span>
                  <span>{step.title}</span>
                </div>
                {step.icon}
              </div>

              {step.code && (
                <pre className="p-2.5 bg-slate-900 rounded-lg text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
                  {step.code}
                </pre>
              )}

              {step.desc && <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>}
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Got it, Back to Workbench
          </button>
        </div>
      </div>
    </div>
  );
};
