import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Square, ArrowLeft } from 'lucide-react';
import { useSettings } from '../hooks/useSettings.tsx';
import PinkNoise from '../components/PinkNoise';
import RainNoise from '../components/RainNoise';
import OceanNoise from '../components/OceanNoise';
import WhiteNoise from '../components/WhiteNoise';
import BrownNoise from '../components/BrownNoise';

interface BreathingProtocol {
  name: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

const PROTOCOLS: BreathingProtocol[] = [
  { name: '4-4-4-4', inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  { name: '4-7-8-0', inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
];

const TIMER_OPTIONS = [
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '3 min', value: 180 },
];

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

const BreathingSession: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  // Initialize with saved settings
  const getInitialProtocol = (): BreathingProtocol => {
    if (settings.breathingPattern.type === 'custom') {
      return {
        name: 'Custom',
        inhale: settings.breathingPattern.inhale || 4,
        hold1: settings.breathingPattern.hold1 || 4,
        exhale: settings.breathingPattern.exhale || 4,
        hold2: settings.breathingPattern.hold2 || 4,
      };
    }
    return PROTOCOLS.find(p => p.name === settings.breathingPattern.type) || PROTOCOLS[0];
  };
  
  const [selectedProtocol, setSelectedProtocol] = useState<BreathingProtocol>(getInitialProtocol());
  const [customProtocol, setCustomProtocol] = useState<BreathingProtocol>(getInitialProtocol());
  const [isCustom, setIsCustom] = useState(settings.breathingPattern.type === 'custom');
  const [selectedTimer, setSelectedTimer] = useState(settings.duration * 60); // Convert minutes to seconds
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isBackgroundNoiseActive, setIsBackgroundNoiseActive] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const currentProtocol = isCustom ? customProtocol : selectedProtocol;

  const getPhaseLabel = (phase: Phase): string => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold';
    }
  };

  const getPhaseDuration = (phase: Phase): number => {
    return currentProtocol[phase];
  };

  const getNextPhase = (phase: Phase): Phase => {
    const phases: Phase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
    const currentIndex = phases.indexOf(phase);
    return phases[(currentIndex + 1) % phases.length];
  };

  const startSession = () => {
    setIsSessionActive(true);
    setTimeRemaining(selectedTimer);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    setTotalProgress(0);
    setIsBackgroundNoiseActive(true);
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    
    startPhase('inhale');
    startTimer();
  };

  const startPhase = (phase: Phase) => {
    const duration = getPhaseDuration(phase) * 1000;
    if (duration === 0) {
      // Skip phases with 0 duration
      const nextPhase = getNextPhase(phase);
      setCurrentPhase(nextPhase);
      startPhase(nextPhase);
      return;
    }

    let phaseStartTime = Date.now();
    
    phaseIntervalRef.current = setInterval(() => {
      if (isPaused) return;
      
      const elapsed = Date.now() - phaseStartTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setPhaseProgress(progress);
      
      if (progress >= 1) {
        const nextPhase = getNextPhase(phase);
        setCurrentPhase(nextPhase);
        startPhase(nextPhase);
      }
    }, 50);
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      if (isPaused) return;
      
      const elapsed = (Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000;
      const remaining = Math.max(selectedTimer - elapsed, 0);
      const progress = (selectedTimer - remaining) / selectedTimer;
      
      setTimeRemaining(remaining);
      setTotalProgress(progress);
      
      if (remaining <= 0) {
        endSession();
      }
    }, 100);
  };

  const pauseSession = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current);
    }
  };

  const resumeSession = () => {
    setIsPaused(false);
    const pauseEndTime = Date.now();
    pausedTimeRef.current += pauseEndTime - (startTimeRef.current + pausedTimeRef.current);
    startTimer();
    startPhase(currentPhase);
  };

  const endSession = () => {
    setIsSessionActive(false);
    setShowCompletion(true);
    setIsBackgroundNoiseActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current);
    }
    
    // Show completion toast
    setTimeout(() => {
      setShowCompletion(false);
      navigate('/checkin');
    }, 2000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingRingScale = (): number => {
    if (currentPhase === 'inhale') {
      return 0.5 + (phaseProgress * 0.5); // Scale from 0.5 to 1.0
    } else if (currentPhase === 'exhale') {
      return 1.0 - (phaseProgress * 0.5); // Scale from 1.0 to 0.5
    }
    return currentPhase === 'hold1' ? 1.0 : 0.5; // Hold at max or min
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
    };
  }, []);

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-forest-bg-1 flex items-center justify-center p-4">
        <div className="forest-card backdrop-blur-sm rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-2xl font-bold text-forest-text-primary mb-2">You did it!</h2>
          <p className="text-forest-text-secondary">Great job completing your breathing session.</p>
        </div>
      </div>
    );
  }

  if (isSessionActive) {
    return (
      <div className="min-h-screen bg-forest-bg-1 flex flex-col items-center justify-center p-4">
        {/* Header */}
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between items-center text-forest-text-secondary">
            <span className="text-lg font-medium">{currentProtocol.name}</span>
            <span className="text-lg font-mono">{formatTime(timeRemaining)}</span>
          </div>
          <div className="w-full bg-forest-bg-2 rounded-full h-2 mt-2">
            <div 
              className="bg-forest-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalProgress * 100}%` }}
            />
          </div>
        </div>

        {/* Breathing Ring */}
        <div className="relative mb-8">
          <div 
            className="w-64 h-64 rounded-full border-4 border-forest-accent/60 transition-transform duration-300 ease-in-out"
            style={{ 
              transform: `scale(${getBreathingRingScale()})`,
              boxShadow: `0 0 ${40 * getBreathingRingScale()}px rgba(139, 195, 74, 0.4)`
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-forest-text-primary mb-2">
                {getPhaseLabel(currentPhase)}
              </div>
              <div className="text-forest-accent">
                {getPhaseDuration(currentPhase)}s
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={isPaused ? resumeSession : pauseSession}
            className="forest-button p-4 rounded-full transition-colors"
          >
            {isPaused ? <Play size={24} /> : <Pause size={24} />}
          </button>
          <button
            onClick={endSession}
            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-colors"
          >
            <Square size={24} />
          </button>
        </div>

        {/* Background Noise Controls */}
        <div className="w-full max-w-md">
          {settings.backgroundNoise === 'rain' && (
            <RainNoise 
              isPlaying={isBackgroundNoiseActive && !isPaused}
              onPlayingChange={setIsBackgroundNoiseActive}
              className="w-full"
            />
          )}
          {settings.backgroundNoise === 'ocean' && (
            <OceanNoise 
              isPlaying={isBackgroundNoiseActive && !isPaused}
              onPlayingChange={setIsBackgroundNoiseActive}
              className="w-full"
            />
          )}
          {settings.backgroundNoise === 'pink' && (
            <PinkNoise 
              isPlaying={isBackgroundNoiseActive && !isPaused}
              onPlayingChange={setIsBackgroundNoiseActive}
              className="w-full"
            />
          )}
          {settings.backgroundNoise === 'white' && (
            <WhiteNoise 
              isPlaying={isBackgroundNoiseActive && !isPaused}
              onPlayingChange={setIsBackgroundNoiseActive}
              className="w-full"
            />
          )}
          {settings.backgroundNoise === 'brown' && (
            <BrownNoise 
              isPlaying={isBackgroundNoiseActive && !isPaused}
              onPlayingChange={setIsBackgroundNoiseActive}
              className="w-full"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest-bg-1 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-forest-text-secondary hover:text-forest-text-primary mr-4"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-forest-text-primary">Rescue Mode</h1>
        </div>

        {/* Protocol Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-forest-text-primary mb-3">Choose Protocol</h2>
          <div className="space-y-2">
            {PROTOCOLS.map((protocol) => (
              <button
                key={protocol.name}
                onClick={() => {
                  setSelectedProtocol(protocol);
                  setIsCustom(false);
                }}
                className={`w-full p-4 rounded-xl border transition-colors text-left ${
                  !isCustom && selectedProtocol.name === protocol.name
                    ? 'bg-forest-accent/30 border-forest-accent text-forest-text-primary'
                    : 'forest-card border-forest-bg-2 text-forest-text-secondary hover:bg-forest-bg-2'
                }`}
              >
                <div className="font-medium">{protocol.name}</div>
                <div className="text-sm opacity-80">
                  {protocol.inhale}-{protocol.hold1}-{protocol.exhale}-{protocol.hold2}
                </div>
              </button>
            ))}
            
            <button
              onClick={() => setIsCustom(true)}
              className={`w-full p-4 rounded-xl border transition-colors text-left ${
                isCustom
                  ? 'bg-forest-accent/30 border-forest-accent text-forest-text-primary'
                  : 'forest-card border-forest-bg-2 text-forest-text-secondary hover:bg-forest-bg-2'
              }`}
            >
              <div className="font-medium">Custom</div>
              <div className="text-sm opacity-80">Set your own timing</div>
            </button>
          </div>
        </div>

        {/* Custom Protocol Sliders */}
        {isCustom && (
          <div className="mb-6 p-4 forest-card rounded-xl border border-forest-bg-2">
            <h3 className="text-forest-text-primary font-medium mb-4">Custom Timing</h3>
            <div className="space-y-4">
              {(['inhale', 'hold1', 'exhale', 'hold2'] as const).map((phase) => (
                <div key={phase}>
                  <label className="block text-forest-text-secondary text-sm mb-2 capitalize">
                    {phase === 'hold1' ? 'Hold (after inhale)' : 
                     phase === 'hold2' ? 'Hold (after exhale)' : phase}: {customProtocol[phase]}s
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={customProtocol[phase]}
                    onChange={(e) => setCustomProtocol(prev => ({
                      ...prev,
                      [phase]: parseInt(e.target.value)
                    }))}
                    className="w-full h-2 bg-forest-bg-2 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timer Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-forest-text-primary mb-3">Session Length</h2>
          <div className="grid grid-cols-3 gap-2">
            {TIMER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedTimer(option.value)}
                className={`p-3 rounded-xl border transition-colors ${
                  selectedTimer === option.value
                    ? 'bg-forest-accent/30 border-forest-accent text-forest-text-primary'
                    : 'forest-card border-forest-bg-2 text-forest-text-secondary hover:bg-forest-bg-2'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Background Audio Preview */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-forest-text-primary mb-3">Background Audio</h2>
          <div className="p-4 forest-card rounded-xl border border-forest-bg-2">
            <div className="text-forest-text-primary font-medium mb-2">
              Selected: {settings.backgroundNoise.charAt(0).toUpperCase() + settings.backgroundNoise.slice(1)} Noise
            </div>
            <div className="text-sm text-forest-text-secondary">
              Volume: {settings.volume}%
            </div>
          </div>
          <p className="text-sm text-forest-text-secondary mt-2">
            Your selected background audio will automatically start when you begin your session.
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={startSession}
          className="w-full forest-button font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Play size={20} />
          Start Session
        </button>
      </div>
    </div>
  );
};

export default BreathingSession;