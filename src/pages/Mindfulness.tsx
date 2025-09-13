import { Link } from "react-router-dom";
import { ArrowLeft, Brain, Clock, Play, Star, Leaf } from "lucide-react";

export default function Mindfulness() {
  return (
    <div className="min-h-screen bg-forest-bg-1">
      {/* Header */}
      <header className="bg-forest-bg-2/50 backdrop-blur-sm border-b border-forest-bg-2 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link 
              to="/" 
              className="flex items-center text-forest-text-secondary hover:text-forest-text-primary transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-forest-accent to-forest-seafoam rounded-full mr-3">
                <Brain className="w-6 h-6 text-forest-bg-1" />
              </div>
              <h1 className="text-xl font-bold text-forest-text-primary font-poppins">Mindfulness</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-forest-text-primary mb-4 font-poppins">
            Cultivate Inner Peace
          </h2>
          <p className="text-forest-text-secondary font-inter max-w-2xl mx-auto">
            Discover mindfulness practices designed to help you stay present, reduce anxiety, and find calm in the moment.
          </p>
        </div>

        {/* Featured Practice */}
        <div className="forest-card p-8 mb-8 bg-gradient-to-r from-forest-card to-forest-bg-2/30">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <Star className="w-5 h-5 text-forest-accent mr-2" />
                <span className="text-sm font-semibold text-forest-accent font-inter">FEATURED</span>
              </div>
              <h3 className="text-2xl font-bold text-forest-text-primary mb-2 font-poppins">5-Minute Morning Mindfulness</h3>
              <p className="text-forest-text-secondary mb-4 font-inter">Start your day with intention and clarity through this gentle guided practice.</p>
              <div className="flex items-center text-forest-text-secondary text-sm font-inter">
                <Clock className="w-4 h-4 mr-1" />
                <span>5 minutes</span>
              </div>
            </div>
            <button className="forest-button ml-6 flex items-center font-inter font-semibold">
              <Play className="w-5 h-5 mr-2" />
              Start Practice
            </button>
          </div>
        </div>

        {/* Practice Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="forest-card p-6 hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-forest-text-primary mb-2 font-poppins">Body Scan</h3>
            <p className="text-forest-text-secondary text-sm mb-4 font-inter">Release tension and connect with your physical sensations.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-forest-text-secondary font-inter">3 practices</span>
              <button className="text-forest-accent hover:text-forest-seafoam transition-colors font-inter font-semibold text-sm">
                Explore →
              </button>
            </div>
          </div>

          <div className="forest-card p-6 hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-forest-text-primary mb-2 font-poppins">Loving Kindness</h3>
            <p className="text-forest-text-secondary text-sm mb-4 font-inter">Cultivate compassion for yourself and others.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-forest-text-secondary font-inter">4 practices</span>
              <button className="text-forest-accent hover:text-forest-seafoam transition-colors font-inter font-semibold text-sm">
                Explore →
              </button>
            </div>
          </div>

          <div className="forest-card p-6 hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-forest-text-primary mb-2 font-poppins">Present Moment</h3>
            <p className="text-forest-text-secondary text-sm mb-4 font-inter">Anchor yourself in the here and now.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-forest-text-secondary font-inter">5 practices</span>
              <button className="text-forest-accent hover:text-forest-seafoam transition-colors font-inter font-semibold text-sm">
                Explore →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Practices */}
        <div className="forest-card p-6">
          <h3 className="text-xl font-semibold text-forest-text-primary mb-4 font-poppins">Quick Practices</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-forest-bg-2/30 rounded-xl hover:bg-forest-bg-2/50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-forest-accent/20 rounded-full flex items-center justify-center mr-3">
                  <Play className="w-4 h-4 text-forest-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-text-primary font-inter">3-Minute Breathing Space</h4>
                  <p className="text-sm text-forest-text-secondary font-inter">Quick reset for busy moments</p>
                </div>
              </div>
              <span className="text-sm text-forest-text-secondary font-inter">3 min</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-forest-bg-2/30 rounded-xl hover:bg-forest-bg-2/50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-forest-accent/20 rounded-full flex items-center justify-center mr-3">
                  <Play className="w-4 h-4 text-forest-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-text-primary font-inter">Gratitude Reflection</h4>
                  <p className="text-sm text-forest-text-secondary font-inter">Appreciate the good in your life</p>
                </div>
              </div>
              <span className="text-sm text-forest-text-secondary font-inter">2 min</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-forest-bg-2/30 rounded-xl hover:bg-forest-bg-2/50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-forest-accent/20 rounded-full flex items-center justify-center mr-3">
                  <Play className="w-4 h-4 text-forest-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-text-primary font-inter">Mindful Walking</h4>
                  <p className="text-sm text-forest-text-secondary font-inter">Bring awareness to movement</p>
                </div>
              </div>
              <span className="text-sm text-forest-text-secondary font-inter">5 min</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center mt-8">
          <Link 
            to="/breathing-session" 
            className="forest-button font-inter font-semibold py-3 px-8 shadow-card mr-4"
          >
            Start Breathing Exercise
          </Link>
          <Link 
            to="/mood-tracking" 
            className="bg-forest-bg-2/50 hover:bg-forest-card/50 text-forest-text-primary font-semibold py-3 px-8 rounded-2xl border-2 border-forest-bg-2 transition-colors backdrop-blur-sm font-inter"
          >
            Track Your Mood
          </Link>
        </div>
      </div>
    </div>
  );
}