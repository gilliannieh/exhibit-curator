import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

function LoadingScreen() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [dots, setDots] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);

  // ASCII art frames for animation
  const artFrames = [
`
+----------------------+
| .------------------. |
| |                  | |
| |       [#]        | |
| |                  | |
| '------------------' |
+----------------------+

     First piece...`,
`
+----------------------+
| .------------------. |
| |                  | |
| |   [#] [#] [#]    | |
| |                  | |
| '------------------' |
+----------------------+

  Filling the walls...`,
`
+----------------------+
| .------------------. |
| |   [#] [#] [#]    | |
| |   [#] [#] [#]    | |
| |                  | |
| '------------------' |
+----------------------+

     Almost ready...`];
  
const completionFrame = [
`
+----------------------+
| .------------------. |
| |   [#] [#] [#]    | |
| |   [#] [*] [#]    | |
| |   [#] [#] [#]    | |
| '------------------' |
+----------------------+

Welcome to your gallery!`];

  // Animate through frames (4 second loading time)
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % artFrames.length);
    }, 1200); 

    // Show completion message 
    const completionTimeout = setTimeout(() => {
      setShowCompletion(true);
    }, 3200); // Show completion at 3.2 seconds

    return () => {
      clearInterval(frameInterval);
      clearTimeout(completionTimeout);
    };
  }, [artFrames.length]);

  // Animate dots 
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 400);

    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-container">
        <pre className="ascii-art">
          {showCompletion ? completionFrame : artFrames[currentFrame]}
        </pre>
        <div className="loading-text">
          <span className="loading-dots">{showCompletion ? '' : dots}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <p className="loading-subtitle">
          {showCompletion 
            ? "Ready to explore amazing artworks!" 
            : "Loading artworks from the Art Institute of Chicago"
          }
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
