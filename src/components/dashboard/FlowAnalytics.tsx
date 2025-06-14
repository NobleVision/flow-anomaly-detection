'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { DashboardMetrics } from '@/types';
import { formatNumber } from '@/lib/utils';
import {
  TrendingUp,
  Activity,
  Zap,
  Shield
} from 'lucide-react';

interface FlowAnalyticsProps {
  metrics: DashboardMetrics;
}

export function FlowAnalytics({ metrics }: FlowAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Flow Analytics Summary */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Flow Analytics Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{formatNumber(metrics.totalFlows)}</div>
              <div className="text-sm text-muted-foreground">Total Flows</div>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{metrics.networkHealth}%</div>
              <div className="text-sm text-muted-foreground">Network Health</div>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{metrics.throughput.current.toFixed(1)} Mbps</div>
              <div className="text-sm text-muted-foreground">Current Throughput</div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
