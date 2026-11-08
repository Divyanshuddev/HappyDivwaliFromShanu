import React, { useEffect, useRef } from 'react';

export default function FireworksCanvas({
  faceImageSrc,
  triggerBurst,
  onBurstComplete
}) {
  const canvasRef = useRef(null);
  const faceCanvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rocketsRef = useRef([]);
  const ringsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  // Pre-render face in a circular badge with glowing festive border
  useEffect(() => {
    if (!faceImageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = faceImageSrc;
    img.onload = () => {
      const size = 120;
      const offscreen = document.createElement('canvas');
      offscreen.width = size;
      offscreen.height = size;
      const oCtx = offscreen.getContext('2d');

      oCtx.save();
      // Outer golden glow
      oCtx.shadowColor = '#FFD700';
      oCtx.shadowBlur = 12;

      // Circular clip
      oCtx.beginPath();
      oCtx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
      oCtx.closePath();
      oCtx.clip();

      // Draw image cover-fit
      const aspect = img.width / img.height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (aspect > 1) {
        sw = img.height;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width;
        sy = (img.height - sh) / 2;
      }
      oCtx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size);
      oCtx.restore();

      // Golden ornate decorative border
      oCtx.lineWidth = 5;
      oCtx.strokeStyle = '#FFD700';
      oCtx.beginPath();
      oCtx.arc(size / 2, size / 2, size / 2 - 5, 0, Math.PI * 2);
      oCtx.stroke();

      // Inner thin orange ring
      oCtx.lineWidth = 2;
      oCtx.strokeStyle = '#FF4500';
      oCtx.beginPath();
      oCtx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
      oCtx.stroke();

      faceCanvasRef.current = offscreen;
    };
  }, [faceImageSrc]);

  // Main Canvas Setup & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const colors = [
      '#FFD700', '#FF8C00', '#FF4500', '#FF1493', '#00FFFF', '#FFDF00', '#FFFFFF', '#00FF66'
    ];

    // Animation frame tick
    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = currentTime;

      // Dark translucent clear for starry firework light trails
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.globalCompositeOperation = 'lighter';

      // 1. Update & Render Rings (Shockwaves)
      for (let i = ringsRef.current.length - 1; i >= 0; i--) {
        const ring = ringsRef.current[i];
        ring.radius += ring.speed * dt * 60;
        ring.alpha -= ring.decay * dt * 60;
        ring.width = Math.max(1, ring.width * 0.96);

        if (ring.alpha <= 0) {
          ringsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = ring.color;
        ctx.globalAlpha = Math.max(0, ring.alpha);
        ctx.lineWidth = ring.width;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Update & Render Rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        r.x += r.vx * dt * 60;
        r.y += r.vy * dt * 60;
        r.vy += r.gravity * dt * 60;

        // Spark trail behind rocket
        for (let s = 0; s < 3; s++) {
          particlesRef.current.push({
            x: r.x + (Math.random() - 0.5) * 4,
            y: r.y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 2 + 1,
            size: Math.random() * 3 + 1.5,
            color: '#FFA500',
            alpha: 0.9,
            decay: 0.045,
            type: 'spark'
          });
        }

        // Rocket body
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Explode condition
        if (r.vy >= -0.5 || r.y <= r.targetY) {
          spawnExplosion(r.x, r.y, r.faceRatio || 0.6, r.particleCount || 75);
          rocketsRef.current.splice(i, 1);
        }
      }

      // 3. Update & Render Particles (Sparks & Face Badges)
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity * dt * 60;
        p.alpha -= p.decay * dt * 60;
        p.rotation = (p.rotation || 0) + (p.rotSpeed || 0) * dt * 60;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

        if (p.type === 'face' && faceCanvasRef.current) {
          // Render Face Sparkle!
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          const curSize = p.size * (0.6 + p.alpha * 0.4);

          // Golden radiating spark points around face
          ctx.strokeStyle = '#FFE600';
          ctx.lineWidth = 1.5;
          const numRays = 6;
          for (let r = 0; r < numRays; r++) {
            const angle = (r * Math.PI) / (numRays / 2);
            const r1 = curSize * 0.6;
            const r2 = curSize * 0.85 + Math.sin(currentTime * 0.01 + r) * 3;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
            ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
            ctx.stroke();
          }

          // Draw the circular face canvas
          ctx.drawImage(
            faceCanvasRef.current,
            -curSize / 2,
            -curSize / 2,
            curSize,
            curSize
          );

          // Spark trail behind face
          if (Math.random() < 0.4) {
            particlesRef.current.push({
              x: p.x + (Math.random() - 0.5) * p.size * 0.4,
              y: p.y + (Math.random() - 0.5) * p.size * 0.4,
              vx: (Math.random() - 0.5) * 0.8,
              vy: (Math.random() - 0.5) * 0.8,
              size: Math.random() * 2.5 + 1,
              color: '#FFD700',
              alpha: p.alpha * 0.8,
              decay: 0.06,
              type: 'spark'
            });
          }
        } else {
          // Render Festive Firework Spark
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * Math.max(0.2, p.alpha), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Spawn rich multi-layered explosion
  const spawnExplosion = (x, y, faceRatio = 0.5, count = 80) => {
    // 1. Shockwave rings
    ringsRef.current.push({
      x,
      y,
      radius: 5,
      speed: 12,
      width: 8,
      alpha: 1,
      decay: 0.025,
      color: '#FFD700'
    });
    ringsRef.current.push({
      x,
      y,
      radius: 10,
      speed: 18,
      width: 4,
      alpha: 0.8,
      decay: 0.035,
      color: '#FF4500'
    });

    const colors = [
      '#FFD700', '#FFA500', '#FF3366', '#00FFFF', '#FFDF00', '#FFFFFF', '#FF1493', '#7000FF'
    ];

    const hasFace = !!faceCanvasRef.current;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 9 + 4;
      const isFace = hasFace && Math.random() < faceRatio;

      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        drag: 0.97,
        gravity: 0.12,
        size: isFace ? (Math.random() * 24 + 32) : (Math.random() * 4 + 2),
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: isFace ? (Math.random() * 0.009 + 0.007) : (Math.random() * 0.02 + 0.012),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        type: isFace ? 'face' : 'spark'
      });
    }

    // Outer glittering golden dust halo
    for (let j = 0; j < 40; j++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        drag: 0.95,
        gravity: 0.08,
        size: Math.random() * 2.5 + 1,
        color: '#FFF8DC',
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02,
        type: 'spark'
      });
    }

    if (onBurstComplete) {
      setTimeout(onBurstComplete, 1200);
    }
  };

  // Launch Rocket that rises up and explodes
  const launchRocket = (startX, targetX, targetY) => {
    const dx = targetX - startX;
    const dy = targetY - window.innerHeight;
    const duration = 1.1; // seconds
    const vy = dy / (duration * 60);
    const vx = dx / (duration * 60);

    rocketsRef.current.push({
      x: startX,
      y: window.innerHeight,
      targetY: targetY,
      vx: vx,
      vy: vy,
      gravity: -0.01,
      faceRatio: 0.55,
      particleCount: 85
    });
  };

  // Click on background to launch firework rocket to that spot
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Launch rocket from bottom center towards click position
    const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
    launchRocket(startX, clickX, clickY);
  };

  // Trigger burst imperatively from parent
  useEffect(() => {
    if (!triggerBurst) return;
    const { x, y, faceRatio = 0.65, count = 90, type = 'direct' } = triggerBurst;

    if (type === 'rocket') {
      launchRocket(x || window.innerWidth / 2, x || window.innerWidth / 2, y || window.innerHeight * 0.35);
    } else {
      spawnExplosion(
        x !== undefined ? x : window.innerWidth / 2,
        y !== undefined ? y : window.innerHeight * 0.38,
        faceRatio,
        count
      );
    }
  }, [triggerBurst]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="fixed inset-0 pointer-events-auto z-10 cursor-crosshair"
      title="Click anywhere to launch Diwali face rockets!"
    />
  );
}
