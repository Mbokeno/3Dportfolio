import React, { useState, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Stats, Sky, Environment, Stars } from "@react-three/drei";
import gsap from 'gsap';
import { AppSection } from "./styles";
import GrassWithLOD from "./components/GrassWithLOD";
import { Model } from "./components/Model"; 
import { BackgroundAudio } from "./components/BackgroundSound";
import { Html } from "@react-three/drei";

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

function Scene({ isZoomedIn, toggleZoom }) {
  return (
    <>
      <CameraController isZoomedIn={isZoomedIn} />
      <GrassWithLOD width={100} />
      <Model scale={0.8} position={[0, 0, 5]} onClick={toggleZoom} />
      <Environment preset="sunset" />
    </>
  );
}

export default function App() {
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [audioStatus, setAudioStatus] = useState("Press Space to play audio");

  const toggleZoom = useCallback(() => {
    setIsZoomedIn(prev => !prev);
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

  return (
    <AppSection>
       <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', zIndex: 1000 }}>
        <div>Click on the model to zoom in/out</div>
        <div>Press 'M' key to play/pause audio</div>
      </div>
      <Canvas camera={{ position: [0, 5, 25], fov: 30 }}>
        <BackgroundAudio fileName="bgMusic.mp3"/>
        <color attach="background" args={["#121c31"]} />
        <Sky azimuth={1} inclination={0.6} distance={1000} sunPosition={[0,-1,0]}/>
        <Stars radius={100} depth={50} count={10000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.6} />
        <Scene isZoomedIn={isZoomedIn} toggleZoom={toggleZoom} />
      </Canvas>
    </AppSection>
  );
}