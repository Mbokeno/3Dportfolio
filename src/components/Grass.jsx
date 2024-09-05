import * as THREE from 'three';
import React, { useRef, useMemo, useEffect } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
//Grass textures found online
import bladeDiffuse from '../assets/blade_diffuse.jpg';
import bladeAlpha from '../assets/blade_alpha.jpg';
import GrassMaterial from './GrassMaterial';

export default function Grass({
  options = { bW: 0.12, bH: 1, joints: 5 },
  width = 100,
  instances = 50000,
  height = 1,
  ...props
}) {
  const { bW, joints } = options;
  const bH = height;  // Use the height prop instead of the default in options
  const materialRef = useRef();
  const meshRef = useRef();
  const [texture, alphaMap] = useLoader(THREE.TextureLoader, [bladeDiffuse, bladeAlpha]);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(bW, bH, 1, joints);
    geo.translate(0, bH / 2, 0);
    return geo;
  }, [bW, bH, joints]);

  // Generate static positions, scales, and rotations
  const [positions, scales, rotations] = useMemo(() => {
    const positions = new Float32Array(instances * 3);
    const scales = new Float32Array(instances);
    const rotations = new Float32Array(instances);
  
    for (let i = 0; i < instances; i++) {
      const i3 = i * 3;
      // Use square root for more uniform distribution
      const radius = Math.sqrt(Math.random()) * (width / 2);
      const theta = Math.random() * 2 * Math.PI;
      positions[i3] = radius * Math.cos(theta);
      positions[i3 + 1] = 0;
      positions[i3 + 2] = radius * Math.sin(theta);
      scales[i] = 0.5 + Math.random() * 0.5;
      rotations[i] = Math.random() * Math.PI;
    }
  
    return [positions, scales, rotations];
  }, [instances, width]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.geometry.setAttribute('scale', new THREE.InstancedBufferAttribute(scales, 1));
      meshRef.current.geometry.setAttribute('rotation', new THREE.InstancedBufferAttribute(rotations, 1));
      
      // Set instance positions
      const dummy = new THREE.Object3D();
      for (let i = 0; i < instances; i++) {
        dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [positions, scales, rotations, instances]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <group {...props}>
      <instancedMesh ref={meshRef} args={[geometry, null, instances]}>
        <GrassMaterial 
          ref={materialRef}
          map={texture} 
          alphaMap={alphaMap} 
          toneMapped={false}
          transparent
          side={THREE.DoubleSide}
          bladeHeight={height}
        />
      </instancedMesh>
    </group>
  );
}