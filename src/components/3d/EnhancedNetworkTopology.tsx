'use client';

import { Suspense, useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NetworkTopology, AnomalyDetection, NetworkNode, NetworkEdge } from '@/types';
import { Search, Zap, Activity, Shield, Server } from 'lucide-react';

interface EnhancedNetworkTopologyProps {
  topology: NetworkTopology;
  anomalies: AnomalyDetection[];
}

interface FilterState {
  nodeTypes: string[];
  statuses: string[];
  showAnomalies: boolean;
  showNormal: boolean;
  searchTerm: string;
}

interface NetworkPath {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  totalLatency: number;
  totalHops: number;
}

// Enhanced node tooltip with more detailed information
interface EnhancedNodeTooltipProps {
  node: NetworkNode;
  isAnomalous: boolean;
  anomaly?: AnomalyDetection;
  connectedNodes: number;
  pathInfo?: NetworkPath | null;
}

function EnhancedNodeTooltip({ node, isAnomalous, anomaly, connectedNodes, pathInfo }: EnhancedNodeTooltipProps) {
  return (
    <div className="bg-black/95 text-white p-4 rounded-lg shadow-xl border border-white/20 min-w-[280px] max-w-[400px]">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${
          isAnomalous ? 'bg-red-500 animate-pulse' :
          node.status === 'normal' ? 'bg-green-500' :
          node.status === 'warning' ? 'bg-yellow-500' :
          node.status === 'critical' ? 'bg-red-500' : 'bg-gray-500'
        }`} />
        <div className="font-bold text-sm">{node.hostname || node.ip}</div>
        <Badge variant="outline" className="text-xs">
          {node.type.toUpperCase()}
        </Badge>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-400">IP Address:</span>
            <div className="font-mono text-blue-300">{node.ip}</div>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>
            <div className={`capitalize font-medium ${
              node.status === 'normal' ? 'text-green-400' :
              node.status === 'warning' ? 'text-yellow-400' :
              node.status === 'critical' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {node.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-400">Connections:</span>
            <div className="font-medium text-cyan-300">{connectedNodes}</div>
          </div>
          <div>
            <span className="text-gray-400">Last Seen:</span>
            <div className="text-green-300">{node.lastSeen.toLocaleTimeString()}</div>
          </div>
        </div>

        {node.metrics.cpu !== undefined && (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-gray-400">CPU:</span>
              <div className={`font-medium ${
                node.metrics.cpu > 80 ? 'text-red-400' :
                node.metrics.cpu > 60 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {node.metrics.cpu.toFixed(1)}%
              </div>
            </div>
            <div>
              <span className="text-gray-400">Memory:</span>
              <div className={`font-medium ${
                node.metrics.memory! > 80 ? 'text-red-400' :
                node.metrics.memory! > 60 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {node.metrics.memory?.toFixed(1)}%
              </div>
            </div>
            <div>
              <span className="text-gray-400">Bandwidth:</span>
              <div className="text-purple-300">{node.metrics.bandwidth?.toFixed(0)} Mbps</div>
            </div>
          </div>
        )}

        {isAnomalous && anomaly && (
          <>
            <hr className="border-red-500/30 my-2" />
            <div className="bg-red-900/30 p-2 rounded border border-red-500/30">
              <div className="flex items-center gap-1 text-red-400 font-bold mb-1">
                <Zap className="w-3 h-3" />
                ANOMALY DETECTED
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="capitalize text-red-300">{anomaly.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Severity:</span>
                  <span className={`capitalize font-medium ${
                    anomaly.severity === 'critical' ? 'text-red-400' :
                    anomaly.severity === 'high' ? 'text-orange-400' :
                    anomaly.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                  }`}>
                    {anomaly.severity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="text-cyan-300">{(anomaly.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="text-xs text-red-200 mt-1">
                  {anomaly.description}
                </div>
              </div>
            </div>
          </>
        )}

        {pathInfo && pathInfo !== null && (
          <>
            <hr className="border-blue-500/30 my-2" />
            <div className="bg-blue-900/30 p-2 rounded border border-blue-500/30">
              <div className="flex items-center gap-1 text-blue-400 font-bold mb-1">
                <Activity className="w-3 h-3" />
                PATH INFORMATION
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Hops:</span>
                  <span className="text-blue-300">{pathInfo.totalHops}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Latency:</span>
                  <span className="text-blue-300">{pathInfo.totalLatency.toFixed(1)}ms</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Enhanced Network Node Component with additional features
function EnhancedNetworkNodeComponent({
  node,
  isAnomalous,
  anomaly,
  onHover,
  onUnhover,
  onClick,
  isHighlighted,
  isFiltered,
  connectedNodes
}: {
  node: NetworkNode;
  isAnomalous: boolean;
  anomaly?: AnomalyDetection;
  onHover: (node: NetworkNode, anomaly?: AnomalyDetection) => void;
  onUnhover: () => void;
  onClick: (node: NetworkNode) => void;
  isHighlighted: boolean;
  isFiltered: boolean;
  connectedNodes: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      const baseY = node.position[1];
      meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.5 + node.position[0]) * 0.1;

      // Enhanced pulse animation for anomalous nodes
      if (isAnomalous) {
        const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.4;
        meshRef.current.scale.setScalar(pulseScale);

        // Enhanced glow effect
        if (glowRef.current) {
          glowRef.current.scale.setScalar(pulseScale * 2);
          const opacity = 0.4 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
          (glowRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0.1, opacity);
        }
      } else if (isHighlighted) {
        // Highlight effect for selected/filtered nodes
        const highlightScale = 1.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.scale.setScalar(highlightScale);
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

      // Fade out filtered nodes
      if (isFiltered) {
        (meshRef.current.material as THREE.MeshStandardMaterial).opacity = 0.3;
      } else {
        (meshRef.current.material as THREE.MeshStandardMaterial).opacity = 0.9;
      }
    }
  });

  const getNodeColor = () => {
    if (isHighlighted) return '#00ffff'; // Cyan for highlighted
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

    // Scale based on number of connections
    const connectionMultiplier = 1 + (connectedNodes / 20);
    return baseSize * Math.min(connectionMultiplier, 1.5);
  };

  const getNodeIcon = () => {
    switch (node.type) {
      case 'server': return '🖥️';
      case 'router': return '📡';
      case 'switch': return '🔀';
      case 'firewall': return '🛡️';
      case 'client': return '💻';
      default: return '📱';
    }
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

  const handleClick = useCallback(() => {
    onClick(node);
  }, [node, onClick]);

  if (isFiltered) return null;

  return (
    <group position={node.position}>
      {/* Enhanced glow effect for anomalous and highlighted nodes */}
      {(isAnomalous || isHighlighted) && (
        <Sphere ref={glowRef} args={[getNodeSize() * 2, 16, 16]}>
          <meshBasicMaterial
            color={getNodeColor()}
            transparent
            opacity={isAnomalous ? 0.3 : 0.2}
          />
        </Sphere>
      )}

      {/* Main node sphere */}
      <Sphere
        ref={meshRef}
        args={[getNodeSize(), 32, 32]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={getNodeColor()}
          emissive={isAnomalous || isHighlighted ? getNodeColor() : '#000000'}
          emissiveIntensity={isAnomalous ? 0.5 : isHighlighted ? 0.3 : (hovered ? 0.2 : 0)}
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.1}
        />
      </Sphere>

      {/* Node type icon */}
      <Text
        position={[0, 0, getNodeSize() + 0.1]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {getNodeIcon()}
      </Text>

      {/* Node label with IP */}
      <Text
        position={[0, getNodeSize() + 0.4, 0]}
        fontSize={0.12}
        color={hovered || isHighlighted ? "#ffffff" : "#cccccc"}
        anchorX="center"
        anchorY="middle"
      >
        {node.ip.split('.').slice(-1)[0]}
      </Text>

      {/* Connection count indicator */}
      {connectedNodes > 5 && (
        <Text
          position={[0, -getNodeSize() - 0.3, 0]}
          fontSize={0.08}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
        >
          {connectedNodes} connections
        </Text>
      )}

      {/* Status indicator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[getNodeSize() * 1.1, getNodeSize() * 1.2, 16]} />
        <meshBasicMaterial
          color={getNodeColor()}
          transparent
          opacity={hovered || isHighlighted ? 0.8 : 0.4}
        />
      </mesh>
    </group>
  );
}

// Enhanced Network Edge Component with path highlighting
function EnhancedNetworkEdgeComponent({
  start,
  end,
  status,
  bandwidth,
  utilization = 0,
  isHighlighted = false,
  isFiltered = false
}: {
  start: [number, number, number];
  end: [number, number, number];
  status: string;
  bandwidth?: number;
  utilization?: number;
  isHighlighted?: boolean;
  isFiltered?: boolean;
}) {
  const getEdgeColor = () => {
    if (isHighlighted) return '#00ffff';
    switch (status) {
      case 'active': return '#10b981';
      case 'congested': return '#f59e0b';
      case 'inactive': return '#374151';
      default: return '#10b981';
    }
  };

  const getLineWidth = () => {
    const baseWidth = isHighlighted ? 3 : 1;
    const utilizationMultiplier = 1 + (utilization / 100) * 2;
    const bandwidthMultiplier = bandwidth ? Math.log10(bandwidth / 100 + 1) : 1;
    return Math.max(baseWidth, baseWidth * utilizationMultiplier * bandwidthMultiplier);
  };

  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end]);

  if (isFiltered) return null;

  return (
    <Line
      points={points}
      color={getEdgeColor()}
      lineWidth={getLineWidth()}
      transparent
      opacity={isHighlighted ? 0.9 : (status === 'active' ? 0.6 : 0.3)}
    />
  );
}

// Network path tracing utility (for future use)
// function NetworkPathTracer() { ... }

// Main Enhanced Network Topology Component
function EnhancedNetworkTopology({ topology, anomalies }: EnhancedNetworkTopologyProps) {
  const [filters, setFilters] = useState<FilterState>({
    nodeTypes: [],
    statuses: [],
    showAnomalies: true,
    showNormal: true,
    searchTerm: ''
  });

  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<{node: NetworkNode, anomaly?: AnomalyDetection} | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<NetworkPath | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'topology' | 'performance' | 'security'>('topology');

  // Simulate loading
  useMemo(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Create anomaly lookup for quick access
  const anomalyMap = useMemo(() => {
    const map = new Map<string, AnomalyDetection>();
    anomalies.forEach(anomaly => {
      map.set(anomaly.sourceIp, anomaly);
    });
    return map;
  }, [anomalies]);

  // Calculate node connections
  const nodeConnections = useMemo(() => {
    const connections = new Map<string, number>();
    topology.nodes.forEach(node => {
      const count = topology.edges.filter(edge =>
        edge.source === node.id || edge.target === node.id
      ).length;
      connections.set(node.id, count);
    });
    return connections;
  }, [topology]);

  // Filter nodes based on current filters
  const filteredNodes = useMemo(() => {
    return topology.nodes.filter(node => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          node.ip.toLowerCase().includes(searchLower) ||
          node.hostname?.toLowerCase().includes(searchLower) ||
          node.type.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Node type filter
      if (filters.nodeTypes.length > 0 && !filters.nodeTypes.includes(node.type)) {
        return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(node.status)) {
        return false;
      }

      // Anomaly filter
      const hasAnomaly = anomalyMap.has(node.ip);
      if (!filters.showAnomalies && hasAnomaly) return false;
      if (!filters.showNormal && !hasAnomaly) return false;

      return true;
    });
  }, [topology.nodes, filters, anomalyMap]);

  // Filter edges based on filtered nodes
  const filteredEdges = useMemo(() => {
    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    return topology.edges.filter(edge =>
      filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );
  }, [topology.edges, filteredNodes]);

  const handleNodeHover = useCallback((node: NetworkNode, anomaly?: AnomalyDetection) => {
    setHoveredNode({ node, anomaly });
  }, []);

  const handleNodeUnhover = useCallback(() => {
    setHoveredNode(null);
  }, []);

  const handleNodeClick = useCallback((node: NetworkNode) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
    setHighlightedPath(null);
  }, [selectedNode]);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      nodeTypes: [],
      statuses: [],
      showAnomalies: true,
      showNormal: true,
      searchTerm: ''
    });
    setSelectedNode(null);
    setHighlightedPath(null);
  }, []);

  const activeAnomalies = anomalies.filter(a => a.status === 'active');

  return (
    <div className="space-y-4">
      {/* Enhanced Controls Panel */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              Enhanced Network Topology
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                {filteredNodes.length}/{topology.nodes.length} Nodes
              </Badge>
              <Badge variant="outline" className="text-xs">
                {filteredEdges.length}/{topology.edges.length} Links
              </Badge>
              {activeAnomalies.length > 0 && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  {activeAnomalies.length} Anomalies
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search nodes by IP, hostname, or type..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={viewMode} onValueChange={(value: 'topology' | 'performance' | 'security') => setViewMode(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="View Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="topology">Topology</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange({ showAnomalies: !filters.showAnomalies })}
              className={filters.showAnomalies ? 'bg-red-500/20 border-red-500' : ''}
            >
              <Zap className="w-4 h-4 mr-1" />
              Anomalies
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange({ showNormal: !filters.showNormal })}
              className={filters.showNormal ? 'bg-green-500/20 border-green-500' : ''}
            >
              <Shield className="w-4 h-4 mr-1" />
              Normal
            </Button>

            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>

          {/* Node Type Filters */}
          <div className="flex flex-wrap gap-2">
            {['server', 'router', 'switch', 'firewall', 'client'].map(type => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => {
                  const newTypes = filters.nodeTypes.includes(type)
                    ? filters.nodeTypes.filter(t => t !== type)
                    : [...filters.nodeTypes, type];
                  handleFilterChange({ nodeTypes: newTypes });
                }}
                className={filters.nodeTypes.includes(type) ? 'bg-blue-500/20 border-blue-500' : ''}
              >
                <Server className="w-3 h-3 mr-1" />
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3D Visualization */}
      <Card className="h-[700px] relative overflow-hidden">
        <CardContent className="p-0 h-full relative">
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 rounded-lg flex items-center justify-center z-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white/70">Loading Enhanced Network Topology...</p>
              </div>
            </div>
          )}

          {/* Enhanced hover tooltip */}
          {hoveredNode && (
            <div className="absolute top-4 left-4 z-30 pointer-events-none">
              <EnhancedNodeTooltip
                node={hoveredNode.node}
                isAnomalous={!!hoveredNode.anomaly}
                anomaly={hoveredNode.anomaly}
                connectedNodes={nodeConnections.get(hoveredNode.node.id) || 0}
                pathInfo={highlightedPath || undefined}
              />
            </div>
          )}

          {/* Selected node info panel */}
          {selectedNode && (
            <div className="absolute top-4 right-4 z-30 bg-black/90 text-white p-3 rounded-lg border border-white/20 min-w-[200px]">
              <div className="font-bold text-sm mb-2">Selected Node</div>
              <div className="text-xs space-y-1">
                <div>IP: {selectedNode.ip}</div>
                <div>Type: {selectedNode.type}</div>
                <div>Connections: {nodeConnections.get(selectedNode.id) || 0}</div>
              </div>
            </div>
          )}

          {/* 3D Canvas */}
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 rounded-lg">
            <Canvas
              camera={{
                position: [20, 15, 20],
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
                <EnhancedNetworkScene
                  topology={{ nodes: filteredNodes, edges: filteredEdges, lastUpdated: topology.lastUpdated }}
                  anomalies={anomalies}
                  onNodeHover={handleNodeHover}
                  onNodeUnhover={handleNodeUnhover}
                  onNodeClick={handleNodeClick}
                  selectedNode={selectedNode}
                  highlightedPath={highlightedPath}
                  nodeConnections={nodeConnections}
                  viewMode={viewMode}
                />
              </Suspense>
            </Canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Enhanced Scene Environment with better lighting
function EnhancedSceneEnvironment({ viewMode }: { viewMode: string }) {
  return (
    <>
      {/* Advanced lighting setup based on view mode */}
      <ambientLight intensity={viewMode === 'security' ? 0.2 : 0.3} color="#1e293b" />
      <directionalLight
        position={[15, 15, 10]}
        intensity={viewMode === 'performance' ? 1.0 : 0.8}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[-15, 8, -15]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[15, -8, 15]} intensity={0.3} color="#8b5cf6" />

      {/* Security mode: red accent lighting */}
      {viewMode === 'security' && (
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#ef4444" />
      )}

      {/* Performance mode: green accent lighting */}
      {viewMode === 'performance' && (
        <pointLight position={[0, -10, 0]} intensity={0.4} color="#10b981" />
      )}

      {/* Enhanced fog for depth */}
      <fog attach="fog" args={['#0f172a', 25, 120]} />

      {/* Enhanced grid helper */}
      <gridHelper args={[30, 30, '#1e293b', '#334155']} position={[0, -6, 0]} />
    </>
  );
}

// Enhanced Network Scene Component
function EnhancedNetworkScene({
  topology,
  anomalies,
  onNodeHover,
  onNodeUnhover,
  onNodeClick,
  selectedNode,
  highlightedPath,
  nodeConnections,
  viewMode
}: {
  topology: NetworkTopology;
  anomalies: AnomalyDetection[];
  onNodeHover: (node: NetworkNode, anomaly?: AnomalyDetection) => void;
  onNodeUnhover: () => void;
  onNodeClick: (node: NetworkNode) => void;
  selectedNode: NetworkNode | null;
  highlightedPath: NetworkPath | null;
  nodeConnections: Map<string, number>;
  viewMode: string;
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

  // Highlighted edges for path tracing
  const highlightedEdges = useMemo(() => {
    if (!highlightedPath) return new Set<string>();
    return new Set(highlightedPath.edges.map(e => e.id));
  }, [highlightedPath]);

  return (
    <>
      <EnhancedSceneEnvironment viewMode={viewMode} />

      {/* Enhanced Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={50}
        minDistance={10}
        maxPolarAngle={Math.PI * 0.85}
        minPolarAngle={Math.PI * 0.05}
        autoRotate={false}
        autoRotateSpeed={0.3}
        dampingFactor={0.03}
        enableDamping={true}
      />

      {/* Enhanced Network nodes */}
      {topology.nodes.map((node) => {
        const anomaly = anomalyMap.get(node.ip);
        const isHighlighted = selectedNode?.id === node.id ||
                             (highlightedPath?.nodes.some(n => n.id === node.id) || false);

        return (
          <EnhancedNetworkNodeComponent
            key={node.id}
            node={node}
            isAnomalous={!!anomaly}
            anomaly={anomaly}
            onHover={onNodeHover}
            onUnhover={onNodeUnhover}
            onClick={onNodeClick}
            isHighlighted={isHighlighted}
            isFiltered={false}
            connectedNodes={nodeConnections.get(node.id) || 0}
          />
        );
      })}

      {/* Enhanced Network Edges */}
      {activeEdges.map((edge) => {
        const sourceNode = topology.nodes.find(n => n.id === edge.source);
        const targetNode = topology.nodes.find(n => n.id === edge.target);

        if (!sourceNode || !targetNode) return null;

        const isHighlighted = highlightedEdges.has(edge.id);

        return (
          <EnhancedNetworkEdgeComponent
            key={edge.id}
            start={sourceNode.position}
            end={targetNode.position}
            status={edge.status}
            bandwidth={edge.bandwidth}
            utilization={edge.utilization}
            isHighlighted={isHighlighted}
            isFiltered={false}
          />
        );
      })}

      {/* Enhanced Data Flow Animations for normal traffic */}
      {viewMode !== 'security' && activeEdges.slice(0, 12).map((edge, index) => {
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
    </>
  );
}

// Enhanced Data Flow Animation Component (reusing from original)
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

// Enhanced Data Flow Particle Component
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

  useFrame((state) => {
    if (meshRef.current) {
      const adjustedTime = state.clock.elapsedTime * speed + delay;
      const t = (Math.sin(adjustedTime) + 1) / 2;

      const startVec = new THREE.Vector3(...start);
      const endVec = new THREE.Vector3(...end);
      const currentPos = new THREE.Vector3().lerpVectors(startVec, endVec, t);

      meshRef.current.position.copy(currentPos);

      // Enhanced fade effect based on position
      const opacity = 0.4 + Math.sin(adjustedTime * 3) * 0.4;
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0.1, opacity);
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 8, 8]}>
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </Sphere>
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

export { EnhancedNetworkTopology, EnhancedNodeTooltip, EnhancedNetworkNodeComponent };
