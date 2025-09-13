import { Link, useNavigate } from "react-router-dom";
import { Leaf, Heart, Brain, Shield, Moon, Headphones, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(path);
  };

  const handlePanicButton = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/breathing-session?rescue=true');
  };
  
  return (
    <div className="min-h-screen bg-forest-bg-1">
      {/* Header */}
      <header className="bg-forest-bg-2/50 backdrop-blur-sm border-b border-forest-bg-2 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-forest-accent to-forest-seafoam rounded-full mr-3">
                <Leaf className="w-6 h-6 text-forest-bg-1" />
              </div>
              <h1 className="text-xl font-bold text-forest-text-primary font-poppins">PanicPal</h1>
            </div>
            
            {user ? (
              <Navigation />
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-forest-text-secondary hover:text-forest-text-primary font-medium transition-colors font-inter"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="forest-button font-inter"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {user ? (
            <>
              <h1 className="text-5xl md:text-6xl font-bold text-forest-text-primary mb-6 font-poppins leading-tight">
                Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-accent to-forest-mint">{user.name}</span>
              </h1>
              <p className="text-xl md:text-2xl text-forest-text-secondary mb-8 max-w-2xl mx-auto font-inter leading-relaxed">
                Ready to continue your wellness journey? Explore your tools and track your progress.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-6xl font-bold text-forest-text-primary mb-6 font-poppins leading-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-accent to-forest-mint">PanicPal</span>
              </h1>
              <p className="text-xl md:text-2xl text-forest-text-secondary mb-8 max-w-2xl mx-auto font-inter leading-relaxed">
                Your personal mental health companion. Find peace, manage anxiety, and build resilience with our comprehensive wellness tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link 
                  to="/register"
                  className="forest-button font-inter font-semibold py-3 px-8 shadow-card"
                >
                  Start Your Journey
                </Link>
                <Link 
                  to="/login" 
                  className="bg-forest-bg-2/50 hover:bg-forest-card/50 text-forest-text-primary font-semibold py-3 px-8 rounded-2xl border-2 border-forest-bg-2 transition-colors backdrop-blur-sm font-inter"
                >
                  Sign In
                </Link>

              </div>
            </>
          )}
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          <button 
            onClick={() => handleNavigation('/mood-tracking')}
            className="forest-card p-6 text-center hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-forest-accent/30"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-forest-accent to-forest-mint rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-forest-bg-1" />
            </div>
            <h3 className="text-xl font-semibold text-forest-text-primary mb-2 font-poppins">Mood Tracking</h3>
            <p className="text-forest-text-secondary font-inter leading-relaxed">Monitor your emotional well-being with daily mood check-ins and insights.</p>
          </button>

          <button 
            onClick={() => handleNavigation('/mindfulness')}
            className="forest-card p-6 text-center hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-forest-accent/30"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-forest-accent to-forest-mint rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-forest-bg-1" />
            </div>
            <h3 className="text-xl font-semibold text-forest-text-primary mb-2 font-poppins">Mindfulness</h3>
            <p className="text-forest-text-secondary font-inter leading-relaxed">Guided breathing exercises and meditation to reduce stress and anxiety.</p>
          </button>

          <button 
            onClick={() => handleNavigation('/sleep-stories')}
            className="forest-card p-6 text-center hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-forest-accent/30"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-forest-accent to-forest-mint rounded-full flex items-center justify-center mx-auto mb-4">
              <Moon className="w-8 h-8 text-forest-bg-1" />
            </div>
            <h3 className="text-xl font-semibold text-forest-text-primary mb-2 font-poppins">Sleep Stories</h3>
            <p className="text-forest-text-secondary font-inter leading-relaxed">Calming bedtime stories to help you relax and fall asleep peacefully.</p>
          </button>

          <button 
            onClick={() => handleNavigation('/guided-meditation')}
            className="forest-card p-6 text-center hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-forest-accent/30"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-forest-accent to-forest-mint rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-8 h-8 text-forest-bg-1" />
            </div>
            <h3 className="text-xl font-semibold text-forest-text-primary mb-2 font-poppins">Guided Meditation</h3>
            <p className="text-forest-text-secondary font-inter leading-relaxed">Professional meditation sessions for deep relaxation and mindfulness.</p>
          </button>

          <button 
            onClick={() => handleNavigation('/customize-session')}
            className="forest-card p-6 text-center hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-forest-accent/30"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-forest-accent to-forest-mint rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-forest-bg-1" />
            </div>
            <h3 className="text-xl font-semibold text-forest-text-primary mb-2 font-poppins">Customize Panic Session</h3>
            <p className="text-forest-text-secondary font-inter leading-relaxed">Personalize your panic management tools and breathing exercises.</p>
          </button>
        </div>

        {/* Panic Button */}
        <div className="mt-12 flex justify-center">
          <button 
            onClick={handlePanicButton}
            className="w-32 h-32 bg-red-500 hover:bg-red-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 font-poppins"
          >
            Rescue Mode
          </button>
        </div>
      </div>
    </div>
  );
}