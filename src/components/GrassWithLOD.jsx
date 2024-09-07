import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { LOD } from 'three';
import Grass from './Grass';

//So that we can load in more grass with better performance. LOD "shows meshes with more or less geometry based on distance from the camera". So the farther away it is the less geometry we will use
export default function GrassWithLOD({ width = 100, ...props }) {
  //referencing the LOD object
  const lodRef = useRef();
  //grab the default camera
  const { camera } = useThree();

  //every frame we update the LOD object depending on where the camera is. So if its closer higher detail, farther away less
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
