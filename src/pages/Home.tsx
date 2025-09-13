import { Link } from "react-router-dom";
import { Leaf, Heart, Brain, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-forest-900">
      {/* Header */}
      <header className="bg-forest-800/50 backdrop-blur-sm border-b border-forest-700 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-forest-400 to-forest-500 rounded-full mr-3">
                <Leaf className="w-6 h-6 text-forest-900" />
              </div>
              <h1 className="text-xl font-bold text-forest-100 font-poppins">PanicPal</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-forest-200 hover:text-forest-100 font-medium transition-colors font-inter"
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-forest-100 mb-6 font-poppins leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-400 to-forest-300">PanicPal</span>
          </h1>
          <p className="text-xl md:text-2xl text-forest-200 mb-8 max-w-2xl mx-auto font-inter leading-relaxed">
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
              className="bg-forest-800/50 hover:bg-forest-700/50 text-forest-100 font-semibold py-3 px-8 rounded-2xl border-2 border-forest-600 transition-colors backdrop-blur-sm font-inter"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          <div className="forest-card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-forest-400 to-forest-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-forest-900" />
            </div>
            <h3 className="text-xl font-semibold text-forest-100 mb-2 font-poppins">Mood Tracking</h3>
            <p className="text-forest-200 font-inter leading-relaxed">Monitor your emotional well-being with daily mood check-ins and insights.</p>
          </div>

          <div className="forest-card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-forest-400 to-forest-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-forest-900" />
            </div>
            <h3 className="text-xl font-semibold text-forest-100 mb-2 font-poppins">Mindfulness</h3>
            <p className="text-forest-200 font-inter leading-relaxed">Guided breathing exercises and meditation to reduce stress and anxiety.</p>
          </div>

          <div className="forest-card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-forest-400 to-forest-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-forest-900" />
            </div>
            <h3 className="text-xl font-semibold text-forest-100 mb-2 font-poppins">Safe Space</h3>
            <p className="text-forest-200 font-inter leading-relaxed">A secure, private environment to express your thoughts and feelings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}