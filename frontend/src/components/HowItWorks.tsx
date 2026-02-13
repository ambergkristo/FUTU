import React from 'react';
import { motion } from 'framer-motion';
import { et } from '../copy/et';

const HowItWorks: React.FC = () => {
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
          {et.howItWorks.title}
        </motion.h2>
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <div className="pointer-events-none absolute left-0 right-0 top-11 hidden h-px bg-gradient-to-r from-cyan-500/0 via-cyan-400/30 to-cyan-500/0 md:block" />
          {et.howItWorks.steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUpVariants}
              className="relative rounded-2xl border border-cyan-400/20 bg-slate-900/40 p-6 text-center backdrop-blur-md"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-400/10 text-2xl font-bold text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.25)]">
                {step.step}
              </div>
              <h3 className="mb-3 text-2xl font-bold text-cyan-300">{step.title}</h3>
              <p className="text-slate-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;
