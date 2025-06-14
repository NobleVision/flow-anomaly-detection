'use client';

import { useState } from 'react';
import { SecurityDashboard, SecurityEvent, ThreatIntelligence, BehavioralProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThreatOverview } from '@/components/security/ThreatOverview';
import { ThreatIntelligencePanel } from '@/components/security/ThreatIntelligencePanel';
import { BehavioralAnalysis } from '@/components/security/BehavioralAnalysis';
import { SecurityEvents } from '@/components/security/SecurityEvents';
import { MitreAttackMap } from '@/components/security/MitreAttackMap';
import {
  Shield,
  AlertTriangle,
  Eye,
  Brain,
  Map,
  Settings,
  Download,
  Upload,
  Zap
} from 'lucide-react';

// Generate mock security dashboard data
const generateMockSecurityDashboard = (): SecurityDashboard => {
  return {
    threatLevel: 'medium',
    activeThreats: 23,
    blockedAttacks: 156,
    investigatingEvents: 8,
    riskScore: 67,
    topThreats: [],
    threatTrends: [],
    geographicThreats: [
      { country: 'China', countryCode: 'CN', threatCount: 45, severity: 'high', coordinates: [104.1954, 35.8617] },
      { country: 'Russia', countryCode: 'RU', threatCount: 32, severity: 'medium', coordinates: [105.3188, 61.5240] },
      { country: 'North Korea', countryCode: 'KP', threatCount: 18, severity: 'critical', coordinates: [127.5101, 40.3399] },
      { country: 'Iran', countryCode: 'IR', threatCount: 12, severity: 'medium', coordinates: [53.6880, 32.4279] }
    ],
    mitreAttackMap: [
      {
        id: 'T1566',
        name: 'Phishing',
        tactic: 'Initial Access',
        description: 'Adversaries may send phishing messages to gain access to victim systems.',
        detectionCount: 15,
        severity: 'high',
        lastDetected: new Date(Date.now() - 3600000)
      },
      {
        id: 'T1055',
        name: 'Process Injection',
        tactic: 'Defense Evasion',
        description: 'Adversaries may inject code into processes to evade process-based defenses.',
        detectionCount: 8,
        severity: 'medium',
        lastDetected: new Date(Date.now() - 7200000)
      },
      {
        id: 'T1071',
        name: 'Application Layer Protocol',
        tactic: 'Command and Control',
        description: 'Adversaries may communicate using application layer protocols.',
        detectionCount: 23,
        severity: 'high',
        lastDetected: new Date(Date.now() - 1800000)
      }
    ]
  };
};

// Generate mock security events
const generateMockSecurityEvents = (): SecurityEvent[] => {
  return [
    {
      id: 'event-1',
      timestamp: new Date(Date.now() - 1800000),
      type: 'intrusion',
      severity: 'high',
      source: '203.0.113.45',
      destination: '192.168.1.100',
      description: 'Suspicious network activity detected from known malicious IP',
      indicators: [],
      mitreTactics: ['Initial Access', 'Command and Control'],
      mitreId: 'T1071',
      riskScore: 85,
      status: 'investigating',
      assignedTo: 'security-team',
      evidence: [],
      relatedEvents: ['event-2', 'event-3']
    },
    {
      id: 'event-2',
      timestamp: new Date(Date.now() - 3600000),
      type: 'malware',
      severity: 'critical',
      source: '198.51.100.23',
      destination: '10.0.1.50',
      description: 'Malware communication detected - potential C2 traffic',
      indicators: [],
      mitreTactics: ['Command and Control', 'Exfiltration'],
      mitreId: 'T1041',
      riskScore: 95,
      status: 'open',
      evidence: [],
      relatedEvents: []
    },
    {
      id: 'event-3',
      timestamp: new Date(Date.now() - 7200000),
      type: 'data_exfiltration',
      severity: 'medium',
      source: '172.16.1.25',
      destination: '185.220.101.42',
      description: 'Unusual data transfer pattern detected',
      indicators: [],
      mitreTactics: ['Exfiltration'],
      mitreId: 'T1048',
      riskScore: 72,
      status: 'resolved',
      evidence: [],
      relatedEvents: []
    }
  ];
};

// Generate mock threat intelligence
const generateMockThreatIntelligence = (): ThreatIntelligence[] => {
  return [
    {
      id: 'ti-1',
      source: 'AlienVault OTX',
      type: 'ip',
      value: '203.0.113.45',
      category: 'c2',
      severity: 'high',
      confidence: 0.92,
      firstSeen: new Date(Date.now() - 86400000),
      lastSeen: new Date(Date.now() - 1800000),
      description: 'Known command and control server for APT group',
      tags: ['apt', 'c2', 'malware'],
      references: ['https://otx.alienvault.com/indicator/...'],
      ttl: 7200,
      isActive: true
    },
    {
      id: 'ti-2',
      source: 'VirusTotal',
      type: 'domain',
      value: 'malicious-domain.com',
      category: 'malware',
      severity: 'critical',
      confidence: 0.98,
      firstSeen: new Date(Date.now() - 172800000),
      lastSeen: new Date(Date.now() - 3600000),
      description: 'Domain hosting malware payloads',
      tags: ['malware', 'payload', 'dropper'],
      references: ['https://virustotal.com/...'],
      ttl: 3600,
      isActive: true
    }
  ];
};

