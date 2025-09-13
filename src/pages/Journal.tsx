import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Plus, Search, Filter, Download, Calendar, AlertTriangle, Heart, Smile } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

interface JournalEntry {
  id: string;
  date: string;
  type: 'panic_attack' | 'mood' | 'general';
  title: string;
  notes: string;
  moodRating: number;
  timestamp: number;
}

const ENTRY_TYPES = {
  panic_attack: { label: 'Panic Attack', icon: AlertTriangle, color: 'from-red-500 to-red-600' },
  mood: { label: 'Mood', icon: Heart, color: 'from-blue-500 to-blue-600' },
  general: { label: 'General', icon: Smile, color: 'from-green-500 to-green-600' }
};

const MOOD_LABELS = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];

export default function Journal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [formData, setFormData] = useState({
    type: 'panic_attack' as JournalEntry['type'],
    title: '',
    notes: '',
    moodRating: 3
  });

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journal_entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      ...formData
    };
    setEntries(prev => [newEntry, ...prev]);
    setFormData({ type: 'panic_attack', title: '', notes: '', moodRating: 3 });
    setShowForm(false);
  };

  const exportEntries = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal_entries_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || entry.type === filterType;
    return matchesSearch && matchesFilter;
  });

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
                  <BookOpen className="w-6 h-6 text-forest-bg-1" />
                </div>
                <h1 className="text-xl font-bold text-forest-text-primary font-poppins">Mood Journal</h1>
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
            Your Personal Journal
          </h2>
          <p className="text-forest-text-secondary font-inter">
            Document your thoughts, track panic attack triggers, and reflect on your emotional journey.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="forest-button font-inter font-semibold py-3 px-6 shadow-card flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Entry
          </button>
          <button
            onClick={exportEntries}
            className="bg-forest-bg-2/50 hover:bg-forest-card/50 text-forest-text-primary font-semibold py-3 px-6 rounded-2xl border-2 border-forest-bg-2 transition-colors backdrop-blur-sm font-inter flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
        </div>

        {/* New Entry Form */}
        {showForm && (
          <div className="forest-card p-6 mb-8">
            <h3 className="text-xl font-semibold text-forest-text-primary mb-4 font-poppins">New Journal Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-forest-text-primary font-semibold mb-2 font-inter">Entry Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as JournalEntry['type'] }))}
                  className="w-full p-3 rounded-xl border-2 border-forest-bg-2 bg-forest-bg-1 text-forest-text-primary focus:border-forest-accent focus:outline-none font-inter"
                >
                  {Object.entries(ENTRY_TYPES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-forest-text-primary font-semibold mb-2 font-inter">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What happened today?"
                  className="w-full p-3 rounded-xl border-2 border-forest-bg-2 bg-forest-bg-1 text-forest-text-primary focus:border-forest-accent focus:outline-none font-inter"
                  required
                />
              </div>
              
              <div>
                <label className="block text-forest-text-primary font-semibold mb-2 font-inter">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Describe what caused this feeling or what you experienced..."
                  rows={4}
                  className="w-full p-3 rounded-xl border-2 border-forest-bg-2 bg-forest-bg-1 text-forest-text-primary focus:border-forest-accent focus:outline-none font-inter"
                  required
                />
              </div>
              
              <div>
                <label className="block text-forest-text-primary font-semibold mb-2 font-inter">
                  Mood Rating: {MOOD_LABELS[formData.moodRating - 1]}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.moodRating}
                  onChange={(e) => setFormData(prev => ({ ...prev, moodRating: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-forest-bg-2 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="forest-button font-inter font-semibold py-3 px-6 shadow-card"
                >
                  Save Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-forest-bg-2/50 hover:bg-forest-card/50 text-forest-text-primary font-semibold py-3 px-6 rounded-2xl border-2 border-forest-bg-2 transition-colors backdrop-blur-sm font-inter"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="forest-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-text-secondary w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search entries..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-forest-bg-2 bg-forest-bg-1 text-forest-text-primary focus:border-forest-accent focus:outline-none font-inter"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-text-secondary w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-xl border-2 border-forest-bg-2 bg-forest-bg-1 text-forest-text-primary focus:border-forest-accent focus:outline-none font-inter appearance-none"
              >
                <option value="all">All Types</option>
                {Object.entries(ENTRY_TYPES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Journal Entries */}
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="forest-card p-8 text-center">
              <BookOpen className="w-16 h-16 text-forest-text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-forest-text-primary mb-2 font-poppins">
                {entries.length === 0 ? 'Start Your Journal' : 'No Matching Entries'}
              </h3>
              <p className="text-forest-text-secondary font-inter">
                {entries.length === 0 
                  ? 'Begin documenting your thoughts and experiences.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const EntryIcon = ENTRY_TYPES[entry.type].icon;
              return (
                <div key={entry.id} className="forest-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${ENTRY_TYPES[entry.type].color} rounded-full flex items-center justify-center mr-4`}>
                        <EntryIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-forest-text-primary font-poppins">{entry.title}</h3>
                        <div className="flex items-center text-forest-text-secondary text-sm font-inter">
                          <Calendar className="w-4 h-4 mr-1" />
                          {entry.date} • {ENTRY_TYPES[entry.type].label}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-forest-text-secondary font-inter">Mood</div>
                      <div className="text-lg font-semibold text-forest-accent font-poppins">
                        {MOOD_LABELS[entry.moodRating - 1]}
                      </div>
                    </div>
                  </div>
                  <p className="text-forest-text-primary font-inter leading-relaxed">{entry.notes}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}