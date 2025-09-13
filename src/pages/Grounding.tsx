import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Ear, Hand, Coffee, Heart, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import PinkNoise from '../components/PinkNoise';

interface GroundingStep {
  id: string;
  number: number;
  icon: React.ComponentType<any>;
  title: string;
  instruction: string;
  placeholder: string;
  color: string;
}

const GROUNDING_STEPS: GroundingStep[] = [
  {
    id: 'see',
    number: 5,
    icon: Eye,
    title: 'Things You Can See',
    instruction: 'Look around and name 5 things you can see right now',
    placeholder: 'e.g., a blue chair, sunlight on the wall...',
    color: 'emerald'
  },
  {
    id: 'hear',
    number: 4,
    icon: Ear,
    title: 'Things You Can Hear',
    instruction: 'Listen carefully and identify 4 sounds around you',
    placeholder: 'e.g., birds chirping, air conditioning...',
    color: 'teal'
  },
  {
    id: 'touch',
    number: 3,
    icon: Hand,
    title: 'Things You Can Touch',
    instruction: 'Notice 3 things you can feel with your hands or body',
    placeholder: 'e.g., soft fabric, cool air, smooth surface...',
    color: 'cyan'
  },
  {
    id: 'smell',
    number: 2,
    icon: Coffee,
    title: 'Things You Can Smell',
    instruction: 'Take a deep breath and identify 2 scents',
    placeholder: 'e.g., fresh air, coffee, flowers...',
    color: 'blue'
  },
  {
    id: 'taste',
    number: 1,
    icon: Heart,
    title: 'Thing You Can Taste',
    instruction: 'Notice 1 taste in your mouth right now',
    placeholder: 'e.g., mint, water, or just the taste of your mouth...',
    color: 'indigo'
  }
];

const Grounding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  const [currentInput, setCurrentInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPinkNoiseActive, setIsPinkNoiseActive] = useState(true);

  const step = GROUNDING_STEPS[currentStep];
  const stepResponses = responses[step.id] || [];
  const isStepComplete = stepResponses.length >= step.number;

  const addResponse = () => {
    if (currentInput.trim()) {
      setResponses(prev => ({
        ...prev,
        [step.id]: [...(prev[step.id] || []), currentInput.trim()]
      }));
      setCurrentInput('');
    }
  };

  const removeResponse = (index: number) => {
    setResponses(prev => ({
      ...prev,
      [step.id]: prev[step.id]?.filter((_, i) => i !== index) || []
    }));
  };

  const nextStep = () => {
    if (currentStep < GROUNDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addResponse();
    }
  };

  const getColorClasses = (color: string) => {
    // All steps now use consistent Forest Night theme colors
    return {
      bg: 'forest-card',
      border: 'border-forest-bg-2',
      text: 'text-forest-text-primary',
      accent: 'text-forest-accent',
      button: 'forest-button'
    };
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-forest-bg-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-8xl mb-6">🌈</div>
          <h1 className="text-3xl font-bold text-forest-text-primary mb-4">Well Done!</h1>
          <p className="text-forest-text-secondary text-lg mb-6">
            You've successfully completed the 5-4-3-2-1 grounding exercise.
          </p>
          
          <div className="forest-card backdrop-blur-sm rounded-2xl p-6 mb-8">
            <p className="text-forest-accent mb-4">
              Grounding exercises help bring your attention back to the present moment. 
              You've taken an important step in managing your anxiety.
            </p>
            <p className="text-forest-accent text-sm font-medium">
              How are you feeling now? Take a moment to notice any changes.
            </p>
          </div>

          {/* Pink Noise Controls */}
          <div className="mb-6">
            <PinkNoise 
              isPlaying={isPinkNoiseActive}
              onPlayingChange={setIsPinkNoiseActive}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/breathing-session')}
              className="w-full forest-button font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              Try Another Breathing Session
            </button>
            
            <button
              onClick={() => navigate('/checkin')}
              className="w-full bg-forest-accent/30 hover:bg-forest-accent/50 border border-forest-accent/50 text-forest-text-primary font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              Check In Again
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full forest-card hover:bg-forest-bg-2 border border-forest-bg-2 text-forest-text-secondary font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const colors = getColorClasses(step.color);
  const IconComponent = step.icon;

  return (
    <div className="min-h-screen bg-forest-bg-1 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-forest-text-secondary hover:text-forest-text-primary"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-forest-text-primary">5-4-3-2-1 Grounding</h1>
          {user ? <Navigation /> : <div className="w-6" />}
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-forest-text-secondary text-sm">Step {currentStep + 1} of {GROUNDING_STEPS.length}</span>
            <span className="text-forest-accent text-sm">{stepResponses.length}/{step.number} complete</span>
          </div>
          <div className="w-full bg-forest-bg-2 rounded-full h-2">
            <div 
              className="bg-forest-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + (stepResponses.length / step.number)) / GROUNDING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className={`${colors.bg} backdrop-blur-sm border ${colors.border} rounded-2xl p-6 mb-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`${colors.button} p-3 rounded-full`}>
              <IconComponent className="text-white" size={24} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${colors.text}`}>{step.number}</h2>
              <h3 className={`text-lg font-semibold ${colors.text}`}>{step.title}</h3>
            </div>
          </div>
          
          <p className={`${colors.accent} mb-4`}>{step.instruction}</p>
          
          {/* Input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={step.placeholder}
              className="flex-1 bg-forest-bg-2 border border-forest-bg-2 rounded-lg px-4 py-3 text-forest-text-primary placeholder-forest-text-secondary focus:outline-none focus:border-forest-accent"
            />
            <button
              onClick={addResponse}
              disabled={!currentInput.trim()}
              className={`${colors.button} disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg transition-colors`}
            >
              Add
            </button>
          </div>
          
          {/* Responses */}
          {stepResponses.length > 0 && (
            <div className="space-y-2">
              {stepResponses.map((response, index) => (
                <div key={index} className="flex items-center justify-between bg-forest-bg-2 rounded-lg p-3">
                  <span className={`${colors.text} flex-1`}>{response}</span>
                  <button
                    onClick={() => removeResponse(index)}
                    className="text-forest-accent hover:text-forest-text-primary ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pink Noise Controls */}
        <div className="mb-6">
          <PinkNoise 
            isPlaying={isPinkNoiseActive}
            onPlayingChange={setIsPinkNoiseActive}
            className="w-full"
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="forest-card hover:bg-forest-bg-2 disabled:opacity-50 disabled:cursor-not-allowed border border-forest-bg-2 text-forest-text-secondary font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Previous
          </button>
          
          <button
            onClick={nextStep}
            disabled={!isStepComplete}
            className={`${colors.button} disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2`}
          >
            {currentStep === GROUNDING_STEPS.length - 1 ? (
              <>
                <CheckCircle size={20} />
                Complete
              </>
            ) : (
              <>
                Next
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Grounding;