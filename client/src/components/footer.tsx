import { Link } from "wouter";
import { Flame } from "lucide-react";
import { SiX, SiGithub, SiLinkedin } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/attached_assets/yankedchat2 no bgpng (Medium)_1756541782233.png" 
                alt="Yanked.Chat Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold" data-testid="text-footer-brand">Yanked.Chat</span>
            </div>
            <p className="text-muted-foreground mb-6" data-testid="text-footer-description">
              Extract and preserve your AI conversations from all major platforms.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-twitter">
                <SiX className="text-xl" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-github">
                <SiGithub className="text-xl" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-linkedin">
                <SiLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-background mb-4" data-testid="text-footer-product-title">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-footer-features">Features</a></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-footer-pricing">Pricing</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-footer-api">API Docs</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-footer-changelog">Changelog</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-background mb-4" data-testid="text-footer-support-title">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-footer-help">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-footer-contact">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-footer-status">Status Page</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-footer-bugs">Bug Reports</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-background mb-4" data-testid="text-footer-legal-title">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-footer-privacy">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-footer-terms">Terms of Service</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-footer-cookies">Cookie Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-background transition-colors" data-testid="link-footer-gdpr">GDPR</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-muted-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0" data-testid="text-footer-copyright">
              © 2024 Yanked.Chat. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm" data-testid="text-footer-intellme">
              An InTellMe Product.{" "}
              <a href="https://www.intellmeai.com" className="hover:text-background transition-colors underline" data-testid="link-footer-intellme">
                www.intellmeai.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
