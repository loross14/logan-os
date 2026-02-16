'use client';

import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { TRAIL_COUNT, MOUSE_IDLE_TIMEOUT } from '@/lib/constants';

// Expose isMoving globally so BlueprintCanvas can respond to mouse presence
declare global {
  interface Window {
    isMouseMoving?: boolean;
  }
}

interface TrailDot {
  el: HTMLDivElement;
  x: number;
  y: number;
}

export function CursorTrail() {
  const isMobile = useIsMobile();
  const trailsRef = useRef<TrailDot[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (isMobile) return;

    // Create trail dots
    const trails: TrailDot[] = [];

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const dot = document.createElement('div');
      dot.className = 'trail-dot';
      document.body.appendChild(dot);
      trails.push({ el: dot, x: 0, y: 0 });
    }
    trailsRef.current = trails;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      isMovingRef.current = true;
      window.isMouseMoving = true;

      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
      moveTimeoutRef.current = setTimeout(() => {
        isMovingRef.current = false;
        window.isMouseMoving = false;
      }, MOUSE_IDLE_TIMEOUT);
    };

    // Animation loop
    const animate = () => {
      let prevX = mouseRef.current.x;
      let prevY = mouseRef.current.y;

      trailsRef.current.forEach((t, i) => {
        const speed = 0.15 - (i * 0.02);
        t.x += (prevX - t.x) * speed;
        t.y += (prevY - t.y) * speed;
        t.el.style.left = `${t.x}px`;
        t.el.style.top = `${t.y}px`;
        t.el.style.opacity = isMovingRef.current ? String(0.3 - i * 0.06) : '0';
        t.el.style.transform = `scale(${1 - i * 0.15})`;
        prevX = t.x;
        prevY = t.y;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
      // Clean up dots
      trails.forEach((t) => t.el.remove());
    };
  }, [isMobile]);

  return null;
}
