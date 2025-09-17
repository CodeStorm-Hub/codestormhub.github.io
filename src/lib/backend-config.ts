/**
 * Backend Automation Configuration
 * 
 * This file contains all configuration options for the backend automation system.
 * It includes settings for email services, databases, monitoring, and more.
 * 
 * For GitHub Pages deployment, some features are simulated or use client-side fallbacks.
 * In a full deployment, these would connect to actual services.
 */

export interface BackendConfig {
  // Environment settings
  environment: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  version: string;

  // Feature flags
  features: {
    emailNotifications: boolean;
    databaseStorage: boolean;
    analyticsTracking: boolean;
    automationTasks: boolean;
    webhookSupport: boolean;
    rateLimiting: boolean;
    healthChecks: boolean;
  };

  // Service configurations
  services: {
    email: {
      provider: 'sendgrid' | 'nodemailer' | 'resend' | 'mock';
      apiKey?: string;
      fromEmail: string;
      adminEmail: string;
      templates: {
        contactConfirmation: string;
        contactNotification: string;
        autoResponder: string;
        systemAlert: string;
      };
    };

    database: {
      provider: 'supabase' | 'planetscale' | 'vercel-postgres' | 'mock';
      url?: string;
      apiKey?: string;
      tables: {
        contacts: string;
        projects: string;
        analytics: string;
        logs: string;
      };
    };

    storage: {
      provider: 's3' | 'cloudinary' | 'vercel-blob' | 'mock';
      bucket?: string;
      region?: string;
      apiKey?: string;
    };

    monitoring: {
      provider: 'sentry' | 'datadog' | 'newrelic' | 'mock';
      dsn?: string;
      apiKey?: string;
      alertThresholds: {
        errorRate: number;
        responseTime: number;
        uptime: number;
      };
    };

    analytics: {
      provider: 'google-analytics' | 'mixpanel' | 'amplitude' | 'mock';
      trackingId?: string;
      apiKey?: string;
      events: string[];
    };
  };

  // Automation settings
  automation: {
    enabled: boolean;
    schedule: {
      healthChecks: string; // cron expression
      dataBackup: string;
      contentSync: string;
      analyticsReport: string;
      securityScan: string;
    };
    retryAttempts: number;
    timeoutMs: number;
  };

  // Security settings
  security: {
    rateLimiting: {
      windowMs: number;
      maxRequests: number;
      skipSuccessfulRequests: boolean;
    };
    cors: {
      origin: string[];
      credentials: boolean;
    };
    headers: Record<string, string>;
  };

  // Notification settings
  notifications: {
    slack?: {
      webhookUrl: string;
      channel: string;
    };
    discord?: {
      webhookUrl: string;
    };
    email: {
      alerts: boolean;
      reports: boolean;
      frequency: 'immediate' | 'hourly' | 'daily';
    };
  };
}

// Default configuration for GitHub Pages deployment
export const DEFAULT_BACKEND_CONFIG: BackendConfig = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  version: '1.0.0',

  features: {
    emailNotifications: true,
    databaseStorage: true,
    analyticsTracking: true,
    automationTasks: true,
    webhookSupport: true,
    rateLimiting: true,
    healthChecks: true,
  },

  services: {
    email: {
      provider: process.env.EMAIL_PROVIDER as any || 'mock',
      apiKey: process.env.EMAIL_API_KEY,
      fromEmail: process.env.FROM_EMAIL || 'noreply@codestormhub.dev',
      adminEmail: process.env.ADMIN_EMAIL || 'admin@codestormhub.dev',
      templates: {
        contactConfirmation: 'contact-confirmation',
        contactNotification: 'contact-notification',
        autoResponder: 'auto-responder',
        systemAlert: 'system-alert',
      },
    },

    database: {
      provider: process.env.DATABASE_PROVIDER as any || 'mock',
      url: process.env.DATABASE_URL,
      apiKey: process.env.DATABASE_API_KEY,
      tables: {
        contacts: 'contacts',
        projects: 'projects',
        analytics: 'analytics',
        logs: 'system_logs',
      },
    },

    storage: {
      provider: process.env.STORAGE_PROVIDER as any || 'mock',
      bucket: process.env.STORAGE_BUCKET,
      region: process.env.STORAGE_REGION,
      apiKey: process.env.STORAGE_API_KEY,
    },

    monitoring: {
      provider: process.env.MONITORING_PROVIDER as any || 'mock',
      dsn: process.env.SENTRY_DSN,
      apiKey: process.env.MONITORING_API_KEY,
      alertThresholds: {
        errorRate: 5, // 5%
        responseTime: 2000, // 2 seconds
        uptime: 99.9, // 99.9%
      },
    },

    analytics: {
      provider: process.env.ANALYTICS_PROVIDER as any || 'mock',
      trackingId: process.env.GA_TRACKING_ID,
      apiKey: process.env.ANALYTICS_API_KEY,
      events: [
        'contact_form_submitted',
        'project_viewed',
        'service_inquired',
        'page_viewed',
        'button_clicked',
      ],
    },
  },

  automation: {
    enabled: true,
    schedule: {
      healthChecks: '*/15 * * * *', // Every 15 minutes
      dataBackup: '0 2 * * *', // Daily at 2 AM
      contentSync: '0 */6 * * *', // Every 6 hours
      analyticsReport: '0 8 * * *', // Daily at 8 AM
      securityScan: '0 0 * * 0', // Weekly on Sunday
    },
    retryAttempts: 3,
    timeoutMs: 30000, // 30 seconds
  },

  security: {
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
      skipSuccessfulRequests: false,
    },
    cors: {
      origin: [
        'https://codestormhub.github.io',
        'http://localhost:3000',
        'http://localhost:3001',
      ],
      credentials: true,
    },
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },

  notifications: {
    slack: {
      webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
      channel: process.env.SLACK_CHANNEL || '#general',
    },
    discord: {
      webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
    },
    email: {
      alerts: true,
      reports: true,
      frequency: 'immediate',
    },
  },
};

// Configuration validation
export function validateBackendConfig(config: BackendConfig): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!config.services.email.fromEmail.includes('@')) {
    errors.push('Invalid from email address');
  }

  if (!config.services.email.adminEmail.includes('@')) {
    errors.push('Invalid admin email address');
  }

  // Feature dependency validation
  if (config.features.emailNotifications && config.services.email.provider === 'mock') {
    warnings.push('Email notifications enabled but using mock provider');
  }

  if (config.features.databaseStorage && config.services.database.provider === 'mock') {
    warnings.push('Database storage enabled but using mock provider');
  }

  // Security validation
  if (config.security.rateLimiting.maxRequests > 1000) {
    warnings.push('Rate limiting max requests is very high (>1000)');
  }

  if (config.automation.timeoutMs > 60000) {
    warnings.push('Automation timeout is very high (>60s)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Environment-specific configurations
export const DEVELOPMENT_CONFIG: Partial<BackendConfig> = {
  features: {
    ...DEFAULT_BACKEND_CONFIG.features,
    rateLimiting: false, // Disable for development
  },
  security: {
    ...DEFAULT_BACKEND_CONFIG.security,
    rateLimiting: {
      ...DEFAULT_BACKEND_CONFIG.security.rateLimiting,
      maxRequests: 1000, // Higher limit for development
    },
  },
};

export const PRODUCTION_CONFIG: Partial<BackendConfig> = {
  features: {
    ...DEFAULT_BACKEND_CONFIG.features,
    rateLimiting: true,
  },
  automation: {
    ...DEFAULT_BACKEND_CONFIG.automation,
    retryAttempts: 5, // More retries in production
  },
};

// Export the final configuration
export const BACKEND_CONFIG: BackendConfig = {
  ...DEFAULT_BACKEND_CONFIG,
  ...(process.env.NODE_ENV === 'production' ? PRODUCTION_CONFIG : DEVELOPMENT_CONFIG),
};

export default BACKEND_CONFIG;