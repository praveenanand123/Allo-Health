import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkOperationsPanel = ({ 
  selectedDoctors, 
  onBulkOperation, 
  onClearSelection,
  isVisible 
}) => {
  const [operationType, setOperationType] = useState('');
  const [operationData, setOperationData] = useState({});

  const operationOptions = [
    { value: 'update-location', label: 'Update Location' },
    { value: 'update-status', label: 'Update Status' },
    { value: 'schedule-break', label: 'Schedule Break' },
    { value: 'block-schedule', label: 'Block Schedule' },
    { value: 'update-availability', label: 'Update Availability' },
    { value: 'export-data', label: 'Export Data' }
  ];

  const locationOptions = [
    { value: 'main-clinic', label: 'Main Clinic' },
    { value: 'north-branch', label: 'North Branch' },
    { value: 'south-branch', label: 'South Branch' },
    { value: 'downtown', label: 'Downtown Center' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'busy', label: 'Busy' },
    { value: 'break', label: 'On Break' },
    { value: 'offline', label: 'Offline' }
  ];

  const handleOperationChange = (value) => {
    setOperationType(value);
    setOperationData({});
  };

  const handleExecute = () => {
    if (!operationType) return;

    const operation = {
      type: operationType,
      data: operationData,
      doctorIds: selectedDoctors?.map(d => d?.id)
    };

    onBulkOperation(operation);
    setOperationType('');
    setOperationData({});
  };

  const renderOperationForm = () => {
    switch (operationType) {
      case 'update-location':
        return (
          <Select
            label="New Location"
            placeholder="Select location"
            options={locationOptions}
            value={operationData?.location || ''}
            onChange={(value) => setOperationData({ location: value })}
          />
        );

      case 'update-status':
        return (
          <Select
            label="New Status"
            placeholder="Select status"
            options={statusOptions}
            value={operationData?.status || ''}
            onChange={(value) => setOperationData({ status: value })}
          />
        );

      case 'schedule-break':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Break Start Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={operationData?.startTime || ''}
                  onChange={(e) => setOperationData(prev => ({ ...prev, startTime: e?.target?.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Break End Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={operationData?.endTime || ''}
                  onChange={(e) => setOperationData(prev => ({ ...prev, endTime: e?.target?.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Break Reason
              </label>
              <input
                type="text"
                placeholder="Lunch break, meeting, etc."
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={operationData?.reason || ''}
                onChange={(e) => setOperationData(prev => ({ ...prev, reason: e?.target?.value }))}
              />
            </div>
          </div>
        );

      case 'block-schedule':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={operationData?.startDate || ''}
                  onChange={(e) => setOperationData(prev => ({ ...prev, startDate: e?.target?.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={operationData?.endDate || ''}
                  onChange={(e) => setOperationData(prev => ({ ...prev, endDate: e?.target?.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Block Reason
              </label>
              <input
                type="text"
                placeholder="Vacation, conference, training, etc."
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={operationData?.reason || ''}
                onChange={(e) => setOperationData(prev => ({ ...prev, reason: e?.target?.value }))}
              />
            </div>
          </div>
        );

      case 'update-availability':
        return (
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-3">Update Weekly Hours</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={operationData?.startTime || '09:00'}
                    onChange={(e) => setOperationData(prev => ({ ...prev, startTime: e?.target?.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={operationData?.endTime || '17:00'}
                    onChange={(e) => setOperationData(prev => ({ ...prev, endTime: e?.target?.value }))}
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={operationData?.applyToWeekends || false}
                    onChange={(e) => setOperationData(prev => ({ ...prev, applyToWeekends: e?.target?.checked }))}
                  />
                  <span className="text-sm text-foreground">Apply to weekends</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'export-data':
        return (
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-3">Export Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={operationData?.includeSchedule || false}
                    onChange={(e) => setOperationData(prev => ({ ...prev, includeSchedule: e?.target?.checked }))}
                  />
                  <span className="text-sm text-foreground">Include schedule data</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={operationData?.includeCredentials || false}
                    onChange={(e) => setOperationData(prev => ({ ...prev, includeCredentials: e?.target?.checked }))}
                  />
                  <span className="text-sm text-foreground">Include credentials</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={operationData?.includeStats || false}
                    onChange={(e) => setOperationData(prev => ({ ...prev, includeStats: e?.target?.checked }))}
                  />
                  <span className="text-sm text-foreground">Include statistics</span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isVisible || selectedDoctors?.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-large p-4 z-50 min-w-96 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">
              {selectedDoctors?.length}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Bulk Operations</h3>
            <p className="text-sm text-muted-foreground">
              {selectedDoctors?.length} doctor{selectedDoctors?.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClearSelection}
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      <div className="space-y-4">
        <Select
          label="Select Operation"
          placeholder="Choose bulk operation"
          options={operationOptions}
          value={operationType}
          onChange={handleOperationChange}
        />

        {operationType && renderOperationForm()}

        {operationType && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              This operation will affect {selectedDoctors?.length} doctor{selectedDoctors?.length !== 1 ? 's' : ''}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOperationType('')}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Play"
                iconPosition="left"
                onClick={handleExecute}
              >
                Execute
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Selected Doctors Preview */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-2">
          {selectedDoctors?.slice(0, 5)?.map((doctor) => (
            <div
              key={doctor?.id}
              className="flex items-center space-x-2 bg-muted/50 px-2 py-1 rounded-md text-sm"
            >
              <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0" />
              <span className="text-foreground">{doctor?.name}</span>
            </div>
          ))}
          {selectedDoctors?.length > 5 && (
            <div className="flex items-center px-2 py-1 text-sm text-muted-foreground">
              +{selectedDoctors?.length - 5} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsPanel;