import { Code, Search, Bell, Zap } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Modular Parser Architecture",
    description: "Base class with vendor-specific implementations and fallback mechanisms for robust parsing.",
  },
  {
    icon: Search,
    title: "Smart DOM Detection",
    description: "Advanced selector system with automatic fallbacks and interface change detection.",
  },
  {
    icon: Bell,
    title: "Automated Monitoring",
    description: "Email notifications when platform changes affect parsing, ensuring continuous functionality.",
  },
  {
    icon: Zap,
    title: "API Integration Ready",
    description: "Built with extensibility in mind, ready for API integration and custom implementations.",
  },
];

export default function DeveloperFeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-dev-features-title">
            Built for <span className="flame-text">Developers</span>
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="text-dev-features-description">
            Advanced features for technical users and integration
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Features List */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4" data-testid={`dev-feature-${index}`}>
                <div className="w-10 h-10 flame-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`dev-feature-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground" data-testid={`dev-feature-description-${index}`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Code Preview */}
          <div className="bg-gray-900 rounded-xl p-6 text-sm overflow-hidden" data-testid="code-preview">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">BaseParser.js</span>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <pre className="text-gray-300 overflow-x-auto">
              <code>{`class BaseParser {
  constructor(vendor) {
    this.vendor = vendor;
    this.selectors = this.getSelectors();
    this.fallbackSelectors = this.getFallbackSelectors();
    this.changeDetectionRules = this.getChangeDetectionRules();
  }

  async parse(html, url) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Check for interface changes
      await this.detectInterfaceChanges(doc, url);
      
      return this.extractConversation(doc);
    } catch (error) {
      await this.notifyParsingFailure(error, url);
      throw error;
    }
  }
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
