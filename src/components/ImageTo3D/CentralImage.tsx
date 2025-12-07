import { motion } from 'framer-motion';
import productGadget from '@/assets/product-gadget.png';

interface CentralImageProps {
  progress: number;
}

export const CentralImage = ({ progress }: CentralImageProps) => {
  // Stage 2: 0.3-0.35 - central image visible
  // Stage 3: 0.35-0.45 - crack effect ONLY (no particles yet)
  const stage2End = 0.3;
  const crackStart = 0.35;
  const crackEnd = 0.45;
  const explodeStart = 0.45;

  const isVisible = progress >= stage2End && progress < explodeStart;
  const crackProgress = progress < crackStart ? 0 : Math.min(1, (progress - crackStart) / (crackEnd - crackStart));

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1,
        scale: 1 + crackProgress * 0.05,
      }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.4 }}
    >
      {/* Glow behind */}
      <motion.div 
        className="absolute w-80 h-80 rounded-full bg-primary/20 blur-3xl"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Main image card */}
      <motion.div 
        className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-primary/60 bg-card glow-primary"
        animate={{
          x: crackProgress > 0.3 ? [0, -2, 2, -1, 1, 0] : 0,
        }}
        transition={{
          x: { duration: 0.08, repeat: crackProgress > 0.3 ? Infinity : 0 },
        }}
      >
        <img
          src={productGadget}
          alt="Central product"
          className="w-full h-full object-cover"
        />
        
        {/* Crack overlay - appears before explosion */}
        {crackProgress > 0 && (
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <filter id="crack-glow">
                  <feGaussianBlur stdDeviation="0.8" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Main vertical crack */}
              <motion.path
                d="M50,0 L48,15 L53,25 L46,38 L55,50 L44,62 L52,75 L47,88 L50,100"
                stroke="hsl(148, 100%, 61%)"
                strokeWidth="1"
                fill="none"
                filter="url(#crack-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: crackProgress, opacity: crackProgress }}
              />
              
              {/* Horizontal crack */}
              <motion.path
                d="M0,50 L15,48 L28,53 L42,49 L58,52 L72,47 L85,51 L100,50"
                stroke="hsl(148, 100%, 61%)"
                strokeWidth="0.8"
                fill="none"
                filter="url(#crack-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: crackProgress * 0.9, opacity: crackProgress }}
                transition={{ delay: 0.05 }}
              />
              
              {/* Diagonal cracks */}
              <motion.path
                d="M15,15 L30,30 L50,50 L70,70 L85,85"
                stroke="hsl(148, 100%, 61%)"
                strokeWidth="0.5"
                fill="none"
                filter="url(#crack-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: crackProgress * 0.7, opacity: crackProgress * 0.8 }}
                transition={{ delay: 0.1 }}
              />
              <motion.path
                d="M85,15 L70,30 L50,50 L30,70 L15,85"
                stroke="hsl(148, 100%, 61%)"
                strokeWidth="0.5"
                fill="none"
                filter="url(#crack-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: crackProgress * 0.7, opacity: crackProgress * 0.8 }}
                transition={{ delay: 0.12 }}
              />
              
              {/* Small fracture lines */}
              <motion.path
                d="M30,25 L40,35 M60,25 L70,35 M25,60 L35,70 M65,60 L75,70"
                stroke="hsl(148, 100%, 61%)"
                strokeWidth="0.4"
                fill="none"
                filter="url(#crack-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: crackProgress * 0.6, opacity: crackProgress * 0.6 }}
                transition={{ delay: 0.15 }}
              />
            </svg>
            
            {/* Glowing edges at crack points */}
            <motion.div
              className="absolute inset-0 bg-primary/10"
              animate={{ opacity: [0, crackProgress * 0.3, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.div>
        )}
        
        {/* Final flash before explosion */}
        {crackProgress > 0.85 && (
          <motion.div
            className="absolute inset-0 bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 1] }}
            transition={{ duration: 0.15 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};
