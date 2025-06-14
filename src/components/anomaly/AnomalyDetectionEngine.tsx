'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnomalyDetection } from '@/types';
import {
  Brain,
  BarChart3,
  Shield,
  Activity,
  Target,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface DetectionAlgorithm {
  id: string;
  name: string;
  type: 'statistical' | 'ml' | 'behavioral' | 'signature';
  description: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  isActive: boolean;
  detectionCount: number;
  falsePositives: number;
  processingTime: number;
}

interface AnomalyDetectionEngineProps {
  anomalies: AnomalyDetection[];
  onAlgorithmToggle: (algorithmId: string) => void;
}

export function AnomalyDetectionEngine({ anomalies, onAlgorithmToggle }: AnomalyDetectionEngineProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);

  // Mock detection algorithms with realistic performance metrics
  const algorithms = useMemo((): DetectionAlgorithm[] => [
    {
      id: 'conv-lstm',
      name: 'Conv-LSTM Autoencoder',
      type: 'ml',
      description: 'Deep learning model for temporal pattern anomaly detection using convolutional LSTM layers',
      accuracy: 94.2,
      precision: 91.8,
      recall: 96.5,
      f1Score: 94.1,
      isActive: true,
      detectionCount: anomalies.filter(a => a.type === 'pattern').length,
      falsePositives: Math.floor(anomalies.filter(a => a.type === 'pattern').length * 0.08),
      processingTime: 45
    },
    {
      id: 'isolation-forest',
      name: 'Isolation Forest',
      type: 'ml',
      description: 'Unsupervised learning algorithm for detecting volume and behavioral anomalies',
      accuracy: 89.7,
      precision: 87.3,
      recall: 92.1,
      f1Score: 89.6,
      isActive: true,
      detectionCount: anomalies.filter(a => a.type === 'volume').length,
      falsePositives: Math.floor(anomalies.filter(a => a.type === 'volume').length * 0.13),
      processingTime: 23
    },
    {
      id: 'statistical-zscore',
      name: 'Statistical Z-Score',
      type: 'statistical',
      description: 'Statistical analysis using Z-score for detecting traffic volume outliers',
      accuracy: 82.4,
      precision: 79.6,
      recall: 85.3,
      f1Score: 82.3,
      isActive: true,
      detectionCount: anomalies.filter(a => a.confidence > 0.7).length,
      falsePositives: Math.floor(anomalies.filter(a => a.confidence > 0.7).length * 0.20),
      processingTime: 8
    },
    {
      id: 'behavioral-profiling',
      name: 'Behavioral Profiling',
      type: 'behavioral',
      description: 'User and entity behavior analytics for detecting unusual access patterns',
      accuracy: 86.9,
      precision: 84.2,
      recall: 89.7,
      f1Score: 86.8,
      isActive: true,
      detectionCount: anomalies.filter(a => a.type === 'pattern').length,
      falsePositives: Math.floor(anomalies.filter(a => a.type === 'pattern').length * 0.16),
      processingTime: 67
    },
    {
      id: 'signature-based',
      name: 'Signature-Based Detection',
      type: 'signature',
      description: 'Rule-based detection using known attack signatures and patterns',
      accuracy: 95.8,
      precision: 98.2,
      recall: 93.4,
      f1Score: 95.7,
      isActive: true,
      detectionCount: anomalies.filter(a => a.severity === 'critical').length,
      falsePositives: Math.floor(anomalies.filter(a => a.severity === 'critical').length * 0.02),
      processingTime: 12
    },
    {
      id: 'ensemble-voting',
      name: 'Ensemble Voting',
      type: 'ml',
      description: 'Meta-algorithm combining multiple detection methods with weighted voting',
      accuracy: 96.3,
      precision: 94.7,
      recall: 97.9,
      f1Score: 96.3,
      isActive: false,
      detectionCount: Math.floor(anomalies.length * 0.85),
      falsePositives: Math.floor(anomalies.length * 0.05),
      processingTime: 89
    }
  ], [anomalies]);

  const getAlgorithmIcon = (type: string) => {
    switch (type) {
      case 'ml': return <Brain className="w-4 h-4" />;
      case 'statistical': return <BarChart3 className="w-4 h-4" />;
      case 'behavioral': return <Activity className="w-4 h-4" />;
      case 'signature': return <Shield className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getAlgorithmTypeColor = (type: string) => {
    switch (type) {
      case 'ml': return 'bg-purple-500';
      case 'statistical': return 'bg-blue-500';
      case 'behavioral': return 'bg-green-500';
      case 'signature': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const activeAlgorithms = algorithms.filter(a => a.isActive);
  const totalDetections = activeAlgorithms.reduce((sum, a) => sum + a.detectionCount, 0);
  const totalFalsePositives = activeAlgorithms.reduce((sum, a) => sum + a.falsePositives, 0);
  const averageAccuracy = activeAlgorithms.reduce((sum, a) => sum + a.accuracy, 0) / activeAlgorithms.length;

  return (
    <div className="space-y-6">
      {/* Engine Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Detection Engine Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{activeAlgorithms.length}</div>
              <div className="text-sm text-muted-foreground">Active Algorithms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{averageAccuracy.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Average Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{totalDetections}</div>
              <div className="text-sm text-muted-foreground">Total Detections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{totalFalsePositives}</div>
              <div className="text-sm text-muted-foreground">False Positives</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {algorithms.map((algorithm) => (
          <Card 
            key={algorithm.id} 
            className={`cursor-pointer transition-all duration-200 ${
              selectedAlgorithm === algorithm.id ? 'ring-2 ring-primary' : ''
            } ${algorithm.isActive ? '' : 'opacity-60'}`}
            onClick={() => setSelectedAlgorithm(selectedAlgorithm === algorithm.id ? null : algorithm.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getAlgorithmTypeColor(algorithm.type)}`}>
                    {getAlgorithmIcon(algorithm.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{algorithm.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {algorithm.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {algorithm.isActive ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAlgorithmToggle(algorithm.id);
                    }}
                  >
                    {algorithm.isActive ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{algorithm.description}</p>
              
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Accuracy:</span>
                    <span className={`text-sm font-medium ${getPerformanceColor(algorithm.accuracy)}`}>
                      {algorithm.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Precision:</span>
                    <span className={`text-sm font-medium ${getPerformanceColor(algorithm.precision)}`}>
                      {algorithm.precision.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Recall:</span>
                    <span className={`text-sm font-medium ${getPerformanceColor(algorithm.recall)}`}>
                      {algorithm.recall.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">F1-Score:</span>
                    <span className={`text-sm font-medium ${getPerformanceColor(algorithm.f1Score)}`}>
                      {algorithm.f1Score.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Detection Statistics */}
              <div className="pt-2 border-t border-border">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-500">{algorithm.detectionCount}</div>
                    <div className="text-xs text-muted-foreground">Detections</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-500">{algorithm.falsePositives}</div>
                    <div className="text-xs text-muted-foreground">False Positives</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-500">{algorithm.processingTime}ms</div>
                    <div className="text-xs text-muted-foreground">Avg Processing</div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedAlgorithm === algorithm.id && (
                <div className="pt-4 border-t border-border space-y-3">
                  <h4 className="font-medium">Algorithm Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Model Version:</span>
                      <span className="font-mono">v2.1.{Math.floor(Math.random() * 10)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Training Data:</span>
                      <span>{(Math.random() * 500 + 100).toFixed(0)}K samples</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span>{Math.floor(Math.random() * 30)} days ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory Usage:</span>
                      <span>{(Math.random() * 200 + 50).toFixed(0)} MB</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
