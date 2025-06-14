'use client';

import { useState } from 'react';
import { MitreAttackTechnique } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Map,
  Target,
  Shield,
  Eye,
  Zap,
  Activity,
  Clock,
  AlertTriangle,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';

interface MitreAttackMapProps {
  techniques: MitreAttackTechnique[];
}

// MITRE ATT&CK Tactics in order
const MITRE_TACTICS = [
  'Initial Access',
  'Execution',
  'Persistence',
  'Privilege Escalation',
  'Defense Evasion',
  'Credential Access',
  'Discovery',
  'Lateral Movement',
  'Collection',
  'Command and Control',
  'Exfiltration',
  'Impact'
];

// Generate additional techniques for demonstration
const generateAdditionalTechniques = (): MitreAttackTechnique[] => {
  const additionalTechniques = [
    {
      id: 'T1190',
      name: 'Exploit Public-Facing Application',
      tactic: 'Initial Access',
      description: 'Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program.',
      detectionCount: 12,
      severity: 'high' as const,
      lastDetected: new Date(Date.now() - 7200000)
    },
    {
      id: 'T1059',
      name: 'Command and Scripting Interpreter',
      tactic: 'Execution',
      description: 'Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries.',
      detectionCount: 28,
      severity: 'medium' as const,
      lastDetected: new Date(Date.now() - 3600000)
    },
    {
      id: 'T1547',
      name: 'Boot or Logon Autostart Execution',
      tactic: 'Persistence',
      description: 'Adversaries may configure system settings to automatically execute a program during system boot.',
      detectionCount: 5,
      severity: 'medium' as const,
      lastDetected: new Date(Date.now() - 14400000)
    },
    {
      id: 'T1548',
      name: 'Abuse Elevation Control Mechanism',
      tactic: 'Privilege Escalation',
      description: 'Adversaries may circumvent mechanisms designed to control elevate privileges.',
      detectionCount: 7,
      severity: 'high' as const,
      lastDetected: new Date(Date.now() - 10800000)
    },
    {
      id: 'T1027',
      name: 'Obfuscated Files or Information',
      tactic: 'Defense Evasion',
      description: 'Adversaries may attempt to make an executable or file difficult to discover or analyze.',
      detectionCount: 18,
      severity: 'medium' as const,
      lastDetected: new Date(Date.now() - 5400000)
    },
    {
      id: 'T1003',
      name: 'OS Credential Dumping',
      tactic: 'Credential Access',
      description: 'Adversaries may attempt to dump credentials to obtain account login and credential material.',
      detectionCount: 9,
      severity: 'critical' as const,
      lastDetected: new Date(Date.now() - 1800000)
    },
    {
      id: 'T1083',
      name: 'File and Directory Discovery',
      tactic: 'Discovery',
      description: 'Adversaries may enumerate files and directories or may search in specific locations.',
      detectionCount: 22,
      severity: 'low' as const,
      lastDetected: new Date(Date.now() - 9000000)
    },
    {
      id: 'T1021',
      name: 'Remote Services',
      tactic: 'Lateral Movement',
      description: 'Adversaries may use Valid Accounts to log into a service specifically designed to accept remote connections.',
      detectionCount: 14,
      severity: 'high' as const,
      lastDetected: new Date(Date.now() - 6300000)
    },
    {
      id: 'T1005',
      name: 'Data from Local System',
      tactic: 'Collection',
      description: 'Adversaries may search local system sources, such as file systems or local databases.',
      detectionCount: 11,
      severity: 'medium' as const,
      lastDetected: new Date(Date.now() - 12600000)
    },
    {
      id: 'T1041',
      name: 'Exfiltration Over C2 Channel',
      tactic: 'Exfiltration',
      description: 'Adversaries may steal data by exfiltrating it over an existing command and control channel.',
      detectionCount: 6,
      severity: 'high' as const,
      lastDetected: new Date(Date.now() - 4500000)
    },
    {
      id: 'T1486',
      name: 'Data Encrypted for Impact',
      tactic: 'Impact',
      description: 'Adversaries may encrypt data on target systems or on large numbers of systems in a network.',
      detectionCount: 3,
      severity: 'critical' as const,
      lastDetected: new Date(Date.now() - 18000000)
    }
  ];

  return additionalTechniques;
};

