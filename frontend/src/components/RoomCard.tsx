import React from 'react';
import { motion } from 'framer-motion';
import type { Room } from "../types/room";

export type RoomCardProps = {
  room: Room;
  onDetails: (room: Room) => void;
  onBook: (roomId: Room["id"]) => void;
  variant?: "default" | "featured";
};

const RoomCard: React.FC<RoomCardProps> = ({ 
  room, 
  onDetails, 
  onBook, 
  variant = "default" 
}) => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const isFeatured = variant === "featured";

  return (
    <motion.div
      variants={fadeInUpVariants}
      className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col ${
        isFeatured ? 'ring-2 ring-cyan-500/30' : ''
      }`}
    >
      {/* Image */}
      <div className="h-32 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
        {room.image ? (
          <img 
            src={room.image.src} 
            alt={room.image.alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl">🎯</span>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold mb-2 text-cyan-400">{room.name}</h3>
        <p className="text-slate-300 text-sm mb-3">{room.short}</p>
        
        {/* Price hint */}
        <div className="text-lg font-bold text-blue-400 mb-3">{room.priceHint}</div>
        
        {/* Highlights */}
        <ul className="space-y-1 mb-4 flex-1">
          {room.highlights.slice(0, 3).map((highlight, idx) => (
            <li key={idx} className="text-slate-300 text-sm flex items-center">
              <span className="text-cyan-400 mr-2 text-xs">✓</span>
              {highlight}
            </li>
          ))}
        </ul>
        
        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => onDetails(room)}
            className="w-full border border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 backdrop-blur-sm bg-slate-800/50 hover:bg-slate-700/50"
          >
            Vaata lähemalt
          </button>
          <button
            onClick={() => onBook(room.id)}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 transform hover:scale-105"
          >
            Broneeri
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
