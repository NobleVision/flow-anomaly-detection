'use client';

import { useState } from 'react';
import { BehavioralProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import {
  Brain,
  User,
  Monitor,
  Globe,
  Clock,
  TrendingUp,
  AlertTriangle,
  Activity,
  Target,
  Eye
} from 'lucide-react';

interface BehavioralAnalysisProps {
  profiles: BehavioralProfile[];
}

export function BehavioralAnalysis({ profiles }: BehavioralAnalysisProps) {
  const [selectedProfile, setSelectedProfile] = useState<BehavioralProfile | null>(profiles[0] || null);

  const getEntityIcon = (entityType: BehavioralProfile['entityType']) => {
    switch (entityType) {
      case 'user':
        return <User className="h-4 w-4 text-blue-400" />;
      case 'device':
        return <Monitor className="h-4 w-4 text-green-400" />;
      case 'application':
        return <Activity className="h-4 w-4 text-purple-400" />;
      case 'network_segment':
        return <Globe className="h-4 w-4 text-cyan-400" />;
      default:
        return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const getProfileTypeColor = (profileType: BehavioralProfile['profileType']) => {
    switch (profileType) {
      case 'baseline':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'anomaly':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'threat':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getRiskScoreColor = (riskScore: number) => {
    if (riskScore >= 80) return 'text-red-400';
    if (riskScore >= 60) return 'text-orange-400';
    if (riskScore >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  // Generate behavioral radar chart data
  const generateRadarData = (profile: BehavioralProfile) => {
    return [
      {
        metric: 'Traffic Volume',
        value: Math.min(100, (profile.metrics.trafficVolume.average / 10000000) * 100),
        fullMark: 100
      },
      {
        metric: 'Unique Destinations',
        value: Math.min(100, (profile.metrics.connectionPatterns.uniqueDestinations / 500) * 100),
        fullMark: 100
      },
      {
        metric: 'Session Duration',
        value: Math.min(100, (profile.metrics.connectionPatterns.averageSessionDuration / 3600) * 100),
        fullMark: 100
      },
      {
        metric: 'Geographic Spread',
        value: Math.min(100, (profile.metrics.geographicPatterns.countries.length / 10) * 100),
        fullMark: 100
      },
      {
        metric: 'Temporal Consistency',
        value: Math.min(100, (1 - profile.metrics.temporalPatterns.seasonality) * 100),
        fullMark: 100
      },
      {
        metric: 'Protocol Diversity',
        value: Math.min(100, Object.keys(profile.metrics.connectionPatterns.protocolDistribution).length * 20),
        fullMark: 100
      }
    ];
  };

  // Generate activity timeline data
  const generateActivityTimeline = (profile: BehavioralProfile) => {
    return profile.metrics.temporalPatterns.activeHours.map(hour => ({
      hour: `${hour}:00`,
      activity: Math.random() * 100,
      baseline: 50 + Math.random() * 30
    }));
  };

  // Generate protocol distribution data
  const generateProtocolData = (profile: BehavioralProfile) => {
    return Object.entries(profile.metrics.connectionPatterns.protocolDistribution).map(([protocol, percentage]) => ({
      protocol,
      percentage,
      color: protocol === 'HTTP' ? '#3B82F6' : protocol === 'HTTPS' ? '#10B981' : '#8B5CF6'
    }));
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Profiles</CardTitle>
            <Brain className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{profiles.length}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {profiles.filter(p => p.profileType === 'baseline').length} baseline
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Anomalies Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {profiles.reduce((sum, p) => sum + p.anomalies.length, 0)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs text-red-400">
                {profiles.filter(p => p.anomalies.some(a => a.severity === 'high' || a.severity === 'critical')).length} high risk
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Avg Risk Score</CardTitle>
            <Target className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Math.round(profiles.reduce((sum, p) => sum + p.riskScore, 0) / profiles.length)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Moderate risk
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">High Confidence</CardTitle>
            <Eye className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {profiles.filter(p => p.confidence > 0.8).length}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs text-green-400">
                >80% confidence
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profiles List and Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Profiles List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Behavioral Profiles ({profiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedProfile?.id === profile.id
                      ? 'bg-blue-900/20 border-blue-500/50'
                      : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedProfile(profile)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getEntityIcon(profile.entityType)}
                      <div>
                        <h3 className="font-medium text-white">{profile.entityName}</h3>
                        <p className="text-sm text-slate-400">{profile.entityType.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getProfileTypeColor(profile.profileType)} border text-xs`}>
                        {profile.profileType}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-slate-400">Risk Score:</span>
                      <div className={`font-medium ${getRiskScoreColor(profile.riskScore)}`}>
                        {profile.riskScore}/100
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Confidence:</span>
                      <div className="font-medium text-white">{(profile.confidence * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Time Window:</span>
                      <div className="font-medium text-white">{profile.timeWindow}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Anomalies:</span>
                      <div className="font-medium text-white">{profile.anomalies.length}</div>
                    </div>
                  </div>

                  {/* Risk Score Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Risk Level</span>
                      <span className={getRiskScoreColor(profile.riskScore)}>{profile.riskScore}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          profile.riskScore >= 80 ? 'bg-red-500' :
                          profile.riskScore >= 60 ? 'bg-orange-500' :
                          profile.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${profile.riskScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Anomalies Preview */}
                  {profile.anomalies.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-600">
                      <div className="text-xs text-slate-400 mb-2">Recent Anomalies:</div>
                      {profile.anomalies.slice(0, 2).map((anomaly, index) => (
                        <div key={index} className="flex items-center gap-2 mb-1">
                          <AlertTriangle className={`h-3 w-3 ${
                            anomaly.severity === 'critical' ? 'text-red-400' :
                            anomaly.severity === 'high' ? 'text-orange-400' :
                            anomaly.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                          }`} />
                          <span className="text-xs text-slate-300">{anomaly.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profile Analysis */}
        {selectedProfile && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Behavioral Analysis - {selectedProfile.entityName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Behavioral Radar Chart */}
              <div>
                <h4 className="font-medium text-white mb-3">Behavioral Profile</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={generateRadarData(selectedProfile)}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]} 
                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      />
                      <Radar
                        name="Profile"
                        dataKey="value"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key Metrics */}
              <div>
                <h4 className="font-medium text-white mb-3">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Avg Traffic Volume</div>
                    <div className="text-lg font-bold text-white">
                      {(selectedProfile.metrics.trafficVolume.average / 1000000).toFixed(1)}MB
                    </div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Unique Destinations</div>
                    <div className="text-lg font-bold text-white">
                      {selectedProfile.metrics.connectionPatterns.uniqueDestinations}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Avg Session Duration</div>
                    <div className="text-lg font-bold text-white">
                      {Math.round(selectedProfile.metrics.connectionPatterns.averageSessionDuration / 60)}m
                    </div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Countries</div>
                    <div className="text-lg font-bold text-white">
                      {selectedProfile.metrics.geographicPatterns.countries.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Protocol Distribution */}
              <div>
                <h4 className="font-medium text-white mb-3">Protocol Distribution</h4>
                <div className="space-y-2">
                  {generateProtocolData(selectedProfile).map((protocol, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{protocol.protocol}</span>
                      <div className="flex items-center gap-2 flex-1 ml-4">
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${protocol.percentage}%`,
                              backgroundColor: protocol.color
                            }}
                          />
                        </div>
                        <span className="text-sm text-white w-12 text-right">{protocol.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Information */}
              <div>
                <h4 className="font-medium text-white mb-3">Geographic Patterns</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Countries:</span>
                    <div className="font-medium text-white">
                      {selectedProfile.metrics.geographicPatterns.countries.join(', ')}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Suspicious Locations:</span>
                    <div className="font-medium text-white">
                      {selectedProfile.metrics.geographicPatterns.suspiciousLocations}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Anomalies Detail */}
      {selectedProfile && selectedProfile.anomalies.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Detected Anomalies - {selectedProfile.entityName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedProfile.anomalies.map((anomaly, index) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`h-5 w-5 ${
                        anomaly.severity === 'critical' ? 'text-red-400' :
                        anomaly.severity === 'high' ? 'text-orange-400' :
                        anomaly.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                      }`} />
                      <div>
                        <h4 className="font-medium text-white">{anomaly.type.replace('_', ' ').toUpperCase()}</h4>
                        <p className="text-sm text-slate-400">{anomaly.timestamp.toLocaleString()}</p>
                      </div>
                    </div>
                    <Badge className={`${
                      anomaly.severity === 'critical' ? 'text-red-400 bg-red-400/10 border-red-400/20' :
                      anomaly.severity === 'high' ? 'text-orange-400 bg-orange-400/10 border-orange-400/20' :
                      anomaly.severity === 'medium' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                      'text-green-400 bg-green-400/10 border-green-400/20'
                    } border text-xs`}>
                      {anomaly.severity}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-300 mb-3">{anomaly.description}</p>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Confidence:</span>
                      <div className="font-medium text-white">{(anomaly.confidence * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Deviation:</span>
                      <div className="font-medium text-white">{anomaly.deviation.toFixed(1)}σ</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Baseline:</span>
                      <div className="font-medium text-white">{anomaly.baseline.toLocaleString()}</div>
                    </div>
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
