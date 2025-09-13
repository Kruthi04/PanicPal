import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, Feather, MessageCircle, Play, ChevronLeft, ChevronRight, Save, Heart, MapPin, Star, Volume2, VolumeX, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type CardType = 'meditation' | 'gratitude' | 'affirmations' | null;
type MeditationType = 'guided-breathing' | 'body-scan' | null;

const Mindfulness = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState<CardType>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [gratitudeEntries, setGratitudeEntries] = useState(['', '', '']);
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  
  // Meditation flow state
  const [meditationType, setMeditationType] = useState<MeditationType>(null);
  const [selectedDuration, setSelectedDuration] = useState(3); // Default 3 minutes
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(1);
  const [showRipple, setShowRipple] = useState(false);
  const [backgroundSoundEnabled, setBackgroundSoundEnabled] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  
  // Affirmations flow state
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showEndScreen, setShowEndScreen] = useState(false);
  
  // Gratitude flow state
  const [gratitudeStep, setGratitudeStep] = useState(0);
  const [gratitudeEntriesObj, setGratitudeEntriesObj] = useState({
    positive: '',
    selfValue: '',
    takenForGranted: ''
  });
  const [selectedEmoji, setSelectedEmoji] = useState('');
  

  
  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('affirmationFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  
  // Reset all card states when switching cards
  const resetCardStates = () => {
    setCurrentStep(0);
    setGratitudeEntries(['', '', '']);
    setCurrentAffirmation(0);
    setMeditationType(null);
    setSelectedDuration(3);
    setIsPlaying(false);
    setTimeRemaining(0);
    setBreathingPhase('inhale');
    setBreathingCount(1);
    setShowRipple(false);
    setBackgroundSoundEnabled(false);
    setSessionCompleted(false);
    // Reset gratitude flow state
    setGratitudeStep(0);
    setGratitudeEntriesObj({ positive: '', selfValue: '', takenForGranted: '' });
    setSelectedEmoji('');
    // Reset affirmations flow state
    setCurrentAffirmationIndex(0);
    setShowEndScreen(false);
  };
  
  // Handle card selection with state reset
  const handleCardSelect = (cardId: CardType) => {
    resetCardStates();
    setActiveCard(cardId);
    if (cardId === 'meditation') {
      setMeditationType('guided-breathing');
    }
  };
  
  // Handle back navigation
  const handleBackToCards = () => {
    setActiveCard(null);
    resetCardStates();
  };

  // Breathing animation and timer effects
  useEffect(() => {
    let breathingInterval: NodeJS.Timeout;
    if (isPlaying && meditationType === 'guided-breathing') {
      breathingInterval = setInterval(() => {
        setBreathingPhase(prev => {
          if (prev === 'inhale') {
            setShowRipple(true);
            setTimeout(() => setShowRipple(false), 1500);
            return 'hold';
          }
          if (prev === 'hold') return 'exhale';
          if (prev === 'exhale') {
            setBreathingCount(count => count + 1);
            return 'inhale';
          }
          return 'inhale';
        });
      }, breathingPhase === 'inhale' ? 4000 : breathingPhase === 'hold' ? 2000 : 6000); // 4s inhale, 2s hold, 6s exhale
    }
    return () => clearInterval(breathingInterval);
  }, [isPlaying, meditationType, breathingPhase]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0) {
      timerInterval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            setSessionCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isPlaying, timeRemaining]);

  const startMeditation = (duration: number) => {
    setSelectedDuration(duration);
    setTimeRemaining(duration * 60); // Convert minutes to seconds
    setIsPlaying(true);
    setSessionCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const affirmations = [
    "I am safe and in control of my thoughts.",
    "I trust myself to handle challenges calmly.",
    "Each breath I take brings me peace.",
    "I am stronger than my anxious thoughts.",
    "This moment will pass, and I will be okay.",
    "I choose to focus on what I can control.",
    "I release tension with every exhale.",
    "I have overcome difficult moments before.",
    "My mind and body are learning to relax.",
    "I am worthy of calm, peace, and balance."
  ];

  const gratitudePrompts = [
    "One positive thing from today:",
    "One thing about yourself you value:",
    "One thing you often take for granted:"
  ];



  const mainCards = [
    {
      id: 'meditation',
      title: 'Meditation',
      subtitle: 'Breathing awareness',
      icon: Brain,
      color: 'bg-forest-card text-forest-accent',
      bgGradient: 'from-forest-bg-2 to-forest-card'
    },
    {
      id: 'gratitude',
      title: 'Gratitude',
      subtitle: 'Reflect on positive moments',
      icon: Feather,
      color: 'bg-forest-card text-forest-seafoam',
      bgGradient: 'from-forest-bg-2 to-forest-card'
    },
    {
      id: 'affirmations',
      title: 'Affirmations',
      subtitle: 'Daily positive reminders',
      icon: MessageCircle,
      color: 'bg-forest-card text-forest-mint',
      bgGradient: 'from-forest-bg-2 to-forest-card'
    }
  ];



  const handleBack = () => {
    if (activeCard) {
      setActiveCard(null);
      setCurrentStep(0);
    } else {
      navigate(-1);
    }
  };

  const renderMeditationFlow = () => {

    // Guided Breathing Flow
    if (meditationType === 'guided-breathing') {
      if (sessionCompleted) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-forest-card rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-12 h-12 text-forest-accent" />
              </div>
              <h3 className="text-xl font-semibold text-forest-text-primary mb-2">Well Done!</h3>
              <p className="text-forest-text-secondary">You've completed your {selectedDuration}-minute breathing session.</p>
            </div>
            <button
              onClick={handleBackToCards}
              className="w-full forest-button py-3 rounded-xl font-medium transition-colors"
            >
              Back to Mindfulness
            </button>
          </div>
        );
      }

      if (!isPlaying) {
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-forest-text-primary mb-2">Guided Breathing</h3>
              <p className="text-forest-text-secondary">Choose your session duration</p>
            </div>
            
            {/* Timer Selection */}
            <div className="forest-card rounded-2xl p-6 shadow-sm">
              <div className="space-y-4">
                <p className="text-center text-forest-text-primary font-medium">Session Duration:</p>
                <div className="flex justify-center gap-4">
                  {[1, 3, 5].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => startMeditation(duration)}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        selectedDuration === duration
                          ? 'forest-button'
                          : 'bg-forest-bg-2 text-forest-text-primary hover:bg-forest-card'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      {duration} min
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Sound Toggle */}
              <div className="mt-6 flex items-center justify-center">
                <button
                  onClick={() => setBackgroundSoundEnabled(!backgroundSoundEnabled)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    backgroundSoundEnabled
                      ? 'bg-forest-accent text-white'
                      : 'bg-forest-bg-2 text-forest-text-secondary hover:bg-forest-card'
                  }`}
                >
                  {backgroundSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  Background Sound
                </button>
              </div>
            </div>

            <button
              onClick={handleBackToCards}
              className="w-full bg-forest-bg-2 text-forest-text-primary py-3 rounded-xl font-medium hover:bg-forest-card transition-colors"
            >
              Back to Mindfulness
            </button>
          </div>
        );
      }

      // Active breathing session
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-forest-text-primary mb-2">{formatTime(timeRemaining)}</div>
            <div className="w-full bg-forest-bg-2 rounded-full h-2 mx-auto max-w-xs">
              <div 
                className="h-2 bg-forest-accent rounded-full transition-all duration-300"
                style={{ width: `${((selectedDuration * 60 - timeRemaining) / (selectedDuration * 60)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Enhanced Breathing Orb */}
          <div className="flex justify-center mb-8 relative">
            {/* Ripple Effect */}
            {showRipple && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-ping rounded-full bg-gradient-to-br from-blue-400/30 to-teal-400/30 w-48 h-48"></div>
                <div className="animate-ping rounded-full bg-gradient-to-br from-blue-300/20 to-teal-300/20 w-56 h-56 absolute" style={{animationDelay: '0.5s'}}></div>
              </div>
            )}
            
            {/* Main Breathing Orb */}
            <div className="relative z-10">
              <div 
                className={`rounded-full transition-all duration-[4000ms] ease-in-out flex items-center justify-center relative overflow-hidden ${
                  breathingPhase === 'inhale' 
                    ? 'w-48 h-48 shadow-2xl' 
                    : breathingPhase === 'hold' 
                    ? 'w-44 h-44 shadow-xl' 
                    : 'w-32 h-32 shadow-lg'
                }`}
                style={{
                  background: breathingPhase === 'inhale'
                    ? 'radial-gradient(circle, #3b82f6, #06b6d4, #0891b2)'
                    : breathingPhase === 'hold'
                    ? 'radial-gradient(circle, #6366f1, #8b5cf6, #a855f7)'
                    : 'radial-gradient(circle, #a855f7, #d946ef, #10b981)',
                  boxShadow: breathingPhase === 'inhale'
                    ? '0 0 60px rgba(59, 130, 246, 0.6), 0 0 120px rgba(6, 182, 212, 0.3)'
                    : breathingPhase === 'hold'
                    ? '0 0 40px rgba(99, 102, 241, 0.5), 0 0 80px rgba(139, 92, 246, 0.2)'
                    : '0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(217, 70, 239, 0.2)'
                }}
              >
                {/* Inner glow effect */}
                <div 
                  className="absolute inset-2 rounded-full opacity-60"
                  style={{
                    background: breathingPhase === 'inhale'
                      ? 'radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)'
                      : breathingPhase === 'hold'
                      ? 'radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%)'
                      : 'radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)'
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Breathing Text Prompts */}
          <div className="text-center mb-6">
            <div 
              className={`text-2xl font-medium transition-all duration-1000 ${
                breathingPhase === 'inhale' 
                  ? 'text-blue-600 opacity-100 transform scale-110' 
                  : breathingPhase === 'hold'
                  ? 'text-purple-600 opacity-90 transform scale-105'
                  : 'text-green-600 opacity-100 transform scale-100'
              }`}
            >
              {breathingPhase === 'inhale' && (
                <span className="animate-pulse">Inhale...2...3...4</span>
              )}
              {breathingPhase === 'hold' && (
                <span className="animate-pulse">Hold...2</span>
              )}
              {breathingPhase === 'exhale' && (
                <span className="animate-pulse">Exhale...2...3...4...5...6</span>
              )}
            </div>
            <div className="text-sm text-forest-text-secondary mt-2 opacity-70">
              Breath #{breathingCount}
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-forest-text-primary font-medium">Follow the circle's rhythm</p>
            <p className="text-sm text-forest-text-secondary">Breathe deeply and relax</p>
          </div>

          <button
            onClick={() => {
              setIsPlaying(false);
              setTimeRemaining(0);
            }}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
          >
            Stop Session
          </button>
        </div>
      );
    }


  };

  // Load saved gratitude entries on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('gratitude-entries');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        if (parsed.length > 0) {
          const latest = parsed[parsed.length - 1];
          setGratitudeEntriesObj({
            positive: latest.positive || '',
            selfValue: latest.selfValue || '',
            takenForGranted: latest.takenForGranted || ''
          });
          setSelectedEmoji(latest.emoji || '');
        }
      } catch (error) {
        console.error('Error loading gratitude entries:', error);
      }
    }
  }, []);
  
  const handleGratitudeChange = (field: string, value: string) => {
    setGratitudeEntriesObj(prev => ({ ...prev, [field]: value }));
  };
  
  const saveGratitudeEntry = () => {
    const entry = {
      ...gratitudeEntriesObj,
      emoji: selectedEmoji,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    const existingEntries = JSON.parse(localStorage.getItem('gratitude-entries') || '[]');
    const updatedEntries = [...existingEntries, entry];
    
    // Keep only last 50 entries to prevent storage bloat
    if (updatedEntries.length > 50) {
      updatedEntries.splice(0, updatedEntries.length - 50);
    }
    
    localStorage.setItem('gratitude-entries', JSON.stringify(updatedEntries));
    
    // Show success and reset
    alert('Gratitude entry saved! 🌟');
    setGratitudeStep(0);
    setGratitudeEntriesObj({ positive: '', selfValue: '', takenForGranted: '' });
    setSelectedEmoji('');
  };
  
  const skipEntry = () => {
    setGratitudeStep(0);
    setGratitudeEntriesObj({ positive: '', selfValue: '', takenForGranted: '' });
    setSelectedEmoji('');
  };

  const renderGratitudeFlow = () => {
    
    // Start prompt screen
    if (gratitudeStep === 0) {
      return (
        <div className="space-y-6">

          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-forest-card rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Feather className="w-8 h-8 text-forest-seafoam" />
            </div>
            <h3 className="text-xl font-semibold text-forest-text-primary mb-2">Gratitude Journal</h3>
            <p className="text-forest-text-secondary">Take a moment to reflect and appreciate</p>
          </div>
          
          {/* Notebook-style card with texture */}
          <div className="relative">
            {/* Paper texture background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent rounded-2xl"></div>
            
            {/* Notebook lines effect */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-px bg-blue-300 mb-6 mt-6"></div>
              ))}
            </div>
            
            <div className="relative forest-card rounded-2xl p-6 shadow-lg border border-forest-bg-2/50">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Feather className="w-5 h-5 text-forest-accent" />
                  <div className="w-12 h-px bg-forest-bg-2"></div>
                </div>
                
                <h4 className="text-lg font-medium text-forest-text-primary mb-4">
                  "Write down 3 things you're grateful for today."
                </h4>
                
                <div className="space-y-3 text-sm text-forest-text-secondary text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-forest-bg-2 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-forest-accent">1</span>
                    </div>
                    <p>One positive thing from today</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-forest-bg-2 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-forest-accent">2</span>
                    </div>
                    <p>One thing about yourself</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-forest-bg-2 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-forest-accent">3</span>
                    </div>
                    <p>One thing you often take for granted</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setGratitudeStep(1)}
                  className="w-full forest-button py-3 rounded-xl font-medium transition-colors mt-6"
                >
                  Start Writing
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Input form screen
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setGratitudeStep(0)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Prompt
        </button>
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-forest-card rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Feather className="w-6 h-6 text-forest-seafoam" />
          </div>
          <h3 className="text-lg font-semibold text-forest-text-primary mb-2">Your Gratitude Entries</h3>
        </div>
        
        {/* Notebook-style input form */}
        <div className="relative">
          {/* Paper texture background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent rounded-2xl"></div>
          
          <div className="relative forest-card rounded-2xl p-6 shadow-lg border border-forest-bg-2/50">
            <div className="space-y-6">
              {/* Entry 1 */}
              <div>
                <label className="block text-sm font-medium text-forest-text-primary mb-2 flex items-center">
                  <span className="w-6 h-6 bg-forest-bg-2 text-forest-seafoam rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
                  One positive thing from today.
                </label>
                <textarea 
                  value={gratitudeEntriesObj.positive}
                  onChange={(e) => handleGratitudeChange('positive', e.target.value)}
                  className="w-full p-3 bg-white/80 border border-forest-bg-2 text-black placeholder-forest-text-secondary rounded-lg resize-none focus:ring-2 focus:ring-forest-accent focus:border-forest-accent text-sm min-h-[80px]" 
                  placeholder="What brought you joy or made you smile today?"
                />
              </div>
              
              {/* Entry 2 */}
              <div>
                <label className="block text-sm font-medium text-forest-text-primary mb-2 flex items-center">
                  <span className="w-6 h-6 bg-forest-bg-2 text-forest-seafoam rounded-full flex items-center justify-center text-xs font-bold mr-2">2</span>
                  One thing about yourself.
                </label>
                <textarea 
                  value={gratitudeEntriesObj.selfValue}
                  onChange={(e) => handleGratitudeChange('selfValue', e.target.value)}
                  className="w-full p-3 bg-white/80 border border-forest-bg-2 text-black placeholder-forest-text-secondary rounded-lg resize-none focus:ring-2 focus:ring-forest-accent focus:border-forest-accent text-sm min-h-[80px]" 
                  placeholder="What quality or strength do you appreciate about yourself?"
                />
              </div>
              
              {/* Entry 3 */}
              <div>
                <label className="block text-sm font-medium text-forest-text-primary mb-2 flex items-center">
                  <span className="w-6 h-6 bg-forest-bg-2 text-forest-seafoam rounded-full flex items-center justify-center text-xs font-bold mr-2">3</span>
                  One thing you often take for granted.
                </label>
                <textarea 
                  value={gratitudeEntriesObj.takenForGranted}
                  onChange={(e) => handleGratitudeChange('takenForGranted', e.target.value)}
                  className="w-full p-3 bg-white/80 border border-forest-bg-2 text-black placeholder-forest-text-secondary rounded-lg resize-none focus:ring-2 focus:ring-forest-accent focus:border-forest-accent text-sm min-h-[80px]" 
                  placeholder="What do you have in your life that you might overlook?"
                />
              </div>
              
              {/* Emoji Selector */}
              <div>
                <label className="block text-sm font-medium text-forest-text-primary mb-3">How are you feeling? (Optional)</label>
                <div className="flex justify-center space-x-3 mb-4">
                  {['😊', '😌', '🙏', '💚', '✨', '🌟', '😇', '💛'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedEmoji(selectedEmoji === emoji ? '' : emoji)}
                      className={`text-2xl p-2 rounded-full transition-all hover:scale-110 ${
                        selectedEmoji === emoji 
                          ? 'bg-forest-card scale-110 shadow-md' 
                          : 'hover:bg-forest-bg-2/50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {selectedEmoji && (
                  <p className="text-center text-sm text-forest-text-secondary">
                    Selected mood: {selectedEmoji}
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <button 
                  onClick={saveGratitudeEntry}
                  className="w-full forest-button py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Gratitude Entry</span>
                </button>
                <button 
                  onClick={skipEntry}
                  className="w-full bg-forest-bg-2 text-forest-text-secondary py-3 rounded-xl font-medium transition-colors hover:bg-forest-bg-2/80"
                >
                  Skip for Now
                </button>
                <p className="text-xs text-forest-text-secondary text-center">
                  Your entries are saved locally and private to you
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAffirmationsFlow = () => {
    const nextAffirmation = () => {
      if (currentAffirmationIndex === affirmations.length - 1) {
        setShowEndScreen(true);
      } else {
        setCurrentAffirmationIndex(prev => prev + 1);
      }
    };
    
    const prevAffirmation = () => {
      if (showEndScreen) {
        setShowEndScreen(false);
        setCurrentAffirmationIndex(affirmations.length - 1);
      } else {
        setCurrentAffirmationIndex(prev => prev > 0 ? prev - 1 : 0);
      }
    };
    
    const toggleFavorite = () => {
      const newFavorites = favorites.includes(currentAffirmationIndex)
        ? favorites.filter(i => i !== currentAffirmationIndex)
        : [...favorites, currentAffirmationIndex];
      
      setFavorites(newFavorites);
      localStorage.setItem('affirmationFavorites', JSON.stringify(newFavorites));
    };
    
    const isFavorite = favorites.includes(currentAffirmationIndex);
    
    // End Screen
    if (showEndScreen) {
      return (
        <div className="space-y-6">

          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-forest-card rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <MessageCircle className="w-8 h-8 text-forest-mint" />
            </div>
          </div>
          
          <div className="forest-card rounded-2xl p-8 shadow-sm text-center">
            <div className="space-y-6 opacity-0 animate-fade-in" style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}>
              <div className="w-20 h-20 bg-forest-bg-2 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-2xl font-semibold text-forest-text-primary">That's all for today.</h3>
              <p className="text-forest-text-secondary">You've completed all affirmations. Take these positive thoughts with you.</p>
              
              <button 
                onClick={handleBackToCards}
                className="w-full forest-button py-3 rounded-xl font-medium transition-colors mt-6"
              >
                Back to Mindfulness Menu
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Card Deck Interface
    return (
      <div className="space-y-6">

        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-forest-card rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-forest-mint" />
          </div>
          <h3 className="text-xl font-semibold text-forest-text-primary mb-2">Daily Affirmations</h3>
          <p className="text-forest-text-secondary">Swipe through positive thoughts for today</p>
        </div>
        
        <div className="forest-card rounded-2xl p-8 shadow-lg border border-forest-bg-2/30">
          <div className="text-center space-y-6">
            <div className="min-h-[140px] flex items-center justify-center">
              <div className="bg-gradient-to-br from-forest-bg-2/50 to-forest-card/80 rounded-xl p-6 shadow-inner border border-forest-accent/20">
                <div className="w-12 h-12 bg-forest-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-forest-accent" />
                </div>
                <p className="text-lg font-medium text-forest-text-primary leading-relaxed px-2 text-center">
                  {affirmations[currentAffirmationIndex].replace(/^\/+|\/+$/g, '')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              {affirmations.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentAffirmationIndex 
                      ? 'bg-forest-accent w-6' 
                      : 'bg-forest-bg-2'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex justify-center items-center space-x-6 pt-4">
              <button 
                onClick={prevAffirmation}
                disabled={currentAffirmationIndex === 0}
                className={`p-3 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 ${
                  currentAffirmationIndex === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-forest-card text-forest-text-secondary'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={toggleFavorite}
                className={`p-3 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 ${
                  isFavorite 
                    ? 'bg-yellow-100 text-yellow-600' 
                    : 'bg-forest-card text-forest-text-secondary'
                }`}
              >
                <Star className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              <button 
                onClick={nextAffirmation}
                className="p-3 bg-forest-card rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 text-forest-text-secondary"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-sm text-forest-accent font-medium">
                {currentAffirmationIndex + 1} of {affirmations.length}
              </p>
              {favorites.length > 0 && (
                <p className="text-xs text-forest-text-secondary mt-2">
                  {favorites.length} affirmation{favorites.length !== 1 ? 's' : ''} saved to favorites
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };



  if (activeCard) {
    const card = mainCards.find(c => c.id === activeCard);
    return (
      <div className={`min-h-screen bg-gradient-to-br ${card?.bgGradient} p-4`}>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{card?.title}</h1>
          <div className="w-10" />
        </div>
        
        <div className="max-w-md mx-auto">
          {activeCard === 'meditation' && renderMeditationFlow()}
          {activeCard === 'gratitude' && renderGratitudeFlow()}
          {activeCard === 'affirmations' && renderAffirmationsFlow()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-bg-1 via-forest-bg-2 to-forest-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-forest-text-secondary hover:text-forest-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </button>
        </div>
        
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-forest-text-primary mb-3 sm:mb-4">Mindfulness</h1>
          <p className="text-sm sm:text-base text-forest-text-secondary max-w-2xl mx-auto px-4">
            Take a moment to center yourself with these guided mindfulness practices. Each session is designed to be quick, calming, and restorative.
          </p>
        </div>

        {/* Main Cards Grid */}
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {mainCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardSelect(card.id as CardType)}
                  className="forest-card rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all transform hover:scale-105 text-left group"
                >
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-semibold text-forest-text-primary mb-1 sm:mb-2">{card.title}</h3>
                      <p className="text-xs sm:text-sm text-forest-text-secondary">{card.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mindfulness;