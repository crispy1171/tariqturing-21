
import React, { useEffect, useState } from 'react';

// A simplified Turing machine animation for the landing page
const TuringAnimation = () => {
  const [tapeState, setTapeState] = useState(['0', '1', '0', '1', '0', '1', '0']);
  const [headPosition, setHeadPosition] = useState(3);
  const [currentState, setCurrentState] = useState('q0');
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  
  useEffect(() => {
    // Simple demo animation
    const interval = setInterval(() => {
      // Update tape value based on current state and read symbol
      const newTape = [...tapeState];
      const currentSymbol = tapeState[headPosition];
      
      if (currentState === 'q0' && currentSymbol === '0') {
        newTape[headPosition] = '1';
        setCurrentState('q1');
        setDirection(1);
      } else if (currentState === 'q0' && currentSymbol === '1') {
        newTape[headPosition] = '0';
        setCurrentState('q0');
        setDirection(-1);
      } else if (currentState === 'q1' && currentSymbol === '0') {
        newTape[headPosition] = '1';
        setCurrentState('q0');
        setDirection(1);
      } else if (currentState === 'q1' && currentSymbol === '1') {
        newTape[headPosition] = '1';
        setCurrentState('q1');
        setDirection(-1);
      }
      
      setTapeState(newTape);
      
      // Move the head
      setHeadPosition((prev) => {
        const newPosition = prev + direction;
        // Wrap around if we reach the edges
        if (newPosition >= tapeState.length) return 0;
        if (newPosition < 0) return tapeState.length - 1;
        return newPosition;
      });
      
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [tapeState, headPosition, currentState, direction]);
  
  return (
    <div className="h-full flex flex-col items-center justify-center">
      {/* State visualization */}
      <div className="mb-8 flex items-center gap-8">
        <div className={`state-node ${currentState === 'q0' ? 'active' : ''}`}>q0</div>
        <svg width="60" height="20" className="transition-arrow">
          <line x1="0" y1="10" x2="60" y2="10" strokeWidth="2" />
          <polygon points="60,10 50,5 50,15" fill="currentColor" />
        </svg>
        <div className={`state-node ${currentState === 'q1' ? 'active' : ''}`}>q1</div>
      </div>
      
      {/* Tape visualization */}
      <div className="relative">
        <div className="flex">
          {tapeState.map((cell, index) => (
            <div 
              key={index} 
              className={`tape-cell ${index === headPosition ? 'active' : ''}`}
            >
              {cell}
            </div>
          ))}
        </div>
        
        {/* Head pointer */}
        <div 
          className="absolute top-full left-0 w-12 h-6 flex items-center justify-center"
          style={{ transform: `translateX(${headPosition * 48}px)` }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary animate-pulse">
            <path d="M12 4L12 20" stroke="currentColor" strokeWidth="2" />
            <path d="M4 12L12 4L20 12" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TuringAnimation;
