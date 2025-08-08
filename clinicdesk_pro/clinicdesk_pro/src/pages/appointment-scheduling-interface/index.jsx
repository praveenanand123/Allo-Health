import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import DoctorFilterSidebar from './components/DoctorFilterSidebar';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import AppointmentDetailsPanel from './components/AppointmentDetailsPanel';
import BulkOperationsModal from './components/BulkOperationsModal';

const AppointmentSchedulingInterface = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showBulkModal, setBulkModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  
  // Doctor filters
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [doctorFilters, setDoctorFilters] = useState({
    availability: ['available', 'busy'],
    specialization: [],
    location: []
  });

  // Mock data
  const doctors = [
    {
      id: "doc1",
      name: "Sarah Johnson",
      specialization: "Cardiology",
      location: "Building A - Floor 2",
      availability: "available",
      email: "sarah.johnson@clinic.com",
      phone: "(555) 123-4567"
    },
    {
      id: "doc2", 
      name: "Michael Chen",
      specialization: "Dermatology",
      location: "Building B - Floor 1",
      availability: "busy",
      email: "michael.chen@clinic.com",
      phone: "(555) 234-5678"
    },
    {
      id: "doc3",
      name: "Emily Rodriguez",
      specialization: "Pediatrics", 
      location: "Building A - Floor 3",
      availability: "available",
      email: "emily.rodriguez@clinic.com",
      phone: "(555) 345-6789"
    },
    {
      id: "doc4",
      name: "David Thompson",
      specialization: "Orthopedics",
      location: "Building C - Floor 1", 
      availability: "unavailable",
      email: "david.thompson@clinic.com",
      phone: "(555) 456-7890"
    },
    {
      id: "doc5",
      name: "Lisa Wang",
      specialization: "Neurology",
      location: "Building B - Floor 2",
      availability: "available",
      email: "lisa.wang@clinic.com",
      phone: "(555) 567-8901"
    },
    {
      id: "doc6",
      name: "Robert Martinez",
      specialization: "Cardiology", 
      location: "Building A - Floor 2",
      availability: "busy",
      email: "robert.martinez@clinic.com",
      phone: "(555) 678-9012"
    },
    {
      id: "doc7",
      name: "Jennifer Lee",
      specialization: "Internal Medicine",
      location: "Building A - Floor 1",
      availability: "available",
      email: "jennifer.lee@clinic.com",
      phone: "(555) 789-0123"
    },
    {
      id: "doc8",
      name: "Thomas Brown",
      specialization: "Psychiatry",
      location: "Building C - Floor 2",
      availability: "available",
      email: "thomas.brown@clinic.com",
      phone: "(555) 890-1234"
    }
  ];

  const [appointments, setAppointments] = useState([
    {
      id: "apt1",
      patientName: "John Smith",
      patientPhone: "(555) 111-2222",
      patientEmail: "john.smith@email.com",
      doctorId: "doc1",
      date: "2025-01-08",
      time: "09:00",
      type: "consultation",
      status: "confirmed",
      duration: 30,
      notes: "Follow-up for cardiac evaluation",
      insuranceProvider: "blue-cross",
      reminderSent: true
    },
    {
      id: "apt2", 
      patientName: "Maria Garcia",
      patientPhone: "(555) 222-3333",
      patientEmail: "maria.garcia@email.com",
      doctorId: "doc2",
      date: "2025-01-08",
      time: "10:30",
      type: "routine-checkup",
      status: "booked",
      duration: 15,
      notes: "Annual skin examination",
      insuranceProvider: "aetna",
      reminderSent: false
    },
    {
      id: "apt3",
      patientName: "Robert Johnson",
      patientPhone: "(555) 333-4444", 
      patientEmail: "robert.johnson@email.com",
      doctorId: "doc3",
      date: "2025-01-08",
      time: "14:00",
      type: "emergency",
      status: "confirmed",
      duration: 45,
      notes: "Child with high fever and rash",
      insuranceProvider: "medicare",
      reminderSent: true
    },
    {
      id: "apt4",
      patientName: "Lisa Chen",
      patientPhone: "(555) 444-5555",
      patientEmail: "lisa.chen@email.com", 
      doctorId: "doc1",
      date: "2025-01-09",
      time: "11:00",
      type: "follow-up",
      status: "booked",
      duration: 30,
      notes: "Post-surgery follow-up appointment",
      insuranceProvider: "cigna",
      reminderSent: false
    },
    {
      id: "apt5",
      patientName: "Michael Davis",
      patientPhone: "(555) 555-6666",
      patientEmail: "michael.davis@email.com",
      doctorId: "doc5",
      date: "2025-01-09",
      time: "15:30",
      type: "consultation",
      status: "completed",
      duration: 60,
      notes: "Neurological assessment completed",
      insuranceProvider: "united",
      reminderSent: true
    },
    {
      id: "apt6",
      patientName: "Sarah Wilson",
      patientPhone: "(555) 666-7777",
      patientEmail: "sarah.wilson@email.com",
      doctorId: "doc7",
      date: "2025-01-10",
      time: "09:30",
      type: "routine-checkup",
      status: "cancelled",
      duration: 30,
      notes: "Patient requested cancellation",
      insuranceProvider: "medicaid",
      reminderSent: false
    },
    {
      id: "apt7",
      patientName: "James Anderson",
      patientPhone: "(555) 777-8888",
      patientEmail: "james.anderson@email.com",
      doctorId: "doc8",
      date: "2025-01-10",
      time: "13:00",
      type: "consultation",
      status: "no-show",
      duration: 45,
      notes: "Patient did not show up for appointment",
      insuranceProvider: "other",
      reminderSent: true
    },
    {
      id: "apt8",
      patientName: "Emma Thompson",
      patientPhone: "(555) 888-9999",
      patientEmail: "emma.thompson@email.com",
      doctorId: "doc2",
      date: "2025-01-11",
      time: "10:00",
      type: "procedure",
      status: "confirmed",
      duration: 90,
      notes: "Mole removal procedure scheduled",
      insuranceProvider: "blue-cross",
      reminderSent: true
    }
  ]);

  // Initialize selected doctors
  useEffect(() => {
    const availableDoctors = doctors?.filter(doc => doctorFilters?.availability?.includes(doc?.availability))?.slice(0, 4)?.map(doc => doc?.id);
    setSelectedDoctors(availableDoctors);
  }, []);

  // Filter appointments based on search term
  const filteredAppointments = appointments?.filter(apt => {
    if (!searchTerm) return true;
    const doctor = doctors?.find(d => d?.id === apt?.doctorId);
    return (apt?.patientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    apt?.type?.toLowerCase()?.includes(searchTerm?.toLowerCase()) || doctor?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
  });

  const handleDoctorToggle = (doctorIds) => {
    if (Array.isArray(doctorIds)) {
      setSelectedDoctors(doctorIds);
    } else {
      setSelectedDoctors(prev => 
        prev?.includes(doctorIds)
          ? prev?.filter(id => id !== doctorIds)
          : [...prev, doctorIds]
      );
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsPanel(true);
    setIsCreatingAppointment(false);
  };

  const handleTimeSlotClick = (doctorId, date, time) => {
    const newAppointment = {
      doctorId,
      date,
      time,
      duration: 30,
      type: 'consultation',
      status: 'booked'
    };
    setSelectedAppointment(newAppointment);
    setShowDetailsPanel(true);
    setIsCreatingAppointment(true);
  };

  const handleAppointmentSave = async (appointmentData) => {
    if (isCreatingAppointment) {
      setAppointments(prev => [...prev, appointmentData]);
    } else {
      setAppointments(prev => 
        prev?.map(apt => apt?.id === appointmentData?.id ? appointmentData : apt)
      );
    }
    setShowDetailsPanel(false);
    setSelectedAppointment(null);
    setIsCreatingAppointment(false);
  };

  const handleAppointmentCancel = async (appointmentId) => {
    setAppointments(prev => 
      prev?.map(apt => 
        apt?.id === appointmentId 
          ? { ...apt, status: 'cancelled', notes: apt?.notes + '\nCancelled by staff' }
          : apt
      )
    );
    setShowDetailsPanel(false);
    setSelectedAppointment(null);
  };

  const handleAppointmentDrop = (appointmentId, newDoctorId, newDate, newTime) => {
    setAppointments(prev => 
      prev?.map(apt => 
        apt?.id === appointmentId 
          ? { ...apt, doctorId: newDoctorId, date: newDate, time: newTime }
          : apt
      )
    );
  };

  const handleBulkOperations = (operation = 'open') => {
    if (operation === 'create') {
      setSelectedAppointment({
        doctorId: selectedDoctors?.[0] || doctors?.[0]?.id,
        date: currentDate?.toISOString()?.split('T')?.[0],
        time: '09:00',
        duration: 30,
        type: 'consultation',
        status: 'booked'
      });
      setShowDetailsPanel(true);
      setIsCreatingAppointment(true);
    } else {
      setBulkModal(true);
    }
  };

  const handleBulkUpdate = async (operation, appointmentIds, data) => {
    switch (operation) {
      case 'reschedule':
        setAppointments(prev => 
          prev?.map(apt => 
            appointmentIds?.includes(apt?.id)
              ? { ...apt, date: data?.date, time: data?.time, ...(data?.doctorId && { doctorId: data?.doctorId }) }
              : apt
          )
        );
        break;
      case 'cancel':
        setAppointments(prev => 
          prev?.map(apt => 
            appointmentIds?.includes(apt?.id)
              ? { ...apt, status: 'cancelled', notes: apt?.notes + `\nCancelled: ${data?.notes}` }
              : apt
          )
        );
        break;
      case 'status-update':
        setAppointments(prev => 
          prev?.map(apt => 
            appointmentIds?.includes(apt?.id)
              ? { ...apt, status: data?.status }
              : apt
          )
        );
        break;
      case 'doctor-change':
        setAppointments(prev => 
          prev?.map(apt => 
            appointmentIds?.includes(apt?.id)
              ? { ...apt, doctorId: data?.doctorId }
              : apt
          )
        );
        break;
      case 'send-reminders':
        setAppointments(prev => 
          prev?.map(apt => 
            appointmentIds?.includes(apt?.id)
              ? { ...apt, reminderSent: true }
              : apt
          )
        );
        break;
      case 'export':
        // Mock export functionality
        const exportData = appointments?.filter(apt => appointmentIds?.includes(apt?.id));
        console.log('Exporting appointments:', exportData);
        break;
    }
  };

  const handleExport = () => {
    const csvData = filteredAppointments?.map(apt => {
      const doctor = doctors?.find(d => d?.id === apt?.doctorId);
      return {
        'Patient Name': apt?.patientName,
        'Doctor': doctor?.name,
        'Date': apt?.date,
        'Time': apt?.time,
        'Type': apt?.type,
        'Status': apt?.status,
        'Duration': `${apt?.duration} minutes`,
        'Insurance': apt?.insuranceProvider
      };
    });
    console.log('Exporting CSV data:', csvData);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        emergencyActive={appointments?.some(apt => apt?.type === 'emergency' && apt?.status !== 'completed')}
        connectionStatus="connected"
      />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        emergencyActive={appointments?.some(apt => apt?.type === 'emergency' && apt?.status !== 'completed')}
        connectionStatus="connected"
      />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-240'} mt-16`}>
        <div className="h-screen flex">
          {/* Doctor Filter Sidebar */}
          <div className="w-80 flex-shrink-0">
            <DoctorFilterSidebar
              doctors={doctors}
              selectedDoctors={selectedDoctors}
              onDoctorToggle={handleDoctorToggle}
              filters={doctorFilters}
              onFilterChange={setDoctorFilters}
            />
          </div>

          {/* Main Calendar Area */}
          <div className="flex-1 flex flex-col">
            <CalendarHeader
              currentDate={currentDate}
              viewMode={viewMode}
              onDateChange={setCurrentDate}
              onViewModeChange={setViewMode}
              onTodayClick={handleTodayClick}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              totalAppointments={filteredAppointments?.length}
              onBulkOperations={handleBulkOperations}
              onExport={handleExport}
            />

            <div className="flex-1">
              <CalendarGrid
                appointments={filteredAppointments}
                doctors={doctors}
                selectedDoctors={selectedDoctors}
                currentDate={currentDate}
                viewMode={viewMode}
                onAppointmentClick={handleAppointmentClick}
                onTimeSlotClick={handleTimeSlotClick}
                onAppointmentDrop={handleAppointmentDrop}
                selectedAppointment={selectedAppointment}
              />
            </div>
          </div>

          {/* Appointment Details Panel */}
          {showDetailsPanel && (
            <div className="w-96 flex-shrink-0">
              <AppointmentDetailsPanel
                appointment={selectedAppointment}
                doctors={doctors}
                onSave={handleAppointmentSave}
                onCancel={handleAppointmentCancel}
                onClose={() => {
                  setShowDetailsPanel(false);
                  setSelectedAppointment(null);
                  setIsCreatingAppointment(false);
                }}
                isCreating={isCreatingAppointment}
              />
            </div>
          )}
        </div>
      </main>
      {/* Bulk Operations Modal */}
      <BulkOperationsModal
        isOpen={showBulkModal}
        onClose={() => setBulkModal(false)}
        appointments={filteredAppointments}
        doctors={doctors}
        onBulkUpdate={handleBulkUpdate}
      />
    </div>
  );
};

export default AppointmentSchedulingInterface;