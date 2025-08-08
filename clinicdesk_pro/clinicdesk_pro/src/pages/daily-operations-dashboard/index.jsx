import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricWidget from './components/MetricWidget';
import QueueSummaryWidget from './components/QueueSummaryWidget';
import AppointmentOverviewWidget from './components/AppointmentOverviewWidget';
import DoctorAvailabilityHeatmap from './components/DoctorAvailabilityHeatmap';
import SystemStatusPanel from './components/SystemStatusPanel';
import AlertsPanel from './components/AlertsPanel';
import PerformanceChart from './components/PerformanceChart';
import DashboardControls from './components/DashboardControls';

const DailyOperationsDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [emergencyActive, setEmergencyActive] = useState(true);

  // Mock data for dashboard widgets
  const queueData = [
    { status: 'waiting', count: 12, avgWaitTime: 18 },
    { status: 'with-doctor', count: 8, avgWaitTime: null },
    { status: 'completed', count: 45, avgWaitTime: null },
    { status: 'emergency', count: 2, avgWaitTime: 5 }
  ];

  const appointmentData = [
    { status: 'confirmed', count: 28, hasConflict: false },
    { status: 'pending', count: 5, hasConflict: true },
    { status: 'completed', count: 32, hasConflict: false },
    { status: 'cancelled', count: 3, hasConflict: false }
  ];

  const doctorAvailabilityData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      schedule: [
        { available: true, utilization: 85 },
        { available: true, utilization: 92 },
        { available: true, utilization: 78 },
        { available: false, utilization: 0 },
        { available: true, utilization: 65 },
        { available: true, utilization: 88 },
        { available: true, utilization: 95 },
        { available: true, utilization: 72 },
        { available: true, utilization: 45 }
      ]
    },
    {
      id: 2,
      name: 'Michael Chen',
      schedule: [
        { available: true, utilization: 75 },
        { available: true, utilization: 68 },
        { available: true, utilization: 82 },
        { available: true, utilization: 90 },
        { available: false, utilization: 0 },
        { available: true, utilization: 77 },
        { available: true, utilization: 85 },
        { available: true, utilization: 60 },
        { available: true, utilization: 55 }
      ]
    },
    {
      id: 3,
      name: 'Emily Davis',
      schedule: [
        { available: true, utilization: 95 },
        { available: true, utilization: 88 },
        { available: true, utilization: 92 },
        { available: true, utilization: 85 },
        { available: true, utilization: 78 },
        { available: false, utilization: 0 },
        { available: true, utilization: 82 },
        { available: true, utilization: 70 },
        { available: true, utilization: 65 }
      ]
    },
    {
      id: 4,
      name: 'Robert Wilson',
      schedule: [
        { available: true, utilization: 60 },
        { available: true, utilization: 72 },
        { available: true, utilization: 85 },
        { available: true, utilization: 78 },
        { available: true, utilization: 82 },
        { available: true, utilization: 90 },
        { available: false, utilization: 0 },
        { available: true, utilization: 75 },
        { available: true, utilization: 68 }
      ]
    }
  ];

  const systemStatusData = [
    {
      name: 'EMR System',
      description: 'Electronic Medical Records',
      status: 'online',
      lastCheck: '2 min ago'
    },
    {
      name: 'Billing System',
      description: 'Patient billing and insurance',
      status: 'warning',
      lastCheck: '5 min ago'
    },
    {
      name: 'Appointment Scheduler',
      description: 'Online booking system',
      status: 'online',
      lastCheck: '1 min ago'
    },
    {
      name: 'Lab Integration',
      description: 'Laboratory results system',
      status: 'online',
      lastCheck: '3 min ago'
    },
    {
      name: 'Pharmacy System',
      description: 'Prescription management',
      status: 'maintenance',
      lastCheck: '15 min ago'
    }
  ];

  const alertsData = [
    {
      id: 1,
      title: 'High Wait Times Detected',
      message: 'Average wait time has exceeded 25 minutes in the main clinic. Consider redistributing patients or adding staff.',
      severity: 'critical',
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: 2,
      title: 'Doctor Schedule Conflict',
      message: 'Dr. Johnson has overlapping appointments at 2:30 PM. Manual intervention required.',
      severity: 'high',
      timestamp: new Date(Date.now() - 600000) // 10 minutes ago
    },
    {
      id: 3,
      title: 'System Maintenance Reminder',
      message: 'Scheduled maintenance for billing system tonight at 11:00 PM. Estimated downtime: 2 hours.',
      severity: 'medium',
      timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
    },
    {
      id: 4,
      title: 'Patient Satisfaction Survey',
      message: 'New patient feedback available. Overall satisfaction: 4.2/5 stars.',
      severity: 'low',
      timestamp: new Date(Date.now() - 3600000) // 1 hour ago
    }
  ];

  const performanceChartData = [
    { name: 'Mon', patients: 45, waitTime: 15, satisfaction: 4.2 },
    { name: 'Tue', patients: 52, waitTime: 18, satisfaction: 4.1 },
    { name: 'Wed', patients: 48, waitTime: 22, satisfaction: 3.9 },
    { name: 'Thu', patients: 61, waitTime: 16, satisfaction: 4.3 },
    { name: 'Fri', patients: 58, waitTime: 19, satisfaction: 4.0 },
    { name: 'Sat', patients: 35, waitTime: 12, satisfaction: 4.4 },
    { name: 'Sun', patients: 28, waitTime: 14, satisfaction: 4.5 }
  ];

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 300000); // 5 minutes
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const handleDateRangeChange = (dateRange) => {
    console.log('Date range changed:', dateRange);
    setLastUpdated(new Date());
  };

  const handleLocationChange = (location) => {
    console.log('Location changed:', location);
    setLastUpdated(new Date());
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const handleExport = () => {
    console.log('Exporting dashboard data...');
  };

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleDismissAlert = (alertId) => {
    console.log('Dismissing alert:', alertId);
  };

  const handleViewAllAlerts = () => {
    console.log('Viewing all alerts...');
  };

  const handleMetricClick = (metricType) => {
    switch (metricType) {
      case 'queue': navigate('/patient-queue-management-dashboard');
        break;
      case 'appointments': navigate('/appointment-scheduling-interface');
        break;
      case 'doctors':
        navigate('/doctor-profile-management');
        break;
      case 'checkin': navigate('/patient-check-in-and-progress-tracking');
        break;
      case 'emergency': navigate('/emergency-queue-management');
        break;
      default:
        console.log('Metric clicked:', metricType);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        emergencyActive={emergencyActive}
        connectionStatus="connected"
      />
      
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        emergencyActive={emergencyActive}
        connectionStatus="connected"
      />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-240'} pt-16`}>
        {/* Dashboard Controls */}
        <DashboardControls
          onDateRangeChange={handleDateRangeChange}
          onLocationChange={handleLocationChange}
          onRefresh={handleRefresh}
          onExport={handleExport}
          autoRefresh={autoRefresh}
          onAutoRefreshToggle={handleAutoRefreshToggle}
          lastUpdated={lastUpdated}
        />

        {/* Main Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricWidget
              title="Total Patients Today"
              value="127"
              trend="up"
              trendValue="+8.2%"
              icon="Users"
              color="primary"
              onClick={() => handleMetricClick('queue')}
            />
            <MetricWidget
              title="Average Wait Time"
              value="18"
              unit="min"
              trend="down"
              trendValue="-12%"
              icon="Clock"
              color="success"
              onClick={() => handleMetricClick('queue')}
            />
            <MetricWidget
              title="Appointments Today"
              value="68"
              trend="up"
              trendValue="+5.1%"
              icon="Calendar"
              color="accent"
              onClick={() => handleMetricClick('appointments')}
            />
            <MetricWidget
              title="Doctor Utilization"
              value="87"
              unit="%"
              trend="up"
              trendValue="+3.2%"
              icon="Activity"
              color="warning"
              alert="Peak capacity reached"
              onClick={() => handleMetricClick('doctors')}
            />
          </div>

          {/* Main Dashboard Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Queue Summary */}
            <QueueSummaryWidget
              data={queueData}
              onViewDetails={() => handleMetricClick('queue')}
            />

            {/* Appointment Overview */}
            <AppointmentOverviewWidget
              appointments={appointmentData}
              onViewSchedule={() => handleMetricClick('appointments')}
            />

            {/* Alerts Panel */}
            <AlertsPanel
              alerts={alertsData}
              onDismissAlert={handleDismissAlert}
              onViewAllAlerts={handleViewAllAlerts}
            />
          </div>

          {/* Performance Charts and Heatmap */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Patient Volume Chart */}
            <PerformanceChart
              title="Patient Volume Trend"
              data={performanceChartData}
              type="bar"
              dataKey="patients"
              color="#2563EB"
              unit=" patients"
              onViewDetails={() => handleMetricClick('queue')}
            />

            {/* Wait Time Chart */}
            <PerformanceChart
              title="Average Wait Time"
              data={performanceChartData}
              type="line"
              dataKey="waitTime"
              color="#059669"
              unit=" min"
              onViewDetails={() => handleMetricClick('queue')}
            />
          </div>

          {/* Doctor Availability and System Status */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Doctor Availability Heatmap - spans 2 columns */}
            <div className="xl:col-span-2">
              <DoctorAvailabilityHeatmap
                doctors={doctorAvailabilityData}
                onViewDetails={() => handleMetricClick('doctors')}
              />
            </div>

            {/* System Status Panel */}
            <SystemStatusPanel
              systems={systemStatusData}
              onViewDetails={() => console.log('View system details')}
            />
          </div>

          {/* Additional Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <MetricWidget
              title="Patient Satisfaction"
              value="4.2"
              unit="/5"
              trend="up"
              trendValue="+0.1"
              icon="Star"
              color="success"
              size="small"
              onClick={() => handleMetricClick('satisfaction')}
            />
            <MetricWidget
              title="No-Show Rate"
              value="8.5"
              unit="%"
              trend="down"
              trendValue="-2.1%"
              icon="UserX"
              color="error"
              size="small"
              onClick={() => handleMetricClick('noshow')}
            />
            <MetricWidget
              title="Revenue Today"
              value="$12.4K"
              trend="up"
              trendValue="+15.3%"
              icon="DollarSign"
              color="accent"
              size="small"
              onClick={() => handleMetricClick('revenue')}
            />
            <MetricWidget
              title="Emergency Cases"
              value="2"
              trend="up"
              trendValue="+1"
              icon="AlertTriangle"
              color="error"
              size="small"
              onClick={() => handleMetricClick('emergency')}
            />
            <MetricWidget
              title="Staff On Duty"
              value="24"
              trend="stable"
              trendValue="+0"
              icon="Users"
              color="primary"
              size="small"
              onClick={() => handleMetricClick('staff')}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DailyOperationsDashboard;