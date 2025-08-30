import { OAuth2Client } from 'google-auth-library';
import { Express, Request, Response } from 'express';
import { storage } from './storage';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required');
}

const client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'postmessage' // For authorization code flow
);

export function setupGoogleAuth(app: Express) {
  // Google OAuth login endpoint
  app.post('/api/auth/google', async (req: Request, res: Response) => {
    try {
      const { credential } = req.body;
      
      if (!credential) {
        return res.status(400).json({ error: 'Google credential is required' });
      }

      // Verify the Google ID token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(400).json({ error: 'Invalid Google token' });
      }

      const { sub: googleId, email, name, picture } = payload;
      
      if (!email) {
        return res.status(400).json({ error: 'Email not provided by Google' });
      }

      // Check if user exists by email
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          username: name || email.split('@')[0],
          email,
          password: 'google_oauth', // Placeholder password for OAuth users
        });
      }

      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).authMethod = 'google';

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Google OAuth error:', error);
      res.status(500).json({ error: 'Google authentication failed' });
    }
  });

  // OAuth logout endpoint (same as before)
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Get current user endpoint (same as before)
  app.get('/api/auth/user', async (req: Request, res: Response) => {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  });
}