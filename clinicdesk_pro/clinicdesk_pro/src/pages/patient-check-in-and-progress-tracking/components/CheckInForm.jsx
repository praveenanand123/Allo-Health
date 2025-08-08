import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CheckInForm = ({ selectedPatient, onCheckIn, onCancel }) => {
  const [formData, setFormData] = useState({
    arrivalTime: '',
    visitReason: '',
    insuranceVerified: false,
    specialNeeds: '',
    emergencyContact: '',
    symptoms: '',
    temperature: '',
    bloodPressure: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const visitReasonOptions = [
    { value: 'routine-checkup', label: 'Routine Checkup' },
    { value: 'follow-up', label: 'Follow-up Visit' },
    { value: 'illness', label: 'Illness/Symptoms' },
    { value: 'injury', label: 'Injury' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'lab-results', label: 'Lab Results Review' },
    { value: 'prescription', label: 'Prescription Refill' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    // Auto-populate arrival time
    const now = new Date();
    setFormData(prev => ({
      ...prev,
      arrivalTime: now?.toTimeString()?.slice(0, 5)
    }));

    // Auto-populate from previous visits if patient selected
    if (selectedPatient) {
      setFormData(prev => ({
        ...prev,
        emergencyContact: selectedPatient?.emergencyContact || '',
        specialNeeds: selectedPatient?.specialNeeds || ''
      }));
    }
  }, [selectedPatient]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const checkInData = {
        ...formData,
        patientId: selectedPatient?.id || `P${Date.now()}`,
        patientName: selectedPatient?.name || 'New Patient',
        checkInTime: new Date()?.toISOString(),
        status: 'checked-in'
      };

      onCheckIn(checkInData);
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      arrivalTime: '',
      visitReason: '',
      insuranceVerified: false,
      specialNeeds: '',
      emergencyContact: '',
      symptoms: '',
      temperature: '',
      bloodPressure: '',
      notes: ''
    });
    onCancel();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="UserCheck" size={20} className="mr-2 text-primary" />
          Patient Check-in
        </h2>
        {selectedPatient && (
          <div className="text-sm text-muted-foreground">
            ID: {selectedPatient?.id}
          </div>
        )}
      </div>
      {selectedPatient ? (
        <div className="bg-muted rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">{selectedPatient?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedPatient?.phone} • DOB: {new Date(selectedPatient.dob)?.toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Insurance: {selectedPatient?.insurance}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              iconName="X"
            >
              Clear
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Icon name="AlertCircle" size={16} className="mr-2 text-warning" />
            <span className="text-sm text-warning">
              Please search and select a patient or create a new patient record
            </span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Arrival Time"
            type="time"
            value={formData?.arrivalTime}
            onChange={(e) => handleInputChange('arrivalTime', e?.target?.value)}
            required
          />
          <Select
            label="Visit Reason"
            options={visitReasonOptions}
            value={formData?.visitReason}
            onChange={(value) => handleInputChange('visitReason', value)}
            placeholder="Select reason for visit"
            required
          />
        </div>

        <Input
          label="Symptoms/Chief Complaint"
          type="text"
          placeholder="Brief description of symptoms or reason for visit"
          value={formData?.symptoms}
          onChange={(e) => handleInputChange('symptoms', e?.target?.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Temperature (°F)"
            type="text"
            placeholder="98.6"
            value={formData?.temperature}
            onChange={(e) => handleInputChange('temperature', e?.target?.value)}
          />
          <Input
            label="Blood Pressure"
            type="text"
            placeholder="120/80"
            value={formData?.bloodPressure}
            onChange={(e) => handleInputChange('bloodPressure', e?.target?.value)}
          />
        </div>

        <Input
          label="Emergency Contact"
          type="text"
          placeholder="Name and phone number"
          value={formData?.emergencyContact}
          onChange={(e) => handleInputChange('emergencyContact', e?.target?.value)}
        />

        <Input
          label="Special Needs/Accommodations"
          type="text"
          placeholder="Wheelchair access, interpreter, etc."
          value={formData?.specialNeeds}
          onChange={(e) => handleInputChange('specialNeeds', e?.target?.value)}
        />

        <Input
          label="Additional Notes"
          type="text"
          placeholder="Any additional information"
          value={formData?.notes}
          onChange={(e) => handleInputChange('notes', e?.target?.value)}
        />

        <div className="pt-2">
          <Checkbox
            label="Insurance verification completed"
            description="Confirm insurance coverage and copay requirements"
            checked={formData?.insuranceVerified}
            onChange={(e) => handleInputChange('insuranceVerified', e?.target?.checked)}
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            variant="default"
            loading={isSubmitting}
            disabled={!selectedPatient || !formData?.visitReason}
            iconName="UserCheck"
            iconPosition="left"
            className="flex-1"
          >
            {isSubmitting ? 'Checking In...' : 'Check In Patient'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
      {/* Keyboard Shortcuts Help */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center mb-1">
            <Icon name="Keyboard" size={12} className="mr-1" />
            Keyboard Shortcuts
          </div>
          <div className="grid grid-cols-2 gap-1">
            <span>Tab: Next field</span>
            <span>Ctrl+Enter: Submit</span>
            <span>Esc: Cancel</span>
            <span>F1: Quick check-in</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInForm;