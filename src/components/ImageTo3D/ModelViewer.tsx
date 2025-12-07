import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, MeshDistortMaterial, RoundedBox } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface ModelViewerProps {
  progress: number;
}

// Placeholder 3D model - a stylized abstract product
const PlaceholderModel = ({ autoRotate }: { autoRotate: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={meshRef as any}>
        {/* Main body */}
        <RoundedBox args={[1.5, 2, 1]} radius={0.15} smoothness={4}>
          <MeshDistortMaterial
            color="#1a1a2e"
            roughness={0.3}
            metalness={0.8}
            distort={hovered ? 0.1 : 0.05}
            speed={2}
          />
        </RoundedBox>
        
        {/* Accent ring */}
        <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#38ff8b"
            emissive="#38ff8b"
            emissiveIntensity={0.5}
            metalness={1}
            roughness={0.2}
          />
        </mesh>
        
        {/* Top cap */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 0.3, 32]} />
          <meshStandardMaterial
            color="#2a2a3e"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Glowing accent */}
        <pointLight position={[0, 0, 2]} intensity={0.5} color="#38ff8b" />
      </group>
    </Float>
  );
};

// Loading fallback
const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#38ff8b" wireframe />
  </mesh>
);

export const ModelViewer = ({ progress }: ModelViewerProps) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();

  // Stage timing
  const stage4End = 0.8;
  const stage5Start = 0.8;

  const isVisible = progress >= stage4End;
  const viewerOpacity = progress < stage5Start ? 0 : Math.min(1, (progress - stage5Start) / 0.1);

  const handleInteractionStart = () => {
    setIsInteracting(true);
    setAutoRotate(false);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  };

  const handleInteractionEnd = () => {
    setIsInteracting(false);
    interactionTimeoutRef.current = setTimeout(() => {
      setAutoRotate(true);
    }, 2000);
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
      className="absolute inset-0 flex flex-col items-center justify-center px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: viewerOpacity, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* 3D Viewer Card */}
      <div 
        className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden border border-primary/40 bg-card/80 backdrop-blur-xl glow-primary"
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
        
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 2]}
        >
          <Suspense fallback={<LoadingFallback />}>
            <ambientLight intensity={0.4} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={1}
              color="#ffffff"
            />
            <spotLight
              position={[-10, -5, -10]}
              angle={0.3}
              penumbra={1}
              intensity={0.5}
              color="#38ff8b"
            />
            
            <PlaceholderModel autoRotate={autoRotate} />
            
            <OrbitControls
              enableZoom={false}
              enablePan={true}
              panSpeed={0.5}
              rotateSpeed={0.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
            
            <Environment preset="city" />
          </Suspense>
        </Canvas>

        {/* Interaction hint */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInteracting ? 0 : 1 }}
          transition={{ delay: 1 }}
        >
          Drag to rotate • Pan to move
        </motion.div>
      </div>

      {/* Caption below viewer */}
      <motion.div
        className="mt-8 text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: viewerOpacity, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
          From flat pixels to real-time 3D
        </h3>
        <p className="text-sm md:text-base text-muted-foreground mb-6">
          This is how MetaShop turns your images into interactive 3D assets, ready for AR, web, and e-commerce.
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
          className="block mt-4 text-sm text-primary/80 hover:text-primary transition-colors"
          whileHover={{ x: 5 }}
        >
          See how it works →
        </motion.a>
      </motion.div>
    </motion.div>
  );
};
