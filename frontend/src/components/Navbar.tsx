import React, { useMemo, useState } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const ui = getUi(lang);

  // Language options
  const languages: { code: Lang; name: string; flag: string }[] = [
    { code: 'et', name: 'Eesti', flag: '🇪🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const currentLanguage = languages.find(l => l.code === lang) || languages[0];
  const navItems = useMemo(() => ([
    { key: 'rooms', text: ui.navbar.rooms },
    { key: 'pricing', text: ui.navbar.pricing },
    { key: 'pizza', text: ui.navbar.pizza },
    { key: 'about', text: ui.navbar.about },
    { key: 'faq', text: ui.navbar.faq },
    { key: 'location', text: ui.navbar.location }
  ]), [ui.navbar.about, ui.navbar.faq, ui.navbar.location, ui.navbar.pizza, ui.navbar.pricing, ui.navbar.rooms]);

  // Transform navbar background based on scroll
  const navbarBackground = useTransform(
    scrollY,
    [0, 50],
    ['rgba(2, 6, 23, 0.45)', 'rgba(2, 6, 23, 0.9)']
  );

  // Scrollspy for active section
  const sectionIds = navItems.map((item) => item.key);
  const activeId = useScrollSpy(sectionIds, {
    threshold: 0.4,
    rootMargin: '-100px 0px -50% 0px'
  });

  // Scroll attention for CTA pulse effect
  const shouldPulse = useScrollAttention(1);

  return (
    <motion.nav
      style={{ backgroundColor: navbarBackground }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-300/15 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/65 shadow-[0_0_30px_rgba(14,165,233,0.12)] transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              FUTU
            </span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/50 px-2 py-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.key)}
                className={`relative rounded-full px-3 py-1.5 text-sm font-medium tracking-wide transition-all duration-300 ${activeId === item.key
                  ? 'text-cyan-100'
                  : 'text-slate-300 hover:text-cyan-200'
                  }`}
                aria-current={activeId === item.key ? 'page' : undefined}
              >
                {item.text}
                {activeId === item.key && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 rounded-full border border-cyan-300/40 bg-gradient-to-r from-cyan-400/20 to-blue-400/15 shadow-[0_0_20px_rgba(34,211,238,0.28)]"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-1 rounded-lg border border-slate-600/60 bg-slate-800/55 px-3 py-1.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-cyan-300/40 hover:bg-slate-700/60 hover:text-white"
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
                    className="absolute right-0 z-50 mt-2 w-40 rounded-lg border border-slate-700/50 bg-slate-800/95 shadow-lg shadow-slate-900/50 backdrop-blur-lg"
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
              className={`relative rounded-xl border border-cyan-200/40 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_0_28px_rgba(34,211,238,0.35)] transition-all duration-200 hover:scale-105 hover:from-cyan-400 hover:to-blue-400 hover:shadow-[0_0_32px_rgba(56,189,248,0.5)] md:px-6 ${shouldPulse ? 'animate-pulse-glow' : ''
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

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen((prev) => !prev);
                setIsLanguageDropdownOpen(false);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600/70 bg-slate-800/55 text-slate-200 transition hover:border-cyan-300/45 hover:text-cyan-100 md:hidden"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-nav-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden pb-4"
            >
              <div className="space-y-1 rounded-xl border border-slate-700/70 bg-slate-900/85 p-3 backdrop-blur-xl">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      scrollToSection(item.key);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${activeId === item.key
                      ? 'bg-cyan-500/15 text-cyan-200'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-cyan-100'
                      }`}
                    aria-current={activeId === item.key ? 'page' : undefined}
                  >
                    {item.text}
                  </button>
                ))}
                <div className="mt-2 border-t border-slate-700/70 pt-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => setLang(language.code)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${language.code === lang
                        ? 'bg-cyan-500/15 text-cyan-200'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                      <span className="mr-2">{language.flag}</span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
