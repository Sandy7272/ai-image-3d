import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, RoundedBox, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface ModelViewerProps {
  progress: number;
}

// Stylized 3D product model
const ProductModel = ({ autoRotate }: { autoRotate: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += 0.004;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Main body */}
        <RoundedBox args={[1.8, 2.4, 1.2]} radius={0.2} smoothness={4}>
          <MeshDistortMaterial
            color="#0f0f1a"
            roughness={0.2}
            metalness={0.9}
            distort={0.03}
            speed={1.5}
          />
        </RoundedBox>
        
        {/* Glowing accent rings */}
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.1, 0.04, 16, 100]} />
          <meshStandardMaterial
            color="#38ff8b"
            emissive="#38ff8b"
            emissiveIntensity={0.8}
            metalness={1}
            roughness={0.1}
          />
        </mesh>
        
        <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.0, 0.03, 16, 100]} />
          <meshStandardMaterial
            color="#38ff8b"
            emissive="#38ff8b"
            emissiveIntensity={0.5}
            metalness={1}
            roughness={0.1}
          />
        </mesh>
        
        {/* Top piece */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 0.4, 32]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>

        {/* Inner glow */}
        <pointLight position={[0, 0, 1.5]} intensity={0.8} color="#38ff8b" distance={5} />
        <pointLight position={[0, 0, -1.5]} intensity={0.4} color="#38ff8b" distance={4} />
      </Float>
      
      {/* Ambient sparkles */}
      <Sparkles count={50} size={2} speed={0.3} color="#38ff8b" opacity={0.6} scale={5} />
    </group>
  );
};

const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#38ff8b" wireframe opacity={0.5} transparent />
  </mesh>
);

export const ModelViewer = ({ progress }: ModelViewerProps) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();

  // Stage timing - appears after particles converge
  const stage5Start = 0.78;
  const isVisible = progress >= stage5Start;
  const viewerOpacity = Math.min(1, (progress - stage5Start) / 0.1);

  const handleInteractionStart = () => {
    setAutoRotate(false);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  };

  const handleInteractionEnd = () => {
    interactionTimeoutRef.current = setTimeout(() => {
      setAutoRotate(true);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: viewerOpacity, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="w-[500px] h-[500px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, hsl(148, 100%, 61%, 0.2) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* 3D Canvas - NO box wrapper */}
      <div 
        className="relative w-full max-w-lg aspect-square"
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 40 }}
          dpr={[1, 2]}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <ambientLight intensity={0.3} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={1.2}
              color="#ffffff"
            />
            <spotLight
              position={[-10, -5, -10]}
              angle={0.3}
              penumbra={1}
              intensity={0.6}
              color="#38ff8b"
            />
            
            <ProductModel autoRotate={autoRotate} />
            
            <OrbitControls
              enableZoom={false}
              enablePan={true}
              panSpeed={0.4}
              rotateSpeed={0.6}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Suspense>
        </Canvas>

        {/* Interaction hint */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Drag to rotate
        </motion.div>
      </div>

      {/* Caption and CTA below */}
      <motion.div
        className="mt-6 text-center max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: viewerOpacity, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
          From flat pixels to real-time <span className="text-primary">3D</span>
        </h3>
        <p className="text-sm md:text-base text-muted-foreground mb-8">
          MetaShop transforms your images into interactive 3D assets for AR, web, and e-commerce.
        </p>
        
        <motion.button
          className="btn-cta text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Try Image to 3D
        </motion.button>
        
        <motion.a
          href="#"
          className="block mt-4 text-sm text-primary/70 hover:text-primary transition-colors"
          whileHover={{ x: 5 }}
        >
          See how it works →
        </motion.a>
      </motion.div>
    </motion.div>
  );
};
