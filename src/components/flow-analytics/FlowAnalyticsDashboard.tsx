'use client';

import { FlowAnalytics, DashboardMetrics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  BarChart3,
  TrendingUp,
  Network,
  Globe,
  Zap,
  Database,
  Clock,
  Wifi,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface FlowAnalyticsDashboardProps {
  analytics: FlowAnalytics;
  metrics: DashboardMetrics;
}

export function FlowAnalyticsDashboard({ analytics, metrics }: FlowAnalyticsDashboardProps) {
  const formatBytes = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return <ArrowUp className="h-4 w-4 text-green-400" />;
      case 'decreasing':
        return <ArrowDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getTrendColor = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return 'text-green-400';
      case 'decreasing':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Flows */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Total Flows</CardTitle>
          <Activity className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{formatNumber(analytics.totalFlows)}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              Active: {metrics.totalFlows}
            </Badge>
            <span className="text-xs text-slate-400">flows/sec</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Bandwidth */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Total Bandwidth</CardTitle>
          <BarChart3 className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{formatBytes(analytics.totalBytes)}</div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {getTrendIcon(analytics.bandwidthUtilization.trend)}
              <span className={`text-xs ${getTrendColor(analytics.bandwidthUtilization.trend)}`}>
                {analytics.bandwidthUtilization.utilization.toFixed(1)}%
              </span>
            </div>
            <span className="text-xs text-slate-400">utilization</span>
          </div>
        </CardContent>
      </Card>

      {/* Average Flow Duration */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Avg Flow Duration</CardTitle>
          <Clock className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {(analytics.averageFlowDuration / 1000).toFixed(1)}s
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {formatNumber(analytics.totalPackets)} packets
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Network Health */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Network Health</CardTitle>
          <Wifi className="h-4 w-4 text-cyan-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{metrics.networkHealth}%</div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.networkHealth}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Protocol */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Top Protocol</CardTitle>
          <Network className="h-4 w-4 text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {analytics.topProtocols[0]?.protocol || 'N/A'}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {analytics.topProtocols[0]?.percentage.toFixed(1)}%
            </Badge>
            <span className="text-xs text-slate-400">
              {formatBytes(analytics.topProtocols[0]?.bytes || 0)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Top Port */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Top Port</CardTitle>
          <Database className="h-4 w-4 text-pink-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {analytics.topPorts[0]?.port || 'N/A'}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {analytics.topPorts[0]?.service || 'Unknown'}
            </Badge>
            <span className="text-xs text-slate-400">
              {analytics.topPorts[0]?.flows || 0} flows
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Top Talker */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Top Talker</CardTitle>
          <TrendingUp className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-white truncate">
            {analytics.topTalkers[0]?.ip || 'N/A'}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {analytics.topTalkers[0]?.percentage.toFixed(1)}%
            </Badge>
            <span className="text-xs text-slate-400">
              {formatBytes(analytics.topTalkers[0]?.totalBytes || 0)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Geographic Spread</CardTitle>
          <Globe className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {analytics.geographicDistribution.length}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {analytics.geographicDistribution[0]?.country || 'N/A'}
            </Badge>
            <span className="text-xs text-slate-400">countries</span>
          </div>
        </CardContent>
      </Card>

      {/* Bandwidth Utilization Details */}
      <Card className="bg-slate-800/50 border-slate-700 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Bandwidth Utilization Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Current</span>
                <span className="text-sm font-medium text-white">
                  {formatBytes(analytics.bandwidthUtilization.current)}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(analytics.bandwidthUtilization.utilization, 100)}%` }}
                />
              </div>
            </div>

            {/* Average Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Average</span>
                <span className="text-sm font-medium text-white">
                  {formatBytes(analytics.bandwidthUtilization.average)}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((analytics.bandwidthUtilization.average / analytics.bandwidthUtilization.capacity) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>

            {/* Peak Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Peak</span>
                <span className="text-sm font-medium text-white">
                  {formatBytes(analytics.bandwidthUtilization.peak)}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((analytics.bandwidthUtilization.peak / analytics.bandwidthUtilization.capacity) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Trend Information */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300">Trend:</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(analytics.bandwidthUtilization.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(analytics.bandwidthUtilization.trend)}`}>
                    {analytics.bandwidthUtilization.trend.charAt(0).toUpperCase() + 
                     analytics.bandwidthUtilization.trend.slice(1)}
                  </span>
                </div>
              </div>
              <div className="text-sm text-slate-400">
                Capacity: {formatBytes(analytics.bandwidthUtilization.capacity)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
