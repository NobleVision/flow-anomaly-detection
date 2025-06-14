'use client';

import { useState, useEffect } from 'react';
import { MLModel, TrainingJob } from '@/types';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ModelOverview } from '@/components/ml-models/ModelOverview';
import { ModelTraining } from '@/components/ml-models/ModelTraining';
import { ModelPerformanceMonitoring } from '@/components/ml-models/ModelPerformanceMonitoring';
import { ModelVersioning } from '@/components/ml-models/ModelVersioning';
import { ExplainableAI } from '@/components/ml-models/ExplainableAI';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Cpu,
  TrendingUp,
  Play,
  Download,
  Upload,
  GitBranch,
  Eye
} from 'lucide-react';

// Generate mock ML models data
const generateMockModels = (): MLModel[] => [
  {
    id: 'conv-lstm-001',
    name: 'Conv-LSTM Autoencoder',
    type: 'anomaly_detection',
    algorithm: 'Convolutional LSTM',
    version: '2.1.0',
    status: 'deployed',
    accuracy: 94.2,
    precision: 91.8,
    recall: 96.5,
    f1Score: 94.1,
    createdAt: new Date('2024-01-15'),
    lastTrained: new Date('2024-06-10'),
    trainingDataSize: 1500000,
    features: ['packet_size', 'flow_duration', 'protocol_type', 'port_number', 'bytes_per_second'],
    hyperparameters: {
      learning_rate: 0.001,
      batch_size: 128,
      epochs: 100,
      lstm_units: 64,
      conv_filters: 32
    },
    performance: {
      trainingAccuracy: 96.8,
      validationAccuracy: 94.2,
      testAccuracy: 93.9,
      confusionMatrix: [[850, 45], [32, 873]],
      rocAuc: 0.967,
      trainingTime: 3600,
      inferenceTime: 12,
      memoryUsage: 2.4,
      cpuUsage: 45.2
    },
    deployment: {
      environment: 'production',
      endpoint: '/api/ml/anomaly-detection',
      replicas: 3,
      resources: {
        cpu: '2 cores',
        memory: '4Gi',
        gpu: 'Tesla V100'
      },
      autoscaling: {
        enabled: true,
        minReplicas: 2,
        maxReplicas: 10,
        targetCpuUtilization: 70
      }
    }
  },
  {
    id: 'isolation-forest-002',
    name: 'Isolation Forest',
    type: 'anomaly_detection',
    algorithm: 'Isolation Forest',
    version: '1.8.3',
    status: 'deployed',
    accuracy: 89.7,
    precision: 87.3,
    recall: 92.1,
    f1Score: 89.6,
    createdAt: new Date('2024-02-20'),
    lastTrained: new Date('2024-06-08'),
    trainingDataSize: 800000,
    features: ['flow_volume', 'connection_count', 'unique_ports', 'geographic_entropy'],
    hyperparameters: {
      n_estimators: 200,
      max_samples: 0.8,
      contamination: 0.1,
      random_state: 42
    },
    performance: {
      trainingAccuracy: 91.2,
      validationAccuracy: 89.7,
      testAccuracy: 88.9,
      confusionMatrix: [[780, 95], [68, 757]],
      rocAuc: 0.923,
      trainingTime: 1200,
      inferenceTime: 8,
      memoryUsage: 1.8,
      cpuUsage: 32.1
    },
    deployment: {
      environment: 'production',
      endpoint: '/api/ml/isolation-forest',
      replicas: 2,
      resources: {
        cpu: '1 core',
        memory: '2Gi'
      },
      autoscaling: {
        enabled: true,
        minReplicas: 1,
        maxReplicas: 5,
        targetCpuUtilization: 80
      }
    }
  },
  {
    id: 'behavioral-profiling-003',
    name: 'Behavioral Profiling',
    type: 'classification',
    algorithm: 'Random Forest',
    version: '1.5.2',
    status: 'training',
    accuracy: 86.9,
    precision: 84.2,
    recall: 89.7,
    f1Score: 86.9,
    createdAt: new Date('2024-03-10'),
    lastTrained: new Date('2024-06-12'),
    trainingDataSize: 1200000,
    features: ['user_activity_pattern', 'access_frequency', 'data_volume', 'time_of_access'],
    hyperparameters: {
      n_estimators: 150,
      max_depth: 12,
      min_samples_split: 5,
      min_samples_leaf: 2
    },
    performance: {
      trainingAccuracy: 88.4,
      validationAccuracy: 86.9,
      testAccuracy: 85.7,
      confusionMatrix: [[720, 115], [89, 676]],
      rocAuc: 0.891,
      trainingTime: 2400,
      inferenceTime: 15,
      memoryUsage: 3.1,
      cpuUsage: 52.8
    },
    deployment: {
      environment: 'staging',
      endpoint: '/api/ml/behavioral-profiling',
      replicas: 1,
      resources: {
        cpu: '1.5 cores',
        memory: '3Gi'
      },
      autoscaling: {
        enabled: false,
        minReplicas: 1,
        maxReplicas: 3,
        targetCpuUtilization: 75
      }
    }
  }
];

