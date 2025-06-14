'use client';

import { useState } from 'react';
import { NetFlowCollector, DataIngestionPipeline } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CollectorManagement } from '@/components/netflow/CollectorManagement';
import { PipelineManagement } from '@/components/netflow/PipelineManagement';
import { ProtocolSupport } from '@/components/netflow/ProtocolSupport';
import { DataIngestionMonitoring } from '@/components/netflow/DataIngestionMonitoring';
import {
  Network,
  Database,
  Activity,
  Settings,
  Plus,
  Download,
  Upload,
  Zap
} from 'lucide-react';

// Generate mock NetFlow collectors
const generateMockCollectors = (): NetFlowCollector[] => {
  return [
    {
      id: 'collector-1',
      name: 'Core Router - Building A',
      ipAddress: '192.168.1.10',
      port: 2055,
      protocol: 'netflow-v9',
      status: 'active',
      version: '9.0',
      lastSeen: new Date(Date.now() - 30000),
      flowsPerSecond: 1250,
      totalFlows: 45678901,
      bytesReceived: 2345678901234,
      packetsReceived: 987654321,
      uptime: 2592000,
      location: 'Data Center 1',
      vendor: 'Cisco',
      configuration: {
        samplingRate: 1000,
        activeTimeout: 30,
        inactiveTimeout: 15,
        templateRefreshRate: 1800,
        maxFlowsPerPacket: 30,
        enableIPv6: true,
        enableMPLS: false,
        enableVLAN: true,
        exportFormat: 'json',
        compressionEnabled: true,
        encryptionEnabled: false
      },
      statistics: {
        packetsReceived: 987654321,
        packetsDropped: 1234,
        flowsProcessed: 45678901,
        flowsFiltered: 567890,
        templatesReceived: 45,
        errorsCount: 23,
        averageProcessingTime: 2.3,
        memoryUsage: 1.2,
        cpuUsage: 15.6,
        diskUsage: 45.2
      }
    },
    {
      id: 'collector-2',
      name: 'Edge Switch - DMZ',
      ipAddress: '10.0.1.5',
      port: 2055,
      protocol: 'ipfix',
      status: 'active',
      version: '10.0',
      lastSeen: new Date(Date.now() - 45000),
      flowsPerSecond: 890,
      totalFlows: 23456789,
      bytesReceived: 1234567890123,
      packetsReceived: 567890123,
      uptime: 1728000,
      location: 'DMZ',
      vendor: 'Juniper',
      configuration: {
        samplingRate: 500,
        activeTimeout: 60,
        inactiveTimeout: 30,
        templateRefreshRate: 3600,
        maxFlowsPerPacket: 25,
        enableIPv6: true,
        enableMPLS: true,
        enableVLAN: false,
        exportFormat: 'binary',
        compressionEnabled: false,
        encryptionEnabled: true
      },
      statistics: {
        packetsReceived: 567890123,
        packetsDropped: 890,
        flowsProcessed: 23456789,
        flowsFiltered: 234567,
        templatesReceived: 32,
        errorsCount: 12,
        averageProcessingTime: 1.8,
        memoryUsage: 0.9,
        cpuUsage: 12.3,
        diskUsage: 32.1
      }
    },
    {
      id: 'collector-3',
      name: 'Firewall - Perimeter',
      ipAddress: '172.16.0.1',
      port: 6343,
      protocol: 'sflow',
      status: 'maintenance',
      version: '5.0',
      lastSeen: new Date(Date.now() - 300000),
      flowsPerSecond: 0,
      totalFlows: 12345678,
      bytesReceived: 987654321098,
      packetsReceived: 345678901,
      uptime: 864000,
      location: 'Perimeter',
      vendor: 'Fortinet',
      configuration: {
        samplingRate: 2000,
        activeTimeout: 45,
        inactiveTimeout: 20,
        templateRefreshRate: 1200,
        maxFlowsPerPacket: 20,
        enableIPv6: false,
        enableMPLS: false,
        enableVLAN: true,
        exportFormat: 'json',
        compressionEnabled: true,
        encryptionEnabled: true
      },
      statistics: {
        packetsReceived: 345678901,
        packetsDropped: 2345,
        flowsProcessed: 12345678,
        flowsFiltered: 123456,
        templatesReceived: 28,
        errorsCount: 45,
        averageProcessingTime: 3.1,
        memoryUsage: 1.8,
        cpuUsage: 8.9,
        diskUsage: 67.8
      }
    }
  ];
};

