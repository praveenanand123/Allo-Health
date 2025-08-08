import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkOperations = ({ selectedPatients, onBulkOperation, doctors }) => {
  const [selectedOperation, setSelectedOperation] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const operationOptions = [
    { value: 'status-waiting', label: 'Set Status to Waiting' },
    { value: 'status-with-doctor', label: 'Set Status to With Doctor' },
    { value: 'status-completed', label: 'Set Status to Completed' },
    { value: 'reassign-doctor', label: 'Reassign Doctor' },
    { value: 'priority-urgent', label: 'Set Priority to Urgent' },
    { value: 'priority-normal', label: 'Set Priority to Normal' },
    { value: 'export-list', label: 'Export Selected' },
    { value: 'clear-completed', label: 'Clear Completed Patients' }
  ];

  const doctorOptions = doctors?.map(doctor => ({
    value: doctor?.id,
    label: `${doctor?.name} - ${doctor?.specialization}`
  }));

  const handleExecuteOperation = () => {
    if (!selectedOperation) return;

    const operationData = {
      operation: selectedOperation,
      patientIds: selectedPatients,
      doctorId: selectedDoctor
    };

    onBulkOperation(operationData);
    
    // Reset selections
    setSelectedOperation('');
    setSelectedDoctor('');
  };

  const needsDoctorSelection = selectedOperation === 'reassign-doctor';

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-foreground">Bulk Operations</h4>
        {selectedPatients?.length > 0 && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {selectedPatients?.length} selected
          </span>
        )}
      </div>
      <div className="space-y-3">
        <Select
          label="Select Operation"
          placeholder="Choose an operation"
          options={operationOptions}
          value={selectedOperation}
          onChange={setSelectedOperation}
          disabled={selectedPatients?.length === 0}
        />

        {needsDoctorSelection && (
          <Select
            label="Select Doctor"
            placeholder="Choose a doctor"
            options={doctorOptions}
            value={selectedDoctor}
            onChange={setSelectedDoctor}
          />
        )}

        <Button
          variant="default"
          size="sm"
          fullWidth
          onClick={handleExecuteOperation}
          disabled={
            !selectedOperation || 
            selectedPatients?.length === 0 || 
            (needsDoctorSelection && !selectedDoctor)
          }
          iconName="Zap"
        >
          Execute Operation
        </Button>
      </div>
      {/* Quick Action Buttons */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => onBulkOperation({ operation: 'select-all' })}
            iconName="CheckSquare"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onBulkOperation({ operation: 'clear-selection' })}
            iconName="Square"
          >
            Clear Selection
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onBulkOperation({ operation: 'export-queue' })}
            iconName="Download"
          >
            Export Queue
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onBulkOperation({ operation: 'print-queue' })}
            iconName="Printer"
          >
            Print Queue
          </Button>
        </div>
      </div>
      {/* Statistics */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Queue Summary</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Waiting</p>
            <p className="text-sm font-semibold text-blue-600">12</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-sm font-semibold text-green-600">5</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-sm font-semibold text-gray-600">28</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperations;