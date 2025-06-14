'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnomalyDetection } from '@/types';
import {
  Search,
  Filter,
  Eye,
  AlertTriangle,
  MapPin,
  Activity,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Brain,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';

interface AnomalyListProps {
  anomalies: AnomalyDetection[];
  onAnomalySelect: (anomaly: AnomalyDetection) => void;
  selectedAnomaly: AnomalyDetection | null;
}

interface EnhancedSeverityScore {
  baseScore: number;
  confidenceMultiplier: number;
  contextualFactors: {
    volumeImpact: number;
    temporalUrgency: number;
    geographicRisk: number;
    behavioralDeviation: number;
  };
  finalScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  explanation: string;
}

export function AnomalyList({ anomalies, onAnomalySelect, selectedAnomaly }: AnomalyListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'detectedAt' | 'severity' | 'confidence' | 'risk'>('detectedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Enhanced severity scoring algorithm
  const calculateEnhancedSeverity = (anomaly: AnomalyDetection): EnhancedSeverityScore => {
    // Base severity scores
    const baseSeverityScores = {
      'critical': 90,
      'high': 70,
      'medium': 50,
      'low': 30
    };

    const baseScore = baseSeverityScores[anomaly.severity] || 30;
    
    // Confidence multiplier (0.8 to 1.2)
    const confidenceMultiplier = 0.8 + (anomaly.confidence * 0.4);

    // Contextual factors
    const contextualFactors = {
      // Volume impact based on anomaly type
      volumeImpact: anomaly.type === 'volume' ? 1.3 : 
                   anomaly.type === 'pattern' ? 1.1 : 1.0,
      
      // Temporal urgency (recent anomalies are more urgent)
      temporalUrgency: Math.max(0.8, 1.2 - ((Date.now() - anomaly.detectedAt.getTime()) / (24 * 60 * 60 * 1000))),
      
      // Geographic risk (mock implementation based on IP ranges)
      geographicRisk: anomaly.sourceIp.startsWith('192.168.') ? 0.9 : // Internal
                     anomaly.sourceIp.startsWith('10.') ? 0.9 : // Internal
                     1.2, // External
      
      // Behavioral deviation
      behavioralDeviation: anomaly.type === 'pattern' ? 1.2 :
                          anomaly.type === 'geographic' ? 1.1 : 1.0
    };

    // Calculate final score
    const contextMultiplier = Object.values(contextualFactors).reduce((acc, val) => acc * val, 1);
    const finalScore = Math.min(100, baseScore * confidenceMultiplier * contextMultiplier);

    // Determine risk level based on final score
    let riskLevel: 'critical' | 'high' | 'medium' | 'low';
    if (finalScore >= 85) riskLevel = 'critical';
    else if (finalScore >= 65) riskLevel = 'high';
    else if (finalScore >= 40) riskLevel = 'medium';
    else riskLevel = 'low';

    // Generate explanation
    const factors = [];
    if (contextualFactors.volumeImpact > 1.1) factors.push('high volume impact');
    if (contextualFactors.temporalUrgency > 1.1) factors.push('recent occurrence');
    if (contextualFactors.geographicRisk > 1.1) factors.push('external source');
    if (contextualFactors.behavioralDeviation > 1.1) factors.push('behavioral anomaly');
    if (anomaly.confidence > 0.8) factors.push('high confidence');

    const explanation = factors.length > 0 ? 
      `Elevated due to: ${factors.join(', ')}` : 
      'Standard risk assessment';

    return {
      baseScore,
      confidenceMultiplier,
      contextualFactors,
      finalScore,
      riskLevel,
      explanation
    };
  };

  // Filter and sort anomalies
  const filteredAndSortedAnomalies = useMemo(() => {
    const filtered = anomalies.filter(anomaly => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          anomaly.sourceIp.toLowerCase().includes(searchLower) ||
          anomaly.destinationIp.toLowerCase().includes(searchLower) ||
          anomaly.type.toLowerCase().includes(searchLower) ||
          anomaly.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Severity filter
      if (severityFilter !== 'all' && anomaly.severity !== severityFilter) return false;

      // Type filter
      if (typeFilter !== 'all' && anomaly.type !== typeFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && anomaly.status !== statusFilter) return false;

      return true;
    });

    // Sort anomalies
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'detectedAt':
          comparison = a.detectedAt.getTime() - b.detectedAt.getTime();
          break;
        case 'severity':
          const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          comparison = severityOrder[a.severity] - severityOrder[b.severity];
          break;
        case 'confidence':
          comparison = a.confidence - b.confidence;
          break;
        case 'risk':
          const aRisk = calculateEnhancedSeverity(a).finalScore;
          const bRisk = calculateEnhancedSeverity(b).finalScore;
          comparison = aRisk - bRisk;
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [anomalies, searchTerm, severityFilter, typeFilter, statusFilter, sortBy, sortOrder]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Shield className="w-4 h-4 text-blue-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'volume': return <TrendingUp className="w-4 h-4" />;
      case 'pattern': return <Brain className="w-4 h-4" />;
      case 'protocol': return <Activity className="w-4 h-4" />;
      case 'geographic': return <MapPin className="w-4 h-4" />;
      case 'temporal': return <Target className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'investigating': return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return timestamp.toLocaleDateString();
  };

  const uniqueTypes = Array.from(new Set(anomalies.map(a => a.type)));
  const uniqueSeverities = Array.from(new Set(anomalies.map(a => a.severity)));
  const uniqueStatuses = Array.from(new Set(anomalies.map(a => a.status)));

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-500" />
            Anomaly Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by IP, type, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                {uniqueSeverities.map(severity => (
                  <SelectItem key={severity} value={severity}>
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [newSortBy, newSortOrder] = value.split('-') as [typeof sortBy, typeof sortOrder];
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="detectedAt-desc">Newest First</SelectItem>
                <SelectItem value="detectedAt-asc">Oldest First</SelectItem>
                <SelectItem value="severity-desc">Highest Severity</SelectItem>
                <SelectItem value="severity-asc">Lowest Severity</SelectItem>
                <SelectItem value="confidence-desc">Highest Confidence</SelectItem>
                <SelectItem value="confidence-asc">Lowest Confidence</SelectItem>
                <SelectItem value="risk-desc">Highest Risk</SelectItem>
                <SelectItem value="risk-asc">Lowest Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Summary */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredAndSortedAnomalies.length} of {anomalies.length} anomalies</span>
            {(searchTerm || severityFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSeverityFilter('all');
                  setTypeFilter('all');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Anomaly List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Detected Anomalies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAndSortedAnomalies.map((anomaly) => {
              const enhancedSeverity = calculateEnhancedSeverity(anomaly);
              const isSelected = selectedAnomaly?.id === anomaly.id;

              return (
                <div
                  key={anomaly.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onAnomalySelect(anomaly)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(anomaly.severity)}
                        <div className="flex items-center gap-2">
                          <Badge variant={anomaly.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {anomaly.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getTypeIcon(anomaly.type)}
                            {anomaly.type}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getStatusIcon(anomaly.status)}
                            {anomaly.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground">{anomaly.description}</p>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Source:</span>
                          <span className="ml-2 font-mono">{anomaly.sourceIp}</span>
                        </div>
                        <div>
                          <span className="font-medium">Destination:</span>
                          <span className="ml-2 font-mono">{anomaly.destinationIp}</span>
                        </div>
                        <div>
                          <span className="font-medium">Time:</span>
                          <span className="ml-2">{formatTimestamp(anomaly.detectedAt)}</span>
                        </div>
                      </div>

                      {/* Enhanced Severity Score */}
                      <div className="flex items-center gap-4 pt-2 border-t border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Risk Score:</span>
                          <Badge variant={enhancedSeverity.riskLevel === 'critical' ? 'destructive' : 'secondary'}>
                            {enhancedSeverity.finalScore.toFixed(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Confidence:</span>
                          <span className="text-sm">{(anomaly.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex-1 text-xs text-muted-foreground">
                          {enhancedSeverity.explanation}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAndSortedAnomalies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No anomalies match the current filters</p>
                <p className="text-sm mt-2">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
