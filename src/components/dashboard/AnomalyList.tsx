'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnomalyDetection } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Clock, 
  MapPin,
  Zap,
  Eye,
  MoreHorizontal
} from 'lucide-react';

interface AnomalyListProps {
  anomalies: AnomalyDetection[];
}

export function AnomalyList({ anomalies }: AnomalyListProps) {
  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'volume': return TrendingUp;
      case 'pattern': return Shield;
      case 'protocol': return Zap;
      case 'geographic': return MapPin;
      case 'temporal': return Clock;
      default: return AlertTriangle;
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-500';
    if (confidence >= 0.7) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold">
          Recent Anomalies
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          {anomalies.length} detected
        </Badge>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        {anomalies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Shield className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-sm font-medium text-foreground mb-1">
              No Anomalies Detected
            </h3>
            <p className="text-xs text-muted-foreground">
              Your network is operating normally
            </p>
          </div>
        ) : (
          <div className="space-y-0 overflow-y-auto h-full">
            {anomalies.map((anomaly, index) => {
              const IconComponent = getAnomalyIcon(anomaly.type);
              
              return (
                <div 
                  key={anomaly.id}
                  className={`p-4 border-b border-border/50 hover:bg-muted/50 transition-colors ${
                    index === 0 ? 'bg-muted/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between space-x-3">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg ${
                        anomaly.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                        anomaly.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                        anomaly.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge 
                            variant={getSeverityBadgeVariant(anomaly.severity)}
                            className="text-xs"
                          >
                            {anomaly.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {anomaly.type}
                          </Badge>
                        </div>
                        
                        <h4 className="text-sm font-medium text-foreground mb-1 truncate">
                          {anomaly.description}
                        </h4>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Source: {anomaly.sourceIp}</span>
                            <span>Dest: {anomaly.destinationIp}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className={getConfidenceColor(anomaly.confidence)}>
                              {(anomaly.confidence * 100).toFixed(1)}% confidence
                            </span>
                            <span className="text-muted-foreground">
                              {formatRelativeTime(anomaly.detectedAt)}
                            </span>
                          </div>
                        </div>
                        
                        {/* ML Model Info */}
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Model: {anomaly.mlModel.name}
                            </span>
                            <span className="text-muted-foreground">
                              v{anomaly.mlModel.version}
                            </span>
                          </div>
                          <div className="mt-1 w-full bg-background rounded-full h-1">
                            <div 
                              className="h-1 bg-primary rounded-full"
                              style={{ width: `${anomaly.mlModel.accuracy * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col space-y-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  {anomaly.metrics && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted/30 rounded p-2">
                        <div className="text-muted-foreground">Expected</div>
                        <div className="font-medium">
                          {anomaly.metrics.expectedValue?.toFixed(2) || 'N/A'}
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded p-2">
                        <div className="text-muted-foreground">Actual</div>
                        <div className="font-medium text-orange-500">
                          {anomaly.metrics.actualValue.toFixed(2)}
                        </div>
                      </div>
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