// Generate mock behavioral profiles
const generateMockBehavioralProfiles = (): BehavioralProfile[] => {
  return [
    {
      id: 'profile-1',
      entityId: 'user-001',
      entityType: 'user',
      entityName: 'john.doe@company.com',
      profileType: 'baseline',
      timeWindow: '30d',
      metrics: {
        trafficVolume: { average: 1024000, peak: 5120000, variance: 0.3 },
        connectionPatterns: { uniqueDestinations: 45, averageSessionDuration: 1800, protocolDistribution: { 'HTTP': 60, 'HTTPS': 35, 'SSH': 5 } },
        temporalPatterns: { activeHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], weekdayActivity: [0.8, 0.9, 0.95, 0.9, 0.85, 0.2, 0.1], seasonality: 0.1 },
        geographicPatterns: { countries: ['US', 'CA'], suspiciousLocations: 0, travelVelocity: 0 }
      },
      patterns: [],
      anomalies: [],
      riskScore: 25,
      lastUpdated: new Date(),
      confidence: 0.95
    },
    {
      id: 'profile-2',
      entityId: 'device-002',
      entityType: 'device',
      entityName: 'server-web-01',
      profileType: 'anomaly',
      timeWindow: '7d',
      metrics: {
        trafficVolume: { average: 10240000, peak: 51200000, variance: 0.8 },
        connectionPatterns: { uniqueDestinations: 234, averageSessionDuration: 300, protocolDistribution: { 'HTTP': 40, 'HTTPS': 55, 'SSH': 5 } },
        temporalPatterns: { activeHours: Array.from({length: 24}, (_, i) => i), weekdayActivity: [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9], seasonality: 0.05 },
        geographicPatterns: { countries: ['US', 'CA', 'GB', 'DE', 'CN'], suspiciousLocations: 2, travelVelocity: 0 }
      },
      patterns: [],
      anomalies: [
        {
          id: 'anomaly-1',
          type: 'volume_spike',
          description: 'Traffic volume 300% above baseline',
          severity: 'high',
          confidence: 0.89,
          timestamp: new Date(Date.now() - 3600000),
          deviation: 3.0,
          baseline: 10240000,
          observed: 30720000,
          context: { trigger: 'unusual_traffic_pattern' }
        }
      ],
      riskScore: 78,
      lastUpdated: new Date(),
      confidence: 0.87
    }
  ];
};

export default function SecurityPage() {
  const [dashboard] = useState<SecurityDashboard>(generateMockSecurityDashboard());
  const [securityEvents] = useState<SecurityEvent[]>(generateMockSecurityEvents());
  const [threatIntelligence] = useState<ThreatIntelligence[]>(generateMockThreatIntelligence());
  const [behavioralProfiles] = useState<BehavioralProfile[]>(generateMockBehavioralProfiles());
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Security Operations Center</h1>
            <p className="text-slate-400 mt-2">
              Advanced threat detection, intelligence, and behavioral analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import IOCs
            </Button>
            <Button>
              <Zap className="h-4 w-4 mr-2" />
              Run Scan
            </Button>
          </div>
        </div>

        {/* Threat Level Indicator */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  dashboard.threatLevel === 'critical' ? 'bg-red-500/20' :
                  dashboard.threatLevel === 'high' ? 'bg-orange-500/20' :
                  dashboard.threatLevel === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
                }`}>
                  <Shield className={`h-8 w-8 ${
                    dashboard.threatLevel === 'critical' ? 'text-red-400' :
                    dashboard.threatLevel === 'high' ? 'text-orange-400' :
                    dashboard.threatLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Threat Level: {dashboard.threatLevel.toUpperCase()}</h2>
                  <p className="text-slate-400">Current security posture and risk assessment</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{dashboard.riskScore}/100</div>
                <div className="text-sm text-slate-400">Risk Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              <Shield className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-slate-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Security Events
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="data-[state=active]:bg-slate-700">
              <Eye className="h-4 w-4 mr-2" />
              Threat Intel
            </TabsTrigger>
            <TabsTrigger value="behavioral" className="data-[state=active]:bg-slate-700">
              <Brain className="h-4 w-4 mr-2" />
              Behavioral Analysis
            </TabsTrigger>
            <TabsTrigger value="mitre" className="data-[state=active]:bg-slate-700">
              <Map className="h-4 w-4 mr-2" />
              MITRE ATT&CK
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ThreatOverview dashboard={dashboard} />
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <SecurityEvents events={securityEvents} />
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            <ThreatIntelligencePanel intelligence={threatIntelligence} />
          </TabsContent>

          <TabsContent value="behavioral" className="space-y-6">
            <BehavioralAnalysis profiles={behavioralProfiles} />
          </TabsContent>

          <TabsContent value="mitre" className="space-y-6">
            <MitreAttackMap techniques={dashboard.mitreAttackMap} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
