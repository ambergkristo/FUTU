import React from 'react';
import Modal from './Modal';
import type { Room } from "../types/room";

export type RoomDetailsModalProps = {
  room: Room | null;
  open: boolean;
  onClose: () => void;
  onBook: (roomId: Room["id"]) => void;
};

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ 
  room, 
  open, 
  onClose, 
  onBook 
}) => {
  if (!room) return null;

  return (
    <Modal
      open={open}
      title={room.name}
      onClose={onClose}
      maxWidthClassName="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Image */}
        <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
          {room.image ? (
            <img 
              src={room.image.src} 
              alt={room.image.alt}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-6xl">🎯</span>
          )}
        </div>

        {/* Description */}
        <p className="text-slate-300 leading-relaxed">
          {room.description}
        </p>

        {/* Highlights */}
        <div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">Mis sisaldub</h3>
          <ul className="space-y-2">
            {room.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-cyan-400 mr-2 mt-1 text-sm">✓</span>
                <span className="text-slate-300">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suitable for (if any) */}
        {room.suitableFor.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">Sobib</h3>
            <ul className="space-y-2">
              {room.suitableFor.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-cyan-400 mr-2 mt-1 text-sm">•</span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price and duration */}
        <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
          <p className="text-slate-300">
            <span className="font-semibold text-cyan-400">Hinnad:</span> {room.priceHint}
          </p>
          <p className="text-slate-400 text-sm">{room.durationHint}</p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onBook(room.id)}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 transform hover:scale-105"
        >
          Broneeri see tuba
        </button>
      </div>
    </Modal>
  );
};

export default RoomDetailsModal;
