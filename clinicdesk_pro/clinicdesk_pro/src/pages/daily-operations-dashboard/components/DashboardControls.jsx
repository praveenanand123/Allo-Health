import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DashboardControls = ({ 
  onDateRangeChange, 
  onLocationChange, 
  onRefresh, 
  onExport,
  autoRefresh,
  onAutoRefreshToggle,
  lastUpdated 
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'main', label: 'Main Clinic' },
    { value: 'north', label: 'North Branch' },
    { value: 'south', label: 'South Branch' },
    { value: 'downtown', label: 'Downtown Office' }
  ];

  const handleDateRangeChange = (value) => {
    setSelectedDateRange(value);
    onDateRangeChange(value);
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    onLocationChange(value);
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffInSeconds = Math.floor((now - updated) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}h ago`;
  };

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-3">
            <Icon name="Calendar" size={20} className="text-muted-foreground" />
            <Select
              options={dateRangeOptions}
              value={selectedDateRange}
              onChange={handleDateRangeChange}
              className="w-40"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Icon name="MapPin" size={20} className="text-muted-foreground" />
            <Select
              options={locationOptions}
              value={selectedLocation}
              onChange={handleLocationChange}
              className="w-40"
            />
          </div>
        </div>

        {/* Right Section - Actions and Status */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Auto-refresh Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onAutoRefreshToggle}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-success/10 text-success hover:bg-success/20' :'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon 
                name={autoRefresh ? "Play" : "Pause"} 
                size={14} 
                className={autoRefresh ? "text-success" : "text-muted-foreground"} 
              />
              <span>Auto-refresh</span>
            </button>
            
            <div className="text-xs text-muted-foreground">
              Last updated: {formatLastUpdated()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>

            <Button
              variant="default"
              size="sm"
              iconName="Settings"
              iconPosition="left"
            >
              Customize
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">127</div>
            <div className="text-xs text-muted-foreground">Total Patients</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">94%</div>
            <div className="text-xs text-muted-foreground">On-time Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">18min</div>
            <div className="text-xs text-muted-foreground">Avg Wait</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent">8</div>
            <div className="text-xs text-muted-foreground">Doctors Active</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-warning">3</div>
            <div className="text-xs text-muted-foreground">Delays</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-error">1</div>
            <div className="text-xs text-muted-foreground">Emergency</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardControls;