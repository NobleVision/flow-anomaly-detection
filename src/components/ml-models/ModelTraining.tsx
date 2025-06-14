'use client';

import { useState } from 'react';
import { MLModel, TrainingJob } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Play,
  Square,
  Pause,
  RotateCcw,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Terminal,
  TrendingUp,
  Cpu,
  MemoryStick
} from 'lucide-react';

interface ModelTrainingProps {
  models: MLModel[];
  trainingJobs: TrainingJob[];
  onStartTraining: (modelId: string) => void;
  onStopTraining: (jobId: string) => void;
}

export function ModelTraining({ models, trainingJobs, onStartTraining, onStopTraining }: ModelTrainingProps) {
  const [selectedJob, setSelectedJob] = useState<TrainingJob | null>(trainingJobs[0] || null);
  const [showLogs, setShowLogs] = useState(false);

  const getJobStatusIcon = (status: TrainingJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'running':
        return <Activity className="h-4 w-4 text-yellow-400 animate-pulse" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-blue-400" />;
    }
  };

  const getJobStatusColor = (status: TrainingJob['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'running':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'failed':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'cancelled':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default:
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  // Generate training metrics chart data
  const generateTrainingData = (job: TrainingJob) => {
    const data = [];
    const epochs = job.metrics.epoch;
    
    for (let i = 1; i <= epochs; i++) {
      // Simulate realistic training curves
      const progress = i / epochs;
      const loss = 1.0 * Math.exp(-progress * 2) + 0.05 + Math.random() * 0.02;
      const accuracy = 0.5 + 0.45 * (1 - Math.exp(-progress * 3)) + Math.random() * 0.02;
      const valLoss = loss + 0.02 + Math.random() * 0.01;
      const valAccuracy = accuracy - 0.02 + Math.random() * 0.01;
      
      data.push({
        epoch: i,
        loss: loss,
        accuracy: accuracy,
        valLoss: valLoss,
        valAccuracy: valAccuracy
      });
    }
    
    return data;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Training Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Play className="h-5 w-5 text-blue-400" />
            Training Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {models.map((model) => (
              <div key={model.id} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">{model.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    v{model.version}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="text-white">{model.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Accuracy</span>
                    <span className="text-white">{model.accuracy}%</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onStartTraining(model.id)}
                    disabled={model.status === 'training'}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Train
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Jobs List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-yellow-400" />
              Training Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingJobs.map((job) => {
                const model = models.find(m => m.id === job.modelId);
                return (
                  <div 
                    key={job.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedJob?.id === job.id 
                        ? 'bg-blue-900/20 border-blue-500/50' 
                        : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getJobStatusIcon(job.status)}
                        <div>
                          <h3 className="font-medium text-white">{model?.name}</h3>
                          <p className="text-sm text-slate-400">Job {job.id}</p>
                        </div>
                      </div>
                      <Badge className={`${getJobStatusColor(job.status)} border`}>
                        {job.status}
                      </Badge>
                    </div>

                    {/* Progress for running jobs */}
                    {job.status === 'running' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Progress</span>
                          <span className="text-white">{job.progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Job metrics */}
                    <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                      <div>
                        <span className="text-slate-400">Epoch</span>
                        <div className="font-medium text-white">{job.metrics.epoch}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Accuracy</span>
                        <div className="font-medium text-white">{(job.metrics.accuracy * 100).toFixed(1)}%</div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {job.status === 'running' && (
                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStopTraining(job.id);
                          }}
                        >
                          <Square className="h-3 w-3 mr-1" />
                          Stop
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowLogs(!showLogs);
                          }}
                        >
                          <Terminal className="h-3 w-3 mr-1" />
                          Logs
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        {selectedJob && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Training Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Job ID</span>
                  <span className="text-sm font-medium text-white">{selectedJob.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Status</span>
                  <Badge className={`${getJobStatusColor(selectedJob.status)} border text-xs`}>
                    {selectedJob.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Started</span>
                  <span className="text-sm font-medium text-white">
                    {selectedJob.startTime.toLocaleString()}
                  </span>
                </div>
                {selectedJob.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Duration</span>
                    <span className="text-sm font-medium text-white">
                      {formatDuration(selectedJob.duration)}
                    </span>
                  </div>
                )}
              </div>

              {/* Training Configuration */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Configuration</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Epochs</span>
                    <span className="text-white">{selectedJob.config.epochs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Batch Size</span>
                    <span className="text-white">{selectedJob.config.batchSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Learning Rate</span>
                    <span className="text-white">{selectedJob.config.learningRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Optimizer</span>
                    <span className="text-white">{selectedJob.config.optimizer}</span>
                  </div>
                </div>
              </div>

              {/* Current Metrics */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Current Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Loss</div>
                    <div className="text-lg font-bold text-white">{selectedJob.metrics.loss.toFixed(4)}</div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Accuracy</div>
                    <div className="text-lg font-bold text-white">{(selectedJob.metrics.accuracy * 100).toFixed(1)}%</div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Val Loss</div>
                    <div className="text-lg font-bold text-white">{selectedJob.metrics.validationLoss.toFixed(4)}</div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-xs text-slate-400">Val Accuracy</div>
                    <div className="text-lg font-bold text-white">{(selectedJob.metrics.validationAccuracy * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              {/* Training Progress Chart */}
              {selectedJob.status === 'running' && selectedJob.metrics.epoch > 5 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Training Progress</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generateTrainingData(selectedJob)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="epoch" stroke="#9CA3AF" fontSize={12} />
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
                          dataKey="accuracy" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          dot={false}
                          name="Training Accuracy"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="valAccuracy" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          dot={false}
                          name="Validation Accuracy"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Training Logs */}
      {showLogs && selectedJob && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Terminal className="h-5 w-5 text-green-400" />
              Training Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
              {selectedJob.logs.map((log, index) => (
                <div key={index} className="text-green-400 mb-1">
                  <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
