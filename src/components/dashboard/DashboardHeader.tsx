'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Square,
  Zap,
  Shield,
  Activity,
  Settings,
  Bell,
  User
} from 'lucide-react';

interface DashboardHeaderProps {
  onStartSimulation?: () => void;
  onStopSimulation?: () => void;
  onStartDDoSDemo?: () => void;
  isSimulating?: boolean;
}

export function DashboardHeader({
  onStartSimulation,
  onStopSimulation,
  onStartDDoSDemo,
  isSimulating = false
}: DashboardHeaderProps) {
  const [notifications] = useState(3);
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { name: 'Overview', path: '/', active: pathname === '/' },
    { name: 'Network Topology', path: '/network-topology', active: pathname === '/network-topology' },
    { name: 'Anomaly Analysis', path: '/anomaly-analysis', active: pathname === '/anomaly-analysis' },
    { name: 'Flow Analytics', path: '/flow-analytics', active: pathname === '/flow-analytics' },
    { name: 'ML Models', path: '/ml-models', active: pathname === '/ml-models' },
  ];

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Flow Anomaly Detection
                </h1>
                <p className="text-sm text-muted-foreground">
                  Broadcom DX NetOps NFA • Team Futurama
                </p>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">System Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">ML Model Active</span>
            </div>
            {isSimulating && (
              <Badge variant="success" className="animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                Live Simulation
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Demo Controls - Only show if handlers are provided */}
            {(onStartSimulation || onStopSimulation || onStartDDoSDemo) && (
              <div className="flex items-center space-x-2">
                {!isSimulating && onStartSimulation ? (
                  <Button
                    onClick={onStartSimulation}
                    variant="success"
                    size="sm"
                    className="glow-effect"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Simulation
                  </Button>
                ) : isSimulating && onStopSimulation ? (
                  <Button
                    onClick={onStopSimulation}
                    variant="danger"
                    size="sm"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop Simulation
                  </Button>
                ) : null}

                {onStartDDoSDemo && (
                  <Button
                    onClick={onStartDDoSDemo}
                    variant="warning"
                    size="sm"
                    className="relative overflow-hidden"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    DDoS Demo
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-[shimmer_2s_infinite]" />
                  </Button>
                )}
              </div>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge 
                  variant="danger" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>

            {/* User Profile */}
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="mt-4 flex items-center justify-between">
          <nav className="flex space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`text-sm font-medium transition-colors pb-2 ${
                  item.active
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Last:</span>
            <select className="bg-background border border-border rounded px-2 py-1 text-foreground">
              <option>15 minutes</option>
              <option>1 hour</option>
              <option>6 hours</option>
              <option>24 hours</option>
              <option>7 days</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
