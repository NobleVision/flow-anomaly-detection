'use client';

import { FlowAnalytics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  Network,
  Shield,
  Database,
  Globe,
  Activity
} from 'lucide-react';

interface TrafficPatternAnalysisProps {
  analytics: FlowAnalytics;
}

export function TrafficPatternAnalysis({ analytics }: TrafficPatternAnalysisProps) {
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

  // Protocol distribution colors
  const protocolColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Port analysis data for chart
  const portChartData = analytics.topPorts.slice(0, 8).map(port => ({
    port: port.port.toString(),
    service: port.service,
    flows: port.flows,
    bytes: port.bytes,
    percentage: port.percentage
  }));

  // Protocol distribution for pie chart
  const protocolPieData = analytics.topProtocols.map((protocol, index) => ({
    name: protocol.protocol,
    value: protocol.percentage,
    flows: protocol.flows,
    bytes: protocol.bytes,
    color: protocolColors[index % protocolColors.length]
  }));

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Network className="h-5 w-5 text-blue-400" />
          Traffic Pattern Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Protocol Distribution */}
        <div>
          <h3 className="text-md font-medium text-white mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-400" />
            Protocol Distribution
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={protocolPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {protocolPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)}%`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Protocol Stats */}
            <div className="space-y-3">
              {analytics.topProtocols.slice(0, 5).map((protocol, index) => (
                <div key={protocol.protocol} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: protocolColors[index % protocolColors.length] }}
                    />
                    <div>
                      <div className="font-medium text-white">{protocol.protocol}</div>
                      <div className="text-xs text-slate-400">{formatNumber(protocol.flows)} flows</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">{protocol.percentage.toFixed(1)}%</div>
                    <div className="text-xs text-slate-400">{formatBytes(protocol.bytes)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Ports Analysis */}
        <div>
          <h3 className="text-md font-medium text-white mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 text-purple-400" />
            Top Ports & Services
          </h3>
          
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="port" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={formatNumber}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'flows' ? formatNumber(value) : formatBytes(value),
                    name === 'flows' ? 'Flows' : 'Bytes'
                  ]}
                  labelFormatter={(label) => `Port ${label}`}
                />
                <Bar dataKey="flows" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Port Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analytics.topPorts.slice(0, 6).map((port) => (
              <div key={port.port} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {port.port}
                  </Badge>
                  <div>
                    <div className="font-medium text-white text-sm">{port.service}</div>
                    <div className="text-xs text-slate-400">{formatNumber(port.flows)} flows</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{port.percentage.toFixed(1)}%</div>
                  <div className="text-xs text-slate-400">{formatBytes(port.bytes)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div>
          <h3 className="text-md font-medium text-white mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-400" />
            Geographic Distribution
          </h3>
          
          <div className="space-y-3">
            {analytics.geographicDistribution.slice(0, 5).map((geo) => (
              <div key={geo.country} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 bg-slate-600 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {geo.country.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{geo.country}</div>
                    <div className="text-xs text-slate-400">{geo.region}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{geo.percentage.toFixed(1)}%</div>
                  <div className="text-xs text-slate-400">
                    {formatNumber(geo.flows)} flows • {formatBytes(geo.bytes)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Summary */}
        <div className="pt-4 border-t border-slate-700">
          <h3 className="text-md font-medium text-white mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-400" />
            Traffic Summary
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-white">{formatNumber(analytics.totalFlows)}</div>
              <div className="text-xs text-slate-400">Total Flows</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-white">{formatBytes(analytics.totalBytes)}</div>
              <div className="text-xs text-slate-400">Total Bytes</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-white">{formatNumber(analytics.totalPackets)}</div>
              <div className="text-xs text-slate-400">Total Packets</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-white">
                {(analytics.averageFlowDuration / 1000).toFixed(1)}s
              </div>
              <div className="text-xs text-slate-400">Avg Duration</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
