import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Download } from "lucide-react";

export default function DemoSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-demo-title">
            See It In <span className="flame-text">Action</span>
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="text-demo-description">
            Watch how easy it is to extract your AI conversations
          </p>
        </div>

        {/* Demo Interface Mockup */}
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-2xl shadow-2xl border border-border overflow-hidden" data-testid="card-demo-interface">
            {/* Demo Header */}
            <div className="bg-muted/50 px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground" data-testid="text-demo-header">
                  Yanked.Chat Extractor
                </h3>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Demo Content */}
            <div className="p-8">
              {/* URL Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2" data-testid="label-demo-url">
                  Conversation URL
                </label>
                <div className="flex gap-3">
                  <Input 
                    value="https://chatgpt.com/c/example-conversation-id"
                    className="flex-1"
                    readOnly
                    data-testid="input-demo-url"
                  />
                  <Button className="flame-gradient text-white font-medium" data-testid="button-demo-extract">
                    Extract
                  </Button>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground" data-testid="text-demo-progress">
                    Parsing conversation...
                  </span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="w-full" />
              </div>

              {/* Results Preview */}
              <div className="bg-muted/30 rounded-lg p-6" data-testid="demo-results-preview">
                <h4 className="font-semibold text-foreground mb-4">Extracted Content Preview</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex">
                    <span className="font-medium text-muted-foreground w-16">User:</span>
                    <span className="text-foreground">Can you help me write a Python function for...</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-muted-foreground w-16">AI:</span>
                    <span className="text-foreground">Of course! Here's a Python function that...</span>
                  </div>
                  <div className="text-center text-muted-foreground">
                    <span>⋯</span>
                  </div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground" data-testid="text-demo-message-count">
                    12 messages extracted
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="text-primary hover:text-primary/80 transition-colors" data-testid="button-demo-json">
                      <Download className="mr-1 h-4 w-4" /> JSON
                    </Button>
                    <Button variant="ghost" className="text-primary hover:text-primary/80 transition-colors" data-testid="button-demo-markdown">
                      <Download className="mr-1 h-4 w-4" /> Markdown
                    </Button>
                    <Button variant="ghost" className="text-primary hover:text-primary/80 transition-colors" data-testid="button-demo-text">
                      <Download className="mr-1 h-4 w-4" /> Text
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
