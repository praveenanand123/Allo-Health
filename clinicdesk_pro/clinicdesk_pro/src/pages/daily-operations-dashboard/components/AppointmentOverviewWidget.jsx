import React from 'react';
import Icon from '../../../components/AppIcon';

const AppointmentOverviewWidget = ({ appointments, onViewSchedule }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-success';
      case 'pending': return 'text-warning';
      case 'cancelled': return 'text-error';
      case 'completed': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success/10';
      case 'pending': return 'bg-warning/10';
      case 'cancelled': return 'bg-error/10';
      case 'completed': return 'bg-primary/10';
      default: return 'bg-muted/10';
    }
  };

  const totalAppointments = appointments?.reduce((sum, apt) => sum + apt?.count, 0);
  const conflicts = appointments?.filter(apt => apt?.hasConflict)?.length;

  return (
    <div className="bg-card rounded-lg border border-border p-6 min-h-[280px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Today's Appointments</h3>
            <p className="text-sm text-muted-foreground">Schedule overview</p>
          </div>
        </div>
        <button
          onClick={onViewSchedule}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <Icon name="ExternalLink" size={16} />
        </button>
      </div>
      {conflicts > 0 && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">
              {conflicts} scheduling conflict{conflicts > 1 ? 's' : ''} detected
            </span>
          </div>
        </div>
      )}
      <div className="mb-6">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-foreground">{totalAppointments}</span>
          <span className="text-sm text-muted-foreground">appointments</span>
        </div>
      </div>
      <div className="space-y-3">
        {appointments?.map((appointment) => (
          <div key={appointment?.status} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getStatusBg(appointment?.status)} ${getStatusColor(appointment?.status)}`} 
                   style={{ backgroundColor: 'currentColor' }} />
              <span className="text-sm font-medium text-foreground capitalize">
                {appointment?.status}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-foreground">{appointment?.count}</span>
              {appointment?.hasConflict && (
                <Icon name="AlertCircle" size={14} className="text-error" />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Next appointment</span>
            <p className="font-medium text-foreground">09:30 AM</p>
          </div>
          <div>
            <span className="text-muted-foreground">Available slots</span>
            <p className="font-medium text-foreground">12 remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentOverviewWidget;