import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../i18n/I18nContext';
import { getUi } from '../copy/ui';

const Hero: React.FC = () => {
  const { lang } = useLang();
  const ui = getUi(lang);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      id="hero"
      initial="hidden"
      animate="visible"
      variants={fadeInUpVariants}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center px-4 pt-20 sm:pt-24"
    >
      <div className="text-center max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6"
          variants={fadeInUpVariants}
        >
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            {ui.hero.title}
          </span>
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-4"
          variants={fadeInUpVariants}
          transition={{ delay: 0.2 }}
        >
          {ui.hero.subtitle}
        </motion.p>
        <motion.p
          className="text-sm text-cyan-300 mb-8"
          variants={fadeInUpVariants}
          transition={{ delay: 0.3 }}
        >
          {ui.pizza.subtitle}
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          variants={fadeInUpVariants}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/booking"
            className="cta-primary w-full sm:w-auto px-8 py-3 text-base sm:text-lg"
          >
            {ui.hero.ctaBook}
          </Link>
          <button
            onClick={() => {
              const element = document.getElementById('rooms');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="cta-secondary w-full sm:w-auto px-8 py-3 text-base sm:text-lg"
          >
            {ui.hero.ctaRooms}
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
