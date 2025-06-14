'use client';

import { FlowAnalytics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Gauge,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface BandwidthMetricsProps {
  analytics: FlowAnalytics;
}

export function BandwidthMetrics({ analytics }: BandwidthMetricsProps) {
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

  const formatBytesShort = (bytes: number): string => {
    const units = ['B', 'K', 'M', 'G', 'T'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(0)}${units[unitIndex]}`;
  };

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
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

  const getUtilizationStatus = (utilization: number) => {
    if (utilization >= 90) return { status: 'Critical', color: 'text-red-400', icon: AlertTriangle };
    if (utilization >= 75) return { status: 'Warning', color: 'text-yellow-400', icon: AlertTriangle };
    if (utilization >= 50) return { status: 'Moderate', color: 'text-blue-400', icon: Activity };
    return { status: 'Normal', color: 'text-green-400', icon: CheckCircle };
  };

  // Generate bandwidth trend data for the last 24 hours
  const generateBandwidthTrend = () => {
    const now = new Date();
    const trendData = [];
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      const baseValue = analytics.bandwidthUtilization.average;
      const variation = (Math.random() - 0.5) * baseValue * 0.4;
      const value = Math.max(0, baseValue + variation);
      
      trendData.push({
        time: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: timestamp,
        bandwidth: value,
        utilization: Math.min((value / analytics.bandwidthUtilization.capacity) * 100, 100),
        threshold: analytics.bandwidthUtilization.capacity * 0.8 // 80% threshold
      });
    }
    
    return trendData;
  };

  const bandwidthTrend = generateBandwidthTrend();
  const utilizationStatus = getUtilizationStatus(analytics.bandwidthUtilization.utilization);
  const StatusIcon = utilizationStatus.icon;

  // Calculate bandwidth efficiency metrics
  const efficiency = {
    peakToAverage: (analytics.bandwidthUtilization.peak / analytics.bandwidthUtilization.average).toFixed(1),
    currentToAverage: (analytics.bandwidthUtilization.current / analytics.bandwidthUtilization.average).toFixed(1),
    utilizationEfficiency: (analytics.bandwidthUtilization.utilization / 100).toFixed(2)
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          Bandwidth Metrics & Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Utilization */}
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Current Utilization</span>
              <StatusIcon className={`h-4 w-4 ${utilizationStatus.color}`} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {analytics.bandwidthUtilization.utilization.toFixed(1)}%
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${utilizationStatus.color}`}>
                {utilizationStatus.status}
              </Badge>
              <span className="text-xs text-slate-400">
                {formatBytes(analytics.bandwidthUtilization.current)}
              </span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2 mt-3">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  analytics.bandwidthUtilization.utilization >= 90 ? 'bg-red-500' :
                  analytics.bandwidthUtilization.utilization >= 75 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(analytics.bandwidthUtilization.utilization, 100)}%` }}
              />
            </div>
          </div>

          {/* Bandwidth Trend */}
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Trend</span>
              {getTrendIcon(analytics.bandwidthUtilization.trend)}
            </div>
            <div className={`text-2xl font-bold mb-1 ${getTrendColor(analytics.bandwidthUtilization.trend)}`}>
              {analytics.bandwidthUtilization.trend.charAt(0).toUpperCase() + 
               analytics.bandwidthUtilization.trend.slice(1)}
            </div>
            <div className="text-xs text-slate-400">
              Based on last 24h pattern
            </div>
          </div>

          {/* Capacity Status */}
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Capacity</span>
              <Gauge className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatBytes(analytics.bandwidthUtilization.capacity)}
            </div>
            <div className="text-xs text-slate-400">
              Available: {formatBytes(analytics.bandwidthUtilization.capacity - analytics.bandwidthUtilization.current)}
            </div>
          </div>
        </div>

        {/* Bandwidth Trend Chart */}
        <div>
          <h3 className="text-md font-medium text-white mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" />
            24-Hour Bandwidth Trend
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bandwidthTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="bandwidthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={formatBytesShort}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'bandwidth' ? formatBytes(value) : `${value.toFixed(1)}%`,
                    name === 'bandwidth' ? 'Bandwidth' : 'Utilization'
                  ]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="bandwidth" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#bandwidthGradient)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="threshold" 
                  stroke="#F59E0B" 
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-slate-300">Bandwidth Usage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-yellow-500 border-dashed rounded"></div>
              <span className="text-sm text-slate-300">80% Threshold</span>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div>
          <h3 className="text-md font-medium text-white mb-4">Detailed Bandwidth Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Usage Statistics */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-300">Usage Statistics</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-300">Current</span>
                  <span className="text-sm font-medium text-white">
                    {formatBytes(analytics.bandwidthUtilization.current)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-300">Average (24h)</span>
                  <span className="text-sm font-medium text-white">
                    {formatBytes(analytics.bandwidthUtilization.average)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-300">Peak (24h)</span>
                  <span className="text-sm font-medium text-white">
                    {formatBytes(analytics.bandwidthUtilization.peak)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-300">Total Capacity</span>
                  <span className="text-sm font-medium text-white">
                    {formatBytes(analytics.bandwidthUtilization.capacity)}
                  </span>
                </div>
              </div>
            </div>

            {/* Efficiency Metrics */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-300">Efficiency Metrics</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-300">Peak/Average Ratio</span>
                  <Badge variant="outline" className="text-xs">
                    {efficiency.peakToAverage}x
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-300">Current/Average Ratio</span>
                  <Badge variant="outline" className="text-xs">
                    {efficiency.currentToAverage}x
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-300">Utilization Efficiency</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      parseFloat(efficiency.utilizationEfficiency) > 0.8 ? 'text-red-400' :
                      parseFloat(efficiency.utilizationEfficiency) > 0.6 ? 'text-yellow-400' :
                      'text-green-400'
                    }`}
                  >
                    {(parseFloat(efficiency.utilizationEfficiency) * 100).toFixed(0)}%
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-300">Available Bandwidth</span>
                  <span className="text-sm font-medium text-green-400">
                    {formatBytes(analytics.bandwidthUtilization.capacity - analytics.bandwidthUtilization.current)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Recommendations */}
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-sm font-medium text-white mb-3">Performance Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.bandwidthUtilization.utilization > 80 && (
              <div className="p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">High Utilization Alert</span>
                </div>
                <p className="text-xs text-slate-300">
                  Bandwidth utilization is above 80%. Consider capacity planning or traffic optimization.
                </p>
              </div>
            )}
            
            {analytics.bandwidthUtilization.trend === 'increasing' && (
              <div className="p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">Increasing Trend</span>
                </div>
                <p className="text-xs text-slate-300">
                  Bandwidth usage is trending upward. Monitor for potential capacity issues.
                </p>
              </div>
            )}
            
            {parseFloat(efficiency.peakToAverage) > 3 && (
              <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">Traffic Variability</span>
                </div>
                <p className="text-xs text-slate-300">
                  High peak-to-average ratio detected. Consider traffic shaping or load balancing.
                </p>
              </div>
            )}
            
            {analytics.bandwidthUtilization.utilization < 30 && (
              <div className="p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Optimal Performance</span>
                </div>
                <p className="text-xs text-slate-300">
                  Bandwidth utilization is within optimal range. Network performance is healthy.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
