'use client';

import { Suspense, useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NetworkTopology, AnomalyDetection, NetworkNode } from '@/types';
import { formatBytes } from '@/lib/utils';

interface NetworkVisualizationProps {
  topology: NetworkTopology;
  anomalies: AnomalyDetection[];
}

// Enhanced node tooltip component
interface NodeTooltipProps {
  node: NetworkNode;
  isAnomalous: boolean;
  anomaly?: AnomalyDetection;
}

function NodeTooltip({ node, isAnomalous, anomaly }: NodeTooltipProps) {
  return (
    <div className="bg-black/90 text-white p-3 rounded-lg shadow-lg border border-white/20 min-w-[200px]">
      <div className="font-bold text-sm mb-2">{node.hostname || node.ip}</div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>IP:</span>
          <span className="font-mono">{node.ip}</span>
        </div>
        <div className="flex justify-between">
          <span>Type:</span>
          <span className="capitalize">{node.type}</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={`capitalize ${
            node.status === 'normal' ? 'text-green-400' :
            node.status === 'warning' ? 'text-yellow-400' :
            node.status === 'critical' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {node.status}
          </span>
        </div>
        {node.metrics.cpu !== undefined && (
          <div className="flex justify-between">
            <span>CPU:</span>
            <span>{node.metrics.cpu.toFixed(1)}%</span>
          </div>
        )}
        {node.metrics.memory !== undefined && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span>{node.metrics.memory.toFixed(1)}%</span>
          </div>
        )}
        {node.metrics.connections !== undefined && (
          <div className="flex justify-between">
            <span>Connections:</span>
            <span>{node.metrics.connections}</span>
          </div>
        )}
        {isAnomalous && anomaly && (
          <>
            <hr className="border-red-500/30 my-2" />
            <div className="text-red-400 font-bold">⚠️ ANOMALY DETECTED</div>
            <div className="text-xs">
              <div>Type: {anomaly.type}</div>
              <div>Severity: {anomaly.severity}</div>
              <div>Confidence: {(anomaly.confidence * 100).toFixed(1)}%</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Enhanced Network Node Component with hover effects
function NetworkNodeComponent({
  node,
  isAnomalous,
  anomaly,
  onHover,
  onUnhover
}: {
  node: NetworkNode;
  isAnomalous: boolean;
  anomaly?: AnomalyDetection;
  onHover: (node: NetworkNode, anomaly?: AnomalyDetection) => void;
  onUnhover: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      const baseY = node.position[1];
      meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.5 + node.position[0]) * 0.1;

      // Pulse animation for anomalous nodes
      if (isAnomalous) {
        const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
        meshRef.current.scale.setScalar(pulseScale);

        // Glow effect for anomalous nodes
        if (glowRef.current) {
          glowRef.current.scale.setScalar(pulseScale * 1.5);
          const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
          (glowRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
        }
      } else if (hovered) {
        // Hover scale effect
        const targetScale = 1.2;
        const currentScale = meshRef.current.scale.x;
        meshRef.current.scale.setScalar(THREE.MathUtils.lerp(currentScale, targetScale, 0.1));
      } else {
        // Return to normal scale
        const currentScale = meshRef.current.scale.x;
        meshRef.current.scale.setScalar(THREE.MathUtils.lerp(currentScale, 1, 0.1));
      }
    }
  });

  const getNodeColor = () => {
    if (isAnomalous) {
      switch (anomaly?.severity) {
        case 'critical': return '#ef4444';
        case 'high': return '#f97316';
        case 'medium': return '#eab308';
        case 'low': return '#3b82f6';
        default: return '#ef4444';
      }
    }

    switch (node.status) {
      case 'normal': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'offline': return '#6b7280';
      default: return '#10b981';
    }
  };

  const getNodeSize = () => {
    const baseSize = {
      'server': 0.4,
      'router': 0.35,
      'switch': 0.3,
      'firewall': 0.45,
      'client': 0.25,
    }[node.type] || 0.3;

    return baseSize;
  };

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    onHover(node, anomaly);
    document.body.style.cursor = 'pointer';
  }, [node, anomaly, onHover]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    onUnhover();
    document.body.style.cursor = 'default';
  }, [onUnhover]);

  return (
    <group position={node.position}>
      {/* Glow effect for anomalous nodes */}
      {isAnomalous && (
        <Sphere ref={glowRef} args={[getNodeSize() * 1.5, 16, 16]}>
          <meshBasicMaterial
            color={getNodeColor()}
            transparent
            opacity={0.2}
          />
        </Sphere>
      )}

      {/* Main node sphere */}
      <Sphere
        ref={meshRef}
        args={[getNodeSize(), 32, 32]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          color={getNodeColor()}
          emissive={isAnomalous ? getNodeColor() : '#000000'}
          emissiveIntensity={isAnomalous ? 0.4 : (hovered ? 0.2 : 0)}
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.1}
        />
      </Sphere>

      {/* Node type icon/shape overlay */}
      {node.type === 'firewall' && (
        <Sphere args={[getNodeSize() * 0.6, 8, 8]} position={[0, 0, getNodeSize() * 0.1]}>
          <meshBasicMaterial color="#ff6b6b" transparent opacity={0.8} />
        </Sphere>
      )}

      {/* Node label */}
      <Text
        position={[0, getNodeSize() + 0.4, 0]}
        fontSize={0.12}
        color={hovered ? "#ffffff" : "#cccccc"}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {node.ip.split('.').slice(-1)[0]}
      </Text>

      {/* Node type indicator */}
      <Text
        position={[0, -getNodeSize() - 0.3, 0]}
        fontSize={0.08}
        color={hovered ? "#aaaaaa" : "#666666"}
        anchorX="center"
        anchorY="middle"
      >
        {node.type.toUpperCase()}
      </Text>

      {/* Status indicator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[getNodeSize() * 1.1, getNodeSize() * 1.2, 16]} />
        <meshBasicMaterial
          color={getNodeColor()}
          transparent
          opacity={hovered ? 0.8 : 0.4}
        />
      </mesh>
    </group>
  );
}

// Enhanced Network Edge Component
function NetworkEdgeComponent({
  start,
  end,
  status,
  bandwidth = 0,
  utilization = 0
}: {
  start: [number, number, number];
  end: [number, number, number];
  status: string;
  bandwidth?: number;
  utilization?: number;
}) {
  const lineRef = useRef<THREE.Line>(null);

  useFrame((state) => {
    if (lineRef.current && status === 'active') {
      // Subtle pulsing for active connections
      const opacity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = opacity;
    }
  });

  const getEdgeColor = () => {
    switch (status) {
      case 'active': return '#10b981';
      case 'congested': return '#f59e0b';
      case 'inactive': return '#374151';
      default: return '#10b981';
    }
  };

  const getLineWidth = () => {
    const baseWidth = 1;
    const utilizationMultiplier = 1 + (utilization / 100) * 2;
    return Math.max(baseWidth, baseWidth * utilizationMultiplier);
  };

  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end]);

  return (
    <Line
      ref={lineRef}
      points={points}
      color={getEdgeColor()}
      lineWidth={getLineWidth()}
      transparent
      opacity={status === 'active' ? 0.6 : 0.3}
    />
  );
}

// Enhanced Data Flow Animation Component
function DataFlowParticle({
  start,
  end,
  speed = 1,
  color = '#3b82f6',
  size = 0.05,
  delay = 0
}: {
  start: [number, number, number];
  end: [number, number, number];
  speed?: number;
  color?: string;
  size?: number;
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);
  const [trailPositions, setTrailPositions] = useState<THREE.Vector3[]>([]);

  useFrame((state) => {
    if (meshRef.current) {
      const adjustedTime = state.clock.elapsedTime * speed + delay;
      const t = (Math.sin(adjustedTime) + 1) / 2;

      const startVec = new THREE.Vector3(...start);
      const endVec = new THREE.Vector3(...end);
      const currentPos = new THREE.Vector3().lerpVectors(startVec, endVec, t);

      meshRef.current.position.copy(currentPos);

      // Update trail
      setTrailPositions(prev => {
        const newTrail = [currentPos.clone(), ...prev.slice(0, 8)];
        return newTrail;
      });

      // Fade effect based on position
      const opacity = 0.3 + Math.sin(adjustedTime * 2) * 0.4;
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0.1, opacity);
    }
  });

  return (
    <group>
      {/* Main particle */}
      <Sphere ref={meshRef} args={[size, 8, 8]}>
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </Sphere>

      {/* Particle trail */}
      {trailPositions.length > 1 && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={trailPositions.length}
              array={new Float32Array(trailPositions.flatMap(pos => [pos.x, pos.y, pos.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color={color}
            size={size * 0.5}
            transparent
            opacity={0.3}
          />
        </points>
      )}
    </group>
  );
}

// Multiple data flow particles for realistic network traffic
function DataFlowAnimation({
  start,
  end,
  isAnomalous = false
}: {
  start: [number, number, number];
  end: [number, number, number];
  isAnomalous?: boolean;
}) {
  const particleCount = isAnomalous ? 8 : 3;
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      speed: 0.5 + Math.random() * 1.5,
      color: isAnomalous ? '#ef4444' : ['#3b82f6', '#10b981', '#8b5cf6'][i % 3],
      size: isAnomalous ? 0.08 : 0.04 + Math.random() * 0.02,
      delay: i * (Math.PI / particleCount)
    }));
  }, [isAnomalous, particleCount]);

  return (
    <group>
      {particles.map(particle => (
        <DataFlowParticle
          key={particle.id}
          start={start}
          end={end}
          speed={particle.speed}
          color={particle.color}
          size={particle.size}
          delay={particle.delay}
        />
      ))}
    </group>
  );
}

// Main 3D Scene Component
function NetworkScene({ topology, anomalies }: NetworkVisualizationProps) {
  // Create anomaly lookup for quick access
  const anomalyMap = useMemo(() => {
    const map = new Map<string, AnomalyDetection>();
    anomalies.forEach(anomaly => {
      map.set(anomaly.sourceIp, anomaly);
    });
    return map;
  }, [anomalies]);

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Network nodes */}
      {topology.nodes.map((node) => {
        const anomaly = anomalyMap.get(node.ip);
        return (
          <NetworkNodeComponent
            key={node.id}
            node={node}
            isAnomalous={!!anomaly}
            anomalySeverity={anomaly?.severity}
          />
        );
      })}

      {/* Network edges */}
      {topology.edges.map((edge) => {
        const sourceNode = topology.nodes.find(n => n.id === edge.source);
        const targetNode = topology.nodes.find(n => n.id === edge.target);
        
        if (!sourceNode || !targetNode) return null;
        
        return (
          <NetworkEdgeComponent
            key={edge.id}
            start={sourceNode.position}
            end={targetNode.position}
            status={edge.status}
          />
        );
      })}

      {/* Data flow animations */}
      {topology.edges.slice(0, 5).map((edge, index) => {
        const sourceNode = topology.nodes.find(n => n.id === edge.source);
        const targetNode = topology.nodes.find(n => n.id === edge.target);
        
        if (!sourceNode || !targetNode) return null;
        
        return (
          <DataFlowAnimation
            key={`flow-${index}`}
            start={sourceNode.position}
            end={targetNode.position}
          />
        );
      })}

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Loading component
function NetworkVisualizationLoading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading 3D Network...</p>
      </div>
    </div>
  );
}

// Main component
export function NetworkVisualization({ topology, anomalies }: NetworkVisualizationProps) {
  const activeAnomalies = anomalies.filter(a => a.status === 'active');
  
  return (
    <Card className="h-[600px] relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          3D Network Topology
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {topology.nodes.length} Nodes
          </Badge>
          <Badge variant="outline">
            {topology.edges.length} Connections
          </Badge>
          {activeAnomalies.length > 0 && (
            <Badge variant="danger" className="animate-pulse">
              {activeAnomalies.length} Anomalies
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 h-[calc(100%-80px)]">
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 rounded-lg">
          <Canvas
            camera={{ position: [15, 15, 15], fov: 60 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <NetworkScene topology={topology} anomalies={anomalies} />
            </Suspense>
          </Canvas>
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 space-y-2">
          <div className="text-xs font-semibold text-foreground mb-2">Legend</div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">Normal</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-muted-foreground">Warning</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">Anomaly</span>
          </div>
        </div>
        
        {/* Controls hint */}
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-3">
          <div className="text-xs text-muted-foreground">
            <div>🖱️ Drag to rotate</div>
            <div>🔍 Scroll to zoom</div>
            <div>⌨️ Right-click to pan</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
