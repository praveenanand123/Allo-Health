import React from 'react';
import Icon from '../../../components/AppIcon';

const DoctorAvailabilityHeatmap = ({ doctors, onViewDetails }) => {
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const getUtilizationColor = (utilization) => {
    if (utilization >= 90) return 'bg-error text-error-foreground';
    if (utilization >= 75) return 'bg-warning text-warning-foreground';
    if (utilization >= 50) return 'bg-success text-success-foreground';
    if (utilization >= 25) return 'bg-primary text-primary-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getUtilizationIntensity = (utilization) => {
    if (utilization >= 90) return 'opacity-100';
    if (utilization >= 75) return 'opacity-80';
    if (utilization >= 50) return 'opacity-60';
    if (utilization >= 25) return 'opacity-40';
    return 'opacity-20';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 min-h-[320px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Activity" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Doctor Utilization</h3>
            <p className="text-sm text-muted-foreground">Today's schedule heatmap</p>
          </div>
        </div>
        <button
          onClick={onViewDetails}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <Icon name="ExternalLink" size={16} />
        </button>
      </div>
      <div className="space-y-4">
        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Low utilization</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-muted rounded opacity-20" />
            <div className="w-3 h-3 bg-primary rounded opacity-40" />
            <div className="w-3 h-3 bg-success rounded opacity-60" />
            <div className="w-3 h-3 bg-warning rounded opacity-80" />
            <div className="w-3 h-3 bg-error rounded opacity-100" />
          </div>
          <span>High utilization</span>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-3">
          {/* Time slots header */}
          <div className="grid grid-cols-10 gap-1 text-xs text-muted-foreground">
            <div className="w-20"></div>
            {timeSlots?.map(time => (
              <div key={time} className="text-center">{time}</div>
            ))}
          </div>

          {/* Doctor rows */}
          {doctors?.map((doctor) => (
            <div key={doctor?.id} className="grid grid-cols-10 gap-1 items-center">
              <div className="w-20 text-sm font-medium text-foreground truncate">
                Dr. {doctor?.name}
              </div>
              {doctor?.schedule?.map((slot, index) => (
                <div
                  key={index}
                  className={`h-8 rounded flex items-center justify-center text-xs font-medium
                    ${slot?.available ? getUtilizationColor(slot?.utilization) : 'bg-muted/30'}
                    ${slot?.available ? getUtilizationIntensity(slot?.utilization) : ''}
                  `}
                  title={slot?.available ? `${slot?.utilization}% utilized` : 'Not available'}
                >
                  {slot?.available ? `${slot?.utilization}%` : '-'}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Average utilization</span>
            <p className="font-semibold text-foreground">73%</p>
          </div>
          <div>
            <span className="text-muted-foreground">Peak hour</span>
            <p className="font-semibold text-foreground">14:00-15:00</p>
          </div>
          <div>
            <span className="text-muted-foreground">Available now</span>
            <p className="font-semibold text-success">4 doctors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailabilityHeatmap;