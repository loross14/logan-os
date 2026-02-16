'use client';

import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  TRAIL_COUNT,
  TRAIL_SPEEDS,
  TRAIL_OPACITIES,
  TRAIL_SCALES,
  MOUSE_IDLE_TIMEOUT,
} from '@/lib/constants';

interface TrailDot {
  el: HTMLDivElement;
  x: number;
  y: number;
}

export function CursorTrail() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<TrailDot[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (isMobile || !containerRef.current) return;

    // Create trail dots
    const container = containerRef.current;
    const trails: TrailDot[] = [];

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const dot = document.createElement('div');
      dot.className = 'trail-dot';
      dot.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--accent);
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.15s;
        will-change: left, top, opacity;
      `;
      container.appendChild(dot);
      trails.push({ el: dot, x: 0, y: 0 });
    }
    trailsRef.current = trails;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      isMovingRef.current = true;

      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
      moveTimeoutRef.current = setTimeout(() => {
        isMovingRef.current = false;
      }, MOUSE_IDLE_TIMEOUT);
    };

    // Animation loop
    const animate = () => {
      let prevX = mouseRef.current.x;
      let prevY = mouseRef.current.y;

      trailsRef.current.forEach((t, i) => {
        const speed = TRAIL_SPEEDS[i];
        t.x += (prevX - t.x) * speed;
        t.y += (prevY - t.y) * speed;
        t.el.style.left = `${t.x}px`;
        t.el.style.top = `${t.y}px`;
        t.el.style.opacity = isMovingRef.current ? String(TRAIL_OPACITIES[i]) : '0';
        t.el.style.transform = `scale(${TRAIL_SCALES[i]})`;
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

  if (isMobile) return null;

  return <div ref={containerRef} />;
}
