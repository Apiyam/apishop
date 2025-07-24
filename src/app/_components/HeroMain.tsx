'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import padsImage from '../../../public/imgs/pads.png';
import { Link } from '@mui/joy';

function AnimatedDotsCanvas({ scrollYValue }: { scrollYValue: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef<
    {
      x: number;
      y: number;
      baseY: number; // posición base para scroll
      radius: number;
      speedX: number;
      speedY: number;
      alpha: number;
    }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = canvas.width = canvas.clientWidth * dpr;
    let height = canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const numDots = 60;

    // Crear puntos con posición base Y para scroll parallax
    dots.current = Array.from({ length: numDots }, () => {
      const y = Math.random() * (height / dpr);
      return {
        x: Math.random() * (width / dpr),
        y,
        baseY: y,
        radius: Math.random() * 1.5 + 4, // 1.5 - 3 px
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.4 + 0.5, // 0.5 - 0.9 opacidad
      };
    });

    let animationFrameId: number;

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      dots.current.forEach(dot => {
        dot.x += dot.speedX;
        dot.y += dot.speedY;

        // Rebotar en bordes horizontales
        if (dot.x < 0 || dot.x > canvas.clientWidth) dot.speedX *= -1;
        // Para vertical, solo rebotar dentro del canvas + un margen para scroll
        if (dot.y < 0 || dot.y > canvas.clientHeight) dot.speedY *= -1;

        // Ajustar posición Y según scroll, con una fuerza pequeña
        const scrollOffset = scrollYValue * 0.1; // controla cuánto mueve el scroll
        const yWithScroll = dot.baseY + scrollOffset;

        ctx.beginPath();
        ctx.arc(dot.x, yWithScroll, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // Redimensionar canvas
    function onResize() {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth * dpr;
      height = canvas.height = canvas.clientHeight * dpr;
      if (ctx) ctx.scale(dpr, dpr);
      // Ajustar baseY para nuevos height?
      dots.current.forEach(dot => {
        dot.baseY = Math.min(dot.baseY, height / dpr);
      });
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollYValue]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

export default function HeroMain() {
  const { scrollY } = useScroll();

  // Parallax background y movimiento
  const y1 = useTransform(scrollY, [0, 300], [0, -30]);
  const y2 = useTransform(scrollY, [0, 300], [0, -60]);

  // Valor scroll actual para pasarlo al canvas
  const [scrollYValue, setScrollYValue] = React.useState(0);

  useEffect(() => {
    return scrollY.onChange((v) => setScrollYValue(v));
  }, [scrollY]);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', pb: 20 }}>
      {/* Fondo con parallax */}
      <motion.div
        style={{
          y: y1,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
          overflow: 'hidden',
        }}
      >
        {/* Puntos animados con movimiento scroll */}
        <AnimatedDotsCanvas scrollYValue={scrollYValue} />
      </motion.div>

      {/* Contenido */}
      <Container
        maxWidth="md"
        sx={{
          pt: { xs: 10, md: 16 },
          pb: { xs: 10, md: 12 },
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src="/imgs/logo.png" alt="Lubella" width={320} />
          <Typography variant="h2" fontWeight="bold" gutterBottom color="#d81b60">
            Conoce Lubella
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Revoluciona tu bienestar íntimo con toallas femeninas reutilizables, ecológicas y orgullosamente mexicanas. Cuida tu cuerpo, honra tu ciclo y protege el planeta.
          </Typography>

          <Link href="/tienda" underline="none">
            <Button
                variant="contained"
                size="large"
                sx={{
                backgroundColor: '#d81b60',
                '&:hover': { backgroundColor: '#ad1457' },
                fontSize: '1.2rem',
                }}
            >
                Comprar ahora
            </Button>
          </Link>
        </motion.div>

        {/* Imagen con parallax */}
        <motion.div
          style={{ y: y2, marginTop: '3rem', maxWidth: 400, marginInline: 'auto' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Image src={padsImage} alt="Lubella Hero" layout="responsive" />
        </motion.div>
      </Container>

      {/* Curva inferior SVG */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          lineHeight: 0,
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '100px' }}
        >
          <path
            fill="#ffffff"
            d="M0,96L60,117.3C120,139,240,181,360,197.3C480,213,600,203,720,181.3C840,160,960,128,1080,133.3C1200,139,1320,181,1380,202.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </Box>
    </Box>
  );
}