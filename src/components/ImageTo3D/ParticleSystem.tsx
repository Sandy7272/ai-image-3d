import { useEffect, useRef, useCallback } from 'react';
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
  angle: number;
  speed: number;
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

  // Stage timing - particles start AFTER crack
  const explosionStart = 0.45;
  const explosionEnd = 0.6;
  const convergenceStart = 0.6;
  const convergenceEnd = 0.78;

  const isVisible = progress >= explosionStart && progress < convergenceEnd;
  
  // Explosion progress (0-1)
  const explosionProgress = progress < explosionStart ? 0 : 
    progress < explosionEnd ? (progress - explosionStart) / (explosionEnd - explosionStart) : 1;
  
  // Convergence progress (0-1)
  const convergenceProgress = progress < convergenceStart ? 0 :
    progress < convergenceEnd ? (progress - convergenceStart) / (convergenceEnd - convergenceStart) : 1;

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const particleCount = 300;

    const colors = [
      'hsl(148, 100%, 61%)',
      'hsl(148, 100%, 70%)',
      'hsl(148, 80%, 55%)',
      'hsl(155, 100%, 60%)',
      'hsl(0, 0%, 95%)',
      'hsl(0, 0%, 85%)',
    ];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.8;
      const distance = 200 + Math.random() * 350;
      
      particles.push({
        x: centerX,
        y: centerY,
        originX: centerX,
        originY: centerY,
        targetX: centerX + Math.cos(angle) * distance,
        targetY: centerY + Math.sin(angle) * distance,
        size: 2 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle,
        speed: 0.5 + Math.random() * 1.5,
        delay: Math.random() * 0.2,
      });
    }

    return particles;
  }, []);

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

      // Draw center glow during convergence
      if (convergenceProgress > 0.3) {
        const glowSize = 100 + convergenceProgress * 150;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowSize);
        gradient.addColorStop(0, `hsla(148, 100%, 61%, ${convergenceProgress * 0.4})`);
        gradient.addColorStop(0.5, `hsla(148, 100%, 61%, ${convergenceProgress * 0.1})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      particlesRef.current.forEach((particle, index) => {
        const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
        const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        let currentX: number;
        let currentY: number;

        if (explosionProgress < 1) {
          // Explosion phase
          const adjustedProgress = Math.max(0, explosionProgress - particle.delay) / (1 - particle.delay);
          const easedProgress = easeOutQuart(Math.min(1, adjustedProgress));
          
          currentX = particle.originX + (particle.targetX - particle.originX) * easedProgress;
          currentY = particle.originY + (particle.targetY - particle.originY) * easedProgress;
        } else {
          // Convergence phase with spiral
          const easedConvergence = easeInOutCubic(convergenceProgress);
          
          const spiralAngle = particle.angle + convergenceProgress * Math.PI * 6;
          const spiralRadius = (1 - convergenceProgress) * 80;
          
          currentX = particle.targetX + (centerX - particle.targetX) * easedConvergence 
                     + Math.cos(spiralAngle) * spiralRadius;
          currentY = particle.targetY + (centerY - particle.targetY) * easedConvergence 
                     + Math.sin(spiralAngle) * spiralRadius;
        }

        // Floating motion
        const time = Date.now() * 0.001;
        currentX += Math.sin(time * particle.speed + index * 0.05) * 3;
        currentY += Math.cos(time * particle.speed + index * 0.07) * 3;

        // Opacity
        let opacity = 1;
        if (explosionProgress < 0.15) {
          opacity = explosionProgress / 0.15;
        } else if (convergenceProgress > 0.75) {
          opacity = 1 - (convergenceProgress - 0.75) / 0.25;
        }

        const size = particle.size * (1 - convergenceProgress * 0.6);
        
        // Particle glow
        ctx.beginPath();
        ctx.arc(currentX, currentY, size * 3, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, size * 3);
        glowGradient.addColorStop(0, particle.color.replace(')', `, ${opacity * 0.4})`).replace('hsl', 'hsla'));
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Particle core
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
      className="absolute inset-0 pointer-events-none z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    />
  );
};
