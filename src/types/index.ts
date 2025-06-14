// Core types for Flow Anomaly Detection System

export interface NetworkNode {
  id: string;
  ip: string;
  hostname?: string;
  type: 'server' | 'client' | 'router' | 'switch' | 'firewall';
  position: [number, number, number];
  status: 'normal' | 'warning' | 'critical' | 'offline';
  metrics: {
    cpu?: number;
    memory?: number;
    bandwidth?: number;
    connections?: number;
  };
  lastSeen: Date;
}

export interface NetworkFlow {
  id: string;
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  bytes: number;
  packets: number;
  duration: number;
  timestamp: Date;
  flags?: string[];
}

export interface AnomalyDetection {
  id: string;
  flowId: string;
  type: 'volume' | 'pattern' | 'protocol' | 'geographic' | 'temporal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
  description: string;
  detectedAt: Date;
  sourceIp: string;
  destinationIp: string;
  metrics: {
    expectedValue?: number;
    actualValue: number;
    threshold: number;
    deviation: number;
  };
  mlModel: {
    name: string;
    version: string;
    accuracy: number;
  };
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
}

export interface Alarm {
  id: string;
  anomalyId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'acknowledged' | 'investigating' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  tags: string[];
  actions: AlarmAction[];
}

export interface AlarmAction {
  id: string;
  type: 'acknowledge' | 'escalate' | 'resolve' | 'comment' | 'assign';
  user: string;
  timestamp: Date;
  comment?: string;
  metadata?: Record<string, unknown>;
}

export interface NetworkTopology {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  lastUpdated: Date;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: 'physical' | 'logical' | 'flow';
  bandwidth?: number;
  latency?: number;
  utilization?: number;
  status: 'active' | 'inactive' | 'congested';
}

export interface MLModelMetrics {
  name: string;
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: Date;
  trainingDataSize: number;
  features: string[];
}

export interface DashboardMetrics {
  totalFlows: number;
  anomaliesDetected: number;
  activeAlarms: number;
  networkHealth: number; // 0-100
  throughput: {
    current: number;
    average: number;
    peak: number;
  };
  latency: {
    current: number;
    average: number;
    p95: number;
  };
  topTalkers: {
    ip: string;
    bytes: number;
    flows: number;
  }[];
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface ChartData {
  name: string;
  data: TimeSeriesData[];
  color?: string;
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'flow' | 'anomaly' | 'alarm' | 'metrics' | 'topology';
  data: unknown;
  timestamp: Date;
}

// Demo simulation types
export interface SimulationConfig {
  nodeCount: number;
  flowRate: number; // flows per second
  anomalyRate: number; // percentage
  attackScenarios: AttackScenario[];
}

export interface AttackScenario {
  id: string;
  name: string;
  type: 'ddos' | 'port_scan' | 'data_exfiltration' | 'lateral_movement';
  duration: number; // seconds
  intensity: number; // 1-10
  targetNodes: string[];
  description: string;
}

// UI State types
export interface UIState {
  selectedNode?: string;
  selectedFlow?: string;
  selectedAnomaly?: string;
  viewMode: '2d' | '3d';
  timeRange: {
    start: Date;
    end: Date;
  };
  filters: {
    severity?: string[];
    status?: string[];
    nodeTypes?: string[];
  };
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sound: boolean;
  severity: ('low' | 'medium' | 'high' | 'critical')[];
}

// Flow Analytics Types
export interface FlowAnalytics {
  totalFlows: number;
  totalBytes: number;
  totalPackets: number;
  averageFlowDuration: number;
  topProtocols: ProtocolStats[];
  topPorts: PortStats[];
  topTalkers: TalkerStats[];
  bandwidthUtilization: BandwidthStats;
  flowTrends: TimeSeriesData[];
  geographicDistribution: GeographicStats[];
}

export interface ProtocolStats {
  protocol: string;
  flows: number;
  bytes: number;
  packets: number;
  percentage: number;
}

export interface PortStats {
  port: number;
  service: string;
  flows: number;
  bytes: number;
  percentage: number;
}

export interface TalkerStats {
  ip: string;
  hostname?: string;
  inboundBytes: number;
  outboundBytes: number;
  totalBytes: number;
  flows: number;
  percentage: number;
  location?: string;
}

export interface BandwidthStats {
  current: number;
  average: number;
  peak: number;
  utilization: number; // percentage
  capacity: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface GeographicStats {
  country: string;
  region: string;
  flows: number;
  bytes: number;
  percentage: number;
  coordinates: [number, number];
}

// ML Model Management Types
export interface MLModel {
  id: string;
  name: string;
  type: 'anomaly_detection' | 'classification' | 'regression' | 'clustering';
  algorithm: string;
  version: string;
  status: 'training' | 'deployed' | 'testing' | 'archived' | 'failed';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  createdAt: Date;
  lastTrained: Date;
  trainingDataSize: number;
  features: string[];
  hyperparameters: Record<string, unknown>;
  performance: ModelPerformance;
  deployment: ModelDeployment;
}

export interface ModelPerformance {
  trainingAccuracy: number;
  validationAccuracy: number;
  testAccuracy: number;
  confusionMatrix: number[][];
  rocAuc: number;
  trainingTime: number;
  inferenceTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface ModelDeployment {
  environment: 'development' | 'staging' | 'production';
  endpoint: string;
  replicas: number;
  resources: {
    cpu: string;
    memory: string;
    gpu?: string;
  };
  autoscaling: {
    enabled: boolean;
    minReplicas: number;
    maxReplicas: number;
    targetCpuUtilization: number;
  };
}

export interface TrainingJob {
  id: string;
  modelId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  startTime: Date;
  endTime?: Date;
  duration?: number;
  logs: string[];
  metrics: TrainingMetrics;
  config: TrainingConfig;
}

export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  validationLoss: number;
  validationAccuracy: number;
  learningRate: number;
}

export interface TrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  optimizer: string;
  lossFunction: string;
  validationSplit: number;
  earlyStopping: boolean;
  patience: number;
}
