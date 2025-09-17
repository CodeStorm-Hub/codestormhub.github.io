import { NextRequest, NextResponse } from 'next/server';

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStorage = new Map<string, { count: number; resetTime: number }>();

// Security headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  '/api/contact': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many contact form submissions. Please try again later.'
  },
  '/api/projects': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    message: 'Too many requests. Please slow down.'
  },
  '/api/admin': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: 'Too many admin requests. Please slow down.'
  },
  default: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    message: 'Rate limit exceeded. Please try again later.'
  }
};

// Request validation
interface RequestValidation {
  isValid: boolean;
  errors: string[];
}

// Rate limiting middleware
export function createRateLimiter(config?: RateLimitConfig) {
  return (request: NextRequest): NextResponse | null => {
    const ip = getClientIP(request);
    const pathname = request.nextUrl.pathname;
    
    // Get rate limit config for this endpoint
    const rateLimitConfig = config || rateLimitConfigs[pathname] || rateLimitConfigs.default;
    
    const key = `${ip}:${pathname}`;
    const now = Date.now();
    const windowStart = now - rateLimitConfig.windowMs;
    
    // Get or create rate limit data
    let rateLimitData = rateLimitStorage.get(key);
    
    if (!rateLimitData || rateLimitData.resetTime < windowStart) {
      rateLimitData = {
        count: 0,
        resetTime: now + rateLimitConfig.windowMs
      };
    }
    
    rateLimitData.count++;
    rateLimitStorage.set(key, rateLimitData);
    
    // Check if rate limit exceeded
    if (rateLimitData.count > rateLimitConfig.maxRequests) {
      return NextResponse.json(
        { 
          error: rateLimitConfig.message,
          retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitData.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitData.resetTime.toString(),
          }
        }
      );
    }
    
    return null; // Continue processing
  };
}

// Security middleware
export function applySecurity(response: NextResponse): NextResponse {
  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// CORS middleware
export function applyCors(request: NextRequest, response: NextResponse): NextResponse {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return new NextResponse(null, { status: 200, headers: response.headers });
  }
  
  // Apply CORS headers to actual requests
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// Input validation middleware
export function validateRequest(request: NextRequest, rules: ValidationRules): RequestValidation {
  const errors: string[] = [];
  
  // Validate Content-Type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      errors.push('Content-Type must be application/json');
    }
  }
  
  // Validate request size
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > (rules.maxBodySize || 1024 * 1024)) {
    errors.push('Request body too large');
  }
  
  // Validate required headers
  if (rules.requiredHeaders) {
    rules.requiredHeaders.forEach(header => {
      if (!request.headers.get(header)) {
        errors.push(`Missing required header: ${header}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Authentication middleware
export function validateAuth(request: NextRequest): {
  isValid: boolean;
  user?: unknown;
  error?: string;
} {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      isValid: false,
      error: 'Missing or invalid authorization header'
    };
  }
  
  const token = authHeader.substring(7);
  
  // Simple token validation (use proper JWT validation in production)
  if (token === 'admin-secret-key') {
    return {
      isValid: true,
      user: { id: 'admin', role: 'admin' }
    };
  }
  
  return {
    isValid: false,
    error: 'Invalid token'
  };
}

// Request logging middleware
export function logRequest(request: NextRequest): void {
  const timestamp = new Date().toISOString();
  const method = request.method;
  const url = request.url;
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
}

// Error handling middleware
export function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    // Don't expose internal errors in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      {
        error: isDevelopment ? error.message : 'Internal server error',
        ...(isDevelopment && { stack: error.stack })
      },
      { status: 500 }
    );
  }
  
  return NextResponse.json(
    { error: 'Unknown error occurred' },
    { status: 500 }
  );
}

// Utility functions
function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

// Validation rules interface
interface ValidationRules {
  maxBodySize?: number;
  requiredHeaders?: string[];
  allowedMethods?: string[];
}

// Comprehensive middleware composer
export function composeMiddleware(
  request: NextRequest,
  options: {
    enableRateLimit?: boolean;
    enableAuth?: boolean;
    enableCors?: boolean;
    enableSecurity?: boolean;
    enableLogging?: boolean;
    requiredRole?: string;
    validationRules?: ValidationRules;
  } = {}
): NextResponse | null {
  const {
    enableRateLimit = true,
    enableAuth = false,
    enableLogging = true,
    validationRules
  } = options;
  
  try {
    // Logging
    if (enableLogging) {
      logRequest(request);
    }
    
    // Rate limiting
    if (enableRateLimit) {
      const rateLimitResult = createRateLimiter()(request);
      if (rateLimitResult) {
        return applySecurity(rateLimitResult);
      }
    }
    
    // Input validation
    if (validationRules) {
      const validation = validateRequest(request, validationRules);
      if (!validation.isValid) {
        const response = NextResponse.json(
          { error: 'Validation failed', details: validation.errors },
          { status: 400 }
        );
        return applySecurity(response);
      }
    }
    
    // Authentication
    if (enableAuth) {
      const authResult = validateAuth(request);
      if (!authResult.isValid) {
        const response = NextResponse.json(
          { error: authResult.error },
          { status: 401 }
        );
        return applySecurity(response);
      }
      
      // Add user to request context (in a real app)
      // request.user = authResult.user;
    }
    
    return null; // Continue processing
    
  } catch (error) {
    return handleError(error);
  }
}

// Cleanup function for rate limit storage
export function cleanupRateLimitStorage(): void {
  const now = Date.now();
  
  for (const [key, data] of rateLimitStorage.entries()) {
    if (data.resetTime < now) {
      rateLimitStorage.delete(key);
    }
  }
}

// Schedule cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimitStorage, 5 * 60 * 1000);
}

const middlewareExports = {
  createRateLimiter,
  applySecurity,
  applyCors,
  validateRequest,
  validateAuth,
  logRequest,
  handleError,
  composeMiddleware
};

export default middlewareExports;