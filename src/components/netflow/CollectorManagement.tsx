'use client';

import { useState } from 'react';
import { NetFlowCollector } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Network,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Edit,
  Eye,
  Cpu,
  MemoryStick,
  HardDrive
} from 'lucide-react';

interface CollectorManagementProps {
  collectors: NetFlowCollector[];
}

export function CollectorManagement({ collectors }: CollectorManagementProps) {
  const [selectedCollector, setSelectedCollector] = useState<NetFlowCollector | null>(collectors[0] || null);

  const getStatusIcon = (status: NetFlowCollector['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'inactive':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'maintenance':
        return <Settings className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: NetFlowCollector['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'inactive':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case 'error':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'maintenance':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getProtocolBadgeColor = (protocol: string) => {
    switch (protocol) {
      case 'netflow-v5':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'netflow-v9':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ipfix':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'sflow':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Generate performance data for charts
  const generatePerformanceData = (collector: NetFlowCollector) => {
    const data = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const baseFlows = collector.flowsPerSecond;
      const variation = (Math.random() - 0.5) * 0.2;
      
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        flows: Math.max(0, Math.floor(baseFlows * (1 + variation))),
        cpu: Math.max(5, Math.min(95, collector.statistics.cpuUsage + (Math.random() - 0.5) * 10)),
        memory: Math.max(0.5, Math.min(8, collector.statistics.memoryUsage + (Math.random() - 0.5) * 0.5))
      });
    }
    
    return data;
  };

  return (
    <div className="space-y-8">
      {/* Collectors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {collectors.map((collector) => (
          <Card 
            key={collector.id} 
            className={`bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer ${
              selectedCollector?.id === collector.id ? 'ring-2 ring-blue-500/50' : ''
            }`}
            onClick={() => setSelectedCollector(collector)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Network className="h-5 w-5 text-blue-400" />
                  <div>
                    <CardTitle className="text-lg text-white">{collector.name}</CardTitle>
                    <p className="text-sm text-slate-400">{collector.ipAddress}:{collector.port}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(collector.status)} border`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(collector.status)}
                    {collector.status}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Protocol and Version */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Protocol</span>
                <Badge className={`${getProtocolBadgeColor(collector.protocol)} border text-xs`}>
                  {collector.protocol.toUpperCase()} v{collector.version}
                </Badge>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Flows/sec</span>
                  <div className="font-medium text-white">{collector.flowsPerSecond.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-slate-400">Total Flows</span>
                  <div className="font-medium text-white">{(collector.totalFlows / 1000000).toFixed(1)}M</div>
                </div>
              </div>

              {/* Resource Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">CPU Usage</span>
                  <span className="text-white">{collector.statistics.cpuUsage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      collector.statistics.cpuUsage > 80 ? 'bg-red-500' :
                      collector.statistics.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${collector.statistics.cpuUsage}%` }}
                  />
                </div>
              </div>

              {/* Last Seen */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Last Seen</span>
                <span className="text-white">
                  {Math.floor((Date.now() - collector.lastSeen.getTime()) / 1000)}s ago
                </span>
              </div>

              {/* Uptime */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Uptime</span>
                <span className="text-white">{formatUptime(collector.uptime)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Details
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View */}
      {selectedCollector && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Collector Details */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-400" />
                Collector Details - {selectedCollector.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Basic Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">IP Address</span>
                    <span className="text-white">{selectedCollector.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Port</span>
                    <span className="text-white">{selectedCollector.port}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Protocol</span>
                    <span className="text-white">{selectedCollector.protocol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Version</span>
                    <span className="text-white">{selectedCollector.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location</span>
                    <span className="text-white">{selectedCollector.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vendor</span>
                    <span className="text-white">{selectedCollector.vendor}</span>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Configuration</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sampling Rate</span>
                    <span className="text-white">1:{selectedCollector.configuration.samplingRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Timeout</span>
                    <span className="text-white">{selectedCollector.configuration.activeTimeout}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Inactive Timeout</span>
                    <span className="text-white">{selectedCollector.configuration.inactiveTimeout}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Flows/Packet</span>
                    <span className="text-white">{selectedCollector.configuration.maxFlowsPerPacket}</span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Packets Received</div>
                    <div className="text-lg font-bold text-white">{selectedCollector.statistics.packetsReceived.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Packets Dropped</div>
                    <div className="text-lg font-bold text-white">{selectedCollector.statistics.packetsDropped.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Flows Processed</div>
                    <div className="text-lg font-bold text-white">{selectedCollector.statistics.flowsProcessed.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Error Count</div>
                    <div className="text-lg font-bold text-white">{selectedCollector.statistics.errorsCount}</div>
                  </div>
                </div>
              </div>

              {/* Resource Usage */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Resource Usage</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Cpu className="h-4 w-4 text-orange-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-300">CPU Usage</span>
                        <span className="text-sm text-white">{selectedCollector.statistics.cpuUsage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${selectedCollector.statistics.cpuUsage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MemoryStick className="h-4 w-4 text-purple-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-300">Memory Usage</span>
                        <span className="text-sm text-white">{selectedCollector.statistics.memoryUsage.toFixed(1)} GB</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(selectedCollector.statistics.memoryUsage / 8) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <HardDrive className="h-4 w-4 text-cyan-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-300">Disk Usage</span>
                        <span className="text-sm text-white">{selectedCollector.statistics.diskUsage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${selectedCollector.statistics.diskUsage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
                <Button className="flex-1">
                  <Play className="h-3 w-3 mr-2" />
                  Start
                </Button>
                <Button variant="outline" className="flex-1">
                  <Pause className="h-3 w-3 mr-2" />
                  Stop
                </Button>
                <Button variant="outline" className="flex-1">
                  <RotateCcw className="h-3 w-3 mr-2" />
                  Restart
                </Button>
                <Button variant="destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Charts */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                Performance Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Flow Rate Chart */}
                <div>
                  <h4 className="font-medium text-white mb-3">Flow Rate (24h)</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generatePerformanceData(selectedCollector)}>
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
                          dataKey="flows" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          name="Flows/sec"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Resource Usage Chart */}
                <div>
                  <h4 className="font-medium text-white mb-3">Resource Usage (24h)</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generatePerformanceData(selectedCollector)}>
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
                          dataKey="cpu" 
                          stroke="#F59E0B" 
                          strokeWidth={2}
                          name="CPU %"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="memory" 
                          stroke="#8B5CF6" 
                          strokeWidth={2}
                          name="Memory GB"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
