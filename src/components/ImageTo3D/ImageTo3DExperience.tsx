import { useRef, useEffect, useState } from 'react';
import { useScroll } from 'framer-motion';
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
          {/* Ambient center glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(148, 100%, 61%, 0.08) 0%, transparent 70%)',
            }}
          />
          
          {/* Subtle grid */}
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(148, 100%, 61%) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(148, 100%, 61%) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Content container */}
        <div 
          ref={containerRef}
          className="relative h-full w-full"
        >
          {/* Header - positioned at top, moves up on scroll */}
          <HeaderContent progress={progress} />

          {/* Stages happen in the center area */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: '80px' }}>
            {/* Stage 1-2: Bento Grid */}
            <BentoGrid progress={progress} />

            {/* Stage 2-3: Central Image with crack */}
            <CentralImage progress={progress} />

            {/* Stage 3-4: Particles */}
            <ParticleSystem 
              progress={progress}
              containerRef={containerRef}
            />

            {/* Stage 5: 3D Model */}
            <ModelViewer progress={progress} />
          </div>

          {/* Scroll hint */}
          <ScrollHint progress={progress} />
        </div>
      </div>
    </div>
  );
};
