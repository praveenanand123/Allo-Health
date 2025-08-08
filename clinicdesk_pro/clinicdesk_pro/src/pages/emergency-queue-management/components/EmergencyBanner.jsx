import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyBanner = ({ activeEmergencies = 2, onViewAll }) => {
  return (
    <div className="bg-error text-error-foreground px-6 py-4 border-b border-error/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={24} className="animate-pulse" />
            <span className="text-lg font-semibold">EMERGENCY MODE ACTIVE</span>
          </div>
          <div className="flex items-center space-x-2 bg-error-foreground/20 px-3 py-1 rounded-full">
            <Icon name="Clock" size={16} />
            <span className="text-sm font-medium">
              {activeEmergencies} Active Emergency Cases
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-sm">
            Last Updated: {new Date()?.toLocaleTimeString()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewAll}
            className="bg-error-foreground/10 border-error-foreground/30 text-error-foreground hover:bg-error-foreground/20"
          >
            <Icon name="Eye" size={16} className="mr-2" />
            View All Emergencies
          </Button>
        </div>
      </div>
      <div className="mt-3 flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-error-foreground rounded-full animate-pulse"></div>
          <span>Real-time monitoring active</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={14} />
          <span>Emergency protocols enabled</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Users" size={14} />
          <span>All staff notified</span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;