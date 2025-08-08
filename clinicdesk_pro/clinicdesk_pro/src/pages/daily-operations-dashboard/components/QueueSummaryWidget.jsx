import React from 'react';
import Icon from '../../../components/AppIcon';

const QueueSummaryWidget = ({ data, onViewDetails }) => {
  const totalPatients = data?.reduce((sum, queue) => sum + queue?.count, 0);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'text-warning';
      case 'with-doctor': return 'text-primary';
      case 'completed': return 'text-success';
      case 'emergency': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'waiting': return 'Clock';
      case 'with-doctor': return 'UserCheck';
      case 'completed': return 'CheckCircle';
      case 'emergency': return 'AlertTriangle';
      default: return 'Users';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 min-h-[280px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Users" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Live Queue Status</h3>
            <p className="text-sm text-muted-foreground">Real-time patient flow</p>
          </div>
        </div>
        <button
          onClick={onViewDetails}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <Icon name="ExternalLink" size={16} />
        </button>
      </div>
      <div className="mb-6">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-foreground">{totalPatients}</span>
          <span className="text-sm text-muted-foreground">total patients</span>
        </div>
      </div>
      <div className="space-y-4">
        {data?.map((queue) => (
          <div key={queue?.status} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon 
                name={getStatusIcon(queue?.status)} 
                size={16} 
                className={getStatusColor(queue?.status)} 
              />
              <span className="text-sm font-medium text-foreground capitalize">
                {queue?.status?.replace('-', ' ')}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-foreground">{queue?.count}</span>
              {queue?.avgWaitTime && (
                <span className="text-xs text-muted-foreground">
                  {queue?.avgWaitTime}min avg
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last updated</span>
          <span className="text-foreground font-medium">
            {new Date()?.toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QueueSummaryWidget;