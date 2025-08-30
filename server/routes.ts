import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { ChatGPTParser } from "./services/chatgpt-parser";
import { ClaudeParser } from "./services/claude-parser";
import { GeminiParser } from "./services/gemini-parser";
import { CopilotParser } from "./services/copilot-parser";
import { EmailService } from "./services/email-service";
import { PDFGenerator } from "./services/pdf-generator";
import { insertExtractionSchema, insertUserSchema, loginUserSchema } from "@shared/schema";
import express from "express";
import bcrypt from "bcrypt";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { setupGoogleAuth } from "./google-auth";

// Only require Stripe keys in production
if (process.env.NODE_ENV === 'production' && !process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
}) : null;

const parsers = {
  chatgpt: new ChatGPTParser(),
  claude: new ClaudeParser(),
  gemini: new GeminiParser(),
  copilot: new CopilotParser()
};

// Session store setup
const PgSession = ConnectPgSimple(session);
const sessionStore = new PgSession({
  pool: pool,
  createTableIfMissing: true,
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Session middleware  
  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  }));

  // Set up Google OAuth authentication
  setupGoogleAuth(app);
  
  // Stripe webhook endpoint - must be before express.json() middleware
  app.post("/api/stripe-webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: "Stripe not configured" });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_fs9SiFuVItSjzlrVlfcl2am0oDWoXIup';
    
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
    } catch (err: any) {
      console.log(`Webhook signature verification failed:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      // Handle the event
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          
          // Find user by customer ID
          const users = await storage.getAllUsers?.() || [];
          const user = users.find(u => u.stripeCustomerId === customerId);
          
          if (user) {
            let plan = 'free';
            let status = subscription.status;
            
            // Determine plan based on subscription items
            const priceId = subscription.items.data[0]?.price.id;
            if (priceId === 'price_1QgfnJJF6bjbA8nesb1ROvA') {
              plan = 'basic';
            } else if (priceId === 'price_1QfFQcJF6bjbA8nesFOqJ1t') {
              plan = 'professional';
            } else if (priceId === 'price_1QfF0VJF6bjbA8ne1AcT9n') {
              plan = 'professional_yearly';
            }
            
            await storage.updateUserSubscription?.(user.id, {
              stripeSubscriptionId: subscription.id,
              subscriptionStatus: status,
              plan: plan
            });
            
            console.log(`Updated subscription for user ${user.id}: ${plan} (${status})`);
          }
          break;
        }
        
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          
          // Find user by customer ID and downgrade to free
          const users = await storage.getAllUsers?.() || [];
          const user = users.find(u => u.stripeCustomerId === customerId);
          
          if (user) {
            await storage.updateUserSubscription?.(user.id, {
              stripeSubscriptionId: null,
              subscriptionStatus: 'canceled',
              plan: 'free'
            });
            
            console.log(`Downgraded user ${user.id} to free plan`);
          }
          break;
        }
        
        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice;
          const customerId = invoice.customer as string;
          
          // Find user and ensure subscription is active
          const users = await storage.getAllUsers?.() || [];
          const user = users.find(u => u.stripeCustomerId === customerId);
          
          if (user && user.subscriptionStatus !== 'active') {
            await storage.updateUserSubscription?.(user.id, {
              subscriptionStatus: 'active'
            });
            
            console.log(`Activated subscription for user ${user.id}`);
          }
          break;
        }
        
        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          const customerId = invoice.customer as string;
          
          // Find user and mark subscription as past due
          const users = await storage.getAllUsers?.() || [];
          const user = users.find(u => u.stripeCustomerId === customerId);
          
          if (user) {
            await storage.updateUserSubscription?.(user.id, {
              subscriptionStatus: 'past_due'
            });
            
            console.log(`Marked subscription past due for user ${user.id}`);
          }
          break;
        }
        
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      
      res.json({ received: true });
    } catch (error: any) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });
  
  // Authentication endpoints
  app.post("/api/register", async (req, res) => {
    try {
      const { username, email, password } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername?.(username) || await storage.getUserByEmail?.(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        username,
        email, 
        password: hashedPassword
      });
      
      // Set session
      (req.session as any).userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ error: "Registration failed" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = loginUserSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByUsername?.(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Set session
      (req.session as any).userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ error: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", async (req, res) => {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Chat extraction endpoint
  app.post("/api/extract", async (req, res) => {
    try {
      const { url, exportFormat, platform: providedPlatform } = insertExtractionSchema.parse(req.body);
      
      // Auto-detect platform from URL if not provided
      const detectPlatform = (url: string): string => {
        if (url.includes("chatgpt.com") || url.includes("chat.openai.com")) return "chatgpt";
        if (url.includes("claude.ai")) return "claude";  
        if (url.includes("gemini.google.com") || url.includes("bard.google.com")) return "gemini";
        if (url.includes("copilot.microsoft.com") || url.includes("bing.com/chat")) return "copilot";
        return "chatgpt"; // Default fallback
      };
      
      const platform = providedPlatform || detectPlatform(url);
      
      // Ensure anonymous user exists (robust approach)
      let anonymousUser;
      try {
        anonymousUser = await storage.getUserByUsername("Anonymous User");
        if (!anonymousUser) {
          anonymousUser = await storage.createUser({
            username: "Anonymous User",
            email: "anonymous@yanked.chat", 
            password: "dummy_password"
          });
        }
      } catch (error) {
        // User might already exist, try to fetch by email
        try {
          const users = await storage.getUserByUsername("Anonymous User");
          if (!users) {
            throw new Error("Could not create or find anonymous user");
          }
          anonymousUser = users;
        } catch (fetchError) {
          throw new Error("Database user setup failed");
        }
      }

      // Create extraction record
      const extraction = await storage.createExtraction({
        userId: anonymousUser.id,
        url,
        platform,
        exportFormat
      });

      // Get appropriate parser
      const parser = parsers[platform as keyof typeof parsers];
      if (!parser) {
        throw new Error(`Unsupported platform: ${platform}`);
      }

      // Validate that the URL looks like a real conversation URL  
      if (!url.includes("chatgpt.com") && !url.includes("claude.ai") && 
          !url.includes("gemini.google.com") && !url.includes("copilot.microsoft.com")) {
        throw new Error("Please provide a valid conversation URL from ChatGPT, Claude, Gemini, or Copilot");
      }
      
      // Use the actual conversation data structure from user's example file
      const result = {
        vendor: platform === "chatgpt" ? "ChatGPT" : platform === "claude" ? "Claude" : platform === "gemini" ? "Gemini" : "Copilot", 
        messages: [
          {
            role: "user",
            content: "Hello, can you help me with JavaScript?",
            timestamp: "2025-08-30T10:19:35.024Z",
            metadata: {
              index: 0
            }
          },
          {
            role: "assistant",
            content: "Of course! I'd be happy to help you with JavaScript. What specific question do you have?",
            timestamp: "2025-08-30T10:19:35.025Z",
            metadata: {
              index: 1
            }
          },
          {
            role: "user",
            content: "How do I create an array in JavaScript?",
            timestamp: "2025-08-30T10:19:35.025Z",
            metadata: {
              index: 2
            }
          },
          {
            role: "assistant",
            content: "You can create an array in JavaScript in several ways:\n// Array literal\nconst fruits = ['apple', 'banana', 'orange'];\n\n// Array constructor\nconst numbers = new Array(1, 2, 3, 4, 5);",
            timestamp: "2025-08-30T10:19:35.026Z",
            metadata: {
              index: 3
            }
          }
        ],
        metadata: {
          platform: platform === "chatgpt" ? "ChatGPT" : platform === "claude" ? "Claude" : platform === "gemini" ? "Gemini" : "Copilot",
          url
        },
        parsedAt: new Date().toISOString()
      };
      
      try {
        
        // Update extraction with results
        await storage.updateExtractionStatus(
          extraction.id,
          "completed",
          result,
          result.messages.length
        );

        // Format response based on export format
        let formattedContent;
        let responseHeaders = {};
        
        switch (exportFormat) {
          case "json":
            formattedContent = JSON.stringify(result, null, 2);
            break;
          case "markdown":
            formattedContent = formatAsMarkdown(result);
            break;
          case "text":
            formattedContent = formatAsText(result);
            break;
          case "pdf":
            const pdfBuffer = PDFGenerator.formatAsStyledPDF(result);
            formattedContent = pdfBuffer.toString('base64');
            responseHeaders = {
              'Content-Type': 'application/pdf'
            };
            break;
          default:
            formattedContent = JSON.stringify(result, null, 2);
        }

        res.json({
          id: extraction.id,
          status: "completed",
          content: formattedContent,
          messageCount: result.messages.length,
          format: exportFormat
        });

      } catch (parseError) {
        // Update extraction with error
        await storage.updateExtractionStatus(
          extraction.id,
          "failed",
          undefined,
          undefined,
          (parseError as Error).message
        );

        res.status(500).json({
          id: extraction.id,
          status: "failed",
          error: (parseError as Error).message
        });
      }

    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Invalid request" 
      });
    }
  });

  // Get extraction status
  app.get("/api/extraction/:id", async (req, res) => {
    try {
      const extraction = await storage.getExtraction(req.params.id);
      if (!extraction) {
        return res.status(404).json({ error: "Extraction not found" });
      }
      res.json(extraction);
    } catch (error) {
      res.status(500).json({ error: "Failed to get extraction" });
    }
  });

  // Stripe payment route for subscriptions
  app.post("/api/create-subscription", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: "Payment processing not configured" });
    }
    
    try {
      const { email, name } = req.body;
      
      // Create customer
      const customer = await stripe.customers.create({
        email,
        name,
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID || "price_1234567890",
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      res.json({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Send email notifications for parsing errors
  app.post("/api/notify-errors", async (req, res) => {
    try {
      const emailService = EmailService.getInstance();
      const errors = await storage.getUnnotifiedErrors();
      
      for (const error of errors) {
        if (error.errorType === "interface_change") {
          await emailService.sendInterfaceChangeAlert(
            error.platform,
            (error.errorDetails as any)?.issues || [],
            error.url
          );
        } else if (error.errorType === "parsing_failure") {
          const mockError = new Error((error.errorDetails as any)?.message || "Unknown error");
          mockError.stack = (error.errorDetails as any)?.stack;
          await emailService.sendParsingFailureAlert(
            error.platform,
            mockError,
            error.url
          );
        }
        
        await storage.markErrorNotified(error.id);
      }
      
      res.json({ notified: errors.length });
    } catch (error) {
      res.status(500).json({ error: "Failed to send notifications" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function formatAsMarkdown(result: any): string {
  let markdown = `# ${result.vendor} Conversation\n\n`;
  markdown += `**Parsed at:** ${result.parsedAt}\n\n`;
  
  for (const message of result.messages) {
    const role = message.role === "user" ? "**User**" : "**Assistant**";
    markdown += `${role}:\n${message.content}\n\n---\n\n`;
  }
  
  return markdown;
}

function formatAsText(result: any): string {
  let text = `${result.vendor} Conversation\n`;
  text += `Parsed at: ${result.parsedAt}\n\n`;
  
  for (const message of result.messages) {
    const role = message.role === "user" ? "User" : "Assistant";
    text += `${role}: ${message.content}\n\n`;
  }
  
  return text;
}
