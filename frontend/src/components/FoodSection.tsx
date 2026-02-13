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
    title: 'Telli kohapealt või kaasa',
    description: 'FUTU pizzeria teenindab ka ilma ruumi broneeringuta.',
    highlights: ['Söö kohapeal või võta kaasa', 'Takeaway on planeeritud ka Wolt/Bolt kanalitesse']
  },
  {
    title: 'Kuidas tellida',
    description: 'Telli 3 lihtsa sammuga: vali aeg, kinnita kogus, naudi.',
    highlights: ['Sünnipäevaga tellimus kinnitatakse broneeringu järel', 'Wolt/Bolt liidestus lisandub järgmistes etappides']
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
      className="section-shell section-shell-muted"
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
          Pizza
        </motion.h2>
        <motion.p
          className="section-subtitle text-cyan-200"
          variants={fadeInUpVariants}
        >
          Käsitööpizza FUTU aatriumis: lisa tellimus peole või telli eraldi kohapealt ja kaasa.
        </motion.p>
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
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
            className="cta-primary px-8 py-3"
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
          Peole lisame pizza sinu ruumibroneeringu juurde. Anna maitsed ja kogus teada hiljemalt 24h enne üritust.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          Eraldi tellimused teenindame kohapeal ja kaasa. Wolt/Bolt tellimused lisanduvad pärast vastava liidestuse valmimist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={scrollToBooking}
            className="cta-primary flex-1 px-5 py-3"
          >
            Broneeri aeg
          </button>
          <button
            onClick={() => setIsOrderModalOpen(false)}
            className="cta-secondary flex-1 px-5 py-3"
          >
            Sulge
          </button>
        </div>
      </Modal>
    </motion.section>
  );
};

export default FoodSection;
