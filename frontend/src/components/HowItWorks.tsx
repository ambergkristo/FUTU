import React from 'react';
import { motion } from 'framer-motion';
import { et } from '../copy/et';

interface HowItWorksProps {
  steps?: Array<{
    step: string;
    title: string;
    description: string;
  }>;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ steps = et.howItWorks.steps }) => {
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
      className="py-20 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          variants={fadeInUpVariants}
        >
          {et.howItWorks.title}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUpVariants}
              className="text-center"
            >
              <div className="text-6xl font-bold text-cyan-400/20 mb-4">{step.step}</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">{step.title}</h3>
              <p className="text-slate-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;
