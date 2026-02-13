import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';

const offerCards = [
  {
    title: 'Lisa peole',
    description: 'Pizza sobib lisapakina iga sünnipäevabroneeringu juurde.',
    highlights: ['Vali maitsed ja kogus kuni 24h enne pidu', 'Serveering on peo alguseks valmis']
  },
  {
    title: 'Telli eraldi',
    description: 'FUTU pizzeria on avatud ka ilma ruumi broneerimata.',
    highlights: ['Söö kohapeal või võta kaasa', 'Saadaval iga päev FUTU aatriumis']
  },
  {
    title: 'Kuidas tellida',
    description: 'Telli 3 lihtsa sammuga: vali aeg, kinnita kogus, naudi pidu.',
    highlights: ['Sünnipäevaga tellimus kinnitatakse broneeringu järel', 'Eraldi tellimused võtame vastu kohapeal']
  }
];

const FoodSection: React.FC = () => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const scrollToBooking = () => {
    const element = document.getElementById('rooms');
    if (!element) return;

    const navbarOffset = 96;
    const targetPosition = element.getBoundingClientRect().top + window.scrollY - navbarOffset;
    window.scrollTo({ top: Math.max(0, targetPosition), behavior: 'smooth' });
    setIsOrderModalOpen(false);
  };

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
          FUTU Pizzeria
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-center text-cyan-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          variants={fadeInUpVariants}
        >
          Käsitööpizza FUTU aatriumis: saad lisada tellimuse sünnipäevapeole või tellida ka täiesti eraldi.
        </motion.p>
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {offerCards.map((card) => (
            <motion.article
              key={card.title}
              variants={fadeInUpVariants}
              className="rounded-2xl border border-slate-700/60 bg-slate-800/45 backdrop-blur-sm p-6 shadow-lg shadow-cyan-500/10"
            >
              <h3 className="text-xl font-semibold text-cyan-300 mb-3">{card.title}</h3>
              <p className="text-slate-200 leading-relaxed mb-4">{card.description}</p>
              <ul className="space-y-2">
                {card.highlights.map((highlight) => (
                  <li key={highlight} className="text-sm text-slate-300">
                    • {highlight}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
        <motion.div
          className="flex justify-center mt-10"
          variants={fadeInUpVariants}
        >
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/45 transition-all duration-200 transform hover:scale-105"
          >
            Telli pizza
          </button>
        </motion.div>
      </div>

      <Modal
        open={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Telli pizza"
        maxWidthClassName="max-w-xl"
      >
        <p className="text-slate-200 leading-relaxed mb-4">
          Sünnipäevapeole lisame pitsa sinu ruumibroneeringu juurde. Anna maitsed ja kogus teada hiljemalt 24h enne üritust.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          Soovi korral saad tellida ka eraldi otse FUTU pizzeriast, ilma peobroneeringuta.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={scrollToBooking}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Broneeri peoaeg
          </button>
          <button
            onClick={() => setIsOrderModalOpen(false)}
            className="flex-1 border border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-white px-5 py-3 rounded-lg font-semibold transition-all duration-200 bg-slate-800/50"
          >
            Sulge
          </button>
        </div>
      </Modal>
    </motion.section>
  );
};

export default FoodSection;
