import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  track: {
    id: string;
    title: string;
    artist: string;
    artwork: string;
    duration: number;
    src: string;
  };
  isVisible: boolean;
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ track, isVisible, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
      setIsPlaying(false);
      console.error('Audio failed to load:', track.src);
    };
    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
    };
    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [track.src]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to play audio:', error);
        setHasError(true);
        setIsPlaying(false);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * track.duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (!audio) return;

    setVolume(newVolume);
    audio.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / track.duration) * 100;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-forest-card border-t border-forest-bg-2 shadow-card z-50">
      <audio ref={audioRef} src={track.src} />
      
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Track Info with Circular Artwork */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-forest-accent to-forest-seafoam p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-forest-bg-1">
                  <img 
                    src={track.artwork} 
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Rotating animation when playing */}
              {isPlaying && (
                <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-forest-accent animate-spin" 
                     style={{ animationDuration: '3s' }} />
              )}
            </div>
            
            <div>
              <h4 className="text-forest-text-primary font-medium font-inter">{track.title}</h4>
              <p className="text-forest-text-secondary text-sm">{track.artist}</p>
              {hasError && (
                <p className="text-red-500 text-sm mt-2">
                  Failed to load audio. Please check your internet connection or try a different track.
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-forest-text-secondary hover:text-forest-text-primary transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button 
              onClick={togglePlay}
              disabled={hasError || isLoading}
              className={`p-3 rounded-full transition-colors shadow-soft ${
                hasError || isLoading 
                  ? 'bg-forest-text-secondary cursor-not-allowed' 
                  : 'bg-forest-accent hover:bg-forest-seafoam'
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-forest-bg-1 border-t-transparent rounded-full animate-spin" />
              ) : hasError ? (
                <svg className="w-6 h-6 text-forest-bg-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              ) : isPlaying ? (
                <Pause className="w-6 h-6 text-forest-bg-1" />
              ) : (
                <Play className="w-6 h-6 text-forest-bg-1 ml-0.5" />
              )}
            </button>
            
            <button className="p-2 text-forest-text-secondary hover:text-forest-text-primary transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar (Waveform Style) */}
          <div className="flex-1 mx-8">
            <div className="flex items-center space-x-3">
              <span className="text-xs text-forest-text-secondary font-mono">
                {formatTime(currentTime)}
              </span>
              
              <div 
                ref={progressRef}
                className="flex-1 h-2 bg-forest-bg-2 rounded-full cursor-pointer overflow-hidden"
                onClick={handleProgressClick}
              >
                <div className="relative h-full">
                  {/* Waveform background pattern */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-end space-x-0.5 h-full w-full">
                      {Array.from({ length: 50 }, (_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-forest-text-secondary opacity-30 rounded-sm"
                          style={{
                            height: `${Math.random() * 60 + 20}%`,
                            minHeight: '2px'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Progress overlay */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-forest-accent to-forest-seafoam rounded-full transition-all duration-100"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
              
              <span className="text-xs text-forest-text-secondary font-mono">
                {formatTime(track.duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <button onClick={toggleMute} className="p-2 text-forest-text-secondary hover:text-forest-text-primary transition-colors">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-forest-bg-2 rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forest-accent
                       [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-soft"
            />
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="p-2 text-forest-text-secondary hover:text-forest-text-primary transition-colors ml-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;