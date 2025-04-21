import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GlobetrotterChallenge from './components/GlobetrotterChallenge';
import GamePage from './components/GamePage';
import ChallengePage from './components/ChallengePage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import LoadingPage from './components/LoadingPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-login from localStorage
    const savedUser = localStorage.getItem('globetrotterUser');
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  // Add a function to handle login that updates the user state
  const handleLogin = (username) => {
    localStorage.setItem('globetrotterUser', username);
    setUser(username);
  };

  // Add a function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('globetrotterUser');
    setUser(null);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<GlobetrotterChallenge />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/login" 
          element={<LoginPage onLogin={handleLogin} />} 
        />
        <Route 
          path="/game" 
          element={user ? <GamePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/challenge" 
          element={user ? <ChallengePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}