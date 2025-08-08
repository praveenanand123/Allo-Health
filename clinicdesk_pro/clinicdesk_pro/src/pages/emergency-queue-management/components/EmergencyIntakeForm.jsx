import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmergencyIntakeForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    emergencyContact: '',
    contactPhone: '',
    chiefComplaint: '',
    severity: '',
    triageNotes: '',
    allergies: '',
    currentMedications: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const severityOptions = [
    { value: 'critical', label: 'Critical - Life Threatening' },
    { value: 'urgent', label: 'Urgent - Immediate Care' },
    { value: 'semi-urgent', label: 'Semi-Urgent - Within 1 Hour' },
    { value: 'less-urgent', label: 'Less Urgent - Within 2 Hours' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    const emergencyData = {
      ...formData,
      timestamp: new Date()?.toISOString(),
      queueNumber: `E${Date.now()?.toString()?.slice(-4)}`,
      status: 'emergency-waiting'
    };
    
    try {
      await onSubmit(emergencyData);
      // Reset form
      setFormData({
        patientName: '',
        emergencyContact: '',
        contactPhone: '',
        chiefComplaint: '',
        severity: '',
        triageNotes: '',
        allergies: '',
        currentMedications: ''
      });
    } catch (error) {
      console.error('Emergency intake submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData?.patientName && formData?.chiefComplaint && formData?.severity;

  return (
    <div className="bg-card border border-error/20 rounded-lg shadow-lg">
      <div className="bg-error/10 px-4 py-3 border-b border-error/20 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Icon name="UserPlus" size={20} className="text-error" />
          <h3 className="text-lg font-semibold text-error">Emergency Patient Intake</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Rapid registration for urgent medical situations
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Patient Information */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center">
            <Icon name="User" size={16} className="mr-2" />
            Patient Information
          </h4>
          
          <Input
            label="Patient Name *"
            type="text"
            placeholder="Enter full name"
            value={formData?.patientName}
            onChange={(e) => handleInputChange('patientName', e?.target?.value)}
            required
            className="bg-background"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Emergency Contact"
              type="text"
              placeholder="Contact person name"
              value={formData?.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e?.target?.value)}
              className="bg-background"
            />
            
            <Input
              label="Contact Phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData?.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e?.target?.value)}
              className="bg-background"
            />
          </div>
        </div>

        {/* Medical Information */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center">
            <Icon name="Stethoscope" size={16} className="mr-2" />
            Medical Details
          </h4>
          
          <Input
            label="Chief Complaint *"
            type="text"
            placeholder="Brief description of emergency"
            value={formData?.chiefComplaint}
            onChange={(e) => handleInputChange('chiefComplaint', e?.target?.value)}
            required
            className="bg-background"
          />

          <Select
            label="Severity Level *"
            placeholder="Select urgency level"
            options={severityOptions}
            value={formData?.severity}
            onChange={(value) => handleInputChange('severity', value)}
            required
            className="bg-background"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Known Allergies"
              type="text"
              placeholder="Drug/food allergies"
              value={formData?.allergies}
              onChange={(e) => handleInputChange('allergies', e?.target?.value)}
              className="bg-background"
            />
            
            <Input
              label="Current Medications"
              type="text"
              placeholder="Current prescriptions"
              value={formData?.currentMedications}
              onChange={(e) => handleInputChange('currentMedications', e?.target?.value)}
              className="bg-background"
            />
          </div>
        </div>

        {/* Triage Notes */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center">
            <Icon name="FileText" size={16} className="mr-2" />
            Triage Assessment
          </h4>
          
          <div className="relative">
            <textarea
              placeholder="Initial assessment notes, vital signs, observations..."
              value={formData?.triageNotes}
              onChange={(e) => handleInputChange('triageNotes', e?.target?.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              Auto-timestamp: {new Date()?.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Form started: {new Date()?.toLocaleTimeString()}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="destructive"
              loading={isSubmitting}
              disabled={!isFormValid}
              iconName="AlertTriangle"
              iconPosition="left"
            >
              {isSubmitting ? 'Processing Emergency...' : 'Add to Emergency Queue'}
            </Button>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="bg-muted/50 p-3 rounded-md">
          <div className="text-xs text-muted-foreground">
            <strong>Quick Keys:</strong> F12 - Emergency Mode | Ctrl+E - Quick Submit | Esc - Cancel
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmergencyIntakeForm;