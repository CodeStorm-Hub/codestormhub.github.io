"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Server, 
  Database, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Play,
  RefreshCw,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { automationUtils, backendAutomation } from '@/lib/backend-automation';

interface SystemStatus {
  status: 'healthy' | 'degraded' | 'critical';
  services: Array<{
    name: string;
    status: 'up' | 'down' | 'degraded';
    lastCheck: string;
    responseTime: number;
    uptime: number;
  }>;
  metrics: {
    requests: {
      total: number;
      success: number;
      errors: number;
      averageResponseTime: number;
    };
    users: {
      active: number;
      total: number;
      newToday: number;
    };
    performance: {
      cpuUsage: number;
      memoryUsage: number;
      diskUsage: number;
    };
  };
  uptime: number;
}

interface AutomationTask {
  id: string;
  name: string;
  description: string;
  schedule: string;
  lastRun: string | null;
  nextRun: string;
  status: 'active' | 'inactive' | 'running' | 'failed';
  results: {
    success: number;
    failures: number;
    lastResult: string;
  };
}

export function AdminDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [automationTasks, setAutomationTasks] = useState<AutomationTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningTasks, setRunningTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSystemStatus();
    fetchAutomationTasks();
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      fetchSystemStatus();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchSystemStatus = async () => {
    try {
      // For GitHub Pages demo, use backend automation service directly
      const data = await backendAutomation.getSystemStatus();
      
      // Transform the data to match our interface
      const transformedData: SystemStatus = {
        ...data,
        services: data.services.map(service => ({
          ...service,
          lastCheck: service.lastCheck.toISOString()
        }))
      };
      
      setSystemStatus(transformedData);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAutomationTasks = async () => {
    try {
      // For GitHub Pages demo, use backend automation service directly
      const tasks = await backendAutomation.getAllAutomationTasks();
      
      // Transform the data to match our interface
      const transformedTasks: AutomationTask[] = tasks.map(task => ({
        ...task,
        lastRun: task.lastRun ? task.lastRun.toISOString() : null,
        nextRun: task.nextRun.toISOString()
      }));
      
      setAutomationTasks(transformedTasks);
    } catch (error) {
      console.error('Failed to fetch automation tasks:', error);
    }
  };

  const runTask = async (taskId: string) => {
    setRunningTasks(prev => new Set(prev).add(taskId));
    
    try {
      // For GitHub Pages demo, use backend automation service directly
      const result = await backendAutomation.runAutomationTask(taskId);
      console.log('Task result:', result);
      
      // Refresh tasks to get updated status
      await fetchAutomationTasks();
    } catch (error) {
      console.error('Failed to run task:', error);
    } finally {
      setRunningTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
      case 'down':
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName.toLowerCase()) {
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'email service':
        return <Mail className="w-4 h-4" />;
      case 'storage':
        return <Server className="w-4 h-4" />;
      case 'analytics':
        return <BarChart3 className="w-4 h-4" />;
      case 'monitoring':
        return <Shield className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Backend Automation Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor and manage backend automation services
          </p>
        </div>
        <Button onClick={fetchSystemStatus} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Status Overview */}
      {systemStatus && (
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              {getStatusIcon(systemStatus.status)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {systemStatus.status}
              </div>
              <p className="text-xs text-muted-foreground">
                Uptime: {automationUtils.formatUptime(systemStatus.uptime)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStatus.metrics.requests.total.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {((systemStatus.metrics.requests.success / systemStatus.metrics.requests.total) * 100).toFixed(1)}% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStatus.metrics.users.active}
              </div>
              <p className="text-xs text-muted-foreground">
                +{systemStatus.metrics.users.newToday} new today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStatus.metrics.performance.cpuUsage}%
              </div>
              <p className="text-xs text-muted-foreground">
                Memory: {systemStatus.metrics.performance.memoryUsage}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Services Status */}
      {systemStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Services Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getServiceIcon(service.name)}
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-500">
                        Response time: {service.responseTime}ms
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={service.status === 'up' ? 'default' : 'destructive'}>
                      {service.status}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      {service.uptime.toFixed(1)}% uptime
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Automation Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automationTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{task.name}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Schedule: {task.schedule} | Last run: {task.lastRun ? new Date(task.lastRun).toLocaleString() : 'Never'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-right">
                    <div className="text-green-600">✓ {task.results.success}</div>
                    <div className="text-red-600">✗ {task.results.failures}</div>
                  </div>
                  
                  <Badge variant={task.status === 'active' ? 'default' : 'destructive'}>
                    {task.status}
                  </Badge>
                  
                  <Button
                    size="sm"
                    onClick={() => runTask(task.id)}
                    loading={runningTasks.has(task.id)}
                    disabled={runningTasks.has(task.id)}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Run
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}