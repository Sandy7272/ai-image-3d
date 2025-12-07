import { motion } from 'framer-motion';
import productBottle from '@/assets/product-bottle.png';

interface CentralImageProps {
  progress: number;
  onExplode: () => void;
}

export const CentralImage = ({ progress, onExplode }: CentralImageProps) => {
  // Stage 2: 0.2-0.4 - image appears
  // Stage 3: 0.4-0.6 - crack and explode
  const stage2Start = 0.2;
  const stage2End = 0.4;
  const stage3Start = 0.4;
  const stage3End = 0.6;

  // Visibility
  const isVisible = progress >= stage2End && progress < stage3End;
  
  // Crack progress
  const crackProgress = progress < stage3Start ? 0 : Math.min(1, (progress - stage3Start) / (stage3End - stage3Start));
  
  // Scale and glitch effects
  const scale = 1 + crackProgress * 0.1;
  const glitchIntensity = crackProgress > 0.3 ? crackProgress : 0;

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: crackProgress < 0.8 ? 1 : 1 - (crackProgress - 0.8) * 5,
        scale,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Glow behind */}
        <div 
          className="absolute -inset-8 rounded-full bg-primary/20 blur-3xl animate-pulse-glow"
          style={{ opacity: 0.5 - crackProgress * 0.5 }}
        />
        
        {/* Main image card */}
        <motion.div 
          className="relative w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden border-2 border-primary/50 bg-card glow-primary"
          style={{
            filter: glitchIntensity > 0 
              ? `hue-rotate(${glitchIntensity * 30}deg) saturate(${1 + glitchIntensity})` 
              : 'none',
          }}
          animate={{
            x: glitchIntensity > 0 ? [0, -3, 3, -1, 0] : 0,
          }}
          transition={{
            x: { duration: 0.1, repeat: glitchIntensity > 0 ? Infinity : 0 },
          }}
        >
          <img
            src={productBottle}
            alt="Central product"
            className="w-full h-full object-cover"
          />
          
          {/* Crack overlay */}
          {crackProgress > 0.2 && (
            <motion.div 
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: crackProgress }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <motion.path
                  d="M50,0 L48,20 L52,25 L45,40 L55,50 L40,60 L50,75 L45,100"
                  stroke="hsl(148, 100%, 61%)"
                  strokeWidth="0.5"
                  fill="none"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: crackProgress }}
                  transition={{ duration: 0.3 }}
                />
                <motion.path
                  d="M0,50 L20,48 L30,55 L50,50 L70,52 L85,48 L100,50"
                  stroke="hsl(148, 100%, 61%)"
                  strokeWidth="0.5"
                  fill="none"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: crackProgress }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
                <motion.path
                  d="M20,20 L35,35 L50,50 L65,65 L80,80"
                  stroke="hsl(148, 100%, 61%)"
                  strokeWidth="0.3"
                  fill="none"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: crackProgress }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                />
                <motion.path
                  d="M80,20 L65,35 L50,50 L35,65 L20,80"
                  stroke="hsl(148, 100%, 61%)"
                  strokeWidth="0.3"
                  fill="none"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: crackProgress }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              </svg>
            </motion.div>
          )}
          
          {/* Flash on explosion */}
          {crackProgress > 0.7 && (
            <motion.div
              className="absolute inset-0 bg-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
