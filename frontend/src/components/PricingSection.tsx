import React from 'react';
import { motion } from 'framer-motion';
import { et } from '../copy/et';

const PricingSection: React.FC = () => {
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
      id="pricing"
      className="section-shell"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <div className="section-inner">
        <motion.h2
          className="section-title"
          variants={fadeInUpVariants}
        >
          {et.pricing.title}
        </motion.h2>

        <motion.div
          variants={fadeInUpVariants}
          className="max-w-3xl mx-auto mt-10 rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-sm p-6 md:p-8 shadow-lg shadow-cyan-500/10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-2">{'E\u2013N'}</p>
              <p className="text-3xl md:text-4xl font-bold text-cyan-300">{'210 \u20AC'}</p>
            </div>
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-2">{'R\u2013P'}</p>
              <p className="text-3xl md:text-4xl font-bold text-blue-300">{'260 \u20AC'}</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-4 py-3 text-center">
            <p className="text-slate-100 font-semibold">150 min pidu + 30 min ettevalmistus ja koristus</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PricingSection;
