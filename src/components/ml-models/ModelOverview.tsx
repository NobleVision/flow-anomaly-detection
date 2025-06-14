'use client';

import { MLModel, TrainingJob } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Cpu,
  CheckCircle,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  TrendingUp,
  Zap,
  Activity,
  Database,
  GitBranch
} from 'lucide-react';

interface ModelOverviewProps {
  models: MLModel[];
  trainingJobs: TrainingJob[];
  onModelSelect: (model: MLModel) => void;
  onStartTraining: (modelId: string) => void;
  onDeployModel: (modelId: string) => void;
}

export function ModelOverview({ 
  models, 
  trainingJobs, 
  onModelSelect, 
  onStartTraining, 
  onDeployModel 
}: ModelOverviewProps) {
  const getStatusIcon = (status: MLModel['status']) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'training':
        return <Clock className="h-4 w-4 text-yellow-400 animate-pulse" />;
      case 'testing':
        return <Activity className="h-4 w-4 text-blue-400" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <Pause className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: MLModel['status']) => {
    switch (status) {
      case 'deployed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'training':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'testing':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'failed':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getAlgorithmIcon = (algorithm: string) => {
    if (algorithm.includes('LSTM') || algorithm.includes('Neural')) {
      return <Brain className="h-5 w-5 text-purple-400" />;
    }
    if (algorithm.includes('Forest') || algorithm.includes('Tree')) {
      return <GitBranch className="h-5 w-5 text-green-400" />;
    }
    return <Cpu className="h-5 w-5 text-blue-400" />;
  };

  // Calculate summary statistics
  const deployedModels = models.filter(m => m.status === 'deployed').length;
  const trainingModels = models.filter(m => m.status === 'training').length;
  const averageAccuracy = models.reduce((sum, m) => sum + m.accuracy, 0) / models.length;
  const activeJobs = trainingJobs.filter(j => j.status === 'running').length;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Models</CardTitle>
            <Brain className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{models.length}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {deployedModels} deployed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Training</CardTitle>
            <Activity className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeJobs}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {trainingModels} models training
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Avg Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{averageAccuracy.toFixed(1)}%</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs text-green-400">
                High Performance
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Data Processed</CardTitle>
            <Database className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {(models.reduce((sum, m) => sum + m.trainingDataSize, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                samples processed
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Models Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">Model Registry</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {models.map((model) => (
            <Card 
              key={model.id} 
              className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
              onClick={() => onModelSelect(model)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getAlgorithmIcon(model.algorithm)}
                    <div>
                      <CardTitle className="text-lg text-white">{model.name}</CardTitle>
                      <p className="text-sm text-slate-400">{model.algorithm}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(model.status)} border`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(model.status)}
                      {model.status}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Version and Type */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Version</span>
                  <Badge variant="outline" className="text-xs">
                    v{model.version}
                  </Badge>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Accuracy</span>
                    <span className="text-sm font-medium text-white">{model.accuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${model.accuracy}%` }}
                    />
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Precision</span>
                    <div className="font-medium text-white">{model.precision}%</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Recall</span>
                    <div className="font-medium text-white">{model.recall}%</div>
                  </div>
                </div>

                {/* Training Data */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Training Data</span>
                  <span className="text-white">
                    {(model.trainingDataSize / 1000000).toFixed(1)}M samples
                  </span>
                </div>

                {/* Last Trained */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Last Trained</span>
                  <span className="text-white">
                    {model.lastTrained.toLocaleDateString()}
                  </span>
                </div>

                {/* Deployment Info */}
                {model.status === 'deployed' && (
                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Environment</span>
                      <Badge variant="outline" className="text-xs">
                        {model.deployment.environment}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-slate-400">Replicas</span>
                      <span className="text-white">{model.deployment.replicas}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  {model.status === 'deployed' ? (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  ) : model.status === 'training' ? (
                    <Button variant="outline" size="sm" className="flex-1" disabled>
                      <Clock className="h-3 w-3 mr-1 animate-pulse" />
                      Training...
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeployModel(model.id);
                      }}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Deploy
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartTraining(model.id);
                    }}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Training Jobs */}
      {activeJobs > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Active Training Jobs</h2>
          <div className="space-y-4">
            {trainingJobs
              .filter(job => job.status === 'running')
              .map((job) => {
                const model = models.find(m => m.id === job.modelId);
                return (
                  <Card key={job.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5 text-yellow-400 animate-pulse" />
                          <div>
                            <h3 className="font-medium text-white">{model?.name}</h3>
                            <p className="text-sm text-slate-400">Training Job {job.id}</p>
                          </div>
                        </div>
                        <Badge className="text-yellow-400 bg-yellow-400/10 border-yellow-400/20">
                          Running
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Progress</span>
                          <span className="text-white">{job.progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-slate-400">Epoch</span>
                          <div className="font-medium text-white">{job.metrics.epoch}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Loss</span>
                          <div className="font-medium text-white">{job.metrics.loss.toFixed(3)}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Accuracy</span>
                          <div className="font-medium text-white">{(job.metrics.accuracy * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Val Accuracy</span>
                          <div className="font-medium text-white">{(job.metrics.validationAccuracy * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
