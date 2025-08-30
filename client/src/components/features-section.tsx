import { Card } from "@/components/ui/card";
import { Bot, Download, Layers, Shield, Bell, Lock } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Multi-Platform Support",
    description: "Extract conversations from ChatGPT, Claude, Gemini, and Microsoft Copilot with our robust parsing system.",
  },
  {
    icon: Download,
    title: "Multiple Export Formats",
    description: "Download your chats in JSON, Markdown, or plain text format for maximum compatibility and organization.",
  },
  {
    icon: Layers,
    title: "Batch Processing",
    description: "Process multiple conversations at once with our efficient batch download system and progress tracking.",
  },
  {
    icon: Shield,
    title: "Robust Error Handling",
    description: "Advanced change detection system with automatic notifications when platform updates affect parsing.",
  },
  {
    icon: Bell,
    title: "Smart Monitoring",
    description: "Automatic interface change detection with email notifications to ensure continuous functionality.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your conversations are processed securely with no data retention. Extract and download immediately.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-features-title">
            Powerful Features for <span className="flame-text">AI Chat Management</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-features-description">
            Everything you need to extract, organize, and preserve your AI conversations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="rounded-xl p-8 border border-border hover-lift" data-testid={`card-feature-${index}`}>
              <div className="w-12 h-12 flame-gradient rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4" data-testid={`text-feature-title-${index}`}>
                {feature.title}
              </h3>
              <p className="text-muted-foreground" data-testid={`text-feature-description-${index}`}>
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
