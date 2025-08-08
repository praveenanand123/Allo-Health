import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import DoctorListPanel from './components/DoctorListPanel';
import DoctorProfileEditor from './components/DoctorProfileEditor';
import BulkOperationsPanel from './components/BulkOperationsPanel';
import QuickStatsCard from './components/QuickStatsCard';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const DoctorProfileManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [showBulkOperations, setShowBulkOperations] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [filters, setFilters] = useState({
    specialization: 'all',
    location: 'all',
    status: 'all'
  });

  // Mock doctors data
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      credentials: "MD, FACC",
      email: "sarah.johnson@clinic.com",
      phone: "+1 (555) 123-4567",
      specialization: ["cardiology", "internal medicine"],
      location: "main-clinic",
      locationName: "Main Clinic",
      gender: "female",
      experience: "15",
      consultationFee: "200",
      languages: ["english", "spanish"],
      bio: `Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in cardiovascular medicine. She specializes in preventive cardiology, heart failure management, and interventional procedures.`,
      education: "Harvard Medical School (MD), Johns Hopkins (Residency), Mayo Clinic (Fellowship)",
      certifications: ["Board Certified in Cardiology", "Fellow of American College of Cardiology", "Advanced Cardiac Life Support (ACLS)"],
      availability: {
        monday: { enabled: true, start: '08:00', end: '17:00' },
        tuesday: { enabled: true, start: '08:00', end: '17:00' },
        wednesday: { enabled: true, start: '08:00', end: '17:00' },
        thursday: { enabled: true, start: '08:00', end: '17:00' },
        friday: { enabled: true, start: '08:00', end: '15:00' },
        saturday: { enabled: false, start: '09:00', end: '13:00' },
        sunday: { enabled: false, start: '09:00', end: '13:00' }
      },
      emergencyContact: "+1 (555) 987-6543",
      licenseNumber: "MD123456789",
      licenseExpiry: "2025-12-31",
      isActive: true,
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      status: "available",
      currentPatients: 8,
      nextAvailable: "2:30 PM",
      backAt: "",
      isOnline: true,
      hasEmergency: false
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      credentials: "MD, PhD",
      email: "michael.chen@clinic.com",
      phone: "+1 (555) 234-5678",
      specialization: ["neurology", "neurosurgery"],
      location: "north-branch",
      locationName: "North Branch",
      gender: "male",
      experience: "12",
      consultationFee: "250",
      languages: ["english", "mandarin"],
      bio: `Dr. Michael Chen is a renowned neurologist and neurosurgeon with expertise in complex brain and spine surgeries. He has published over 50 research papers in peer-reviewed journals.`,
      education: "Stanford Medical School (MD, PhD), UCSF (Residency), Cleveland Clinic (Fellowship)",
      certifications: ["Board Certified in Neurology", "Board Certified in Neurosurgery", "Stereotactic Radiosurgery Certification"],
      availability: {
        monday: { enabled: true, start: '07:00', end: '18:00' },
        tuesday: { enabled: true, start: '07:00', end: '18:00' },
        wednesday: { enabled: true, start: '07:00', end: '18:00' },
        thursday: { enabled: true, start: '07:00', end: '18:00' },
        friday: { enabled: true, start: '07:00', end: '16:00' },
        saturday: { enabled: true, start: '08:00', end: '14:00' },
        sunday: { enabled: false, start: '09:00', end: '13:00' }
      },
      emergencyContact: "+1 (555) 876-5432",
      licenseNumber: "MD987654321",
      licenseExpiry: "2026-06-30",
      isActive: true,
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      status: "busy",
      currentPatients: 12,
      nextAvailable: "4:15 PM",
      backAt: "",
      isOnline: true,
      hasEmergency: true
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      credentials: "MD, FAAP",
      email: "emily.rodriguez@clinic.com",
      phone: "+1 (555) 345-6789",
      specialization: ["pediatrics", "adolescent medicine"],
      location: "south-branch",
      locationName: "South Branch",
      gender: "female",
      experience: "8",
      consultationFee: "150",
      languages: ["english", "spanish"],
      bio: `Dr. Emily Rodriguez is a dedicated pediatrician who provides comprehensive care for children from infancy through adolescence. She has a special interest in developmental pediatrics and childhood obesity prevention.`,
      education: "UCLA Medical School (MD), Children's Hospital LA (Residency)",
      certifications: ["Board Certified in Pediatrics", "Fellow of American Academy of Pediatrics", "Pediatric Advanced Life Support (PALS)"],
      availability: {
        monday: { enabled: true, start: '08:30', end: '17:30' },
        tuesday: { enabled: true, start: '08:30', end: '17:30' },
        wednesday: { enabled: true, start: '08:30', end: '17:30' },
        thursday: { enabled: true, start: '08:30', end: '17:30' },
        friday: { enabled: true, start: '08:30', end: '16:00' },
        saturday: { enabled: true, start: '09:00', end: '13:00' },
        sunday: { enabled: false, start: '09:00', end: '13:00' }
      },
      emergencyContact: "+1 (555) 765-4321",
      licenseNumber: "MD456789123",
      licenseExpiry: "2025-09-15",
      isActive: true,
      avatar: "https://images.unsplash.com/photo-1594824388853-d0c6e0b8b7b8?w=400&h=400&fit=crop&crop=face",
      status: "break",
      currentPatients: 6,
      nextAvailable: "",
      backAt: "1:45 PM",
      isOnline: true,
      hasEmergency: false
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      credentials: "MD, FACS",
      email: "james.wilson@clinic.com",
      phone: "+1 (555) 456-7890",
      specialization: ["orthopedics", "sports medicine"],
      location: "downtown",
      locationName: "Downtown Center",
      gender: "male",
      experience: "20",
      consultationFee: "300",
      languages: ["english", "french"],
      bio: `Dr. James Wilson is an experienced orthopedic surgeon specializing in sports medicine and joint replacement surgeries. He has served as team physician for several professional sports teams.`,
      education: "Johns Hopkins Medical School (MD), Hospital for Special Surgery (Residency, Fellowship)",
      certifications: ["Board Certified in Orthopedic Surgery", "Fellow of American College of Surgeons", "Sports Medicine Certification"],
      availability: {
        monday: { enabled: true, start: '06:00', end: '16:00' },
        tuesday: { enabled: true, start: '06:00', end: '16:00' },
        wednesday: { enabled: true, start: '06:00', end: '16:00' },
        thursday: { enabled: true, start: '06:00', end: '16:00' },
        friday: { enabled: true, start: '06:00', end: '14:00' },
        saturday: { enabled: false, start: '08:00', end: '12:00' },
        sunday: { enabled: false, start: '09:00', end: '13:00' }
      },
      emergencyContact: "+1 (555) 654-3210",
      licenseNumber: "MD789123456",
      licenseExpiry: "2024-12-31",
      isActive: true,
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
      status: "available",
      currentPatients: 4,
      nextAvailable: "",
      backAt: "",
      isOnline: true,
      hasEmergency: false
    },
    {
      id: 5,
      name: "Dr. Lisa Thompson",
      credentials: "MD, FACOG",
      email: "lisa.thompson@clinic.com",
      phone: "+1 (555) 567-8901",
      specialization: ["gynecology", "obstetrics"],
      location: "main-clinic",
      locationName: "Main Clinic",
      gender: "female",
      experience: "18",
      consultationFee: "220",
      languages: ["english", "german"],
      bio: `Dr. Lisa Thompson is a board-certified obstetrician-gynecologist with extensive experience in women's health, high-risk pregnancies, and minimally invasive surgical procedures.`,
      education: "Mayo Clinic Medical School (MD), Cleveland Clinic (Residency)",
      certifications: ["Board Certified in Obstetrics and Gynecology", "Fellow of American College of Obstetricians and Gynecologists", "Laparoscopic Surgery Certification"],
      availability: {
        monday: { enabled: true, start: '08:00', end: '18:00' },
        tuesday: { enabled: true, start: '08:00', end: '18:00' },
        wednesday: { enabled: true, start: '08:00', end: '18:00' },
        thursday: { enabled: true, start: '08:00', end: '18:00' },
        friday: { enabled: true, start: '08:00', end: '17:00' },
        saturday: { enabled: true, start: '09:00', end: '15:00' },
        sunday: { enabled: false, start: '09:00', end: '13:00' }
      },
      emergencyContact: "+1 (555) 543-2109",
      licenseNumber: "MD321654987",
      licenseExpiry: "2026-03-31",
      isActive: true,
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      status: "offline",
      currentPatients: 0,
      nextAvailable: "Tomorrow 8:00 AM",
      backAt: "",
      isOnline: false,
      hasEmergency: false
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setConnectionStatus(prev => prev === 'connected' ? 'connected' : 'connected');
      
      // Randomly update doctor statuses
      setDoctors(prevDoctors => 
        prevDoctors?.map(doctor => {
          const shouldUpdate = Math.random() < 0.1; // 10% chance to update
          if (shouldUpdate) {
            const statuses = ['available', 'busy', 'break', 'offline'];
            const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
            return {
              ...doctor,
              status: randomStatus,
              currentPatients: randomStatus === 'offline' ? 0 : Math.floor(Math.random() * 15)
            };
          }
          return doctor;
        })
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check for emergency situations
    const hasEmergency = doctors?.some(doctor => doctor?.hasEmergency);
    setEmergencyActive(hasEmergency);
  }, [doctors]);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsEditing(false);
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setIsEditing(true);
  };

  const handleSaveDoctor = (doctorData) => {
    if (selectedDoctor) {
      // Update existing doctor
      setDoctors(prevDoctors =>
        prevDoctors?.map(doctor =>
          doctor?.id === selectedDoctor?.id
            ? { ...doctor, ...doctorData }
            : doctor
        )
      );
      setSelectedDoctor({ ...selectedDoctor, ...doctorData });
    } else {
      // Add new doctor
      const newDoctor = {
        ...doctorData,
        id: Math.max(...doctors?.map(d => d?.id)) + 1,
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
        status: "available",
        currentPatients: 0,
        nextAvailable: "",
        backAt: "",
        isOnline: true,
        hasEmergency: false,
        locationName: getLocationName(doctorData?.location)
      };
      setDoctors(prevDoctors => [...prevDoctors, newDoctor]);
      setSelectedDoctor(newDoctor);
    }
    setIsEditing(false);
  };

  const handleDeleteDoctor = (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor profile? This action cannot be undone.')) {
      setDoctors(prevDoctors => prevDoctors?.filter(doctor => doctor?.id !== doctorId));
      if (selectedDoctor?.id === doctorId) {
        setSelectedDoctor(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (!selectedDoctor) {
      // If we were adding a new doctor, clear selection
      setSelectedDoctor(null);
    }
  };

  const handleToggleEdit = (editing) => {
    setIsEditing(editing);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleBulkOperation = (operation) => {
    console.log('Executing bulk operation:', operation);
    
    switch (operation?.type) {
      case 'update-location':
        setDoctors(prevDoctors =>
          prevDoctors?.map(doctor =>
            operation?.doctorIds?.includes(doctor?.id)
              ? { 
                  ...doctor, 
                  location: operation?.data?.location,
                  locationName: getLocationName(operation?.data?.location)
                }
              : doctor
          )
        );
        break;
      
      case 'update-status':
        setDoctors(prevDoctors =>
          prevDoctors?.map(doctor =>
            operation?.doctorIds?.includes(doctor?.id)
              ? { ...doctor, status: operation?.data?.status }
              : doctor
          )
        );
        break;
      
      case 'export-data':
        // Simulate export
        const exportData = doctors?.filter(doctor => 
          operation?.doctorIds?.includes(doctor?.id)
        );
        console.log('Exporting data:', exportData);
        break;
      
      default:
        console.log('Operation not implemented:', operation?.type);
    }
    
    setSelectedDoctors([]);
    setShowBulkOperations(false);
  };

  const getLocationName = (locationCode) => {
    const locationMap = {
      'main-clinic': 'Main Clinic',
      'north-branch': 'North Branch',
      'south-branch': 'South Branch',
      'downtown': 'Downtown Center'
    };
    return locationMap?.[locationCode] || locationCode;
  };

  const handleKeyboardShortcuts = (e) => {
    if (e?.ctrlKey) {
      switch (e?.key) {
        case 'ArrowUp':
          e?.preventDefault();
          // Navigate to previous doctor
          break;
        case 'ArrowDown':
          e?.preventDefault();
          // Navigate to next doctor
          break;
        default:
          break;
      }
    }
    
    if (e?.key === 'F2') {
      e?.preventDefault();
      if (selectedDoctor && !isEditing) {
        setIsEditing(true);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [selectedDoctor, isEditing]);

  return (
    <div className="min-h-screen bg-background" onKeyDown={handleKeyboardShortcuts}>
      <Header
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        emergencyActive={emergencyActive}
        connectionStatus={connectionStatus}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        emergencyActive={emergencyActive}
        connectionStatus={connectionStatus}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-240'
      } ${emergencyActive ? 'mt-28' : 'mt-16'}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Doctor Profile Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage doctor profiles, schedules, and availability across all clinic locations
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => console.log('Export all data')}
                >
                  Export Data
                </Button>
                
                <Button
                  variant="outline"
                  iconName="Settings"
                  iconPosition="left"
                  onClick={() => console.log('Open settings')}
                >
                  Settings
                </Button>
                
                <Button
                  variant="default"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={handleAddDoctor}
                >
                  Add Doctor
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <QuickStatsCard doctors={doctors} />

          {/* Main Content */}
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)]">
            {/* Doctor List Panel - Left 40% */}
            <div className="col-span-5">
              <DoctorListPanel
                doctors={doctors}
                selectedDoctor={selectedDoctor}
                onSelectDoctor={handleSelectDoctor}
                onAddDoctor={handleAddDoctor}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Doctor Profile Editor - Right 60% */}
            <div className="col-span-7">
              <DoctorProfileEditor
                doctor={selectedDoctor}
                onSave={handleSaveDoctor}
                onCancel={handleCancelEdit}
                onDelete={handleDeleteDoctor}
                isEditing={isEditing}
                onToggleEdit={handleToggleEdit}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Bulk Operations Panel */}
      <BulkOperationsPanel
        selectedDoctors={selectedDoctors}
        onBulkOperation={handleBulkOperation}
        onClearSelection={() => {
          setSelectedDoctors([]);
          setShowBulkOperations(false);
        }}
        isVisible={showBulkOperations && selectedDoctors?.length > 0}
      />
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          variant="default"
          size="icon"
          className="w-14 h-14 rounded-full shadow-large"
          onClick={handleAddDoctor}
        >
          <Icon name="Plus" size={24} />
        </Button>
      </div>
    </div>
  );
};

export default DoctorProfileManagement;