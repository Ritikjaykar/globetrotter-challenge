import { useState, useEffect } from 'react';
import { StartGameButton, NoButton } from './Buttons';

export default function GlobetrotterChallenge() {
  const [textPosition, setTextPosition] = useState(100);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextPosition(prev => (prev < -100 ? 100 : prev - 0.08));
    }, 30);
    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 30);

    return () => {
      clearInterval(interval);
      clearInterval(rotationInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/25501.jpg')" }}>

      {/* 🌞 Rotating Image */}
      <img
  src="/set_of_glyph_suns.svg"
  alt="Sun Behind Character"
  className="absolute z-0 w-[90vw] max-w-[700px] left-1/2 -translate-x-1/2 opacity-90 brightness-110 top-[-35%] sm:top-[-40%] md:top-[-45%]"
  style={{
    transform: `translateX(-50%) rotate(${rotation}deg)`
  }}
/>






      {/* 🛰️ Scrolling Main Title */}
      <div
        className="absolute top-1/2 left-1/2 z-[5] -translate-y-1/2 whitespace-nowrap font-barlow font-bold leading-none text-black opacity-100"
        style={{
          transform: `translate(-70%, -17%) translateX(${textPosition}vw)`,
          fontSize: '14vw',     //to auto-scale the title based on screen width.
          textShadow: '0 20px 20px rgba(52, 50, 50, 0.2)'
        }}
      >
        THE GLOBETROTTER CHALLENGE
      </div>

      {/* 👽 SVG Centerpiece */}
      <img
        src="/258288-P4T75J-908.svg"
        alt="Centered SVG"
        className="absolute left-1/2 z-[10] h-[900px] w-[800px] -translate-x-1/2 -translate-y-1/2 top-[50%] sm:top-[55%] md:top-[59%]"
      />

      {/* 🎯 Center Section */}
      <div className="absolute bottom-10 left-1/2 z-[50] w-full max-w-screen px-4 -translate-x-1/2 text-center">
        <div className="mb-8 font-barlow text-5xl sm:text-7xl md:text-8xl font-extrabold text-white" style={{ textShadow: '0 20px 20px rgba(20, 18, 18, 0.2)' }}>
          ARE YOU READY?
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8">
          <StartGameButton />
          <NoButton />
        </div>
      </div>
    </div>
  );
}



