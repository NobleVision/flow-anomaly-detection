'use client';

import { useState } from 'react';
import { MLModel } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GitBranch,
  Tag,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Download,
  Upload,
  Copy,
  CheckCircle,
  Play
} from 'lucide-react';

interface ModelVersioningProps {
  models: MLModel[];
  onModelSelect: (model: MLModel) => void;
}

// Generate version history for a model
const generateVersionHistory = (model: MLModel) => {
  const versions = [];
  const currentVersion = parseFloat(model.version);
  
  for (let i = 0; i < 5; i++) {
    const versionNumber = (currentVersion - i * 0.1).toFixed(1);
    const daysAgo = i * 7 + Math.floor(Math.random() * 7);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const baseAccuracy = model.accuracy - i * 1.5 - Math.random() * 2;
    
    versions.push({
      version: versionNumber,
      date: date,
      accuracy: Math.max(80, baseAccuracy),
      precision: Math.max(78, baseAccuracy - 2 + Math.random() * 2),
      recall: Math.max(82, baseAccuracy + 1 + Math.random() * 2),
      f1Score: Math.max(80, baseAccuracy - 1 + Math.random() * 2),
      status: i === 0 ? 'current' : i === 1 ? 'previous' : 'archived',
      changes: i === 0 ? [] : [
        'Improved feature engineering',
        'Updated hyperparameters',
        'Enhanced data preprocessing',
        'Bug fixes and optimizations'
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      size: Math.floor(Math.random() * 50) + 100, // MB
      deployments: Math.floor(Math.random() * 10) + (i === 0 ? 5 : 0)
    });
  }
  
  return versions;
};

export function ModelVersioning({ models, onModelSelect }: ModelVersioningProps) {
  const [selectedModel, setSelectedModel] = useState<MLModel>(models[0]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const versionHistory = generateVersionHistory(selectedModel);

  const getVersionStatus = (status: string) => {
    switch (status) {
      case 'current':
        return { color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: CheckCircle };
      case 'previous':
        return { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Clock };
      default:
        return { color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: Tag };
    }
  };

  const getPerformanceChange = (current: number, previous: number) => {
    const change = current - previous;
    if (Math.abs(change) < 0.1) return { icon: null, color: 'text-gray-400', text: 'No change' };
    if (change > 0) return { icon: TrendingUp, color: 'text-green-400', text: `+${change.toFixed(1)}%` };
    return { icon: TrendingDown, color: 'text-red-400', text: `${change.toFixed(1)}%` };
  };

  const handleModelChange = (model: MLModel) => {
    setSelectedModel(model);
    onModelSelect(model);
    setSelectedVersion(null);
  };

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(selectedVersion === version ? null : version);
  };

  const handleRollback = (version: string) => {
    console.log(`Rolling back to version ${version}`);
    // Implementation would handle actual rollback
  };

  const handlePromote = (version: string) => {
    console.log(`Promoting version ${version} to production`);
    // Implementation would handle promotion
  };

  return (
    <div className="space-y-8">
      {/* Model Selector */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-400" />
            Model Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {models.map((model) => (
              <div
                key={model.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedModel.id === model.id
                    ? 'bg-blue-900/20 border-blue-500/50'
                    : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                }`}
                onClick={() => handleModelChange(model)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{model.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    v{model.version}
                  </Badge>
                </div>
                <div className="text-sm text-slate-400">{model.algorithm}</div>
                <div className="text-sm text-white mt-1">{model.accuracy}% accuracy</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Version History */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                Version History - {selectedModel.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {versionHistory.map((version, index) => {
                  const statusInfo = getVersionStatus(version.status);
                  const StatusIcon = statusInfo.icon;
                  const isSelected = selectedVersion === version.version;
                  const previousVersion = versionHistory[index + 1];
                  
                  return (
                    <div
                      key={version.version}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-purple-900/20 border-purple-500/50'
                          : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                      }`}
                      onClick={() => handleVersionSelect(version.version)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`h-5 w-5 ${statusInfo.color.split(' ')[0]}`} />
                          <div>
                            <h3 className="font-medium text-white">Version {version.version}</h3>
                            <p className="text-sm text-slate-400">
                              {version.date.toLocaleDateString()} • {version.size} MB
                            </p>
                          </div>
                        </div>
                        <Badge className={`${statusInfo.color} border`}>
                          {version.status}
                        </Badge>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{version.accuracy.toFixed(1)}%</div>
                          <div className="text-xs text-slate-400">Accuracy</div>
                          {previousVersion && (
                            <div className="flex items-center justify-center gap-1 mt-1">
                              {(() => {
                                const change = getPerformanceChange(version.accuracy, previousVersion.accuracy);
                                const ChangeIcon = change.icon;
                                return (
                                  <>
                                    {ChangeIcon && <ChangeIcon className={`h-3 w-3 ${change.color}`} />}
                                    <span className={`text-xs ${change.color}`}>{change.text}</span>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{version.precision.toFixed(1)}%</div>
                          <div className="text-xs text-slate-400">Precision</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{version.recall.toFixed(1)}%</div>
                          <div className="text-xs text-slate-400">Recall</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{version.f1Score.toFixed(1)}%</div>
                          <div className="text-xs text-slate-400">F1 Score</div>
                        </div>
                      </div>

                      {/* Changes */}
                      {version.changes.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Changes:</h4>
                          <ul className="text-sm text-slate-400 space-y-1">
                            {version.changes.map((change, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-slate-500 rounded-full" />
                                {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Deployment Info */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">
                          {version.deployments} deployment{version.deployments !== 1 ? 's' : ''}
                        </span>
                        <div className="flex items-center gap-2">
                          {version.status !== 'current' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRollback(version.version);
                                }}
                              >
                                <ArrowRight className="h-3 w-3 mr-1" />
                                Rollback
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePromote(version.version);
                                }}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Promote
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(`Downloading version ${version.version}`);
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Version Details */}
        <div>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Tag className="h-5 w-5 text-cyan-400" />
                Version Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedVersion ? (
                <div className="space-y-4">
                  {(() => {
                    const version = versionHistory.find(v => v.version === selectedVersion);
                    if (!version) return null;

                    return (
                      <>
                        <div className="text-center pb-4 border-b border-slate-700">
                          <h3 className="text-xl font-bold text-white">v{version.version}</h3>
                          <p className="text-sm text-slate-400">{version.date.toLocaleDateString()}</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status</span>
                            <Badge className={`${getVersionStatus(version.status).color} border text-xs`}>
                              {version.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Size</span>
                            <span className="text-white">{version.size} MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Deployments</span>
                            <span className="text-white">{version.deployments}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-700">
                          <h4 className="font-medium text-white mb-3">Performance</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Accuracy</span>
                              <span className="text-white">{version.accuracy.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Precision</span>
                              <span className="text-white">{version.precision.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Recall</span>
                              <span className="text-white">{version.recall.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">F1 Score</span>
                              <span className="text-white">{version.f1Score.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>

                        {version.changes.length > 0 && (
                          <div className="pt-4 border-t border-slate-700">
                            <h4 className="font-medium text-white mb-3">Changes</h4>
                            <ul className="space-y-2">
                              {version.changes.map((change, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                  <div className="w-1 h-1 bg-blue-400 rounded-full mt-2" />
                                  {change}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="pt-4 border-t border-slate-700 space-y-2">
                          <Button className="w-full" size="sm">
                            <Download className="h-3 w-3 mr-2" />
                            Download Version
                          </Button>
                          <Button variant="outline" className="w-full" size="sm">
                            <Copy className="h-3 w-3 mr-2" />
                            Clone Version
                          </Button>
                          {version.status !== 'current' && (
                            <Button variant="outline" className="w-full" size="sm">
                              <ArrowRight className="h-3 w-3 mr-2" />
                              Set as Current
                            </Button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Tag className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Select a version to view details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Version Actions */}
          <Card className="bg-slate-800/50 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Version Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" size="sm">
                <Upload className="h-3 w-3 mr-2" />
                Upload New Version
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <GitBranch className="h-3 w-3 mr-2" />
                Create Branch
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <Tag className="h-3 w-3 mr-2" />
                Tag Release
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
