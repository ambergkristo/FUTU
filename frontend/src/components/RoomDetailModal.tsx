import React from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import { ROOM_IDS, ROOM_NAMES, type RoomId } from '../constants/rooms';
import { et } from '../copy/et';

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: RoomId;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ isOpen, onClose, roomId }) => {
  const roomName = ROOM_NAMES[roomId];

  // Room-specific content
  const roomContent = {
    [ROOM_IDS.VR]: {
      description: 'Kogu täielik VR-elamus kõrgeima kvaliteediga seadmetega. Kaasaegsed VR-prillid 4K resolutsiooniga ja haptiline tagasiside tekitavad täieliku sukeldumise tunde.',
      included: [
        'VR-prillid 4K resolutsiooniga',
        'Haptilised ülikonnad tagasisidega',
        'Professionaalne helisüsteem',
        'Kliimakontroll ja ventilatsioon',
        'Valik parimaid VR-mänge'
      ],
      capacity: 'Soovituslik: kuni 4 inimest',
      image: '🎮'
    },
    [ROOM_IDS.COOKING]: {
      description: 'Kaasaegne köögiruum, kus saab koos sõpradega süüa valmistada ja nautida meeldivat aega. Täielikult varustatud professionaalse köögitehnikaga.',
      included: [
        'Täielik köögivarustus',
        'Kvaliteetsed kooginõud',
        'Köögiapidaja juhendamine',
        'Koosviisude korraldamine',
        'Kõik vajalikud koogitarbed'
      ],
      capacity: 'Soovituslik: kuni 6 inimest',
      image: '👨‍🍳'
    },
    [ROOM_IDS.ART]: {
      description: 'Loov ruum kunstikogemuste jaoks, kus saab koos sõpradega kunstiteoseid luua ja meeldivat aega veeta. Sobib nii algajatele kui edasijõudnud.',
      included: [
        'Kunstitarbed ja materjalid',
        'Lõuendid ja värvid',
        'Ekspert juhendaja',
        'Kunstiteoste säilitamine',
        'Loovusülesanded ja mängud'
      ],
      capacity: 'Soovituslik: kuni 5 inimest',
      image: '🎨'
    },
    [ROOM_IDS.TRAMPOLINE_1]: {
      description: 'Suur ja energiline trampoliiniruum, kus saab hüpata, sportida ja lõbut saada. Sobib hästi sünnipäevadeks ja grupipeoadeks.',
      included: [
        'Suur trampoliin',
        'Vahtkummide ala turvalisuseks',
        'Muusikasüsteem',
        'LED-valgustus efektidega',
        'Spordivarustus'
      ],
      capacity: 'Soovituslik: kuni 8 inimest',
      image: '🤸'
    },
    [ROOM_IDS.TRAMPOLINE_2]: {
      description: 'Teine suur trampoliiniruum, mis on varustatud samuti kõrgklassi seadmetega. Ideaalne suurematele gruppidele ja üritustele.',
      included: [
        'Suur trampoliin',
        'Vahtkummide ala turvalisuseks',
        'Muusikasüsteem',
        'LED-valgustus efektidega',
        'Spordivarustus'
      ],
      capacity: 'Soovituslik: kuni 8 inimest',
      image: '🤸‍♂️'
    }
  };

  const content = roomContent[roomId];

  if (!content) {
    return null;
  }

  return (
    <Modal
      open={isOpen}
      title={roomName}
      onClose={onClose}
      maxWidthClassName="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Image placeholder */}
        <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
          <span className="text-6xl">{content.image}</span>
        </div>

        {/* Description */}
        <p className="text-slate-300 leading-relaxed">
          {content.description}
        </p>

        {/* What's included */}
        <div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">Mis sisaldub</h3>
          <ul className="space-y-2">
            {content.included.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-cyan-400 mr-2 mt-1 text-sm">✓</span>
                <span className="text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Capacity */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <p className="text-slate-300">
            <span className="font-semibold text-cyan-400">Mahutavus:</span> {content.capacity}
          </p>
        </div>

        {/* Price hint */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <p className="text-slate-300">
            <span className="font-semibold text-cyan-400">Hinnad:</span> {et.rooms.weekdayPrice} | {et.rooms.weekendPrice}
          </p>
          <p className="text-slate-400 text-sm mt-1">{et.rooms.duration}</p>
        </div>

        {/* CTA Button */}
        <Link
          to={`/booking?roomId=${roomId}`}
          onClick={onClose}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 transform hover:scale-105 text-center block"
        >
          Broneeri see tuba
        </Link>
      </div>
    </Modal>
  );
};

export default RoomDetailModal;
