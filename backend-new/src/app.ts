import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

export function createApp(): Application {
  const app = express();

  // Trust reverse proxy headers (Render, Vercel, Cloudflare) for rate limiting & IP resolution
  app.set('trust proxy', 1);

  // 1. Security Headers (Rule 40)
  app.use(helmet({
    contentSecurityPolicy: false, // Compatible with React client assets
    crossOriginEmbedderPolicy: false,
  }));

  // 2. CORS (Rule 40)
  const allowedOrigins = env.CORS_ORIGINS === '*' ? '*' : env.CORS_ORIGINS.split(',').map((o) => o.trim());
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // 3. Request ID & Structured Request Logging (Rule 62)
  app.use((req: Request, res: Response, next: NextFunction) => {
    const reqId = (req.headers['x-request-id'] as string) || `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    (req as any).requestId = reqId;
    res.setHeader('X-Request-Id', reqId);

    const startTime = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      if (req.originalUrl !== '/api/health') {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms | ${reqId}`);
      }
    });

    next();
  });

  // 4. Body Parsers & General Rate Limiting
  app.use(generalLimiter);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // 5. API Routes
  app.get('/', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'Societal Innovation Intelligence Engine (SIH PS-43) - Production Backend',
      state: 'Government of Jharkhand',
      version: '1.0.0',
      apiBase: '/api/v1',
      healthCheck: '/health',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api', routes);
  app.use('/api/v1', routes);
  app.use('/health', (req, res, next) => {
    // Top level /health fallback
    req.url = '/health';
    routes(req, res, next);
  });

  // 6. 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
      },
      requestId: (req as any).requestId,
    });
  });

  // 7. Global Centralized Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();

