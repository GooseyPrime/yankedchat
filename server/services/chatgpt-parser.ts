import { BaseParser, ParsedMessage } from "./parser-base";

export class ChatGPTParser extends BaseParser {
  constructor() {
    super("ChatGPT");
  }

  protected getSelectors(): Record<string, string> {
    return {
      threadContainer: 'main[class*="thread"], [data-testid*="conversation"], .conversation-container',
      messageGroup: '[data-message-author-role], .group, [class*="message-group"]',
      userMessage: '[data-message-author-role="user"], .group:has([data-message-author-role="user"])',
      assistantMessage: '[data-message-author-role="assistant"], .group:has([data-message-author-role="assistant"])',
      messageContent: '.markdown, [class*="message-content"], .prose, [class*="text-message"]',
      codeBlock: 'pre, code[class*="language-"], .code-block',
      timestamp: '[class*="timestamp"], .text-xs, time'
    };
  }

  protected getFallbackSelectors(): Record<string, string> {
    return {
      threadContainer: '.chat-container, #chat-container, .conversation',
      messageGroup: '.message, .chat-message, .conversation-item',
      messageContent: '.message-body, .chat-content, p'
    };
  }

  protected getChangeDetectionRules(): Array<{ type: string; selector: string; description: string }> {
    return [
      {
        type: "missing_element",
        selector: "main",
        description: "Main container missing"
      },
      {
        type: "new_element",
        selector: '[data-new-ui="true"]',
        description: "New UI version detected"
      },
      {
        type: "missing_element",
        selector: '[data-message-author-role]',
        description: "Message role attributes missing"
      }
    ];
  }

  protected async extractMessages(doc: Document): Promise<ParsedMessage[]> {
    const messages: ParsedMessage[] = [];
    
    try {
      console.log('ChatGPT Parser: Starting message extraction');
      console.log('Primary selector:', this.selectors.messageGroup);
      
      // Try primary selectors first
      let messageElements = doc.querySelectorAll(this.selectors.messageGroup);
      console.log('Found', messageElements.length, 'elements with primary selector');
      
      // If no messages found with primary selectors, try fallback selectors
      if (messageElements.length === 0) {
        console.log('Trying fallback selector:', this.fallbackSelectors.messageGroup);
        messageElements = doc.querySelectorAll(this.fallbackSelectors.messageGroup || this.selectors.messageGroup);
        console.log('Found', messageElements.length, 'elements with fallback selector');
      }
      
      if (messageElements.length === 0) {
        console.warn(`No message elements found for ${this.vendor}`);
        return [];
      }

      messageElements.forEach((element, index) => {
        const role = this.detectMessageRole(element);
        const content = this.extractMessageContent(element);
        const timestamp = this.extractTimestamp(element);
        
        if (content && content.trim()) {
          messages.push({
            role,
            content: content.trim(),
            timestamp: timestamp || new Date().toISOString(),
            metadata: { index }
          });
        }
      });

      console.log(`Extracted ${messages.length} messages from ${this.vendor}`);
      return messages;
      
    } catch (error) {
      console.error(`Error extracting messages from ${this.vendor}:`, error);
      throw new Error(`Failed to extract messages: ${(error as Error).message}`);
    }
  }

  protected extractMetadata(doc: Document): Record<string, any> {
    const metadata: Record<string, any> = {
      platform: "ChatGPT",
      url: this.extractUrl(doc),
      model: this.extractModel(doc),
      title: this.extractTitle(doc)
    };
    
    // Try to extract conversation ID from URL or page
    const urlMatch = metadata.url?.match(/\/c\/([a-zA-Z0-9-]+)/);
    if (urlMatch) {
      metadata.conversationId = urlMatch[1];
    }
    
    return metadata;
  }

  protected detectMessageRole(element: Element): "user" | "assistant" {
    // Check for role attributes
    const role = element.getAttribute('data-message-author-role');
    if (role === 'user' || role === 'assistant') {
      return role;
    }
    
    // Check parent elements for role attributes
    let parent = element.parentElement;
    while (parent) {
      const parentRole = parent.getAttribute('data-message-author-role');
      if (parentRole === 'user' || parentRole === 'assistant') {
        return parentRole;
      }
      parent = parent.parentElement;
    }
    
    // Check for class names that might indicate role
    const className = element.className || '';
    if (className.includes('user') || element.querySelector('[class*="user"]')) {
      return 'user';
    }
    
    // Default to assistant if unclear
    return 'assistant';
  }

  protected extractMessageContent(element: Element): string {
    // Try primary content selectors
    let contentElement = element.querySelector(this.selectors.messageContent);
    
    if (!contentElement) {
      // Try fallback selectors
      contentElement = element.querySelector(this.fallbackSelectors.messageContent || 'p, div');
    }
    
    if (!contentElement) {
      // Use the element itself if no content container found
      contentElement = element;
    }
    
    return contentElement.textContent || contentElement.innerHTML || '';
  }

  protected extractTimestamp(element: Element): string | undefined {
    const timestampElement = element.querySelector(this.selectors.timestamp);
    if (timestampElement) {
      return timestampElement.getAttribute('datetime') || 
             timestampElement.getAttribute('title') || 
             timestampElement.textContent || undefined;
    }
    return undefined;
  }

  protected extractUrl(doc: Document): string {
    return doc.location?.href || doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || 'unknown';
  }

  protected extractModel(doc: Document): string {
    // Try to find model information in the page
    const modelElement = doc.querySelector('[class*="model"], [data-model]');
    if (modelElement) {
      return modelElement.textContent?.trim() || 'GPT-4';
    }
    return 'GPT-4'; // Default assumption
  }

  protected extractTitle(doc: Document): string {
    return doc.title || doc.querySelector('h1')?.textContent?.trim() || 'ChatGPT Conversation';
  }
}
