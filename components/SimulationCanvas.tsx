import React, { useRef, useEffect, useCallback } from 'react';
import { SimulationConfig } from '../types';
import { noise2D } from '../utils/noise';

interface SimulationCanvasProps {
  config: SimulationConfig;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  history: { x: number; y: number }[];
  color: string;
  age: number;
  lifeSpan: number;

  constructor(width: number, height: number, palette: string[]) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = 0;
    this.vy = 0;
    this.history = [];
    this.color = palette[Math.floor(Math.random() * palette.length)];
    this.age = 0;
    this.lifeSpan = Math.random() * 200 + 100;
  }

  respawn(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.history = [];
    this.age = 0;
  }
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const timeRef = useRef<number>(0);

  // Initialize Particles
  const initParticles = useCallback((width: number, height: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < config.particleCount; i++) {
      newParticles.push(new Particle(width, height, config.palette.colors));
    }
    particlesRef.current = newParticles;
  }, [config.particleCount, config.palette.colors]);

  // Adjust particle count when config changes without full reset if possible
  useEffect(() => {
    const currentCount = particlesRef.current.length;
    if (config.particleCount > currentCount) {
       // Add more
       const canvas = canvasRef.current;
       if (canvas) {
          const toAdd = config.particleCount - currentCount;
          for (let i = 0; i < toAdd; i++) {
             particlesRef.current.push(new Particle(canvas.width, canvas.height, config.palette.colors));
          }
       }
    } else if (config.particleCount < currentCount) {
      // Remove excess
      particlesRef.current = particlesRef.current.slice(0, config.particleCount);
    }
    // Update colors if palette changed
    particlesRef.current.forEach(p => {
       if (!config.palette.colors.includes(p.color)) {
         p.color = config.palette.colors[Math.floor(Math.random() * config.palette.colors.length)];
       }
    });
  }, [config.particleCount, config.palette]);


  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Fade effect for trails
    // We draw a semi-transparent rectangle over the previous frame
    ctx.fillStyle = `rgba(0, 0, 0, ${config.fadeRate})`;
    ctx.fillRect(0, 0, width, height);

    timeRef.current += 0.005;

    particlesRef.current.forEach(p => {
      // Calculate Flow Field Vector
      // Use Simplex Noise to get an angle
      const noiseVal = noise2D(p.x * config.flowScale, p.y * config.flowScale + timeRef.current * 0.1);
      const angle = noiseVal * Math.PI * 4; // Map noise to rotation

      // Physics
      const fx = Math.cos(angle) * config.baseSpeed;
      const fy = Math.sin(angle) * config.baseSpeed;

      p.vx += fx * 0.1;
      p.vy += fy * 0.1;

      // Friction
      p.vx *= 0.9;
      p.vy *= 0.9;

      // Mouse Interaction
      if (mouseRef.current.active) {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.interactionRadius) {
          const force = (config.interactionRadius - dist) / config.interactionRadius;
          // Repel or Attract based on logic? Let's do attract mixed with swirl
          p.vx += (dx / dist) * force * config.interactionStrength * 0.5;
          p.vy += (dy / dist) * force * config.interactionStrength * 0.5;
        }
      }

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around screen
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw Particle
      ctx.beginPath();
      // Draw a line from previous pos (history) could be expensive.
      // Just draw a small circle or line segment
      ctx.fillStyle = p.color;
      
      // Dynamic size based on speed
      const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
      const size = Math.min(Math.max(speed * 0.5, 1), 3);
      
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize handler
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        initParticles(canvas.width, canvas.height);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
       const rect = canvas.getBoundingClientRect();
       mouseRef.current.x = e.touches[0].clientX - rect.left;
       mouseRef.current.y = e.touches[0].clientY - rect.top;
       mouseRef.current.active = true;
       // Prevent default to stop scrolling
       // e.preventDefault(); // Moved to CSS touch-action
    };

    const handleLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleLeave);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleLeave);

    // Start loop
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-full cursor-crosshair"
    />
  );
};

export default SimulationCanvas;