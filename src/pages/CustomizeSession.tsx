import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Clock, Volume2, Palette, Save, RotateCcw, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSettings } from '../hooks/useSettings.tsx';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import RainNoise from '../components/RainNoise';
import OceanNoise from '../components/OceanNoise';
import WhiteNoise from '../components/WhiteNoise';
import BrownNoise from '../components/BrownNoise';
import PinkNoise from '../components/PinkNoise';

export default function CustomizeSession() {
  const { settings, updateSettings, saveSettings, resetSettings } = useSettings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);
  const audioComponents = useRef<{[key: string]: any}>({});
  
  // Local state for form inputs
  const [duration, setDuration] = useState(settings.duration);
  const [breathingPattern, setBreathingPattern] = useState<'4-4-4-4' | '4-7-8-0' | 'custom'>(settings.breathingPattern.type);
  const [backgroundNoise, setBackgroundNoise] = useState(settings.backgroundNoise);
  const [volume, setVolume] = useState(settings.volume);
  const [theme, setTheme] = useState(settings.theme);
  const [customInhale, setCustomInhale] = useState(settings.breathingPattern.inhale || 4);
  const [customHold1, setCustomHold1] = useState(settings.breathingPattern.hold1 || 4);
  const [customExhale, setCustomExhale] = useState(settings.breathingPattern.exhale || 4);
  const [customHold2, setCustomHold2] = useState(settings.breathingPattern.hold2 || 4);

  // Update local state when settings change
  useEffect(() => {
    setDuration(settings.duration);
    setBreathingPattern(settings.breathingPattern.type);
    setBackgroundNoise(settings.backgroundNoise);
    setVolume(settings.volume);
    setTheme(settings.theme);
    setCustomInhale(settings.breathingPattern.inhale || 4);
    setCustomHold1(settings.breathingPattern.hold1 || 4);
    setCustomExhale(settings.breathingPattern.exhale || 4);
    setCustomHold2(settings.breathingPattern.hold2 || 4);
  }, [settings]);

  const handleSave = () => {
    const newSettings = {
      duration,
      breathingPattern: breathingPattern === 'custom' ? {
        type: 'custom' as const,
        inhale: customInhale,
        hold1: customHold1,
        exhale: customExhale,
        hold2: customHold2
      } : { type: breathingPattern as '4-4-4-4' | '4-7-8-0' },
      backgroundNoise,
      volume,
      theme
    };
    
    updateSettings(newSettings);
    saveSettings();
    console.log('Settings saved:', newSettings);
    
    // Navigate to breathing session to start with the saved settings
    navigate('/breathing-session');
  };

  const handleReset = () => {
    resetSettings();
    console.log('Settings reset to defaults');
  };

  return (
    <div className="min-h-screen bg-forest-bg-1">
      {/* Header */}
      <header className="bg-forest-bg-2/50 backdrop-blur-sm border-b border-forest-bg-2 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center text-forest-text-secondary hover:text-forest-text-primary transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-forest-accent to-forest-seafoam rounded-full mr-3">
                  <Settings className="w-6 h-6 text-forest-bg-1" />
                </div>
                <h1 className="text-xl font-bold text-forest-text-primary font-poppins">Customize Panic Session</h1>
              </div>
            </div>
            {user && <Navigation />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-forest-text-primary mb-4 font-poppins">
            Personalize Your Experience
          </h2>
          <p className="text-forest-text-secondary font-inter max-w-2xl mx-auto">
            Customize your panic relief session to match your preferences and needs for the most effective calming experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Settings */}
          <div className="space-y-6">
            {/* Session Duration */}
            <div className="forest-card p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-5 h-5 text-forest-accent mr-2" />
                <h3 className="text-lg font-semibold text-forest-text-primary font-poppins">Session Duration</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-forest-text-secondary font-inter">Duration: {duration} minutes</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-forest-bg-2 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-forest-text-secondary font-inter">
                  <span>1 min</span>
                  <span>20 min</span>
                </div>
              </div>
            </div>

            {/* Breathing Pattern */}
            <div className="forest-card p-6">
              <h3 className="text-lg font-semibold text-forest-text-primary mb-4 font-poppins">Breathing Pattern</h3>
              <div className="space-y-2">
                {[
                  { value: '4-4-4-4', label: '4-4-4-4 Box Breathing', desc: 'Inhale 4, Hold 4, Exhale 4, Hold 4' },
                  { value: '4-7-8-0', label: '4-7-8 Technique', desc: 'Inhale 4, Hold 7, Exhale 8' },
                  { value: 'custom', label: 'Custom Pattern', desc: 'Set your own timing' }
                ].map((pattern) => (
                  <label key={pattern.value} className="flex items-center p-3 bg-forest-bg-2/30 rounded-xl hover:bg-forest-bg-2/50 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="breathingPattern"
                      value={pattern.value}
                      checked={breathingPattern === pattern.value}
                      onChange={(e) => setBreathingPattern(e.target.value as '4-4-4-4' | '4-7-8-0' | 'custom')}
                      className="mr-3 text-forest-accent"
                    />
                    <div>
                      <div className="font-semibold text-forest-text-primary font-inter">{pattern.label}</div>
                      <div className="text-sm text-forest-text-secondary font-inter">{pattern.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              
              {/* Custom Pattern Inputs */}
              {breathingPattern === 'custom' && (
                <div className="mt-4 p-4 bg-forest-bg-2/20 rounded-xl">
                  <h4 className="text-sm font-semibold text-forest-text-primary mb-3 font-inter">Custom Breathing Pattern</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-forest-text-secondary mb-1 font-inter">Inhale (seconds)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={customInhale}
                        onChange={(e) => setCustomInhale(parseInt(e.target.value))}
                        className="w-full p-2 bg-forest-bg-2/30 border border-forest-bg-2 rounded-lg text-forest-text-primary font-inter focus:outline-none focus:ring-2 focus:ring-forest-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-forest-text-secondary mb-1 font-inter">Hold 1 (seconds)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={customHold1}
                        onChange={(e) => setCustomHold1(parseInt(e.target.value))}
                        className="w-full p-2 bg-forest-bg-2/30 border border-forest-bg-2 rounded-lg text-forest-text-primary font-inter focus:outline-none focus:ring-2 focus:ring-forest-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-forest-text-secondary mb-1 font-inter">Exhale (seconds)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={customExhale}
                        onChange={(e) => setCustomExhale(parseInt(e.target.value))}
                        className="w-full p-2 bg-forest-bg-2/30 border border-forest-bg-2 rounded-lg text-forest-text-primary font-inter focus:outline-none focus:ring-2 focus:ring-forest-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-forest-text-secondary mb-1 font-inter">Hold 2 (seconds)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={customHold2}
                        onChange={(e) => setCustomHold2(parseInt(e.target.value))}
                        className="w-full p-2 bg-forest-bg-2/30 border border-forest-bg-2 rounded-lg text-forest-text-primary font-inter focus:outline-none focus:ring-2 focus:ring-forest-accent"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-forest-text-secondary font-inter text-center">
                    Pattern: {customInhale}-{customHold1}-{customExhale}-{customHold2}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Settings */}
            <div className="forest-card p-6">
              <div className="flex items-center mb-4">
                <Volume2 className="w-5 h-5 text-forest-accent mr-2" />
                <h3 className="text-lg font-semibold text-forest-text-primary font-poppins">Audio Settings</h3>
              </div>
              
              {/* Background Noise */}
              <div className="mb-4">
                <label className="block text-forest-text-primary font-semibold mb-3 font-inter">Background Noise</label>
                <div className="space-y-2">
                  {[
                    { value: 'rain', label: 'Rain', desc: 'Gentle rainfall sounds' },
                    { value: 'ocean', label: 'Ocean', desc: 'Calming ocean waves' },
                    { value: 'pink', label: 'Pink Noise', desc: 'Balanced frequency noise' },
                    { value: 'white', label: 'White Noise', desc: 'Full spectrum noise' },
                    { value: 'brown', label: 'Brown Noise', desc: 'Deep, low-frequency noise' }
                  ].map((noise) => {
                    const isPlaying = previewPlaying === noise.value;
                    
                    return (
                      <div key={noise.value} className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-forest-bg-2/30 rounded-xl hover:bg-forest-bg-2/50 transition-colors">
                          <label className="flex items-center cursor-pointer flex-1">
                            <input
                              type="radio"
                              name="backgroundNoise"
                              value={noise.value}
                              checked={backgroundNoise === noise.value}
                              onChange={(e) => setBackgroundNoise(e.target.value)}
                              className="mr-3 text-forest-accent"
                            />
                            <div>
                              <div className="font-semibold text-forest-text-primary font-inter">{noise.label}</div>
                              <div className="text-sm text-forest-text-secondary font-inter">{noise.desc}</div>
                            </div>
                          </label>
                          <button
                            onClick={() => {
                              if (isPlaying) {
                                console.log(`Stopping ${noise.value} noise`);
                                setPreviewPlaying(null);
                              } else {
                                console.log(`Starting ${noise.value} noise`);
                                // Stop all other audio before starting new one
                                Object.entries(audioComponents.current).forEach(([key, component]) => {
                                  if (key !== noise.value && component) {
                                    // Call the specific stop method for each component type
                                    if (key === 'rain' && component.stopRain) {
                                      component.stopRain();
                                    } else if (key === 'ocean' && component.stopOcean) {
                                      component.stopOcean();
                                    } else if (key === 'pink' && component.stopPinkNoise) {
                                      component.stopPinkNoise();
                                    } else if (key === 'white' && component.stopWhiteNoise) {
                                      component.stopWhiteNoise();
                                    } else if (key === 'brown' && component.stopBrownNoise) {
                                      component.stopBrownNoise();
                                    }
                                  }
                                });
                                setPreviewPlaying(noise.value);
                              }
                            }}
                            className={`ml-3 p-2 rounded-lg transition-colors ${
                              isPlaying 
                                ? 'bg-forest-accent text-white' 
                                : 'bg-forest-accent/20 hover:bg-forest-accent/30 text-forest-accent'
                            }`}
                            aria-label={`${isPlaying ? 'Stop' : 'Preview'} ${noise.label}`}
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Audio Component for Preview */}
                        {isPlaying && (
                          <div className="ml-6">
                            {noise.value === 'rain' && (
                              <RainNoise 
                                isPlaying={true} 
                                onPlayingChange={(playing) => !playing && setPreviewPlaying(null)}
                                className="bg-forest-bg-2/50"
                                ref={(ref) => { audioComponents.current.rain = ref; }}
                              />
                            )}
                            {noise.value === 'ocean' && (
                              <OceanNoise 
                                isPlaying={true} 
                                onPlayingChange={(playing) => !playing && setPreviewPlaying(null)}
                                className="bg-forest-bg-2/50"
                                ref={(ref) => { audioComponents.current.ocean = ref; }}
                              />
                            )}
                            {noise.value === 'pink' && (
                              <PinkNoise 
                                isPlaying={true} 
                                onPlayingChange={(playing) => !playing && setPreviewPlaying(null)}
                                className="bg-forest-bg-2/50"
                                ref={(ref) => { audioComponents.current.pink = ref; }}
                              />
                            )}
                            {noise.value === 'white' && (
                              <WhiteNoise 
                                isPlaying={true} 
                                onPlayingChange={(playing) => !playing && setPreviewPlaying(null)}
                                className="bg-forest-bg-2/50"
                                ref={(ref) => { audioComponents.current.white = ref; }}
                              />
                            )}
                            {noise.value === 'brown' && (
                              <BrownNoise 
                                isPlaying={true} 
                                onPlayingChange={(playing) => !playing && setPreviewPlaying(null)}
                                className="bg-forest-bg-2/50"
                                ref={(ref) => { audioComponents.current.brown = ref; }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Volume Control */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-forest-text-primary font-semibold font-inter">Volume</label>
                  <span className="text-forest-text-secondary font-inter">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full h-2 bg-forest-bg-2 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Visual Settings & Preview */}
          <div className="space-y-6">
            {/* Visual Theme */}
            <div className="forest-card p-6">
              <div className="flex items-center mb-4">
                <Palette className="w-5 h-5 text-forest-accent mr-2" />
                <h3 className="text-lg font-semibold text-forest-text-primary font-poppins">Visual Theme</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'forest-night', label: 'Forest Night', color: 'from-forest-accent to-forest-seafoam' },
                  { value: 'ocean-blue', label: 'Ocean Blue', color: 'from-blue-500 to-blue-600' },
                  { value: 'sunset-warm', label: 'Sunset Warm', color: 'from-orange-500 to-pink-500' },
                  { value: 'minimal-dark', label: 'Minimal Dark', color: 'from-gray-700 to-gray-800' }
                ].map((themeOption) => (
                  <button
                    key={themeOption.value}
                    onClick={() => setTheme(themeOption.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === themeOption.value
                        ? 'border-forest-accent bg-forest-accent/10'
                        : 'border-forest-bg-2 bg-forest-bg-2/30 hover:bg-forest-bg-2/50'
                    }`}
                  >
                    <div className={`w-full h-8 bg-gradient-to-r ${themeOption.color} rounded-lg mb-2`}></div>
                    <div className="text-sm font-semibold text-forest-text-primary font-inter">{themeOption.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Session Preview */}
            <div className="forest-card p-6">
              <h3 className="text-lg font-semibold text-forest-text-primary mb-4 font-poppins">Session Preview</h3>
              <div className="bg-forest-bg-2/30 rounded-xl p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-forest-accent to-forest-seafoam rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-white/30 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="text-forest-text-primary font-semibold font-inter">{duration} Minute Session</div>
                  <div className="text-sm text-forest-text-secondary font-inter">
                    {breathingPattern === 'custom' 
                      ? `${customInhale}-${customHold1}-${customExhale}-${customHold2} Pattern`
                      : `${breathingPattern.toUpperCase()} Pattern`
                    }
                  </div>
                  <div className="text-sm text-forest-text-secondary font-inter">
                    {backgroundNoise.charAt(0).toUpperCase() + backgroundNoise.slice(1)} Noise
                  </div>
                  <div className="text-xs text-forest-accent font-inter">Volume: {volume}%</div>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="forest-card p-6">
              <h3 className="text-lg font-semibold text-forest-text-primary mb-4 font-poppins">Quick Presets</h3>
              <div className="space-y-2">
                <button className="w-full p-3 bg-forest-bg-2/30 hover:bg-forest-bg-2/50 rounded-xl text-left transition-colors">
                  <div className="font-semibold text-forest-text-primary font-inter">Quick Relief (2 min)</div>
                  <div className="text-sm text-forest-text-secondary font-inter">Fast anxiety relief session</div>
                </button>
                <button className="w-full p-3 bg-forest-bg-2/30 hover:bg-forest-bg-2/50 rounded-xl text-left transition-colors">
                  <div className="font-semibold text-forest-text-primary font-inter">Deep Calm (10 min)</div>
                  <div className="text-sm text-forest-text-secondary font-inter">Extended relaxation session</div>
                </button>
                <button className="w-full p-3 bg-forest-bg-2/30 hover:bg-forest-bg-2/50 rounded-xl text-left transition-colors">
                  <div className="font-semibold text-forest-text-primary font-inter">Sleep Prep (15 min)</div>
                  <div className="text-sm text-forest-text-secondary font-inter">Prepare for restful sleep</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={handleReset}
            className="flex items-center bg-forest-bg-2/50 hover:bg-forest-card/50 text-forest-text-primary font-semibold py-3 px-6 rounded-2xl border-2 border-forest-bg-2 transition-colors backdrop-blur-sm font-inter"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="flex items-center forest-button font-inter font-semibold py-3 px-8 shadow-card"
          >
            <Save className="w-5 h-5 mr-2" />
            Save & Start Session
          </button>
        </div>

        {/* Quick Actions */}
        <div className="text-center mt-6">
          <Link 
            to="/breathing-session" 
            className="text-forest-accent hover:text-forest-seafoam transition-colors font-inter font-semibold"
          >
            Or start a standard breathing session →
          </Link>
        </div>
      </div>
    </div>
  );
}