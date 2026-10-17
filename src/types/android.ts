export interface AndroidFile {
  id: string;
  name: string;
  path: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'markdown' | 'json';
  content: string;
  iconName: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'D' | 'I' | 'W' | 'E' | 'V';
  tag: string;
  message: string;
}

export interface UserProfile {
  name: string;
  email: string;
  apiKey: string;
  selectedModel: string;
}

export interface DeviceSettings {
  orientation: 'portrait' | 'landscape';
  darkMode: boolean;
  accentColor: string;
  showStatusBar: boolean;
  batteryLevel: number;
}
