import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyActions = ({ onBulkProcess, onEscalate, onNotifyStaff, onExportData }) => {
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCount, setBulkCount] = useState(1);

  const quickActions = [
    {
      id: 'mass-casualty',
      label: 'Mass Casualty Mode',
      icon: 'Users',
      color: 'bg-red-600 hover:bg-red-700 text-white',
      description: 'Activate mass casualty protocols',
      shortcut: 'Ctrl+M'
    },
    {
      id: 'notify-all',
      label: 'Alert All Staff',
      icon: 'Bell',
      color: 'bg-orange-500 hover:bg-orange-600 text-white',
      description: 'Send emergency notification to all staff',
      shortcut: 'Ctrl+A'
    },
    {
      id: 'escalate',
      label: 'Escalate to Supervisor',
      icon: 'ArrowUp',
      color: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      description: 'Notify supervisors and medical directors',
      shortcut: 'Ctrl+S'
    },
    {
      id: 'export',
      label: 'Export Emergency Log',
      icon: 'Download',
      color: 'bg-blue-500 hover:bg-blue-600 text-white',
      description: 'Download current emergency data',
      shortcut: 'Ctrl+E'
    }
  ];

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'mass-casualty':
        setShowBulkModal(true);
        break;
      case 'notify-all':
        onNotifyStaff('all');
        break;
      case 'escalate': onEscalate('supervisor');
        break;
      case 'export':
        onExportData();
        break;
      default:
        break;
    }
  };

  const handleBulkProcess = () => {
    onBulkProcess(bulkCount);
    setShowBulkModal(false);
    setBulkCount(1);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-warning/10 px-4 py-3 border-b border-border rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={20} className="text-warning" />
            <h3 className="text-lg font-semibold text-warning">Emergency Actions</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Quick response tools and escalation options
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 gap-3">
            {quickActions?.map((action) => (
              <Button
                key={action?.id}
                variant="ghost"
                onClick={() => handleQuickAction(action?.id)}
                className={`${action?.color} justify-start h-auto p-4 text-left`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <Icon name={action?.icon} size={20} />
                  <div className="flex-1">
                    <div className="font-medium">{action?.label}</div>
                    <div className="text-sm opacity-90">{action?.description}</div>
                  </div>
                  <div className="text-xs opacity-75 bg-black/20 px-2 py-1 rounded">
                    {action?.shortcut}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Emergency Protocols */}
        <div className="border-t border-border p-4">
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="Shield" size={16} className="mr-2" />
            Active Protocols
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-success/10 border border-success/20 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-success font-medium">Emergency Mode Active</span>
              </div>
              <Button variant="ghost" size="sm" className="text-success">
                <Icon name="Settings" size={14} />
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-primary font-medium">Real-time Monitoring</span>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                <Icon name="Eye" size={14} />
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-warning/10 border border-warning/20 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-sm text-warning font-medium">Staff Notifications</span>
              </div>
              <Button variant="ghost" size="sm" className="text-warning">
                <Icon name="Bell" size={14} />
              </Button>
            </div>
          </div>
        </div>

        {/* Communication Tools */}
        <div className="border-t border-border p-4">
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="MessageSquare" size={16} className="mr-2" />
            Communication
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <Icon name="Phone" size={14} className="mr-2" />
              Call Code Team
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Radio" size={14} className="mr-2" />
              PA System
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="MessageCircle" size={14} className="mr-2" />
              Instant Message
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Mail" size={14} className="mr-2" />
              Email Alert
            </Button>
          </div>
        </div>
      </div>
      {/* Bulk Processing Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="bg-error/10 px-4 py-3 border-b border-border rounded-t-lg">
              <h3 className="text-lg font-semibold text-error flex items-center">
                <Icon name="Users" size={20} className="mr-2" />
                Mass Casualty Mode
              </h3>
            </div>
            
            <div className="p-4">
              <p className="text-muted-foreground mb-4">
                Activate mass casualty protocols for rapid patient registration and triage assignment.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Expected Patient Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={bulkCount}
                  onChange={(e) => setBulkCount(parseInt(e?.target?.value) || 1)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>
              
              <div className="bg-warning/10 border border-warning/20 rounded p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                  <div className="text-sm text-warning">
                    <strong>Warning:</strong> This will override normal queue protocols and notify all available staff immediately.
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBulkModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleBulkProcess}
                >
                  <Icon name="Zap" size={16} className="mr-2" />
                  Activate Mass Casualty Mode
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyActions;