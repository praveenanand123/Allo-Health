import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const DoctorProfileEditor = ({ 
  doctor, 
  onSave, 
  onCancel, 
  onDelete,
  isEditing,
  onToggleEdit 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    credentials: '',
    email: '',
    phone: '',
    specialization: [],
    location: '',
    gender: '',
    experience: '',
    consultationFee: '',
    languages: [],
    bio: '',
    education: '',
    certifications: [],
    availability: {
      monday: { enabled: true, start: '09:00', end: '17:00' },
      tuesday: { enabled: true, start: '09:00', end: '17:00' },
      wednesday: { enabled: true, start: '09:00', end: '17:00' },
      thursday: { enabled: true, start: '09:00', end: '17:00' },
      friday: { enabled: true, start: '09:00', end: '17:00' },
      saturday: { enabled: false, start: '09:00', end: '13:00' },
      sunday: { enabled: false, start: '09:00', end: '13:00' }
    },
    emergencyContact: '',
    licenseNumber: '',
    licenseExpiry: '',
    isActive: true
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor?.name || '',
        credentials: doctor?.credentials || '',
        email: doctor?.email || '',
        phone: doctor?.phone || '',
        specialization: doctor?.specialization || [],
        location: doctor?.location || '',
        gender: doctor?.gender || '',
        experience: doctor?.experience || '',
        consultationFee: doctor?.consultationFee || '',
        languages: doctor?.languages || [],
        bio: doctor?.bio || '',
        education: doctor?.education || '',
        certifications: doctor?.certifications || [],
        availability: doctor?.availability || formData?.availability,
        emergencyContact: doctor?.emergencyContact || '',
        licenseNumber: doctor?.licenseNumber || '',
        licenseExpiry: doctor?.licenseExpiry || '',
        isActive: doctor?.isActive !== undefined ? doctor?.isActive : true
      });
    }
  }, [doctor]);

  const specializationOptions = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'endocrinology', label: 'Endocrinology' },
    { value: 'gastroenterology', label: 'Gastroenterology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'surgery', label: 'Surgery' }
  ];

  const locationOptions = [
    { value: 'main-clinic', label: 'Main Clinic' },
    { value: 'north-branch', label: 'North Branch' },
    { value: 'south-branch', label: 'South Branch' },
    { value: 'downtown', label: 'Downtown Center' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'mandarin', label: 'Mandarin' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'arabic', label: 'Arabic' }
  ];

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'User' },
    { id: 'professional', label: 'Professional', icon: 'Briefcase' },
    { id: 'schedule', label: 'Schedule', icon: 'Calendar' },
    { id: 'credentials', label: 'Credentials', icon: 'Award' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev?.availability,
        [day]: {
          ...prev?.availability?.[day],
          [field]: value
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) newErrors.name = 'Name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    if (!formData?.phone?.trim()) newErrors.phone = 'Phone is required';
    if (formData?.specialization?.length === 0) newErrors.specialization = 'At least one specialization is required';
    if (!formData?.location) newErrors.location = 'Location is required';
    if (!formData?.licenseNumber?.trim()) newErrors.licenseNumber = 'License number is required';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Dr. John Smith"
          value={formData?.name}
          onChange={(e) => handleInputChange('name', e?.target?.value)}
          error={errors?.name}
          required
          disabled={!isEditing}
        />

        <Input
          label="Credentials"
          type="text"
          placeholder="MD, MBBS"
          value={formData?.credentials}
          onChange={(e) => handleInputChange('credentials', e?.target?.value)}
          disabled={!isEditing}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="doctor@clinic.com"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
          disabled={!isEditing}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData?.phone}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          error={errors?.phone}
          required
          disabled={!isEditing}
        />

        <Select
          label="Gender"
          placeholder="Select gender"
          options={genderOptions}
          value={formData?.gender}
          onChange={(value) => handleInputChange('gender', value)}
          disabled={!isEditing}
        />

        <Input
          label="Years of Experience"
          type="number"
          placeholder="10"
          value={formData?.experience}
          onChange={(e) => handleInputChange('experience', e?.target?.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Primary Location"
          placeholder="Select location"
          options={locationOptions}
          value={formData?.location}
          onChange={(value) => handleInputChange('location', value)}
          error={errors?.location}
          required
          disabled={!isEditing}
        />

        <Input
          label="Consultation Fee"
          type="number"
          placeholder="150"
          value={formData?.consultationFee}
          onChange={(e) => handleInputChange('consultationFee', e?.target?.value)}
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Bio / Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          rows={4}
          placeholder="Brief description about the doctor..."
          value={formData?.bio}
          onChange={(e) => handleInputChange('bio', e?.target?.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={formData?.isActive}
          onChange={(e) => handleInputChange('isActive', e?.target?.checked)}
          disabled={!isEditing}
        />
        <label className="text-sm text-foreground">Active Doctor Profile</label>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <Select
        label="Specializations"
        description="Select all applicable specializations"
        placeholder="Choose specializations"
        options={specializationOptions}
        value={formData?.specialization}
        onChange={(value) => handleInputChange('specialization', value)}
        error={errors?.specialization}
        multiple
        searchable
        required
        disabled={!isEditing}
      />

      <Select
        label="Languages Spoken"
        placeholder="Select languages"
        options={languageOptions}
        value={formData?.languages}
        onChange={(value) => handleInputChange('languages', value)}
        multiple
        searchable
        disabled={!isEditing}
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Education Background
        </label>
        <textarea
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          rows={3}
          placeholder="Medical school, residency, fellowships..."
          value={formData?.education}
          onChange={(e) => handleInputChange('education', e?.target?.value)}
          disabled={!isEditing}
        />
      </div>

      <Input
        label="Emergency Contact"
        type="tel"
        placeholder="+1 (555) 987-6543"
        value={formData?.emergencyContact}
        onChange={(e) => handleInputChange('emergencyContact', e?.target?.value)}
        disabled={!isEditing}
      />
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-4">Weekly Availability</h4>
        <div className="space-y-3">
          {Object.entries(formData?.availability)?.map(([day, schedule]) => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-20">
                <Checkbox
                  checked={schedule?.enabled}
                  onChange={(e) => handleAvailabilityChange(day, 'enabled', e?.target?.checked)}
                  disabled={!isEditing}
                />
                <label className="ml-2 text-sm font-medium capitalize">
                  {day}
                </label>
              </div>
              
              {schedule?.enabled && (
                <div className="flex items-center space-x-2 flex-1">
                  <Input
                    type="time"
                    value={schedule?.start}
                    onChange={(e) => handleAvailabilityChange(day, 'start', e?.target?.value)}
                    disabled={!isEditing}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={schedule?.end}
                    onChange={(e) => handleAvailabilityChange(day, 'end', e?.target?.value)}
                    disabled={!isEditing}
                    className="w-32"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-warning/10 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Clock" size={20} className="text-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-2">Schedule Notes</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Break times are automatically scheduled every 2 hours</li>
              <li>• Emergency appointments can override regular schedule</li>
              <li>• Schedule changes require 24-hour notice to patients</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCredentials = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Medical License Number"
          type="text"
          placeholder="MD123456789"
          value={formData?.licenseNumber}
          onChange={(e) => handleInputChange('licenseNumber', e?.target?.value)}
          error={errors?.licenseNumber}
          required
          disabled={!isEditing}
        />

        <Input
          label="License Expiry Date"
          type="date"
          value={formData?.licenseExpiry}
          onChange={(e) => handleInputChange('licenseExpiry', e?.target?.value)}
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Certifications & Awards
        </label>
        <textarea
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          rows={4}
          placeholder="Board certifications, awards, recognitions..."
          value={formData?.certifications?.join('\n')}
          onChange={(e) => handleInputChange('certifications', e?.target?.value?.split('\n')?.filter(cert => cert?.trim()))}
          disabled={!isEditing}
        />
      </div>

      <div className="bg-success/10 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-success mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-2">Compliance Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Medical License</span>
                <span className="text-success font-medium">Valid</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Background Check</span>
                <span className="text-success font-medium">Cleared</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Malpractice Insurance</span>
                <span className="text-success font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!doctor && !isEditing) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <Icon name="UserCog" size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Select a Doctor
          </h3>
          <p className="text-muted-foreground mb-6">
            Choose a doctor from the list to view or edit their profile
          </p>
          <Button variant="outline" onClick={() => onToggleEdit(true)}>
            Add New Doctor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {doctor && (
              <Image
                src={doctor?.avatar}
                alt={doctor?.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {isEditing && !doctor ? 'Add New Doctor' : doctor?.name || 'Doctor Profile'}
              </h2>
              {doctor && (
                <p className="text-muted-foreground">
                  {doctor?.credentials} • {doctor?.specialization?.join(', ')}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  iconName="Edit"
                  iconPosition="left"
                  onClick={() => onToggleEdit(true)}
                >
                  Edit Profile
                </Button>
                {doctor && (
                  <Button
                    variant="destructive"
                    iconName="Trash2"
                    iconPosition="left"
                    onClick={() => onDelete(doctor?.id)}
                  >
                    Delete
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  iconName="Save"
                  iconPosition="left"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-6">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'basic' && renderBasicInfo()}
        {activeTab === 'professional' && renderProfessionalInfo()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'credentials' && renderCredentials()}
      </div>
    </div>
  );
};

export default DoctorProfileEditor;