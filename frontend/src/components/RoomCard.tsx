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
          <span className="text-4xl" aria-hidden="true">*</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold leading-tight text-cyan-300">{room.name}</h3>
        <p className="mt-2 text-slate-200/90 text-sm leading-relaxed">{room.short}</p>

        {/* Price hint */}
        <div className="mt-4 text-lg font-semibold text-sky-300">{room.priceHint}</div>

        {/* Highlights */}
        <ul className="mt-4 mb-5 flex-1 space-y-2">
          {room.highlights.slice(0, 3).map((highlight, idx) => (
            <li key={idx} className="text-slate-200/90 text-sm flex items-start leading-relaxed">
              <span className="text-cyan-300 mr-2 mt-[2px] text-xs" aria-hidden="true">+</span>
              {highlight}
            </li>
          ))}
        </ul>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onDetails(room)}
            className="cta-secondary w-full px-4 py-2 text-sm"
          >
            Vaata detaile
          </button>
          <button
            type="button"
            onClick={() => onBook(room.id)}
            className="cta-primary w-full px-4 py-2.5 text-sm"
          >
            Broneeri
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
