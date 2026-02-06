import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X, Search, Calendar, Users, FileText, Home, ChevronDown, Activity, Heart, Watch, AlertTriangle, Pill, Video } from 'lucide-react';
import Logo from './components/Logo';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Services from './components/Services';
import DoctorSearch from './components/DoctorSearch';
import Facilities from './components/Facilities';
import About from './components/About';
import Contact from './components/Contact';
import QuickAccess from './components/QuickAccess';
import Footer from './components/Footer';
import ResetPassword from './components/ResetPassword';
import UpdatePassword from './components/UpdatePassword';
import AISymptomChecker from './components/AISymptomChecker';
import AIHealthRiskScore from './components/AIHealthRiskScore';
import WearableDeviceDashboard from './components/WearableDeviceDashboard';
import EmergencyAlertSystem from './components/EmergencyAlertSystem';
import AppointmentSystem from './components/AppointmentSystem';
import MedicationReminder from './components/MedicationReminder';
import VideoConsultation from './components/VideoConsultation';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  return session ? children : <Navigate to="/login" />;
}

function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-gray-200" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600" />
      )}
    </button>
  );
}

function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Only attempt to sign out if there's an active session
      if (session?.user?.id) {
        await signOut();
        navigate('/login');
      } else {
        // If no session exists, just redirect to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during sign out:', error);
      // Still redirect to login on error to ensure user can sign in again
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                <span>AI Health</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 hidden group-hover:block z-50">
                <Link to="/ai-symptom-checker" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-700 flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>AI Symptom Checker</span>
                </Link>
                <Link to="/health-risk-score" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-700 flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Health Risk Score</span>
                </Link>
                <Link to="/wearable-dashboard" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-700 flex items-center space-x-2">
                  <Watch className="w-4 h-4" />
                  <span>Wearable Devices</span>
                </Link>
              </div>
            </div>
            <Link to="/appointments" className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Appointments</span>
            </Link>
            <Link to="/medications" className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors flex items-center space-x-1">
              <Pill className="w-4 h-4" />
              <span>Medications</span>
            </Link>
            <Link to="/emergency-alerts" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Alerts</span>
            </Link>
            {session?.user ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all"
              >
                Sign In
              </Link>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                Services
              </Link>
              <Link
                to="/doctors"
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                Find Doctors
              </Link>
              <Link
                to="/facilities"
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                Facilities
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                Contact
              </Link>
              {session?.user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          
          {/* AI Health Features - Public Access */}
          <Route path="/ai-symptom-checker" element={<AISymptomChecker />} />
          <Route path="/health-risk-score" element={<AIHealthRiskScore />} />
          <Route path="/wearable-dashboard" element={<WearableDeviceDashboard />} />
          
          {/* Patient Management - Public Access */}
          <Route path="/appointments" element={<AppointmentSystem />} />
          <Route path="/medications" element={<MedicationReminder />} />
          <Route path="/emergency-alerts" element={<EmergencyAlertSystem />} />
          <Route path="/video-consultation" element={<VideoConsultation />} />
          
          {/* Legacy Routes */}
          <Route path="/services/*" element={<Services />} />
          <Route path="/doctors" element={<DoctorSearch />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/" element={<QuickAccess />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;