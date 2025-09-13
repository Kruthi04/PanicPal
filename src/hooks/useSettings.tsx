import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BreathingPattern {
  type: '4-4-4-4' | '4-7-8-0' | 'custom';
  inhale?: number;
  hold1?: number;
  exhale?: number;
  hold2?: number;
}

export interface UserSettings {
  duration: number;
  breathingPattern: BreathingPattern;
  backgroundNoise: string;
  volume: number;
  theme: string;
}

const defaultSettings: UserSettings = {
  duration: 5,
  breathingPattern: { type: '4-4-4-4' },
  backgroundNoise: 'rain',
  volume: 50,
  theme: 'forest'
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetSettings: () => void;
  saveSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('panicpal-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const saveSettings = () => {
    localStorage.setItem('panicpal-settings', JSON.stringify(settings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('panicpal-settings');
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      resetSettings,
      saveSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};