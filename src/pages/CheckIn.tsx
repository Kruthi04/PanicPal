import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, AlertTriangle } from 'lucide-react';
import PinkNoise from '../components/PinkNoise';

const CheckIn: React.FC = () => {
  const navigate = useNavigate();
  const [isPinkNoiseActive, setIsPinkNoiseActive] = useState(true);

  const handleFeelingBetter = () => {
    navigate('/success');
  };

  const handleStillPanic = () => {
    navigate('/grounding');
  };

  return (
    <div className="min-h-screen bg-forest-bg-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌸</div>
          <h1 className="text-2xl font-bold text-forest-text-primary mb-2">How are you feeling?</h1>
          <p className="text-forest-text-secondary">Take a moment to check in with yourself</p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <button
            onClick={handleFeelingBetter}
            className="w-full bg-forest-accent/30 hover:bg-forest-accent/50 border border-forest-accent/50 text-forest-text-primary font-semibold py-6 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <Heart className="text-forest-accent group-hover:text-forest-text-primary" size={24} />
            <span className="text-lg">Feeling Better</span>
          </button>

          <button
            onClick={handleStillPanic}
            className="w-full bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-amber-100 font-semibold py-6 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <AlertTriangle className="text-amber-300 group-hover:text-amber-200" size={24} />
            <span className="text-lg">Still Feeling Panic</span>
          </button>
        </div>

        {/* Pink Noise Controls */}
        <div className="mt-6">
          <PinkNoise 
            isPlaying={isPinkNoiseActive}
            onPlayingChange={setIsPinkNoiseActive}
            className="w-full"
          />
        </div>

        {/* Encouragement */}
        <div className="mt-6 text-center">
          <p className="text-forest-accent text-sm">
            Remember: It's okay to take your time. You're doing great by taking care of yourself.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;