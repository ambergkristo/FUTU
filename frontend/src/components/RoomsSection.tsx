import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { et } from '../copy/et';

interface RoomsSectionProps {
  rooms?: Array<{
    name: string;
    capacity: string;
    price: string;
    features: string[];
  }>;
}

const RoomsSection: React.FC<RoomsSectionProps> = ({ rooms = et.rooms.types }) => {
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
      id="rooms"
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
          {et.rooms.title}
        </motion.h2>
        <motion.p
          className="text-center text-slate-300 mb-12"
          variants={fadeInUpVariants}
        >
          {et.rooms.weekdayPrice} | {et.rooms.weekendPrice} | {et.rooms.duration}
        </motion.p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {rooms.map((room, index) => (
            <motion.div
              key={index}
              variants={fadeInUpVariants}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col"
            >
              <div className="h-32 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                <span className="text-4xl">🎯</span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-2 text-cyan-400">{room.name}</h3>
                <p className="text-slate-300 text-sm mb-3">{room.capacity}</p>
                <div className="text-2xl font-bold text-blue-400 mb-3">{room.price}</div>
                <ul className="space-y-1 mb-4 flex-1">
                  {room.features.map((feature, idx) => (
                    <li key={idx} className="text-slate-300 text-sm flex items-center">
                      <span className="text-cyan-400 mr-2 text-xs">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/booking"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 transform hover:scale-105 text-center"
                >
                  {et.rooms.bookRoom}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default RoomsSection;
