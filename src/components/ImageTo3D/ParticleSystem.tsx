import { useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
  delay: number;
}

interface ParticleSystemProps {
  progress: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const ParticleSystem = ({ progress, containerRef }: ParticleSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  // Stage timing
  const stage3Start = 0.4;
  const stage3End = 0.6;
  const stage4Start = 0.6;
  const stage4End = 0.8;

  // Calculate visibility and animation phase
  const isVisible = progress >= stage3Start && progress < stage4End;
  
  // Explosion progress (0-1)
  const explosionProgress = progress < stage3Start ? 0 : 
    progress < stage3End ? (progress - stage3Start) / (stage3End - stage3Start) : 1;
  
  // Convergence progress (0-1)
  const convergenceProgress = progress < stage4Start ? 0 :
    progress < stage4End ? (progress - stage4Start) / (stage4End - stage4Start) : 1;

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const particleCount = 200;

    const colors = [
      'hsl(148, 100%, 61%)', // Primary green
      'hsl(148, 100%, 70%)', // Lighter green
      'hsl(148, 80%, 50%)',  // Darker green
      'hsl(160, 100%, 60%)', // Teal
      'hsl(0, 0%, 90%)',     // White
    ];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const distance = 150 + Math.random() * 300;
      
      particles.push({
        x: centerX,
        y: centerY,
        originX: centerX,
        originY: centerY,
        targetX: centerX + Math.cos(angle) * distance,
        targetY: centerY + Math.sin(angle) * distance,
        size: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        delay: Math.random() * 0.3,
      });
    }

    return particles;
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        particlesRef.current = initParticles(canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particlesRef.current.forEach((particle, index) => {
        // Calculate current position based on progress
        let currentX: number;
        let currentY: number;
        
        // Ease function
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        if (explosionProgress < 1) {
          // Explosion phase
          const adjustedProgress = Math.max(0, explosionProgress - particle.delay) / (1 - particle.delay);
          const easedProgress = easeOutCubic(Math.min(1, adjustedProgress));
          
          currentX = particle.originX + (particle.targetX - particle.originX) * easedProgress;
          currentY = particle.originY + (particle.targetY - particle.originY) * easedProgress;
        } else {
          // Convergence phase
          const easedConvergence = easeInOutCubic(convergenceProgress);
          
          // Add spiral motion during convergence
          const spiralAngle = index * 0.1 + convergenceProgress * Math.PI * 4;
          const spiralRadius = (1 - convergenceProgress) * 50;
          
          currentX = particle.targetX + (centerX - particle.targetX) * easedConvergence 
                     + Math.cos(spiralAngle) * spiralRadius;
          currentY = particle.targetY + (centerY - particle.targetY) * easedConvergence 
                     + Math.sin(spiralAngle) * spiralRadius;
        }

        // Add subtle floating motion
        const time = Date.now() * 0.001;
        currentX += Math.sin(time + index * 0.1) * 2;
        currentY += Math.cos(time + index * 0.15) * 2;

        // Calculate opacity
        let opacity = 1;
        if (explosionProgress < 0.2) {
          opacity = explosionProgress / 0.2;
        } else if (convergenceProgress > 0.7) {
          opacity = 1 - (convergenceProgress - 0.7) / 0.3;
        }

        // Draw particle with glow
        const size = particle.size * (1 - convergenceProgress * 0.5);
        
        // Glow
        ctx.beginPath();
        ctx.arc(currentX, currentY, size * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, size * 2);
        gradient.addColorStop(0, particle.color.replace(')', `, ${opacity * 0.5})`).replace('hsl', 'hsla'));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(currentX, currentY, size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla');
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, explosionProgress, convergenceProgress, initParticles, containerRef]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  );
};
