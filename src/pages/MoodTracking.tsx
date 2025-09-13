import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Smile, Meh, Frown, TrendingUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";

export default function MoodTracking() {
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
                  <Heart className="w-6 h-6 text-forest-bg-1" />
                </div>
                <h1 className="text-xl font-bold text-forest-text-primary font-poppins">Mood Tracking</h1>
              </div>
            </div>
            {user && <Navigation />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-forest-text-primary mb-4 font-poppins">
            How are you feeling today?
          </h2>
          <p className="text-forest-text-secondary font-inter">
            Track your emotional well-being with daily mood check-ins and gain insights into your mental health patterns.
          </p>
        </div>

        {/* Mood Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button className="forest-card p-6 text-center hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-forest-accent/30">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Smile className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-forest-text-primary font-poppins">Great</h3>
            <p className="text-sm text-forest-text-secondary font-inter">Feeling amazing</p>
          </button>

          <button className="forest-card p-6 text-center hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-forest-accent/30">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Smile className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-forest-text-primary font-poppins">Good</h3>
            <p className="text-sm text-forest-text-secondary font-inter">Pretty positive</p>
          </button>

          <button className="forest-card p-6 text-center hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-forest-accent/30">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Meh className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-forest-text-primary font-poppins">Okay</h3>
            <p className="text-sm text-forest-text-secondary font-inter">Neutral mood</p>
          </button>

          <button className="forest-card p-6 text-center hover:bg-forest-card/80 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-forest-accent/30">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Frown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-forest-text-primary font-poppins">Difficult</h3>
            <p className="text-sm text-forest-text-secondary font-inter">Having a tough time</p>
          </button>
        </div>

        {/* Mood Insights */}
        <div className="forest-card p-6 mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-forest-accent mr-3" />
            <h3 className="text-xl font-semibold text-forest-text-primary font-poppins">Your Mood Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-forest-accent font-poppins">7</div>
              <div className="text-sm text-forest-text-secondary font-inter">Days tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-forest-accent font-poppins">Good</div>
              <div className="text-sm text-forest-text-secondary font-inter">Average mood</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-forest-accent font-poppins">↗️</div>
              <div className="text-sm text-forest-text-secondary font-inter">Trending up</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <Link 
            to="/breathing-session" 
            className="forest-button font-inter font-semibold py-3 px-8 shadow-card mr-4"
          >
            Start Breathing Exercise
          </Link>
          <Link 
            to="/mindfulness" 
            className="bg-forest-bg-2/50 hover:bg-forest-card/50 text-forest-text-primary font-semibold py-3 px-8 rounded-2xl border-2 border-forest-bg-2 transition-colors backdrop-blur-sm font-inter"
          >
            Explore Mindfulness
          </Link>
        </div>
      </div>
    </div>
  );
}