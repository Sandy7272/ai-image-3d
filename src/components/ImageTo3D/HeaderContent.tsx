import { motion } from 'framer-motion';

interface HeaderContentProps {
  progress: number;
}

export const HeaderContent = ({ progress }: HeaderContentProps) => {
  // Fade out headline during model viewer stage
  const headlineOpacity = progress < 0.7 ? 1 : Math.max(0, 1 - (progress - 0.7) / 0.15);
  
  return (
    <motion.div
      className="absolute top-0 left-0 right-0 z-20 pt-12 md:pt-20 px-4"
      style={{ opacity: headlineOpacity }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <span className="badge-neon">
            100% AI-driven • Image to 3D
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="text-foreground">Turn Images</span>
          <br />
          <span className="text-foreground">Into Living </span>
          <span className="text-primary text-glow">3D</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Watch 5 flat images explode into particles and reform as a real-time 3D model. 
          Scroll to explore the magic.
        </motion.p>
      </div>
    </motion.div>
  );
};
