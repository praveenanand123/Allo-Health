import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DoctorListPanel = ({ 
  doctors, 
  selectedDoctor, 
  onSelectDoctor, 
  onAddDoctor,
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange 
}) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const specializationOptions = [
    { value: 'all', label: 'All Specializations' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'endocrinology', label: 'Endocrinology' },
    { value: 'gastroenterology', label: 'Gastroenterology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'radiology', label: 'Radiology' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'main-clinic', label: 'Main Clinic' },
    { value: 'north-branch', label: 'North Branch' },
    { value: 'south-branch', label: 'South Branch' },
    { value: 'downtown', label: 'Downtown Center' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'busy', label: 'Busy' },
    { value: 'break', label: 'On Break' },
    { value: 'offline', label: 'Offline' }
  ];

  const filteredAndSortedDoctors = useMemo(() => {
    let filtered = doctors?.filter(doctor => {
      const matchesSearch = doctor?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           doctor?.specialization?.some(spec => spec?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
      const matchesSpecialization = filters?.specialization === 'all' || 
                                   doctor?.specialization?.includes(filters?.specialization);
      const matchesLocation = filters?.location === 'all' || doctor?.location === filters?.location;
      const matchesStatus = filters?.status === 'all' || doctor?.status === filters?.status;

      return matchesSearch && matchesSpecialization && matchesLocation && matchesStatus;
    });

    filtered?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];

      if (sortBy === 'specialization') {
        aValue = a?.specialization?.join(', ');
        bValue = b?.specialization?.join(', ');
      }

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [doctors, searchTerm, filters, sortBy, sortOrder]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-success';
      case 'busy': return 'text-warning';
      case 'break': return 'text-secondary';
      case 'offline': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success/10';
      case 'busy': return 'bg-warning/10';
      case 'break': return 'bg-secondary/10';
      case 'offline': return 'bg-error/10';
      default: return 'bg-muted/10';
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Doctor Directory</h2>
          <Button
            variant="default"
            size="sm"
            iconName="UserPlus"
            iconPosition="left"
            onClick={onAddDoctor}
          >
            Add Doctor
          </Button>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Search doctors by name or specialization..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="mb-4"
        />

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3">
          <Select
            placeholder="Filter by specialization"
            options={specializationOptions}
            value={filters?.specialization}
            onChange={(value) => onFilterChange('specialization', value)}
          />
          
          <Select
            placeholder="Filter by location"
            options={locationOptions}
            value={filters?.location}
            onChange={(value) => onFilterChange('location', value)}
          />
          
          <Select
            placeholder="Filter by status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => onFilterChange('status', value)}
          />
        </div>
      </div>
      {/* Sort Controls */}
      <div className="px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-muted-foreground">Sort by:</span>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => handleSort('name')}
            className={sortBy === 'name' ? 'text-primary' : ''}
          >
            Name
            {sortBy === 'name' && (
              <Icon 
                name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                size={14} 
                className="ml-1" 
              />
            )}
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => handleSort('specialization')}
            className={sortBy === 'specialization' ? 'text-primary' : ''}
          >
            Specialization
            {sortBy === 'specialization' && (
              <Icon 
                name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                size={14} 
                className="ml-1" 
              />
            )}
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => handleSort('status')}
            className={sortBy === 'status' ? 'text-primary' : ''}
          >
            Status
            {sortBy === 'status' && (
              <Icon 
                name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                size={14} 
                className="ml-1" 
              />
            )}
          </Button>
        </div>
      </div>
      {/* Doctor List */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedDoctors?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="UserX" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No doctors found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button variant="outline" onClick={onAddDoctor}>
              Add First Doctor
            </Button>
          </div>
        ) : (
          <div className="p-2">
            {filteredAndSortedDoctors?.map((doctor) => (
              <div
                key={doctor?.id}
                onClick={() => onSelectDoctor(doctor)}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-soft mb-2 ${
                  selectedDoctor?.id === doctor?.id
                    ? 'border-primary bg-primary/5 shadow-soft'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <Image
                      src={doctor?.avatar}
                      alt={doctor?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusBgColor(doctor?.status)}`}>
                      <div className={`w-2 h-2 rounded-full mx-auto mt-0.5 ${getStatusColor(doctor?.status)}`} 
                           style={{ backgroundColor: 'currentColor' }} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-foreground truncate">
                          {doctor?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {doctor?.credentials}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {doctor?.isOnline && (
                          <div className="w-2 h-2 bg-success rounded-full" title="Online" />
                        )}
                        {doctor?.hasEmergency && (
                          <Icon name="AlertTriangle" size={14} className="text-error" title="Emergency" />
                        )}
                      </div>
                    </div>

                    <div className="mt-2 space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {doctor?.specialization?.slice(0, 2)?.map((spec, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                          >
                            {spec}
                          </span>
                        ))}
                        {doctor?.specialization?.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                            +{doctor?.specialization?.length - 2}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Icon name="MapPin" size={12} />
                          <span>{doctor?.locationName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Users" size={12} />
                          <span>{doctor?.currentPatients} patients</span>
                        </div>
                      </div>

                      <div className={`text-xs font-medium ${getStatusColor(doctor?.status)}`}>
                        {doctor?.status === 'available' && 'Available'}
                        {doctor?.status === 'busy' && `Busy - Next available: ${doctor?.nextAvailable}`}
                        {doctor?.status === 'break' && `On Break - Back: ${doctor?.backAt}`}
                        {doctor?.status === 'offline' && 'Offline'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">
              {filteredAndSortedDoctors?.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {filteredAndSortedDoctors?.length === 1 ? 'Doctor' : 'Doctors'}
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">
              {filteredAndSortedDoctors?.filter(d => d?.status === 'available')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorListPanel;