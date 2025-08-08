import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DoctorAvailabilityPanel = ({ doctors = [], onAssignDoctor, onUpdateAvailability }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available': return 'text-success bg-success/10 border-success/20';
      case 'busy': return 'text-warning bg-warning/10 border-warning/20';
      case 'emergency-ready': return 'text-error bg-error/10 border-error/20';
      case 'off-duty': return 'text-muted-foreground bg-muted/10 border-muted/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getAvailabilityIcon = (status) => {
    switch (status) {
      case 'available': return 'CheckCircle';
      case 'busy': return 'Clock';
      case 'emergency-ready': return 'Zap';
      case 'off-duty': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getResponseTime = (doctor) => {
    if (doctor?.emergencyResponse) {
      return doctor?.emergencyResponse?.estimatedTime || 'Immediate';
    }
    return 'Not specified';
  };

  const handleQuickAssign = (doctor) => {
    if (doctor?.availability === 'available' || doctor?.availability === 'emergency-ready') {
      onAssignDoctor(doctor?.id);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg h-full">
      {/* Header */}
      <div className="bg-primary/10 px-4 py-3 border-b border-border rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-primary">Doctor Availability</h3>
          </div>
          
          <Button variant="outline" size="sm">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground">
          Emergency response status • Updated: {new Date()?.toLocaleTimeString()}
        </div>
      </div>
      {/* Doctor List */}
      <div className="flex-1 overflow-y-auto max-h-96">
        <div className="p-4 space-y-3">
          {doctors?.map((doctor) => (
            <div
              key={doctor?.id}
              className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                selectedDoctor?.id === doctor?.id ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => setSelectedDoctor(doctor)}
            >
              {/* Doctor Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{doctor?.name}</h4>
                    <p className="text-sm text-muted-foreground">{doctor?.specialization}</p>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(doctor?.availability)}`}>
                  <Icon name={getAvailabilityIcon(doctor?.availability)} size={12} className="inline mr-1" />
                  {doctor?.availability?.replace('-', ' ')?.toUpperCase()}
                </div>
              </div>

              {/* Location & Room */}
              <div className="mb-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={12} />
                    <span>{doctor?.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Home" size={12} />
                    <span>Room {doctor?.room}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Response Info */}
              {doctor?.emergencyResponse && (
                <div className="mb-3 bg-error/5 border border-error/20 rounded p-2">
                  <div className="text-xs font-medium text-error mb-1">Emergency Response</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Response Time:</span>
                      <span className="font-medium">{getResponseTime(doctor)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Priority Level:</span>
                      <span className="font-medium">{doctor?.emergencyResponse?.priority || 'Standard'}</span>
                    </div>
                    {doctor?.emergencyResponse?.specialties && (
                      <div className="flex items-center justify-between">
                        <span>Emergency Specialties:</span>
                        <span className="font-medium text-xs">
                          {doctor?.emergencyResponse?.specialties?.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Current Status */}
              <div className="mb-3">
                <div className="text-xs text-muted-foreground mb-1">Current Status:</div>
                <div className="text-sm">
                  {doctor?.currentPatient ? (
                    <div className="flex items-center space-x-2">
                      <Icon name="User" size={12} className="text-warning" />
                      <span>With patient: {doctor?.currentPatient}</span>
                      <span className="text-xs text-muted-foreground">
                        (Est. {doctor?.estimatedCompletion || '15 min'})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Icon name="CheckCircle" size={12} className="text-success" />
                      <span>Available for new patients</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center space-x-2">
                  {(doctor?.availability === 'available' || doctor?.availability === 'emergency-ready') && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleQuickAssign(doctor);
                      }}
                    >
                      <Icon name="UserPlus" size={14} className="mr-1" />
                      Quick Assign
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e?.stopPropagation();
                      // Handle contact doctor
                    }}
                  >
                    <Icon name="MessageCircle" size={14} className="mr-1" />
                    Contact
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Updated: {new Date(doctor.lastUpdate || Date.now())?.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer Actions */}
      <div className="border-t border-border p-4 bg-muted/30">
        <div className="grid grid-cols-2 gap-4 text-center text-sm">
          <div>
            <div className="text-lg font-bold text-success">
              {doctors?.filter(d => d?.availability === 'available' || d?.availability === 'emergency-ready')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">
              {doctors?.filter(d => d?.availability === 'busy')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Busy</div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-center space-x-2">
          <Button variant="outline" size="sm" fullWidth>
            <Icon name="Bell" size={14} className="mr-2" />
            Notify All Available
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailabilityPanel;