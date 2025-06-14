'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnomalyDetection } from '@/types';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye
} from 'lucide-react';

interface TimelineDataPoint {
  timestamp: Date;
  count: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  types: Record<string, number>;
}

interface AnomalyTimelineProps {
  anomalies: AnomalyDetection[];
}

export function AnomalyTimeline({ anomalies }: AnomalyTimelineProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimelineDataPoint | null>(null);
  const [viewType, setViewType] = useState<'hourly' | 'daily' | 'weekly'>('hourly');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');

  // Generate timeline data based on view type
  const timelineData = useMemo((): TimelineDataPoint[] => {
    const now = new Date();
    const data: TimelineDataPoint[] = [];
    
    // Determine the number of periods and interval based on view type
    const config = {
      hourly: { periods: 24, intervalMs: 60 * 60 * 1000 },
      daily: { periods: 30, intervalMs: 24 * 60 * 60 * 1000 },
      weekly: { periods: 12, intervalMs: 7 * 24 * 60 * 60 * 1000 }
    }[viewType];

    // Create time buckets
    for (let i = config.periods - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * config.intervalMs);
      const bucketStart = new Date(timestamp.getTime() - config.intervalMs / 2);
      const bucketEnd = new Date(timestamp.getTime() + config.intervalMs / 2);

      // Filter anomalies in this time bucket
      const bucketAnomalies = anomalies.filter(a =>
        a.detectedAt >= bucketStart && a.detectedAt < bucketEnd
      );

      // Count by severity
      const critical = bucketAnomalies.filter(a => a.severity === 'critical').length;
      const high = bucketAnomalies.filter(a => a.severity === 'high').length;
      const medium = bucketAnomalies.filter(a => a.severity === 'medium').length;
      const low = bucketAnomalies.filter(a => a.severity === 'low').length;

      // Count by type
      const types: Record<string, number> = {};
      bucketAnomalies.forEach(a => {
        types[a.type] = (types[a.type] || 0) + 1;
      });

      data.push({
        timestamp,
        count: bucketAnomalies.length,
        critical,
        high,
        medium,
        low,
        types
      });
    }

    return data;
  }, [anomalies, viewType]);

  // Calculate trends and statistics
  const statistics = useMemo(() => {
    const totalAnomalies = timelineData.reduce((sum, d) => sum + d.count, 0);
    const avgPerPeriod = totalAnomalies / timelineData.length;
    
    // Calculate trend (comparing first half vs second half)
    const midpoint = Math.floor(timelineData.length / 2);
    const firstHalf = timelineData.slice(0, midpoint);
    const secondHalf = timelineData.slice(midpoint);
    
    const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.count, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.count, 0) / secondHalf.length;
    
    const trendPercentage = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    const isIncreasing = trendPercentage > 5;
    const isDecreasing = trendPercentage < -5;

    // Find peak period
    const peakPeriod = timelineData.reduce((max, current) => 
      current.count > max.count ? current : max, timelineData[0]
    );

    // Most common anomaly type
    const allTypes: Record<string, number> = {};
    timelineData.forEach(d => {
      Object.entries(d.types).forEach(([type, count]) => {
        allTypes[type] = (allTypes[type] || 0) + count;
      });
    });
    
    const mostCommonType = Object.entries(allTypes).reduce((max, [type, count]) => 
      count > max.count ? { type, count } : max, { type: '', count: 0 }
    );

    return {
      totalAnomalies,
      avgPerPeriod,
      trendPercentage,
      isIncreasing,
      isDecreasing,
      peakPeriod,
      mostCommonType
    };
  }, [timelineData]);

  const formatTimestamp = (timestamp: Date) => {
    switch (viewType) {
      case 'hourly':
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case 'daily':
        return timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case 'weekly':
        return `Week of ${timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
      default:
        return timestamp.toLocaleString();
    }
  };



  const maxCount = Math.max(...timelineData.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Timeline Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Anomaly Timeline Analysis
            </CardTitle>
            <div className="flex gap-2">
              <Select value={viewType} onValueChange={(value: 'hourly' | 'daily' | 'weekly') => setViewType(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={chartType} onValueChange={(value: 'bar' | 'line' | 'area') => setChartType(value)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Timeline Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{statistics.totalAnomalies}</div>
              <div className="text-sm text-muted-foreground">Total Anomalies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{statistics.avgPerPeriod.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg per {viewType.slice(0, -2)}</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                statistics.isIncreasing ? 'text-red-500' : 
                statistics.isDecreasing ? 'text-green-500' : 'text-gray-500'
              }`}>
                {statistics.isIncreasing ? <TrendingUp className="w-5 h-5" /> : 
                 statistics.isDecreasing ? <TrendingDown className="w-5 h-5" /> : 
                 <Activity className="w-5 h-5" />}
                {Math.abs(statistics.trendPercentage).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Trend</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{statistics.peakPeriod.count}</div>
              <div className="text-sm text-muted-foreground">Peak Period</div>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="relative h-64 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 rounded-lg p-4">
            <div className="flex items-end justify-between h-full gap-1">
              {timelineData.map((dataPoint, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center cursor-pointer group"
                  onClick={() => setSelectedPeriod(selectedPeriod?.timestamp === dataPoint.timestamp ? null : dataPoint)}
                >
                  {/* Stacked Bar Chart */}
                  <div className="relative w-full max-w-8 flex flex-col justify-end h-full">
                    {dataPoint.count > 0 && (
                      <div className="relative w-full rounded-t-sm overflow-hidden">
                        {/* Critical */}
                        {dataPoint.critical > 0 && (
                          <div
                            className="w-full bg-red-500 transition-all duration-200 group-hover:brightness-110"
                            style={{ height: `${(dataPoint.critical / maxCount) * 100}%` }}
                          />
                        )}
                        {/* High */}
                        {dataPoint.high > 0 && (
                          <div
                            className="w-full bg-orange-500 transition-all duration-200 group-hover:brightness-110"
                            style={{ height: `${(dataPoint.high / maxCount) * 100}%` }}
                          />
                        )}
                        {/* Medium */}
                        {dataPoint.medium > 0 && (
                          <div
                            className="w-full bg-yellow-500 transition-all duration-200 group-hover:brightness-110"
                            style={{ height: `${(dataPoint.medium / maxCount) * 100}%` }}
                          />
                        )}
                        {/* Low */}
                        {dataPoint.low > 0 && (
                          <div
                            className="w-full bg-blue-500 transition-all duration-200 group-hover:brightness-110"
                            style={{ height: `${(dataPoint.low / maxCount) * 100}%` }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Time Label */}
                  <div className="text-xs text-muted-foreground mt-2 transform -rotate-45 origin-left">
                    {formatTimestamp(dataPoint.timestamp)}
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                    <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {dataPoint.count} anomalies
                      <br />
                      {formatTimestamp(dataPoint.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-xs">Critical</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-xs">High</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs">Low</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Period Details */}
      {selectedPeriod && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-500" />
              Period Details: {formatTimestamp(selectedPeriod.timestamp)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Severity Breakdown */}
              <div>
                <h4 className="font-medium mb-3">Severity Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Critical</span>
                    </div>
                    <Badge variant="destructive">{selectedPeriod.critical}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>High</span>
                    </div>
                    <Badge variant="secondary">{selectedPeriod.high}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>Medium</span>
                    </div>
                    <Badge variant="outline">{selectedPeriod.medium}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Low</span>
                    </div>
                    <Badge variant="outline">{selectedPeriod.low}</Badge>
                  </div>
                </div>
              </div>

              {/* Type Breakdown */}
              <div>
                <h4 className="font-medium mb-3">Anomaly Types</h4>
                <div className="space-y-2">
                  {Object.entries(selectedPeriod.types).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="capitalize">{type}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                  {Object.keys(selectedPeriod.types).length === 0 && (
                    <div className="text-sm text-muted-foreground">No anomalies in this period</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
