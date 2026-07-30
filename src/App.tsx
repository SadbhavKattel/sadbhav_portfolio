import HeroSection from './sections/HeroSection';
import ProjectsSection from './sections/ProjectsSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import Footer from './sections/Footer';

function App() {
  return (
    <div style={{ background: '#F7F4EE', overflowX: 'clip' }}>
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <SkillsSection />
      <Footer />
    </div>
  );
}

export default App;
