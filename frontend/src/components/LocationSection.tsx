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
  const addressText = 'Instituudi tee 134, Alliku, Estonia';
  const openingNote = 'Hoone valmimas. Avamine peagi.';
  const mapQuery = 'Instituudi tee 134, Alliku, Estonia';
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const mapOpenUrl = `https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`;

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
      className="section-shell section-shell-muted"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <div className="section-inner">
        <motion.h2 className="section-title" variants={fadeInUpVariants}>
          {et.location.title}
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <motion.div variants={fadeInUpVariants}>
            <h3 className="mb-6 text-2xl font-bold text-cyan-400">{et.location.visit}</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm">
                <h4 className="mb-2 font-semibold text-cyan-400">{et.location.address.title}</h4>
                <p className="text-slate-300">{addressText}</p>
                <p className="mt-2 text-sm text-slate-400">{openingNote}</p>
              </div>
              <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm">
                <h4 className="mb-2 font-semibold text-cyan-400">{et.location.hours.title}</h4>
                <p className="whitespace-pre-line text-slate-300">{locationInfo.hours}</p>
              </div>
              <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm">
                <h4 className="mb-2 font-semibold text-cyan-400">{et.location.contact.title}</h4>
                <p className="whitespace-pre-line text-slate-300">{locationInfo.contact}</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeInUpVariants}>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm">
              <iframe
                title={et.location.map.title}
                aria-label="Google Maps kaart asukohale Instituudi tee 134, Alliku, Estonia"
                src={mapEmbedUrl}
                className="h-80 w-full rounded-lg border border-slate-700/70"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={mapOpenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center rounded-md border border-cyan-400/60 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20 hover:text-cyan-200"
              >
                Ava Google Mapsis
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default LocationSection;
