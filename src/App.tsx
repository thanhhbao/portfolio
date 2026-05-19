import { HeroSection } from './components/HeroSection'
import { ProjectsSection } from './components/ProjectsSection'
import { SkillsSection } from './components/SkillsSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { CopyrightBar } from './components/CopyrightBar'
import { BottomNav } from './components/BottomNav'

function App() {
  return (
    <div className="cinematic-page relative min-h-screen overflow-hidden bg-[#F7F4EF]">
      <HeroSection />
      <ProjectsSection />
      <div id="skills">
        <SkillsSection />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
      <Footer />
      <CopyrightBar />
      <BottomNav />
    </div>
  )
}

export default App
