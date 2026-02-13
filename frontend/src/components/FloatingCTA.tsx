import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useScrollAttention } from '../hooks/useScrollAttention';

const FloatingCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  // Scroll attention for pulse effect
  const shouldPulse = useScrollAttention(1) && !prefersReducedMotion;

  // Don't show on booking or status routes
  const shouldShow = location.pathname === '/' || location.pathname === '';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleScroll = () => {
      // Show after scrolling down a bit to avoid interfering with hero CTAs
      setIsVisible(window.scrollY > 200);
    };

    checkMobile();
    handleScroll();

    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Only show on mobile and allowed routes
  if (!isMobile || !shouldShow) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
          transition={prefersReducedMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Link
            to="/booking"
            aria-label="Broneeri aeg"
            className={`cta-primary group relative rounded-full px-6 py-3 ${shouldPulse ? 'animate-pulse-glow' : ''
              }`}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-200"></div>

            {/* Button content */}
            <span className="relative z-10">Broneeri aeg</span>

            {/* Enhanced pulse glow effect for mobile */}
            {shouldPulse && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0"
                animate={{
                  opacity: [0, 0.4, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}

            {shouldPulse && (
              <motion.div
                className="absolute inset-0 rounded-full border border-cyan-400/30"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
