import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Download, Check } from "lucide-react";
import ExtractionForm from "./extraction-form";
import logoPath from "@assets/logo_1756545938405.jpg";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32" style={{ backgroundColor: '#eeebdc' }}>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <img 
              src={logoPath} 
              alt="Yanked.Chat Logo" 
              className="h-24 md:h-32 lg:h-40 w-auto object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8" data-testid="text-hero-title">
            Extract Your{" "}
            <span className="flame-text">AI Conversations</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed" data-testid="text-hero-description">
            Download and archive your chat transcripts from ChatGPT, Claude, Gemini, and Copilot. 
            Keep your valuable AI conversations organized and accessible.
          </p>
          
          {/* URL Input Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="rounded-2xl shadow-xl p-8 border border-border" data-testid="card-extraction-form">
              <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="text-form-title">
                Try it now - Paste your conversation URL
              </h3>
              <ExtractionForm />
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center" data-testid="platform-support-chatgpt">
                  <Check className="text-green-500 mr-2 h-4 w-4" />
                  ChatGPT
                </span>
                <span className="flex items-center" data-testid="platform-support-claude">
                  <Check className="text-green-500 mr-2 h-4 w-4" />
                  Claude
                </span>
                <span className="flex items-center" data-testid="platform-support-gemini">
                  <Check className="text-green-500 mr-2 h-4 w-4" />
                  Gemini
                </span>
                <span className="flex items-center" data-testid="platform-support-copilot">
                  <Check className="text-green-500 mr-2 h-4 w-4" />
                  Copilot
                </span>
              </div>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="flame-gradient text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg" data-testid="button-start-trial">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border border-border text-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-muted transition-colors" data-testid="button-view-demo">
              View Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
