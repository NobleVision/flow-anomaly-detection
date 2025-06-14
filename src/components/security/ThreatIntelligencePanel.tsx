'use client';

import { useState } from 'react';
import { ThreatIntelligence } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Globe,
  Hash,
  Link,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Download,
  Upload,
  Search,
  Filter,
  Tag
} from 'lucide-react';

interface ThreatIntelligencePanelProps {
  intelligence: ThreatIntelligence[];
}

export function ThreatIntelligencePanel({ intelligence }: ThreatIntelligencePanelProps) {
  const [selectedIntel, setSelectedIntel] = useState<ThreatIntelligence | null>(intelligence[0] || null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const getTypeIcon = (type: ThreatIntelligence['type']) => {
    switch (type) {
      case 'ip':
        return <Globe className="h-4 w-4 text-blue-400" />;
      case 'domain':
        return <Link className="h-4 w-4 text-green-400" />;
      case 'hash':
        return <Hash className="h-4 w-4 text-purple-400" />;
      case 'url':
        return <ExternalLink className="h-4 w-4 text-cyan-400" />;
      case 'signature':
        return <FileText className="h-4 w-4 text-orange-400" />;
      default:
        return <Eye className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: ThreatIntelligence['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getCategoryColor = (category: ThreatIntelligence['category']) => {
    switch (category) {
      case 'malware':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'botnet':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'phishing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'c2':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'tor':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'proxy':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'scanner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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

  const filteredIntelligence = intelligence.filter(intel => {
    if (filterType !== 'all' && intel.type !== filterType) return false;
    if (filterCategory !== 'all' && intel.category !== filterCategory) return false;
    return true;
  });

  // Generate summary statistics
  const totalIndicators = intelligence.length;
  const activeIndicators = intelligence.filter(i => i.isActive).length;
  const highConfidence = intelligence.filter(i => i.confidence > 0.8).length;
  const recentIndicators = intelligence.filter(i => {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return i.lastSeen > dayAgo;
  }).length;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Indicators</CardTitle>
            <Eye className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalIndicators}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {activeIndicators} active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">High Confidence</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{highConfidence}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs text-green-400">
                {'>'}80% confidence
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{recentIndicators}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Last 24h
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Critical Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {intelligence.filter(i => i.severity === 'critical').length}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs text-red-400">
                Immediate action
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-400" />
            Intelligence Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">Type:</span>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
              >
                <option value="all">All</option>
                <option value="ip">IP Address</option>
                <option value="domain">Domain</option>
                <option value="hash">Hash</option>
                <option value="url">URL</option>
                <option value="signature">Signature</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">Category:</span>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
              >
                <option value="all">All</option>
                <option value="malware">Malware</option>
                <option value="botnet">Botnet</option>
                <option value="phishing">Phishing</option>
                <option value="c2">C2</option>
                <option value="tor">Tor</option>
                <option value="proxy">Proxy</option>
                <option value="scanner">Scanner</option>
              </select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm">
                <Search className="h-3 w-3 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-3 w-3 mr-2" />
                Import IOCs
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intelligence List and Details */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Intelligence List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-400" />
              Threat Intelligence ({filteredIntelligence.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredIntelligence.map((intel) => (
                <div
                  key={intel.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedIntel?.id === intel.id
                      ? 'bg-blue-900/20 border-blue-500/50'
                      : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedIntel(intel)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(intel.type)}
                      <div>
                        <h3 className="font-medium text-white">{intel.value}</h3>
                        <p className="text-sm text-slate-400">{intel.source}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getSeverityColor(intel.severity)} border text-xs`}>
                        {intel.severity}
                      </Badge>
                      {intel.isActive && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-3">{intel.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`${getCategoryColor(intel.category)} border text-xs`}>
                      {intel.category}
                    </Badge>
                    <div className="text-xs text-slate-400">
                      Confidence: {(intel.confidence * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">First Seen:</span>
                      <div className="font-medium text-white">{formatTimeAgo(intel.firstSeen)}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Last Seen:</span>
                      <div className="font-medium text-white">{formatTimeAgo(intel.lastSeen)}</div>
                    </div>
                  </div>

                  {intel.tags.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-600">
                      <div className="flex flex-wrap gap-1">
                        {intel.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {intel.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{intel.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Intelligence Details */}
        {selectedIntel && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                Intelligence Details - {selectedIntel.id}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Basic Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(selectedIntel.type)}
                      <span className="text-white">{selectedIntel.type}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <Badge className={`${getCategoryColor(selectedIntel.category)} border text-xs`}>
                      {selectedIntel.category}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Severity:</span>
                    <Badge className={`${getSeverityColor(selectedIntel.severity)} border text-xs`}>
                      {selectedIntel.severity}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="text-white">{(selectedIntel.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Source:</span>
                    <span className="text-white">{selectedIntel.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <div className="flex items-center gap-1">
                      {selectedIntel.isActive ? (
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      ) : (
                        <Clock className="h-3 w-3 text-gray-400" />
                      )}
                      <span className="text-white">{selectedIntel.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicator Value */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Indicator Value</h4>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="font-mono text-white break-all">{selectedIntel.value}</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Timeline</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">First Seen</div>
                    <div className="font-medium text-white">{selectedIntel.firstSeen.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Last Seen</div>
                    <div className="font-medium text-white">{selectedIntel.lastSeen.toLocaleString()}</div>
                  </div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-xs text-slate-400">TTL (Time to Live)</div>
                  <div className="font-medium text-white">{selectedIntel.ttl} seconds</div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Description</h4>
                <p className="text-sm text-slate-300 p-3 bg-slate-700/50 rounded-lg">
                  {selectedIntel.description}
                </p>
              </div>

              {/* Tags */}
              {selectedIntel.tags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIntel.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              {selectedIntel.references.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-white">References</h4>
                  <div className="space-y-2">
                    {selectedIntel.references.map((ref, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                        <span className="text-sm text-blue-400 truncate">{ref}</span>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
                <Button className="flex-1">
                  <AlertTriangle className="h-3 w-3 mr-2" />
                  Block Indicator
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-3 w-3 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
