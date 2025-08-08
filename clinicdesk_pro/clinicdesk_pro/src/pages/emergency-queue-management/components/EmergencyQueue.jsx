import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyQueue = ({ emergencyPatients = [], onUpdateStatus, onViewDetails }) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [lastPatientCount, setLastPatientCount] = useState(emergencyPatients?.length);

  // Audio alert for new emergency patients
  useEffect(() => {
    if (audioEnabled && emergencyPatients?.length > lastPatientCount) {
      // In a real app, you would play an audio alert here
      console.log('🚨 New emergency patient added - Audio alert triggered');
    }
    setLastPatientCount(emergencyPatients?.length);
  }, [emergencyPatients?.length, lastPatientCount, audioEnabled]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white border-red-700';
      case 'urgent': return 'bg-orange-500 text-white border-orange-600';
      case 'semi-urgent': return 'bg-yellow-500 text-black border-yellow-600';
      case 'less-urgent': return 'bg-blue-500 text-white border-blue-600';
      default: return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'Zap';
      case 'urgent': return 'AlertTriangle';
      case 'semi-urgent': return 'Clock';
      case 'less-urgent': return 'Info';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'emergency-waiting': return 'text-error';
      case 'with-doctor': return 'text-warning';
      case 'completed': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatWaitTime = (timestamp) => {
    const now = new Date();
    const start = new Date(timestamp);
    const diffMinutes = Math.floor((now - start) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <div className="bg-card border border-error/20 rounded-lg shadow-lg h-full">
      {/* Header */}
      <div className="bg-error/10 px-4 py-3 border-b border-error/20 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={20} className="text-error animate-pulse" />
            <h3 className="text-lg font-semibold text-error">Emergency Queue</h3>
            <span className="bg-error text-error-foreground px-2 py-1 rounded-full text-sm font-medium">
              {emergencyPatients?.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={audioEnabled ? 'text-success' : 'text-muted-foreground'}
            >
              <Icon name={audioEnabled ? 'Volume2' : 'VolumeX'} size={16} />
            </Button>
            
            <Button variant="outline" size="sm">
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground">
          Live updates • Last refresh: {new Date()?.toLocaleTimeString()}
        </div>
      </div>
      {/* Queue List */}
      <div className="flex-1 overflow-y-auto max-h-96">
        {emergencyPatients?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon name="CheckCircle" size={48} className="text-success mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Emergency Cases</h4>
            <p className="text-muted-foreground">All emergency situations have been resolved</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {emergencyPatients?.map((patient, index) => (
              <div
                key={patient?.queueNumber}
                className={`border-l-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
                  patient?.severity === 'critical' ? 'border-l-red-600 bg-red-50/50' :
                  patient?.severity === 'urgent' ? 'border-l-orange-500 bg-orange-50/50' :
                  patient?.severity === 'semi-urgent'? 'border-l-yellow-500 bg-yellow-50/50' : 'border-l-blue-500 bg-blue-50/50'
                }`}
              >
                <div className="p-4">
                  {/* Patient Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded-md text-sm font-bold ${getSeverityColor(patient?.severity)}`}>
                        <Icon name={getSeverityIcon(patient?.severity)} size={14} className="inline mr-1" />
                        {patient?.queueNumber}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-lg">{patient?.patientName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {patient?.severity?.replace('-', ' ')?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getStatusColor(patient?.status)}`}>
                        {patient?.status?.replace('-', ' ')?.toUpperCase()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Wait: {formatWaitTime(patient?.timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Chief Complaint */}
                  <div className="mb-3">
                    <p className="text-sm text-foreground font-medium mb-1">Chief Complaint:</p>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      {patient?.chiefComplaint}
                    </p>
                  </div>

                  {/* Contact Info */}
                  {patient?.emergencyContact && (
                    <div className="mb-3 text-xs text-muted-foreground">
                      <Icon name="Phone" size={12} className="inline mr-1" />
                      Emergency Contact: {patient?.emergencyContact}
                      {patient?.contactPhone && ` - ${patient?.contactPhone}`}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(patient)}
                      >
                        <Icon name="Eye" size={14} className="mr-1" />
                        Details
                      </Button>
                      
                      {patient?.status === 'emergency-waiting' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onUpdateStatus(patient?.queueNumber, 'with-doctor')}
                        >
                          <Icon name="UserCheck" size={14} className="mr-1" />
                          Assign Doctor
                        </Button>
                      )}
                      
                      {patient?.status === 'with-doctor' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => onUpdateStatus(patient?.queueNumber, 'completed')}
                        >
                          <Icon name="CheckCircle" size={14} className="mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Added: {new Date(patient.timestamp)?.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer Stats */}
      <div className="border-t border-border p-4 bg-muted/30">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-red-600">
              {emergencyPatients?.filter(p => p?.severity === 'critical')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-500">
              {emergencyPatients?.filter(p => p?.severity === 'urgent')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Urgent</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">
              {emergencyPatients?.filter(p => p?.severity === 'semi-urgent')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Semi-Urgent</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-500">
              {emergencyPatients?.filter(p => p?.severity === 'less-urgent')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Less Urgent</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyQueue;