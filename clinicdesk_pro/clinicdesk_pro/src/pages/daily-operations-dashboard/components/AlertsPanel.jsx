import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = ({ alerts, onDismissAlert, onViewAllAlerts }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error border-error bg-error/10';
      case 'high': return 'text-warning border-warning bg-warning/10';
      case 'medium': return 'text-primary border-primary bg-primary/10';
      case 'low': return 'text-muted-foreground border-muted bg-muted/10';
      default: return 'text-muted-foreground border-muted bg-muted/10';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'AlertCircle';
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Info';
      case 'low': return 'Bell';
      default: return 'Bell';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return alertTime?.toLocaleDateString();
  };

  const criticalAlerts = alerts?.filter(alert => alert?.severity === 'critical')?.length;
  const totalAlerts = alerts?.length;

  return (
    <div className="bg-card rounded-lg border border-border p-6 min-h-[320px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Bell" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Active Alerts</h3>
            <p className="text-sm text-muted-foreground">
              {totalAlerts} alert{totalAlerts !== 1 ? 's' : ''} 
              {criticalAlerts > 0 && ` • ${criticalAlerts} critical`}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewAllAlerts}
          iconName="ExternalLink"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      {alerts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-3">
            <Icon name="CheckCircle" size={24} className="text-success" />
          </div>
          <h4 className="text-sm font-medium text-foreground mb-1">All Clear</h4>
          <p className="text-xs text-muted-foreground">No active alerts at this time</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {alerts?.slice(0, 5)?.map((alert) => (
            <div
              key={alert?.id}
              className={`p-4 rounded-lg border ${getSeverityColor(alert?.severity)} transition-all hover:shadow-soft`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <Icon 
                    name={getSeverityIcon(alert?.severity)} 
                    size={16} 
                    className={`mt-0.5 flex-shrink-0 ${getSeverityColor(alert?.severity)?.split(' ')?.[0]}`} 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      {alert?.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {alert?.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(alert?.timestamp)}
                      </span>
                      <span className={`text-xs font-medium capitalize px-2 py-1 rounded-full ${getSeverityColor(alert?.severity)}`}>
                        {alert?.severity}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDismissAlert(alert?.id)}
                  className="w-6 h-6 ml-2 flex-shrink-0"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {alerts?.length > 5 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Showing 5 of {alerts?.length} alerts
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;