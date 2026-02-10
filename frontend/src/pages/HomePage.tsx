import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureGrid from '../components/FeatureGrid';
import RoomsSection from '../components/RoomsSection';
import PricingSection from '../components/PricingSection';
import FoodSection from '../components/FoodSection';
import HowItWorks from '../components/HowItWorks';
import AboutSection from '../components/AboutSection';
import FAQ from '../components/FAQ';
import LocationSection from '../components/LocationSection';
import Footer from '../components/Footer';
import FloatingCTA from '../components/FloatingCTA';

const HomePage: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar scrollToSection={scrollToSection} />
      <Hero />
      <FeatureGrid />
      <RoomsSection />
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
