import React, { useRef, useMemo } from 'react'
import { useGLTF, PerspectiveCamera, Html } from '@react-three/drei'
import { HtmlFrame } from "../styles"
import * as THREE from 'three'
import { extend } from '@react-three/fiber'


class ScreenMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        diffuse: { value: new THREE.Color(0x000000) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 diffuse;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(diffuse, 1.0);
        }
      `,
    })
  }
}

// Extend Three.js with material
extend({ ScreenMaterial })


export function Model({ onClick, ...props }) {
<<<<<<< HEAD
  const { nodes, materials } = useGLTF('/3Dportfolio/RetroTV.glb')
=======
  const { nodes, materials } = useGLTF( '/3Dportfolio/RetroTV.glb')
>>>>>>> a47dfe6037f23c33e15d277a4711772d9dddc7fc
  const tvScreenRef = useRef()
  return (
    <group {...props} dispose={null} onClick={onClick}>
      <PerspectiveCamera
       global
       rotation={[0.13, 0.1, 0]}
       polar={[-0.4, 0.2]}
       azimuth={[-1, 0.75]}
       config={{mass:2, tension:400}}
       snap={{mass:4, tension:400}}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.TVFrame.geometry}
        material={materials.Wood}
        position={[0, 4.425, 0]}
        scale={[2.183, 1.183, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Antennabase.geometry}
        material={materials['Scratched Silver Metal']}
        position={[1.007, 5.366, 0]}
        scale={[0.532, 0.473, 0.475]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.TopDialOuter.geometry}
        material={materials['Plastic Grid 04']}
        position={[1.487, 4.654, 0.854]}
        rotation={[1.574, 0, 0]}
        scale={[0.279, 0.176, 0.287]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.LeftKnob.geometry}
        material={materials['Plastic Grid 03']}
        position={[1.21, 5.2, 0.686]}
        rotation={[1.574, 0, 0]}
        scale={[0.091, 0.541, 0.094]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.RightKnob.geometry}
        material={materials['Plastic Grid 03']}
        position={[1.756, 5.2, 0.686]}
        rotation={[1.574, 0, 0]}
        scale={[0.091, 0.541, 0.094]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.MiddleKnob.geometry}
        material={materials['Plastic Grid 03']}
        position={[1.479, 5.2, 0.686]}
        rotation={[1.574, 0, 0]}
        scale={[0.091, 0.541, 0.094]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.InnerFrame.geometry}
        material={materials['Scratched Silver Metal']}
        position={[0, 4.425, 0]}
        scale={[2.183, 1.183, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.TVBackground.geometry}
        material={materials['Nylon table cover']}
        position={[0, 4.425, 0]}
        scale={[2.183, 1.183, 1]}
      />
          <mesh
        ref={tvScreenRef}
        castShadow
        receiveShadow
        geometry={nodes.TVSCreen.geometry}
        material={materials['Gun Plastic']}
        position={[0, 4.425, -0.034]}
        scale={[2.31, 1.245, 1]}
      >
        <screenMaterial />
        <Html
          transform
          wrapperClass="html-wrapper"
          distanceFactor={1}
          position={[-0.26, .04, .95]} 
          scale={[.415, 1.01, .5]}
          occlude={[tvScreenRef]}
          zIndexRange={[0, 0]}
        >
          <HtmlFrame src="https://mbokeno.github.io/2DPortfolio/" />
        </Html>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.TopDialInner.geometry}
        material={materials.Plastic}
        position={[1.487, 4.654, 0.854]}
        rotation={[1.574, 0, 0]}
        scale={[0.279, 0.176, 0.287]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.BottomDialOuter.geometry}
        material={materials['Plastic Grid 04']}
        position={[1.487, 3.891, 0.854]}
        rotation={[1.574, 0, 0]}
        scale={[0.279, 0.176, 0.287]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.BottomDialInner.geometry}
        material={materials.Plastic}
        position={[1.487, 3.891, 0.854]}
        rotation={[1.574, 0, 0]}
        scale={[0.279, 0.176, 0.287]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.TopDialKnob.geometry}
        material={materials['Plastic 1']}
        position={[1.489, 4.653, 0.984]}
        rotation={[0, 0, -0.437]}
        scale={[0.011, 0.191, 0.055]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.TobDialKnob.geometry}
        material={materials['Plastic 1']}
        position={[1.489, 3.884, 0.984]}
        rotation={[0, 0, 0.178]}
        scale={[0.011, 0.191, 0.055]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.RightAntenna.geometry}
        material={materials['Gun Plastic']}
        position={[1.45, 6.218, 0]}
        rotation={[0, 0, 2.668]}
        scale={[-0.008, -0.758, -0.006]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.LeftAntenna.geometry}
        material={materials['Gun Plastic']}
        position={[0.725, 6.306, 0]}
        rotation={[0, 0, -2.897]}
        scale={[-0.008, -0.758, -0.006]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Table.geometry}
        material={materials['Wood.005']}
        position={[2.815, 1.423, -1.69]}
        scale={[0.287, 1.546, 0.157]}
      />
    </group>
  )
}

<<<<<<< HEAD
useGLTF.preload('/3Dportfolio/RetroTV.glb')
=======
useGLTF.preload( '/3Dportfolio/RetroTV.glb')
>>>>>>> a47dfe6037f23c33e15d277a4711772d9dddc7fc
