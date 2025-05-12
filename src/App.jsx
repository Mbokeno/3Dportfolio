import React, { useState, useCallback, useEffect, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Stats, Sky, Environment, Stars } from "@react-three/drei";
import gsap from 'gsap';
import { AppSection } from "./styles";
import GrassWithLOD from "./components/GrassWithLOD";
import { Model } from "./components/Model"; 
import { BackgroundAudio } from "./components/BackgroundSound";
import { Html } from "@react-three/drei";

// Loading component that will display during scene initialization
function LoadingScreen({ isComplete, onAnimationComplete }) {
  const [progress, setProgress] = useState(0);
  const [animationState, setAnimationState] = useState('loading'); // 'loading', 'complete', 'fading'
  const [opacity, setOpacity] = useState(1);
  
  useEffect(() => {
    if (!isComplete) {
      // Simulate loading progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 98 ? 98 : newProgress; // Cap at 98% until actually complete
        });
      }, 150);
      
      return () => clearInterval(interval);
    } else {
      // When loading is complete
      setProgress(100);
      setAnimationState('complete');
      
      // Wait for completion animation to finish
      const completionTimer = setTimeout(() => {
        setAnimationState('fading');
        // Start fading out
        const fadeTimer = setTimeout(() => {
          onAnimationComplete();
        }, 1000); // Fade out duration
        
        return () => clearTimeout(fadeTimer);
      }, 800); // Time to show 100% before fading
      
      return () => clearTimeout(completionTimer);
    }
  }, [isComplete, onAnimationComplete]);
  
  useEffect(() => {
    if (animationState === 'fading') {
      // Animate opacity from 1 to 0
      setOpacity(0);
    }
  }, [animationState]);
  
  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121c31', // Match your scene background
      color: 'white',
      zIndex: 1000,
      fontFamily: 'Arial, sans-serif',
      opacity: opacity,
      transition: 'opacity 1s ease', // Smooth fade out
    }}>
      <h2>{animationState === 'loading' ? 'Loading Portfolio...' : 'Ready!'}</h2>
      <div style={{
        width: '300px',
        height: '20px',
        backgroundColor: '#1e293b',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: '20px 0',
        position: 'relative'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: animationState === 'loading' ? '#60a5fa' : '#4ade80', // Blue -> Green when complete
          borderRadius: '10px',
          transition: animationState === 'complete' ? 'width 0.5s ease-out, background-color 0.5s ease' : 'width 0.3s ease',
          boxShadow: animationState !== 'loading' ? '0 0 10px #4ade80' : 'none' // Glow effect when complete
        }} />
      </div>
      <p style={{
        transition: 'transform 0.5s ease',
        transform: animationState === 'complete' ? 'scale(1.2)' : 'scale(1)'
      }}>{Math.round(progress)}%</p>
    </div>
  );
}

// Component to track and signal when all assets are loaded
function SceneLoader({ onLoaded }) {
  const { gl, scene } = useThree();
  
  useEffect(() => {
    // Signal that scene is ready after a reasonable time for assets to load
    // This is a simple approach; for more precision, you could track actual asset loading
    const timeout = setTimeout(() => {
      onLoaded();
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [onLoaded]);
  
  return null;
}

//Camera only zooms in and out on the tv. Set positions were determined beforehand
function CameraController({ isZoomedIn }) {
  const { camera } = useThree();
  const zoomedOutPosition = [0, 5, 25];
  const zoomedInPosition = [0, 3, 10];
  const lookAtPoint = [0, 4, 0];

  useEffect(() => {
    gsap.to(camera.position, {
      duration: 1.5,
      x: isZoomedIn ? zoomedInPosition[0] : zoomedOutPosition[0],
      y: isZoomedIn ? zoomedInPosition[1] : zoomedOutPosition[1],
      z: isZoomedIn ? zoomedInPosition[2] : zoomedOutPosition[2],
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(...lookAtPoint);
      }
    });
  }, [isZoomedIn, camera]);

  return null;
}

//Setting up the scene in a function before hand to be called
function Scene({ isZoomedIn, toggleZoom, onSceneLoaded }) {
  return (
    <>
      <SceneLoader onLoaded={onSceneLoaded} />
      <CameraController isZoomedIn={isZoomedIn} />
      <GrassWithLOD width={100} />
      <Model scale={0.8} position={[0, 0, 5]} onClick={toggleZoom} />
      <Environment preset="sunset" />
    </>
  );
}

export default function App() {
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [audioStatus, setAudioStatus] = useState("Press 'M' to play audio");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  const toggleZoom = useCallback(() => {
    setIsZoomedIn(prev => !prev);
  }, []);

  const handleSceneLoaded = useCallback(() => {
    // Signal that loading is complete but keep showing the loading screen
    setLoadingComplete(true);
  }, []);
  
  const handleLoadingAnimationComplete = useCallback(() => {
    // This will be called after the fade-out animation completes
    setShowLoadingScreen(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        setAudioStatus(prev => prev === "Audio playing" ? "Audio paused" : "Audio playing");
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Pre-load critical assets
  useEffect(() => {
    // You could add code here to preload textures or models
    // This helps reduce the actual loading time when the canvas mounts
  }, []);

  return (
    <AppSection>
      {showLoadingScreen && (
        <LoadingScreen 
          isComplete={loadingComplete} 
          onAnimationComplete={handleLoadingAnimationComplete} 
        />
      )}
      
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        color: 'white', 
        zIndex: 1000,
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 0.5s ease'
      }}>
        <div>Click on the model to zoom in/out</div>
        <div>Press 'M' key to play/pause audio</div>
      </div>
      
      <Canvas camera={{ position: [0, 5, 25], fov: 30 }}>
        <Suspense fallback={null}>
          <BackgroundAudio fileName="bgMusic.mp3"/>
          <color attach="background" args={["#121c31"]} />
          <Sky azimuth={1} inclination={0.6} distance={1000} sunPosition={[0,-1,0]}/>
          <Stars radius={100} depth={50} count={10000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.6} />
          <Scene isZoomedIn={isZoomedIn} toggleZoom={toggleZoom} onSceneLoaded={handleSceneLoaded} />
        </Suspense>
      </Canvas>
    </AppSection>
  );
}