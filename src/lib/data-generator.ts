import { 
  NetworkNode, 
  NetworkFlow, 
  AnomalyDetection, 
  Alarm, 
  NetworkTopology,
  NetworkEdge,
  AttackScenario 
} from '@/types';
import { generateRandomIP, generateId } from './utils';

// Predefined IP ranges for realistic network simulation
const INTERNAL_SUBNETS = [
  '192.168.1.',
  '192.168.2.',
  '10.0.1.',
  '10.0.2.',
  '172.16.1.',
];

const EXTERNAL_IPS = [
  '8.8.8.8',
  '1.1.1.1',
  '208.67.222.222',
  '185.228.168.9',
  '76.76.19.19',
];

const COMMON_PORTS = [80, 443, 22, 21, 25, 53, 110, 143, 993, 995, 3389, 5432, 3306];
const MALICIOUS_PORTS = [4444, 6666, 31337, 12345, 54321];

export class NetworkDataGenerator {
  private nodeCounter = 0;
  private flowCounter = 0;
  private anomalyCounter = 0;
  private alarmCounter = 0;

  // Generate network topology
  generateTopology(nodeCount: number = 50): NetworkTopology {
    const nodes: NetworkNode[] = [];
    const edges: NetworkEdge[] = [];

    // Generate nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(this.generateNode());
    }

