import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const PatientDetails = ({ patient, doctors, onUpdatePatient, onStatusUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    assignedDoctor: patient?.assignedDoctor || '',
    priority: patient?.priority || 'normal',
    reason: patient?.reason || '',
    notes: patient?.notes || ''
  });

  if (!patient) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Patient Details</h3>
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a patient from the queue to view details</p>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: 'waiting', label: 'Waiting' },
    { value: 'with-doctor', label: 'With Doctor' },
    { value: 'completed', label: 'Completed' }
  ];

  const priorityOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'emergency', label: 'Emergency' }
  ];

  const doctorOptions = doctors?.map(doctor => ({
    value: doctor?.id,
    label: `${doctor?.name} - ${doctor?.specialization}`
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'bg-blue-100 text-blue-800';
      case 'with-doctor':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency':
        return 'text-error';
      case 'urgent':
        return 'text-warning';
      case 'normal':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTime = (date) => {
    return new Date(date)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatWaitTime = (arrivalTime) => {
    const now = new Date();
    const arrival = new Date(arrivalTime);
    const diffMinutes = Math.floor((now - arrival) / (1000 * 60));
    return `${diffMinutes} minutes`;
  };

  const handleSave = () => {
    onUpdatePatient(patient?.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      assignedDoctor: patient?.assignedDoctor || '',
      priority: patient?.priority || 'normal',
      reason: patient?.reason || '',
      notes: patient?.notes || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Patient Details</h3>
        <Button
          variant={isEditing ? "outline" : "ghost"}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          iconName={isEditing ? "X" : "Edit"}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        {/* Patient Basic Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={24} className="text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground">{patient?.patientName}</h4>
              <p className="text-sm text-muted-foreground">{patient?.phoneNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Queue Number</p>
              <p className={`font-mono font-bold text-lg ${getPriorityColor(patient?.priority)}`}>
                {patient?.queueNumber}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient?.status)}`}>
                {patient?.status?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Arrival Time</p>
              <p className="text-sm font-medium text-foreground">{formatTime(patient?.arrivalTime)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Wait Time</p>
              <p className="text-sm font-medium text-foreground">{formatWaitTime(patient?.arrivalTime)}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          {isEditing ? (
            <div className="space-y-4">
              <Select
                label="Assigned Doctor"
                options={doctorOptions}
                value={editData?.assignedDoctor}
                onChange={(value) => setEditData(prev => ({ ...prev, assignedDoctor: value }))}
              />

              <Select
                label="Priority Level"
                options={priorityOptions}
                value={editData?.priority}
                onChange={(value) => setEditData(prev => ({ ...prev, priority: value }))}
              />

              <Input
                label="Reason for Visit"
                type="text"
                value={editData?.reason}
                onChange={(e) => setEditData(prev => ({ ...prev, reason: e?.target?.value }))}
              />

              <Input
                label="Notes"
                type="text"
                value={editData?.notes}
                onChange={(e) => setEditData(prev => ({ ...prev, notes: e?.target?.value }))}
                placeholder="Add any additional notes..."
              />

              <div className="flex space-x-2">
                <Button variant="default" size="sm" onClick={handleSave} iconName="Check">
                  Save Changes
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel} iconName="X">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Assigned Doctor</p>
                <p className="text-sm font-medium text-foreground">
                  {patient?.assignedDoctorName || 'Not assigned'}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Priority Level</p>
                <p className={`text-sm font-medium capitalize ${getPriorityColor(patient?.priority)}`}>
                  {patient?.priority}
                </p>
              </div>

              {patient?.reason && (
                <div>
                  <p className="text-xs text-muted-foreground">Reason for Visit</p>
                  <p className="text-sm text-foreground">{patient?.reason}</p>
                </div>
              )}

              {patient?.notes && (
                <div>
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="text-sm text-foreground">{patient?.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {patient?.status === 'waiting' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(patient?.id, 'with-doctor')}
                iconName="Play"
              >
                Start Visit
              </Button>
            )}
            {patient?.status === 'with-doctor' && (
              <Button
                variant="success"
                size="sm"
                onClick={() => onStatusUpdate(patient?.id, 'completed')}
                iconName="Check"
              >
                Complete
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              iconName="Phone"
            >
              Call Patient
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="MessageSquare"
            >
              Send SMS
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="FileText"
            >
              View History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;