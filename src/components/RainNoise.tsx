import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface RainNoiseProps {
  isPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  className?: string;
}

const RainNoise = forwardRef<{ stopRain: () => void }, RainNoiseProps>(({ 
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
  const rainBufferRef = useRef<AudioBuffer | null>(null);

  // Generate rain sound buffer
  const generateRainSound = (audioContext: AudioContext, duration: number = 10): AudioBuffer => {
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < length; i++) {
        // Generate rain-like sound using filtered white noise
        let sample = 0;
        
        // Multiple layers of filtered noise to simulate rain drops
        for (let j = 0; j < 8; j++) {
          const frequency = 200 + j * 300; // Different frequency bands
          const phase = (i * frequency * 2 * Math.PI) / sampleRate;
          const noise = (Math.random() * 2 - 1) * Math.exp(-j * 0.3);
          sample += noise * Math.sin(phase) * 0.1;
        }
        
        // Add some randomness for rain drop effect
        if (Math.random() < 0.02) {
          sample += (Math.random() * 2 - 1) * 0.3;
        }
        
        channelData[i] = sample * 0.15; // Scale down the volume
      }
    }
    
    return buffer;
  };

  // Initialize audio context and generate rain sound
  const initializeAudio = async () => {
    if (isInitialized) return;

    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context if suspended (required by some browsers)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Generate rain sound buffer
      rainBufferRef.current = generateRainSound(audioContextRef.current);
      
      // Create gain node for volume control
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize rain audio:', error);
    }
  };

  // Start rain sound
  const startRainSound = async () => {
    if (!isInitialized) {
      await initializeAudio();
    }

    if (audioContextRef.current && rainBufferRef.current && gainNodeRef.current && !sourceNodeRef.current) {
      sourceNodeRef.current = audioContextRef.current.createBufferSource();
      sourceNodeRef.current.buffer = rainBufferRef.current;
      sourceNodeRef.current.loop = true;
      sourceNodeRef.current.connect(gainNodeRef.current);
      sourceNodeRef.current.start();
    }
  };

  // Stop playing rain sound
  const stopRainSound = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
  };

  // Stop rain function for parent component
  const stopRain = () => {
    stopRainSound();
    onPlayingChange?.(false);
  };

  // Handle play/pause
  const togglePlayback = async () => {
    const newPlaying = !isPlaying;
    
    try {
      if (newPlaying) {
        await startRainSound();
      } else {
        stopRainSound();
      }
      
      onPlayingChange?.(newPlaying);
    } catch (error) {
      console.error('Error toggling rain sound:', error);
    }
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
        await startRainSound();
      } else {
        stopRainSound();
      }
    };
    
    handlePlayback();
  }, [isPlaying, isInitialized]);

  // Expose stop method to parent component
  useImperativeHandle(ref, () => ({
    stopRain
  }));

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRain();
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
        aria-label={isPlaying ? 'Stop rain sound' : 'Start rain sound'}
      >
        {isPlaying ? 'Stop' : 'Play'} Rain
      </button>
      
      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="p-2 rounded-md bg-forest-bg-2 hover:bg-forest-accent/20 transition-colors"
        aria-label={isMuted ? 'Unmute rain sound' : 'Mute rain sound'}
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

export default RainNoise;