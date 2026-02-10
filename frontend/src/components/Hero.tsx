import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { et } from '../copy/et';

const Hero: React.FC = () => {
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
      className="min-h-screen flex items-center justify-center px-4 pt-16"
    >
      <div className="text-center max-w-4xl">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6"
          variants={fadeInUpVariants}
        >
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            {et.hero.headline}
          </span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-slate-300 mb-4"
          variants={fadeInUpVariants}
          transition={{ delay: 0.2 }}
        >
          {et.hero.subheadline}
        </motion.p>
        <motion.p
          className="text-sm text-cyan-400 mb-8"
          variants={fadeInUpVariants}
          transition={{ delay: 0.3 }}
        >
          {et.hero.pizzaNote}
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={fadeInUpVariants}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/booking"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 transform hover:scale-105"
          >
            {et.hero.bookBirthday}
          </Link>
          <button
            onClick={() => {
              const element = document.getElementById('rooms');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="border border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 backdrop-blur-sm bg-slate-800/50 hover:bg-slate-700/50"
          >
            {et.hero.viewRooms}
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
