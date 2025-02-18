import { Express } from "express";
import session from "express-session";
import { createHash, scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import MemoryStore from "memorystore";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

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

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

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
      // Validate request body
      const validatedData = registerSchema.parse(req.body);
      const { email, password, name } = validatedData;

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Email is already registered' });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const now = new Date();
      const [user] = await db.insert(users).values({
        email,
        password: hashedPassword,
        name,
        createdAt: now,
        updatedAt: now,
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      // Find user by email
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Verify password
      const isValidPassword = await comparePasswords(password, user.password);
      if (!isValidPassword) {
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed. Please try again.' });
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