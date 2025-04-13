import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Import monument images
import parisImage from '../assets/paris.svg';
import romeImage from '../assets/rome.svg';
import tokyoImage from '../assets/tokyo.svg';

const GamePage = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('globetrotterUser');
    setUsername(user || 'Guest');
  }, []);

  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [funFact, setFunFact] = useState('');
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [loading, setLoading] = useState(true);
  const [currentMonument, setCurrentMonument] = useState(null);
  const [showMonument, setShowMonument] = useState(false);
  
  // Monument customization options
  const [monumentSize, setMonumentSize] = useState(50); // Size as percentage of screen width
  const [monumentOpacity, setMonumentOpacity] = useState(20); // Opacity as percentage
  const [showCustomizationPanel, setShowCustomizationPanel] = useState(false);

  // Monument image mapping
  const monumentImages = {
    "Paris, France": parisImage,
    "Rome, Italy": romeImage,
    "Tokyo, Japan": tokyoImage
  };

  // Mock destinations data
  const mockDestinations = [
    {
      name: "Paris, France",
      clues: [
        "The city of lights awaits you",
        "Home to a famous tower constructed for a World's Fair"
      ],
      funFacts: [
        "This city has over 170 museums and art galleries",
        "A famous cemetery here is home to over 1 million bodies",
        "It has a smaller replica of the Statue of Liberty",
        "The Louvre was originally built as a fortress in 1190"
      ]
    },
    {
      name: "Rome, Italy",
      clues: [
        "All roads lead to this ancient city",
        "Once the center of a mighty empire"
      ],
      funFacts: [
        "This city contains the smallest country in the world",
        "It has more than 2000 fountains",
        "Locals throw about €1.5 million into one famous fountain annually",
        "It was founded in 753 BC according to legend"
      ]
    },
    {
      name: "Tokyo, Japan",
      clues: [
        "This metropolis has the world's busiest pedestrian crossing",
        "A city where tradition meets futuristic technology"
      ],
      funFacts: [
        "This city has over 200 miles of underground shopping malls",
        "Its metro system carries over 3 billion passengers annually",
        "It has more Michelin-starred restaurants than any other city",
        "You can find over 300,000 vending machines throughout this city"
      ]
    }
  ];

  const fetchRandomDestination = useCallback(() => {
    setLoading(true);
    setShowMonument(false); // Hide monument before loading new one
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockDestinations.length);
      const selectedDestination = mockDestinations[randomIndex];
      setCurrentMonument(monumentImages[selectedDestination.name]);
      
      const otherOptions = mockDestinations
        .filter(dest => dest.name !== selectedDestination.name)
        .map(dest => dest.name);
      
      const wrongAnswers = Array.from({ length: 3 }, () => 
        otherOptions[Math.floor(Math.random() * otherOptions.length)]
      );
      
      const allOptions = [...wrongAnswers, selectedDestination.name];
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
      
      setDestination(selectedDestination);
      setOptions(shuffledOptions);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setFunFact('');
      setLoading(false);
      
      // Trigger monument animation after a short delay
      setTimeout(() => {
        setShowMonument(true);
      }, 300);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchRandomDestination();
  }, [fetchRandomDestination]);

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    const correct = answer === destination.name;
    setIsCorrect(correct);
    
    setScore(prev => correct 
      ? { ...prev, correct: prev.correct + 1 }
      : { ...prev, incorrect: prev.incorrect + 1 }
    );
    
    setFunFact(destination.funFacts[Math.floor(Math.random() * destination.funFacts.length)]);
  };

  const handleNext = () => fetchRandomDestination();
  const handleChallenge = () => {
    const currentScore = score.correct;
    localStorage.setItem('globetrotterScore', currentScore.toString());
    navigate('/challenge');
  };
  
  // Function to toggle customization panel
  const toggleCustomizationPanel = () => {
    setShowCustomizationPanel(!showCustomizationPanel);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="text-xl font-bold text-white flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading your destination...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col py-4">
      {/* Monument with animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {currentMonument && (
          <div className="absolute bottom-0 left-0 w-full flex justify-center">
            <img
              src={currentMonument}
              alt="Destination Monument"
              className={`object-contain transition-all duration-1000 ease-out ${
                showMonument 
                  ? 'translate-y-0 opacity-80' 
                  : 'translate-y-full opacity-0'
              }`}
              style={{
                width: `${monumentSize}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Monument Customization Panel */}
      {showCustomizationPanel && (
        <div className="fixed bottom-4 right-4 z-30 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg text-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Monument Settings</h3>
            <button 
              onClick={toggleCustomizationPanel}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-medium">Size</label>
                <span className="text-xs text-purple-600 font-medium">{monumentSize}%</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="80" 
                value={monumentSize} 
                onChange={(e) => setMonumentSize(parseInt(e.target.value))} 
                className="w-full accent-purple-600"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-medium">Opacity</label>
                <span className="text-xs text-purple-600 font-medium">{monumentOpacity}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="50" 
                value={monumentOpacity} 
                onChange={(e) => setMonumentOpacity(parseInt(e.target.value))} 
                className="w-full accent-purple-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Styled card */}
      <div className="max-w-md mx-auto relative z-20 p-3 flex-1 flex">
        <div className="backdrop-blur-md bg-white/20 rounded-xl shadow-2xl border border-white/30 w-full overflow-hidden">
          
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 relative">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌐</span>
                <h1 className="text-xl font-bold text-white tracking-wide">
                  Globetrotter Challenge
                </h1>
                <p className="text-sm text-white mt-1 ml-2">Welcome, {username} 👋</p>
              </div>
              <button 
                onClick={toggleCustomizationPanel}
                className="text-white bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                title="Customize Monument"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            
            {/* Score display with animated counters */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="bg-white-500 bg-opacity-90 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                <span className="text-white">✅</span>
                <span className="font-bold text-white text-lg">{score.correct}</span>
              </div>
              <div className="bg-white-500 bg-opacity-90 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                <span className="text-white">❌</span>
                <span className="font-bold text-white text-lg">{score.incorrect}</span>
              </div>
            </div>
          </div>

          {/* Content container with elegant styling */}
          <div className="p-4 space-y-4">
            {/* Clues Section - Styled */}
            <div className="bg-blue-50 rounded-lg p-4 shadow-inner">
              <h2 className="text-lg font-bold text-center mb-3 text-indigo-800 flex items-center justify-center gap-2">
                <span>🕵️</span> Where am I?
              </h2>
              <div className="space-y-3">
                {destination.clues.map((clue, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-3 border-l-4 border-indigo-400"
                  >
                    <span className="text-indigo-500">🔍</span>
                    <p className="text-gray-700 text-sm">{clue}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Answer Grid - Stylish buttons */}
            <div className="grid grid-cols-2 gap-3">
              {options.map((option, index) => (
                <button
                  key={index}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm ${
                    selectedAnswer 
                      ? option === destination.name 
                        ? 'bg-green-500 text-white shadow-green-200' 
                        : selectedAnswer === option 
                          ? 'bg-red-500 text-white shadow-red-200' 
                          : 'bg-gray-200 text-gray-500'
                      : 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 hover:shadow-md'
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Feedback Section - Elegant design */}
            {selectedAnswer && (
              <div className={`p-4 rounded-lg shadow-inner ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <h3 className={`text-lg font-bold text-center flex items-center justify-center gap-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{isCorrect ? '🎉' : '❌'}</span>
                  {isCorrect ? 'Correct!' : 'Try Again'}
                </h3>
                <div className="mt-3 text-center">
                  {!isCorrect && (
                    <p className="mb-2 text-gray-700">
                      Correct: <span className="font-semibold text-blue-600">{destination.name}</span>
                    </p>
                  )}
                  <div className="bg-white p-3 rounded-lg border border-yellow-200 text-sm mt-2">
                    <p className="text-gray-700 flex items-start">
                      <span className="text-yellow-500 mr-2">💡</span>
                      <span><span className="font-medium">Fun Fact:</span> {funFact}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons - Stylish */}
            <div className="flex gap-3 mt-4">
              {selectedAnswer && (
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm flex-1 flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Next Destination</span>
                  <span>➡️</span>
                </button>
              )}
              <button
                onClick={handleChallenge}
                className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2 shadow-md ${selectedAnswer ? 'flex-1' : 'w-full'}`}
              >
                <span>Challenge Friend</span>
                <span>🤝</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;