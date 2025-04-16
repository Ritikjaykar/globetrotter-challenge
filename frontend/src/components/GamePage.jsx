import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { fetchRandomDestination } from '../utils/fetchDestinations';

const GamePage = ({ user, onLogout }) => {
  const [username, setUsername] = useState(user || '');
  const [destination, setDestination] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [funFact, setFunFact] = useState('');
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [loading, setLoading] = useState(true);
  const [usedDestinations, setUsedDestinations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setUsername(user);
    }
  }, [user, navigate]);

  const fetchNewDestination = useCallback(async () => {
    setLoading(true);
  
    try {
      const usedQuery = usedDestinations.map(d => d.trim().toLowerCase());
      const data = await fetchRandomDestination(usedQuery);
  
      if (data.completed) {
        alert("🎉 You've completed all destinations!");
        return;
      }
  
      const { destination: newDestination, options: newOptions } = data;
  
      if (!newDestination?.destination || !Array.isArray(newOptions) || newOptions.length === 0) {
        throw new Error('Invalid destination data');
      }
  
      // Normalized destination name
      const normalized = newDestination.destination.trim().toLowerCase();
  
      setDestination(newDestination);
      setOptions(newOptions);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setFunFact('');
      setUsedDestinations(prev => (prev.includes(normalized) ? prev : [...prev, normalized]));
    } catch (error) {
      console.error('Error loading destination:', error);
      alert('❌ Unable to load a valid destination. Please refresh or try again later.');
    } finally {
      setLoading(false);
    }
  }, [usedDestinations]);
  

  useEffect(() => {
    fetchNewDestination();
  }, [fetchNewDestination]);

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const correct = answer === destination.destination;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    const fact = destination?.funFacts?.[Math.floor(Math.random() * destination.funFacts.length)] || '';
    setFunFact(fact);
  };

  const handleNext = () => {
    fetchNewDestination();
  };

  const handleChallenge = () => {
    localStorage.setItem('globetrotterScore', score.correct.toString());
    navigate('/challenge');
  };

  const handleLogout = () => {
    onLogout ? onLogout() : navigate('/login');
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white flex flex-col">
      {isCorrect && <Confetti recycle={false} numberOfPieces={400} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🌍 Globetrotter Challenge</h1>
        <div className="flex items-center gap-4">
          <span className="bg-green-500 px-3 py-1 rounded-full font-bold">✅ {score.correct}</span>
          <span className="bg-red-500 px-3 py-1 rounded-full font-bold">❌ {score.incorrect}</span>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Logout</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center my-10">
  <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-white"></div>
  <span className="ml-3 text-lg">Loading destination...</span>
</div>
      ) : (
        <div className="bg-white bg-opacity-10 rounded-xl p-6 w-full max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">🕵 Where am I?</h2>

          {destination?.clues?.length > 0 && (
            <div className="space-y-3 mb-6">
              {destination.clues.map((clue, i) => (
                <div key={i} className="bg-white bg-opacity-20 p-3 rounded">{clue}</div>
              ))}
            </div>
          )}

          {options.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-3 rounded font-bold transition-all ${
                    selectedAnswer
                      ? option === destination.destination
                        ? 'bg-green-500 text-white'
                        : option === selectedAnswer
                        ? 'bg-red-500 text-white animate-shake'
                        : 'bg-white text-black bg-opacity-50'
                      : 'bg-white text-black hover:bg-opacity-75'
                  }`}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-white">Loading options...</div>
          )}

          {selectedAnswer && (
            <>
              <div className="bg-yellow-100 text-black p-4 rounded mb-6">
                <h3 className="text-lg font-bold mb-2">
                  {isCorrect ? '🎉 Correct!' : '😢 Not quite!'}
                </h3>
                <p className="mb-2">💡 <strong>Fun Fact:</strong> {funFact}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleNext}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded flex-1"
                >
                  🎯 Next Destination
                </button>
                <button
                  onClick={handleChallenge}
                  className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded flex-1"
                >
                  🤝 Challenge a Friend
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GamePage;
