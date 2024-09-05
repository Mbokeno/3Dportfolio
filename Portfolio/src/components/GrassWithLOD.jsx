import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { LOD } from 'three';
import Grass from './Grass';

//So that we can load in more grass with better performance
export default function GrassWithLOD({ width = 100, ...props }) {
  const lodRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (lodRef.current) {
      lodRef.current.update(camera);
    }
  });

  return (
    <lOD ref={lodRef} {...props}>
      <Grass instances={200000} width={width} position={[0, 0, 0]} />
      <Grass instances={120000} width={width} position={[0, 0, 0]} />
      <Grass instances={10000} width={width} position={[0, 0, 0]} />
    </lOD>
  );
}