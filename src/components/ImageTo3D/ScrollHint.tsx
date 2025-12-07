import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollHintProps {
  progress: number;
}

export const ScrollHint = ({ progress }: ScrollHintProps) => {
  // Fade out as user scrolls
  const opacity = progress < 0.1 ? 1 : Math.max(0, 1 - (progress - 0.1) / 0.1);

  if (opacity <= 0) return null;

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      style={{ opacity }}
    >
      <span className="text-xs text-muted-foreground tracking-wider uppercase">
        Scroll to transform
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <ChevronDown className="w-5 h-5 text-primary" />
      </motion.div>
    </motion.div>
  );
};
