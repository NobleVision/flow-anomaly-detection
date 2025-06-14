'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardMetrics } from '@/types';
import { formatNumber, formatBytes } from '@/lib/utils';
import { 
  Activity, 
  AlertTriangle, 
  Shield, 
  Zap, 
  TrendingUp, 
  Clock,
  Network,
  Users
} from 'lucide-react';

interface MetricsOverviewProps {
  metrics: DashboardMetrics;
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-500';
    if (health >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthBadgeVariant = (health: number) => {
    if (health >= 90) return 'success';
    if (health >= 70) return 'warning';
    return 'danger';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Network Health */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network Health</CardTitle>
          <Shield className={`h-4 w-4 ${getHealthColor(metrics.networkHealth)}`} />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {metrics.networkHealth}%
            </div>
            <Badge variant={getHealthBadgeVariant(metrics.networkHealth)}>
              {metrics.networkHealth >= 90 ? 'Excellent' : 
               metrics.networkHealth >= 70 ? 'Good' : 'Poor'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Overall system performance
          </p>
          {/* Health bar */}
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                metrics.networkHealth >= 90 ? 'bg-green-500' :
                metrics.networkHealth >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${metrics.networkHealth}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Total Flows */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Flows</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(metrics.totalFlows)}
          </div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            +12.5% from last hour
          </p>
          <div className="mt-3 flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anomalies Detected */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Anomalies</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">
            {formatNumber(metrics.anomaliesDetected)}
          </div>
          <p className="text-xs text-muted-foreground">
            Detected this session
          </p>
          <div className="mt-3 flex items-center space-x-2">
            <Badge variant="warning" className="text-xs">
              {metrics.activeAlarms} Active
            </Badge>
            {metrics.anomaliesDetected > 0 && (
              <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Throughput */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Throughput</CardTitle>
          <Zap className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.throughput.current.toFixed(1)} <span className="text-sm font-normal">Mbps</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Avg: {metrics.throughput.average.toFixed(1)} • Peak: {metrics.throughput.peak.toFixed(1)}
          </p>
          <div className="mt-3 w-full bg-muted rounded-full h-1">
            <div 
              className="h-1 bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${(metrics.throughput.current / metrics.throughput.peak) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Latency */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latency</CardTitle>
          <Clock className="h-4 w-4 text-cyan-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.latency.current.toFixed(1)} <span className="text-sm font-normal">ms</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Avg: {metrics.latency.average.toFixed(1)} • P95: {metrics.latency.p95.toFixed(1)}
          </p>
          <div className="mt-3 flex items-center space-x-2">
            <Badge 
              variant={metrics.latency.current < 20 ? 'success' : 
                      metrics.latency.current < 50 ? 'warning' : 'danger'}
              className="text-xs"
            >
              {metrics.latency.current < 20 ? 'Excellent' : 
               metrics.latency.current < 50 ? 'Good' : 'Poor'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Active Alarms */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Alarms</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {formatNumber(metrics.activeAlarms)}
          </div>
          <p className="text-xs text-muted-foreground">
            Requiring attention
          </p>
          <div className="mt-3 flex items-center space-x-2">
            {metrics.activeAlarms > 0 ? (
              <>
                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-red-500">Action Required</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="text-xs text-green-500">All Clear</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Talkers */}
      <Card className="lg:col-span-2 relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Talkers</CardTitle>
          <Network className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.topTalkers.map((talker, index) => (
              <div key={talker.ip} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-500 text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-mono text-sm">{talker.ip}</div>
                    <div className="text-xs text-muted-foreground">
                      {talker.flows} flows
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {formatBytes(talker.bytes)}
                  </div>
                  <div className="w-20 bg-muted rounded-full h-1 mt-1">
                    <div 
                      className="h-1 bg-indigo-500 rounded-full"
                      style={{ 
                        width: `${(talker.bytes / metrics.topTalkers[0].bytes) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
