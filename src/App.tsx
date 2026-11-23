import React from 'react';
import Preloader from './components/Preloader';
import GlobalCursor from './components/GlobalCursor';
import PurpleCosmicBackground from './components/PurpleCosmicBackground';
import HeroSection from './components/HeroSection';
import StarBackground from './components/StarBackground';
import MonkeyBackground from './components/MonkeyBackground';
import KeycapSkillsSection from './components/KeycapSkillsSection';
import MarqueeSection from './components/MarqueeSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import VHSShelfSection from './components/VHSShelfSection';
import UranusBackground from './components/UranusBackground';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import AchievementsSection from './components/AchievementsSection';
import ContactSection from './components/ContactSection';

export const App: React.FC = () => {
  return (
    <div className="bg-[#0C0C0C] text-[#D7E2EA] font-['Kanit'] min-h-screen overflow-x-clip selection:bg-[#B600A8]/30 selection:text-white antialiased">
      <Preloader />
      <GlobalCursor />
      <PurpleCosmicBackground />
      <HeroSection />
      <div className="starry-universe relative z-0">
        <StarBackground />
        <MonkeyBackground />
        <KeycapSkillsSection />
        <MarqueeSection />
        <AboutSection />
        <SkillsSection />
        <VHSShelfSection />
        <UranusBackground />
        <ProjectsSection />
        <ExperienceSection />
        <AchievementsSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default App;
