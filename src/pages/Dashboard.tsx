import React, { useState, useEffect } from 'react';
import { Play, Volume2, Heart, Brain, BookOpen, Smile, Target, Shield } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';

interface UserData {
  id: string;
  name: string;
  email: string;
  lastLogin?: string;
  preferences?: {
    theme: string;
    notifications: boolean;
  };
}

const Dashboard: React.FC = () => {
  const { user, isGuest } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const moodOptions = [
    { id: 'calm', label: 'Calm', icon: '🌿' },
    { id: 'relax', label: 'Relax', icon: '🧘' },
    { id: 'focus', label: 'Focus', icon: '🎯' },
    { id: 'anxious', label: 'Anxious', icon: '😰' }
  ];

  const tools = [
    { id: 'mood-journal', label: 'Mood Journal', icon: BookOpen, color: 'from-forest-accent to-forest-accent' },
    { id: 'positive-notes', label: 'Positive Notes', icon: Heart, color: 'from-forest-accent to-forest-accent' },
    { id: 'mood-booster', label: 'Mood Booster', icon: Smile, color: 'from-forest-accent to-forest-accent' },
    { id: 'trigger-plan', label: 'Trigger Plan', icon: Shield, color: 'from-forest-accent to-forest-accent' },
    { id: 'goal-trainer', label: 'Goal Trainer', icon: Target, color: 'from-forest-accent to-forest-accent' }
  ];

  const relaxSounds = [
    { 
      id: '1', 
      title: 'Forest Rain', 
      artist: 'Nature Sounds', 
      duration: 900, // 15 minutes in seconds
      category: 'Nature',
      artwork: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=peaceful%20forest%20rain%20drops%20on%20leaves%20dark%20green%20nature%20zen%20circular%20artwork&image_size=square',
      src: 'https://www.soundjay.com/misc/sounds/rain-01.wav' // Note: This is a placeholder URL that may not work
    },
    { 
      id: '2', 
      title: 'Ocean Waves', 
      artist: 'Coastal Sounds', 
      duration: 1200, // 20 minutes in seconds
      category: 'Water',
      artwork: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=calm%20ocean%20waves%20at%20night%20moonlight%20peaceful%20water%20zen%20circular%20artwork&image_size=square',
      src: 'https://www.soundjay.com/misc/sounds/ocean-01.wav' // Note: This is a placeholder URL that may not work
    },
    { 
      id: '3', 
      title: 'Night Crickets', 
      artist: 'Evening Ambience', 
      duration: 1800, // 30 minutes in seconds
      category: 'Nature',
      artwork: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=peaceful%20night%20crickets%20dark%20forest%20stars%20zen%20nature%20circular%20artwork&image_size=square',
      src: 'https://www.soundjay.com/misc/sounds/crickets-01.wav' // Note: This is a placeholder URL that may not work
    }
  ];

  if (!user && !isGuest) {
    return (
      <div className="min-h-screen bg-forest-bg-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest-bg-1 text-forest-text-primary">
      <Navigation currentPage="dashboard" />

      {/* Main Content */}
      <main className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Welcome Panel */}
        <div className="forest-card p-8 mb-8">
          <h2 className="text-3xl font-bold text-forest-text-primary mb-3 font-poppins">
            {user ? `Welcome back, ${user.name.split(' ')[0]} 🌙` : 'Welcome to your peaceful space 🌙'}
          </h2>
          <p className="text-forest-text-secondary mb-6 text-lg leading-relaxed">
            {user ? 'How are you feeling tonight? Let\'s find your calm in the forest.' : 'How are you feeling? Let\'s explore some calming tools together.'}
          </p>
          
          {/* Mood Chips */}
          <div className="flex flex-wrap gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`mood-chip ${selectedMood === mood.id ? 'active' : ''}`}
              >
                <span className="mr-2">{mood.icon}</span>
                {mood.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Relax Sounds Card */}
          <div className="lg:col-span-2">
            <div className="forest-card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-forest-text-primary font-poppins">
                  🎵 Relax Sounds
                </h3>
                <button className="text-forest-accent hover:text-forest-accent transition-colors">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {relaxSounds.map((sound) => (
                  <div key={sound.id} className="flex items-center justify-between p-4 bg-forest-bg-2 rounded-xl hover:bg-forest-card transition-colors">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-forest-accent to-forest-accent rounded-full flex items-center justify-center mr-4">
                        <Volume2 className="w-6 h-6 text-forest-bg-1" />
                      </div>
                      <div>
                        <h4 className="font-medium text-forest-text-primary">{sound.title}</h4>
                        <p className="text-sm text-forest-text-secondary">{sound.category} • {Math.floor(sound.duration / 60)} min</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setCurrentTrack(sound);
                        setIsPlayerVisible(true);
                      }}
                      className="p-2 bg-forest-accent rounded-full hover:bg-forest-accent transition-colors"
                    >
                      <Play className="w-4 h-4 text-forest-bg-1" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div>
            <h3 className="text-xl font-semibold text-forest-text-primary mb-6 font-poppins">
              🛠️ Your Tools
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div key={tool.id} className="tool-pill">
                    <div className={`w-10 h-10 bg-gradient-to-r ${tool.color} rounded-full flex items-center justify-center mb-3`}>
                      <IconComponent className="w-5 h-5 text-forest-bg-1" />
                    </div>
                    <span className="font-medium">{tool.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="forest-card p-6 mt-8">
          <h3 className="text-xl font-semibold text-forest-text-primary mb-6 font-poppins">
            🌱 Recent Sessions
          </h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-forest-bg-2 rounded-xl">
              <div className="w-10 h-10 bg-forest-accent rounded-full flex items-center justify-center mr-4">
                <Heart className="w-5 h-5 text-forest-bg-1" />
              </div>
              <div>
                <p className="font-medium text-forest-text-primary">Welcome to your Forest Night journey!</p>
                <p className="text-sm text-forest-text-secondary">Start exploring your mental wellness tools</p>
              </div>
            </div>
            
            <div className="text-center py-8 text-forest-text-secondary">
              <p>Your peaceful sessions will appear here as you explore</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-forest-card/90 backdrop-blur-sm border-t border-forest-bg-2 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-center space-x-8">
          <button className="p-3 text-forest-text-secondary hover:text-forest-accent transition-colors">
            <Volume2 className="w-6 h-6" />
          </button>
          <button className="p-3 text-forest-text-secondary hover:text-forest-accent transition-colors">
            <Heart className="w-6 h-6" />
          </button>
          <button className="p-3 text-forest-text-secondary hover:text-forest-accent transition-colors">
            <Brain className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Audio Player */}
      {isPlayerVisible && (
        <AudioPlayer
          track={currentTrack}
          isVisible={isPlayerVisible}
          onClose={() => setIsPlayerVisible(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;