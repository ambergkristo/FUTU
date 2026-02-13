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
      <div className="space-y-7">
        {/* Image */}
        <div className="h-52 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center overflow-hidden border border-slate-700/60">
          {room.image ? (
            <img
              src={room.image.src}
              alt={room.image.alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl text-slate-300" aria-hidden="true">*</span>
          )}
        </div>

        {/* Description */}
        <p className="text-slate-200 leading-7 text-base">
          {room.description}
        </p>

        {/* Highlights */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-cyan-300">Mis sisaldub</h3>
          <ul className="space-y-2.5">
            {room.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start text-slate-200 leading-relaxed">
                <span className="text-cyan-300 mr-2 mt-[2px] text-xs" aria-hidden="true">+</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Suitable for (if any) */}
        {room.suitableFor.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-cyan-300">Sobib</h3>
            <ul className="space-y-2.5">
              {room.suitableFor.map((item, index) => (
                <li key={index} className="flex items-start text-slate-200 leading-relaxed">
                  <span className="text-cyan-300 mr-2 mt-[2px] text-xs" aria-hidden="true">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Price and duration */}
        <div className="bg-slate-700/25 rounded-xl p-5 border border-slate-700/60 space-y-2.5">
          <p className="text-slate-200">
            <span className="font-semibold text-cyan-300">Hinnad:</span> {room.priceHint}
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">{room.durationHint}</p>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => onBook(room.id)}
          className="cta-primary w-full px-6 py-3 text-sm"
        >
          Broneeri see tuba
        </button>
      </div>
    </Modal>
  );
};

export default RoomDetailsModal;
