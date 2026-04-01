'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, Modal, Sheet } from '@mui/joy';
import Masonry from 'react-masonry-css'

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1,
}
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

  const [showGuide, setShowGuide] = useState(false);
  const { scrollY } = useScroll();

  // Parallax background y movimiento
  const y1 = useTransform(scrollY, [0, 300], [0, -30]);

  // Valor scroll actual para pasarlo al canvas
  const [scrollYValue, setScrollYValue] = React.useState(0);

  useEffect(() => {
    return scrollY.onChange((v) => setScrollYValue(v));
  }, [scrollY]);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', pb: 20 }}>
      
     
      
          
      {/*
       <center>
          <a href="/expo-nacional">
            <img src="/imgs/expos.jpg" alt="Kit Expo 2026" style={{ width: '100%', height: 'auto', maxWidth: '1200px', margin: '0 auto', cursor: 'pointer' }} />
          </a>
        </center>
      
      
      Fondo con parallax */}
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

          {
            
            <Box>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Revoluciona tu bienestar íntimo con toallas femeninas reutilizables y calzones menstruales, opciones ecológicas, cómodas y orgullosamente mexicanas.
          Cuida tu cuerpo, honra tu ciclo y protege el planeta con productos que te acompañan en cada etapa.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
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
                Comprar mi calzón menstrual
            </Button>
          </Link>
          <Button 
            onClick={() => setShowGuide(true)}
            variant="contained"
            size="large"
            sx={{
            backgroundColor: '#7CBB48',
            '&:hover': { backgroundColor: '#66993d' },
            fontSize: '1.2rem',
          }}
          >
            Consulta guía de tallas
          </Button>
          </Box>
          </Box>
            
          }
          <div style={{ height: '30px' }}></div>
        </motion.div>

        {showGuide && (
          <Modal open={showGuide} onClose={() => setShowGuide(false)}>
          <Sheet
              sx={{
                  width: { xs: '100%', sm: 600 },
                  mx: 'auto',
                  mt: '3vh',
                  borderRadius: 'md',
                  p: 4,
                  boxShadow: 'lg',
                  bgcolor: 'background.body',
                  outline: 'none',
                  textAlign: 'center',
              }}
          >
              <img
                  src="/imgs/guia.jpg"
                  alt="Tabla de tallas"
                  loading="lazy"
                  style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
              />
              <Button
                  variant="outlined"
                  color="info"
                  onClick={() => setShowGuide(false)}
                  sx={{ mt: 3 }}
              >
                  Cerrar
              </Button>
          </Sheet>
      </Modal>
        )}

        {/* Imagen con parallax */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            <motion.div
              key="menstrual"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              style={{ marginBottom: '1rem', borderRadius: 12, overflow: 'hidden', breakInside: 'avoid', cursor: 'pointer' }}
              onClick={() => document.getElementById('section-calzon-menstrual')?.scrollIntoView({ behavior: 'smooth' })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('section-calzon-menstrual')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <img
                src="/imgs/menstrual.png"
                width="100%"
                alt="Calzón menstrual Lubella - Ir a sección"
                loading="lazy"
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
            </motion.div>
            <motion.div
              key="toalla"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ marginBottom: '1rem', borderRadius: 12, overflow: 'hidden', breakInside: 'avoid', cursor: 'pointer' }}
              onClick={() => document.getElementById('section-toalla-femenina-regular')?.scrollIntoView({ behavior: 'smooth' })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('section-toalla-femenina-regular')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <img
                src="/imgs/toalla.png"
                width="100%"
                alt="Toallas Lubella - Ir a sección"
                loading="lazy"
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
            </motion.div>
          </Masonry>
        </Box>
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