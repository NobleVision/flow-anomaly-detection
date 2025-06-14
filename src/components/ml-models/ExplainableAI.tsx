'use client';

import { useState } from 'react';
import { MLModel } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, PieChart, Pie } from 'recharts';
import {
  Eye,
  Brain,
  Target,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Search,
  Filter
} from 'lucide-react';

interface ExplainableAIProps {
  model: MLModel;
}

export function ExplainableAI({ model }: ExplainableAIProps) {
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [explanationType, setExplanationType] = useState<'shap' | 'lime' | 'attention'>('shap');

  // Generate SHAP values for feature importance
  const generateSHAPValues = () => {
    return model.features.map((feature, index) => ({
      feature: feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      shapValue: (Math.random() - 0.5) * 2, // Values between -1 and 1
      importance: Math.random() * 0.8 + 0.2,
      contribution: Math.random() > 0.5 ? 'positive' : 'negative'
    })).sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue));
  };

  // Generate sample predictions with explanations
  const generateSamplePredictions = () => {
    const predictions = [];
    const anomalyTypes = ['DDoS Attack', 'Port Scan', 'Data Exfiltration', 'Normal Traffic', 'Lateral Movement'];
    
    for (let i = 0; i < 5; i++) {
      const isAnomaly = Math.random() > 0.3;
      const confidence = isAnomaly ? 0.7 + Math.random() * 0.3 : 0.1 + Math.random() * 0.4;
      
      predictions.push({
        id: `pred-${i + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000),
        prediction: isAnomaly ? anomalyTypes[Math.floor(Math.random() * (anomalyTypes.length - 1))] : 'Normal Traffic',
        confidence: confidence,
        isAnomaly: isAnomaly,
        sourceIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        destinationIp: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        features: {
          packet_size: Math.floor(Math.random() * 1500) + 64,
          flow_duration: Math.floor(Math.random() * 30000) + 100,
          bytes_per_second: Math.floor(Math.random() * 1000000) + 1000,
          port_number: Math.floor(Math.random() * 65535),
          protocol_type: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)]
        }
      });
    }
    
    return predictions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  // Generate decision tree visualization data
  const generateDecisionPath = () => {
    return [
      { step: 1, condition: 'Bytes per second > 100,000', result: 'Continue', confidence: 0.95 },
      { step: 2, condition: 'Port number in suspicious range', result: 'Continue', confidence: 0.87 },
      { step: 3, condition: 'Flow duration < 1000ms', result: 'Continue', confidence: 0.92 },
      { step: 4, condition: 'Protocol type = TCP', result: 'Anomaly Detected', confidence: 0.89 }
    ];
  };

  // Generate attention weights for neural networks
  const generateAttentionWeights = () => {
    const timeSteps = ['T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'T-0'];
    return timeSteps.map(step => ({
      timeStep: step,
      attention: Math.random(),
      features: model.features.slice(0, 3).map(feature => ({
        name: feature,
        weight: Math.random()
      }))
    }));
  };

  const shapValues = generateSHAPValues();
  const samplePredictions = generateSamplePredictions();
  const decisionPath = generateDecisionPath();
  const attentionWeights = generateAttentionWeights();

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-400';
    if (confidence > 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getContributionColor = (value: number) => {
    return value > 0 ? '#10B981' : '#EF4444';
  };

  return (
    <div className="space-y-8">
      {/* Explanation Type Selector */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-400" />
            Explainable AI Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-slate-300">Explanation Method:</span>
            <div className="flex items-center gap-2">
              {[
                { id: 'shap', label: 'SHAP Values', description: 'Feature importance and contribution analysis' },
                { id: 'lime', label: 'LIME', description: 'Local interpretable model explanations' },
                { id: 'attention', label: 'Attention Maps', description: 'Neural network attention visualization' }
              ].map(({ id, label, description }) => (
                <Button
                  key={id}
                  variant={explanationType === id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExplanationType(id as any)}
                  className="flex flex-col items-start p-3 h-auto"
                >
                  <span className="font-medium">{label}</span>
                  <span className="text-xs opacity-70">{description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Model Interpretability Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Model Complexity</span>
              </div>
              <div className="text-lg font-bold text-white">
                {model.algorithm.includes('LSTM') ? 'High' : 
                 model.algorithm.includes('Forest') ? 'Medium' : 'Low'}
              </div>
              <div className="text-xs text-slate-400">
                {model.features.length} features, {model.algorithm}
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-white">Interpretability</span>
              </div>
              <div className="text-lg font-bold text-white">
                {model.algorithm.includes('Forest') ? 'High' : 
                 model.algorithm.includes('LSTM') ? 'Medium' : 'High'}
              </div>
              <div className="text-xs text-slate-400">
                Feature importance available
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">Explainability Score</span>
              </div>
              <div className="text-lg font-bold text-white">8.7/10</div>
              <div className="text-xs text-slate-400">
                Based on model transparency
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Explanation Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Feature Importance / SHAP Values */}
        {explanationType === 'shap' && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                SHAP Feature Importance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={shapValues.slice(0, 8)} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                      <YAxis dataKey="feature" type="category" stroke="#9CA3AF" fontSize={12} width={120} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }}
                      />
                      <Bar dataKey="shapValue" radius={[0, 4, 4, 0]}>
                        {shapValues.slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getContributionColor(entry.shapValue)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-white">Feature Contributions</h4>
                  {shapValues.slice(0, 5).map((feature, index) => (
                    <div key={feature.feature} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                      <span className="text-sm text-white">{feature.feature}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${feature.contribution === 'positive' ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {feature.shapValue > 0 ? '+' : ''}{feature.shapValue.toFixed(3)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* LIME Local Explanations */}
        {explanationType === 'lime' && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Search className="h-5 w-5 text-green-400" />
                LIME Local Explanations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-white mb-3">Sample Prediction Analysis</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Prediction:</span>
                      <div className="font-medium text-white">DDoS Attack</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Confidence:</span>
                      <div className="font-medium text-green-400">92.3%</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-white">Local Feature Impact</h4>
                  {shapValues.slice(0, 6).map((feature, index) => (
                    <div key={feature.feature} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{feature.feature}</span>
                        <span className={`text-sm font-medium ${feature.shapValue > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {feature.shapValue > 0 ? 'Supports' : 'Opposes'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            feature.shapValue > 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.abs(feature.shapValue) * 50}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attention Maps */}
        {explanationType === 'attention' && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Attention Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-2">
                  {attentionWeights.map((step, index) => (
                    <div key={step.timeStep} className="text-center">
                      <div className="text-xs text-slate-400 mb-2">{step.timeStep}</div>
                      <div 
                        className="w-full h-16 rounded border-2 flex items-center justify-center"
                        style={{ 
                          backgroundColor: `rgba(59, 130, 246, ${step.attention})`,
                          borderColor: step.attention > 0.7 ? '#3B82F6' : 'transparent'
                        }}
                      >
                        <span className="text-xs font-medium text-white">
                          {(step.attention * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-white">Attention Weights by Feature</h4>
                  {attentionWeights[attentionWeights.length - 1].features.map((feature, index) => (
                    <div key={feature.name} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                      <span className="text-sm text-white">{feature.name.replace(/_/g, ' ')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${feature.weight * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-12">
                          {(feature.weight * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Predictions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-400" />
              Recent Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {samplePredictions.map((prediction) => (
                <div
                  key={prediction.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPrediction === prediction.id
                      ? 'bg-blue-900/20 border-blue-500/50'
                      : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedPrediction(
                    selectedPrediction === prediction.id ? null : prediction.id
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {prediction.isAnomaly ? (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                      <span className="font-medium text-white">{prediction.prediction}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getConfidenceColor(prediction.confidence)}`}
                    >
                      {(prediction.confidence * 100).toFixed(1)}%
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-400 mb-2">
                    {prediction.sourceIp} → {prediction.destinationIp} • {prediction.timestamp.toLocaleTimeString()}
                  </div>

                  {selectedPrediction === prediction.id && (
                    <div className="mt-3 pt-3 border-t border-slate-600">
                      <h5 className="text-sm font-medium text-white mb-2">Feature Values</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400">Packet Size:</span>
                          <span className="text-white ml-1">{prediction.features.packet_size} bytes</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Duration:</span>
                          <span className="text-white ml-1">{prediction.features.flow_duration} ms</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Bytes/sec:</span>
                          <span className="text-white ml-1">{prediction.features.bytes_per_second.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Protocol:</span>
                          <span className="text-white ml-1">{prediction.features.protocol_type}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decision Path Visualization */}
      {model.algorithm.includes('Forest') && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Filter className="h-5 w-5 text-orange-400" />
              Decision Path Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                Showing the decision path for a sample anomaly detection:
              </p>
              
              <div className="space-y-3">
                {decisionPath.map((step, index) => (
                  <div key={step.step} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {step.step}
                    </div>
                    <div className="flex-1 p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{step.condition}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {(step.confidence * 100).toFixed(1)}%
                          </Badge>
                          <Badge 
                            variant={step.result === 'Anomaly Detected' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {step.result}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {index < decisionPath.length - 1 && (
                      <div className="flex-shrink-0 text-slate-500">
                        ↓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
