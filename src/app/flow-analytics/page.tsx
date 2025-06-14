'use client';

import { useState, useEffect, useMemo } from 'react';
import { FlowAnalytics, NetworkFlow, DashboardMetrics } from '@/types';
import { dataGenerator } from '@/lib/data-generator';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FlowAnalyticsDashboard } from '@/components/flow-analytics/FlowAnalyticsDashboard';
import { TrafficPatternAnalysis } from '@/components/flow-analytics/TrafficPatternAnalysis';
import { TopTalkersAnalysis } from '@/components/flow-analytics/TopTalkersAnalysis';
import { BandwidthMetrics } from '@/components/flow-analytics/BandwidthMetrics';
import { FlowTrendAnalysis } from '@/components/flow-analytics/FlowTrendAnalysis';
import { Button } from '@/components/ui/button';
import {
  RefreshCw,
  Download,
  Calendar
} from 'lucide-react';

// Helper functions
const getServiceName = (port: number): string => {
  const services: Record<number, string> = {
    80: 'HTTP', 443: 'HTTPS', 22: 'SSH', 21: 'FTP', 25: 'SMTP',
    53: 'DNS', 110: 'POP3', 143: 'IMAP', 993: 'IMAPS', 995: 'POP3S',
    3389: 'RDP', 1433: 'SQL Server', 3306: 'MySQL', 5432: 'PostgreSQL',
    6379: 'Redis', 27017: 'MongoDB', 9200: 'Elasticsearch'
  };
  return services[port] || 'Unknown';
};

const generateHostname = (ip: string): string => {
  const hash = ip.split('.').reduce((acc, octet) => acc + parseInt(octet), 0);
  const hostnames = ['web-server', 'db-server', 'app-server', 'mail-server', 'dns-server', 'file-server'];
  return `${hostnames[hash % hostnames.length]}-${hash % 100}`;
};

const getLocationFromIP = (ip: string): string => {
  const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Sydney, AU', 'Frankfurt, DE', 'Singapore, SG'];
  const hash = ip.split('.').reduce((acc, octet) => acc + parseInt(octet), 0);
  return locations[hash % locations.length];
};

const generateFlowTrends = (flows: NetworkFlow[]) => {
  const now = new Date();
  const trends = [];
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourFlows = flows.filter(flow =>
      flow.timestamp.getHours() === timestamp.getHours()
    );
    trends.push({
      timestamp,
      value: hourFlows.reduce((sum, flow) => sum + flow.bytes, 0),
      label: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });
  }
  return trends;
};

const generateGeographicDistribution = (flows: NetworkFlow[]) => {
  const countries = [
    { country: 'United States', region: 'North America', coordinates: [39.8283, -98.5795] as [number, number] },
    { country: 'United Kingdom', region: 'Europe', coordinates: [55.3781, -3.4360] as [number, number] },
    { country: 'Germany', region: 'Europe', coordinates: [51.1657, 10.4515] as [number, number] },
    { country: 'Japan', region: 'Asia', coordinates: [36.2048, 138.2529] as [number, number] },
    { country: 'Australia', region: 'Oceania', coordinates: [-25.2744, 133.7751] as [number, number] }
  ];

  return countries.map(country => {
    const countryFlows = flows.filter(() => Math.random() > 0.7); // Simulate geographic distribution
    const bytes = countryFlows.reduce((sum, flow) => sum + flow.bytes, 0);
    return {
      ...country,
      flows: countryFlows.length,
      bytes,
      percentage: (bytes / flows.reduce((sum, flow) => sum + flow.bytes, 0)) * 100
    };
  }).filter(country => country.flows > 0);
};

