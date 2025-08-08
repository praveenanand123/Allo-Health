import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import * as queueService from "../../services/queueService";
import * as patientService from "../../services/patientService";
import * as doctorService from "../../services/doctorService";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import QueueStatistics from "./components/QueueStatistics";
import QueueTable from "./components/QueueTable";
import QuickAddPatient from "./components/QuickAddPatient";
import PatientDetails from "./components/PatientDetails";
import DoctorAvailability from "./components/DoctorAvailability";
import BulkOperations from "./components/BulkOperations";

export default function PatientQueueManagementDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [queueData, setQueueData] = useState([]);
  const [queueStats, setQueueStats] = useState({
    total: 0,
    waiting: 0,
    with_doctor: 0,
    completed: 0,
    cancelled: 0
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, userProfile, user } = useAuth();

  const handleQueueUpdate = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    setQueueData(current => {
      switch (eventType) {
        case 'INSERT':
          return [newRecord, ...current];
        case 'UPDATE':
          return current?.map(item => 
            item?.id === newRecord?.id ? { ...item, ...newRecord } : item
          );
        case 'DELETE':
          return current?.filter(item => item?.id !== oldRecord?.id);
        default:
          return current;
      }
    });

    // Reload stats when queue changes
    loadQueueStats();
  };

  const handlePatientUpdate = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    setPatients(current => {
      switch (eventType) {
        case 'INSERT':
          return [newRecord, ...current];
        case 'UPDATE':
          return current?.map(item => 
            item?.id === newRecord?.id ? { ...item, ...newRecord } : item
          );
        case 'DELETE':
          return current?.filter(item => item?.id !== oldRecord?.id);
        default:
          return current;
      }
    });
  };

  const handleDoctorUpdate = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    setDoctors(current => {
      switch (eventType) {
        case 'INSERT':
          return [newRecord, ...current];
        case 'UPDATE':
          return current?.map(item => 
            item?.id === newRecord?.id ? { ...item, ...newRecord } : item
          );
        case 'DELETE':
          return current?.filter(item => item?.id !== oldRecord?.id);
        default:
          return current;
      }
    });
  };

  // Load initial data
  useEffect(() => {
    loadQueueData();
    loadPatients();
    loadDoctors();
    loadQueueStats();

    // Subscribe to real-time updates if authenticated
    if (isAuthenticated) {
      const unsubscribeQueue = queueService?.subscribeToQueue(handleQueueUpdate);
      const unsubscribePatients = patientService?.subscribeToPatients(handlePatientUpdate);
      const unsubscribeDoctors = doctorService?.subscribeToDoctors(handleDoctorUpdate);

      return () => {
        unsubscribeQueue();
        unsubscribePatients();
        unsubscribeDoctors();
      };
    }
  }, [isAuthenticated]);

  const loadQueueData = async () => {
    try {
      const data = await queueService?.getTodayQueue();
      setQueueData(data || []);
    } catch (error) {
      setError('Failed to load queue data');
      console.error('Error loading queue:', error);
    }
  };

  const loadPatients = async () => {
    try {
      const data = await patientService?.getPatients();
      setPatients(data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const loadDoctors = async () => {
    try {
      const data = await doctorService?.getDoctors();
      setDoctors(data || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQueueStats = async () => {
    try {
      const stats = await queueService?.getTodayQueueStats();
      setQueueStats(stats);
    } catch (error) {
      console.error('Error loading queue stats:', error);
    }
  };

  const handleAddToQueue = async (patientId, doctorId, priority, notes) => {
    try {
      if (!isAuthenticated) {
        alert('Preview Mode: In production, this would add the patient to the queue.');
        return;
      }

      await queueService?.addPatientToQueue(patientId, doctorId, priority, notes, user?.id);
      // Real-time update will handle UI refresh
    } catch (error) {
      setError('Failed to add patient to queue');
      console.error('Error adding to queue:', error);
    }
  };

  const handleUpdateQueueStatus = async (queueId, status) => {
    try {
      if (!isAuthenticated) {
        alert('Preview Mode: In production, this would update the queue status.');
        return;
      }

      await queueService?.updateQueueStatus(queueId, status);
      // Real-time update will handle UI refresh
    } catch (error) {
      setError('Failed to update queue status');
      console.error('Error updating queue:', error);
    }
  };

  const handleReorderQueue = (dragIndex, hoverIndex) => {
    // Implementation for reordering queue
    const dragItem = queueData[dragIndex];
    const newQueueData = [...queueData];
    newQueueData.splice(dragIndex, 1);
    newQueueData.splice(hoverIndex, 0, dragItem);
    setQueueData(newQueueData);
  };

  const handleBulkOperation = async (operation, selectedIds) => {
    try {
      if (!isAuthenticated) {
        alert('Preview Mode: In production, this would perform bulk operations.');
        return;
      }

      // Implementation for bulk operations
      await Promise.all(selectedIds.map(id => 
        queueService?.updateQueueStatus(id, operation)
      ));
    } catch (error) {
      setError('Failed to perform bulk operation');
      console.error('Error in bulk operation:', error);
    }
  };

  // Preview mode fallback content
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <div className="lg:ml-64">
          <main className="p-6">
            {/* Preview Mode Banner */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">Preview Mode - Queue Management</h3>
              <p className="text-sm text-yellow-700 mb-3">
                You are viewing the queue management interface in preview mode. 
                Sign in to manage actual patient queues and appointments.
              </p>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="/login" 
                  className="inline-flex items-center px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                >
                  Sign In to Manage Queue
                </a>
                <a 
                  href="/signup" 
                  className="inline-flex items-center px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  Create Account
                </a>
              </div>
            </div>

            {/* Show components with preview data */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <QueueStatistics 
                queueStats={{
                  total: 12,
                  waiting: 8,
                  with_doctor: 3,
                  completed: 1,
                  cancelled: 0
                }} 
                isPreview={true}
              />
              <div className="lg:col-span-3">
                <QuickAddPatient 
                  patients={[
                    { id: '1', full_name: 'John Smith', phone: '+1987654321' },
                    { id: '2', full_name: 'Mary Johnson', phone: '+1987654322' }
                  ]}
                  doctors={[
                    { id: '1', full_name: 'Dr. Sarah Johnson', specialization: 'general_practice' },
                    { id: '2', full_name: 'Dr. Michael Chen', specialization: 'pediatrics' }
                  ]}
                  onAddToQueue={() => alert('Preview Mode: Sign in to add patients to queue')}
                  isPreview={true}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <QueueTable 
                  queueData={[
                    {
                      id: '1',
                      queue_number: 1,
                      status: 'waiting',
                      check_in_time: new Date()?.toISOString(),
                      patients: { full_name: 'John Smith', phone: '+1987654321' },
                      doctors: { full_name: 'Dr. Sarah Johnson', specialization: 'general_practice' },
                      priority_level: 1
                    },
                    {
                      id: '2', 
                      queue_number: 2,
                      status: 'with_doctor',
                      check_in_time: new Date(Date.now() - 30 * 60 * 1000)?.toISOString(),
                      called_time: new Date(Date.now() - 15 * 60 * 1000)?.toISOString(),
                      patients: { full_name: 'Mary Johnson', phone: '+1987654322' },
                      doctors: { full_name: 'Dr. Michael Chen', specialization: 'pediatrics' },
                      priority_level: 2
                    }
                  ]}
                  onStatusUpdate={() => alert('Preview Mode: Sign in to update queue status')}
                  onSelectPatient={() => {}}
                  isPreview={true}
                />
              </div>
              <div className="space-y-6">
                <DoctorAvailability 
                  doctors={[
                    { id: '1', full_name: 'Dr. Sarah Johnson', specialization: 'general_practice', availability_status: 'available' },
                    { id: '2', full_name: 'Dr. Michael Chen', specialization: 'pediatrics', availability_status: 'busy' }
                  ]}
                  isPreview={true}
                />
                <BulkOperations 
                  queueData={[]}
                  onBulkAction={() => alert('Preview Mode: Sign in for bulk operations')}
                  isPreview={true}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading queue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="lg:ml-64">
        <main className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-red-600 underline text-sm mt-1"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <QueueStatistics queueStats={queueStats} />
            <div className="lg:col-span-3">
              <QuickAddPatient 
                patients={patients}
                doctors={doctors}
                onAddToQueue={handleAddToQueue}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <QueueTable 
                queueData={queueData}
                patients={patients}
                selectedPatient={selectedPatient}
                onStatusUpdate={handleUpdateQueueStatus}
                onSelectPatient={setSelectedPatient}
                onReorderQueue={handleReorderQueue}
              />
            </div>
            <div className="space-y-6">
              <DoctorAvailability doctors={doctors} />
              <BulkOperations 
                queueData={queueData}
                selectedPatients={selectedPatients}
                doctors={doctors}
                onBulkAction={handleUpdateQueueStatus}
                onBulkOperation={handleBulkOperation}
              />
            </div>
          </div>

          {/* Patient Details Modal */}
          {selectedPatient && (
            <PatientDetails 
              patient={selectedPatient}
              onClose={() => setSelectedPatient(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}