import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BentoGrid } from './BentoGrid';
import { CentralImage } from './CentralImage';
import { ParticleSystem } from './ParticleSystem';
import { ModelViewer } from './ModelViewer';
import { ScrollHint } from './ScrollHint';
import { HeaderContent } from './HeaderContent';

export const ImageTo3DExperience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      setProgress(value);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div ref={scrollContainerRef} className="relative h-[500vh]">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-background">
          {/* Ambient glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, hsl(148, 100%, 61%, 0.1) 0%, transparent 70%)',
            }}
          />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(148, 100%, 61%) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(148, 100%, 61%) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Main content container */}
        <div 
          ref={containerRef}
          className="relative h-full w-full"
        >
          {/* Header with badge, headline, and subtext */}
          <HeaderContent progress={progress} />

          {/* Stage 1 & 2: Bento Grid */}
          <BentoGrid 
            progress={progress} 
            onImagesRef={() => {}}
          />

          {/* Stage 2 & 3: Central Image with crack effect */}
          <CentralImage 
            progress={progress}
            onExplode={() => {}}
          />

          {/* Stage 3 & 4: Particle System */}
          <ParticleSystem 
            progress={progress}
            containerRef={containerRef}
          />

          {/* Stage 5: 3D Model Viewer */}
          <ModelViewer progress={progress} />

          {/* Scroll hint at bottom */}
          <ScrollHint progress={progress} />
        </div>

        {/* Progress indicator (subtle) */}
        <motion.div
          className="absolute bottom-4 right-4 text-xs text-muted-foreground/40 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {Math.round(progress * 100)}%
        </motion.div>
      </div>
    </div>
  );
};