export function MitreAttackMap({ techniques }: MitreAttackMapProps) {
  const [selectedTechnique, setSelectedTechnique] = useState<MitreAttackTechnique | null>(null);
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);

  // Combine provided techniques with additional ones
  const allTechniques = [...techniques, ...generateAdditionalTechniques()];

  const getSeverityColor = (severity: MitreAttackTechnique['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white border-red-600';
      case 'high':
        return 'bg-orange-500 text-white border-orange-600';
      case 'medium':
        return 'bg-yellow-500 text-black border-yellow-600';
      case 'low':
        return 'bg-green-500 text-white border-green-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getTacticIcon = (tactic: string) => {
    switch (tactic) {
      case 'Initial Access':
        return <Target className="h-4 w-4" />;
      case 'Execution':
        return <Zap className="h-4 w-4" />;
      case 'Persistence':
        return <Clock className="h-4 w-4" />;
      case 'Privilege Escalation':
        return <Shield className="h-4 w-4" />;
      case 'Defense Evasion':
        return <Eye className="h-4 w-4" />;
      case 'Credential Access':
        return <Target className="h-4 w-4" />;
      case 'Discovery':
        return <Search className="h-4 w-4" />;
      case 'Lateral Movement':
        return <Activity className="h-4 w-4" />;
      case 'Collection':
        return <Filter className="h-4 w-4" />;
      case 'Command and Control':
        return <Activity className="h-4 w-4" />;
      case 'Exfiltration':
        return <ExternalLink className="h-4 w-4" />;
      case 'Impact':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Group techniques by tactic
  const techniquesByTactic = MITRE_TACTICS.reduce((acc, tactic) => {
    acc[tactic] = allTechniques.filter(t => t.tactic === tactic);
    return acc;
  }, {} as Record<string, MitreAttackTechnique[]>);

  // Calculate statistics
  const totalDetections = allTechniques.reduce((sum, t) => sum + t.detectionCount, 0);
  const criticalTechniques = allTechniques.filter(t => t.severity === 'critical').length;
  const activeTactics = Object.keys(techniquesByTactic).filter(tactic => techniquesByTactic[tactic].length > 0).length;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Detections</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalDetections}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {allTechniques.length} techniques
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Critical Techniques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{criticalTechniques}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs text-red-400">
                High priority
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Tactics</CardTitle>
            <Map className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeTactics}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                of {MITRE_TACTICS.length} total
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Coverage</CardTitle>
            <Shield className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.round((activeTactics / MITRE_TACTICS.length) * 100)}%</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs text-green-400">
                Good coverage
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MITRE ATT&CK Matrix */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Map className="h-5 w-5 text-purple-400" />
            MITRE ATT&CK Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MITRE_TACTICS.map((tactic) => (
              <div
                key={tactic}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedTactic === tactic
                    ? 'bg-blue-900/20 border-blue-500/50'
                    : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                }`}
                onClick={() => setSelectedTactic(selectedTactic === tactic ? null : tactic)}
              >
                <div className="flex items-center gap-2 mb-3">
                  {getTacticIcon(tactic)}
                  <h3 className="font-medium text-white text-sm">{tactic}</h3>
                </div>

                <div className="space-y-2">
                  {techniquesByTactic[tactic].slice(0, 3).map((technique) => (
                    <div
                      key={technique.id}
                      className={`p-2 rounded text-xs cursor-pointer transition-colors ${getSeverityColor(technique.severity)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTechnique(technique);
                      }}
                    >
                      <div className="font-medium">{technique.id}</div>
                      <div className="truncate">{technique.name}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span>{technique.detectionCount} detections</span>
                        <span>{formatTimeAgo(technique.lastDetected)}</span>
                      </div>
                    </div>
                  ))}
                  
                  {techniquesByTactic[tactic].length > 3 && (
                    <div className="text-xs text-slate-400 text-center">
                      +{techniquesByTactic[tactic].length - 3} more techniques
                    </div>
                  )}
                  
                  {techniquesByTactic[tactic].length === 0 && (
                    <div className="text-xs text-slate-500 text-center py-2">
                      No detections
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technique Details */}
      {selectedTechnique && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              Technique Details - {selectedTechnique.id}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-white">Basic Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Technique ID:</span>
                  <span className="text-white font-mono">{selectedTechnique.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tactic:</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedTechnique.tactic}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Severity:</span>
                  <Badge className={`${getSeverityColor(selectedTechnique.severity)} text-xs`}>
                    {selectedTechnique.severity}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Detection Count:</span>
                  <span className="text-white">{selectedTechnique.detectionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Detected:</span>
                  <span className="text-white">{selectedTechnique.lastDetected.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Technique Name */}
            <div className="space-y-3">
              <h4 className="font-medium text-white">Technique Name</h4>
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="font-medium text-white">{selectedTechnique.name}</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h4 className="font-medium text-white">Description</h4>
              <p className="text-sm text-slate-300 p-3 bg-slate-700/50 rounded-lg">
                {selectedTechnique.description}
              </p>
            </div>

            {/* Detection Timeline */}
            <div className="space-y-3">
              <h4 className="font-medium text-white">Recent Detections</h4>
              <div className="space-y-2">
                {Array.from({ length: Math.min(5, selectedTechnique.detectionCount) }, (_, i) => {
                  const detectionTime = new Date(selectedTechnique.lastDetected.getTime() - i * 3600000);
                  return (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          selectedTechnique.severity === 'critical' ? 'bg-red-400' :
                          selectedTechnique.severity === 'high' ? 'bg-orange-400' :
                          selectedTechnique.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                        }`} />
                        <span className="text-sm text-white">Detection #{selectedTechnique.detectionCount - i}</span>
                      </div>
                      <span className="text-sm text-slate-400">{detectionTime.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
              <Button className="flex-1">
                <Shield className="h-3 w-3 mr-2" />
                Create Detection Rule
              </Button>
              <Button variant="outline" className="flex-1">
                <Eye className="h-3 w-3 mr-2" />
                View in MITRE
              </Button>
              <Button variant="outline">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tactic Details */}
      {selectedTactic && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              {getTacticIcon(selectedTactic)}
              {selectedTactic} - Detected Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {techniquesByTactic[selectedTactic].map((technique) => (
                <div
                  key={technique.id}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 cursor-pointer hover:border-slate-500 transition-colors"
                  onClick={() => setSelectedTechnique(technique)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-white">{technique.id}</span>
                    <Badge className={`${getSeverityColor(technique.severity)} text-xs`}>
                      {technique.severity}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-white mb-2">{technique.name}</h4>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{technique.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{technique.detectionCount} detections</span>
                    <span className="text-slate-400">{formatTimeAgo(technique.lastDetected)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
