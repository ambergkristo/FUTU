import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureGrid from '../components/FeatureGrid';
import RoomsSection from '../sections/RoomsSection';
import PricingSection from '../components/PricingSection';
import FoodSection from '../components/FoodSection';
import HowItWorks from '../components/HowItWorks';
import AboutSection from '../components/AboutSection';
import FAQ from '../components/FAQ';
import LocationSection from '../components/LocationSection';
import Footer from '../components/Footer';
import FloatingCTA from '../components/FloatingCTA';
import type { Room } from '../types/room';
import { getRooms } from '../copy/rooms';
import { useLang } from '../i18n/I18nContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const rooms = getRooms(lang);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBook = (roomId: Room["id"]) => {
    navigate(`/booking?roomId=${roomId}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar scrollToSection={scrollToSection} />
      <Hero />
      <FeatureGrid />
      <RoomsSection rooms={rooms} onBook={handleBook} />
      <PricingSection />
      <FoodSection />
      <HowItWorks />
      <AboutSection />
      <FAQ />
      <LocationSection />
      <Footer scrollToSection={scrollToSection} />
      <FloatingCTA />
    </div>
  );
};

export default HomePage;
