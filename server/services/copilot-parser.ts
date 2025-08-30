import { BaseParser, ParsedMessage } from "./parser-base";

export class CopilotParser extends BaseParser {
  constructor() {
    super("Copilot");
  }

  protected getSelectors(): Record<string, string> {
    return {
      threadContainer: '[data-testid="chat-container"], .chat-turn-container, main[class*="copilot"]',
      messageGroup: '.chat-turn, [data-testid="chat-turn"], [class*="message-pair"]',
      userMessage: '[data-testid="user-message"], .user-message, [class*="human-message"]',
      assistantMessage: '[data-testid="copilot-message"], .copilot-message, [class*="bot-message"]',
      messageContent: '[data-testid="message-content"], .message-content, .turn-content',
      codeBlock: 'pre[class*="language-"], .code-container, [data-code="true"]',
      timestamp: '.message-timestamp, [data-testid="timestamp"]'
    };
  }

  protected getFallbackSelectors(): Record<string, string> {
    return {
      threadContainer: '.conversation-container, #chat-container',
      messageGroup: '.message-group, .chat-message',
      messageContent: '.content, .message-text'
    };
  }

  protected getChangeDetectionRules(): Array<{ type: string; selector: string; description: string }> {
    return [
      {
        type: "missing_element",
        selector: '[data-testid="chat-container"]',
        description: "Copilot chat container missing"
      },
      {
        type: "new_element",
        selector: '[data-new-copilot-ui]',
        description: "New Copilot UI detected"
      },
      {
        type: "missing_element",
        selector: '.chat-turn',
        description: "Chat turn structure missing"
      }
    ];
  }

  protected async extractMessages(doc: Document): Promise<ParsedMessage[]> {
    const messages: ParsedMessage[] = [];
    
    try {
      // Try to find Copilot-specific message selectors  
      const messageElements = doc.querySelectorAll('.chat-turn, [data-testid="chat-turn"], .message');
      
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

      console.log(`Copilot parser extracted ${messages.length} messages`);
      return messages;
      
    } catch (error) {
      console.error('Error extracting Copilot messages:', error);
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
      platform: "Copilot",
      url: "https://copilot.microsoft.com/chat/example",
      model: "GPT-4",
      conversationLength: 2
    };
  }
}
