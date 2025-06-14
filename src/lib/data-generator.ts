import { 
  NetworkNode, 
  NetworkFlow, 
  AnomalyDetection, 
  Alarm, 
  NetworkTopology,
  NetworkEdge,
  AttackScenario 
} from '@/types';
import { generateRandomIP } from './utils';

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

  // Generate realistic enterprise network topology
  generateTopology(): NetworkTopology {
    const nodes: NetworkNode[] = [];
    const edges: NetworkEdge[] = [];

    // Core Infrastructure
    const coreRouter = this.createSpecificNode('core-router-01', '10.0.0.1', 'core-rtr-01.corp.local', 'router', 'normal', [0, 0, 0]);
    const coreSwitch = this.createSpecificNode('core-switch-01', '10.0.0.10', 'core-sw-01.corp.local', 'switch', 'normal', [4, 0, 0]);
    const firewall = this.createSpecificNode('firewall-01', '10.0.0.254', 'fw-01.corp.local', 'firewall', 'normal', [-4, 0, 0]);

    nodes.push(coreRouter, coreSwitch, firewall);

    // DMZ Servers
    const webServer = this.createSpecificNode('web-server-01', '192.168.100.10', 'web-01.dmz.local', 'server', 'normal', [-6, 2, 2]);
    const mailServer = this.createSpecificNode('mail-server-01', '192.168.100.20', 'mail-01.dmz.local', 'server', 'warning', [-6, -2, 2]);
    const dnsServer = this.createSpecificNode('dns-server-01', '192.168.100.30', 'dns-01.dmz.local', 'server', 'normal', [-6, 0, 4]);

    nodes.push(webServer, mailServer, dnsServer);

    // Internal Servers
    const dbServer = this.createSpecificNode('db-server-01', '10.1.0.10', 'db-01.internal.local', 'server', 'critical', [6, 2, 2]);
    const appServer = this.createSpecificNode('app-server-01', '10.1.0.20', 'app-01.internal.local', 'server', 'normal', [6, -2, 2]);
    const fileServer = this.createSpecificNode('file-server-01', '10.1.0.30', 'file-01.internal.local', 'server', 'normal', [6, 0, 4]);

    nodes.push(dbServer, appServer, fileServer);

    // Department Switches
    const hrSwitch = this.createSpecificNode('hr-switch-01', '10.2.1.1', 'hr-sw-01.corp.local', 'switch', 'normal', [2, 4, -2]);
    const itSwitch = this.createSpecificNode('it-switch-01', '10.2.2.1', 'it-sw-01.corp.local', 'switch', 'normal', [2, -4, -2]);
    const financeSwitch = this.createSpecificNode('finance-switch-01', '10.2.3.1', 'fin-sw-01.corp.local', 'switch', 'warning', [-2, 4, -2]);

    nodes.push(hrSwitch, itSwitch, financeSwitch);

    // Workstations
    const hrWs1 = this.createSpecificNode('hr-ws-01', '10.2.1.100', 'hr-ws-01.corp.local', 'client', 'normal', [3, 6, -4]);
    const hrWs2 = this.createSpecificNode('hr-ws-02', '10.2.1.101', 'hr-ws-02.corp.local', 'client', 'normal', [1, 6, -4]);
    const itWs1 = this.createSpecificNode('it-ws-01', '10.2.2.100', 'it-ws-01.corp.local', 'client', 'normal', [3, -6, -4]);
    const itWs2 = this.createSpecificNode('it-ws-02', '10.2.2.101', 'it-ws-02.corp.local', 'client', 'warning', [1, -6, -4]);
    const finWs1 = this.createSpecificNode('finance-ws-01', '10.2.3.100', 'fin-ws-01.corp.local', 'client', 'normal', [-3, 6, -4]);
    const finWs2 = this.createSpecificNode('finance-ws-02', '10.2.3.101', 'fin-ws-02.corp.local', 'client', 'critical', [-1, 6, -4]);

    nodes.push(hrWs1, hrWs2, itWs1, itWs2, finWs1, finWs2);

    // IoT and Edge Devices
    const iotSensor = this.createSpecificNode('iot-sensor-01', '172.16.1.10', 'temp-sensor-01', 'client', 'normal', [0, 2, -6]);
    const iotCamera = this.createSpecificNode('iot-camera-01', '172.16.1.20', 'security-cam-01', 'client', 'normal', [0, -2, -6]);
    const printer = this.createSpecificNode('printer-01', '172.16.2.10', 'printer-01.corp.local', 'client', 'normal', [2, 0, -6]);

    nodes.push(iotSensor, iotCamera, printer);

    // Guest Network
    const guestAp = this.createSpecificNode('guest-ap-01', '192.168.200.1', 'guest-ap-01', 'router', 'normal', [-2, -4, -2]);
    const guestDevice = this.createSpecificNode('guest-device-01', '192.168.200.100', 'guest-laptop-01', 'client', 'normal', [-3, -6, -4]);

    nodes.push(guestAp, guestDevice);

    // Backup and Storage
    const backupServer = this.createSpecificNode('backup-server-01', '10.1.1.10', 'backup-01.internal.local', 'server', 'normal', [8, 0, 0]);
    const nas = this.createSpecificNode('nas-01', '10.1.1.20', 'nas-01.internal.local', 'server', 'normal', [8, 2, -2]);

    nodes.push(backupServer, nas);

    // Generate realistic network connections
    const connections = [
      // Core Infrastructure
      [firewall.id, coreRouter.id, 10000, 45.2],
      [coreRouter.id, coreSwitch.id, 10000, 67.8],

      // DMZ Connections
      [firewall.id, webServer.id, 1000, 78.5],
      [firewall.id, mailServer.id, 1000, 89.3],
      [firewall.id, dnsServer.id, 1000, 34.2],

      // Internal Server Connections
      [coreSwitch.id, dbServer.id, 1000, 95.7],
      [coreSwitch.id, appServer.id, 1000, 67.4],
      [coreSwitch.id, fileServer.id, 1000, 45.8],

      // Department Switches
      [coreSwitch.id, hrSwitch.id, 1000, 23.7],
      [coreSwitch.id, itSwitch.id, 1000, 31.4],
      [coreSwitch.id, financeSwitch.id, 1000, 89.6],

      // Workstations
      [hrSwitch.id, hrWs1.id, 100, 45.2],
      [hrSwitch.id, hrWs2.id, 100, 32.1],
      [itSwitch.id, itWs1.id, 100, 78.9],
      [itSwitch.id, itWs2.id, 100, 91.7],
      [financeSwitch.id, finWs1.id, 100, 56.3],
      [financeSwitch.id, finWs2.id, 100, 98.4],

      // IoT Devices
      [coreRouter.id, iotSensor.id, 10, 5.2],
      [coreRouter.id, iotCamera.id, 100, 23.7],
      [hrSwitch.id, printer.id, 100, 8.9],

      // Guest Network
      [firewall.id, guestAp.id, 100, 34.5],
      [guestAp.id, guestDevice.id, 100, 67.2],

      // Storage
      [coreSwitch.id, backupServer.id, 1000, 23.4],
      [coreSwitch.id, nas.id, 1000, 12.8],

      // Cross-connections
      [dbServer.id, appServer.id, 1000, 45.6],
      [appServer.id, fileServer.id, 1000, 34.7],
      [backupServer.id, nas.id, 1000, 67.8]
    ];

    // Create edges from connections
    connections.forEach(([sourceId, targetId, bandwidth, utilization], index) => {
      const status = utilization > 85 ? 'congested' : utilization < 10 ? 'inactive' : 'active';
      edges.push({
        id: `edge-${index + 1}`,
        source: sourceId as string,
        target: targetId as string,
        type: 'physical',
        bandwidth: bandwidth as number,
        latency: Math.random() * 10 + 1,
        utilization: utilization as number,
        status: status as 'active' | 'inactive' | 'congested'
      });
    });

    return {
      nodes,
      edges,
      lastUpdated: new Date(),
    };
  }

  // Helper method to create specific nodes
  private createSpecificNode(
    id: string,
    ip: string,
    hostname: string,
    type: NetworkNode['type'],
    status: NetworkNode['status'],
    position: [number, number, number]
  ): NetworkNode {
    const baseMetrics = {
      server: { cpu: 60 + Math.random() * 30, memory: 70 + Math.random() * 25, connections: 50 + Math.random() * 100 },
      router: { cpu: 30 + Math.random() * 20, memory: 40 + Math.random() * 20, connections: 100 + Math.random() * 150 },
      switch: { cpu: 15 + Math.random() * 15, memory: 25 + Math.random() * 20, connections: 30 + Math.random() * 70 },
      firewall: { cpu: 40 + Math.random() * 30, memory: 50 + Math.random() * 30, connections: 150 + Math.random() * 100 },
      client: { cpu: 20 + Math.random() * 60, memory: 30 + Math.random() * 50, connections: 5 + Math.random() * 20 }
    };

    const metrics = baseMetrics[type];

    // Adjust metrics based on status
    if (status === 'critical') {
      metrics.cpu = Math.min(95 + Math.random() * 5, 100);
      metrics.memory = Math.min(90 + Math.random() * 10, 100);
    } else if (status === 'warning') {
      metrics.cpu = Math.min(80 + Math.random() * 15, 95);
      metrics.memory = Math.min(75 + Math.random() * 20, 90);
    }

    return {
      id,
      ip,
      hostname,
      type,
      position,
      status,
      metrics: {
        cpu: metrics.cpu,
        memory: metrics.memory,
        bandwidth: Math.random() * 1000,
        connections: Math.floor(metrics.connections),
      },
      lastSeen: new Date(),
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
