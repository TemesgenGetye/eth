import { useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';

useGLTF.preload('/model/out_of_stock_cart_wit_0226084018_texture.glb');

export default function Model() {
  const { scene } = useGLTF(
    '/model/out_of_stock_cart_wit_0226084018_texture.glb'
  );

  const [isXlScreen, setIsXlScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsXlScreen(window.innerWidth >= 1280); // xl breakpoint is 1280px
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isXlScreen) {
    return null;
  }

  return (
    <group>
      <primitive object={scene} />
    </group>
  );
}