// Generate mock data ingestion pipelines
const generateMockPipelines = (): DataIngestionPipeline[] => {
  return [
    {
      id: 'pipeline-1',
      name: 'NetFlow Processing Pipeline',
      status: 'running',
      type: 'netflow',
      source: 'NetFlow Collectors',
      destination: 'Elasticsearch Cluster',
      throughput: 15000,
      recordsProcessed: 1234567890,
      recordsFiltered: 123456789,
      recordsStored: 1111111101,
      errorCount: 234,
      lastProcessed: new Date(Date.now() - 5000),
      configuration: {
        batchSize: 1000,
        processingInterval: 5,
        retryAttempts: 3,
        timeoutSeconds: 30,
        enableDeduplication: true,
        enableValidation: true,
        enableEnrichment: true,
        enableCompression: true,
        bufferSize: 10000,
        parallelWorkers: 8
      },
      filters: [
        {
          id: 'filter-1',
          name: 'Exclude Internal Traffic',
          type: 'exclude',
          field: 'source_ip',
          operator: 'regex',
          value: '^192\\.168\\.',
          enabled: true
        }
      ],
      transformations: [
        {
          id: 'transform-1',
          name: 'GeoIP Enrichment',
          type: 'enrichment',
          sourceField: 'source_ip',
          targetField: 'source_geo',
          transformation: 'geoip_lookup',
          parameters: { database: 'maxmind' },
          enabled: true
        }
      ],
      outputs: [
        {
          id: 'output-1',
          name: 'Elasticsearch Index',
          type: 'elasticsearch',
          endpoint: 'https://es-cluster:9200/netflow-*',
          configuration: { index_pattern: 'netflow-{YYYY.MM.dd}' },
          enabled: true,
          recordsSent: 1111111101,
          lastSent: new Date(Date.now() - 1000),
          errorCount: 12
        }
      ]
    },
    {
      id: 'pipeline-2',
      name: 'Real-time Anomaly Detection',
      status: 'running',
      type: 'netflow',
      source: 'NetFlow Stream',
      destination: 'ML Models',
      throughput: 8500,
      recordsProcessed: 567890123,
      recordsFiltered: 56789012,
      recordsStored: 511101111,
      errorCount: 89,
      lastProcessed: new Date(Date.now() - 2000),
      configuration: {
        batchSize: 500,
        processingInterval: 1,
        retryAttempts: 2,
        timeoutSeconds: 15,
        enableDeduplication: false,
        enableValidation: true,
        enableEnrichment: false,
        enableCompression: false,
        bufferSize: 5000,
        parallelWorkers: 4
      },
      filters: [],
      transformations: [],
      outputs: [
        {
          id: 'output-2',
          name: 'ML Inference API',
          type: 'api',
          endpoint: 'http://ml-service:8080/predict',
          configuration: { batch_size: 100 },
          enabled: true,
          recordsSent: 511101111,
          lastSent: new Date(Date.now() - 500),
          errorCount: 5
        }
      ]
    }
  ];
};

export default function NetFlowIntegrationPage() {
  const [collectors] = useState<NetFlowCollector[]>(generateMockCollectors());
  const [pipelines] = useState<DataIngestionPipeline[]>(generateMockPipelines());
  const [activeTab, setActiveTab] = useState('collectors');

  // Calculate summary statistics
  const activeCollectors = collectors.filter(c => c.status === 'active').length;
  const totalFlowsPerSecond = collectors.reduce((sum, c) => sum + c.flowsPerSecond, 0);
  const runningPipelines = pipelines.filter(p => p.status === 'running').length;
  const totalThroughput = pipelines.reduce((sum, p) => sum + p.throughput, 0);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">NetFlow Integration</h1>
            <p className="text-slate-400 mt-2">
              Real-time network flow data collection, processing, and analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Config
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Config
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Collector
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Active Collectors</CardTitle>
              <Network className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeCollectors}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {collectors.length} total
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Flows/Second</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalFlowsPerSecond.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs text-green-400">
                  Real-time
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Active Pipelines</CardTitle>
              <Database className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{runningPipelines}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {pipelines.length} configured
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Throughput</CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalThroughput.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  records/sec
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="collectors" className="data-[state=active]:bg-slate-700">
              <Network className="h-4 w-4 mr-2" />
              Collectors
            </TabsTrigger>
            <TabsTrigger value="pipelines" className="data-[state=active]:bg-slate-700">
              <Database className="h-4 w-4 mr-2" />
              Pipelines
            </TabsTrigger>
            <TabsTrigger value="protocols" className="data-[state=active]:bg-slate-700">
              <Settings className="h-4 w-4 mr-2" />
              Protocols
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-slate-700">
              <Activity className="h-4 w-4 mr-2" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collectors" className="space-y-6">
            <CollectorManagement collectors={collectors} />
          </TabsContent>

          <TabsContent value="pipelines" className="space-y-6">
            <PipelineManagement pipelines={pipelines} />
          </TabsContent>

          <TabsContent value="protocols" className="space-y-6">
            <ProtocolSupport />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <DataIngestionMonitoring collectors={collectors} pipelines={pipelines} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
