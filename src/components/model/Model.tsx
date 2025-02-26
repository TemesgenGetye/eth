import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Group } from 'three';

useGLTF.preload('/models/out_of_stock_cart.glb');

export default function Model() {
  const group = useRef<Group>(null);
  const { nodes, materials, animations, scene } = useGLTF(
    '/model/out_of_stock_cart.glb'
  );

  return (
    <group>
      <primitive object={scene} />;
    </group>
  );
}
