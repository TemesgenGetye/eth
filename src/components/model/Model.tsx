import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Group } from 'three';

useGLTF.preload('/model/out_of_stock_cart_wit_0226084018_texture.glb');

export default function Model() {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(
    '/model/out_of_stock_cart_wit_0226084018_texture.glb'
  );

  return (
    <group>
      <primitive object={scene} />;
    </group>
  );
}
