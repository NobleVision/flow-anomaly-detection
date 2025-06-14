'use client';

import { Suspense, useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NetworkTopology, AnomalyDetection, NetworkNode } from '@/types';


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

  utilization = 0
}: {
  start: [number, number, number];
  end: [number, number, number];
  status: string;

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

      {/* Particle trail - simplified for now */}
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

// Enhanced Scene Environment
function SceneEnvironment() {
  return (
    <>
      {/* Advanced lighting setup */}
      <ambientLight intensity={0.3} color="#1e293b" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color="#ffffff"
      />
      <pointLight position={[-10, 5, -10]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[10, -5, 10]} intensity={0.3} color="#8b5cf6" />

      {/* Subtle fog for depth */}
      <fog attach="fog" args={['#0f172a', 20, 100]} />

      {/* Grid helper for reference */}
      <gridHelper args={[20, 20, '#1e293b', '#334155']} position={[0, -5, 0]} />
    </>
  );
}

// Main 3D Scene Component
function NetworkScene({
  topology,
  anomalies,
  onNodeHover,
  onNodeUnhover
}: NetworkVisualizationProps & {
  onNodeHover: (node: NetworkNode, anomaly?: AnomalyDetection) => void;
  onNodeUnhover: () => void;
}) {

  // Create anomaly lookup for quick access
  const anomalyMap = useMemo(() => {
    const map = new Map<string, AnomalyDetection>();
    anomalies.forEach(anomaly => {
      map.set(anomaly.sourceIp, anomaly);
    });
    return map;
  }, [anomalies]);

  // Enhanced edge filtering for better performance
  const activeEdges = useMemo(() =>
    topology.edges.filter(edge => edge.status === 'active'),
    [topology.edges]
  );

  const anomalousEdges = useMemo(() =>
    topology.edges.filter(edge => {
      const sourceNode = topology.nodes.find(n => n.id === edge.source);
      const targetNode = topology.nodes.find(n => n.id === edge.target);
      return sourceNode && targetNode &&
             (anomalyMap.has(sourceNode.ip) || anomalyMap.has(targetNode.ip));
    }),
    [topology.edges, topology.nodes, anomalyMap]
  );



  return (
    <>
      <SceneEnvironment />

      {/* Enhanced Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={40}
        minDistance={8}
        maxPolarAngle={Math.PI * 0.8}
        minPolarAngle={Math.PI * 0.1}
        autoRotate={false}
        autoRotateSpeed={0.5}
        dampingFactor={0.05}
        enableDamping={true}
      />

      {/* Network nodes */}
      {topology.nodes.map((node) => {
        const anomaly = anomalyMap.get(node.ip);
        return (
          <NetworkNodeComponent
            key={node.id}
            node={node}
            isAnomalous={!!anomaly}
            anomaly={anomaly}
            onHover={onNodeHover}
            onUnhover={onNodeUnhover}
          />
        );
      })}

      {/* Normal Network Edges */}
      {activeEdges.map((edge) => {
        const sourceNode = topology.nodes.find(n => n.id === edge.source);
        const targetNode = topology.nodes.find(n => n.id === edge.target);

        if (!sourceNode || !targetNode) return null;

        return (
          <NetworkEdgeComponent
            key={edge.id}
            start={sourceNode.position}
            end={targetNode.position}
            status={edge.status}
            bandwidth={edge.bandwidth}
            utilization={edge.utilization}
          />
        );
      })}

      {/* Data Flow Animations for normal traffic */}
      {activeEdges.slice(0, 8).map((edge, index) => {
        const sourceNode = topology.nodes.find(n => n.id === edge.source);
        const targetNode = topology.nodes.find(n => n.id === edge.target);

        if (!sourceNode || !targetNode) return null;

        return (
          <DataFlowAnimation
            key={`flow-${index}`}
            start={sourceNode.position}
            end={targetNode.position}
            isAnomalous={false}
          />
        );
      })}

      {/* Enhanced Data Flow for Anomalous Connections */}
      {anomalousEdges.map((edge, index) => {
        const sourceNode = topology.nodes.find(n => n.id === edge.source);
        const targetNode = topology.nodes.find(n => n.id === edge.target);

        if (!sourceNode || !targetNode) return null;

        return (
          <DataFlowAnimation
            key={`anomaly-flow-${index}`}
            start={sourceNode.position}
            end={targetNode.position}
            isAnomalous={true}
          />
        );
      })}

      {/* Note: Hover tooltip moved outside Canvas to avoid R3F HTML issues */}
    </>
  );
}

// 3D Loading component (for use inside Canvas)
function NetworkVisualizationLoading() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[0.5, 8, 8]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#3b82f6" wireframe />
      </Sphere>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Loading...
      </Text>
    </group>
  );
}

