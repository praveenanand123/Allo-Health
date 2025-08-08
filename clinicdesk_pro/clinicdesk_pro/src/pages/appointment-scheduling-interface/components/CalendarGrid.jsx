import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarGrid = ({ 
  appointments, 
  doctors, 
  selectedDoctors, 
  currentDate, 
  viewMode, 
  onAppointmentClick, 
  onTimeSlotClick,
  onAppointmentDrop,
  selectedAppointment 
}) => {
  const [draggedAppointment, setDraggedAppointment] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const gridRef = useRef(null);

  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      timeSlots?.push(`${hour?.toString()?.padStart(2, '0')}:${minute?.toString()?.padStart(2, '0')}`);
    }
  }

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek?.setDate(date?.getDate() - date?.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day?.setDate(startOfWeek?.getDate() + i);
      week?.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);
  const filteredDoctors = doctors?.filter(doc => selectedDoctors?.includes(doc?.id));

  const getAppointmentsForSlot = (doctorId, date, time) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return appointments?.filter(apt => 
      apt?.doctorId === doctorId && 
      apt?.date === dateStr && 
      apt?.time === time
    );
  };

  const getAppointmentColor = (status, type) => {
    const colors = {
      booked: 'bg-primary/20 border-primary text-primary',
      confirmed: 'bg-success/20 border-success text-success',
      completed: 'bg-muted border-muted-foreground text-muted-foreground',
      cancelled: 'bg-error/20 border-error text-error',
      'no-show': 'bg-warning/20 border-warning text-warning'
    };
    
    if (type === 'emergency') {
      return 'bg-error/30 border-error text-error font-semibold';
    }
    
    return colors?.[status] || colors?.booked;
  };

  const handleDragStart = (e, appointment) => {
    setDraggedAppointment(appointment);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, doctorId, date, time) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot({ doctorId, date: date?.toISOString()?.split('T')?.[0], time });
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e, doctorId, date, time) => {
    e?.preventDefault();
    if (draggedAppointment) {
      const newDate = date?.toISOString()?.split('T')?.[0];
      onAppointmentDrop(draggedAppointment?.id, doctorId, newDate, time);
    }
    setDraggedAppointment(null);
    setDragOverSlot(null);
  };

  const formatTime = (time) => {
    const [hour, minute] = time?.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const isPastTime = (date, time) => {
    const now = new Date();
    const slotDateTime = new Date(date);
    const [hour, minute] = time?.split(':');
    slotDateTime?.setHours(parseInt(hour), parseInt(minute));
    return slotDateTime < now;
  };

  if (viewMode === 'day') {
    const selectedDoctor = filteredDoctors?.[0];
    if (!selectedDoctor) return <div className="flex items-center justify-center h-full text-muted-foreground">Select a doctor to view schedule</div>;

    return (
      <div className="h-full bg-background">
        {/* Day View Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {currentDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <p className="text-sm text-muted-foreground">Dr. {selectedDoctor?.name} - {selectedDoctor?.specialization}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${selectedDoctor?.availability === 'available' ? 'bg-success' : selectedDoctor?.availability === 'busy' ? 'bg-warning' : 'bg-error'}`} />
              <span className="text-sm text-muted-foreground capitalize">{selectedDoctor?.availability}</span>
            </div>
          </div>
        </div>
        {/* Day View Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 gap-1">
            {timeSlots?.map(time => {
              const slotAppointments = getAppointmentsForSlot(selectedDoctor?.id, currentDate, time);
              const isPast = isPastTime(currentDate, time);
              const isDragOver = dragOverSlot?.doctorId === selectedDoctor?.id && 
                               dragOverSlot?.date === currentDate?.toISOString()?.split('T')?.[0] && 
                               dragOverSlot?.time === time;

              return (
                <div
                  key={time}
                  className={`min-h-16 border border-border rounded-md p-2 transition-colors ${
                    isPast ? 'bg-muted/30' : 'bg-card hover:bg-muted/50'
                  } ${isDragOver ? 'bg-primary/10 border-primary' : ''}`}
                  onClick={() => !isPast && onTimeSlotClick(selectedDoctor?.id, currentDate?.toISOString()?.split('T')?.[0], time)}
                  onDragOver={(e) => handleDragOver(e, selectedDoctor?.id, currentDate, time)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, selectedDoctor?.id, currentDate, time)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isPast ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {formatTime(time)}
                    </span>
                    {slotAppointments?.length === 0 && !isPast && (
                      <Button variant="ghost" size="xs" onClick={(e) => {
                        e?.stopPropagation();
                        onTimeSlotClick(selectedDoctor?.id, currentDate?.toISOString()?.split('T')?.[0], time);
                      }}>
                        <Icon name="Plus" size={12} />
                      </Button>
                    )}
                  </div>
                  {slotAppointments?.map(appointment => (
                    <div
                      key={appointment?.id}
                      draggable={!isPast}
                      onDragStart={(e) => handleDragStart(e, appointment)}
                      className={`p-2 rounded border-l-4 cursor-pointer mb-1 ${getAppointmentColor(appointment?.status, appointment?.type)} ${
                        selectedAppointment?.id === appointment?.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={(e) => {
                        e?.stopPropagation();
                        onAppointmentClick(appointment);
                      }}
                    >
                      <p className="text-sm font-medium truncate">{appointment?.patientName}</p>
                      <p className="text-xs opacity-80">{appointment?.type}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs capitalize">{appointment?.status}</span>
                        {appointment?.type === 'emergency' && (
                          <Icon name="AlertTriangle" size={12} className="text-error" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background" ref={gridRef}>
      {/* Week View Header */}
      <div className="sticky top-0 bg-card border-b border-border z-10">
        <div className="grid grid-cols-8 gap-0">
          <div className="p-4 border-r border-border">
            <span className="text-sm font-medium text-muted-foreground">Time</span>
          </div>
          {weekDates?.map(date => (
            <div key={date?.toISOString()} className={`p-4 border-r border-border text-center ${isToday(date) ? 'bg-primary/5' : ''}`}>
              <div className="text-sm font-medium text-foreground">
                {date?.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-semibold ${isToday(date) ? 'text-primary' : 'text-foreground'}`}>
                {date?.getDate()}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Week View Grid */}
      <div className="overflow-auto">
        {timeSlots?.map(time => (
          <div key={time} className="grid grid-cols-8 gap-0 border-b border-border min-h-20">
            <div className="p-2 border-r border-border bg-muted/30 flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">{formatTime(time)}</span>
            </div>
            {weekDates?.map(date => (
              <div key={`${date?.toISOString()}-${time}`} className="border-r border-border relative">
                {filteredDoctors?.map((doctor, index) => {
                  const slotAppointments = getAppointmentsForSlot(doctor?.id, date, time);
                  const isPast = isPastTime(date, time);
                  const isDragOver = dragOverSlot?.doctorId === doctor?.id && 
                                   dragOverSlot?.date === date?.toISOString()?.split('T')?.[0] && 
                                   dragOverSlot?.time === time;

                  return (
                    <div
                      key={doctor?.id}
                      className={`h-20 p-1 cursor-pointer transition-colors ${
                        index > 0 ? 'border-t border-dashed border-border' : ''
                      } ${isPast ? 'bg-muted/20' : 'hover:bg-muted/30'} ${
                        isDragOver ? 'bg-primary/10' : ''
                      } ${isToday(date) ? 'bg-primary/5' : ''}`}
                      onClick={() => !isPast && onTimeSlotClick(doctor?.id, date?.toISOString()?.split('T')?.[0], time)}
                      onDragOver={(e) => handleDragOver(e, doctor?.id, date, time)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, doctor?.id, date, time)}
                    >
                      {slotAppointments?.map(appointment => (
                        <div
                          key={appointment?.id}
                          draggable={!isPast}
                          onDragStart={(e) => handleDragStart(e, appointment)}
                          className={`p-1 rounded text-xs border-l-2 cursor-pointer mb-1 ${getAppointmentColor(appointment?.status, appointment?.type)} ${
                            selectedAppointment?.id === appointment?.id ? 'ring-1 ring-primary' : ''
                          }`}
                          onClick={(e) => {
                            e?.stopPropagation();
                            onAppointmentClick(appointment);
                          }}
                        >
                          <p className="font-medium truncate">{appointment?.patientName}</p>
                          <p className="opacity-80 truncate">{appointment?.type}</p>
                        </div>
                      ))}
                      {slotAppointments?.length === 0 && !isPast && (
                        <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Icon name="Plus" size={12} className="text-muted-foreground" />
                        </div>
                      )}
                      {filteredDoctors?.length > 1 && (
                        <div className="absolute bottom-0 right-0 text-xs text-muted-foreground bg-card px-1 rounded">
                          {doctor?.name?.split(' ')?.[1] || doctor?.name?.split(' ')?.[0]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;