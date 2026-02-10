import React from 'react';
import { motion } from 'framer-motion';
import { et } from '../copy/et';

interface LocationSectionProps {
  locationInfo?: {
    address: string;
    hours: string;
    contact: string;
  };
}

const LocationSection: React.FC<LocationSectionProps> = ({
  locationInfo = {
    address: et.location.address.content,
    hours: et.location.hours.content,
    contact: et.location.contact.content
  }
}) => {
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
      id="location"
      className="py-20 px-4 bg-slate-900/50"
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
          {et.location.title}
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div variants={fadeInUpVariants}>
            <h3 className="text-2xl font-bold mb-6 text-cyan-400">{et.location.visit}</h3>
            <div className="space-y-4">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
                <h4 className="font-semibold text-cyan-400 mb-2">{et.location.address.title}</h4>
                <p className="text-slate-300 whitespace-pre-line">{locationInfo.address}</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
                <h4 className="font-semibold text-cyan-400 mb-2">{et.location.hours.title}</h4>
                <p className="text-slate-300 whitespace-pre-line">{locationInfo.hours}</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
                <h4 className="font-semibold text-cyan-400 mb-2">{et.location.contact.title}</h4>
                <p className="text-slate-300 whitespace-pre-line">{locationInfo.contact}</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="font-semibold text-cyan-400 mb-4">Jälgi meid</h4>
              <div className="flex space-x-4">
                {['Facebook', 'Instagram', 'Discord'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeInUpVariants}>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl mb-4 block">🗺️</span>
                <p className="text-slate-300">{et.location.map.title}</p>
                <p className="text-slate-400 text-sm">{et.location.map.subtitle}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default LocationSection;
