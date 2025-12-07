import { motion } from 'framer-motion';

interface HeaderContentProps {
  progress: number;
}

export const HeaderContent = ({ progress }: HeaderContentProps) => {
  // Header fades out as images appear prominently
  const headerOpacity = progress < 0.6 ? 1 : Math.max(0, 1 - (progress - 0.6) / 0.15);
  
  // Move header up as scroll progresses to avoid overlap
  const headerY = progress * -80;
  
  return (
    <motion.div
      className="absolute top-0 left-0 right-0 z-30 pt-8 md:pt-12 px-4 pointer-events-none"
      style={{ opacity: headerOpacity, y: headerY }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <span className="badge-neon text-[10px] md:text-xs">
            100% AI-driven • Image to 3D
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="text-foreground">Turn Images</span>
          <br />
          <span className="text-foreground">Into Living </span>
          <span className="text-primary text-glow">3D</span>
        </motion.h1>

        {/* Subtext - shorter */}
        <motion.p
          className="text-sm md:text-base text-muted-foreground max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Scroll to watch images transform into an interactive 3D model.
        </motion.p>
      </div>
    </motion.div>
  );
};
