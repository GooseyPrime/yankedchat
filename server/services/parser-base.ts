import { storage } from "../storage";
import { JSDOM } from "jsdom";

export interface ParsedMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface ParsedConversation {
  vendor: string;
  messages: ParsedMessage[];
  metadata: Record<string, any>;
  parsedAt: string;
}

export abstract class BaseParser {
  protected vendor: string;
  protected selectors: Record<string, string>;
  protected fallbackSelectors: Record<string, string>;
  protected changeDetectionRules: Array<{ type: string; selector: string; description: string }>;

  constructor(vendor: string) {
    this.vendor = vendor;
    this.selectors = this.getSelectors();
    this.fallbackSelectors = this.getFallbackSelectors();
    this.changeDetectionRules = this.getChangeDetectionRules();
  }

  async parse(html: string, url: string): Promise<ParsedConversation> {
    try {
      console.log('BaseParser: Parsing HTML for', this.vendor);
      const doc = this.parseHTML(html);
      console.log('BaseParser: HTML parsed successfully');
      
      // Check for interface changes (skip for now to debug)
      // await this.detectInterfaceChanges(doc, url);
      
      // Parse messages
      console.log('BaseParser: Starting message extraction');
      const messages = await this.extractMessages(doc);
      
      if (messages.length === 0) {
        throw new Error(`No messages found for ${this.vendor}`);
      }
      
      return {
        vendor: this.vendor,
        messages,
        metadata: this.extractMetadata(doc),
        parsedAt: new Date().toISOString()
      };
    } catch (error) {
      await this.notifyParsingFailure(error as Error, url);
      throw error;
    }
  }

  private parseHTML(html: string): Document {
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  protected async detectInterfaceChanges(doc: Document, url: string): Promise<void> {
    const issues: string[] = [];
    
    // Check if primary selectors still exist (simulated)
    for (const [key, selector] of Object.entries(this.selectors)) {
      // In real implementation: if (!doc.querySelector(selector))
      if (Math.random() > 0.95) { // Simulate 5% chance of selector missing
        issues.push(`Primary selector missing: ${key} (${selector})`);
      }
    }
    
    // Check for new elements that might indicate changes
    for (const rule of this.changeDetectionRules) {
      if (rule.type === "new_element" && Math.random() > 0.98) {
        issues.push(`New element detected: ${rule.description}`);
      }
      
      if (rule.type === "missing_element" && Math.random() > 0.97) {
        issues.push(`Expected element missing: ${rule.description}`);
      }
    }
    
    if (issues.length > 0) {
      await this.notifyInterfaceChange(issues, url);
    }
  }

  private async notifyInterfaceChange(issues: string[], url: string): Promise<void> {
    // Store parsing error
    await storage.createParsingError({
      platform: this.vendor,
      url,
      errorType: "interface_change",
      errorDetails: { issues }
    });

    // Send email notification (would integrate with email service)
    console.log(`Interface change detected for ${this.vendor}:`, issues);
  }

  private async notifyParsingFailure(error: Error, url: string): Promise<void> {
    // Store parsing error
    await storage.createParsingError({
      platform: this.vendor,
      url,
      errorType: "parsing_failure",
      errorDetails: { 
        message: error.message,
        stack: error.stack
      }
    });

    console.log(`Parsing failure for ${this.vendor}:`, error.message);
  }

  protected cleanContent(content: string): string {
    return content
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim();
  }

  protected extractTimestamp(element: any): string | undefined {
    // Implementation would extract timestamp from element
    return new Date().toISOString();
  }

  // Abstract methods to be implemented by each vendor
  protected abstract getSelectors(): Record<string, string>;
  protected abstract getFallbackSelectors(): Record<string, string>;
  protected abstract getChangeDetectionRules(): Array<{ type: string; selector: string; description: string }>;
  protected abstract extractMessages(doc: Document): Promise<ParsedMessage[]>;
  protected abstract extractMetadata(doc: Document): Record<string, any>;
}
