'use client';

import { useState } from 'react';
import { SecurityEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Shield,
  Eye,
  Clock,
  User,
  MapPin,
  Activity,
  FileText,
  ExternalLink,
  Filter,
  Search,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SecurityEventsProps {
  events: SecurityEvent[];
}

export function SecurityEvents({ events }: SecurityEventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(events[0] || null);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getEventIcon = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'intrusion':
        return <Shield className="h-4 w-4 text-red-400" />;
      case 'malware':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'data_exfiltration':
        return <Activity className="h-4 w-4 text-purple-400" />;
      case 'lateral_movement':
        return <MapPin className="h-4 w-4 text-blue-400" />;
      case 'privilege_escalation':
        return <User className="h-4 w-4 text-yellow-400" />;
      case 'reconnaissance':
        return <Eye className="h-4 w-4 text-cyan-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
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

  const getStatusColor = (status: SecurityEvent['status']) => {
    switch (status) {
      case 'open':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'investigating':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'resolved':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'false_positive':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const filteredEvents = events.filter(event => {
    if (filterSeverity !== 'all' && event.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && event.status !== filterStatus) return false;
    return true;
  });

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

  return (
    <div className="space-y-8">
      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-400" />
            Event Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">Severity:</span>
              <select 
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
              >
                <option value="all">All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">Status:</span>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="false_positive">False Positive</option>
              </select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm">
                <Search className="h-3 w-3 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-3 w-3 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Events List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Security Events ({filteredEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedEvent?.id === event.id
                      ? 'bg-blue-900/20 border-blue-500/50'
                      : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getEventIcon(event.type)}
                      <div>
                        <h3 className="font-medium text-white">{event.type.replace('_', ' ').toUpperCase()}</h3>
                        <p className="text-sm text-slate-400">{formatTimeAgo(event.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getSeverityColor(event.severity)} border text-xs`}>
                        {event.severity}
                      </Badge>
                      <Badge className={`${getStatusColor(event.status)} border text-xs`}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-3">{event.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">Source:</span>
                      <div className="font-medium text-white">{event.source}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Destination:</span>
                      <div className="font-medium text-white">{event.destination}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Risk Score:</span>
                      <div className="font-medium text-white">{event.riskScore}/100</div>
                    </div>
                    <div>
                      <span className="text-slate-400">MITRE ID:</span>
                      <div className="font-medium text-white">{event.mitreId || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEventExpansion(event.id);
                      }}
                      className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                    >
                      {expandedEvents.has(event.id) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                      {expandedEvents.has(event.id) ? 'Hide Details' : 'Show Details'}
                    </button>

                    {expandedEvents.has(event.id) && (
                      <div className="mt-3 space-y-2">
                        {event.mitreTactics.length > 0 && (
                          <div>
                            <span className="text-xs text-slate-400">MITRE Tactics:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {event.mitreTactics.map((tactic, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tactic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {event.relatedEvents.length > 0 && (
                          <div>
                            <span className="text-xs text-slate-400">Related Events:</span>
                            <div className="text-xs text-white mt-1">
                              {event.relatedEvents.length} related event(s)
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        {selectedEvent && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                Event Details - {selectedEvent.id}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Basic Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Event Type:</span>
                    <span className="text-white">{selectedEvent.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Severity:</span>
                    <Badge className={`${getSeverityColor(selectedEvent.severity)} border text-xs`}>
                      {selectedEvent.severity}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <Badge className={`${getStatusColor(selectedEvent.status)} border text-xs`}>
                      {selectedEvent.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Score:</span>
                    <span className="text-white">{selectedEvent.riskScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Timestamp:</span>
                    <span className="text-white">{selectedEvent.timestamp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned To:</span>
                    <span className="text-white">{selectedEvent.assignedTo || 'Unassigned'}</span>
                  </div>
                </div>
              </div>

              {/* Network Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Network Information</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Source</div>
                    <div className="font-medium text-white">{selectedEvent.source}</div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Destination</div>
                    <div className="font-medium text-white">{selectedEvent.destination}</div>
                  </div>
                </div>
              </div>

              {/* MITRE ATT&CK Information */}
              {selectedEvent.mitreTactics.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-white">MITRE ATT&CK Framework</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Technique ID:</span>
                      <span className="text-white">{selectedEvent.mitreId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Tactics:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedEvent.mitreTactics.map((tactic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tactic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Description</h4>
                <p className="text-sm text-slate-300 p-3 bg-slate-700/50 rounded-lg">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Evidence */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Evidence</h4>
                <div className="text-sm text-slate-400">
                  {selectedEvent.evidence.length} piece(s) of evidence collected
                </div>
              </div>

              {/* Related Events */}
              {selectedEvent.relatedEvents.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Related Events</h4>
                  <div className="space-y-2">
                    {selectedEvent.relatedEvents.map((relatedId, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                        <span className="text-sm text-white">{relatedId}</span>
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
                  <User className="h-3 w-3 mr-2" />
                  Assign to Me
                </Button>
                <Button variant="outline" className="flex-1">
                  <Clock className="h-3 w-3 mr-2" />
                  Update Status
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
