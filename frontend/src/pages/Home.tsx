import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate('/booking');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary overflow-hidden relative">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* HUD Core Element */}
        <motion.div
          className="relative mb-12"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 w-64 h-64 rounded-full border-2 border-primary opacity-60"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Middle Ring */}
          <motion.div
            className="absolute inset-4 w-56 h-56 rounded-full border border-secondary opacity-40"
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Inner Core */}
          <motion.div
            className="relative w-48 h-48 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 20px rgba(0, 229, 255, 0.5)",
                "0 0 40px rgba(0, 229, 255, 0.8)",
                "0 0 20px rgba(0, 229, 255, 0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Core Center */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-bg-primary via-transparent to-bg-primary opacity-80" />
            
            {/* Circuit Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <motion.line
                x1="50" y1="100" x2="150" y2="100"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.line
                x1="100" y1="50" x2="100" y2="150"
                stroke="currentColor"
                strokeWidth="2"
                className="text-secondary"
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
              <motion.circle
                cx="100" cy="100" r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary"
                animate={{
                  r: [30, 35, 30],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </svg>
          </motion.div>

          {/* Orbiting Dots */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5,
              }}
              initial={{
                translateX: '120px',
                translateY: '-4px',
              }}
            />
          ))}
        </motion.div>

        {/* Hero Text */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-glow-primary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            FUTU – tulevikuline sünnipäevaelamus
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Kaasaegsed tehnoloogilised seiklused, loovus ja lõbus tegevus lastele.
            Unikaalne sünnipäevakogemus, kui tulevik kohtub tänapäevaga.
          </motion.p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <motion.button
            onClick={handleBooking}
            className="btn-primary text-lg px-8 py-4 rounded-xl shadow-glow-primary"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 40px rgba(0, 229, 255, 0.7)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Broneeri sünnipäev
          </motion.button>
        </motion.div>

        {/* Additional Decorative Elements */}
        <motion.div
          className="absolute bottom-10 left-10 text-text-muted text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2, delay: 2 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>System Online</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 right-10 text-text-muted text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2, delay: 2.2 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span>Ready for Booking</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
