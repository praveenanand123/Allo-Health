import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PatientSearchBar = ({ onPatientSelect, recentPatients = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock patient database for type-ahead search
  const mockPatients = [
    {
      id: 'P001',
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      dob: '1985-03-15',
      lastVisit: '2025-01-15',
      insurance: 'Blue Cross'
    },
    {
      id: 'P002',
      name: 'Michael Chen',
      phone: '(555) 234-5678',
      dob: '1978-11-22',
      lastVisit: '2025-01-10',
      insurance: 'Aetna'
    },
    {
      id: 'P003',
      name: 'Emily Rodriguez',
      phone: '(555) 345-6789',
      dob: '1992-07-08',
      lastVisit: '2025-01-08',
      insurance: 'United Healthcare'
    },
    {
      id: 'P004',
      name: 'David Thompson',
      phone: '(555) 456-7890',
      dob: '1965-12-03',
      lastVisit: '2025-01-05',
      insurance: 'Medicare'
    },
    {
      id: 'P005',
      name: 'Lisa Wang',
      phone: '(555) 567-8901',
      dob: '1988-09-18',
      lastVisit: '2025-01-03',
      insurance: 'Cigna'
    }
  ];

  useEffect(() => {
    if (searchQuery?.length >= 2) {
      const filtered = mockPatients?.filter(patient =>
        patient?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        patient?.phone?.includes(searchQuery) ||
        patient?.dob?.includes(searchQuery)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handlePatientSelect = (patient) => {
    setSearchQuery(patient?.name);
    setShowSuggestions(false);
    onPatientSelect(patient);
  };

  const handleNewPatient = () => {
    onPatientSelect(null);
    setSearchQuery('');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Search" size={20} className="mr-2 text-primary" />
          Patient Search
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewPatient}
          iconName="UserPlus"
          iconPosition="left"
        >
          New Patient
        </Button>
      </div>
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search by name, phone, or DOB..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="pr-10"
        />
        <Icon 
          name="Search" 
          size={18} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
        />

        {/* Type-ahead Suggestions */}
        {showSuggestions && suggestions?.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-medium z-50 max-h-60 overflow-y-auto">
            {suggestions?.map((patient) => (
              <button
                key={patient?.id}
                onClick={() => handlePatientSelect(patient)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-foreground">{patient?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {patient?.phone} • DOB: {new Date(patient.dob)?.toLocaleDateString()}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last visit: {new Date(patient.lastVisit)?.toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Recent Patients Quick Access */}
      {recentPatients?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Patients</h3>
          <div className="flex flex-wrap gap-2">
            {recentPatients?.slice(0, 5)?.map((patient) => (
              <Button
                key={patient?.id}
                variant="ghost"
                size="sm"
                onClick={() => handlePatientSelect(patient)}
                className="text-xs"
              >
                {patient?.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearchBar;