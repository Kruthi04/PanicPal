import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface BrownNoiseProps {
  isPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  className?: string;
}

const BrownNoise = forwardRef<{ stopBrownNoise: () => void }, BrownNoiseProps>(({ 
  isPlaying = false, 
  onPlayingChange,
  className = '' 
}, ref) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const brownNoiseBufferRef = useRef<AudioBuffer | null>(null);

  // Generate brown noise buffer (Brownian noise/red noise)
  const generateBrownNoise = (audioContext: AudioContext, duration: number = 10): AudioBuffer => {
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      let lastOut = 0;
      
      for (let i = 0; i < length; i++) {
        // Generate brown noise using integration of white noise
        // Brown noise has a -6dB/octave rolloff (power decreases with frequency squared)
        const white = Math.random() * 2 - 1;
        
        // Simple integration filter for brown noise
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        
        // Apply additional filtering to get the characteristic brown noise spectrum
        channelData[i] = lastOut * 3.5 * 0.15; // Scale and normalize
      }
    }
    
    return buffer;
  };

  // Initialize audio context and brown noise
  const initializeAudio = async () => {
    if (isInitialized) return;

    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context if suspended (required by some browsers)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Generate brown noise buffer
      brownNoiseBufferRef.current = generateBrownNoise(audioContextRef.current);
      
      // Create gain node for volume control
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize brown noise audio:', error);
    }
  };

  // Start playing brown noise
  const startBrownNoise = async () => {
    if (!isInitialized) {
      await initializeAudio();
    }

    if (audioContextRef.current && brownNoiseBufferRef.current && gainNodeRef.current && !sourceNodeRef.current) {
      sourceNodeRef.current = audioContextRef.current.createBufferSource();
      sourceNodeRef.current.buffer = brownNoiseBufferRef.current;
      sourceNodeRef.current.loop = true;
      sourceNodeRef.current.connect(gainNodeRef.current);
      sourceNodeRef.current.start();
    }
  };

  // Stop playing brown noise
  const stopBrownNoiseSound = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
  };

  // Stop brown noise function for parent component
  const stopBrownNoise = () => {
    stopBrownNoiseSound();
    onPlayingChange?.(false);
  };

  // Handle play/pause
  const togglePlayback = async () => {
    const newPlaying = !isPlaying;
    
    if (newPlaying) {
      await startBrownNoise();
    } else {
      stopBrownNoiseSound();
    }
    
    onPlayingChange?.(newPlaying);
  };

  // Handle mute/unmute
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newMuted ? 0 : volume;
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    
    if (gainNodeRef.current && !isMuted) {
      gainNodeRef.current.gain.value = newVolume;
    }
  };

  // Auto-start when isPlaying becomes true
  useEffect(() => {
    const handlePlayback = async () => {
      if (isPlaying) {
        await startBrownNoise();
      } else {
        stopBrownNoiseSound();
      }
    };
    
    handlePlayback();
  }, [isPlaying, isInitialized]);

  // Expose stop method to parent component
  useImperativeHandle(ref, () => ({
    stopBrownNoise
  }));

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBrownNoise();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {
          // Ignore errors if context is already closed
        });
      }
    };
  }, []);

  return (
    <div className={`flex items-center gap-3 p-3 forest-card rounded-lg ${className}`}>
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayback}
        className="forest-button px-3 py-2 rounded-md transition-colors"
        aria-label={isPlaying ? 'Stop brown noise' : 'Start brown noise'}
      >
        {isPlaying ? 'Stop' : 'Play'} Brown Noise
      </button>
      
      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="p-2 rounded-md bg-forest-bg-2 hover:bg-forest-accent/20 transition-colors"
        aria-label={isMuted ? 'Unmute brown noise' : 'Mute brown noise'}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-forest-text-secondary" />
        ) : (
          <Volume2 className="w-4 h-4 text-forest-text-primary" />
        )}
      </button>
      
      {/* Volume Slider */}
      <div className="flex items-center gap-2 min-w-[100px]">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-forest-bg-2 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                   [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                   [&::-webkit-slider-thumb]:bg-forest-accent [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
                   [&::-moz-range-thumb]:bg-forest-accent [&::-moz-range-thumb]:border-0"
        />
        <span className="text-xs text-forest-text-secondary min-w-[30px]">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
});

export default BrownNoise;