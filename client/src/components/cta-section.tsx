import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-12 border border-border" data-testid="cta-container">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="text-cta-title">
            Ready to Extract Your <span className="flame-text">AI Conversations?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-cta-description">
            Join thousands of users who trust Yanked.Chat to preserve and organize their valuable AI interactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="flame-gradient text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg" data-testid="button-cta-trial">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border border-border text-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-muted transition-colors" data-testid="button-cta-demo">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
