import * as THREE from 'three';
import React, { Suspense, useState, useCallback, useRef, useEffect } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Stats, Sky, Environment, Stars, OrbitControls } from "@react-three/drei"
import { useSpring, animated } from '@react-spring/three'
import GrassWithLOD from "./components/GrassWithLOD"
import { AppSection } from "./styles"
import { Model } from "./components/Model"

function CameraController({ isZoomedIn, zoomedOutPosition, zoomedInPosition, lookAtPoint }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  const { position } = useSpring({
    position: isZoomedIn ? zoomedInPosition : zoomedOutPosition,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  useFrame(() => {
    camera.position.set(position.get()[0], position.get()[1], position.get()[2]);
    camera.lookAt(new THREE.Vector3(...lookAtPoint));
    camera.updateProjectionMatrix();
    
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !isZoomedIn;
    }
  }, [isZoomedIn]);

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableZoom={!isZoomedIn}
      enableRotate={!isZoomedIn}
      enablePan={false}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 2}
      minAzimuthAngle={-Math.PI / 6}
      maxAzimuthAngle={Math.PI / 6}
    />
  );
}

export default function App() {
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const zoomedOutPosition = [0, 5, 25];
  const zoomedInPosition = [0, 3, 10];
  const lookAtPoint = [0, 4, 0];

  const handleTVClick = useCallback(() => {
    setIsZoomedIn(prev => !prev);
  }, []);

  return (
    <AppSection>
      <Canvas>
        <CameraController 
          isZoomedIn={isZoomedIn}
          zoomedOutPosition={zoomedOutPosition}
          zoomedInPosition={zoomedInPosition}
          lookAtPoint={lookAtPoint}
        />
        <color attach="background" args={["#121c31"]} />
        <Sky azimuth={1} inclination={0.6} distance={1000} sunPosition={[0,-1,0]}/>
        <Stars radius={100} depth={50} count={10000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.6} />
        <Suspense fallback={null}>
          <GrassWithLOD width={100} />
          <Model scale={0.8} position={[0, 0, 5]} onClick={handleTVClick}/>
          <Environment preset="sunset" />
        </Suspense>
        <Stats />
      </Canvas>
    </AppSection>
  )
}
