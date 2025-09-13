import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./hooks/useSettings.tsx";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import BreathingSession from "@/pages/BreathingSession";
import CheckIn from "@/pages/CheckIn";
import Success from "@/pages/Success";
import Grounding from "@/pages/Grounding";
import MoodTracking from "@/pages/MoodTracking";
import Mindfulness from "@/pages/Mindfulness";
import SleepStories from "@/pages/SleepStories";
import GuidedMeditation from "@/pages/GuidedMeditation";
import CustomizeSession from "@/pages/CustomizeSession";

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/breathing-session" element={<BreathingSession />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/success" element={<Success />} />
            <Route path="/grounding" element={<Grounding />} />
            <Route path="/mood-tracking" element={<MoodTracking />} />
            <Route path="/mindfulness" element={<Mindfulness />} />
            <Route path="/sleep-stories" element={<SleepStories />} />
            <Route path="/guided-meditation" element={<GuidedMeditation />} />
            <Route path="/customize-session" element={<CustomizeSession />} />
            <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
          </Routes>
        </Router>
      </AuthProvider>
    </SettingsProvider>
  );
}