// Generate mock training jobs
const generateMockTrainingJobs = (): TrainingJob[] => [
  {
    id: 'job-001',
    modelId: 'conv-lstm-001',
    status: 'completed',
    progress: 100,
    startTime: new Date('2024-06-10T09:00:00'),
    endTime: new Date('2024-06-10T10:00:00'),
    duration: 3600,
    logs: [
      'Starting training job for Conv-LSTM Autoencoder v2.1.0',
      'Loading training data: 1,500,000 samples',
      'Epoch 1/100 - Loss: 0.245, Accuracy: 0.823',
      'Epoch 50/100 - Loss: 0.089, Accuracy: 0.942',
      'Epoch 100/100 - Loss: 0.067, Accuracy: 0.968',
      'Training completed successfully',
      'Model saved to production registry'
    ],
    metrics: {
      epoch: 100,
      loss: 0.067,
      accuracy: 0.968,
      validationLoss: 0.078,
      validationAccuracy: 0.942,
      learningRate: 0.001
    },
    config: {
      epochs: 100,
      batchSize: 128,
      learningRate: 0.001,
      optimizer: 'Adam',
      lossFunction: 'binary_crossentropy',
      validationSplit: 0.2,
      earlyStopping: true,
      patience: 10
    }
  },
  {
    id: 'job-002',
    modelId: 'behavioral-profiling-003',
    status: 'running',
    progress: 65,
    startTime: new Date('2024-06-12T14:30:00'),
    logs: [
      'Starting training job for Behavioral Profiling v1.5.2',
      'Loading training data: 1,200,000 samples',
      'Epoch 1/80 - Loss: 0.312, Accuracy: 0.756',
      'Epoch 25/80 - Loss: 0.198, Accuracy: 0.834',
      'Epoch 52/80 - Loss: 0.156, Accuracy: 0.869',
      'Training in progress...'
    ],
    metrics: {
      epoch: 52,
      loss: 0.156,
      accuracy: 0.869,
      validationLoss: 0.167,
      validationAccuracy: 0.851,
      learningRate: 0.0008
    },
    config: {
      epochs: 80,
      batchSize: 64,
      learningRate: 0.001,
      optimizer: 'Adam',
      lossFunction: 'categorical_crossentropy',
      validationSplit: 0.25,
      earlyStopping: true,
      patience: 15
    }
  }
];

export default function MLModelsPage() {
  const [models, setModels] = useState<MLModel[]>([]);
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([]);
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'training' | 'performance' | 'versioning' | 'explainable'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setModels(generateMockModels());
        setTrainingJobs(generateMockTrainingJobs());
        setSelectedModel(generateMockModels()[0]);
      } catch (error) {
        console.error('Error loading ML models data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-refresh training jobs
  useEffect(() => {
    const interval = setInterval(() => {
      setTrainingJobs(prev => prev.map(job => {
        if (job.status === 'running' && job.progress < 100) {
          return {
            ...job,
            progress: Math.min(job.progress + Math.random() * 5, 100),
            metrics: {
              ...job.metrics,
              epoch: job.metrics.epoch + 1,
              loss: Math.max(job.metrics.loss - Math.random() * 0.01, 0.05),
              accuracy: Math.min(job.metrics.accuracy + Math.random() * 0.01, 0.99)
            }
          };
        }
        return job;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleModelSelect = (model: MLModel) => {
    setSelectedModel(model);
  };

  const handleStartTraining = (modelId: string) => {
    const newJob: TrainingJob = {
      id: `job-${Date.now()}`,
      modelId,
      status: 'running',
      progress: 0,
      startTime: new Date(),
      logs: [`Starting training job for model ${modelId}`, 'Initializing training environment...'],
      metrics: {
        epoch: 0,
        loss: 1.0,
        accuracy: 0.5,
        validationLoss: 1.0,
        validationAccuracy: 0.5,
        learningRate: 0.001
      },
      config: {
        epochs: 100,
        batchSize: 128,
        learningRate: 0.001,
        optimizer: 'Adam',
        lossFunction: 'binary_crossentropy',
        validationSplit: 0.2,
        earlyStopping: true,
        patience: 10
      }
    };

    setTrainingJobs(prev => [newJob, ...prev]);
  };

  const handleStopTraining = (jobId: string) => {
    setTrainingJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'cancelled' as const } : job
    ));
  };

  const handleDeployModel = (modelId: string) => {
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, status: 'deployed' as const } : model
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Brain className="h-8 w-8 animate-pulse text-purple-400 mx-auto mb-4" />
              <p className="text-slate-300">Loading ML models data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">ML Models Management</h1>
            <p className="text-slate-300">Machine learning model training, deployment, and performance monitoring</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import Model
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Models
            </Button>
            <Button variant="default" size="sm">
              <Play className="h-4 w-4 mr-2" />
              New Training Job
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 border-b border-slate-700">
          {[
            { id: 'overview', label: 'Overview', icon: Brain },
            { id: 'training', label: 'Training', icon: Cpu },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'versioning', label: 'Versioning', icon: GitBranch },
            { id: 'explainable', label: 'Explainable AI', icon: Eye }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'overview' | 'training' | 'performance' | 'versioning' | 'explainable')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === id
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <ModelOverview 
              models={models} 
              trainingJobs={trainingJobs}
              onModelSelect={handleModelSelect}
              onStartTraining={handleStartTraining}
              onDeployModel={handleDeployModel}
            />
          )}
          
          {activeTab === 'training' && (
            <ModelTraining 
              models={models}
              trainingJobs={trainingJobs}
              onStartTraining={handleStartTraining}
              onStopTraining={handleStopTraining}
            />
          )}
          
          {activeTab === 'performance' && selectedModel && (
            <ModelPerformanceMonitoring model={selectedModel} />
          )}
          
          {activeTab === 'versioning' && (
            <ModelVersioning models={models} onModelSelect={handleModelSelect} />
          )}
          
          {activeTab === 'explainable' && selectedModel && (
            <ExplainableAI model={selectedModel} />
          )}
        </div>
      </div>
    </div>
  );
}
