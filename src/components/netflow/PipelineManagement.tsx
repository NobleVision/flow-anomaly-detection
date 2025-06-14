'use client';

import { useState } from 'react';
import { DataIngestionPipeline } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  Database,
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
  Filter,
  ArrowRight,
  Zap,
  TrendingUp
} from 'lucide-react';

interface PipelineManagementProps {
  pipelines: DataIngestionPipeline[];
}

export function PipelineManagement({ pipelines }: PipelineManagementProps) {
  const [selectedPipeline, setSelectedPipeline] = useState<DataIngestionPipeline | null>(pipelines[0] || null);

  const getStatusIcon = (status: DataIngestionPipeline['status']) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'stopped':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'maintenance':
        return <Settings className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: DataIngestionPipeline['status']) => {
    switch (status) {
      case 'running':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'stopped':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case 'error':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'maintenance':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'netflow':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'sflow':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'ipfix':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'pcap':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'api':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Generate throughput data for charts
  const generateThroughputData = (pipeline: DataIngestionPipeline) => {
    const data = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const baseThroughput = pipeline.throughput;
      const variation = (Math.random() - 0.5) * 0.3;
      
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        throughput: Math.max(0, Math.floor(baseThroughput * (1 + variation))),
        processed: Math.floor(baseThroughput * (1 + variation) * 0.95),
        errors: Math.floor(baseThroughput * (1 + variation) * 0.01)
      });
    }
    
    return data;
  };

  // Generate pipeline stage data
  const generateStageData = (pipeline: DataIngestionPipeline) => {
    return [
      { stage: 'Input', records: pipeline.recordsProcessed, percentage: 100 },
      { stage: 'Filter', records: pipeline.recordsProcessed - pipeline.recordsFiltered, percentage: 85 },
      { stage: 'Transform', records: pipeline.recordsProcessed - pipeline.recordsFiltered, percentage: 85 },
      { stage: 'Output', records: pipeline.recordsStored, percentage: 80 }
    ];
  };

  return (
    <div className="space-y-8">
      {/* Pipelines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pipelines.map((pipeline) => (
          <Card 
            key={pipeline.id} 
            className={`bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer ${
              selectedPipeline?.id === pipeline.id ? 'ring-2 ring-blue-500/50' : ''
            }`}
            onClick={() => setSelectedPipeline(pipeline)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-purple-400" />
                  <div>
                    <CardTitle className="text-lg text-white">{pipeline.name}</CardTitle>
                    <p className="text-sm text-slate-400">{pipeline.source} → {pipeline.destination}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(pipeline.status)} border`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(pipeline.status)}
                    {pipeline.status}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type and Throughput */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Type</span>
                <Badge className={`${getTypeColor(pipeline.type)} border text-xs`}>
                  {pipeline.type.toUpperCase()}
                </Badge>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Throughput</span>
                  <div className="font-medium text-white">{formatNumber(pipeline.throughput)}/sec</div>
                </div>
                <div>
                  <span className="text-slate-400">Processed</span>
                  <div className="font-medium text-white">{formatNumber(pipeline.recordsProcessed)}</div>
                </div>
              </div>

              {/* Processing Pipeline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Processing Efficiency</span>
                  <span className="text-white">{((pipeline.recordsStored / pipeline.recordsProcessed) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(pipeline.recordsStored / pipeline.recordsProcessed) * 100}%` }}
                  />
                </div>
              </div>

              {/* Error Rate */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Error Rate</span>
                <span className={`font-medium ${pipeline.errorCount > 100 ? 'text-red-400' : 'text-green-400'}`}>
                  {((pipeline.errorCount / pipeline.recordsProcessed) * 100).toFixed(3)}%
                </span>
              </div>

              {/* Last Processed */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Last Processed</span>
                <span className="text-white">
                  {Math.floor((Date.now() - pipeline.lastProcessed.getTime()) / 1000)}s ago
                </span>
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
      {selectedPipeline && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Pipeline Details */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                Pipeline Details - {selectedPipeline.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Basic Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type</span>
                    <span className="text-white">{selectedPipeline.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <Badge className={`${getStatusColor(selectedPipeline.status)} border text-xs`}>
                      {selectedPipeline.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Source</span>
                    <span className="text-white">{selectedPipeline.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Destination</span>
                    <span className="text-white">{selectedPipeline.destination}</span>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Configuration</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Batch Size</span>
                    <span className="text-white">{selectedPipeline.configuration.batchSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Processing Interval</span>
                    <span className="text-white">{selectedPipeline.configuration.processingInterval}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Parallel Workers</span>
                    <span className="text-white">{selectedPipeline.configuration.parallelWorkers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Buffer Size</span>
                    <span className="text-white">{formatNumber(selectedPipeline.configuration.bufferSize)}</span>
                  </div>
                </div>
              </div>

              {/* Processing Statistics */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Processing Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Records Processed</div>
                    <div className="text-lg font-bold text-white">{formatNumber(selectedPipeline.recordsProcessed)}</div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Records Stored</div>
                    <div className="text-lg font-bold text-white">{formatNumber(selectedPipeline.recordsStored)}</div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Records Filtered</div>
                    <div className="text-lg font-bold text-white">{formatNumber(selectedPipeline.recordsFiltered)}</div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Error Count</div>
                    <div className="text-lg font-bold text-white">{selectedPipeline.errorCount}</div>
                  </div>
                </div>
              </div>

              {/* Filters and Transformations */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Filters & Transformations</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Active Filters</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedPipeline.filters.filter(f => f.enabled).length} / {selectedPipeline.filters.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Active Transformations</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedPipeline.transformations.filter(t => t.enabled).length} / {selectedPipeline.transformations.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Output Destinations</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedPipeline.outputs.filter(o => o.enabled).length} / {selectedPipeline.outputs.length}
                    </Badge>
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
                <TrendingUp className="h-5 w-5 text-green-400" />
                Performance Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Throughput Chart */}
                <div>
                  <h4 className="font-medium text-white mb-3">Throughput (24h)</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generateThroughputData(selectedPipeline)}>
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
                          dataKey="throughput" 
                          stroke="#8B5CF6" 
                          strokeWidth={2}
                          name="Throughput"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="processed" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          name="Processed"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="errors" 
                          stroke="#EF4444" 
                          strokeWidth={2}
                          name="Errors"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pipeline Stages */}
                <div>
                  <h4 className="font-medium text-white mb-3">Pipeline Stages</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={generateStageData(selectedPipeline)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="stage" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#f1f5f9'
                          }}
                        />
                        <Bar 
                          dataKey="percentage" 
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pipeline Flow Visualization */}
      {selectedPipeline && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-blue-400" />
              Pipeline Flow - {selectedPipeline.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4">
              {/* Input */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm font-medium text-white">Input</span>
                <span className="text-xs text-slate-400">{selectedPipeline.source}</span>
                <Badge variant="outline" className="text-xs mt-1">
                  {formatNumber(selectedPipeline.recordsProcessed)}
                </Badge>
              </div>

              <ArrowRight className="h-6 w-6 text-slate-500" />

              {/* Filters */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mb-2">
                  <Filter className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm font-medium text-white">Filters</span>
                <span className="text-xs text-slate-400">{selectedPipeline.filters.length} rules</span>
                <Badge variant="outline" className="text-xs mt-1">
                  {formatNumber(selectedPipeline.recordsProcessed - selectedPipeline.recordsFiltered)}
                </Badge>
              </div>

              <ArrowRight className="h-6 w-6 text-slate-500" />

              {/* Transformations */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm font-medium text-white">Transform</span>
                <span className="text-xs text-slate-400">{selectedPipeline.transformations.length} steps</span>
                <Badge variant="outline" className="text-xs mt-1">
                  {formatNumber(selectedPipeline.recordsProcessed - selectedPipeline.recordsFiltered)}
                </Badge>
              </div>

              <ArrowRight className="h-6 w-6 text-slate-500" />

              {/* Output */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm font-medium text-white">Output</span>
                <span className="text-xs text-slate-400">{selectedPipeline.destination}</span>
                <Badge variant="outline" className="text-xs mt-1">
                  {formatNumber(selectedPipeline.recordsStored)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
