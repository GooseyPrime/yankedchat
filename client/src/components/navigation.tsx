import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Flame } from "lucide-react";
import logoPath from "@assets/logo_1756545938405.jpg";
import UserStatus from "./user-status";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
              <img 
                src={logoPath} 
                alt="Yanked.Chat Logo" 
                className="h-10 w-auto object-contain"
              />
              <span className="text-2xl font-bold text-foreground">Yanked.Chat</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">
                Features
              </a>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing">
                Pricing
              </Link>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-how-it-works">
                How It Works
              </a>
              <UserStatus />
            </div>
            
            <button 
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(true)}
              data-testid="button-mobile-menu"
            >
              <Menu className="text-xl" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50" data-testid="mobile-menu-overlay">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-card shadow-xl transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold text-foreground">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} data-testid="button-close-menu">
                  <X className="text-xl text-foreground" />
                </button>
              </div>
              <nav className="space-y-6">
                <a href="#features" className="block text-lg text-foreground hover:text-primary transition-colors" data-testid="mobile-link-features">
                  Features
                </a>
                <Link href="/pricing" className="block text-lg text-foreground hover:text-primary transition-colors" data-testid="mobile-link-pricing">
                  Pricing
                </Link>
                <a href="#how-it-works" className="block text-lg text-foreground hover:text-primary transition-colors" data-testid="mobile-link-how-it-works">
                  How It Works
                </a>
                <div className="mt-8 pt-6 border-t border-border">
                  <UserStatus />
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
