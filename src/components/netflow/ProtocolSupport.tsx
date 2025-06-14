'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Network,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  FileText,
  Code,
  Database,
  Zap,
  Download
} from 'lucide-react';

interface ProtocolInfo {
  name: string;
  version: string;
  status: 'supported' | 'partial' | 'planned' | 'deprecated';
  description: string;
  features: string[];
  limitations?: string[];
  rfc?: string;
  vendor?: string;
  ports: number[];
  fieldCount: number;
  templateSupport: boolean;
  ipv6Support: boolean;
  mplsSupport: boolean;
  vlanSupport: boolean;
}

const protocolData: ProtocolInfo[] = [
  {
    name: 'NetFlow v5',
    version: '5.0',
    status: 'supported',
    description: 'Original NetFlow protocol with fixed format and basic flow information',
    features: [
      'Fixed 7-tuple flow records',
      'Basic flow statistics',
      'Source/destination IP and ports',
      'Protocol and ToS information',
      'Interface indices',
      'Next hop information'
    ],
    limitations: [
      'No IPv6 support',
      'No MPLS support',
      'Fixed record format',
      'Limited scalability'
    ],
    rfc: 'RFC 3954',
    vendor: 'Cisco',
    ports: [2055],
    fieldCount: 7,
    templateSupport: false,
    ipv6Support: false,
    mplsSupport: false,
    vlanSupport: false
  },
  {
    name: 'NetFlow v9',
    version: '9.0',
    status: 'supported',
    description: 'Template-based NetFlow with flexible record formats and extensibility',
    features: [
      'Template-based flexible records',
      'IPv6 support',
      'MPLS support',
      'VLAN support',
      'Custom field definitions',
      'Sampling support',
      'Multiple record types'
    ],
    limitations: [
      'Template management complexity',
      'Higher processing overhead'
    ],
    rfc: 'RFC 3954',
    vendor: 'Cisco',
    ports: [2055, 9995],
    fieldCount: 100,
    templateSupport: true,
    ipv6Support: true,
    mplsSupport: true,
    vlanSupport: true
  },
  {
    name: 'IPFIX',
    version: '10.0',
    status: 'supported',
    description: 'Internet Protocol Flow Information Export - standardized flow export protocol',
    features: [
      'Standardized template system',
      'Variable-length fields',
      'Enterprise-specific fields',
      'Structured data types',
      'Options templates',
      'Reduced bandwidth usage',
      'Enhanced security'
    ],
    rfc: 'RFC 7011',
    vendor: 'IETF Standard',
    ports: [4739],
    fieldCount: 200,
    templateSupport: true,
    ipv6Support: true,
    mplsSupport: true,
    vlanSupport: true
  },
  {
    name: 'sFlow',
    version: '5.0',
    status: 'supported',
    description: 'Statistical sampling technology for monitoring network traffic',
    features: [
      'Packet sampling',
      'Counter sampling',
      'Multi-vendor support',
      'Real-time monitoring',
      'Low overhead',
      'Application visibility',
      'Network topology discovery'
    ],
    limitations: [
      'Sampling-based (not 100% accurate)',
      'Different data model than NetFlow'
    ],
    rfc: 'RFC 3176',
    vendor: 'InMon',
    ports: [6343],
    fieldCount: 50,
    templateSupport: false,
    ipv6Support: true,
    mplsSupport: true,
    vlanSupport: true
  },
  {
    name: 'NetFlow Lite',
    version: '1.0',
    status: 'partial',
    description: 'Simplified NetFlow for resource-constrained devices',
    features: [
      'Reduced memory footprint',
      'Basic flow information',
      'Simplified processing'
    ],
    limitations: [
      'Limited field support',
      'No advanced features',
      'Vendor-specific implementation'
    ],
    vendor: 'Various',
    ports: [2055],
    fieldCount: 10,
    templateSupport: false,
    ipv6Support: false,
    mplsSupport: false,
    vlanSupport: false
  },
  {
    name: 'J-Flow',
    version: '9.0',
    status: 'planned',
    description: 'Juniper Networks flow monitoring technology',
    features: [
      'Template-based records',
      'IPv6 support',
      'MPLS support',
      'Inline monitoring'
    ],
    vendor: 'Juniper',
    ports: [2055, 9995],
    fieldCount: 80,
    templateSupport: true,
    ipv6Support: true,
    mplsSupport: true,
    vlanSupport: true
  }
];

