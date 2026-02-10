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

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Room data
  const rooms: Room[] = [
    {
      id: 1,
      slug: "vr",
      name: "VR Ruum",
      short: "Kogu täielik VR-elamus kõrgeima kvaliteediga seadmetega",
      description: "Kaasaegne VR-ruum kõrgeima kvaliteediga seadmetega. 4K resolutsiooniga VR-prillid ja haptiline tagasiside tekitavad täieliku sukeldumise tunde virtuaalsesse reaalsusse.",
      highlights: [
        "VR-prillid 4K resolutsiooniga",
        "Haptilised ülikonnad tagasisidega",
        "Professionaalne helisüsteem",
        "Kliimakontroll ja ventilatsioon",
        "Valik parimaid VR-mänge"
      ],
      suitableFor: ["Sünnipäevad", "Meeskondade üritused", "Virtuaalreality entusiastid"],
      priceHint: "E–N 210 € · R–P 260 €",
      durationHint: "150 min + 30 min puhverdus"
    },
    {
      id: 2,
      slug: "cooking",
      name: "Köögiruum",
      short: "Kaasaegne köögiruum koosviisude korraldamiseks",
      description: "Täielikult varustatud professionaalse köögitehnikaga ruum, kus saab koos sõpradega süüa valmistada ja nautida meeldivat aega.",
      highlights: [
        "Täielik köögivarustus",
        "Kvaliteetsed kooginõud",
        "Köögiapidaja juhendamine",
        "Koosviisude korraldamine",
        "Kõik vajalikud koogitarbed"
      ],
      suitableFor: ["Köögikoolid", "Töökohtade üritused", "Perepeod"],
      priceHint: "E–N 180 € · R–P 230 €",
      durationHint: "150 min + 30 min puhverdus"
    },
    {
      id: 3,
      slug: "art",
      name: "Kunstituba",
      short: "Loov ruum kunstikogemuste jaoks",
      description: "Loov ruum kunstikogemuste jaoks, kus saab koos sõpradega kunstiteoseid luua ja meeldivat aega veeta. Sobib nii algajatele kui edasijõudnud.",
      highlights: [
        "Kunstitarbed ja materjalid",
        "Lõuendid ja värvid",
        "Ekspert juhendaja",
        "Kunstiteoste säilitamine",
        "Loovusülesanded ja mängud"
      ],
      suitableFor: ["Kunstiklassid", "Loovad töötoad", "Meeskondade üritused"],
      priceHint: "E–N 160 € · R–P 210 €",
      durationHint: "150 min + 30 min puhverdus"
    },
    {
      id: 4,
      slug: "trampoline-1",
      name: "Trampoliin 1",
      short: "Energiline trampoliiniruum spordiks ja lõbutsamiseks",
      description: "Suur ja energiline trampoliiniruum, kus saab hüpata, sportida ja lõbut saada. Sobib hästi sünnipäevadeks ja grupipeoadeks.",
      highlights: [
        "Suur trampoliin",
        "Vahtkummide ala turvalisuseks",
        "Muusikasüsteem",
        "LED-valgustus efektidega",
        "Spordivarustus"
      ],
      suitableFor: ["Sünnipäevad", "Spordipäevad", "Laste peod"],
      priceHint: "E–N 200 € · R–P 250 €",
      durationHint: "150 min + 30 min puhverdus"
    },
    {
      id: 5,
      slug: "trampoline-2",
      name: "Trampoliin 2",
      short: "Teine suur trampoliiniruum suurematele gruppidele",
      description: "Teine suur trampoliiniruum, mis on varustatud samuti kõrgklassi seadmetega. Ideaalne suurematele gruppidele ja üritustele.",
      highlights: [
        "Suur trampoliin",
        "Vahtkummide ala turvalisuseks",
        "Muusikasüsteem",
        "LED-valgustus efektidega",
        "Spordivarustus"
      ],
      suitableFor: ["Suuremad peod", "Kooliüritused", "Korporatiivsed üritused"],
      priceHint: "E–N 200 € · R–P 250 €",
      durationHint: "150 min + 30 min puhverdus"
    }
  ];

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
