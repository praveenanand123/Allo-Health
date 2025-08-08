import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import PatientSearchBar from './components/PatientSearchBar';
import CheckInForm from './components/CheckInForm';
import ProgressTimeline from './components/ProgressTimeline';
import ActionPanel from './components/ActionPanel';
import PatientHistoryModal from './components/PatientHistoryModal';
import Icon from '../../components/AppIcon';


const PatientCheckInAndProgressTracking = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [checkedInPatients, setCheckedInPatients] = useState([]);
  const [selectedTimelinePatient, setSelectedTimelinePatient] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyPatient, setHistoryPatient] = useState(null);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  // Mock recent patients data
  const recentPatients = [
    {
      id: 'P006',
      name: 'John Smith',
      phone: '(555) 678-9012',
      dob: '1975-04-12',
      lastVisit: '2025-01-01',
      insurance: 'Blue Cross'
    },
    {
      id: 'P007',
      name: 'Maria Garcia',
      phone: '(555) 789-0123',
      dob: '1990-08-25',
      lastVisit: '2024-12-28',
      insurance: 'Aetna'
    }
  ];

  // Initialize with some mock checked-in patients
  useEffect(() => {
    const mockCheckedInPatients = [
      {
        patientId: 'P001',
        patientName: 'Sarah Johnson',
        checkInTime: new Date(Date.now() - 1800000)?.toISOString(), // 30 minutes ago
        status: 'waiting',
        visitReason: 'routine-checkup',
        specialNeeds: 'Wheelchair access',
        insuranceVerified: true,
        staffInitials: 'FD',
        lastUpdate: new Date(Date.now() - 900000)?.toISOString() // 15 minutes ago
      },
      {
        patientId: 'P002',
        patientName: 'Michael Chen',
        checkInTime: new Date(Date.now() - 2700000)?.toISOString(), // 45 minutes ago
        status: 'with-doctor',
        visitReason: 'follow-up',
        specialNeeds: '',
        insuranceVerified: true,
        staffInitials: 'FD',
        lastUpdate: new Date(Date.now() - 600000)?.toISOString() // 10 minutes ago
      }
    ];
    setCheckedInPatients(mockCheckedInPatients);
  }, []);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      // F1-F5 for quick status updates
      if (event?.key >= 'F1' && event?.key <= 'F5' && selectedTimelinePatient) {
        event?.preventDefault();
        const statusMap = {
          'F1': 'arrived',
          'F2': 'checked-in',
          'F3': 'waiting',
          'F4': 'with-doctor',
          'F5': 'completed'
        };
        const newStatus = statusMap?.[event?.key];
        if (newStatus) {
          handleStatusUpdate({
            patientId: selectedTimelinePatient?.patientId,
            newStatus,
            timestamp: new Date()?.toISOString(),
            staffInitials: 'FD'
          });
        }
      }

      // Escape to cancel/clear
      if (event?.key === 'Escape') {
        setSelectedPatient(null);
        setSelectedTimelinePatient(null);
      }

      // Ctrl+Enter for quick submit
      if (event?.ctrlKey && event?.key === 'Enter' && selectedPatient) {
        // Trigger form submission if form is valid
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTimelinePatient, selectedPatient]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handleCheckIn = (checkInData) => {
    const newPatient = {
      ...checkInData,
      lastUpdate: checkInData?.checkInTime
    };
    
    setCheckedInPatients(prev => [...prev, newPatient]);
    setSelectedPatient(null);
    
    // Show success notification (in a real app, you'd use a toast library)
    console.log('Patient checked in successfully:', newPatient);
  };

  const handleStatusUpdate = (updateData) => {
    setCheckedInPatients(prev =>
      prev?.map(patient =>
        patient?.patientId === updateData?.patientId
          ? {
              ...patient,
              status: updateData?.newStatus,
              lastUpdate: updateData?.timestamp,
              staffInitials: updateData?.staffInitials
            }
          : patient
      )
    );

    // If status is completed, remove from active list after a delay
    if (updateData?.newStatus === 'completed') {
      setTimeout(() => {
        setCheckedInPatients(prev =>
          prev?.filter(patient => patient?.patientId !== updateData?.patientId)
        );
      }, 5000);
    }
  };

  const handleTimelinePatientSelect = (patient) => {
    setSelectedTimelinePatient(patient);
  };

  const handleBulkCheckIn = (familyMembers) => {
    const bulkPatients = familyMembers?.map((member, index) => ({
      patientId: `P${Date.now()}_${index}`,
      patientName: member?.name,
      checkInTime: new Date()?.toISOString(),
      status: 'checked-in',
      visitReason: member?.visitReason || 'routine-checkup',
      specialNeeds: '',
      insuranceVerified: false,
      staffInitials: 'FD',
      lastUpdate: new Date()?.toISOString()
    }));

    setCheckedInPatients(prev => [...prev, ...bulkPatients]);
    console.log('Bulk check-in completed:', bulkPatients);
  };

  const handleExportData = (exportType) => {
    // In a real app, this would generate and download the report
    const exportData = {
      type: exportType,
      timestamp: new Date()?.toISOString(),
      patients: checkedInPatients,
      summary: {
        totalPatients: checkedInPatients?.length,
        averageWaitTime: '25 minutes',
        throughput: '12 patients/hour'
      }
    };
    
    console.log('Exporting data:', exportData);
    // Simulate download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportType}-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmergencyAlert = () => {
    setEmergencyActive(!emergencyActive);
    console.log('Emergency alert toggled:', !emergencyActive);
  };

  const handleCancelCheckIn = () => {
    setSelectedPatient(null);
  };

  const handlePatientHistory = (patient) => {
    setHistoryPatient(patient);
    setShowHistoryModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        emergencyActive={emergencyActive}
        connectionStatus={connectionStatus}
      />
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        emergencyActive={emergencyActive}
        connectionStatus={connectionStatus}
      />
      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-240'
      } ${emergencyActive ? 'pt-28' : 'pt-16'}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Patient Check-in & Progress Tracking
            </h1>
            <p className="text-muted-foreground">
              Streamlined workflow interface managing patient journey from arrival through discharge
            </p>
          </div>

          {/* Patient Search Bar */}
          <PatientSearchBar
            onPatientSelect={handlePatientSelect}
            recentPatients={recentPatients}
          />

          {/* Main Workflow Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Check-in Form - Left 30% */}
            <div className="lg:col-span-4">
              <CheckInForm
                selectedPatient={selectedPatient}
                onCheckIn={handleCheckIn}
                onCancel={handleCancelCheckIn}
              />
            </div>

            {/* Progress Timeline - Center 40% */}
            <div className="lg:col-span-5">
              <ProgressTimeline
                checkedInPatients={checkedInPatients}
                onStatusUpdate={handleStatusUpdate}
                onPatientSelect={handleTimelinePatientSelect}
              />
            </div>

            {/* Action Panel - Right 30% */}
            <div className="lg:col-span-3">
              <ActionPanel
                selectedPatient={selectedTimelinePatient}
                onBulkCheckIn={handleBulkCheckIn}
                onExportData={handleExportData}
                onEmergencyAlert={handleEmergencyAlert}
                systemStatus={{
                  emr: connectionStatus,
                  insurance: connectionStatus
                }}
              />
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Patients Today</p>
                  <p className="text-2xl font-bold text-foreground">
                    {checkedInPatients?.length + 15}
                  </p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Users" size={16} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                  <p className="text-2xl font-bold text-foreground">25m</p>
                </div>
                <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                  <Icon name="Clock" size={16} className="text-warning" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-foreground">
                    {checkedInPatients?.length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <Icon name="Activity" size={16} className="text-accent" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">8</p>
                </div>
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Patient History Modal */}
      <PatientHistoryModal
        patient={historyPatient}
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setHistoryPatient(null);
        }}
      />
    </div>
  );
};

export default PatientCheckInAndProgressTracking;