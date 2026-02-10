import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../i18n/I18nContext';
import { getUi } from '../copy/ui';

interface FeatureGridProps {
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  const { lang } = useLang();
  const ui = getUi(lang);
  const featuresData = features || ui.features.items;
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
          {ui.features.title}
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUpVariants}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-cyan-400">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeatureGrid;
