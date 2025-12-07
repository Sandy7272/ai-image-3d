import { motion } from 'framer-motion';
import productChair from '@/assets/product-chair.png';
import productShoe from '@/assets/product-shoe.png';
import productBottle from '@/assets/product-bottle.png';
import productGadget from '@/assets/product-gadget.png';
import productLamp from '@/assets/product-lamp.png';

interface BentoGridProps {
  progress: number;
}

const products = [
  { id: 1, image: productChair, alt: 'Designer Chair' },
  { id: 2, image: productShoe, alt: 'Sneaker' },
  { id: 3, image: productBottle, alt: 'Perfume Bottle' },
  { id: 4, image: productGadget, alt: 'Wireless Earbuds' },
  { id: 5, image: productLamp, alt: 'Desk Lamp' },
];

export const BentoGrid = ({ progress }: BentoGridProps) => {
  // Stage 1: 0-0.15 - show bento grid
  // Stage 2: 0.15-0.3 - merge to center (all same size)
  const stage1End = 0.15;
  const stage2End = 0.3;

  const isVisible = progress < stage2End;
  const mergeProgress = progress < stage1End ? 0 : Math.min(1, (progress - stage1End) / (stage2End - stage1End));

  // Easing function
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easedMerge = easeOutCubic(mergeProgress);

  // Starting positions for bento grid (2 top, 3 bottom)
  const getCardStyle = (index: number) => {
    const positions = [
      { x: -140, y: -90 },  // Top left
      { x: 140, y: -90 },   // Top right
      { x: -200, y: 90 },   // Bottom left
      { x: 0, y: 90 },      // Bottom center
      { x: 200, y: 90 },    // Bottom right
    ];

    const start = positions[index];
    
    // All cards merge to center with same size
    const currentX = start.x * (1 - easedMerge);
    const currentY = start.y * (1 - easedMerge);
    
    // Fade out all except center card (index 3) during merge
    const opacity = index === 3 
      ? 1 
      : 1 - easedMerge;

    // Scale - all same size, center card stays
    const scale = index === 3 
      ? 1 + easedMerge * 0.3 
      : 1 - easedMerge * 0.5;

    return { x: currentX, y: currentY, opacity, scale };
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        {products.map((product, index) => {
          const style = getCardStyle(index);
          const floatDelay = index * 0.4;

          return (
            <motion.div
              key={product.id}
              className="absolute w-28 h-28 md:w-36 md:h-36"
              style={{
                x: style.x,
                y: style.y,
                scale: style.scale,
                opacity: style.opacity,
                left: '50%',
                top: '50%',
                marginLeft: '-3.5rem',
                marginTop: '-3.5rem',
              }}
              animate={mergeProgress === 0 ? {
                y: [style.y - 6, style.y + 6, style.y - 6],
              } : {}}
              transition={{
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: floatDelay,
                },
              }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden border border-primary/40 bg-card/60 backdrop-blur-sm glow-primary-subtle">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
