import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface PinkNoiseProps {
  isPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  className?: string;
}

const PinkNoise: React.FC<PinkNoiseProps> = ({ 
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
  const pinkNoiseBufferRef = useRef<AudioBuffer | null>(null);

  // Generate pink noise buffer
  const generatePinkNoise = (audioContext: AudioContext, duration: number = 10): AudioBuffer => {
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        channelData[i] = pink * 0.11; // Scale down the volume
      }
    }
    
    return buffer;
  };

  // Initialize audio context and pink noise
  const initializeAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      if (!pinkNoiseBufferRef.current) {
        pinkNoiseBufferRef.current = generatePinkNoise(audioContext);
      }
      
      if (!gainNodeRef.current) {
        gainNodeRef.current = audioContext.createGain();
        gainNodeRef.current.connect(audioContext.destination);
        gainNodeRef.current.gain.value = isMuted ? 0 : volume;
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  };

  // Start playing pink noise
  const startPinkNoise = async () => {
    if (!isInitialized) {
      await initializeAudio();
    }
    
    if (audioContextRef.current && pinkNoiseBufferRef.current && gainNodeRef.current) {
      // Stop existing source if any
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      }
      
      // Create new source
      sourceNodeRef.current = audioContextRef.current.createBufferSource();
      sourceNodeRef.current.buffer = pinkNoiseBufferRef.current;
      sourceNodeRef.current.loop = true;
      sourceNodeRef.current.connect(gainNodeRef.current);
      sourceNodeRef.current.start();
    }
  };

  // Stop playing pink noise
  const stopPinkNoise = () => {
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
      await startPinkNoise();
    } else {
      stopPinkNoise();
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
        await startPinkNoise();
      } else {
        stopPinkNoise();
      }
    };
    
    handlePlayback();
  }, [isPlaying, isInitialized]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPinkNoise();
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
        aria-label={isPlaying ? 'Stop pink noise' : 'Start pink noise'}
      >
        {isPlaying ? 'Stop' : 'Play'} Pink Noise
      </button>
      
      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="p-2 rounded-md bg-forest-bg-2 hover:bg-forest-accent/20 transition-colors"
        aria-label={isMuted ? 'Unmute pink noise' : 'Mute pink noise'}
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
                   [&::-moz-range-thumb]:bg-forest-accent [&::-moz-range-thumb]:border-0 
                   [&::-moz-range-thumb]:cursor-pointer"
          disabled={isMuted}
          aria-label="Pink noise volume"
        />
        <span className="text-xs text-forest-text-secondary min-w-[30px]">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
};

export default PinkNoise;