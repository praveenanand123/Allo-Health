import React from 'react';
import Icon from '../../../components/AppIcon';

const DoctorAvailability = ({ doctors }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-success bg-success/10';
      case 'busy':
        return 'text-warning bg-warning/10';
      case 'break':
        return 'text-muted-foreground bg-muted';
      case 'unavailable':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return 'CheckCircle';
      case 'busy':
        return 'Clock';
      case 'break':
        return 'Coffee';
      case 'unavailable':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Doctor Availability</h3>
      <div className="space-y-3">
        {doctors?.map((doctor) => (
          <div key={doctor?.id} className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{doctor?.name}</p>
                  <p className="text-xs text-muted-foreground">{doctor?.specialization}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded-full flex items-center space-x-1 ${getStatusColor(doctor?.status)}`}>
                  <Icon name={getStatusIcon(doctor?.status)} size={12} />
                  <span className="text-xs font-medium capitalize">{doctor?.status}</span>
                </div>
              </div>
            </div>
            {doctor?.currentPatients > 0 && (
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Current patients: <span className="font-medium text-foreground">{doctor?.currentPatients}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAvailability;