import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AppointmentDetailsPanel = ({ 
  appointment, 
  doctors, 
  onSave, 
  onCancel, 
  onClose,
  isCreating = false 
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'consultation',
    status: 'booked',
    duration: 15,
    notes: '',
    insuranceProvider: '',
    isEmergency: false,
    reminderSent: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientName: appointment?.patientName || '',
        patientPhone: appointment?.patientPhone || '',
        patientEmail: appointment?.patientEmail || '',
        doctorId: appointment?.doctorId || '',
        date: appointment?.date || '',
        time: appointment?.time || '',
        type: appointment?.type || 'consultation',
        status: appointment?.status || 'booked',
        duration: appointment?.duration || 15,
        notes: appointment?.notes || '',
        insuranceProvider: appointment?.insuranceProvider || '',
        isEmergency: appointment?.type === 'emergency',
        reminderSent: appointment?.reminderSent || false
      });
    }
  }, [appointment]);

  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'routine-checkup', label: 'Routine Checkup' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'lab-results', label: 'Lab Results Review' }
  ];

  const appointmentStatuses = [
    { value: 'booked', label: 'Booked' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' }
  ];

  const durationOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  const insuranceProviders = [
    { value: '', label: 'No Insurance' },
    { value: 'blue-cross', label: 'Blue Cross Blue Shield' },
    { value: 'aetna', label: 'Aetna' },
    { value: 'cigna', label: 'Cigna' },
    { value: 'united', label: 'United Healthcare' },
    { value: 'medicare', label: 'Medicare' },
    { value: 'medicaid', label: 'Medicaid' },
    { value: 'other', label: 'Other' }
  ];

  const doctorOptions = doctors?.map(doctor => ({
    value: doctor?.id,
    label: `Dr. ${doctor?.name} - ${doctor?.specialization}`,
    description: doctor?.location
  }));

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.patientName?.trim()) {
      newErrors.patientName = 'Patient name is required';
    }

    if (!formData?.patientPhone?.trim()) {
      newErrors.patientPhone = 'Phone number is required';
    } else if (!/^\d{10}$/?.test(formData?.patientPhone?.replace(/\D/g, ''))) {
      newErrors.patientPhone = 'Please enter a valid 10-digit phone number';
    }

    if (formData?.patientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.patientEmail)) {
      newErrors.patientEmail = 'Please enter a valid email address';
    }

    if (!formData?.doctorId) {
      newErrors.doctorId = 'Please select a doctor';
    }

    if (!formData?.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData?.time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const appointmentData = {
        ...formData,
        type: formData?.isEmergency ? 'emergency' : formData?.type,
        id: appointment?.id || Date.now()?.toString()
      };
      
      await onSave(appointmentData);
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (appointment && window.confirm('Are you sure you want to cancel this appointment?')) {
      setIsLoading(true);
      try {
        await onCancel(appointment?.id);
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const selectedDoctor = doctors?.find(d => d?.id === formData?.doctorId);

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {isCreating ? 'New Appointment' : 'Appointment Details'}
          </h2>
          {appointment && (
            <p className="text-sm text-muted-foreground">ID: {appointment?.id}</p>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <Icon name="X" size={20} />
        </Button>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Patient Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Patient Information
          </h3>
          
          <Input
            label="Patient Name"
            type="text"
            required
            value={formData?.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e?.target?.value })}
            error={errors?.patientName}
            placeholder="Enter patient's full name"
          />

          <Input
            label="Phone Number"
            type="tel"
            required
            value={formData?.patientPhone}
            onChange={(e) => setFormData({ ...formData, patientPhone: e?.target?.value })}
            error={errors?.patientPhone}
            placeholder="(555) 123-4567"
          />

          <Input
            label="Email Address"
            type="email"
            value={formData?.patientEmail}
            onChange={(e) => setFormData({ ...formData, patientEmail: e?.target?.value })}
            error={errors?.patientEmail}
            placeholder="patient@example.com"
            description="Optional - for appointment reminders"
          />

          <Select
            label="Insurance Provider"
            options={insuranceProviders}
            value={formData?.insuranceProvider}
            onChange={(value) => setFormData({ ...formData, insuranceProvider: value })}
            placeholder="Select insurance provider"
          />
        </div>

        {/* Appointment Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Appointment Details
          </h3>

          <Select
            label="Doctor"
            options={doctorOptions}
            value={formData?.doctorId}
            onChange={(value) => setFormData({ ...formData, doctorId: value })}
            error={errors?.doctorId}
            required
            searchable
            placeholder="Select a doctor"
          />

          {selectedDoctor && (
            <div className="p-3 bg-muted/50 rounded-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Dr. {selectedDoctor?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedDoctor?.specialization}</p>
                  <p className="text-xs text-muted-foreground">{selectedDoctor?.location}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedDoctor?.availability === 'available' ? 'bg-success' :
                      selectedDoctor?.availability === 'busy' ? 'bg-warning' : 'bg-error'
                    }`} />
                    <span className="text-xs text-muted-foreground capitalize">
                      {selectedDoctor?.availability}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              required
              value={formData?.date}
              onChange={(e) => setFormData({ ...formData, date: e?.target?.value })}
              error={errors?.date}
              min={new Date()?.toISOString()?.split('T')?.[0]}
            />

            <Input
              label="Time"
              type="time"
              required
              value={formData?.time}
              onChange={(e) => setFormData({ ...formData, time: e?.target?.value })}
              error={errors?.time}
              step="900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Appointment Type"
              options={appointmentTypes}
              value={formData?.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
              required
            />

            <Select
              label="Duration"
              options={durationOptions}
              value={formData?.duration}
              onChange={(value) => setFormData({ ...formData, duration: value })}
              required
            />
          </div>

          <Select
            label="Status"
            options={appointmentStatuses}
            value={formData?.status}
            onChange={(value) => setFormData({ ...formData, status: value })}
            required
          />

          <div className="space-y-3">
            <Checkbox
              label="Emergency Appointment"
              description="Mark as high priority"
              checked={formData?.isEmergency}
              onChange={(e) => setFormData({ ...formData, isEmergency: e?.target?.checked })}
            />

            <Checkbox
              label="Reminder Sent"
              description="Patient has been notified"
              checked={formData?.reminderSent}
              onChange={(e) => setFormData({ ...formData, reminderSent: e?.target?.checked })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes
            </label>
            <textarea
              className="w-full min-h-24 p-3 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Additional notes about the appointment..."
              value={formData?.notes}
              onChange={(e) => setFormData({ ...formData, notes: e?.target?.value })}
            />
          </div>
        </div>
      </form>
      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          onClick={handleSubmit}
          className="w-full"
        >
          {isCreating ? 'Create Appointment' : 'Save Changes'}
        </Button>

        {!isCreating && appointment && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full"
            >
              Cancel Appointment
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.print()}
              disabled={isLoading}
              className="w-full"
            >
              Print Details
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
          className="w-full"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default AppointmentDetailsPanel;