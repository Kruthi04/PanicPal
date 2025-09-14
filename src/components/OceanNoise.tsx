import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface OceanNoiseProps {
  isPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  className?: string;
}

const OceanNoise = forwardRef<{ stopOcean: () => void }, OceanNoiseProps>(({ 
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
  const oceanBufferRef = useRef<AudioBuffer | null>(null);

  // Generate ocean wave sound buffer
  const generateOceanSound = (audioContext: AudioContext, duration: number = 10): AudioBuffer => {
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < length; i++) {
        const time = i / sampleRate;
        
        // Generate ocean wave sound using multiple sine waves and noise
        let sample = 0;
        
        // Low frequency wave motion (0.1-2 Hz)
        sample += Math.sin(2 * Math.PI * 0.3 * time) * 0.4;
        sample += Math.sin(2 * Math.PI * 0.7 * time) * 0.3;
        sample += Math.sin(2 * Math.PI * 1.2 * time) * 0.2;
        
        // Mid frequency for wave texture (20-200 Hz)
        sample += Math.sin(2 * Math.PI * 50 * time) * 0.1 * Math.sin(2 * Math.PI * 0.5 * time);
        sample += Math.sin(2 * Math.PI * 120 * time) * 0.08 * Math.sin(2 * Math.PI * 0.8 * time);
        
        // High frequency foam and bubbles (200-2000 Hz)
        const foamNoise = (Math.random() * 2 - 1) * 0.15;
        const foamFilter = Math.sin(2 * Math.PI * 0.2 * time) * 0.5 + 0.5;
        sample += foamNoise * foamFilter;
        
        // Add some wave crash effects
        if (Math.sin(2 * Math.PI * 0.15 * time) > 0.8) {
          sample += (Math.random() * 2 - 1) * 0.3 * Math.exp(-((time % (1/0.15)) * 10));
        }
        
        channelData[i] = sample * 0.2; // Scale down the volume
      }
    }
    
    return buffer;
  };

  // Initialize audio context and ocean sound
  const initializeAudio = async () => {
    if (isInitialized) return;

    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context if suspended (required by some browsers)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Generate ocean sound buffer
      oceanBufferRef.current = generateOceanSound(audioContextRef.current);
      
      // Create gain node for volume control
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize ocean audio:', error);
    }
  };

  // Start playing ocean sound
  const startOceanSound = async () => {
    if (!isInitialized) {
      await initializeAudio();
    }
    
    if (audioContextRef.current && oceanBufferRef.current && gainNodeRef.current) {
      // Stop existing source if any
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      }
      
      // Create new source
      sourceNodeRef.current = audioContextRef.current.createBufferSource();
      sourceNodeRef.current.buffer = oceanBufferRef.current;
      sourceNodeRef.current.loop = true;
      sourceNodeRef.current.connect(gainNodeRef.current);
      sourceNodeRef.current.start();
    }
  };

  // Stop playing ocean sound
  const stopOceanSound = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
  };

  // Stop ocean function for parent component
  const stopOcean = () => {
    stopOceanSound();
    onPlayingChange?.(false);
  };

  // Handle play/pause
  const togglePlayback = async () => {
    const newPlaying = !isPlaying;
    
    if (newPlaying) {
      await startOceanSound();
    } else {
      stopOceanSound();
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
        await startOceanSound();
      } else {
        stopOceanSound();
      }
    };
    
    handlePlayback();
  }, [isPlaying, isInitialized]);

  // Expose stop method to parent component
  useImperativeHandle(ref, () => ({
    stopOcean
  }));

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopOcean();
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
        aria-label={isPlaying ? 'Stop ocean sound' : 'Start ocean sound'}
      >
        {isPlaying ? 'Stop' : 'Play'} Ocean
      </button>
      
      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="p-2 rounded-md bg-forest-bg-2 hover:bg-forest-accent/20 transition-colors"
        aria-label={isMuted ? 'Unmute ocean sound' : 'Mute ocean sound'}
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

export default OceanNoise;