// Main component
export function NetworkVisualization({ topology, anomalies }: NetworkVisualizationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<{node: NetworkNode, anomaly?: AnomalyDetection} | null>(null);
  const activeAnomalies = anomalies.filter(a => a.status === 'active');

  // Simulate loading
  useMemo(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleNodeHover = useCallback((node: NetworkNode, anomaly?: AnomalyDetection) => {
    setHoveredNode({ node, anomaly });
  }, []);

  const handleNodeUnhover = useCallback(() => {
    setHoveredNode(null);
  }, []);

  return (
    <Card className="h-[600px] relative overflow-hidden">
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            3D Network Topology
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {topology.nodes.length} Nodes
            </Badge>
            <Badge variant="outline" className="text-xs">
              {topology.edges.length} Links
            </Badge>
            {activeAnomalies.length > 0 && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                {activeAnomalies.length} Anomalies
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 h-[calc(100%-80px)] relative">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 rounded-b-lg flex items-center justify-center z-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white/70">Initializing 3D Network...</p>
            </div>
          </div>
        )}

        {/* Hover tooltip */}
        {hoveredNode && (
          <div className="absolute top-4 left-4 z-30 pointer-events-none">
            <NodeTooltip
              node={hoveredNode.node}
              isAnomalous={!!hoveredNode.anomaly}
              anomaly={hoveredNode.anomaly}
            />
          </div>
        )}

        {/* 3D Canvas */}
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 rounded-b-lg">
          <Canvas
            camera={{
              position: [15, 12, 15],
              fov: 50,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance"
            }}
          >
            <Suspense fallback={<NetworkVisualizationLoading />}>
              <NetworkScene
                topology={topology}
                anomalies={anomalies}
                onNodeHover={handleNodeHover}
                onNodeUnhover={handleNodeUnhover}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Enhanced Legend */}
        <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3 text-xs text-white space-y-2">
          <div className="font-bold mb-2">Network Status</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Normal ({topology.nodes.filter(n => n.status === 'normal').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Warning ({topology.nodes.filter(n => n.status === 'warning').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span>Anomaly ({activeAnomalies.length})</span>
          </div>
          <hr className="border-white/20 my-2" />
          <div className="text-xs text-white/70">
            <div>💫 Particles = Data Flow</div>
            <div>🔴 Red Particles = Anomalous Traffic</div>
          </div>
        </div>

        {/* Enhanced Controls hint */}
        <div className="absolute bottom-4 right-4 bg-black/70 rounded-lg p-3">
          <div className="text-xs text-white/70">
            <div className="font-bold text-white mb-1">Controls</div>
            <div>🖱️ Left: Rotate view</div>
            <div>🔍 Wheel: Zoom in/out</div>
            <div>🖱️ Right: Pan camera</div>
            <div>🎯 Hover: Node details</div>
          </div>
        </div>

        {/* Performance indicator */}
        <div className="absolute top-4 right-4 bg-black/70 rounded-lg px-2 py-1">
          <div className="text-xs text-green-400 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>3D Rendering Active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
