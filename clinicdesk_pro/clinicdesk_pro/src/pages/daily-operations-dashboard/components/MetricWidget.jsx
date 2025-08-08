import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricWidget = ({ 
  title, 
  value, 
  unit = '', 
  trend, 
  trendValue, 
  icon, 
  color = 'primary',
  size = 'default',
  onClick,
  loading = false,
  alert = null
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'p-4 min-h-[120px]';
      case 'large': return 'p-6 min-h-[200px]';
      default: return 'p-5 min-h-[160px]';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'success': return 'border-l-4 border-l-success';
      case 'warning': return 'border-l-4 border-l-warning';
      case 'error': return 'border-l-4 border-l-error';
      case 'accent': return 'border-l-4 border-l-accent';
      default: return 'border-l-4 border-l-primary';
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground';
    return trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (!trend) return 'Minus';
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div 
      className={`bg-card rounded-lg border border-border ${getColorClasses()} ${getSizeClasses()} 
        ${onClick ? 'cursor-pointer hover:shadow-medium transition-shadow' : ''} 
        ${alert ? 'ring-2 ring-error/20' : ''} relative overflow-hidden`}
      onClick={onClick}
    >
      {loading && (
        <div className="absolute inset-0 bg-card/80 flex items-center justify-center z-10">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
        </div>
      )}

      {alert && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-error rounded-full animate-pulse" />
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              color === 'success' ? 'bg-success/10 text-success' :
              color === 'warning' ? 'bg-warning/10 text-warning' :
              color === 'error' ? 'bg-error/10 text-error' :
              color === 'accent'? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
            }`}>
              <Icon name={icon} size={20} />
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
        </div>
        {onClick && (
          <Icon name="ExternalLink" size={16} className="text-muted-foreground" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>

        {trend && trendValue && (
          <div className="flex items-center space-x-2">
            <Icon name={getTrendIcon()} size={16} className={getTrendColor()} />
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {trendValue}
            </span>
            <span className="text-sm text-muted-foreground">vs yesterday</span>
          </div>
        )}

        {alert && (
          <div className="mt-3 p-2 bg-error/10 rounded-md">
            <p className="text-xs text-error font-medium">{alert}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricWidget;