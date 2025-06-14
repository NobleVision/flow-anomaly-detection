'use client';

import { FlowAnalytics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Globe,
  Server,
  Eye,
  Filter
} from 'lucide-react';
import { useState } from 'react';

interface TopTalkersAnalysisProps {
  analytics: FlowAnalytics;
}

export function TopTalkersAnalysis({ analytics }: TopTalkersAnalysisProps) {
  const [sortBy, setSortBy] = useState<'totalBytes' | 'inboundBytes' | 'outboundBytes' | 'flows'>('totalBytes');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [showCount, setShowCount] = useState<10 | 15 | 20>(10);

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

  // Sort talkers based on selected criteria
  const sortedTalkers = [...analytics.topTalkers]
    .sort((a, b) => b[sortBy] - a[sortBy])
    .slice(0, showCount);

  // Prepare chart data
  const chartData = sortedTalkers.map((talker, index) => ({
    ip: talker.ip.split('.').slice(-2).join('.'), // Show last two octets for readability
    fullIp: talker.ip,
    hostname: talker.hostname,
    inbound: talker.inboundBytes,
    outbound: talker.outboundBytes,
    total: talker.totalBytes,
    flows: talker.flows,
    percentage: talker.percentage,
    location: talker.location,
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`
  }));

  const getSortIcon = (field: string) => {
    if (sortBy === field) {
      return <ArrowDown className="h-3 w-3" />;
    }
    return <ArrowUpDown className="h-3 w-3 opacity-50" />;
  };

  const getTrafficDirection = (inbound: number, outbound: number) => {
    const ratio = inbound / (inbound + outbound);
    if (ratio > 0.7) return { direction: 'Inbound Heavy', icon: ArrowDown, color: 'text-blue-400' };
    if (ratio < 0.3) return { direction: 'Outbound Heavy', icon: ArrowUp, color: 'text-green-400' };
    return { direction: 'Balanced', icon: ArrowUpDown, color: 'text-yellow-400' };
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-yellow-400" />
            Top Talkers Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'chart' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('chart')}
            >
              Chart
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
            >
              <option value="totalBytes">Total Bytes</option>
              <option value="inboundBytes">Inbound Bytes</option>
              <option value="outboundBytes">Outbound Bytes</option>
              <option value="flows">Flow Count</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300">Show:</span>
            <select
              value={showCount}
              onChange={(e) => setShowCount(Number(e.target.value) as any)}
              className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
            >
              <option value={10}>Top 10</option>
              <option value={15}>Top 15</option>
              <option value={20}>Top 20</option>
            </select>
          </div>
        </div>

        {viewMode === 'chart' ? (
          /* Chart View */
          <div className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="ip" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={formatBytes}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                    formatter={(value: any, name: string) => [
                      formatBytes(value),
                      name === 'inbound' ? 'Inbound' : name === 'outbound' ? 'Outbound' : 'Total'
                    ]}
                    labelFormatter={(label) => `IP: ${chartData.find(d => d.ip === label)?.fullIp}`}
                  />
                  <Bar dataKey="inbound" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="outbound" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-slate-300">Inbound Traffic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-slate-300">Outbound Traffic</span>
              </div>
            </div>
          </div>
        ) : (
          /* Table View */
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-3 bg-slate-700/50 rounded-lg text-sm font-medium text-slate-300">
              <div className="col-span-3 flex items-center gap-1 cursor-pointer" onClick={() => setSortBy('totalBytes')}>
                IP Address {getSortIcon('totalBytes')}
              </div>
              <div className="col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => setSortBy('inboundBytes')}>
                Inbound {getSortIcon('inboundBytes')}
              </div>
              <div className="col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => setSortBy('outboundBytes')}>
                Outbound {getSortIcon('outboundBytes')}
              </div>
              <div className="col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => setSortBy('flows')}>
                Flows {getSortIcon('flows')}
              </div>
              <div className="col-span-1">Share</div>
              <div className="col-span-2">Location</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-2">
              {sortedTalkers.map((talker, index) => {
                const traffic = getTrafficDirection(talker.inboundBytes, talker.outboundBytes);
                const TrafficIcon = traffic.icon;
                
                return (
                  <div key={talker.ip} className="grid grid-cols-12 gap-4 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <div className="col-span-3">
                      <div className="font-medium text-white text-sm">{talker.ip}</div>
                      <div className="text-xs text-slate-400">{talker.hostname}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-white">{formatBytes(talker.inboundBytes)}</div>
                      <div className="flex items-center gap-1">
                        <ArrowDown className="h-3 w-3 text-blue-400" />
                        <span className="text-xs text-slate-400">In</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-white">{formatBytes(talker.outboundBytes)}</div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="h-3 w-3 text-green-400" />
                        <span className="text-xs text-slate-400">Out</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-white">{formatNumber(talker.flows)}</div>
                      <div className="flex items-center gap-1">
                        <TrafficIcon className={`h-3 w-3 ${traffic.color}`} />
                        <span className="text-xs text-slate-400">{traffic.direction}</span>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Badge variant="outline" className="text-xs">
                        {talker.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3 text-cyan-400" />
                        <span className="text-xs text-slate-400 truncate">{talker.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Summary Statistics */}
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-sm font-medium text-white mb-3">Traffic Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-white">
                {formatBytes(sortedTalkers.reduce((sum, t) => sum + t.totalBytes, 0))}
              </div>
              <div className="text-xs text-slate-400">Total Traffic</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-blue-400">
                {formatBytes(sortedTalkers.reduce((sum, t) => sum + t.inboundBytes, 0))}
              </div>
              <div className="text-xs text-slate-400">Inbound</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-green-400">
                {formatBytes(sortedTalkers.reduce((sum, t) => sum + t.outboundBytes, 0))}
              </div>
              <div className="text-xs text-slate-400">Outbound</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-white">
                {formatNumber(sortedTalkers.reduce((sum, t) => sum + t.flows, 0))}
              </div>
              <div className="text-xs text-slate-400">Total Flows</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
