import { HeroSection } from '@/components/sections/hero-section'
import { TrustSection } from '@/components/sections/trust-section'
import { ProblemsSection } from '@/components/sections/problems-section'
import { AboutSection } from '@/components/sections/about-section'
import { CaseStudySection } from '@/components/sections/case-study-section'
import { DifferentialsSection } from '@/components/sections/differentials-section'
import { ProcessSection } from '@/components/sections/process-section'
import { ComparisonSection } from '@/components/sections/comparison-section'
import { EquipmentStripSection } from '@/components/sections/equipment-strip-section'
import { SegmentsSection } from '@/components/sections/segments-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { FinalCtaSection } from '@/components/sections/final-cta-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <ProblemsSection />
      <AboutSection />
      <CaseStudySection />
      <DifferentialsSection />
      <ProcessSection />
      <ComparisonSection />
      <EquipmentStripSection />
      <SegmentsSection />
      <ProjectsSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </>
  )
}
