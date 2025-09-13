import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface WhiteNoiseProps {
  isPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  className?: string;
}

const WhiteNoise: React.FC<WhiteNoiseProps> = ({ 
  isPlaying = false, 
  onPlayingChange,
  className = '' 
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const whiteNoiseBufferRef = useRef<AudioBuffer | null>(null);

  // Generate white noise buffer
  const generateWhiteNoise = (audioContext: AudioContext, duration: number = 10): AudioBuffer => {
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < length; i++) {
        // Generate pure white noise - equal power across all frequencies
        channelData[i] = (Math.random() * 2 - 1) * 0.15; // Scale down the volume
      }
    }
    
    return buffer;
  };

  // Initialize audio context and white noise
  const initializeAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      if (!whiteNoiseBufferRef.current) {
        whiteNoiseBufferRef.current = generateWhiteNoise(audioContext);
      }
      
      if (!gainNodeRef.current) {
        gainNodeRef.current = audioContext.createGain();
        gainNodeRef.current.connect(audioContext.destination);
        gainNodeRef.current.gain.value = isMuted ? 0 : volume;
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize white noise audio:', error);
    }
  };

  // Start playing white noise
  const startWhiteNoise = async () => {
    if (!isInitialized) {
      await initializeAudio();
    }
    
    if (audioContextRef.current && whiteNoiseBufferRef.current && gainNodeRef.current) {
      // Stop existing source if any
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      }
      
      // Create new source
      sourceNodeRef.current = audioContextRef.current.createBufferSource();
      sourceNodeRef.current.buffer = whiteNoiseBufferRef.current;
      sourceNodeRef.current.loop = true;
      sourceNodeRef.current.connect(gainNodeRef.current);
      sourceNodeRef.current.start();
    }
  };

  // Stop playing white noise
  const stopWhiteNoise = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
  };

  // Handle play/pause
  const togglePlayback = async () => {
    const newPlaying = !isPlaying;
    
    if (newPlaying) {
      await startWhiteNoise();
    } else {
      stopWhiteNoise();
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
        await startWhiteNoise();
      } else {
        stopWhiteNoise();
      }
    };
    
    handlePlayback();
  }, [isPlaying, isInitialized]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWhiteNoise();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className={`flex items-center gap-3 p-3 forest-card rounded-lg ${className}`}>
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayback}
        className="forest-button px-3 py-2 rounded-md transition-colors"
        aria-label={isPlaying ? 'Stop white noise' : 'Start white noise'}
      >
        {isPlaying ? 'Stop' : 'Play'} White Noise
      </button>
      
      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="p-2 rounded-md bg-forest-bg-2 hover:bg-forest-accent/20 transition-colors"
        aria-label={isMuted ? 'Unmute white noise' : 'Mute white noise'}
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
};

export default WhiteNoise;