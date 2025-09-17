import { Project, ContactForm } from '@/types';

// Automation service for backend tasks
export class BackendAutomation {
  
  // Automated content validation
  static validateProjectData(project: Partial<Project>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!project.title || project.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long');
    }

    if (!project.description || project.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    if (!project.technologies || project.technologies.length === 0) {
      errors.push('At least one technology must be specified');
    }

    // Content quality validation
    if (project.title && project.title.length > 100) {
      warnings.push('Title is quite long, consider shortening it');
    }

    if (project.description && project.description.length > 500) {
      warnings.push('Description is very long, consider using longDescription field');
    }

    // URL validation
    if (project.liveUrl && !this.isValidUrl(project.liveUrl)) {
      errors.push('Live URL is not valid');
    }

    if (project.githubUrl && !this.isValidUrl(project.githubUrl)) {
      errors.push('GitHub URL is not valid');
    }

    // Image validation
    if (project.image && !this.isValidImageUrl(project.image)) {
      warnings.push('Image URL might not be accessible');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Automated SEO optimization
  static optimizeProjectForSEO(project: Project): Project {
    const optimized = { ...project };

    // Generate SEO-friendly title
    optimized.title = this.toTitleCase(project.title);

    // Optimize description length for meta descriptions
    if (project.description.length > 160) {
      optimized.description = project.description.substring(0, 157) + '...';
    }

    // Generate keywords from technologies
    const keywords = project.technologies.join(', ');
    
    // Add SEO metadata (would be used in meta tags)
    (optimized as Project & { seoData: unknown }).seoData = {
      keywords,
      slug: this.generateSlug(project.title),
      metaDescription: optimized.description,
      openGraphTitle: optimized.title,
      openGraphDescription: optimized.description,
      openGraphImage: project.image
    };

    return optimized;
  }

  // Automated content generation
  static generateProjectSummary(project: Project): string {
    const { title, technologies, category, status } = project;
    
    const techList = technologies.slice(0, 3).join(', ');
    const additionalTechs = technologies.length > 3 ? ` and ${technologies.length - 3} more` : '';
    
    return `${title} is a ${category.replace('-', ' ')} project built with ${techList}${additionalTechs}. Status: ${status}.`;
  }

  // Automated email templates
  static generateContactResponseEmail(contactData: ContactForm): {
    subject: string;
    html: string;
    text: string;
  } {
    const subject = `Thank you for contacting CodeStorm Hub - ${contactData.subject}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank you for contacting CodeStorm Hub!</h2>
        
        <p>Dear ${contactData.name},</p>
        
        <p>We have received your message regarding "${contactData.subject}" and will get back to you within 24 hours.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Submission Details:</h3>
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          ${contactData.budget ? `<p><strong>Budget:</strong> ${contactData.budget}</p>` : ''}
          ${contactData.timeline ? `<p><strong>Timeline:</strong> ${contactData.timeline}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p style="font-style: italic;">"${contactData.message}"</p>
        </div>
        
        <p>In the meantime, feel free to explore our portfolio and services on our website.</p>
        
        <p>Best regards,<br>
        <strong>CodeStorm Hub Team</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280;">
          This is an automated response. Please do not reply to this email.
          If you need immediate assistance, contact us at info@codestormhub.dev
        </p>
      </div>
    `;

    const text = `
Thank you for contacting CodeStorm Hub!

Dear ${contactData.name},

We have received your message regarding "${contactData.subject}" and will get back to you within 24 hours.

Your Submission Details:
Subject: ${contactData.subject}
${contactData.budget ? `Budget: ${contactData.budget}` : ''}
${contactData.timeline ? `Timeline: ${contactData.timeline}` : ''}

Message: "${contactData.message}"

In the meantime, feel free to explore our portfolio and services on our website.

Best regards,
CodeStorm Hub Team

---
This is an automated response. Please do not reply to this email.
If you need immediate assistance, contact us at info@codestormhub.dev
    `;

    return { subject, html, text };
  }

  // Automated data backup
  static async createDataBackup(): Promise<{
    success: boolean;
    backupId: string;
    timestamp: string;
    size: number;
  }> {
    try {
      // Simulate gathering all data
      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data: {
          // In a real app, you'd fetch from your database
          projects: [], // await ProjectStore.getAll()
          services: [], // await ServiceStore.getAll()
          contacts: [], // await ContactStore.getAll()
        }
      };

      const backupId = `backup_${Date.now()}`;
      const size = JSON.stringify(backupData).length;

      // In a real app, you'd save to cloud storage
      console.log(`Backup ${backupId} created with size ${size} bytes`);

      return {
        success: true,
        backupId,
        timestamp: backupData.timestamp,
        size
      };
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw new Error('Failed to create backup');
    }
  }

  // Automated performance monitoring
  static async runPerformanceCheck(): Promise<{
    score: number;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Simulate performance checks
    const memoryUsage = this.getMemoryUsage();
    if (memoryUsage > 80) {
      issues.push('High memory usage detected');
      recommendations.push('Consider implementing memory optimization');
      score -= 20;
    }

    // Check response times (simulated)
    const avgResponseTime = Math.random() * 1000;
    if (avgResponseTime > 500) {
      issues.push('Slow API response times');
      recommendations.push('Optimize database queries and add caching');
      score -= 15;
    }

    // Check error rates (simulated)
    const errorRate = Math.random() * 10;
    if (errorRate > 2) {
      issues.push('High error rate detected');
      recommendations.push('Review error handling and add monitoring');
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      issues,
      recommendations
    };
  }

  // Automated content sync
  static async syncContentWithCMS(): Promise<{
    success: boolean;
    synced: number;
    errors: string[];
  }> {
    try {
      // Simulate CMS sync
      const errors: string[] = [];
      let synced = 0;

      // Mock sync operations
      await new Promise(resolve => setTimeout(resolve, 1000));
      synced = Math.floor(Math.random() * 10) + 1;

      return {
        success: true,
        synced,
        errors
      };
    } catch (error) {
      return {
        success: false,
        synced: 0,
        errors: ['CMS sync failed: ' + (error as Error).message]
      };
    }
  }

  // Automated security check
  static async performSecurityAudit(): Promise<{
    score: number;
    vulnerabilities: string[];
    recommendations: string[];
  }> {
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Simulate security checks
    const checks = [
      { name: 'HTTPS enforced', passed: true },
      { name: 'Input validation', passed: true },
      { name: 'Rate limiting', passed: true },
      { name: 'Authentication', passed: false },
      { name: 'CORS configuration', passed: true },
    ];

    checks.forEach(check => {
      if (!check.passed) {
        vulnerabilities.push(`${check.name} not properly configured`);
        recommendations.push(`Implement proper ${check.name.toLowerCase()}`);
        score -= 20;
      }
    });

    return {
      score: Math.max(0, score),
      vulnerabilities,
      recommendations
    };
  }

  // Utility methods
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private static isValidImageUrl(url: string): boolean {
    if (!this.isValidUrl(url)) return false;
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  }

  private static toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  private static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  private static getMemoryUsage(): number {
    // Simulate memory usage percentage
    return Math.floor(Math.random() * 100);
  }
}

// Automation scheduler (would run as cron jobs in production)
export class AutomationScheduler {
  private static tasks: Map<string, NodeJS.Timeout> = new Map();

  static scheduleTask(
    name: string,
    task: () => Promise<void>,
    intervalMs: number
  ): void {
    // Clear existing task if any
    this.clearTask(name);

    // Schedule new task
    const interval = setInterval(async () => {
      try {
        console.log(`Running scheduled task: ${name}`);
        await task();
      } catch (error) {
        console.error(`Scheduled task ${name} failed:`, error);
      }
    }, intervalMs);

    this.tasks.set(name, interval);
    console.log(`Scheduled task: ${name} (every ${intervalMs}ms)`);
  }

  static clearTask(name: string): void {
    const task = this.tasks.get(name);
    if (task) {
      clearInterval(task);
      this.tasks.delete(name);
      console.log(`Cleared scheduled task: ${name}`);
    }
  }

  static clearAllTasks(): void {
    this.tasks.forEach((task, name) => {
      clearInterval(task);
      console.log(`Cleared scheduled task: ${name}`);
    });
    this.tasks.clear();
  }

  // Predefined automation schedules
  static startBackendAutomation(): void {
    // Daily backup at 2 AM
    this.scheduleTask(
      'daily-backup',
      async () => {
        await BackendAutomation.createDataBackup();
      },
      24 * 60 * 60 * 1000
    );

    // Performance check every hour
    this.scheduleTask(
      'performance-check',
      async () => {
        await BackendAutomation.runPerformanceCheck();
      },
      60 * 60 * 1000
    );

    // Security audit daily
    this.scheduleTask(
      'security-audit',
      async () => {
        await BackendAutomation.performSecurityAudit();
      },
      24 * 60 * 60 * 1000
    );

    // Content sync every 6 hours
    this.scheduleTask(
      'content-sync',
      async () => {
        await BackendAutomation.syncContentWithCMS();
      },
      6 * 60 * 60 * 1000
    );

    console.log('Backend automation started');
  }

  static stopBackendAutomation(): void {
    this.clearAllTasks();
    console.log('Backend automation stopped');
  }
}

export default BackendAutomation;