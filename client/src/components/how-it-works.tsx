export default function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Paste Your URL",
      description: "Copy the conversation URL from ChatGPT, Claude, Gemini, or Copilot and paste it into our secure extractor.",
    },
    {
      number: "2", 
      title: "AI Processing",
      description: "Our intelligent parsing system extracts the conversation content while maintaining formatting and structure.",
    },
    {
      number: "3",
      title: "Download & Archive", 
      description: "Receive your formatted transcript in your preferred format: JSON, Markdown, or plain text.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-how-it-works-title">
            How It <span className="flame-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-how-it-works-description">
            Extract your AI conversations in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center" data-testid={`step-${index}`}>
              <div className="relative mb-8">
                <div className="w-20 h-20 flame-gradient rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-2xl font-bold text-white" data-testid={`step-number-${index}`}>
                    {step.number}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent transform translate-x-4"></div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4" data-testid={`step-title-${index}`}>
                {step.title}
              </h3>
              <p className="text-muted-foreground" data-testid={`step-description-${index}`}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
