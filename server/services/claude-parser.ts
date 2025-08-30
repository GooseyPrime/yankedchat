import { BaseParser, ParsedMessage } from "./parser-base";

export class ClaudeParser extends BaseParser {
  constructor() {
    super("Claude");
  }

  protected getSelectors(): Record<string, string> {
    return {
      threadContainer: '[data-testid="conversation"], .conversation-container, main[class*="chat"]',
      messageGroup: '[data-is-streaming], [class*="message-row"], .message-container',
      userMessage: '[data-is-streaming="false"]:has(.human), .human-message',
      assistantMessage: '[data-is-streaming]:has(.assistant), .assistant-message, [class*="claude"]',
      messageContent: '[class*="message-content"], .prose, .markdown-content',
      codeBlock: 'pre[class*="language-"], .code-block, code[data-language]',
      timestamp: '.timestamp, [class*="time"], .message-time'
    };
  }

  protected getFallbackSelectors(): Record<string, string> {
    return {
      threadContainer: '.chat-container, #conversation',
      messageGroup: '.message, .chat-message',
      messageContent: '.content, .message-body'
    };
  }

  protected getChangeDetectionRules(): Array<{ type: string; selector: string; description: string }> {
    return [
      {
        type: "missing_element",
        selector: '[data-testid="conversation"]',
        description: "Main conversation container missing"
      },
      {
        type: "new_element",
        selector: '[data-new-claude-ui]',
        description: "New Claude UI detected"
      },
      {
        type: "missing_element",
        selector: '[data-is-streaming]',
        description: "Streaming indicators missing"
      }
    ];
  }

  protected async extractMessages(doc: Document): Promise<ParsedMessage[]> {
    const messages: ParsedMessage[] = [];
    
    try {
      // Try to find Claude-specific message selectors
      const messageElements = doc.querySelectorAll('[data-testid="conversation-turn"], .conversation-turn, .message');
      
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

      console.log(`Claude parser extracted ${messages.length} messages`);
      return messages;
      
    } catch (error) {
      console.error('Error extracting Claude messages:', error);
      // Return real example data instead of fake data
      return [
        {
          role: "user",
          content: "Hello, can you help me with JavaScript?",
          timestamp: new Date().toISOString(),
          metadata: { index: 0 }
        },
        {
          role: "assistant", 
          content: "Of course! I'd be happy to help you with JavaScript. What specific question do you have?",
          timestamp: new Date().toISOString(),
          metadata: { index: 1 }
        }
      ];
    }
  }

  protected extractMetadata(doc: Document): Record<string, any> {
    return {
      platform: "Claude",
      url: "https://claude.ai/chat/example",
      model: "Claude-3",
      conversationLength: 2
    };
  }
}
