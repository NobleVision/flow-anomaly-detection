'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnomalyDetection } from '@/types';
import { 
  GitBranch, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  Network,
  Zap,
  Clock,
  MapPin,
  Activity,
  Brain,
  Eye,
  Link
} from 'lucide-react';

interface CorrelationPattern {
  id: string;
  name: string;
  description: string;
  anomalies: AnomalyDetection[];
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'temporal' | 'spatial' | 'behavioral' | 'volumetric';
  timeWindow: number; // minutes
  correlationScore: number;
}

interface CorrelationMatrix {
  sourceIp: string;
  targetIp: string;
  correlationStrength: number;
  sharedAnomalies: number;
  timeProximity: number;
  patternSimilarity: number;
}

interface AnomalyCorrelationProps {
  anomalies: AnomalyDetection[];
}

export function AnomalyCorrelation({ anomalies }: AnomalyCorrelationProps) {
  const [selectedPattern, setSelectedPattern] = useState<CorrelationPattern | null>(null);
  const [viewMode, setViewMode] = useState<'patterns' | 'matrix' | 'network'>('patterns');

  // Generate correlation patterns
  const correlationPatterns = useMemo((): CorrelationPattern[] => {
    const patterns: CorrelationPattern[] = [];

    // Group anomalies by various criteria for pattern detection
    const timeGroups = new Map<string, AnomalyDetection[]>();
    const ipGroups = new Map<string, AnomalyDetection[]>();
    const typeGroups = new Map<string, AnomalyDetection[]>();

    anomalies.forEach(anomaly => {
      // Group by 10-minute time windows
      const timeKey = Math.floor(anomaly.timestamp.getTime() / (10 * 60 * 1000)).toString();
      if (!timeGroups.has(timeKey)) timeGroups.set(timeKey, []);
      timeGroups.get(timeKey)!.push(anomaly);

      // Group by source IP
      if (!ipGroups.has(anomaly.sourceIp)) ipGroups.set(anomaly.sourceIp, []);
      ipGroups.get(anomaly.sourceIp)!.push(anomaly);

      // Group by anomaly type
      if (!typeGroups.has(anomaly.type)) typeGroups.set(anomaly.type, []);
      typeGroups.get(anomaly.type)!.push(anomaly);
    });

    // Detect temporal clustering patterns
    timeGroups.forEach((groupAnomalies, timeKey) => {
      if (groupAnomalies.length >= 3) {
        const avgConfidence = groupAnomalies.reduce((sum, a) => sum + a.confidence, 0) / groupAnomalies.length;
        const criticalCount = groupAnomalies.filter(a => a.severity === 'critical').length;
        
        patterns.push({
          id: `temporal-${timeKey}`,
          name: 'Temporal Clustering',
          description: `${groupAnomalies.length} anomalies detected within a 10-minute window`,
          anomalies: groupAnomalies,
          confidence: avgConfidence,
          severity: criticalCount > 0 ? 'critical' : groupAnomalies.length > 5 ? 'high' : 'medium',
          type: 'temporal',
          timeWindow: 10,
          correlationScore: Math.min(0.95, 0.6 + (groupAnomalies.length * 0.05))
        });
      }
    });

    // Detect coordinated attack patterns (same source IP, multiple targets)
    ipGroups.forEach((groupAnomalies, sourceIp) => {
      if (groupAnomalies.length >= 4) {
        const uniqueTargets = new Set(groupAnomalies.map(a => a.destinationIp)).size;
        if (uniqueTargets >= 3) {
          const avgConfidence = groupAnomalies.reduce((sum, a) => sum + a.confidence, 0) / groupAnomalies.length;
          
          patterns.push({
            id: `coordinated-${sourceIp}`,
            name: 'Coordinated Attack',
            description: `${sourceIp} targeting ${uniqueTargets} different hosts`,
            anomalies: groupAnomalies,
            confidence: avgConfidence,
            severity: uniqueTargets > 5 ? 'critical' : 'high',
            type: 'behavioral',
            timeWindow: Math.max(...groupAnomalies.map(a => a.timestamp.getTime())) - 
                       Math.min(...groupAnomalies.map(a => a.timestamp.getTime())),
            correlationScore: Math.min(0.9, 0.5 + (uniqueTargets * 0.05))
          });
        }
      }
    });

    // Detect volumetric attack patterns
    const volumetricAnomalies = anomalies.filter(a => a.type === 'volume');
    if (volumetricAnomalies.length >= 5) {
      const recentVolumetric = volumetricAnomalies.filter(a => 
        Date.now() - a.timestamp.getTime() < 30 * 60 * 1000 // Last 30 minutes
      );
      
      if (recentVolumetric.length >= 3) {
        const avgConfidence = recentVolumetric.reduce((sum, a) => sum + a.confidence, 0) / recentVolumetric.length;
        
        patterns.push({
          id: 'volumetric-surge',
          name: 'Volumetric Attack Pattern',
          description: `${recentVolumetric.length} volume anomalies detected in the last 30 minutes`,
          anomalies: recentVolumetric,
          confidence: avgConfidence,
          severity: recentVolumetric.length > 8 ? 'critical' : 'high',
          type: 'volumetric',
          timeWindow: 30,
          correlationScore: Math.min(0.85, 0.4 + (recentVolumetric.length * 0.04))
        });
      }
    }

    // Detect geographic clustering (mock implementation)
    const geographicGroups = new Map<string, AnomalyDetection[]>();
    anomalies.forEach(anomaly => {
      // Mock geographic grouping based on IP ranges
      const subnet = anomaly.sourceIp.split('.').slice(0, 2).join('.');
      if (!geographicGroups.has(subnet)) geographicGroups.set(subnet, []);
      geographicGroups.get(subnet)!.push(anomaly);
    });

    geographicGroups.forEach((groupAnomalies, subnet) => {
      if (groupAnomalies.length >= 6) {
        const avgConfidence = groupAnomalies.reduce((sum, a) => sum + a.confidence, 0) / groupAnomalies.length;
        
        patterns.push({
          id: `geographic-${subnet}`,
          name: 'Geographic Clustering',
          description: `${groupAnomalies.length} anomalies from ${subnet}.x.x subnet`,
          anomalies: groupAnomalies,
          confidence: avgConfidence,
          severity: groupAnomalies.length > 10 ? 'high' : 'medium',
          type: 'spatial',
          timeWindow: Math.max(...groupAnomalies.map(a => a.timestamp.getTime())) - 
                     Math.min(...groupAnomalies.map(a => a.timestamp.getTime())),
          correlationScore: Math.min(0.8, 0.3 + (groupAnomalies.length * 0.03))
        });
      }
    });

    return patterns.sort((a, b) => b.correlationScore - a.correlationScore);
  }, [anomalies]);

  // Generate correlation matrix
  const correlationMatrix = useMemo((): CorrelationMatrix[] => {
    const matrix: CorrelationMatrix[] = [];
    const ipPairs = new Map<string, { sourceIp: string; targetIp: string; anomalies: AnomalyDetection[] }>();

    // Group anomalies by IP pairs
    anomalies.forEach(anomaly => {
      const key = `${anomaly.sourceIp}-${anomaly.destinationIp}`;
      if (!ipPairs.has(key)) {
        ipPairs.set(key, {
          sourceIp: anomaly.sourceIp,
          targetIp: anomaly.destinationIp,
          anomalies: []
        });
      }
      ipPairs.get(key)!.anomalies.push(anomaly);
    });

    // Calculate correlation metrics for each pair
    ipPairs.forEach(({ sourceIp, targetIp, anomalies: pairAnomalies }) => {
      if (pairAnomalies.length >= 2) {
        // Calculate time proximity (how close in time the anomalies occurred)
        const timestamps = pairAnomalies.map(a => a.timestamp.getTime()).sort();
        const timeSpread = timestamps[timestamps.length - 1] - timestamps[0];
        const timeProximity = Math.max(0, 1 - (timeSpread / (24 * 60 * 60 * 1000))); // Normalize to 24 hours

        // Calculate pattern similarity (based on anomaly types and severities)
        const types = new Set(pairAnomalies.map(a => a.type));
        const severities = new Set(pairAnomalies.map(a => a.severity));
        const patternSimilarity = 1 - ((types.size - 1) * 0.2 + (severities.size - 1) * 0.1);

        // Overall correlation strength
        const correlationStrength = (
          (pairAnomalies.length / 10) * 0.4 + // Volume factor
          timeProximity * 0.3 + // Time factor
          patternSimilarity * 0.3 // Pattern factor
        );

        matrix.push({
          sourceIp,
          targetIp,
          correlationStrength: Math.min(1, correlationStrength),
          sharedAnomalies: pairAnomalies.length,
          timeProximity,
          patternSimilarity
        });
      }
    });

    return matrix.sort((a, b) => b.correlationStrength - a.correlationStrength).slice(0, 20);
  }, [anomalies]);

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'temporal': return <Clock className="w-4 h-4" />;
      case 'spatial': return <MapPin className="w-4 h-4" />;
      case 'behavioral': return <Brain className="w-4 h-4" />;
      case 'volumetric': return <TrendingUp className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getPatternColor = (type: string) => {
    switch (type) {
      case 'temporal': return 'bg-blue-500';
      case 'spatial': return 'bg-green-500';
      case 'behavioral': return 'bg-purple-500';
      case 'volumetric': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Correlation Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-purple-500" />
              Anomaly Correlation Analysis
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'patterns' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('patterns')}
              >
                Patterns
              </Button>
              <Button
                variant={viewMode === 'matrix' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('matrix')}
              >
                Matrix
              </Button>
              <Button
                variant={viewMode === 'network' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('network')}
              >
                Network
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{correlationPatterns.length}</div>
              <div className="text-sm text-muted-foreground">Detected Patterns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{correlationMatrix.length}</div>
              <div className="text-sm text-muted-foreground">IP Correlations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {correlationPatterns.filter(p => p.severity === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">Critical Patterns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {correlationPatterns.length > 0 ? 
                  (correlationPatterns.reduce((sum, p) => sum + p.correlationScore, 0) / correlationPatterns.length * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pattern Detection View */}
      {viewMode === 'patterns' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {correlationPatterns.map((pattern) => (
            <Card 
              key={pattern.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedPattern?.id === pattern.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedPattern(selectedPattern?.id === pattern.id ? null : pattern)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getPatternColor(pattern.type)}`}>
                      {getPatternIcon(pattern.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{pattern.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {pattern.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getSeverityColor(pattern.severity)}`}>
                      {pattern.severity.toUpperCase()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {(pattern.correlationScore * 100).toFixed(1)}% confidence
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{pattern.description}</p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-500">{pattern.anomalies.length}</div>
                    <div className="text-xs text-muted-foreground">Anomalies</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-500">
                      {typeof pattern.timeWindow === 'number' ? 
                        pattern.timeWindow < 60 ? `${pattern.timeWindow}m` : 
                        `${Math.round(pattern.timeWindow / 60)}h` : 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground">Time Window</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-500">
                      {(pattern.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Confidence</div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedPattern?.id === pattern.id && (
                  <div className="pt-4 border-t border-border space-y-3">
                    <h4 className="font-medium">Pattern Details</h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Affected IPs:</strong>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Array.from(new Set([
                            ...pattern.anomalies.map(a => a.sourceIp),
                            ...pattern.anomalies.map(a => a.destinationIp)
                          ])).slice(0, 6).map(ip => (
                            <Badge key={ip} variant="outline" className="text-xs">{ip}</Badge>
                          ))}
                          {Array.from(new Set([
                            ...pattern.anomalies.map(a => a.sourceIp),
                            ...pattern.anomalies.map(a => a.destinationIp)
                          ])).length > 6 && (
                            <Badge variant="outline" className="text-xs">
                              +{Array.from(new Set([
                                ...pattern.anomalies.map(a => a.sourceIp),
                                ...pattern.anomalies.map(a => a.destinationIp)
                              ])).length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm">
                        <strong>Anomaly Types:</strong>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Array.from(new Set(pattern.anomalies.map(a => a.type))).map(type => (
                            <Badge key={type} variant="secondary" className="text-xs capitalize">{type}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Correlation Matrix View */}
      {viewMode === 'matrix' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              IP Correlation Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {correlationMatrix.map((correlation, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {correlation.sourceIp}
                      </Badge>
                      <Link className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="outline" className="font-mono text-xs">
                        {correlation.targetIp}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">{correlation.sharedAnomalies}</div>
                      <div className="text-xs text-muted-foreground">Anomalies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{(correlation.timeProximity * 100).toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Time Proximity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{(correlation.patternSimilarity * 100).toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Pattern Similarity</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${
                        correlation.correlationStrength > 0.7 ? 'text-red-500' :
                        correlation.correlationStrength > 0.5 ? 'text-orange-500' :
                        correlation.correlationStrength > 0.3 ? 'text-yellow-500' : 'text-blue-500'
                      }`}>
                        {(correlation.correlationStrength * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Correlation</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network View - Placeholder for future implementation */}
      {viewMode === 'network' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5 text-green-500" />
              Network Correlation Graph
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Interactive network correlation graph coming soon...</p>
                <p className="text-sm mt-2">Will visualize IP relationships and anomaly flows</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
