import { Express } from "express";
import session from "express-session";
import { createHash, scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import MemoryStore from "memorystore";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const SessionStore = MemoryStore(session);
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Configure session middleware
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
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

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const [user] = await db.insert(users).values({
        email,
        password: hashedPassword,
        name,
      }).returning();

      // Set user session
      req.session.user = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      res.status(201).json({ 
        id: user.id,
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (!user || !(await comparePasswords(password, user.password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Set user session
      req.session.user = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      res.json({ 
        id: user.id,
        email: user.email,
        name: user.name,
      });
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

  app.get('/api/auth/user', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const [user] = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, req.session.user.id))
      .limit(1);

      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  });
}