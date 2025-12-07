import { motion } from 'framer-motion';
import productChair from '@/assets/product-chair.png';
import productShoe from '@/assets/product-shoe.png';
import productBottle from '@/assets/product-bottle.png';
import productGadget from '@/assets/product-gadget.png';
import productLamp from '@/assets/product-lamp.png';

interface BentoGridProps {
  progress: number;
  onImagesRef: (refs: { x: number; y: number; width: number; height: number; image: string }[]) => void;
}

const products = [
  { id: 1, image: productChair, alt: 'Designer Chair' },
  { id: 2, image: productShoe, alt: 'Sneaker' },
  { id: 3, image: productBottle, alt: 'Perfume Bottle' },
  { id: 4, image: productGadget, alt: 'Wireless Earbuds' },
  { id: 5, image: productLamp, alt: 'Desk Lamp' },
];

export const BentoGrid = ({ progress, onImagesRef }: BentoGridProps) => {
  // Stage 1: 0-0.2 - show bento grid
  // Stage 2: 0.2-0.4 - merge to center
  const stage1End = 0.2;
  const stage2End = 0.4;

  const gridOpacity = progress < stage2End ? 1 : 0;
  const mergeProgress = progress < stage1End ? 0 : Math.min(1, (progress - stage1End) / (stage2End - stage1End));

  // Calculate positions for merge animation
  const getCardTransform = (index: number, mergeP: number) => {
    // Starting positions in bento grid (relative to center)
    const startPositions = [
      { x: -120, y: -100, scale: 1, rotate: 0 },
      { x: 120, y: -100, scale: 1.1, rotate: 0 },
      { x: -180, y: 100, scale: 0.9, rotate: 0 },
      { x: 0, y: 100, scale: 1, rotate: 0 },
      { x: 180, y: 100, scale: 0.85, rotate: 0 },
    ];

    const start = startPositions[index];
    const endX = 0;
    const endY = 0;
    const endScale = index === 2 ? 1.3 : 0;
    const endRotate = (index - 2) * 15;

    return {
      x: start.x + (endX - start.x) * mergeP,
      y: start.y + (endY - start.y) * mergeP,
      scale: start.scale + (endScale - start.scale) * mergeP,
      rotate: start.rotate + (endRotate - start.rotate) * mergeP,
      opacity: index === 2 ? 1 : 1 - mergeP * 0.8,
    };
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: gridOpacity }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full max-w-2xl h-[400px] md:h-[500px]">
        {products.map((product, index) => {
          const transform = getCardTransform(index, mergeProgress);
          const floatDelay = index * 0.5;

          return (
            <motion.div
              key={product.id}
              className="absolute left-1/2 top-1/2 w-32 h-32 md:w-44 md:h-44"
              style={{
                x: transform.x,
                y: transform.y,
                scale: transform.scale,
                rotate: transform.rotate,
                opacity: transform.opacity,
                marginLeft: '-4.5rem',
                marginTop: '-4.5rem',
              }}
              animate={{
                y: [transform.y - 4, transform.y + 4, transform.y - 4],
              }}
              transition={{
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: floatDelay,
                },
              }}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-primary/30 bg-card/50 backdrop-blur-sm glow-primary-subtle group cursor-pointer">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
