interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private static instance: EmailService;

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendNotification(emailData: EmailData): Promise<void> {
    // In a real implementation, this would integrate with SendGrid, Nodemailer, etc.
    // For now, we'll log the email that would be sent
    console.log("=== EMAIL NOTIFICATION ===");
    console.log(`To: ${emailData.to}`);
    console.log(`Subject: ${emailData.subject}`);
    console.log(`HTML Content: ${emailData.html}`);
    console.log("========================");

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async sendInterfaceChangeAlert(platform: string, issues: string[], url: string): Promise<void> {
    const emailData: EmailData = {
      to: process.env.DEVELOPER_EMAIL || 'brandon@intellmeai.com',
      subject: `🚨 ${platform} Interface Change Detected`,
      html: `
        <h2>${platform} Parser Alert</h2>
        <p><strong>URL:</strong> ${url}</p>
        <p><strong>Detected Issues:</strong></p>
        <ul>
          ${issues.map(issue => `<li>${issue}</li>`).join('')}
        </ul>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p>Please update the parser selectors for ${platform}.</p>
      `
    };

    await this.sendNotification(emailData);
  }

  async sendParsingFailureAlert(platform: string, error: Error, url: string): Promise<void> {
    const emailData: EmailData = {
      to: process.env.DEVELOPER_EMAIL || 'brandon@intellmeai.com',
      subject: `❌ ${platform} Parsing Failure`,
      html: `
        <h2>${platform} Parser Failure</h2>
        <p><strong>URL:</strong> ${url}</p>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Stack:</strong> <pre>${error.stack}</pre></p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      `
    };

    await this.sendNotification(emailData);
  }
}
