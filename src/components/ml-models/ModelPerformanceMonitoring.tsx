'use client';

import { MLModel } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import {
  TrendingUp,
  Activity,
  Cpu,
  MemoryStick,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
  Database
} from 'lucide-react';

interface ModelPerformanceMonitoringProps {
  model: MLModel;
}

export function ModelPerformanceMonitoring({ model }: ModelPerformanceMonitoringProps) {
  // Generate performance metrics over time
  const generatePerformanceData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const baseAccuracy = model.accuracy;
      const variation = (Math.random() - 0.5) * 2; // ±1% variation
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        accuracy: Math.max(85, Math.min(98, baseAccuracy + variation)),
        precision: Math.max(82, Math.min(96, model.precision + variation * 0.8)),
        recall: Math.max(88, Math.min(99, model.recall + variation * 0.9)),
        f1Score: Math.max(85, Math.min(97, model.f1Score + variation * 0.85)),
        inferenceTime: Math.max(8, Math.min(20, model.performance.inferenceTime + Math.random() * 4 - 2)),
        cpuUsage: Math.max(20, Math.min(80, model.performance.cpuUsage + Math.random() * 10 - 5)),
        memoryUsage: Math.max(1.5, Math.min(4.0, model.performance.memoryUsage + Math.random() * 0.5 - 0.25))
      });
    }
    
    return data;
  };

  // Generate confusion matrix visualization data
  const generateConfusionMatrixData = () => {
    const matrix = model.performance.confusionMatrix;
    return [
      { name: 'True Positive', value: matrix[1][1], color: '#10B981' },
      { name: 'False Positive', value: matrix[0][1], color: '#F59E0B' },
      { name: 'False Negative', value: matrix[1][0], color: '#EF4444' },
      { name: 'True Negative', value: matrix[0][0], color: '#3B82F6' }
    ];
  };

  // Generate feature importance data
  const generateFeatureImportance = () => {
    return model.features.map((feature, index) => ({
      feature: feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      importance: Math.random() * 0.8 + 0.2, // Random importance between 0.2 and 1.0
      rank: index + 1
    })).sort((a, b) => b.importance - a.importance);
  };

  const performanceData = generatePerformanceData();
  const confusionMatrixData = generateConfusionMatrixData();
  const featureImportance = generateFeatureImportance();

  const getPerformanceStatus = (value: number, threshold: number) => {
    if (value >= threshold) {
      return { status: 'Excellent', color: 'text-green-400', icon: CheckCircle };
    } else if (value >= threshold * 0.9) {
      return { status: 'Good', color: 'text-blue-400', icon: CheckCircle };
    } else if (value >= threshold * 0.8) {
      return { status: 'Fair', color: 'text-yellow-400', icon: AlertTriangle };
    } else {
      return { status: 'Poor', color: 'text-red-400', icon: AlertTriangle };
    }
  };

  const accuracyStatus = getPerformanceStatus(model.accuracy, 90);
  const AccuracyIcon = accuracyStatus.icon;

  return (
    <div className="space-y-8">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Model Accuracy</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{model.accuracy}%</div>
            <div className="flex items-center gap-2 mt-2">
              <AccuracyIcon className={`h-4 w-4 ${accuracyStatus.color}`} />
              <Badge variant="outline" className={`text-xs ${accuracyStatus.color}`}>
                {accuracyStatus.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Inference Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{model.performance.inferenceTime}ms</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {model.performance.inferenceTime < 15 ? 'Fast' : 'Moderate'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{model.performance.cpuUsage.toFixed(1)}%</div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  model.performance.cpuUsage > 70 ? 'bg-red-500' :
                  model.performance.cpuUsage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${model.performance.cpuUsage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{model.performance.memoryUsage.toFixed(1)} GB</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {model.performance.memoryUsage < 3 ? 'Efficient' : 'High'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Accuracy Trends (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
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
                    dataKey="accuracy" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Accuracy"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="precision" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Precision"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recall" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Recall"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              Resource Usage Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
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
                    dataKey="cpuUsage" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="CPU Usage (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="memoryUsage" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Memory Usage (GB)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="inferenceTime" 
                    stroke="#06B6D4" 
                    strokeWidth={2}
                    name="Inference Time (ms)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Confusion Matrix */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              Confusion Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Matrix Visualization */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">{model.performance.confusionMatrix[1][1]}</div>
                  <div className="text-xs text-green-300">True Positive</div>
                </div>
                <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-400">{model.performance.confusionMatrix[0][1]}</div>
                  <div className="text-xs text-yellow-300">False Positive</div>
                </div>
                <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-400">{model.performance.confusionMatrix[1][0]}</div>
                  <div className="text-xs text-red-300">False Negative</div>
                </div>
                <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">{model.performance.confusionMatrix[0][0]}</div>
                  <div className="text-xs text-blue-300">True Negative</div>
                </div>
              </div>

              {/* Metrics Summary */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{model.precision}%</div>
                  <div className="text-xs text-slate-400">Precision</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{model.recall}%</div>
                  <div className="text-xs text-slate-400">Recall</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{model.f1Score}%</div>
                  <div className="text-xs text-slate-400">F1 Score</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{model.performance.rocAuc.toFixed(3)}</div>
                  <div className="text-xs text-slate-400">ROC AUC</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Importance */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-cyan-400" />
              Feature Importance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {featureImportance.slice(0, 8).map((feature, index) => (
                <div key={feature.feature} className="flex items-center gap-3">
                  <div className="w-8 text-center">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{feature.feature}</span>
                      <span className="text-xs text-slate-400">{(feature.importance * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${feature.importance * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Alerts */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Performance Alerts & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {model.performance.cpuUsage > 70 && (
              <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium text-yellow-400">High CPU Usage</span>
                </div>
                <p className="text-sm text-slate-300">
                  CPU usage is above 70%. Consider optimizing model inference or scaling resources.
                </p>
              </div>
            )}
            
            {model.performance.inferenceTime > 15 && (
              <div className="p-4 bg-orange-900/20 border border-orange-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span className="font-medium text-orange-400">Slow Inference</span>
                </div>
                <p className="text-sm text-slate-300">
                  Inference time is above 15ms. Consider model optimization or hardware acceleration.
                </p>
              </div>
            )}
            
            {model.accuracy > 95 && (
              <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="font-medium text-green-400">Excellent Performance</span>
                </div>
                <p className="text-sm text-slate-300">
                  Model is performing exceptionally well with high accuracy and stable metrics.
                </p>
              </div>
            )}
            
            {model.performance.memoryUsage > 3.5 && (
              <div className="p-4 bg-purple-900/20 border border-purple-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MemoryStick className="h-4 w-4 text-purple-400" />
                  <span className="font-medium text-purple-400">High Memory Usage</span>
                </div>
                <p className="text-sm text-slate-300">
                  Memory usage is above 3.5GB. Monitor for potential memory leaks or consider optimization.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
