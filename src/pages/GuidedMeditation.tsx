import { Link } from "react-router-dom";
import { ArrowLeft, Headphones, Play, Clock, Star, Users, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";

export default function GuidedMeditation() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-forest-bg-1">
      {/* Header */}
      <header className="bg-forest-bg-2/50 backdrop-blur-sm border-b border-forest-bg-2 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center text-forest-text-secondary hover:text-forest-text-primary transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-forest-accent to-forest-seafoam rounded-full mr-3">
                  <Headphones className="w-6 h-6 text-forest-bg-1" />
                </div>
                <h1 className="text-xl font-bold text-forest-text-primary font-poppins">Guided Meditation</h1>
              </div>
            </div>
            {user && <Navigation />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-forest-text-primary mb-4 font-poppins">
            Find Your Center
          </h2>
          <p className="text-forest-text-secondary font-inter max-w-2xl mx-auto">
            Expert-led meditation sessions to help you reduce stress, improve focus, and cultivate inner peace.
          </p>
        </div>

        {/* Featured Meditation */}
        <div className="forest-card p-8 mb-8 bg-gradient-to-r from-forest-card to-forest-bg-2/30">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <Star className="w-5 h-5 text-forest-accent mr-2" />
                <span className="text-sm font-semibold text-forest-accent font-inter">DAILY FEATURED</span>
              </div>
              <h3 className="text-2xl font-bold text-forest-text-primary mb-2 font-poppins">Anxiety Relief Meditation</h3>
              <p className="text-forest-text-secondary mb-4 font-inter">A gentle practice to calm your mind and release tension from worry and stress.</p>
              <div className="flex items-center text-forest-text-secondary text-sm font-inter">
                <Clock className="w-4 h-4 mr-1" />
                <span>12 minutes</span>
                <Users className="w-4 h-4 ml-4 mr-1" />
                <span>Beginner friendly</span>
              </div>
            </div>
            <button className="forest-button ml-6 flex items-center font-inter font-semibold">
              <Play className="w-5 h-5 mr-2" />
              Start Session
            </button>
          </div>
        </div>

        {/* Meditation Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="forest-card p-6 hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-forest-text-primary mb-2 font-poppins">Stress Relief</h3>
            <p className="text-forest-text-secondary text-sm mb-4 font-inter">Meditations designed to reduce stress and promote relaxation.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-forest-text-secondary font-inter">8 sessions</span>
              <button className="text-forest-accent hover:text-forest-seafoam transition-colors font-inter font-semibold text-sm">
                Explore →
              </button>
            </div>
          </div>

          <div className="forest-card p-6 hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-forest-text-primary mb-2 font-poppins">Focus & Clarity</h3>
            <p className="text-forest-text-secondary text-sm mb-4 font-inter">Enhance concentration and mental clarity through mindful practice.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-forest-text-secondary font-inter">6 sessions</span>
              <button className="text-forest-accent hover:text-forest-seafoam transition-colors font-inter font-semibold text-sm">
                Explore →
              </button>
            </div>
          </div>

          <div className="forest-card p-6 hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-forest-text-primary mb-2 font-poppins">Sleep Preparation</h3>
            <p className="text-forest-text-secondary text-sm mb-4 font-inter">Evening meditations to prepare your mind for restful sleep.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-forest-text-secondary font-inter">5 sessions</span>
              <button className="text-forest-accent hover:text-forest-seafoam transition-colors font-inter font-semibold text-sm">
                Explore →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Sessions */}
        <div className="forest-card p-6 mb-8">
          <h3 className="text-xl font-semibold text-forest-text-primary mb-4 font-poppins">Quick Sessions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-forest-bg-2/30 rounded-xl hover:bg-forest-bg-2/50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-forest-accent/20 rounded-full flex items-center justify-center mr-3">
                  <Play className="w-5 h-5 text-forest-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-text-primary font-inter">5-Minute Reset</h4>
                  <p className="text-sm text-forest-text-secondary font-inter">Quick mental refresh</p>
                </div>
              </div>
              <span className="text-sm text-forest-text-secondary font-inter">5 min</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-forest-bg-2/30 rounded-xl hover:bg-forest-bg-2/50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-forest-accent/20 rounded-full flex items-center justify-center mr-3">
                  <Play className="w-5 h-5 text-forest-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-text-primary font-inter">Morning Intention</h4>
                  <p className="text-sm text-forest-text-secondary font-inter">Start your day mindfully</p>
                </div>
              </div>
              <span className="text-sm text-forest-text-secondary font-inter">8 min</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-forest-bg-2/30 rounded-xl hover:bg-forest-bg-2/50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-forest-accent/20 rounded-full flex items-center justify-center mr-3">
                  <Play className="w-5 h-5 text-forest-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-text-primary font-inter">Lunch Break Calm</h4>
                  <p className="text-sm text-forest-text-secondary font-inter">Midday stress relief</p>
                </div>
              </div>
              <span className="text-sm text-forest-text-secondary font-inter">10 min</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-forest-bg-2/30 rounded-xl hover:bg-forest-bg-2/50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-forest-accent/20 rounded-full flex items-center justify-center mr-3">
                  <Play className="w-5 h-5 text-forest-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-text-primary font-inter">Evening Wind Down</h4>
                  <p className="text-sm text-forest-text-secondary font-inter">Prepare for rest</p>
                </div>
              </div>
              <span className="text-sm text-forest-text-secondary font-inter">15 min</span>
            </div>
          </div>
        </div>

        {/* Meditation Programs */}
        <div className="forest-card p-6">
          <h3 className="text-xl font-semibold text-forest-text-primary mb-4 font-poppins">7-Day Programs</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-forest-bg-2/30 to-forest-accent/10 rounded-xl hover:from-forest-bg-2/50 hover:to-forest-accent/20 transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-forest-accent to-forest-seafoam rounded-xl flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-text-primary font-inter">Anxiety Management</h4>
                  <p className="text-sm text-forest-text-secondary font-inter">Build resilience against worry and stress</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs bg-forest-accent/20 text-forest-accent px-2 py-1 rounded-full font-inter">7 sessions</span>
                  </div>
                </div>
              </div>
              <button className="forest-button text-sm font-inter font-semibold px-4 py-2">
                Start Program
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-forest-bg-2/30 to-forest-seafoam/10 rounded-xl hover:from-forest-bg-2/50 hover:to-forest-seafoam/20 transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-forest-seafoam to-green-500 rounded-xl flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-text-primary font-inter">Mindful Living</h4>
                  <p className="text-sm text-forest-text-secondary font-inter">Integrate mindfulness into daily life</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs bg-forest-seafoam/20 text-forest-seafoam px-2 py-1 rounded-full font-inter">7 sessions</span>
                  </div>
                </div>
              </div>
              <button className="bg-forest-seafoam hover:bg-forest-seafoam/80 text-white font-semibold py-2 px-4 rounded-2xl transition-colors text-sm font-inter">
                Start Program
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center mt-8">
          <Link 
            to="/breathing-session" 
            className="forest-button font-inter font-semibold py-3 px-8 shadow-card mr-4"
          >
            Breathing Exercise
          </Link>
          <Link 
            to="/mindfulness" 
            className="bg-forest-bg-2/50 hover:bg-forest-card/50 text-forest-text-primary font-semibold py-3 px-8 rounded-2xl border-2 border-forest-bg-2 transition-colors backdrop-blur-sm font-inter"
          >
            Mindfulness Practice
          </Link>
        </div>
      </div>
    </div>
  );
}