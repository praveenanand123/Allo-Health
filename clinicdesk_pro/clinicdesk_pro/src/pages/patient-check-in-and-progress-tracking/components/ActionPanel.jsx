import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ActionPanel = ({ 
  selectedPatient, 
  onBulkCheckIn, 
  onExportData, 
  onEmergencyAlert,
  systemStatus = { emr: 'connected', insurance: 'connected' }
}) => {
  const [bulkMode, setBulkMode] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [exportType, setExportType] = useState('');

  const exportOptions = [
    { value: 'patient-flow', label: 'Patient Flow Report' },
    { value: 'wait-times', label: 'Wait Time Analytics' },
    { value: 'throughput', label: 'Throughput Metrics' },
    { value: 'daily-summary', label: 'Daily Summary' },
    { value: 'compliance', label: 'Compliance Documentation' }
  ];

  const quickActions = [
    {
      id: 'emergency',
      label: 'Emergency Alert',
      icon: 'AlertTriangle',
      variant: 'destructive',
      description: 'Activate emergency protocols'
    },
    {
      id: 'bulk-checkin',
      label: 'Bulk Check-in',
      icon: 'Users',
      variant: 'outline',
      description: 'Process multiple family members'
    },
    {
      id: 'queue-status',
      label: 'Queue Status',
      icon: 'BarChart3',
      variant: 'ghost',
      description: 'View current queue metrics'
    },
    {
      id: 'patient-history',
      label: 'Patient History',
      icon: 'FileText',
      variant: 'ghost',
      description: 'Quick access to patient records'
    }
  ];

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'emergency':
        onEmergencyAlert();
        break;
      case 'bulk-checkin':
        setBulkMode(!bulkMode);
        break;
      case 'queue-status':
        // Handle queue status view
        break;
      case 'patient-history':
        // Handle patient history view
        break;
      default:
        break;
    }
  };

  const handleExport = () => {
    if (exportType) {
      onExportData(exportType);
    }
  };

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, {
      id: Date.now(),
      name: '',
      dob: '',
      relation: '',
      visitReason: ''
    }]);
  };

  const removeFamilyMember = (id) => {
    setFamilyMembers(familyMembers?.filter(member => member?.id !== id));
  };

  const updateFamilyMember = (id, field, value) => {
    setFamilyMembers(familyMembers?.map(member =>
      member?.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleBulkSubmit = () => {
    if (familyMembers?.length > 0) {
      onBulkCheckIn(familyMembers);
      setFamilyMembers([]);
      setBulkMode(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Zap" size={20} className="mr-2 text-primary" />
          Quick Actions
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            systemStatus?.emr === 'connected' ? 'bg-success' : 'bg-error'
          }`} />
          <span className="text-xs text-muted-foreground">EMR</span>
        </div>
      </div>
      {/* System Status */}
      <div className="bg-muted rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">System Status</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">EMR Integration</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                systemStatus?.emr === 'connected' ? 'bg-success' : 'bg-error'
              }`} />
              <span className={`text-xs ${
                systemStatus?.emr === 'connected' ? 'text-success' : 'text-error'
              }`}>
                {systemStatus?.emr === 'connected' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Insurance Verification</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                systemStatus?.insurance === 'connected' ? 'bg-success' : 'bg-error'
              }`} />
              <span className={`text-xs ${
                systemStatus?.insurance === 'connected' ? 'text-success' : 'text-error'
              }`}>
                {systemStatus?.insurance === 'connected' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Selected Patient Info */}
      {selectedPatient && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-foreground mb-2">Selected Patient</h3>
          <div className="text-sm text-muted-foreground">
            <div>{selectedPatient?.patientName}</div>
            <div>Status: {selectedPatient?.status}</div>
            <div>Wait Time: {selectedPatient?.waitTime || 'N/A'}</div>
          </div>
        </div>
      )}
      {/* Quick Action Buttons */}
      <div className="space-y-3 mb-6">
        {quickActions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            size="sm"
            onClick={() => handleQuickAction(action?.id)}
            iconName={action?.icon}
            iconPosition="left"
            fullWidth
            className="justify-start"
          >
            <div className="text-left">
              <div>{action?.label}</div>
              <div className="text-xs opacity-70">{action?.description}</div>
            </div>
          </Button>
        ))}
      </div>
      {/* Bulk Check-in Mode */}
      {bulkMode && (
        <div className="border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Bulk Check-in</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBulkMode(false)}
              iconName="X"
            />
          </div>

          <div className="space-y-3 mb-4">
            {familyMembers?.map((member) => (
              <div key={member?.id} className="border border-border rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Family Member</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFamilyMember(member?.id)}
                    iconName="Trash2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Full Name"
                    value={member?.name}
                    onChange={(e) => updateFamilyMember(member?.id, 'name', e?.target?.value)}
                    size="sm"
                  />
                  <Input
                    type="date"
                    placeholder="Date of Birth"
                    value={member?.dob}
                    onChange={(e) => updateFamilyMember(member?.id, 'dob', e?.target?.value)}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addFamilyMember}
              iconName="Plus"
              iconPosition="left"
            >
              Add Member
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleBulkSubmit}
              disabled={familyMembers?.length === 0}
              iconName="Users"
              iconPosition="left"
            >
              Check In All
            </Button>
          </div>
        </div>
      )}
      {/* Export Section */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Export Data</h3>
        <div className="space-y-3">
          <Select
            options={exportOptions}
            value={exportType}
            onChange={setExportType}
            placeholder="Select report type"
            size="sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!exportType}
            iconName="Download"
            iconPosition="left"
            fullWidth
          >
            Export Report
          </Button>
        </div>
      </div>
      {/* Real-time Updates Indicator */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
            Real-time updates active
          </div>
          <div>
            Last sync: {new Date()?.toLocaleTimeString()}
          </div>
        </div>
      </div>
      {/* HIPAA Compliance Notice */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-start">
          <Icon name="Shield" size={14} className="mr-2 text-primary mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <div className="font-medium">HIPAA Compliant</div>
            <div>All patient data is encrypted and access is logged for compliance audits.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;