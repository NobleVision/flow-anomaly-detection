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

// NetFlow Integration Types
export interface NetFlowCollector {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  protocol: 'netflow-v5' | 'netflow-v9' | 'ipfix' | 'sflow';
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  version: string;
  lastSeen: Date;
  flowsPerSecond: number;
  totalFlows: number;
  bytesReceived: number;
  packetsReceived: number;
  uptime: number;
  location?: string;
  vendor?: string;
  configuration: NetFlowConfig;
  statistics: CollectorStatistics;
}

export interface NetFlowConfig {
  samplingRate: number;
  activeTimeout: number;
  inactiveTimeout: number;
  templateRefreshRate: number;
  maxFlowsPerPacket: number;
  enableIPv6: boolean;
  enableMPLS: boolean;
  enableVLAN: boolean;
  exportFormat: 'json' | 'binary' | 'csv';
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
}

export interface CollectorStatistics {
  packetsReceived: number;
  packetsDropped: number;
  flowsProcessed: number;
  flowsFiltered: number;
  templatesReceived: number;
  errorsCount: number;
  averageProcessingTime: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
}

export interface NetFlowTemplate {
  id: number;
  version: string;
  sourceId: string;
  fieldCount: number;
  fields: NetFlowField[];
  receivedAt: Date;
  lastUsed: Date;
  usageCount: number;
}

export interface NetFlowField {
  type: number;
  length: number;
  name: string;
  description: string;
  dataType: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'ipv4' | 'ipv6' | 'mac' | 'string';
}

export interface NetFlowRecord {
  id: string;
  collectorId: string;
  templateId: number;
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: number;
  protocolName: string;
  flowStartTime: Date;
  flowEndTime: Date;
  duration: number;
  packets: number;
  bytes: number;
  flags: number;
  tos: number;
  inputInterface: number;
  outputInterface: number;
  nextHop: string;
  sourceAS: number;
  destinationAS: number;
  sourceMask: number;
  destinationMask: number;
  vlanId?: number;
  mplsLabel?: number;
  engineType?: number;
  engineId?: number;
  samplingInterval?: number;
  samplingAlgorithm?: number;
  flowSequence?: number;
  rawData: Record<string, unknown>;
}

export interface DataIngestionPipeline {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'maintenance';
  type: 'netflow' | 'sflow' | 'ipfix' | 'pcap' | 'api';
  source: string;
  destination: string;
  throughput: number;
  recordsProcessed: number;
  recordsFiltered: number;
  recordsStored: number;
  errorCount: number;
  lastProcessed: Date;
  configuration: PipelineConfig;
  filters: DataFilter[];
  transformations: DataTransformation[];
  outputs: DataOutput[];
}

export interface PipelineConfig {
  batchSize: number;
  processingInterval: number;
  retryAttempts: number;
  timeoutSeconds: number;
  enableDeduplication: boolean;
  enableValidation: boolean;
  enableEnrichment: boolean;
  enableCompression: boolean;
  bufferSize: number;
  parallelWorkers: number;
}

export interface DataFilter {
  id: string;
  name: string;
  type: 'include' | 'exclude' | 'transform';
  field: string;
  operator: 'equals' | 'contains' | 'regex' | 'range' | 'in' | 'not_in';
  value: string | number | boolean | string[] | number[];
  enabled: boolean;
}

export interface DataTransformation {
  id: string;
  name: string;
  type: 'field_mapping' | 'enrichment' | 'aggregation' | 'normalization';
  sourceField: string;
  targetField: string;
  transformation: string;
  parameters: Record<string, unknown>;
  enabled: boolean;
}

export interface DataOutput {
  id: string;
  name: string;
  type: 'elasticsearch' | 'kafka' | 'database' | 'file' | 'api';
  endpoint: string;
  configuration: Record<string, unknown>;
  enabled: boolean;
  recordsSent: number;
  lastSent: Date;
  errorCount: number;
}

// Advanced Security Types
export interface ThreatIntelligence {
  id: string;
  source: string;
  type: 'ip' | 'domain' | 'hash' | 'url' | 'signature';
  value: string;
  category: 'malware' | 'botnet' | 'phishing' | 'c2' | 'tor' | 'proxy' | 'scanner';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  firstSeen: Date;
  lastSeen: Date;
  description: string;
  tags: string[];
  references: string[];
  ttl: number;
  isActive: boolean;
}

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'intrusion' | 'malware' | 'data_exfiltration' | 'lateral_movement' | 'privilege_escalation' | 'reconnaissance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  destination: string;
  description: string;
  indicators: ThreatIntelligence[];
  mitreTactics: string[];
  mitreId?: string;
  riskScore: number;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  evidence: SecurityEvidence[];
  relatedEvents: string[];
}

export interface SecurityEvidence {
  id: string;
  type: 'network_flow' | 'dns_query' | 'http_request' | 'file_hash' | 'process' | 'registry';
  data: Record<string, unknown>;
  timestamp: Date;
  source: string;
}

export interface BehavioralProfile {
  id: string;
  entityId: string;
  entityType: 'user' | 'device' | 'application' | 'network_segment';
  entityName: string;
  profileType: 'baseline' | 'anomaly' | 'threat';
  timeWindow: string;
  metrics: BehavioralMetrics;
  patterns: BehavioralPattern[];
  anomalies: BehavioralAnomaly[];
  riskScore: number;
  lastUpdated: Date;
  confidence: number;
}

export interface BehavioralMetrics {
  trafficVolume: {
    average: number;
    peak: number;
    variance: number;
  };
  connectionPatterns: {
    uniqueDestinations: number;
    averageSessionDuration: number;
    protocolDistribution: Record<string, number>;
  };
  temporalPatterns: {
    activeHours: number[];
    weekdayActivity: number[];
    seasonality: number;
  };
  geographicPatterns: {
    countries: string[];
    suspiciousLocations: number;
    travelVelocity: number;
  };
}

export interface BehavioralPattern {
  id: string;
  type: 'temporal' | 'volumetric' | 'protocol' | 'geographic' | 'application';
  description: string;
  frequency: number;
  confidence: number;
  isNormal: boolean;
  parameters: Record<string, unknown>;
}

export interface BehavioralAnomaly {
  id: string;
  type: 'volume_spike' | 'unusual_time' | 'new_destination' | 'protocol_change' | 'geographic_anomaly';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timestamp: Date;
  deviation: number;
  baseline: number;
  observed: number;
  context: Record<string, unknown>;
}

export interface SecurityDashboard {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  activeThreats: number;
  blockedAttacks: number;
  investigatingEvents: number;
  riskScore: number;
  topThreats: SecurityEvent[];
  threatTrends: ThreatTrend[];
  geographicThreats: GeographicThreat[];
  mitreAttackMap: MitreAttackTechnique[];
}

export interface ThreatTrend {
  date: Date;
  threatCount: number;
  severity: Record<string, number>;
  categories: Record<string, number>;
}

export interface GeographicThreat {
  country: string;
  countryCode: string;
  threatCount: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  coordinates: [number, number];
}

export interface MitreAttackTechnique {
  id: string;
  name: string;
  tactic: string;
  description: string;
  detectionCount: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastDetected: Date;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  type: 'detection' | 'prevention' | 'response' | 'compliance';
  status: 'active' | 'inactive' | 'testing';
  rules: SecurityRule[];
  priority: number;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  appliedTo: string[];
}

export interface SecurityRule {
  id: string;
  name: string;
  condition: string;
  action: 'alert' | 'block' | 'quarantine' | 'log';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  parameters: Record<string, unknown>;
}
