import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsCard = ({ doctors }) => {
  const stats = {
    total: doctors?.length,
    available: doctors?.filter(d => d?.status === 'available')?.length,
    busy: doctors?.filter(d => d?.status === 'busy')?.length,
    offline: doctors?.filter(d => d?.status === 'offline')?.length,
    onBreak: doctors?.filter(d => d?.status === 'break')?.length,
    totalPatients: doctors?.reduce((sum, d) => sum + (d?.currentPatients || 0), 0),
    avgExperience: Math.round(doctors?.reduce((sum, d) => sum + (parseInt(d?.experience) || 0), 0) / doctors?.length),
    specializations: [...new Set(doctors.flatMap(d => d.specialization || []))]?.length
  };

  const statCards = [
    {
      label: 'Total Doctors',
      value: stats?.total,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Available Now',
      value: stats?.available,
      icon: 'UserCheck',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Currently Busy',
      value: stats?.busy,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Total Patients',
      value: stats?.totalPatients,
      icon: 'Activity',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  const statusBreakdown = [
    { label: 'Available', count: stats?.available, color: 'bg-success' },
    { label: 'Busy', count: stats?.busy, color: 'bg-warning' },
    { label: 'On Break', count: stats?.onBreak, color: 'bg-secondary' },
    { label: 'Offline', count: stats?.offline, color: 'bg-error' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Overview</h3>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date()?.toLocaleTimeString()}
        </div>
      </div>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards?.map((stat, index) => (
          <div key={index} className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat?.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
                <Icon name={stat?.icon} size={24} className={stat?.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-foreground mb-3">Doctor Status Distribution</h4>
          <div className="space-y-2">
            {statusBreakdown?.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${status?.color}`} />
                  <span className="text-sm text-foreground">{status?.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">{status?.count}</span>
                  <span className="text-xs text-muted-foreground">
                    ({stats?.total > 0 ? Math.round((status?.count / stats?.total) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-foreground mb-3">Additional Metrics</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Award" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Avg. Experience</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {stats?.avgExperience} years
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Briefcase" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Specializations</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {stats?.specializations}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Utilization Rate</span>
              </div>
              <span className="text-sm font-medium text-success">
                {stats?.total > 0 ? Math.round(((stats?.available + stats?.busy) / stats?.total) * 100) : 0}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Avg. Patient Load</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {stats?.total > 0 ? Math.round(stats?.totalPatients / stats?.total) : 0} patients
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            System Status: All integrations operational
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-xs text-success">Live Updates Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStatsCard;