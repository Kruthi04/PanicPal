import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Home, Zap, Heart, BookOpen, Users } from 'lucide-react';

const Success: React.FC = () => {
  const navigate = useNavigate();

  const handleReplayBreath = () => {
    navigate('/breathing-session');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const quickActions = [
    {
      icon: BookOpen,
      label: 'Journal',
      description: 'Reflect on your experience',
      action: () => navigate('/journal')
    },
    {
      icon: Users,
      label: 'Connect',
      description: 'Reach out to someone',
      action: () => navigate('/connect')
    },
    {
      icon: Heart,
      label: 'Self-Care',
      description: 'More wellness activities',
      action: () => navigate('/self-care')
    }
  ];

  return (
    <div className="min-h-screen bg-forest-bg-1 p-4">
      <div className="max-w-md mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">🌟</div>
          <h1 className="text-3xl font-bold text-forest-text-primary mb-2">Well Done!</h1>
          <p className="text-forest-text-secondary text-lg mb-4">
            You've successfully completed your breathing session.
          </p>
          <div className="forest-card backdrop-blur-sm rounded-2xl p-4">
            <p className="text-forest-accent text-sm">
              Taking time to breathe and center yourself is a powerful act of self-care. 
              You're building resilience with every session.
            </p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="space-y-4 mb-8">
          <button
            onClick={handleReplayBreath}
            className="w-full bg-forest-accent/30 hover:bg-forest-accent/50 border border-forest-accent/50 text-forest-text-primary font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <RotateCcw className="text-forest-accent group-hover:text-forest-text-primary" size={20} />
            <span>Replay Breathing Session</span>
          </button>

          <button
            onClick={handleGoHome}
            className="w-full forest-button font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <Home className="text-forest-text-primary group-hover:text-forest-text-primary" size={20} />
            <span>Return to Home</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-forest-accent" size={20} />
            <h2 className="text-lg font-semibold text-forest-text-primary">Quick Actions</h2>
          </div>
          
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full forest-card hover:bg-forest-bg-2 border border-forest-bg-2 text-left p-4 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-forest-accent/30 p-2 rounded-lg group-hover:bg-forest-accent/50 transition-colors">
                      <IconComponent className="text-forest-accent" size={20} />
                    </div>
                    <div>
                      <div className="text-forest-text-primary font-medium">{action.label}</div>
                      <div className="text-forest-accent text-sm">{action.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Encouragement Footer */}
        <div className="text-center">
          <p className="text-forest-accent text-sm font-medium">
            Remember: You have the strength to handle whatever comes your way. 💚
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;