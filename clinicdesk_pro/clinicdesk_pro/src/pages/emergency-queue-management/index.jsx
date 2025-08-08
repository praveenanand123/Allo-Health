import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import EmergencyBanner from './components/EmergencyBanner';
import EmergencyIntakeForm from './components/EmergencyIntakeForm';
import EmergencyQueue from './components/EmergencyQueue';
import DoctorAvailabilityPanel from './components/DoctorAvailabilityPanel';
import EmergencyActions from './components/EmergencyActions';

const EmergencyQueueManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [emergencyPatients, setEmergencyPatients] = useState([]);
  const [showIntakeForm, setShowIntakeForm] = useState(false);

  // Mock data for emergency patients
  const mockEmergencyPatients = [
    {
      queueNumber: "E1234",
      patientName: "Sarah Johnson",
      emergencyContact: "Mike Johnson",
      contactPhone: "(555) 123-4567",
      chiefComplaint: "Severe chest pain with shortness of breath",
      severity: "critical",
      triageNotes: "Patient reports crushing chest pain 8/10, diaphoretic, BP 180/110, HR 120",
      allergies: "Penicillin",
      currentMedications: "Lisinopril, Metformin",
      status: "emergency-waiting",
      timestamp: new Date(Date.now() - 300000)?.toISOString() // 5 minutes ago
    },
    {
      queueNumber: "E1235",
      patientName: "Robert Chen",
      emergencyContact: "Linda Chen",
      contactPhone: "(555) 987-6543",
      chiefComplaint: "Severe abdominal pain after motor vehicle accident",
      severity: "urgent",
      triageNotes: "MVA patient, complains of severe RUQ pain, possible internal bleeding",
      allergies: "None known",
      currentMedications: "None",
      status: "with-doctor",
      timestamp: new Date(Date.now() - 900000)?.toISOString() // 15 minutes ago
    }
  ];

  // Mock data for doctors
  const mockDoctors = [
    {
      id: "doc1",
      name: "Dr. Emily Rodriguez",
      specialization: "Emergency Medicine",
      location: "Emergency Department",
      room: "ER-1",
      availability: "emergency-ready",
      currentPatient: null,
      emergencyResponse: {
        estimatedTime: "Immediate",
        priority: "High",
        specialties: ["Trauma", "Cardiac", "Critical Care"]
      },
      lastUpdate: new Date()?.toISOString()
    },
    {
      id: "doc2",
      name: "Dr. Michael Thompson",
      specialization: "Internal Medicine",
      location: "Emergency Department",
      room: "ER-2",
      availability: "busy",
      currentPatient: "Robert Chen",
      estimatedCompletion: "10 min",
      emergencyResponse: {
        estimatedTime: "10 minutes",
        priority: "Medium",
        specialties: ["Internal Medicine", "General"]
      },
      lastUpdate: new Date()?.toISOString()
    },
    {
      id: "doc3",
      name: "Dr. Sarah Kim",
      specialization: "Cardiology",
      location: "Cardiology Wing",
      room: "C-105",
      availability: "available",
      currentPatient: null,
      emergencyResponse: {
        estimatedTime: "5 minutes",
        priority: "High",
        specialties: ["Cardiac", "Chest Pain", "Arrhythmia"]
      },
      lastUpdate: new Date()?.toISOString()
    },
    {
      id: "doc4",
      name: "Dr. James Wilson",
      specialization: "Surgery",
      location: "Surgical Department",
      room: "OR-3",
      availability: "off-duty",
      currentPatient: null,
      emergencyResponse: {
        estimatedTime: "On-call",
        priority: "Medium",
        specialties: ["Trauma Surgery", "General Surgery"]
      },
      lastUpdate: new Date()?.toISOString()
    }
  ];

  useEffect(() => {
    setEmergencyPatients(mockEmergencyPatients);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event?.key === 'F12') {
        event?.preventDefault();
        setShowIntakeForm(true);
      } else if (event?.ctrlKey && event?.key === 'e') {
        event?.preventDefault();
        setShowIntakeForm(true);
      } else if (event?.key === 'Escape') {
        setShowIntakeForm(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEmergencySubmit = async (emergencyData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setEmergencyPatients(prev => [emergencyData, ...prev]);
    setShowIntakeForm(false);
    
    // Show success notification (in real app, use toast)
    console.log('Emergency patient added successfully:', emergencyData);
  };

  const handleUpdatePatientStatus = (queueNumber, newStatus) => {
    setEmergencyPatients(prev =>
      prev?.map(patient =>
        patient?.queueNumber === queueNumber
          ? { ...patient, status: newStatus }
          : patient
      )
    );
  };

  const handleViewPatientDetails = (patient) => {
    // In real app, open patient details modal or navigate to patient page
    console.log('Viewing patient details:', patient);
  };

  const handleAssignDoctor = (doctorId) => {
    // In real app, assign doctor to next emergency patient
    console.log('Assigning doctor:', doctorId);
  };

  const handleBulkProcess = (count) => {
    console.log('Activating mass casualty mode for', count, 'patients');
  };

  const handleEscalate = (level) => {
    console.log('Escalating to:', level);
  };

  const handleNotifyStaff = (scope) => {
    console.log('Notifying staff:', scope);
  };

  const handleExportData = () => {
    console.log('Exporting emergency data');
  };

  const emergencyActive = emergencyPatients?.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        emergencyActive={emergencyActive}
        connectionStatus="connected"
      />
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        emergencyActive={emergencyActive}
        connectionStatus="connected"
      />
      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-240'
      } ${emergencyActive ? 'mt-28' : 'mt-16'}`}>
        
        {/* Emergency Banner */}
        {emergencyActive && (
          <EmergencyBanner
            activeEmergencies={emergencyPatients?.length}
            onViewAll={() => console.log('View all emergencies')}
          />
        )}

        {/* Page Header */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Emergency Queue Management</h1>
              <p className="text-muted-foreground mt-1">
                Specialized interface for urgent patient situations and emergency response
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowIntakeForm(true)}
                className="bg-error text-error-foreground px-4 py-2 rounded-md font-medium hover:bg-error/90 transition-colors flex items-center space-x-2"
              >
                <span>🚨</span>
                <span>Emergency Intake</span>
                <span className="text-xs bg-error-foreground/20 px-2 py-1 rounded">F12</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="p-6">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Left Column - Emergency Intake Form */}
            <div className="col-span-12 lg:col-span-4">
              {showIntakeForm ? (
                <EmergencyIntakeForm
                  onSubmit={handleEmergencySubmit}
                  onCancel={() => setShowIntakeForm(false)}
                />
              ) : (
                <div className="bg-card border border-dashed border-border rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚨</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Emergency Intake Ready</h3>
                  <p className="text-muted-foreground mb-4">
                    Click to start emergency patient registration
                  </p>
                  <button
                    onClick={() => setShowIntakeForm(true)}
                    className="bg-error text-error-foreground px-6 py-3 rounded-md font-medium hover:bg-error/90 transition-colors"
                  >
                    Start Emergency Intake
                  </button>
                  <div className="mt-4 text-xs text-muted-foreground">
                    Keyboard shortcut: F12 or Ctrl+E
                  </div>
                </div>
              )}
              
              {/* Emergency Actions */}
              <div className="mt-6">
                <EmergencyActions
                  onBulkProcess={handleBulkProcess}
                  onEscalate={handleEscalate}
                  onNotifyStaff={handleNotifyStaff}
                  onExportData={handleExportData}
                />
              </div>
            </div>

            {/* Center Column - Emergency Queue */}
            <div className="col-span-12 lg:col-span-5">
              <EmergencyQueue
                emergencyPatients={emergencyPatients}
                onUpdateStatus={handleUpdatePatientStatus}
                onViewDetails={handleViewPatientDetails}
              />
            </div>

            {/* Right Column - Doctor Availability */}
            <div className="col-span-12 lg:col-span-3">
              <DoctorAvailabilityPanel
                doctors={mockDoctors}
                onAssignDoctor={handleAssignDoctor}
                onUpdateAvailability={(doctorId, status) => console.log('Update availability:', doctorId, status)}
              />
            </div>
          </div>
        </div>

        {/* Emergency Status Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40">
          <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-240'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">System Status: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Emergency Patients: {emergencyPatients?.length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Available Doctors: {mockDoctors?.filter(d => d?.availability === 'available' || d?.availability === 'emergency-ready')?.length}
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Last Updated: {new Date()?.toLocaleTimeString()} | 
                Emergency Mode: {emergencyActive ? 'ACTIVE' : 'STANDBY'}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmergencyQueueManagement;