"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Database, 
  Server, 
  Shield, 
  TrendingUp, 
  Users, 
  FileText,
  Settings,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { backendAutomation, type AutomationTask } from '@/lib/backend-automation';

interface DashboardStats {
  projects: {
    total: number;
    completed: number;
    inProgress: number;
    planning: number;
    featured: number;
  };
  services: {
    total: number;
    avgPricing: {
      basic: number;
      premium: number;
      enterprise: number;
    };
  };
  team: {
    total: number;
  };
  skills: {
    total: number;
    byCategory: Record<string, number>;
    avgLevel: number;
  };
  testimonials: {
    total: number;
    avgRating: number;
  };
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: Record<string, { status: string; responseTime: number }>;
  performance: {
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

export function BackendDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [automationTasks, setAutomationTasks] = useState<AutomationTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [automationActive, setAutomationActive] = useState(false);
  const [adminToken] = useState('admin-secret-key'); // In production, get from secure auth

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use the backend automation service instead of API
      const [systemStatus, tasks] = await Promise.all([
        backendAutomation.getSystemStatus(),
        backendAutomation.getAllAutomationTasks()
      ]);
      
      // Transform the data to match expected interfaces
      const transformedStats: DashboardStats = {
        projects: {
          total: 6, // Mock data based on our projects
          completed: 4,
          inProgress: 1,
          planning: 1,
          featured: 3
        },
        services: {
          total: 6, // Mock data
          avgPricing: {
            basic: 1500,
            premium: 4000,
            enterprise: 8000
          }
        },
        team: {
          total: 4 // Mock data
        },
        skills: {
          total: 15, // Mock data
          byCategory: {
            frontend: 7,
            backend: 4,
            database: 2,
            devops: 2
          },
          avgLevel: 87
        },
        testimonials: {
          total: 3, // Mock data
          avgRating: 4.8
        }
      };

      const transformedHealth: SystemHealth = {
        status: systemStatus.status === 'critical' ? 'unhealthy' : systemStatus.status,
        timestamp: new Date().toISOString(),
        checks: systemStatus.services.reduce((acc, service) => {
          acc[service.name.toLowerCase().replace(' ', '_')] = {
            status: service.status,
            responseTime: service.responseTime
          };
          return acc;
        }, {} as Record<string, { status: string; responseTime: number }>),
        performance: {
          uptime: systemStatus.uptime,
          memoryUsage: systemStatus.metrics.performance.memoryUsage,
          cpuUsage: systemStatus.metrics.performance.cpuUsage
        }
      };

      const transformedActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'system_check',
          description: 'System health check completed successfully',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          user: 'system'
        },
        {
          id: '2',
          type: 'automation_task',
          description: 'Daily backup task executed',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          user: 'automation'
        },
        {
          id: '3',
          type: 'content_sync',
          description: 'Content synchronization completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          user: 'system'
        }
      ];

      setStats(transformedStats);
      setHealth(transformedHealth);
      setActivities(transformedActivities);
      setAutomationTasks(tasks);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  const handleAutomationToggle = () => {
    if (automationActive) {
      console.log('Stopping backend automation...');
      setAutomationActive(false);
    } else {
      console.log('Starting backend automation...');
      setAutomationActive(true);
    }
  };

  const handleBackup = async () => {
    try {
      const result = await backendAutomation.runAutomationTask('daily-backup');
      if (result.success) {
        alert(`Backup completed successfully in ${result.duration}ms`);
        loadDashboardData(); // Refresh data
      }
    } catch (err) {
      alert('Backup failed: ' + (err as Error).message);
    }
  };

  const handleSystemMaintenance = async () => {
    try {
      const result = await backendAutomation.runAutomationTask('health-check');
      if (result.success) {
        alert('System maintenance completed successfully');
        loadDashboardData();
      }
    } catch (err) {
      alert('Maintenance failed: ' + (err as Error).message);
    }
  };

  const handleClearCache = async () => {
    try {
      // Simulate cache clearing
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Cache cleared successfully');
      loadDashboardData();
    } catch (err) {
      alert('Cache clearing failed: ' + (err as Error).message);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-red-600">Dashboard Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={loadDashboardData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Backend Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor and manage your backend automation
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleAutomationToggle}
              variant={automationActive ? "destructive" : "default"}
              className="flex items-center space-x-2"
            >
              <Activity className="h-4 w-4" />
              <span>{automationActive ? 'Stop' : 'Start'} Automation</span>
            </Button>
            
            <Button onClick={loadDashboardData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* System Health */}
        {health && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                System Health
              </h2>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                health.status === 'healthy' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : health.status === 'degraded'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {health.status === 'healthy' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                {health.status.toUpperCase()}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Services</h3>
                {Object.entries(health.checks).map(([service, check]) => (
                  <div key={service} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{service}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        check.status === 'up' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {check.status}
                      </span>
                      <span className="text-gray-500">{check.responseTime.toFixed(1)}ms</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>{health.performance.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${health.performance.memoryUsage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>{health.performance.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${health.performance.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Uptime</h3>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(health.performance.uptime / 3600)}h {Math.floor((health.performance.uptime % 3600) / 60)}m
                </div>
                <p className="text-sm text-gray-500">
                  Since {new Date(Date.now() - health.performance.uptime * 1000).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Projects</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.projects.total}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between text-xs text-gray-500">
                <span>Completed: {stats.projects.completed}</span>
                <span>In Progress: {stats.projects.inProgress}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Server className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Services</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.services.total}</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Avg Premium: ${stats.services.avgPricing.premium.toLocaleString()}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Members</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.team.total}</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Skills Avg: {stats.skills.avgLevel}%
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Testimonials</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.testimonials.total}</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Avg Rating: {stats.testimonials.avgRating}/5
              </div>
            </motion.div>
          </div>
        )}

        {/* Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleBackup} className="flex items-center justify-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Backup Data</span>
              </Button>
              
              <Button onClick={handleSystemMaintenance} variant="outline" className="flex items-center justify-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Maintenance</span>
              </Button>
              
              <Button onClick={handleClearCache} variant="outline" className="flex items-center justify-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Clear Cache</span>
              </Button>
              
              <Button variant="outline" className="flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security Scan</span>
              </Button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded">
                    <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()} • {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}