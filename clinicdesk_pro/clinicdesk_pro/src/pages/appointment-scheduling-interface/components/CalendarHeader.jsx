import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CalendarHeader = ({ 
  currentDate, 
  viewMode, 
  onDateChange, 
  onViewModeChange, 
  onTodayClick,
  searchTerm,
  onSearchChange,
  totalAppointments,
  onBulkOperations,
  onExport
}) => {
  const formatDateRange = () => {
    if (viewMode === 'day') {
      return currentDate?.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek?.setDate(currentDate?.getDate() - currentDate?.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek?.setDate(startOfWeek?.getDate() + 6);
      
      return `${startOfWeek?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate?.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'day') {
      newDate?.setDate(currentDate?.getDate() + direction);
    } else if (viewMode === 'week') {
      newDate?.setDate(currentDate?.getDate() + (direction * 7));
    } else {
      newDate?.setMonth(currentDate?.getMonth() + direction);
    }
    
    onDateChange(newDate);
  };

  const getCurrentTime = () => {
    return new Date()?.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-card border-b border-border p-4">
      {/* Top Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Left Section - Date Navigation */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate(-1)}
              className="w-8 h-8"
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            
            <div className="text-center min-w-64">
              <h1 className="text-xl font-semibold text-foreground">
                {formatDateRange()}
              </h1>
              <p className="text-sm text-muted-foreground">
                {totalAppointments} appointments scheduled
              </p>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate(1)}
              className="w-8 h-8"
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onTodayClick}
          >
            Today
          </Button>
        </div>

        {/* Right Section - Current Time & Status */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              {getCurrentTime()}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date()?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-xs text-muted-foreground">Live Updates</span>
          </div>
        </div>
      </div>
      {/* Bottom Row */}
      <div className="flex items-center justify-between">
        {/* Left Section - View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-muted rounded-md p-1">
            {['day', 'week', 'month']?.map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange(mode)}
                className="capitalize"
              >
                <Icon 
                  name={mode === 'day' ? 'Calendar' : mode === 'week' ? 'CalendarDays' : 'CalendarRange'} 
                  size={16} 
                  className="mr-2" 
                />
                {mode}
              </Button>
            ))}
          </div>

          <div className="h-6 w-px bg-border mx-2" />

          <Button
            variant="outline"
            size="sm"
            onClick={onBulkOperations}
          >
            <Icon name="Settings" size={16} className="mr-2" />
            Bulk Actions
          </Button>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <Input
            type="search"
            placeholder="Search appointments, patients, or doctors..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
          >
            <Icon name="Download" size={16} className="mr-2" />
            Export
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => onBulkOperations('create')}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            New Appointment
          </Button>
        </div>
      </div>
      {/* Quick Stats Bar */}
      <div className="flex items-center justify-center space-x-8 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-semibold text-success">24</div>
          <div className="text-xs text-muted-foreground">Confirmed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-warning">8</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-primary">12</div>
          <div className="text-xs text-muted-foreground">Today</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-error">2</div>
          <div className="text-xs text-muted-foreground">Emergency</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-muted-foreground">3</div>
          <div className="text-xs text-muted-foreground">Cancelled</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;