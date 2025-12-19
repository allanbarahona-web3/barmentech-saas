import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ============ 🛡️ SECURITY HEADERS (Helmet) ============
  // Prevents MIME type sniffing, clickjacking, XSS, and more
  app.use(helmet({
    // Prevent browsers from interpreting files as something else
    noSniff: true,
    
    // Prevent clickjacking attacks
    frameguard: {
      action: 'deny', // Only allow same-origin in iframes
    },
    
    // Strict Transport Security - enforce HTTPS
    hsts: {
      maxAge: 31536000,  // 1 year in seconds
      includeSubDomains: true,
      preload: true,     // Include in HSTS preload list
    },
    
    // Content Security Policy - prevent inline scripts, XSS
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],  // Needed for most frameworks
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: [
          "'self'",
          process.env.FRONTEND_URL || 'http://localhost:3001',
        ],
        fontSrc: ["'self'", 'data:'],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
      },
    },
    
    // Remove X-Powered-By header
    hidePoweredBy: true,
    
    // Remove X-XSS-Protection (browsers handle this now)
    xssFilter: false,
  }));

  // ============ 🍪 COOKIE PARSER (for CSRF if needed) ============
  app.use(cookieParser());

  // ============ 🌐 CORS (Cross-Origin Resource Sharing) ============
  // Whitelist origins - prevents CSRF on modern APIs
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:3002',
      'https://www.barmentech.com',
      'https://barmentech.vercel.app',
      'https://sneakerscr.vercel.app',
      'https://unspeciously-monospermous-jacqueline.ngrok-free.dev',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Number'],
    optionsSuccessStatus: 200,
  });

  // ============ ✅ INPUT VALIDATION (ValidationPipe) ============
  // Whitelist approach: only accept properties defined in DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // Strip unknown properties
      forbidNonWhitelisted: true,   // Throw error on unknown properties
      transform: true,              // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ============ �️ IMAGE PROXY (bypass CORS) ============
  // Serves images from DO Spaces through the backend to avoid CORS issues
  app.get('/api/v1/files/logo', async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) {
        return res.status(400).json({ error: 'URL parameter required' });
      }

      const response = await fetch(url);
      if (!response.ok) {
        return res.status(response.status).send('Error fetching image');
      }

      const contentType = response.headers.get('content-type') || 'image/png';
      const buffer = await response.arrayBuffer();

      res.set('Content-Type', contentType);
      res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error('Error proxying image:', error);
      res.status(500).json({ error: 'Error fetching image' });
    }
  });

  // ============ �📍 GLOBAL PREFIX ============
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\n🚀 Server is running on: http://localhost:${port}/api/v1\n`);
  console.log('🔒 Security hardened with:');
  console.log('   ✅ Helmet headers (CSP, HSTS, X-Frame-Options, noSniff)');
  console.log('   ✅ CORS configured with whitelist');
  console.log('   ✅ Input validation with whitelist (forbidNonWhitelisted)');
  console.log('   ✅ Rate limiting ready (@Throttle decorators)');
  console.log('   ✅ JWT with JTI revocation');
  console.log('   ✅ Row-Level Security (RLS) on database');
  console.log('   ✅ ACID transactions for critical operations\n');
}

bootstrap();
