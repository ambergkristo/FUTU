import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useScrollAttention } from '../hooks/useScrollAttention';
import { useLang } from '../i18n/I18nContext';
import { getUi } from '../copy/ui';
import type { Lang } from '../i18n/lang';

interface NavbarProps {
  scrollToSection: (sectionId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ scrollToSection }) => {
  const { scrollY } = useScroll();
  const { lang, setLang } = useLang();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const ui = getUi(lang);

  // Language options
  const languages: { code: Lang; name: string; flag: string }[] = [
    { code: 'et', name: 'Eesti', flag: '🇪🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const currentLanguage = languages.find(l => l.code === lang) || languages[0];

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
              { key: 'rooms', text: ui.navbar.rooms },
              { key: 'pricing', text: ui.navbar.pricing },
              { key: 'pizza', text: ui.navbar.pizza },
              { key: 'about', text: ui.navbar.about },
              { key: 'faq', text: ui.navbar.faq },
              { key: 'location', text: ui.navbar.location }
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
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:bg-slate-600/50 hover:text-white transition-all duration-200"
                aria-label="Select language"
                aria-expanded={isLanguageDropdownOpen}
                aria-haspopup="true"
              >
                <span>{currentLanguage.flag}</span>
                <span>{currentLanguage.code.toUpperCase()}</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isLanguageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-40 bg-slate-800/95 backdrop-blur-lg border border-slate-700/50 rounded-lg shadow-lg shadow-slate-900/50 z-50"
                  >
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setLang(language.code);
                          setIsLanguageDropdownOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-sm transition-colors ${language.code === lang
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                          } first:rounded-t-lg last:rounded-b-lg`}
                      >
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                        {language.code === lang && (
                          <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Click outside to close */}
              {isLanguageDropdownOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLanguageDropdownOpen(false)}
                />
              )}
            </div>

            {/* CTA Button with pulse effect */}
            <Link
              to="/booking"
              className={`relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 transform hover:scale-105 ${shouldPulse ? 'animate-pulse-glow' : ''
                }`}
            >
              {ui.navbar.book}
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
