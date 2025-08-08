import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PatientHistoryModal = ({ patient, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('visits');

  if (!isOpen || !patient) return null;

  // Mock patient history data
  const patientHistory = {
    visits: [
      {
        id: 'V001',
        date: '2025-01-15',
        reason: 'Annual Checkup',
        doctor: 'Dr. Sarah Wilson',
        diagnosis: 'Routine examination - Normal',
        notes: 'Patient in good health. Continue current medications.',
        duration: '45 minutes'
      },
      {
        id: 'V002',
        date: '2024-12-10',
        reason: 'Follow-up',
        doctor: 'Dr. Michael Chen',
        diagnosis: 'Hypertension - Controlled',
        notes: 'Blood pressure well controlled with current medication.',
        duration: '30 minutes'
      },
      {
        id: 'V003',
        date: '2024-11-05',
        reason: 'Flu Symptoms',
        doctor: 'Dr. Emily Rodriguez',
        diagnosis: 'Viral Upper Respiratory Infection',
        notes: 'Prescribed rest and symptomatic treatment.',
        duration: '20 minutes'
      }
    ],
    allergies: [
      {
        allergen: 'Penicillin',
        reaction: 'Skin rash',
        severity: 'Moderate',
        dateReported: '2020-03-15'
      },
      {
        allergen: 'Shellfish',
        reaction: 'Anaphylaxis',
        severity: 'Severe',
        dateReported: '2018-07-22'
      }
    ],
    medications: [
      {
        name: 'Lisinopril 10mg',
        dosage: 'Once daily',
        prescribedBy: 'Dr. Michael Chen',
        startDate: '2024-06-15',
        status: 'Active'
      },
      {
        name: 'Metformin 500mg',
        dosage: 'Twice daily',
        prescribedBy: 'Dr. Sarah Wilson',
        startDate: '2023-12-01',
        status: 'Active'
      }
    ],
    vitals: [
      {
        date: '2025-01-15',
        bloodPressure: '128/82',
        heartRate: '72',
        temperature: '98.6°F',
        weight: '165 lbs',
        height: '5\'8"'
      },
      {
        date: '2024-12-10',
        bloodPressure: '125/80',
        heartRate: '68',
        temperature: '98.4°F',
        weight: '167 lbs',
        height: '5\'8"'
      }
    ]
  };

  const tabs = [
    { id: 'visits', label: 'Recent Visits', icon: 'Calendar' },
    { id: 'allergies', label: 'Allergies', icon: 'AlertTriangle' },
    { id: 'medications', label: 'Medications', icon: 'Pill' },
    { id: 'vitals', label: 'Vital Signs', icon: 'Activity' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Severe': return 'text-error bg-error/10';
      case 'Moderate': return 'text-warning bg-warning/10';
      case 'Mild': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <Icon name="FileText" size={24} className="mr-3 text-primary" />
              Patient History
            </h2>
            <p className="text-muted-foreground mt-1">
              {patient?.name} • ID: {patient?.id} • DOB: {new Date(patient.dob)?.toLocaleDateString()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} className="mr-2" />
              {tab?.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'visits' && (
            <div className="space-y-4">
              {patientHistory?.visits?.map((visit) => (
                <div key={visit?.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-foreground">{visit?.reason}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(visit.date)?.toLocaleDateString()} • {visit?.doctor}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {visit?.duration}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-foreground">Diagnosis: </span>
                      <span className="text-sm text-muted-foreground">{visit?.diagnosis}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">Notes: </span>
                      <span className="text-sm text-muted-foreground">{visit?.notes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'allergies' && (
            <div className="space-y-4">
              {patientHistory?.allergies?.length > 0 ? (
                patientHistory?.allergies?.map((allergy, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground">{allergy?.allergen}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(allergy?.severity)}`}>
                        {allergy?.severity}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Reaction: </span>
                        <span className="text-muted-foreground">{allergy?.reaction}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Reported: </span>
                        <span className="text-muted-foreground">
                          {new Date(allergy.dateReported)?.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Icon name="Shield" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No known allergies</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'medications' && (
            <div className="space-y-4">
              {patientHistory?.medications?.map((medication, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">{medication?.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      medication?.status === 'Active' ?'text-success bg-success/10' :'text-muted-foreground bg-muted'
                    }`}>
                      {medication?.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium text-foreground">Dosage: </span>
                      <span className="text-muted-foreground">{medication?.dosage}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-foreground">Prescribed by: </span>
                      <span className="text-muted-foreground">{medication?.prescribedBy}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-foreground">Start date: </span>
                      <span className="text-muted-foreground">
                        {new Date(medication.startDate)?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'vitals' && (
            <div className="space-y-4">
              {patientHistory?.vitals?.map((vital, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-foreground">
                      {new Date(vital.date)?.toLocaleDateString()}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-foreground">Blood Pressure</span>
                      <p className="text-lg text-muted-foreground">{vital?.bloodPressure}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">Heart Rate</span>
                      <p className="text-lg text-muted-foreground">{vital?.heartRate} bpm</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">Temperature</span>
                      <p className="text-lg text-muted-foreground">{vital?.temperature}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">Weight</span>
                      <p className="text-lg text-muted-foreground">{vital?.weight}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">Height</span>
                      <p className="text-lg text-muted-foreground">{vital?.height}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center text-xs text-muted-foreground">
            <Icon name="Shield" size={14} className="mr-2" />
            HIPAA compliant access logged
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export History
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHistoryModal;