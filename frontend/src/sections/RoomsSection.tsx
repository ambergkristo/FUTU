import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RoomCard from '../components/RoomCard';
import RoomDetailsModal from '../components/RoomDetailsModal';
import type { Room } from "../types/room";

export type RoomsSectionProps = { 
  rooms: Room[]; 
  onBook: (roomId: Room["id"]) => void; 
};

const RoomsSection: React.FC<RoomsSectionProps> = ({ rooms, onBook }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

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

  const handleDetails = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  const handleBookFromModal = (roomId: Room["id"]) => {
    handleCloseModal();
    onBook(roomId);
  };

  return (
    <>
      <motion.section
        id="rooms"
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
            Toad
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            variants={fadeInUpVariants}
          >
            Modulaarsed toad eri vanusegruppidele: sünnipäevadeks, töötubadeks ja privaatseteks üritusteks.
          </motion.p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {rooms.map((room, index) => (
              <RoomCard
                key={room.id}
                room={room}
                onDetails={handleDetails}
                onBook={onBook}
                variant={index === 0 ? "featured" : "default"}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Room Details Modal */}
      <RoomDetailsModal
        room={selectedRoom}
        open={!!selectedRoom}
        onClose={handleCloseModal}
        onBook={handleBookFromModal}
      />
    </>
  );
};

export default RoomsSection;
