import { motion } from 'framer-motion';

interface BookingPageProps {}

const BookingPage: React.FC<BookingPageProps> = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Bookings</h1>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <p className="text-gray-600">
          Booking page component ready for implementation.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default BookingPage;
