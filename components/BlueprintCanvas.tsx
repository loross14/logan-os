'use client';

import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { FPS_INTERVAL } from '@/lib/constants';

// Access global isMouseMoving from CursorTrail
declare global {
  interface Window {
    isMouseMoving?: boolean;
  }
}

export function BlueprintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let lastFrame = 0;
    let animationId: number;

    const LINE_COUNT = isMobile ? 18 : 36;
    const CIRCLE_COUNT = isMobile ? 3 : 5;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawFrame(timestamp: number) {
      animationId = requestAnimationFrame(drawFrame);

      // Throttle to ~15fps
      if (timestamp - lastFrame < FPS_INTERVAL) return;
      lastFrame = timestamp;

      const bp = document.body.classList.contains('blueprint-mode');
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.42;
      // Canvas responds to mouse presence - rotates faster when moving
      const baseSpeed = Math.PI / 180; // 1°/sec idle
      const activeSpeed = baseSpeed * 2.5; // 2.5°/sec when mouse moves
      const isMoving = typeof window !== 'undefined' && window.isMouseMoving;
      const speed = isMoving ? activeSpeed : baseSpeed;
      const rotation = timestamp * 0.001 * speed;

      ctx!.clearRect(0, 0, w, h);

      // --- Radial lines ---
      const lineAlpha = bp ? 0.18 : 0.06;
      const lineColor = bp ? `rgba(100,160,200,${lineAlpha})` : `rgba(40,40,40,${lineAlpha})`;
      ctx!.strokeStyle = lineColor;
      ctx!.lineWidth = 0.5;

      for (let i = 0; i < LINE_COUNT; i++) {
        const angle = rotation + (i * (Math.PI * 2) / LINE_COUNT);
        ctx!.beginPath();
        ctx!.moveTo(cx, cy);
        ctx!.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
        ctx!.stroke();
      }

      // --- Concentric circles ---
      const breathe = Math.sin(timestamp * 0.001 * 0.8) * 0.5 + 0.5; // 0..1 over ~8s
      const circleBaseAlpha = bp ? 0.1 : 0.04;
      const circleBreathAlpha = bp ? 0.06 : 0.03;

      for (let i = 1; i <= CIRCLE_COUNT; i++) {
        const r = (maxR / CIRCLE_COUNT) * i;
        const alpha = circleBaseAlpha + breathe * circleBreathAlpha;
        const circleColor = bp ? `rgba(100,160,200,${alpha})` : `rgba(50,50,50,${alpha})`;
        ctx!.strokeStyle = circleColor;
        ctx!.lineWidth = 0.5;
        ctx!.beginPath();
        ctx!.arc(cx, cy, r, 0, Math.PI * 2);
        ctx!.stroke();
      }

      // --- Compass ticks at cardinal directions ---
      const tickAlpha = bp ? 0.25 : 0.08;
      const tickColor = bp ? `rgba(130,180,220,${tickAlpha})` : `rgba(60,60,60,${tickAlpha})`;
      ctx!.strokeStyle = tickColor;
      ctx!.lineWidth = 1;
      const tickLen = 6;

      for (let i = 0; i < 4; i++) {
        const angle = rotation + (i * Math.PI / 2);
        const outerX = cx + Math.cos(angle) * maxR;
        const outerY = cy + Math.sin(angle) * maxR;
        const innerX = cx + Math.cos(angle) * (maxR - tickLen);
        const innerY = cy + Math.sin(angle) * (maxR - tickLen);
        ctx!.beginPath();
        ctx!.moveTo(innerX, innerY);
        ctx!.lineTo(outerX, outerY);
        ctx!.stroke();
      }

      // --- Center point ---
      if (bp) {
        // Pulsing ring in blueprint mode
        const ringAlpha = 0.2 + breathe * 0.15;
        ctx!.strokeStyle = `rgba(201,169,110,${ringAlpha})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.arc(cx, cy, 4 + breathe * 2, 0, Math.PI * 2);
        ctx!.stroke();
      } else {
        // Tiny gold dot in dark mode
        ctx!.fillStyle = 'rgba(201,169,110,0.15)';
        ctx!.beginPath();
        ctx!.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx!.fill();
      }

      // --- Blueprint dimension text ---
      if (bp) {
        ctx!.save();
        ctx!.font = '8px "IBM Plex Mono", monospace';
        ctx!.fillStyle = 'rgba(100,160,200,0.15)';
        const dimAngle = rotation + Math.PI * 0.15;
        const dimDist = maxR * 0.6;
        const tx = cx + Math.cos(dimAngle) * dimDist;
        const ty = cy + Math.sin(dimAngle) * dimDist;
        ctx!.translate(tx, ty);
        ctx!.rotate(dimAngle);
        ctx!.fillText("24'-0\"", 0, 0);
        ctx!.restore();
      }
    }

    resize();
    window.addEventListener('resize', resize);
    animationId = requestAnimationFrame(drawFrame);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      id="blueprintBg"
    />
  );
}
