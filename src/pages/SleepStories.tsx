import { Link } from "react-router-dom";
import { ArrowLeft, Moon, Play, Clock, Star, Volume2 } from "lucide-react";

export default function SleepStories() {
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
                <Moon className="w-6 h-6 text-forest-bg-1" />
              </div>
              <h1 className="text-xl font-bold text-forest-text-primary font-poppins">Sleep Stories</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-forest-text-primary mb-4 font-poppins">
            Drift Into Peaceful Sleep
          </h2>
          <p className="text-forest-text-secondary font-inter max-w-2xl mx-auto">
            Soothing bedtime stories and soundscapes designed to help you unwind, relax, and fall into restful sleep.
          </p>
        </div>

        {/* Featured Story */}
        <div className="forest-card p-8 mb-8 bg-gradient-to-r from-forest-card to-forest-bg-2/30">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <Star className="w-5 h-5 text-forest-accent mr-2" />
                <span className="text-sm font-semibold text-forest-accent font-inter">FEATURED TONIGHT</span>
              </div>
              <h3 className="text-2xl font-bold text-forest-text-primary mb-2 font-poppins">The Enchanted Forest</h3>
              <p className="text-forest-text-secondary mb-4 font-inter">Journey through a magical woodland where gentle creatures guide you to peaceful slumber.</p>
              <div className="flex items-center text-forest-text-secondary text-sm font-inter">
                <Clock className="w-4 h-4 mr-1" />
                <span>25 minutes</span>
                <Volume2 className="w-4 h-4 ml-4 mr-1" />
                <span>Soft narration</span>
              </div>
            </div>
            <button className="forest-button ml-6 flex items-center font-inter font-semibold">
              <Play className="w-5 h-5 mr-2" />
              Listen Now
            </button>
          </div>
        </div>

        {/* Story Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="forest-card p-6 hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-forest-text-primary mb-2 font-poppins">Nature Tales</h3>
            <p className="text-forest-text-secondary text-sm mb-4 font-inter">Peaceful stories set in serene natural landscapes.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-forest-text-secondary font-inter">8 stories</span>
              <button className="text-forest-accent hover:text-forest-seafoam transition-colors font-inter font-semibold text-sm">
                Explore →
              </button>
            </div>
          </div>

          <div className="forest-card p-6 hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-forest-text-primary mb-2 font-poppins">Fantasy Dreams</h3>
            <p className="text-forest-text-secondary text-sm mb-4 font-inter">Gentle adventures in magical realms and distant worlds.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-forest-text-secondary font-inter">6 stories</span>
              <button className="text-forest-accent hover:text-forest-seafoam transition-colors font-inter font-semibold text-sm">
                Explore →
              </button>
            </div>
          </div>

          <div className="forest-card p-6 hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-forest-text-primary mb-2 font-poppins">Soundscapes</h3>
            <p className="text-forest-text-secondary text-sm mb-4 font-inter">Ambient sounds and gentle music for deep relaxation.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-forest-text-secondary font-inter">12 tracks</span>
              <button className="text-forest-accent hover:text-forest-seafoam transition-colors font-inter font-semibold text-sm">
                Explore →
              </button>
            </div>
          </div>
        </div>

        {/* Popular Stories */}
        <div className="forest-card p-6 mb-8">
          <h3 className="text-xl font-semibold text-forest-text-primary mb-4 font-poppins">Popular Tonight</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-forest-bg-2/30 rounded-xl hover:bg-forest-bg-2/50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <Moon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-text-primary font-inter">Ocean Waves at Midnight</h4>
                  <p className="text-sm text-forest-text-secondary font-inter">Gentle waves lull you to sleep</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-forest-text-secondary font-inter mr-4">30 min</span>
                <button className="w-10 h-10 bg-forest-accent/20 hover:bg-forest-accent/30 rounded-full flex items-center justify-center transition-colors">
                  <Play className="w-5 h-5 text-forest-accent" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-forest-bg-2/30 rounded-xl hover:bg-forest-bg-2/50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-xl flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-text-primary font-inter">The Sleepy Village</h4>
                  <p className="text-sm text-forest-text-secondary font-inter">A cozy tale of a peaceful countryside</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-forest-text-secondary font-inter mr-4">20 min</span>
                <button className="w-10 h-10 bg-forest-accent/20 hover:bg-forest-accent/30 rounded-full flex items-center justify-center transition-colors">
                  <Play className="w-5 h-5 text-forest-accent" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-forest-bg-2/30 rounded-xl hover:bg-forest-bg-2/50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-forest-text-primary font-inter">Rain on the Rooftop</h4>
                  <p className="text-sm text-forest-text-secondary font-inter">Soothing rainfall sounds</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-forest-text-secondary font-inter mr-4">45 min</span>
                <button className="w-10 h-10 bg-forest-accent/20 hover:bg-forest-accent/30 rounded-full flex items-center justify-center transition-colors">
                  <Play className="w-5 h-5 text-forest-accent" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sleep Tips */}
        <div className="forest-card p-6">
          <h3 className="text-xl font-semibold text-forest-text-primary mb-4 font-poppins">Better Sleep Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-forest-accent/20 rounded-full flex items-center justify-center mr-3 mt-1">
                <Moon className="w-4 h-4 text-forest-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-forest-text-primary font-inter mb-1">Create a Routine</h4>
                <p className="text-sm text-forest-text-secondary font-inter">Listen to stories at the same time each night</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-forest-accent/20 rounded-full flex items-center justify-center mr-3 mt-1">
                <Volume2 className="w-4 h-4 text-forest-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-forest-text-primary font-inter mb-1">Adjust Volume</h4>
                <p className="text-sm text-forest-text-secondary font-inter">Keep audio low and comfortable</p>
              </div>
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