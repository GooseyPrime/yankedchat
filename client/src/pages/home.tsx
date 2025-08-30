import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import HowItWorksSection from "@/components/how-it-works";
import PlatformSupportSection from "@/components/platform-support";
import DemoSection from "@/components/demo-section";
import DeveloperFeaturesSection from "@/components/developer-features";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PlatformSupportSection />
      <DemoSection />
      <DeveloperFeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
