import React from 'react';
import { motion } from 'framer-motion';
import { et } from '../copy/et';

interface PricingSectionProps {
  plans?: Array<{
    name: string;
    weekdayPrice: string;
    weekendPrice: string;
    features: string[];
    popular?: boolean;
  }>;
}

const PricingSection: React.FC<PricingSectionProps> = ({ plans = et.pricing.packages }) => {
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
      className="py-20 px-4"
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
          {et.pricing.title}
        </motion.h2>
        <motion.p
          className="text-center text-slate-300 mb-16"
          variants={fadeInUpVariants}
        >
          {et.pricing.duration}
        </motion.p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={fadeInUpVariants}
              className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 ${plan.popular ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20' : 'border-slate-700/50'
                }`}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full text-center mb-4">
                  Populaarne
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">{plan.name}</h3>
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-400">{plan.weekdayPrice}</div>
                <div className="text-slate-400">E–N hind</div>
                <div className="text-2xl font-bold text-slate-300 mt-2">{plan.weekendPrice}</div>
                <div className="text-slate-400">R–P hind</div>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-slate-300 flex items-center">
                    <span className="text-cyan-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default PricingSection;
