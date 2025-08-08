import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatusPanel = ({ systems, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-success';
      case 'warning': return 'text-warning';
      case 'offline': return 'text-error';
      case 'maintenance': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'offline': return 'XCircle';
      case 'maintenance': return 'Settings';
      default: return 'HelpCircle';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'online': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'offline': return 'bg-error/10';
      case 'maintenance': return 'bg-secondary/10';
      default: return 'bg-muted/10';
    }
  };

  const criticalIssues = systems?.filter(system => system?.status === 'offline')?.length;
  const warnings = systems?.filter(system => system?.status === 'warning')?.length;

  return (
    <div className="bg-card rounded-lg border border-border p-6 min-h-[280px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Server" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">System Status</h3>
            <p className="text-sm text-muted-foreground">Integration health</p>
          </div>
        </div>
        <button
          onClick={onViewDetails}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <Icon name="ExternalLink" size={16} />
        </button>
      </div>
      {(criticalIssues > 0 || warnings > 0) && (
        <div className="mb-4 space-y-2">
          {criticalIssues > 0 && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error" />
                <span className="text-sm font-medium text-error">
                  {criticalIssues} critical system{criticalIssues > 1 ? 's' : ''} offline
                </span>
              </div>
            </div>
          )}
          {warnings > 0 && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">
                  {warnings} system warning{warnings > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="space-y-3">
        {systems?.map((system) => (
          <div key={system?.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusBg(system?.status)}`}>
                <Icon 
                  name={getStatusIcon(system?.status)} 
                  size={16} 
                  className={getStatusColor(system?.status)} 
                />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">{system?.name}</span>
                <p className="text-xs text-muted-foreground">{system?.description}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium capitalize ${getStatusColor(system?.status)}`}>
                {system?.status}
              </span>
              {system?.lastCheck && (
                <p className="text-xs text-muted-foreground">
                  {system?.lastCheck}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall health</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-success font-medium">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusPanel;