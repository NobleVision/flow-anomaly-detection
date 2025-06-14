'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alarm } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User,
  MessageSquare,
  ArrowUp,
  X
} from 'lucide-react';

interface AlarmPanelProps {
  alarms: Alarm[];
}

export function AlarmPanel({ alarms }: AlarmPanelProps) {
  const [selectedAlarm, setSelectedAlarm] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return Bell;
      case 'acknowledged': return Clock;
      case 'investigating': return User;
      case 'resolved': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-500';
      case 'acknowledged': return 'text-yellow-500';
      case 'investigating': return 'text-blue-500';
      case 'resolved': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'danger';
      case 'acknowledged': return 'warning';
      case 'investigating': return 'info';
      case 'resolved': return 'success';
      default: return 'secondary';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleAcknowledge = (alarmId: string) => {
    // In a real app, this would update the alarm status
    console.log('Acknowledging alarm:', alarmId);
  };

  const handleEscalate = (alarmId: string) => {
    // In a real app, this would escalate the alarm
    console.log('Escalating alarm:', alarmId);
  };

  const handleResolve = (alarmId: string) => {
    // In a real app, this would resolve the alarm
    console.log('Resolving alarm:', alarmId);
  };

  const openAlarms = alarms.filter(alarm => alarm.status === 'open');
  const acknowledgedAlarms = alarms.filter(alarm => alarm.status === 'acknowledged');
  const investigatingAlarms = alarms.filter(alarm => alarm.status === 'investigating');

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Active Alarms</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          {openAlarms.length > 0 && (
            <Badge variant="danger" className="animate-pulse">
              {openAlarms.length} Open
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {alarms.length} Total
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        {alarms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
            <h3 className="text-sm font-medium text-foreground mb-1">
              No Active Alarms
            </h3>
            <p className="text-xs text-muted-foreground">
              All systems are operating normally
            </p>
          </div>
        ) : (
          <div className="space-y-0 overflow-y-auto h-full">
            {alarms.map((alarm, index) => {
              const StatusIcon = getStatusIcon(alarm.status);
              const isSelected = selectedAlarm === alarm.id;
              
              return (
                <div 
                  key={alarm.id}
                  className={`p-4 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer ${
                    isSelected ? 'bg-muted/50' : ''
                  } ${alarm.status === 'open' && index === 0 ? 'bg-red-500/5' : ''}`}
                  onClick={() => setSelectedAlarm(isSelected ? null : alarm.id)}
                >
                  <div className="flex items-start justify-between space-x-3">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      {/* Status Icon */}
                      <div className={`p-2 rounded-lg ${
                        alarm.status === 'open' ? 'bg-red-500/20' :
                        alarm.status === 'acknowledged' ? 'bg-yellow-500/20' :
                        alarm.status === 'investigating' ? 'bg-blue-500/20' :
                        'bg-green-500/20'
                      }`}>
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(alarm.status)}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge 
                            variant={getSeverityBadgeVariant(alarm.severity)}
                            className="text-xs"
                          >
                            {alarm.severity.toUpperCase()}
                          </Badge>
                          <Badge 
                            variant={getStatusBadgeVariant(alarm.status)}
                            className="text-xs"
                          >
                            {alarm.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <h4 className="text-sm font-medium text-foreground mb-1 truncate">
                          {alarm.title}
                        </h4>
                        
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {alarm.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatRelativeTime(alarm.createdAt)}</span>
                          {alarm.assignedTo && (
                            <span className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{alarm.assignedTo}</span>
                            </span>
                          )}
                        </div>
                        
                        {/* Tags */}
                        {alarm.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {alarm.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                            {alarm.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                +{alarm.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Actions */}
                  {isSelected && (
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <div className="flex flex-wrap gap-2">
                        {alarm.status === 'open' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcknowledge(alarm.id);
                            }}
                            className="text-xs"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledge
                          </Button>
                        )}
                        
                        {(alarm.status === 'open' || alarm.status === 'acknowledged') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEscalate(alarm.id);
                            }}
                            className="text-xs"
                          >
                            <ArrowUp className="h-3 w-3 mr-1" />
                            Escalate
                          </Button>
                        )}
                        
                        {alarm.status !== 'resolved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolve(alarm.id);
                            }}
                            className="text-xs"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Resolve
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Comment
                        </Button>
                      </div>
                      
                      {/* Actions History */}
                      {alarm.actions.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">Recent Actions:</div>
                          {alarm.actions.slice(0, 2).map((action, actionIndex) => (
                            <div key={actionIndex} className="text-xs text-muted-foreground flex items-center space-x-2">
                              <span className="font-medium">{action.user}</span>
                              <span>{action.type}</span>
                              <span>{formatRelativeTime(action.timestamp)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
