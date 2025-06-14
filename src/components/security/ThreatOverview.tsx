'use client';

import { SecurityDashboard } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import {
  Shield,
  AlertTriangle,
  Eye,
  TrendingUp,
  Globe,
  Activity,
  Target,
  Zap
} from 'lucide-react';

interface ThreatOverviewProps {
  dashboard: SecurityDashboard;
}

export function ThreatOverview({ dashboard }: ThreatOverviewProps) {
  // Generate threat trend data
  const generateThreatTrendData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        threats: Math.floor(Math.random() * 50) + 10,
        blocked: Math.floor(Math.random() * 200) + 50,
        critical: Math.floor(Math.random() * 5),
        high: Math.floor(Math.random() * 15) + 5,
        medium: Math.floor(Math.random() * 25) + 10,
        low: Math.floor(Math.random() * 30) + 15
      });
    }
    
    return data;
  };

  // Generate threat category distribution
  const generateThreatCategories = () => {
    return [
      { name: 'Malware', value: 35, color: '#EF4444' },
      { name: 'Phishing', value: 28, color: '#F59E0B' },
      { name: 'C2 Communication', value: 18, color: '#8B5CF6' },
      { name: 'Data Exfiltration', value: 12, color: '#06B6D4' },
      { name: 'Reconnaissance', value: 7, color: '#10B981' }
    ];
  };

  // Generate geographic threat data
  const generateGeographicData = () => {
    return dashboard.geographicThreats.map(threat => ({
      ...threat,
      percentage: (threat.threatCount / dashboard.geographicThreats.reduce((sum, t) => sum + t.threatCount, 0)) * 100
    }));
  };

  const threatTrendData = generateThreatTrendData();
  const threatCategories = generateThreatCategories();
  const geographicData = generateGeographicData();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboard.activeThreats}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getSeverityColor(dashboard.threatLevel)}>
                {dashboard.threatLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Blocked Attacks</CardTitle>
            <Shield className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboard.blockedAttacks}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs text-green-400">
                +12% from yesterday
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Investigating</CardTitle>
            <Eye className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboard.investigatingEvents}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Requires attention
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Risk Score</CardTitle>
            <Target className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboard.riskScore}/100</div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  dashboard.riskScore > 80 ? 'bg-red-500' :
                  dashboard.riskScore > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${dashboard.riskScore}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Threat Trends */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Threat Trends (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={threatTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="threats" 
                    stroke="#EF4444" 
                    fill="#EF4444"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="Active Threats"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="blocked" 
                    stroke="#10B981" 
                    fill="#10B981"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="Blocked Attacks"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Threat Categories */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-400" />
              Threat Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threatCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {threatCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {threatCategories.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-slate-300">{category.name}</span>
                  <span className="text-sm text-white ml-auto">{category.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Threats and Severity Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Geographic Threats */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-400" />
              Geographic Threat Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geographicData.map((threat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-slate-600 rounded flex items-center justify-center">
                        <span className="text-xs font-medium text-white">{threat.countryCode}</span>
                      </div>
                      <span className="text-sm text-white">{threat.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getSeverityColor(threat.severity)} text-xs`}>
                        {threat.severity}
                      </Badge>
                      <span className="text-sm text-slate-400">{threat.threatCount}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        threat.severity === 'critical' ? 'bg-red-500' :
                        threat.severity === 'high' ? 'bg-orange-500' :
                        threat.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${threat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Severity Breakdown */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Threat Severity Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={threatTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="critical" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Critical"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="high" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="High"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="medium" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Medium"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="low" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Low"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Recent Security Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="flex-1">
                <div className="font-medium text-white">Critical threat detected</div>
                <div className="text-sm text-slate-400">Malware communication from 198.51.100.23</div>
              </div>
              <div className="text-sm text-slate-400">2 minutes ago</div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
              <Shield className="h-5 w-5 text-green-400" />
              <div className="flex-1">
                <div className="font-medium text-white">Attack blocked successfully</div>
                <div className="text-sm text-slate-400">DDoS attempt from multiple sources</div>
              </div>
              <div className="text-sm text-slate-400">5 minutes ago</div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
              <Eye className="h-5 w-5 text-yellow-400" />
              <div className="flex-1">
                <div className="font-medium text-white">Suspicious activity detected</div>
                <div className="text-sm text-slate-400">Unusual traffic pattern from internal host</div>
              </div>
              <div className="text-sm text-slate-400">12 minutes ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
