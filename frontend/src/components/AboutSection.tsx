import React from 'react';
import { motion } from 'framer-motion';
import { et } from '../copy/et';

const AboutSection: React.FC = () => {
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
      id="about"
      className="section-shell"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <div className="section-inner max-w-4xl">
        <motion.h2 
          className="section-title"
          variants={fadeInUpVariants}
        >
          {et.about.title}
        </motion.h2>
        <motion.p 
          className="section-subtitle"
          variants={fadeInUpVariants}
        >
          {et.about.vision}
        </motion.p>
        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          variants={fadeInUpVariants}
        >
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">Meie Väärtused</h3>
            <ul className="space-y-3">
              {et.about.values.map((value, index) => (
                <li key={index} className="text-slate-300 flex items-center">
                  <span className="text-cyan-400 mr-3">▸</span>
                  {value}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">Meie Missioon</h3>
            <p className="text-slate-300">
              Luua kogukond, kus inimesed saavad kohtuda, õppida ja kogeda kaasaegseid elamusi professionaalses ja inspireerivas keskkonnas.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
