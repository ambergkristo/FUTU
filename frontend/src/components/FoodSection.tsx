import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../i18n/I18nContext';
import { getUi } from '../copy/ui';
import { et } from '../copy/et';

interface FoodSectionProps {
  pizzas?: Array<{
    name: string;
    description: string;
  }>;
  drinks?: Array<{
    name: string;
    description: string;
  }>;
}

const FoodSection: React.FC<FoodSectionProps> = ({
  pizzas = et.pizza.menu.pizzas,
  drinks = et.pizza.menu.drinks
}) => {
  const { lang } = useLang();
  const ui = getUi(lang);
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.section
      id="pizza"
      className="py-20 px-4 bg-slate-900/50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-4"
          variants={fadeInUpVariants}
        >
          {ui.pizza.title}
        </motion.h2>
        <motion.p
          className="text-xl text-center text-cyan-400 mb-16 max-w-3xl mx-auto"
          variants={fadeInUpVariants}
        >
          {ui.pizza.subtitle}
        </motion.p>
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div variants={fadeInUpVariants}>
            <h3 className="text-2xl font-bold mb-6 text-cyan-400">Pizza Valik</h3>
            <div className="space-y-4">
              {pizzas.map((pizza, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-400">{pizza.name}</h4>
                  <p className="text-slate-300 text-sm">{pizza.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeInUpVariants}>
            <h3 className="text-2xl font-bold mb-6 text-cyan-400">Joogid & Snackid</h3>
            <div className="space-y-4">
              {drinks.map((item, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-400">{item.name}</h4>
                  <p className="text-slate-300 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          variants={fadeInUpVariants}
        >
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 transform hover:scale-105">
            {et.pizza.orderNow}
          </button>
          <button className="border border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm bg-slate-800/50 hover:bg-slate-700/50">
            {et.pizza.viewMenu}
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FoodSection;
