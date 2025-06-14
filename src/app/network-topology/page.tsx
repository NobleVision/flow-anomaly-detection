'use client';

import { useState, useEffect } from 'react';
import { NetworkTopology, AnomalyDetection, DashboardMetrics } from '@/types';
import { dataGenerator } from '@/lib/data-generator';
import { EnhancedNetworkTopology } from '@/components/3d/EnhancedNetworkTopology';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button'; // Not used in this component
import {
  Activity,
  Shield,
  Network,
  TrendingUp,
  AlertTriangle,
  Clock,
  Wifi
} from 'lucide-react';

export default function NetworkTopologyPage() {
  const [topology, setTopology] = useState<NetworkTopology | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalFlows: 0,
    anomaliesDetected: 0,
    activeAlarms: 0,
    networkHealth: 95,
    throughput: { current: 0, average: 0, peak: 0 },
    latency: { current: 0, average: 0, p95: 0 },
    topTalkers: [],
  });
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize topology data
  useEffect(() => {
    const initializeData = () => {
      // Generate initial topology
      const initialTopology = dataGenerator.generateTopology();
      setTopology(initialTopology);

      // Generate some initial anomalies
      const initialAnomalies: AnomalyDetection[] = [];
      for (let i = 0; i < 8; i++) {
        const flow = dataGenerator.generateFlow(true);
        const anomaly = dataGenerator.generateAnomaly(flow);
        initialAnomalies.push(anomaly);
      }
      setAnomalies(initialAnomalies);

      // Update metrics
      setMetrics(prev => ({
        ...prev,
        totalFlows: 2847,
        anomaliesDetected: initialAnomalies.length,
        activeAlarms: initialAnomalies.filter(a => a.severity === 'critical' || a.severity === 'high').length,
        throughput: { current: 234.7, average: 198.3, peak: 456.2 },
        latency: { current: 8.4, average: 12.1, p95: 24.7 },
        topTalkers: [
          { ip: '192.168.1.100', bytes: 2048000, flows: 67 },
          { ip: '10.0.1.50', bytes: 1856000, flows: 45 },
          { ip: '172.16.1.25', bytes: 1243000, flows: 38 },
          { ip: '192.168.2.75', bytes: 987000, flows: 29 },
          { ip: '10.0.2.120', bytes: 756000, flows: 22 },
        ],
      }));
    };

    initializeData();
  }, []);

  // Real-time simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Generate new anomaly occasionally
      if (Math.random() < 0.15) { // 15% chance
        const flow = dataGenerator.generateFlow(true);
        const anomaly = dataGenerator.generateAnomaly(flow);
        
        setAnomalies(prev => [anomaly, ...prev.slice(0, 19)]); // Keep last 20
        
        setMetrics(prev => ({
          ...prev,
          anomaliesDetected: prev.anomaliesDetected + 1,
          activeAlarms: prev.activeAlarms + (anomaly.severity === 'critical' || anomaly.severity === 'high' ? 1 : 0),
        }));
      }

      // Update metrics
      setMetrics(prev => ({
        ...prev,
        totalFlows: prev.totalFlows + Math.floor(Math.random() * 5) + 1,
        throughput: {
          ...prev.throughput,
          current: 180 + Math.random() * 120,
        },
        latency: {
          ...prev.latency,
          current: 6 + Math.random() * 15,
        },
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isSimulating]);

  const startSimulation = () => setIsSimulating(true);
  const stopSimulation = () => setIsSimulating(false);

  const generateDDoSDemo = () => {
    // Generate DDoS attack simulation
    const targetIp = '192.168.1.100';
    
    // Generate multiple critical anomalies quickly
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const flow = dataGenerator.generateFlow(true);
        flow.destinationIp = targetIp;
        flow.bytes = 8000000 + Math.random() * 7000000; // Very large volume

        const anomaly = dataGenerator.generateAnomaly(flow);
        anomaly.type = 'volume';
        anomaly.severity = 'critical';
        anomaly.confidence = 0.95 + Math.random() * 0.05;
        anomaly.description = `DDoS attack detected: Massive traffic volume to ${targetIp}`;

        setAnomalies(prev => [anomaly, ...prev]);
      }, i * 400); // Stagger the anomalies
    }
  };

  if (!topology) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing Enhanced Network Topology...</p>
        </div>
      </div>
    );
  }

  const nodesByType = topology.nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const nodesByStatus = topology.nodes.reduce((acc, node) => {
    acc[node.status] = (acc[node.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const criticalAnomalies = anomalies.filter(a => a.severity === 'critical').length;
  const highAnomalies = anomalies.filter(a => a.severity === 'high').length;
  const mediumAnomalies = anomalies.filter(a => a.severity === 'medium').length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onStartSimulation={startSimulation}
        onStopSimulation={stopSimulation}
        onStartDDoSDemo={generateDDoSDemo}
        isSimulating={isSimulating}
      />

      <div className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Network Topology</h1>
            <p className="text-muted-foreground">Enhanced 3D network visualization with advanced filtering and analysis</p>
          </div>
        </div>

        {/* Network Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Health</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{metrics.networkHealth}%</div>
            <p className="text-xs text-muted-foreground">Overall system performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Nodes</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topology.nodes.length}</div>
            <p className="text-xs text-muted-foreground">
              {nodesByStatus.normal || 0} normal, {nodesByStatus.warning || 0} warning, {nodesByStatus.critical || 0} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Links</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topology.edges.length}</div>
            <p className="text-xs text-muted-foreground">
              {topology.edges.filter(e => e.status === 'active').length} active connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{anomalies.length}</div>
            <p className="text-xs text-muted-foreground">
              {criticalAnomalies} critical, {highAnomalies} high, {mediumAnomalies} medium
            </p>
          </CardContent>
        </Card>
        </div>

        {/* Node Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Node Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(nodesByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    type === 'server' ? 'bg-blue-500' :
                    type === 'router' ? 'bg-green-500' :
                    type === 'switch' ? 'bg-yellow-500' :
                    type === 'firewall' ? 'bg-red-500' : 'bg-purple-500'
                  }`} />
                  <span className="capitalize">{type}</span>
                </div>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>Throughput</span>
              </div>
              <span className="font-mono">{metrics.throughput.current.toFixed(1)} Mbps</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span>Latency</span>
              </div>
              <span className="font-mono">{metrics.latency.current.toFixed(1)} ms</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" />
                <span>Total Flows</span>
              </div>
              <span className="font-mono">{metrics.totalFlows.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Talkers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {metrics.topTalkers.slice(0, 5).map((talker, index) => (
              <div key={talker.ip} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                    {index + 1}
                  </Badge>
                  <span className="font-mono">{talker.ip}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{(talker.bytes / 1024 / 1024).toFixed(1)} MB</div>
                  <div className="text-xs text-muted-foreground">{talker.flows} flows</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        </div>

        {/* Enhanced Network Topology Visualization */}
        <EnhancedNetworkTopology topology={topology} anomalies={anomalies} />
      </div>
    </div>
  );
}
