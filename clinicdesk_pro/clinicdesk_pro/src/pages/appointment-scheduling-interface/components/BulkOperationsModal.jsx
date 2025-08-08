import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkOperationsModal = ({ 
  isOpen, 
  onClose, 
  appointments, 
  doctors, 
  onBulkUpdate,
  selectedAppointments = []
}) => {
  const [operation, setOperation] = useState('');
  const [selectedIds, setSelectedIds] = useState(selectedAppointments);
  const [bulkData, setBulkData] = useState({
    status: '',
    doctorId: '',
    date: '',
    time: '',
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const operations = [
    { value: 'reschedule', label: 'Reschedule Appointments', icon: 'Calendar' },
    { value: 'cancel', label: 'Cancel Appointments', icon: 'X' },
    { value: 'status-update', label: 'Update Status', icon: 'CheckCircle' },
    { value: 'doctor-change', label: 'Change Doctor', icon: 'UserCog' },
    { value: 'send-reminders', label: 'Send Reminders', icon: 'Bell' },
    { value: 'export', label: 'Export Data', icon: 'Download' }
  ];

  const statusOptions = [
    { value: 'booked', label: 'Booked' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' }
  ];

  const doctorOptions = doctors?.map(doctor => ({
    value: doctor?.id,
    label: `Dr. ${doctor?.name} - ${doctor?.specialization}`
  }));

  const filteredAppointments = appointments?.filter(apt =>
    apt?.patientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    apt?.type?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredAppointments?.map(apt => apt?.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectAppointment = (appointmentId, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, appointmentId]);
    } else {
      setSelectedIds(prev => prev?.filter(id => id !== appointmentId));
    }
  };

  const handleExecute = async () => {
    if (!operation || selectedIds?.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      await onBulkUpdate(operation, selectedIds, bulkData);
      onClose();
    } catch (error) {
      console.error('Bulk operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getOperationForm = () => {
    switch (operation) {
      case 'reschedule':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="New Date"
                type="date"
                value={bulkData?.date}
                onChange={(e) => setBulkData({ ...bulkData, date: e?.target?.value })}
                min={new Date()?.toISOString()?.split('T')?.[0]}
              />
              <Input
                label="New Time"
                type="time"
                value={bulkData?.time}
                onChange={(e) => setBulkData({ ...bulkData, time: e?.target?.value })}
                step="900"
              />
            </div>
            <Select
              label="New Doctor (Optional)"
              options={[{ value: '', label: 'Keep current doctor' }, ...doctorOptions]}
              value={bulkData?.doctorId}
              onChange={(value) => setBulkData({ ...bulkData, doctorId: value })}
            />
          </div>
        );

      case 'status-update':
        return (
          <Select
            label="New Status"
            options={statusOptions}
            value={bulkData?.status}
            onChange={(value) => setBulkData({ ...bulkData, status: value })}
            required
          />
        );

      case 'doctor-change':
        return (
          <Select
            label="New Doctor"
            options={doctorOptions}
            value={bulkData?.doctorId}
            onChange={(value) => setBulkData({ ...bulkData, doctorId: value })}
            required
            searchable
          />
        );

      case 'cancel':
        return (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cancellation Reason
            </label>
            <textarea
              className="w-full min-h-24 p-3 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Enter reason for cancellation..."
              value={bulkData?.notes}
              onChange={(e) => setBulkData({ ...bulkData, notes: e?.target?.value })}
            />
          </div>
        );

      case 'send-reminders':
        return (
          <div className="p-4 bg-muted/50 rounded-md">
            <div className="flex items-center space-x-3">
              <Icon name="Bell" size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Send Appointment Reminders</p>
                <p className="text-xs text-muted-foreground">
                  Reminders will be sent via SMS and email to all selected patients
                </p>
              </div>
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="p-4 bg-muted/50 rounded-md">
            <div className="flex items-center space-x-3">
              <Icon name="Download" size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Export Appointment Data</p>
                <p className="text-xs text-muted-foreground">
                  Selected appointments will be exported as CSV file
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Bulk Operations</h2>
            <p className="text-sm text-muted-foreground">
              Manage multiple appointments at once
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Operation Selection */}
          <div className="w-80 border-r border-border p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Select Operation</h3>
            <div className="space-y-2">
              {operations?.map(op => (
                <button
                  key={op?.value}
                  onClick={() => setOperation(op?.value)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-md text-left transition-colors ${
                    operation === op?.value
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <Icon name={op?.icon} size={16} />
                  <span className="text-sm">{op?.label}</span>
                </button>
              ))}
            </div>

            {operation && (
              <div className="mt-6 p-4 bg-muted/50 rounded-md">
                <h4 className="text-sm font-medium text-foreground mb-2">Operation Details</h4>
                {getOperationForm()}
              </div>
            )}
          </div>

          {/* Right Panel - Appointment Selection */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Select Appointments ({selectedIds?.length} selected)
                </h3>
                <Checkbox
                  label="Select All"
                  checked={selectedIds?.length === filteredAppointments?.length && filteredAppointments?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </div>
              
              <Input
                type="search"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {filteredAppointments?.map(appointment => {
                  const doctor = doctors?.find(d => d?.id === appointment?.doctorId);
                  return (
                    <div
                      key={appointment?.id}
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedIds?.includes(appointment?.id)
                          ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => handleSelectAppointment(
                        appointment?.id, 
                        !selectedIds?.includes(appointment?.id)
                      )}
                    >
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={selectedIds?.includes(appointment?.id)}
                          onChange={(e) => handleSelectAppointment(appointment?.id, e?.target?.checked)}
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {appointment?.patientName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {appointment?.date} at {appointment?.time}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-foreground">
                                Dr. {doctor?.name}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {appointment?.type} • {appointment?.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedIds?.length} appointment{selectedIds?.length !== 1 ? 's' : ''} selected
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleExecute}
              loading={isLoading}
              disabled={!operation || selectedIds?.length === 0}
            >
              Execute Operation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsModal;