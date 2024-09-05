import * as THREE from 'three';
import React, { Suspense, useState, useCallback, useRef, useEffect } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Stats, Sky, PresentationControls, Environment, Stars } from "@react-three/drei"
import { useSpring, animated } from '@react-spring/three'
import GrassWithLOD from "./components/GrassWithLOD"
import { AppSection } from "./styles"
import { Model } from "./components/Model"

function CameraController({ target, lookAt }) {
  const { camera } = useThree();
  const { position } = useSpring({
    position: target,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  useFrame(() => {
    camera.position.set(position.get()[0], position.get()[1], position.get()[2]);
    camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
    camera.updateProjectionMatrix();
  });

  return null;
}

function ControlledPresentationControls({ isEnabled, children, ...props }) {
  if (!isEnabled) {
    return children;
  }
  return (
    <PresentationControls {...props}>
      {children}
    </PresentationControls>
  );
}

export default function App() {
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  const zoomedOutPosition = [0, 5, 25];
  const zoomedInPosition = [0, 3, 10]; // Adjust this to change zoom target
  const lookAtPoint = [0, 4, 0]; // This is where the camera will look at

  const handleTVClick = useCallback(() => {
    setIsZoomedIn(prev => !prev);
  }, []);

  const cameraTarget = isZoomedIn ? zoomedInPosition : zoomedOutPosition;

  return (
    <AppSection>
      <Canvas camera={{ position: zoomedOutPosition, fov: 30 }}>
        <CameraController target={cameraTarget} lookAt={lookAtPoint} />
        <color attach="background" args={["#121c31"]} />
        <Sky azimuth={1} inclination={0.6} distance={1000} sunPosition={[0,-1,0]}/>
        <Stars radius={100} depth={50} count={10000} factor={4} saturation={0} fade speed={1} />

        <ambientLight intensity={0.6} />
        <Suspense fallback={null}>
          <ControlledPresentationControls
            isEnabled={!isZoomedIn}
            global
            zoom={.1}
            polar={[0,0]}
            azimuth={[-Math.PI / 6, Math.PI / 6]}
          >
            <GrassWithLOD width={100} />
            <Model scale={0.8} position={[0, 0, 5]} onClick={handleTVClick}/>
          </ControlledPresentationControls>
          <Environment preset="sunset" />
        </Suspense>
        
        <Stats />
      </Canvas>
    </AppSection>
  )
}
