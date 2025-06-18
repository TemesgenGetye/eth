import { useGLTF } from '@react-three/drei';


useGLTF.preload('/model/out_of_stock_cart_wit_0226084018_texture.glb');

export default function Model() {
  const { scene } = useGLTF(
    '/model/out_of_stock_cart_wit_0226084018_texture.glb'
  );

  return (
    <group>
      <primitive object={scene} />;
    </group>
  );
}
