import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ChallengePage = ({ user }) => {
  const [username, setUsername] = useState(user || '');
  const [inviterScore, setInviterScore] = useState(null);
  const [inviterName, setInviterName] = useState('');
  const [currentScore, setCurrentScore] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const score = params.get('score');
    const name = params.get('inviter');

    if (score) {
      setInviterScore(parseInt(score));
      setInviterName(decodeURIComponent(name || 'A Traveler'));
    }

    const storedScore = localStorage.getItem('globetrotterScore');
    if (storedScore) {
      setCurrentScore(parseInt(storedScore));
    }

    if (!username && localStorage.getItem('globetrotterUser')) {
      setUsername(localStorage.getItem('globetrotterUser'));
    }
  }, [location, username, user]);

  const handleRegistration = (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    localStorage.setItem('globetrotterUser', username);
    navigate('/game');
  };

  const handleShareChallenge = async () => {
    const currentUser = localStorage.getItem('globetrotterUser') || 'Traveler';
    const userScore = localStorage.getItem('globetrotterScore') || '0';

    const shareData = {
      title: '🌍 Globetrotter Challenge',
      text: `${currentUser} scored ${userScore}! Can you beat it?`,
      url: `${window.location.origin}/challenge?score=${userScore}&inviter=${encodeURIComponent(currentUser)}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const whatsappMessage = encodeURIComponent(
          `Join me in the Globetrotter Challenge! 🌐\n\n` +
          `${currentUser} scored ${userScore} points!\n` +
          `Can you beat this score?\n\n` +
          `${shareData.url}`
        );
        window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');
      }
    } catch (error) {
      console.log('Sharing cancelled or failed', error);
    }
  };

  const ScoreDisplay = () => (
    <div id="score-card" className="bg-white/10 p-6 rounded-xl mb-4">
      <h2 className="text-2xl font-bold text-white mb-2">🏆 Your Current Score</h2>
      <p className="text-white text-lg">{username || 'Traveler'}</p>
      <div className="text-4xl font-bold text-yellow-400 my-4">{currentScore}</div>
      <p className="text-white/80 text-sm">Challenge friends to beat your score!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 p-4">
      <div className="max-w-md mx-auto bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-2xl">
        {inviterScore ? (
          <div className="text-center space-y-6">
            <div id="score-card" className="bg-white/10 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-2">🏆 Challenge Received!</h2>
              <p className="text-white text-lg">{inviterName} scored:</p>
              <div className="text-4xl font-bold text-yellow-400 my-4">{inviterScore}</div>
              <p className="text-white/80 text-sm">Can you beat this score?</p>
            </div>

            <button
              onClick={() => navigate('/game')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
            >
              Accept Challenge 🏁
              <span className="text-xl">🌍</span>
            </button>
          </div>
        ) : username ? (
          <div className="text-center space-y-6">
            <ScoreDisplay />

            <button
              onClick={() => navigate('/game')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
            >
              Continue Adventure
              <span className="text-xl">🌍</span>
            </button>

            <div className="mt-6 border-t border-white/20 pt-6">
              <button
                onClick={handleShareChallenge}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                Challenge Friends
                <span className="text-xl">🤝</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegistration} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">✨ Create Your Traveler Profile</h2>
              <p className="text-white/80">Choose a unique name to start your journey</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter traveler name"
                required
                minLength="3"
                maxLength="15"
              />

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                Start Adventure
                <span className="text-xl">🌐</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChallengePage;
