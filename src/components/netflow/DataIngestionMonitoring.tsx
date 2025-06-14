'use client';

import { NetFlowCollector, DataIngestionPipeline } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import {
  Activity,
  Database,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Network,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

interface DataIngestionMonitoringProps {
  collectors: NetFlowCollector[];
  pipelines: DataIngestionPipeline[];
}

export function DataIngestionMonitoring({ collectors, pipelines }: DataIngestionMonitoringProps) {
  // Generate real-time monitoring data
  const generateRealTimeData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 59; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 1000);
      const totalFlows = collectors.reduce((sum, c) => sum + c.flowsPerSecond, 0);
      const totalThroughput = pipelines.reduce((sum, p) => sum + p.throughput, 0);
      const variation = (Math.random() - 0.5) * 0.2;
      
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        flows: Math.max(0, Math.floor(totalFlows * (1 + variation))),
        throughput: Math.max(0, Math.floor(totalThroughput * (1 + variation))),
        errors: Math.floor(Math.random() * 10),
        latency: Math.max(1, Math.floor(5 + Math.random() * 10))
      });
    }
    
    return data;
  };

  // Generate collector distribution data
  const generateCollectorDistribution = () => {
    const statusCounts = collectors.reduce((acc, collector) => {
      acc[collector.status] = (acc[collector.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = {
      active: '#10B981',
      inactive: '#6B7280',
      error: '#EF4444',
      maintenance: '#F59E0B'
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      color: colors[status as keyof typeof colors] || '#6B7280'
    }));
  };

  // Generate protocol distribution data
  const generateProtocolDistribution = () => {
    const protocolCounts = collectors.reduce((acc, collector) => {
      acc[collector.protocol] = (acc[collector.protocol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = {
      'netflow-v5': '#3B82F6',
      'netflow-v9': '#10B981',
      'ipfix': '#8B5CF6',
      'sflow': '#F59E0B'
    };

    return Object.entries(protocolCounts).map(([protocol, count]) => ({
      name: protocol,
      value: count,
      color: colors[protocol as keyof typeof colors] || '#6B7280'
    }));
  };

  // Generate pipeline performance data
  const generatePipelinePerformance = () => {
    return pipelines.map(pipeline => ({
      name: pipeline.name.split(' ')[0], // Shortened name
      throughput: pipeline.throughput,
      processed: pipeline.recordsProcessed / 1000000, // Convert to millions
      errors: pipeline.errorCount,
      efficiency: (pipeline.recordsStored / pipeline.recordsProcessed) * 100
    }));
  };

  const realTimeData = generateRealTimeData();
  const collectorDistribution = generateCollectorDistribution();
  const protocolDistribution = generateProtocolDistribution();
  const pipelinePerformance = generatePipelinePerformance();

  // Calculate summary metrics
  const totalFlowsPerSecond = collectors.reduce((sum, c) => sum + c.flowsPerSecond, 0);
  const totalThroughput = pipelines.reduce((sum, p) => sum + p.throughput, 0);
  const totalErrors = pipelines.reduce((sum, p) => sum + p.errorCount, 0);
  const averageLatency = realTimeData.length > 0 ? 
    realTimeData.reduce((sum, d) => sum + d.latency, 0) / realTimeData.length : 0;

  return (
    <div className="space-y-8">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Flow Rate</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalFlowsPerSecond.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs text-green-400">
                flows/sec
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Pipeline Throughput</CardTitle>
            <Database className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalThroughput.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs text-blue-400">
                records/sec
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalErrors}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={`text-xs ${totalErrors > 100 ? 'text-red-400' : 'text-green-400'}`}>
                {totalErrors > 100 ? 'High' : 'Low'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Avg Latency</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{averageLatency.toFixed(1)}ms</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={`text-xs ${averageLatency > 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                {averageLatency > 10 ? 'Moderate' : 'Good'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Flow Rate and Throughput */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Real-time Flow Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={realTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="flows" 
                    stroke="#10B981" 
                    fill="#10B981"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="Flows/sec"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="throughput" 
                    stroke="#3B82F6" 
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="Records/sec"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Error Rate and Latency */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-yellow-400" />
              Error Rate & Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={realTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="errors" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Errors"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Latency (ms)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Collector Status Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-blue-400" />
              Collector Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={collectorDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {collectorDistribution.map((entry, index) => (
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {collectorDistribution.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-slate-300 capitalize">{entry.name}</span>
                  </div>
                  <span className="text-sm text-white">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Protocol Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Network className="h-5 w-5 text-purple-400" />
              Protocol Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={protocolDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {protocolDistribution.map((entry, index) => (
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {protocolDistribution.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-slate-300">{entry.name}</span>
                  </div>
                  <span className="text-sm text-white">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Efficiency */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Pipeline Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelinePerformance.map((pipeline, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{pipeline.name}</span>
                    <span className="text-sm text-slate-400">{pipeline.efficiency.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        pipeline.efficiency > 90 ? 'bg-green-500' :
                        pipeline.efficiency > 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${pipeline.efficiency}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{pipeline.throughput.toLocaleString()}/sec</span>
                    <span>{pipeline.errors} errors</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Alerts */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            System Health & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* High Error Rate Alert */}
            {totalErrors > 100 && (
              <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="font-medium text-red-400">High Error Rate</span>
                </div>
                <p className="text-sm text-slate-300">
                  Error count is above threshold. Check pipeline configurations and data sources.
                </p>
              </div>
            )}

            {/* Collector Offline Alert */}
            {collectors.some(c => c.status === 'error' || c.status === 'inactive') && (
              <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium text-yellow-400">Collector Issues</span>
                </div>
                <p className="text-sm text-slate-300">
                  {collectors.filter(c => c.status === 'error' || c.status === 'inactive').length} collector(s) 
                  are offline or experiencing errors.
                </p>
              </div>
            )}

            {/* High Latency Alert */}
            {averageLatency > 10 && (
              <div className="p-4 bg-orange-900/20 border border-orange-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span className="font-medium text-orange-400">High Latency</span>
                </div>
                <p className="text-sm text-slate-300">
                  Processing latency is above normal. Consider scaling resources or optimizing pipelines.
                </p>
              </div>
            )}

            {/* All Systems Normal */}
            {totalErrors <= 100 && !collectors.some(c => c.status === 'error' || c.status === 'inactive') && averageLatency <= 10 && (
              <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="font-medium text-green-400">All Systems Normal</span>
                </div>
                <p className="text-sm text-slate-300">
                  All collectors and pipelines are operating within normal parameters.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
