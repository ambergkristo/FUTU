import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { et } from '../copy/et';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useScrollAttention } from '../hooks/useScrollAttention';

interface NavbarProps {
  scrollToSection: (sectionId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ scrollToSection }) => {
  const { scrollY } = useScroll();

  // Transform navbar background based on scroll
  const navbarBackground = useTransform(
    scrollY,
    [0, 50],
    ['rgba(15, 23, 42, 0)', 'rgba(15, 23, 42, 0.95)']
  );

  // Scrollspy for active section
  const sectionIds = ['rooms', 'pricing', 'pizza', 'about', 'faq', 'location'];
  const activeId = useScrollSpy(sectionIds, {
    threshold: 0.4,
    rootMargin: '-100px 0px -50% 0px'
  });

  // Scroll attention for CTA pulse effect
  const shouldPulse = useScrollAttention(1);

  return (
    <motion.nav
      style={{ backgroundColor: navbarBackground }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-slate-800/50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              FUTU
            </span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { key: 'rooms', text: et.nav.rooms },
              { key: 'pricing', text: et.nav.pricing },
              { key: 'pizza', text: et.nav.pizza },
              { key: 'about', text: et.nav.about },
              { key: 'faq', text: et.nav.faq },
              { key: 'location', text: et.nav.location }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.key)}
                className={`relative text-sm font-medium transition-all duration-300 ${activeId === item.key
                  ? 'text-cyan-400'
                  : 'text-slate-300 hover:text-cyan-400'
                  }`}
                aria-current={activeId === item.key ? 'page' : undefined}
              >
                {item.text}
                {/* Active indicator - neon cyan underline */}
                {activeId === item.key && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
                {/* Glow effect for active section */}
                {activeId === item.key && (
                  <motion.div
                    className="absolute inset-0 bg-cyan-400/10 rounded-sm blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Pill */}
            <span className="px-2 py-1 text-xs font-medium bg-slate-700/50 text-slate-300 rounded-full border border-slate-600/50">
              {et.nav.language}
            </span>

            {/* CTA Button with pulse effect */}
            <Link
              to="/booking"
              className={`relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 transform hover:scale-105 ${shouldPulse ? 'animate-pulse-glow' : ''
                }`}
            >
              {et.nav.book}
              {/* Pulse glow effect overlay */}
              {shouldPulse && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0"
                  animate={{
                    opacity: [0, 0.3, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
