import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const DoctorFilterSidebar = ({ doctors, selectedDoctors, onDoctorToggle, filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    availability: true,
    specialization: true,
    location: true
  });

  const specializations = [...new Set(doctors.map(doc => doc.specialization))];
  const locations = [...new Set(doctors.map(doc => doc.location))];

  const filteredDoctors = doctors?.filter(doctor => 
    doctor?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    doctor?.specialization?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success';
      case 'busy': return 'bg-warning';
      case 'unavailable': return 'bg-error';
      default: return 'bg-muted';
    }
  };

  const getAvailabilityCount = (status) => {
    return doctors?.filter(doc => doc?.availability === status)?.length;
  };

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">Doctor Filters</h2>
        <Input
          type="search"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="mb-4"
        />
        <div className="text-xs text-muted-foreground">
          {filteredDoctors?.length} of {doctors?.length} doctors
        </div>
      </div>
      {/* Filters */}
      <div className="flex-1 overflow-y-auto">
        {/* Availability Filter */}
        <div className="p-4 border-b border-border">
          <button
            onClick={() => toggleSection('availability')}
            className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3"
          >
            <span>Availability Status</span>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform ${expandedSections?.availability ? 'rotate-0' : '-rotate-90'}`}
            />
          </button>
          
          {expandedSections?.availability && (
            <div className="space-y-2">
              {['available', 'busy', 'unavailable']?.map(status => (
                <Checkbox
                  key={status}
                  label={
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(status)}`} />
                      <span className="capitalize">{status}</span>
                      <span className="text-xs text-muted-foreground">({getAvailabilityCount(status)})</span>
                    </div>
                  }
                  checked={filters?.availability?.includes(status)}
                  onChange={(e) => {
                    const newAvailability = e?.target?.checked
                      ? [...filters?.availability, status]
                      : filters?.availability?.filter(s => s !== status);
                    onFilterChange({ ...filters, availability: newAvailability });
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Specialization Filter */}
        <div className="p-4 border-b border-border">
          <button
            onClick={() => toggleSection('specialization')}
            className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3"
          >
            <span>Specialization</span>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform ${expandedSections?.specialization ? 'rotate-0' : '-rotate-90'}`}
            />
          </button>
          
          {expandedSections?.specialization && (
            <div className="space-y-2">
              {specializations?.map(spec => (
                <Checkbox
                  key={spec}
                  label={
                    <div className="flex items-center justify-between w-full">
                      <span>{spec}</span>
                      <span className="text-xs text-muted-foreground">
                        ({doctors?.filter(d => d?.specialization === spec)?.length})
                      </span>
                    </div>
                  }
                  checked={filters?.specialization?.includes(spec)}
                  onChange={(e) => {
                    const newSpec = e?.target?.checked
                      ? [...filters?.specialization, spec]
                      : filters?.specialization?.filter(s => s !== spec);
                    onFilterChange({ ...filters, specialization: newSpec });
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="p-4 border-b border-border">
          <button
            onClick={() => toggleSection('location')}
            className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3"
          >
            <span>Location</span>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform ${expandedSections?.location ? 'rotate-0' : '-rotate-90'}`}
            />
          </button>
          
          {expandedSections?.location && (
            <div className="space-y-2">
              {locations?.map(location => (
                <Checkbox
                  key={location}
                  label={
                    <div className="flex items-center justify-between w-full">
                      <span>{location}</span>
                      <span className="text-xs text-muted-foreground">
                        ({doctors?.filter(d => d?.location === location)?.length})
                      </span>
                    </div>
                  }
                  checked={filters?.location?.includes(location)}
                  onChange={(e) => {
                    const newLocation = e?.target?.checked
                      ? [...filters?.location, location]
                      : filters?.location?.filter(l => l !== location);
                    onFilterChange({ ...filters, location: newLocation });
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Doctor List */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Select Doctors</h3>
          <div className="space-y-2">
            {filteredDoctors?.map(doctor => (
              <div
                key={doctor?.id}
                className={`p-3 rounded-md border cursor-pointer transition-colors ${
                  selectedDoctors?.includes(doctor?.id)
                    ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                }`}
                onClick={() => onDoctorToggle(doctor?.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-primary" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${getAvailabilityColor(doctor?.availability)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{doctor?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{doctor?.specialization}</p>
                    <p className="text-xs text-muted-foreground">{doctor?.location}</p>
                  </div>
                  <Checkbox
                    checked={selectedDoctors?.includes(doctor?.id)}
                    onChange={() => onDoctorToggle(doctor?.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFilterChange({
            availability: [],
            specialization: [],
            location: []
          })}
          className="w-full"
        >
          Clear All Filters
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            const allDoctorIds = filteredDoctors?.map(d => d?.id);
            onDoctorToggle(allDoctorIds);
          }}
          className="w-full"
        >
          Select All Visible
        </Button>
      </div>
    </div>
  );
};

export default DoctorFilterSidebar;