export function ProtocolSupport() {
  const getStatusIcon = (status: ProtocolInfo['status']) => {
    switch (status) {
      case 'supported':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'planned':
        return <Clock className="h-4 w-4 text-blue-400" />;
      case 'deprecated':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ProtocolInfo['status']) => {
    switch (status) {
      case 'supported':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'partial':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'planned':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'deprecated':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const supportedProtocols = protocolData.filter(p => p.status === 'supported').length;
  const totalFields = protocolData.reduce((sum, p) => sum + p.fieldCount, 0);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Supported Protocols</CardTitle>
            <Network className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{supportedProtocols}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {protocolData.length} total
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Fields</CardTitle>
            <Database className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalFields}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Across all protocols
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Template Support</CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {protocolData.filter(p => p.templateSupport).length}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Flexible formats
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">IPv6 Support</CardTitle>
            <Zap className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {protocolData.filter(p => p.ipv6Support).length}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Modern networking
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Protocol Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {protocolData.map((protocol) => (
          <Card key={protocol.name} className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Network className="h-5 w-5 text-blue-400" />
                  <div>
                    <CardTitle className="text-lg text-white">{protocol.name}</CardTitle>
                    <p className="text-sm text-slate-400">Version {protocol.version}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(protocol.status)} border`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(protocol.status)}
                    {protocol.status}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-slate-300">{protocol.description}</p>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Vendor</span>
                  <div className="font-medium text-white">{protocol.vendor || 'Standard'}</div>
                </div>
                <div>
                  <span className="text-slate-400">Default Ports</span>
                  <div className="font-medium text-white">{protocol.ports.join(', ')}</div>
                </div>
                <div>
                  <span className="text-slate-400">Field Count</span>
                  <div className="font-medium text-white">{protocol.fieldCount}</div>
                </div>
                <div>
                  <span className="text-slate-400">RFC</span>
                  <div className="font-medium text-white">{protocol.rfc || 'N/A'}</div>
                </div>
              </div>

              {/* Feature Support */}
              <div className="space-y-2">
                <h4 className="font-medium text-white">Feature Support</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {protocol.templateSupport ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-gray-400" />
                    )}
                    <span className="text-slate-300">Templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {protocol.ipv6Support ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-gray-400" />
                    )}
                    <span className="text-slate-300">IPv6</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {protocol.mplsSupport ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-gray-400" />
                    )}
                    <span className="text-slate-300">MPLS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {protocol.vlanSupport ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-gray-400" />
                    )}
                    <span className="text-slate-300">VLAN</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="font-medium text-white">Key Features</h4>
                <ul className="text-xs text-slate-300 space-y-1">
                  {protocol.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full mt-2" />
                      {feature}
                    </li>
                  ))}
                  {protocol.features.length > 4 && (
                    <li className="text-slate-400">
                      +{protocol.features.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Limitations */}
              {protocol.limitations && protocol.limitations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Limitations</h4>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {protocol.limitations.slice(0, 3).map((limitation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-3 w-3 mr-1" />
                  Configure
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Code className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Protocol Comparison */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-400" />
            Protocol Comparison Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">Protocol</th>
                  <th className="text-center py-3 px-4 text-slate-300">Version</th>
                  <th className="text-center py-3 px-4 text-slate-300">Templates</th>
                  <th className="text-center py-3 px-4 text-slate-300">IPv6</th>
                  <th className="text-center py-3 px-4 text-slate-300">MPLS</th>
                  <th className="text-center py-3 px-4 text-slate-300">VLAN</th>
                  <th className="text-center py-3 px-4 text-slate-300">Fields</th>
                  <th className="text-center py-3 px-4 text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {protocolData.map((protocol) => (
                  <tr key={protocol.name} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-white font-medium">{protocol.name}</td>
                    <td className="py-3 px-4 text-center text-slate-300">{protocol.version}</td>
                    <td className="py-3 px-4 text-center">
                      {protocol.templateSupport ? (
                        <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                      ) : (
                        <div className="w-4 h-4 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {protocol.ipv6Support ? (
                        <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                      ) : (
                        <div className="w-4 h-4 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {protocol.mplsSupport ? (
                        <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                      ) : (
                        <div className="w-4 h-4 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {protocol.vlanSupport ? (
                        <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                      ) : (
                        <div className="w-4 h-4 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-300">{protocol.fieldCount}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={`${getStatusColor(protocol.status)} border text-xs`}>
                        {protocol.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Templates */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Code className="h-5 w-5 text-green-400" />
            Configuration Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="font-medium text-white mb-2">Cisco Router</h4>
              <p className="text-xs text-slate-400 mb-3">NetFlow v9 configuration for Cisco IOS</p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-3 w-3 mr-2" />
                Download Template
              </Button>
            </div>
            
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="font-medium text-white mb-2">Juniper Switch</h4>
              <p className="text-xs text-slate-400 mb-3">J-Flow configuration for Junos</p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-3 w-3 mr-2" />
                Download Template
              </Button>
            </div>
            
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="font-medium text-white mb-2">sFlow Agent</h4>
              <p className="text-xs text-slate-400 mb-3">sFlow configuration for switches</p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-3 w-3 mr-2" />
                Download Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