    // Generate edges (connections between nodes)
    for (let i = 0; i < nodes.length; i++) {
      const connectionsCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < connectionsCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodes.length);
        if (targetIndex !== i) {
          edges.push(this.generateEdge(nodes[i].id, nodes[targetIndex].id));
        }
      }
    }

    return {
      nodes,
      edges,
      lastUpdated: new Date(),
    };
  }

  // Generate a single network node
  generateNode(): NetworkNode {
    const types: NetworkNode['type'][] = ['server', 'client', 'router', 'switch', 'firewall'];
    const statuses: NetworkNode['status'][] = ['normal', 'warning', 'critical', 'offline'];
    
    const subnet = INTERNAL_SUBNETS[Math.floor(Math.random() * INTERNAL_SUBNETS.length)];
    const lastOctet = Math.floor(Math.random() * 254) + 1;
    
    return {
      id: `node-${++this.nodeCounter}`,
      ip: `${subnet}${lastOctet}`,
      hostname: `host-${this.nodeCounter}.local`,
      type: types[Math.floor(Math.random() * types.length)],
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ],
      status: Math.random() > 0.1 ? 'normal' : statuses[Math.floor(Math.random() * statuses.length)],
      metrics: {
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        bandwidth: Math.random() * 1000,
        connections: Math.floor(Math.random() * 100),
      },
      lastSeen: new Date(),
    };
  }

  // Generate network edge
  generateEdge(sourceId: string, targetId: string): NetworkEdge {
    const types: NetworkEdge['type'][] = ['physical', 'logical', 'flow'];
    const statuses: NetworkEdge['status'][] = ['active', 'inactive', 'congested'];

    return {
      id: `edge-${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      type: types[Math.floor(Math.random() * types.length)],
      bandwidth: Math.random() * 1000,
      latency: Math.random() * 100,
      utilization: Math.random() * 100,
      status: Math.random() > 0.1 ? 'active' : statuses[Math.floor(Math.random() * statuses.length)],
    };
  }

  // Generate network flow
  generateFlow(isAnomalous: boolean = false): NetworkFlow {
    const protocols: NetworkFlow['protocol'][] = ['TCP', 'UDP', 'ICMP'];
    
    const sourceSubnet = INTERNAL_SUBNETS[Math.floor(Math.random() * INTERNAL_SUBNETS.length)];
    const sourceIp = `${sourceSubnet}${Math.floor(Math.random() * 254) + 1}`;
    
    let destinationIp: string;
    let destinationPort: number;
    
    if (isAnomalous) {
      // Generate anomalous traffic
      destinationIp = Math.random() > 0.5 
        ? EXTERNAL_IPS[Math.floor(Math.random() * EXTERNAL_IPS.length)]
        : generateRandomIP();
      destinationPort = Math.random() > 0.5 
        ? MALICIOUS_PORTS[Math.floor(Math.random() * MALICIOUS_PORTS.length)]
        : Math.floor(Math.random() * 65535);
    } else {
      // Generate normal traffic
      destinationIp = Math.random() > 0.3 
        ? `${INTERNAL_SUBNETS[Math.floor(Math.random() * INTERNAL_SUBNETS.length)]}${Math.floor(Math.random() * 254) + 1}`
        : EXTERNAL_IPS[Math.floor(Math.random() * EXTERNAL_IPS.length)];
      destinationPort = COMMON_PORTS[Math.floor(Math.random() * COMMON_PORTS.length)];
    }

    return {
      id: `flow-${++this.flowCounter}`,
      sourceIp,
      destinationIp,
      sourcePort: Math.floor(Math.random() * 65535),
      destinationPort,
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      bytes: isAnomalous 
        ? Math.floor(Math.random() * 10000000) + 1000000 // Large transfers for anomalies
        : Math.floor(Math.random() * 100000) + 100,
      packets: Math.floor(Math.random() * 1000) + 1,
      duration: Math.floor(Math.random() * 30000) + 100,
      timestamp: new Date(),
      flags: Math.random() > 0.7 ? ['SYN', 'ACK'] : undefined,
    };
  }

  // Generate anomaly detection
  generateAnomaly(flow: NetworkFlow): AnomalyDetection {
    const types: AnomalyDetection['type'][] = ['volume', 'pattern', 'protocol', 'geographic', 'temporal'];
    const severities: AnomalyDetection['severity'][] = ['low', 'medium', 'high', 'critical'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];

    return {
      id: `anomaly-${++this.anomalyCounter}`,
      flowId: flow.id,
      type,
      severity,
      confidence: 0.7 + Math.random() * 0.3, // High confidence for demo
      description: this.getAnomalyDescription(type, severity),
      detectedAt: new Date(),
      sourceIp: flow.sourceIp,
      destinationIp: flow.destinationIp,
      metrics: {
        expectedValue: type === 'volume' ? 1000 : undefined,
        actualValue: type === 'volume' ? flow.bytes : Math.random() * 100,
        threshold: type === 'volume' ? 5000 : 0.8,
        deviation: Math.random() * 10,
      },
      mlModel: {
        name: 'Conv-LSTM Autoencoder',
        version: '2.1.0',
        accuracy: 0.94 + Math.random() * 0.05,
      },
      status: 'active',
    };
  }

  // Generate alarm from anomaly
  generateAlarm(anomaly: AnomalyDetection): Alarm {
    return {
      id: `alarm-${++this.alarmCounter}`,
      anomalyId: anomaly.id,
      title: `${anomaly.type.toUpperCase()} Anomaly Detected`,
      description: `${anomaly.description} (Confidence: ${(anomaly.confidence * 100).toFixed(1)}%)`,
      severity: anomaly.severity,
      status: 'open',
      createdAt: anomaly.detectedAt,
      updatedAt: anomaly.detectedAt,
      tags: [anomaly.type, anomaly.severity, 'auto-detected'],
      actions: [],
    };
  }

  // Generate DDoS attack scenario
  generateDDoSAttack(targetIp: string, duration: number = 60): AttackScenario {
    return {
      id: `attack-ddos-${Date.now()}`,
      name: 'DDoS Attack Simulation',
      type: 'ddos',
      duration,
      intensity: 8,
      targetNodes: [targetIp],
      description: `Simulated DDoS attack targeting ${targetIp} with high volume traffic from multiple sources`,
    };
  }

  // Generate port scan scenario
  generatePortScan(targetIp: string): AttackScenario {
    return {
      id: `attack-portscan-${Date.now()}`,
      name: 'Port Scan Detection',
      type: 'port_scan',
      duration: 30,
      intensity: 6,
      targetNodes: [targetIp],
      description: `Port scanning activity detected against ${targetIp}`,
    };
  }

  private getAnomalyDescription(type: string, severity: string): string {
    const descriptions = {
      volume: `Unusual ${severity} traffic volume detected`,
      pattern: `Abnormal ${severity} communication pattern identified`,
      protocol: `Suspicious ${severity} protocol usage observed`,
      geographic: `Unexpected ${severity} geographic traffic source`,
      temporal: `Anomalous ${severity} timing pattern detected`,
    };
    
    return descriptions[type as keyof typeof descriptions] || 'Unknown anomaly type';
  }

  // Reset counters
  reset(): void {
    this.nodeCounter = 0;
    this.flowCounter = 0;
    this.anomalyCounter = 0;
    this.alarmCounter = 0;
  }
}

// Singleton instance
export const dataGenerator = new NetworkDataGenerator();
