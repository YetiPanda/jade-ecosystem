/**
 * Security Middleware
 *
 * CORS, Helmet, rate limiting, and other security configurations
 */

import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

const IS_DEV = process.env.NODE_ENV !== 'production';

/**
 * CORS configuration
 */
const allowedOrigins = IS_DEV
  ? ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173']
  : (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Request-ID',
  ],
  exposedHeaders: ['X-Request-ID', 'X-Total-Count'],
  maxAge: 86400, // 24 hours
};

/**
 * Apply CORS middleware
 */
export const corsMiddleware = cors(corsOptions);

/**
 * Helmet security headers configuration
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: IS_DEV
    ? false
    : {
        directives: {
          defaultSrc: ["'self'", 'https://apollo-server-landing-page.cdn.apollographql.com'],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://embeddable-sandbox.cdn.apollographql.com',
            'https://apollo-server-landing-page.cdn.apollographql.com',
            'https://fonts.googleapis.com'
          ],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://embeddable-sandbox.cdn.apollographql.com',
            'https://apollo-server-landing-page.cdn.apollographql.com'
          ],
          imgSrc: [
            "'self'",
            'data:',
            'https:',
            'https://apollo-server-landing-page.cdn.apollographql.com'
          ],
          connectSrc: [
            "'self'",
            'https://embeddable-sandbox.cdn.apollographql.com',
            'https://sandbox.embed.apollographql.com'
          ],
          fontSrc: [
            "'self'",
            'data:',
            'https://embeddable-sandbox.cdn.apollographql.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
          ],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: [
            "'self'",
            'https://embeddable-sandbox.cdn.apollographql.com',
            'https://sandbox.embed.apollographql.com'
          ],
          childSrc: [
            "'self'",
            'https://embeddable-sandbox.cdn.apollographql.com',
            'https://sandbox.embed.apollographql.com'
          ],
          manifestSrc: [
            "'self'",
            'https://apollo-server-landing-page.cdn.apollographql.com'
          ],
        },
      },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

/**
 * Request ID middleware
 * Adds unique ID to each request for tracing
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId =
    req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  (req as any).requestId = requestId;
  res.setHeader('X-Request-ID', requestId as string);

  next();
}

/**
 * Request logging middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      requestId: (req as any).requestId,
    };

    // Use appropriate log level based on status code
    if (res.statusCode >= 500) {
      console.error('Request error:', logData);
    } else if (res.statusCode >= 400) {
      console.warn('Request warning:', logData);
    } else {
      console.log('Request:', logData);
    }
  });

  next();
}

/**
 * Rate limiting configuration
 * Note: In production, use Redis-based rate limiting with express-rate-limit + rate-limit-redis
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || 'unknown';
    const now = Date.now();

    const record = rateLimitStore.get(key);

    // Create new record if doesn't exist or window expired
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + options.windowMs,
      });
      next();
      return;
    }

    // Increment count
    record.count++;

    // Check if limit exceeded
    if (record.count > options.max) {
      res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: options.message || 'Too many requests, please try again later',
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        },
      });
      return;
    }

    next();
  };
}

/**
 * Clean up old rate limit records periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute
