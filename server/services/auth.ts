import { Express } from "express";
import session from "express-session";
import { createHash } from "crypto";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

interface User {
  id: string;
  email: string;
  name: string;
}

const users = new Map<string, User>();

export function setupAuth(app: Express) {
  // Configure session middleware
  app.use(
    session({
      cookie: { maxAge: 86400000 },
      store: new SessionStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      resave: false,
      secret: process.env.SESSION_SECRET || 'development_secret',
      saveUninitialized: false,
    })
  );

  // Authentication endpoints
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      
      // Create user ID from email
      const userId = createHash('sha256').update(email).digest('hex');
      
      if (users.has(userId)) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = {
        id: userId,
        email,
        name
      };

      users.set(userId, user);
      
      // Set user session
      req.session.user = user;
      
      res.status(201).json({ user });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const userId = createHash('sha256').update(email).digest('hex');
      const user = users.get(userId);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Set user session
      req.session.user = user;
      
      res.json({ user });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/user', (req, res) => {
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ user });
  });
}