export default function FlowAnalyticsPage() {
  const [flowAnalytics, setFlowAnalytics] = useState<FlowAnalytics | null>(null);
  const [flows, setFlows] = useState<NetworkFlow[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h');
  const [refreshInterval] = useState<number>(30000);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Generate comprehensive flow analytics data
  const generateFlowAnalytics = useMemo(() => {
    if (!flows.length) return null;

    const totalFlows = flows.length;
    const totalBytes = flows.reduce((sum, flow) => sum + flow.bytes, 0);
    const totalPackets = flows.reduce((sum, flow) => sum + flow.packets, 0);
    const averageFlowDuration = flows.reduce((sum, flow) => sum + flow.duration, 0) / totalFlows;

    // Protocol analysis
    const protocolMap = new Map<string, { flows: number; bytes: number; packets: number }>();
    flows.forEach(flow => {
      const existing = protocolMap.get(flow.protocol) || { flows: 0, bytes: 0, packets: 0 };
      protocolMap.set(flow.protocol, {
        flows: existing.flows + 1,
        bytes: existing.bytes + flow.bytes,
        packets: existing.packets + flow.packets
      });
    });

    const topProtocols = Array.from(protocolMap.entries()).map(([protocol, stats]) => ({
      protocol,
      ...stats,
      percentage: (stats.bytes / totalBytes) * 100
    })).sort((a, b) => b.bytes - a.bytes);

    // Port analysis
    const portMap = new Map<number, { flows: number; bytes: number; service: string }>();
    flows.forEach(flow => {
      const port = flow.destinationPort;
      const existing = portMap.get(port) || { flows: 0, bytes: 0, service: getServiceName(port) };
      portMap.set(port, {
        flows: existing.flows + 1,
        bytes: existing.bytes + flow.bytes,
        service: existing.service
      });
    });

    const topPorts = Array.from(portMap.entries()).map(([port, stats]) => ({
      port,
      ...stats,
      percentage: (stats.bytes / totalBytes) * 100
    })).sort((a, b) => b.bytes - a.bytes).slice(0, 10);

    // Top talkers analysis
    const talkerMap = new Map<string, { inbound: number; outbound: number; flows: number }>();
    flows.forEach(flow => {
      // Source IP (outbound)
      const sourceStats = talkerMap.get(flow.sourceIp) || { inbound: 0, outbound: 0, flows: 0 };
      talkerMap.set(flow.sourceIp, {
        ...sourceStats,
        outbound: sourceStats.outbound + flow.bytes,
        flows: sourceStats.flows + 1
      });

      // Destination IP (inbound)
      const destStats = talkerMap.get(flow.destinationIp) || { inbound: 0, outbound: 0, flows: 0 };
      talkerMap.set(flow.destinationIp, {
        ...destStats,
        inbound: destStats.inbound + flow.bytes
      });
    });

    const topTalkers = Array.from(talkerMap.entries()).map(([ip, stats]) => ({
      ip,
      hostname: generateHostname(ip),
      inboundBytes: stats.inbound,
      outboundBytes: stats.outbound,
      totalBytes: stats.inbound + stats.outbound,
      flows: stats.flows,
      percentage: ((stats.inbound + stats.outbound) / totalBytes) * 100,
      location: getLocationFromIP(ip)
    })).sort((a, b) => b.totalBytes - a.totalBytes).slice(0, 15);

    // Bandwidth utilization
    const currentBandwidth = flows.slice(-10).reduce((sum, flow) => sum + flow.bytes, 0) / 10;
    const averageBandwidth = totalBytes / totalFlows;
    const peakBandwidth = Math.max(...flows.map(flow => flow.bytes));

    const bandwidthUtilization = {
      current: currentBandwidth,
      average: averageBandwidth,
      peak: peakBandwidth,
      utilization: Math.min((currentBandwidth / (peakBandwidth || 1)) * 100, 100),
      capacity: peakBandwidth * 1.2,
      trend: currentBandwidth > averageBandwidth ? 'increasing' as const : 
             currentBandwidth < averageBandwidth * 0.8 ? 'decreasing' as const : 'stable' as const
    };

    // Flow trends (time series)
    const flowTrends = generateFlowTrends(flows);

    // Geographic distribution
    const geographicDistribution = generateGeographicDistribution(flows);

    return {
      totalFlows,
      totalBytes,
      totalPackets,
      averageFlowDuration,
      topProtocols,
      topPorts,
      topTalkers,
      bandwidthUtilization,
      flowTrends,
      geographicDistribution
    };
  }, [flows]);



  // Data loading and refresh logic
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Generate flows and metrics
        const generatedFlows = Array.from({ length: 1000 }, () => dataGenerator.generateFlow());
        const generatedMetrics = dataGenerator.generateDashboardMetrics();
        
        setFlows(generatedFlows);
        setMetrics(generatedMetrics);
      } catch (error) {
        console.error('Error loading flow analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [timeRange]);

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      const newFlows = Array.from({ length: 50 }, () => dataGenerator.generateFlow());
      setFlows(prev => [...prev.slice(-950), ...newFlows]);
      setMetrics(dataGenerator.generateDashboardMetrics());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Update analytics when flows change
  useEffect(() => {
    if (flows.length > 0) {
      setFlowAnalytics(generateFlowAnalytics);
    }
  }, [flows, generateFlowAnalytics]);

  const handleRefresh = () => {
    const newFlows = Array.from({ length: 100 }, () => dataGenerator.generateFlow());
    setFlows(prev => [...prev.slice(-900), ...newFlows]);
    setMetrics(dataGenerator.generateDashboardMetrics());
  };

  const handleExport = () => {
    if (!flowAnalytics) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      timeRange,
      analytics: flowAnalytics,
      summary: {
        totalFlows: flowAnalytics.totalFlows,
        totalBytes: flowAnalytics.totalBytes,
        topProtocol: flowAnalytics.topProtocols[0]?.protocol,
        topTalker: flowAnalytics.topTalkers[0]?.ip
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading || !flowAnalytics || !metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
              <p className="text-slate-300">Loading flow analytics data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Flow Analytics</h1>
            <p className="text-slate-300">Comprehensive traffic flow analysis and bandwidth monitoring</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value as '1h' | '6h' | '24h' | '7d' | '30d')}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="6h">Last 6 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>

            {/* Auto Refresh Toggle */}
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </Button>

            {/* Manual Refresh */}
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* Export Button */}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Analytics Dashboard */}
        <FlowAnalyticsDashboard analytics={flowAnalytics} metrics={metrics} />

        {/* Detailed Analysis Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <TrafficPatternAnalysis analytics={flowAnalytics} />
          <TopTalkersAnalysis analytics={flowAnalytics} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <BandwidthMetrics analytics={flowAnalytics} />
          <FlowTrendAnalysis analytics={flowAnalytics} />
        </div>
      </div>
    </div>
  );
}
