import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProgressTimeline = ({ checkedInPatients = [], onStatusUpdate, onPatientSelect }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const workflowStages = [
    {
      id: 'arrived',
      label: 'Arrived',
      icon: 'MapPin',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      description: 'Patient has arrived at clinic'
    },
    {
      id: 'checked-in',
      label: 'Checked In',
      icon: 'UserCheck',
      color: 'text-primary',
      bgColor: 'bg-primary',
      description: 'Check-in process completed'
    },
    {
      id: 'waiting',
      label: 'Waiting',
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning',
      description: 'Waiting for doctor'
    },
    {
      id: 'with-doctor',
      label: 'With Doctor',
      icon: 'Stethoscope',
      color: 'text-accent',
      bgColor: 'bg-accent',
      description: 'Currently with healthcare provider'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success',
      description: 'Visit completed'
    }
  ];

  const getStageIndex = (status) => {
    return workflowStages?.findIndex(stage => stage?.id === status);
  };

  const getWaitTime = (checkInTime) => {
    const now = new Date();
    const checkIn = new Date(checkInTime);
    const diffMinutes = Math.floor((now - checkIn) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const handleStatusUpdate = (patientId, newStatus, staffInitials = 'FD') => {
    const updateData = {
      patientId,
      newStatus,
      timestamp: new Date()?.toISOString(),
      staffInitials
    };
    onStatusUpdate(updateData);
  };

  const getNextStatus = (currentStatus) => {
    const currentIndex = getStageIndex(currentStatus);
    if (currentIndex < workflowStages?.length - 1) {
      return workflowStages?.[currentIndex + 1]?.id;
    }
    return currentStatus;
  };

  const getPreviousStatus = (currentStatus) => {
    const currentIndex = getStageIndex(currentStatus);
    if (currentIndex > 0) {
      return workflowStages?.[currentIndex - 1]?.id;
    }
    return currentStatus;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Activity" size={20} className="mr-2 text-primary" />
          Progress Timeline
        </h2>
        <div className="text-sm text-muted-foreground">
          {checkedInPatients?.length} patients in progress
        </div>
      </div>
      {checkedInPatients?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Patients Checked In</h3>
          <p className="text-muted-foreground">
            Patients will appear here after check-in is completed
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {checkedInPatients?.map((patient) => {
            const currentStageIndex = getStageIndex(patient?.status);
            const isSelected = selectedPatient?.id === patient?.id;

            return (
              <div
                key={patient?.id}
                className={`border rounded-lg p-4 transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
                onClick={() => {
                  setSelectedPatient(isSelected ? null : patient);
                  onPatientSelect(isSelected ? null : patient);
                }}
              >
                {/* Patient Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-foreground">{patient?.patientName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>ID: {patient?.patientId}</span>
                      <span>Wait: {getWaitTime(patient?.checkInTime)}</span>
                      <span>Reason: {patient?.visitReason}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {workflowStages?.[currentStageIndex]?.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(patient.lastUpdate || patient.checkInTime)?.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                {/* Progress Timeline */}
                <div className="flex items-center justify-between mb-4">
                  {workflowStages?.map((stage, index) => {
                    const isCompleted = index <= currentStageIndex;
                    const isCurrent = index === currentStageIndex;

                    return (
                      <div key={stage?.id} className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted 
                            ? `${stage?.bgColor} text-white` 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon name={stage?.icon} size={16} />
                        </div>
                        <div className={`text-xs mt-1 text-center ${
                          isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'
                        }`}>
                          {stage?.label}
                        </div>
                        {index < workflowStages?.length - 1 && (
                          <div className={`absolute h-0.5 w-full mt-4 ${
                            index < currentStageIndex ? 'bg-primary' : 'bg-border'
                          }`} style={{ 
                            left: '50%', 
                            width: `${100 / workflowStages?.length}%`,
                            zIndex: -1 
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Action Buttons (shown when selected) */}
                {isSelected && (
                  <div className="flex space-x-2 pt-4 border-t border-border">
                    {currentStageIndex > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleStatusUpdate(patient?.patientId, getPreviousStatus(patient?.status));
                        }}
                        iconName="ArrowLeft"
                        iconPosition="left"
                      >
                        Previous
                      </Button>
                    )}
                    
                    {currentStageIndex < workflowStages?.length - 1 && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleStatusUpdate(patient?.patientId, getNextStatus(patient?.status));
                        }}
                        iconName="ArrowRight"
                        iconPosition="right"
                      >
                        Next Stage
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        // Handle patient details view
                      }}
                      iconName="Eye"
                    >
                      Details
                    </Button>
                  </div>
                )}
                {/* Quick Status Indicators */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    {patient?.specialNeeds && (
                      <div className="flex items-center">
                        <Icon name="AlertCircle" size={12} className="mr-1 text-warning" />
                        Special needs
                      </div>
                    )}
                    {patient?.insuranceVerified && (
                      <div className="flex items-center">
                        <Icon name="Shield" size={12} className="mr-1 text-success" />
                        Insurance OK
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Staff: {patient?.staffInitials || 'FD'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Hotkey Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center mb-2">
            <Icon name="Keyboard" size={12} className="mr-1" />
            Quick Status Updates (F-keys)
          </div>
          <div className="grid grid-cols-5 gap-2">
            {workflowStages?.map((stage, index) => (
              <div key={stage?.id} className="flex items-center">
                <kbd className="px-1 py-0.5 text-xs bg-muted rounded">F{index + 1}</kbd>
                <span className="ml-1">{stage?.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTimeline;