import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ScrollControls, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import Model from './Model';

function MovingModel() {
  const ref = useRef<THREE.Group>(null);
  const scroll = useScroll();

  useFrame(({ clock }) => {
    if (ref.current) {
      // Move the cart left to right
      ref.current.position.x = Math.sin(clock.getElapsedTime()) * 2; // Adjust the multiplier for speed/range

      // Optional: Scroll-based Movement (up/down)
      // ref.current.position.y = -scroll.offset * 5; // Moves up/down as you scroll
    }
  });

  return (
    <group ref={ref} scale={[2, 2, 2]}>
      <Model />
    </group>
  );
}

export function CartModel() {
  return (
    <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Model with Scroll Controls */}
      <Suspense fallback={null}>
        <ScrollControls pages={1} damping={1.5}>
          <MovingModel />
        </ScrollControls>
      </Suspense>

      {/* Orbit Controls (without zoom) */}
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
