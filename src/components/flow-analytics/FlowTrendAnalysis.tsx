'use client';

import { FlowAnalytics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import {
  TrendingUp,
  Clock,
  BarChart3,
  Activity,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { useState } from 'react';

interface FlowTrendAnalysisProps {
  analytics: FlowAnalytics;
}

export function FlowTrendAnalysis({ analytics }: FlowTrendAnalysisProps) {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [metricType, setMetricType] = useState<'bytes' | 'flows' | 'packets'>('bytes');

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

  // Generate trend data based on time range
  const generateTrendData = () => {
    const now = new Date();
    const trendData = [];
    let intervals: number;
    let intervalMs: number;
    let formatOptions: Intl.DateTimeFormatOptions;

    switch (timeRange) {
      case '1h':
        intervals = 12; // 5-minute intervals
        intervalMs = 5 * 60 * 1000;
        formatOptions = { hour: '2-digit', minute: '2-digit' };
        break;
      case '6h':
        intervals = 24; // 15-minute intervals
        intervalMs = 15 * 60 * 1000;
        formatOptions = { hour: '2-digit', minute: '2-digit' };
        break;
      case '24h':
        intervals = 24; // 1-hour intervals
        intervalMs = 60 * 60 * 1000;
        formatOptions = { hour: '2-digit', minute: '2-digit' };
        break;
      case '7d':
        intervals = 7; // 1-day intervals
        intervalMs = 24 * 60 * 60 * 1000;
        formatOptions = { month: 'short', day: 'numeric' };
        break;
      default:
        intervals = 24;
        intervalMs = 60 * 60 * 1000;
        formatOptions = { hour: '2-digit', minute: '2-digit' };
    }

    for (let i = intervals - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * intervalMs);
      
      // Generate realistic trend data with some patterns
      const baseValue = analytics.totalBytes / intervals;
      const timeOfDay = timestamp.getHours();
      
      // Business hours pattern (higher traffic during 9-17)
      let multiplier = 1;
      if (timeOfDay >= 9 && timeOfDay <= 17) {
        multiplier = 1.5 + Math.sin((timeOfDay - 9) / 8 * Math.PI) * 0.5;
      } else {
        multiplier = 0.3 + Math.random() * 0.4;
      }
      
      const variation = (Math.random() - 0.5) * 0.3;
      const bytes = Math.max(0, baseValue * multiplier * (1 + variation));
      const flows = Math.floor(bytes / 50000); // Approximate flows based on bytes
      const packets = Math.floor(bytes / 1000); // Approximate packets based on bytes

      trendData.push({
        time: timestamp.toLocaleTimeString('en-US', formatOptions),
        timestamp: timestamp,
        bytes: bytes,
        flows: flows,
        packets: packets,
        bytesFormatted: formatBytes(bytes),
        flowsFormatted: formatNumber(flows),
        packetsFormatted: formatNumber(packets)
      });
    }

    return trendData;
  };

  const trendData = generateTrendData();

  // Calculate trend statistics
  const calculateTrendStats = () => {
    if (trendData.length < 2) return { change: 0, trend: 'stable' as const };

    const recent = trendData.slice(-3).reduce((sum, d) => sum + d[metricType], 0) / 3;
    const previous = trendData.slice(0, 3).reduce((sum, d) => sum + d[metricType], 0) / 3;
    
    const change = ((recent - previous) / previous) * 100;
    
    let trend: 'increasing' | 'decreasing' | 'stable';
    if (Math.abs(change) < 5) trend = 'stable';
    else if (change > 0) trend = 'increasing';
    else trend = 'decreasing';

    return { change: Math.abs(change), trend };
  };

  const trendStats = calculateTrendStats();

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

  const getMetricFormatter = () => {
    switch (metricType) {
      case 'bytes':
        return formatBytes;
      case 'flows':
      case 'packets':
        return formatNumber;
      default:
        return formatNumber;
    }
  };

  const getMetricColor = () => {
    switch (metricType) {
      case 'bytes':
        return '#3B82F6';
      case 'flows':
        return '#10B981';
      case 'packets':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  // Calculate peak and average values
  const peakValue = Math.max(...trendData.map(d => d[metricType]));
  const averageValue = trendData.reduce((sum, d) => sum + d[metricType], 0) / trendData.length;
  const currentValue = trendData[trendData.length - 1]?.[metricType] || 0;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Flow Trend Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '1h' | '6h' | '24h' | '7d')}
              className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metric Type Selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300">Metric:</span>
          <div className="flex items-center gap-2">
            <Button
              variant={metricType === 'bytes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMetricType('bytes')}
            >
              Bytes
            </Button>
            <Button
              variant={metricType === 'flows' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMetricType('flows')}
            >
              Flows
            </Button>
            <Button
              variant={metricType === 'packets' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMetricType('packets')}
            >
              Packets
            </Button>
          </div>
        </div>

        {/* Trend Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Current</span>
              <Activity className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {getMetricFormatter()(currentValue)}
            </div>
            <div className="text-xs text-slate-400">Latest value</div>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Average</span>
              <BarChart3 className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {getMetricFormatter()(averageValue)}
            </div>
            <div className="text-xs text-slate-400">Period average</div>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Peak</span>
              <Zap className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {getMetricFormatter()(peakValue)}
            </div>
            <div className="text-xs text-slate-400">Maximum value</div>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Trend</span>
              {getTrendIcon(trendStats.trend)}
            </div>
            <div className={`text-xl font-bold ${getTrendColor(trendStats.trend)}`}>
              {trendStats.change.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400">
              {trendStats.trend.charAt(0).toUpperCase() + trendStats.trend.slice(1)}
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div>
          <h3 className="text-md font-medium text-white mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-400" />
            {metricType.charAt(0).toUpperCase() + metricType.slice(1)} Trend Over Time
          </h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={getMetricFormatter()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                  formatter={(value: number) => [
                    getMetricFormatter()(value),
                    metricType.charAt(0).toUpperCase() + metricType.slice(1)
                  ]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey={metricType} 
                  stroke={getMetricColor()} 
                  strokeWidth={2}
                  dot={{ fill: getMetricColor(), strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: getMetricColor(), strokeWidth: 2 }}
                />
                <Bar 
                  dataKey={metricType} 
                  fill={getMetricColor()} 
                  opacity={0.1}
                  radius={[2, 2, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Analysis */}
        <div>
          <h3 className="text-md font-medium text-white mb-4">Trend Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statistical Analysis */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-300">Statistical Summary</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-300">Minimum</span>
                  <span className="text-sm font-medium text-white">
                    {getMetricFormatter()(Math.min(...trendData.map(d => d[metricType])))}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-300">Maximum</span>
                  <span className="text-sm font-medium text-white">
                    {getMetricFormatter()(peakValue)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-300">Standard Deviation</span>
                  <span className="text-sm font-medium text-white">
                    {(() => {
                      const values = trendData.map(d => d[metricType]);
                      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
                      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
                      return getMetricFormatter()(Math.sqrt(variance));
                    })()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-300">Coefficient of Variation</span>
                  <Badge variant="outline" className="text-xs">
                    {(() => {
                      const values = trendData.map(d => d[metricType]);
                      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
                      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
                      const cv = (Math.sqrt(variance) / mean) * 100;
                      return `${cv.toFixed(1)}%`;
                    })()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Pattern Recognition */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-300">Pattern Recognition</h4>
              
              <div className="space-y-3">
                {/* Peak Hours */}
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">Peak Period</span>
                    <Zap className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div className="text-sm font-medium text-white">
                    {(() => {
                      const maxIndex = trendData.findIndex(d => d[metricType] === peakValue);
                      return trendData[maxIndex]?.time || 'N/A';
                    })()}
                  </div>
                </div>

                {/* Volatility */}
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">Volatility</span>
                    <Activity className="h-4 w-4 text-purple-400" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      (peakValue / averageValue) > 3 ? 'text-red-400' :
                      (peakValue / averageValue) > 2 ? 'text-yellow-400' :
                      'text-green-400'
                    }`}
                  >
                    {(peakValue / averageValue) > 3 ? 'High' :
                     (peakValue / averageValue) > 2 ? 'Medium' : 'Low'}
                  </Badge>
                </div>

                {/* Growth Rate */}
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">Growth Rate</span>
                    {getTrendIcon(trendStats.trend)}
                  </div>
                  <div className={`text-sm font-medium ${getTrendColor(trendStats.trend)}`}>
                    {trendStats.trend === 'increasing' ? '+' : trendStats.trend === 'decreasing' ? '-' : '±'}
                    {trendStats.change.toFixed(1)}%
                  </div>
                </div>

                {/* Predictive Insight */}
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">Next Period Forecast</span>
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="text-sm font-medium text-white">
                    {(() => {
                      const forecast = currentValue * (1 + (trendStats.trend === 'increasing' ? 0.05 : 
                                                           trendStats.trend === 'decreasing' ? -0.05 : 0));
                      return getMetricFormatter()(forecast);
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
