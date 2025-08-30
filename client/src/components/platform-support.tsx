import { Card } from "@/components/ui/card";
import { MessageCircle, Brain, Star, Code } from "lucide-react";

const platforms = [
  {
    icon: MessageCircle,
    name: "ChatGPT",
    description: "OpenAI's conversational AI",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Brain,
    name: "Claude",
    description: "Anthropic's AI assistant",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Star,
    name: "Gemini", 
    description: "Google's AI model",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Code,
    name: "Copilot",
    description: "Microsoft's AI assistant",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
];

export default function PlatformSupportSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-platforms-title">
            Supported <span className="flame-text">Platforms</span>
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="text-platforms-description">
            Compatible with all major AI chat platforms
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {platforms.map((platform, index) => (
            <Card key={index} className="rounded-xl p-8 border border-border text-center hover-lift" data-testid={`card-platform-${index}`}>
              <div className={`w-16 h-16 ${platform.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <platform.icon className={`${platform.iconColor} text-2xl`} />
              </div>
              <h3 className="font-semibold text-foreground mb-2" data-testid={`text-platform-name-${index}`}>
                {platform.name}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid={`text-platform-description-${index}`}>
                {platform.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
