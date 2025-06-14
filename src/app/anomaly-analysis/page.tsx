'use client';

import { useState, useEffect, useMemo } from 'react';
import { AnomalyDetection, NetworkFlow, DashboardMetrics, NetworkTopology } from '@/types';
import { dataGenerator } from '@/lib/data-generator';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AnomalyDetectionEngine } from '@/components/anomaly/AnomalyDetectionEngine';
import { AnomalyTimeline } from '@/components/anomaly/AnomalyTimeline';
import { AnomalyCorrelation } from '@/components/anomaly/AnomalyCorrelation';
import { AnomalyList } from '@/components/anomaly/AnomalyList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Search, 
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Shield,
  Clock,
  Target,
  Brain,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';

interface AnomalyAnalysisFilters {
  severity: string[];
  type: string[];
  status: string[];
  timeRange: string;
  searchTerm: string;
  confidence: number;
}

interface AnomalyStatistics {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  resolved: number;
  active: number;
  investigating: number;
  falsePositives: number;
  averageConfidence: number;
  detectionRate: number;
  responseTime: number;
}

interface AnomalyTrend {
  timestamp: Date;
  count: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
}

export default function AnomalyAnalysisPage() {
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [topology, setTopology] = useState<NetworkTopology | null>(null);
  const [flows, setFlows] = useState<NetworkFlow[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState<AnomalyAnalysisFilters>({
    severity: [],
    type: [],
    status: [],
    timeRange: '24h',
    searchTerm: '',
    confidence: 0
  });

  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyDetection | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'timeline' | 'correlation' | 'patterns'>('overview');

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      
      // Generate initial topology
      const initialTopology = dataGenerator.generateTopology();
      setTopology(initialTopology);

      // Generate comprehensive anomaly dataset
      const initialAnomalies: AnomalyDetection[] = [];
      const initialFlows: NetworkFlow[] = [];

      // Generate 50 anomalies with diverse characteristics
      for (let i = 0; i < 50; i++) {
        const isAnomalous = Math.random() < 0.7; // 70% anomalous flows
        const flow = dataGenerator.generateFlow(isAnomalous);
        initialFlows.push(flow);

        if (isAnomalous) {
          const anomaly = dataGenerator.generateAnomaly(flow);
          
          // Add some historical timestamps for timeline analysis
          const hoursAgo = Math.floor(Math.random() * 168); // Up to 7 days ago
          anomaly.timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
          
          // Vary status for realistic distribution
          const statusRandom = Math.random();
          if (statusRandom < 0.6) anomaly.status = 'active';
          else if (statusRandom < 0.8) anomaly.status = 'investigating';
          else anomaly.status = 'resolved';

          initialAnomalies.push(anomaly);
        }
      }

      // Sort by timestamp (newest first)
      initialAnomalies.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setAnomalies(initialAnomalies);
      setFlows(initialFlows);
      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Real-time simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Generate new anomaly occasionally
      if (Math.random() < 0.25) { // 25% chance every interval
        const flow = dataGenerator.generateFlow(true);
        const anomaly = dataGenerator.generateAnomaly(flow);
        
        setAnomalies(prev => [anomaly, ...prev.slice(0, 99)]); // Keep last 100
        setFlows(prev => [flow, ...prev.slice(0, 199)]); // Keep last 200
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Calculate anomaly statistics
  const statistics = useMemo((): AnomalyStatistics => {
    const total = anomalies.length;
    const critical = anomalies.filter(a => a.severity === 'critical').length;
    const high = anomalies.filter(a => a.severity === 'high').length;
    const medium = anomalies.filter(a => a.severity === 'medium').length;
    const low = anomalies.filter(a => a.severity === 'low').length;
    
    const resolved = anomalies.filter(a => a.status === 'resolved').length;
    const active = anomalies.filter(a => a.status === 'active').length;
    const investigating = anomalies.filter(a => a.status === 'investigating').length;
    
    const falsePositives = anomalies.filter(a => a.confidence < 0.3).length;
    const averageConfidence = anomalies.reduce((sum, a) => sum + a.confidence, 0) / total || 0;
    
    // Mock detection rate and response time
    const detectionRate = Math.min(95, 85 + (averageConfidence * 10));
    const responseTime = Math.max(30, 180 - (averageConfidence * 100));

    return {
      total,
      critical,
      high,
      medium,
      low,
      resolved,
      active,
      investigating,
      falsePositives,
      averageConfidence,
      detectionRate,
      responseTime
    };
  }, [anomalies]);

  // Filter anomalies based on current filters
  const filteredAnomalies = useMemo(() => {
    return anomalies.filter(anomaly => {
      // Severity filter
      if (filters.severity.length > 0 && !filters.severity.includes(anomaly.severity)) {
        return false;
      }

      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(anomaly.type)) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(anomaly.status)) {
        return false;
      }

      // Confidence filter
      if (anomaly.confidence < filters.confidence / 100) {
        return false;
      }

      // Time range filter
      const now = new Date();
      const timeRangeHours = {
        '1h': 1,
        '6h': 6,
        '24h': 24,
        '7d': 168,
        '30d': 720,
        'all': Infinity
      }[filters.timeRange] || 24;

      const cutoffTime = new Date(now.getTime() - timeRangeHours * 60 * 60 * 1000);
      if (anomaly.timestamp < cutoffTime) {
        return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          anomaly.sourceIp.toLowerCase().includes(searchLower) ||
          anomaly.destinationIp.toLowerCase().includes(searchLower) ||
          anomaly.type.toLowerCase().includes(searchLower) ||
          anomaly.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [anomalies, filters]);

  const startSimulation = () => setIsSimulating(true);
  const stopSimulation = () => setIsSimulating(false);

  const generateAnomalyBurst = () => {
    // Generate a burst of related anomalies for correlation analysis
    const targetIp = '192.168.1.100';
    const anomalyTypes = ['volume', 'pattern', 'geographic'];
    
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const flow = dataGenerator.generateFlow(true);
        flow.destinationIp = targetIp;
        
        const anomaly = dataGenerator.generateAnomaly(flow);
        anomaly.type = anomalyTypes[i % anomalyTypes.length];
        anomaly.severity = i < 5 ? 'critical' : i < 10 ? 'high' : 'medium';
        anomaly.confidence = 0.85 + Math.random() * 0.15;
        anomaly.description = `Coordinated attack detected: ${anomaly.type} anomaly targeting ${targetIp}`;

        setAnomalies(prev => [anomaly, ...prev]);
      }, i * 300); // Stagger the anomalies
    }
  };

  const handleFilterChange = (newFilters: Partial<AnomalyAnalysisFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      severity: [],
      type: [],
      status: [],
      timeRange: '24h',
      searchTerm: '',
      confidence: 0
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing Anomaly Analysis Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onStartSimulation={startSimulation}
        onStopSimulation={stopSimulation}
        onStartDDoSDemo={generateAnomalyBurst}
        isSimulating={isSimulating}
      />

      <div className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Anomaly Analysis</h1>
            <p className="text-muted-foreground">Advanced anomaly detection, correlation analysis, and threat intelligence</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Anomalies</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.active} active, {statistics.resolved} resolved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Detection Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{statistics.detectionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Avg confidence: {(statistics.averageConfidence * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{statistics.responseTime.toFixed(0)}s</div>
              <p className="text-xs text-muted-foreground">
                Average time to investigate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Threats</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{statistics.critical}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.high} high, {statistics.medium} medium severity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* View Mode Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'overview' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('overview')}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Overview
                </Button>
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('timeline')}
                  className="flex items-center gap-2"
                >
                  <LineChart className="w-4 h-4" />
                  Timeline
                </Button>
                <Button
                  variant={viewMode === 'correlation' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('correlation')}
                  className="flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Correlation
                </Button>
                <Button
                  variant={viewMode === 'patterns' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('patterns')}
                  className="flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Detection Engine
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Select value={filters.timeRange} onValueChange={(value) => handleFilterChange({ timeRange: value })}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last Hour</SelectItem>
                    <SelectItem value="6h">Last 6 Hours</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Content Based on View Mode */}
        {viewMode === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Anomaly List */}
            <div className="lg:col-span-2">
              <AnomalyList
                anomalies={filteredAnomalies}
                onAnomalySelect={setSelectedAnomaly}
                selectedAnomaly={selectedAnomaly}
              />
            </div>

            {/* Selected Anomaly Details */}
            <div className="space-y-6">
              {selectedAnomaly ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-500" />
                      Anomaly Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">ID:</span>
                        <span className="ml-2 font-mono text-sm">{selectedAnomaly.id}</span>
                      </div>
                      <div>
                        <span className="font-medium">Type:</span>
                        <Badge variant="outline" className="ml-2">{selectedAnomaly.type}</Badge>
                      </div>
                      <div>
                        <span className="font-medium">Severity:</span>
                        <Badge variant={selectedAnomaly.severity === 'critical' ? 'destructive' : 'secondary'} className="ml-2">
                          {selectedAnomaly.severity}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Confidence:</span>
                        <span className="ml-2">{(selectedAnomaly.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>
                        <Badge variant="outline" className="ml-2">{selectedAnomaly.status}</Badge>
                      </div>
                      <div>
                        <span className="font-medium">Timestamp:</span>
                        <span className="ml-2 text-sm">{selectedAnomaly.timestamp.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h4 className="font-medium mb-2">Network Flow</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Source:</span>
                          <span className="ml-2 font-mono">{selectedAnomaly.sourceIp}:{selectedAnomaly.sourcePort}</span>
                        </div>
                        <div>
                          <span className="font-medium">Destination:</span>
                          <span className="ml-2 font-mono">{selectedAnomaly.destinationIp}:{selectedAnomaly.destinationPort}</span>
                        </div>
                        <div>
                          <span className="font-medium">Protocol:</span>
                          <span className="ml-2">{selectedAnomaly.protocol}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{selectedAnomaly.description}</p>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button size="sm" className="flex-1">
                        <Shield className="w-4 h-4 mr-2" />
                        Investigate
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reanalyze
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select an anomaly to view details</p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Active Anomalies:</span>
                    <Badge variant="destructive">{statistics.active}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Under Investigation:</span>
                    <Badge variant="secondary">{statistics.investigating}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolved:</span>
                    <Badge variant="outline">{statistics.resolved}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>False Positives:</span>
                    <Badge variant="outline">{statistics.falsePositives}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {viewMode === 'timeline' && (
          <AnomalyTimeline
            anomalies={filteredAnomalies}
            timeRange={filters.timeRange}
            onTimeRangeChange={(range) => handleFilterChange({ timeRange: range })}
          />
        )}

        {viewMode === 'correlation' && (
          <AnomalyCorrelation anomalies={filteredAnomalies} />
        )}

        {viewMode === 'patterns' && (
          <AnomalyDetectionEngine
            anomalies={filteredAnomalies}
            flows={flows}
            onAlgorithmToggle={(algorithmId) => {
              console.log('Toggle algorithm:', algorithmId);
              // Implementation for toggling algorithms
            }}
          />
        )}
      </div>
    </div>
  );
}
