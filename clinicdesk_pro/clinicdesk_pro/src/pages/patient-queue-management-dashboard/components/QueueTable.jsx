import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QueueTable = ({ patients, onStatusUpdate, onSelectPatient, selectedPatient, onReorderQueue }) => {
  const [sortField, setSortField] = useState('queueNumber');
  const [sortDirection, setSortDirection] = useState('asc');

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'bg-blue-100 text-blue-800';
      case 'with-doctor':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency':
        return 'text-error';
      case 'urgent':
        return 'text-warning';
      case 'normal':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTime = (date) => {
    return new Date(date)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatWaitTime = (arrivalTime) => {
    const now = new Date();
    const arrival = new Date(arrivalTime);
    const diffMinutes = Math.floor((now - arrival) / (1000 * 60));
    return `${diffMinutes} min`;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPatients = [...patients]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'arrivalTime') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleStatusChange = (patientId, newStatus) => {
    onStatusUpdate(patientId, newStatus);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Live Queue ({patients?.length})</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
          <Button variant="outline" size="sm" iconName="RefreshCw">
            Refresh
          </Button>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  <button
                    onClick={() => handleSort('queueNumber')}
                    className="flex items-center space-x-1 hover:text-foreground"
                  >
                    <span>Queue #</span>
                    <Icon name="ArrowUpDown" size={12} />
                  </button>
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  <button
                    onClick={() => handleSort('patientName')}
                    className="flex items-center space-x-1 hover:text-foreground"
                  >
                    <span>Patient Name</span>
                    <Icon name="ArrowUpDown" size={12} />
                  </button>
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  <button
                    onClick={() => handleSort('arrivalTime')}
                    className="flex items-center space-x-1 hover:text-foreground"
                  >
                    <span>Arrival Time</span>
                    <Icon name="ArrowUpDown" size={12} />
                  </button>
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Doctor</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Wait Time</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPatients?.map((patient, index) => (
                <tr
                  key={patient?.id}
                  className={`border-b border-border hover:bg-muted/30 cursor-pointer ${
                    selectedPatient?.id === patient?.id ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => onSelectPatient(patient)}
                >
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <span className={`font-mono font-medium ${getPriorityColor(patient?.priority)}`}>
                        {patient?.queueNumber}
                      </span>
                      {patient?.priority === 'emergency' && (
                        <Icon name="AlertTriangle" size={14} className="text-error" />
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-foreground">{patient?.patientName}</p>
                      <p className="text-xs text-muted-foreground">{patient?.phoneNumber}</p>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {formatTime(patient?.arrivalTime)}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient?.status)}`}>
                      {patient?.status?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-foreground">
                    {patient?.assignedDoctorName || 'Unassigned'}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {formatWaitTime(patient?.arrivalTime)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      {patient?.status === 'waiting' && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={(e) => {
                            e?.stopPropagation();
                            handleStatusChange(patient?.id, 'with-doctor');
                          }}
                          iconName="Play"
                        >
                          Start
                        </Button>
                      )}
                      {patient?.status === 'with-doctor' && (
                        <Button
                          variant="success"
                          size="xs"
                          onClick={(e) => {
                            e?.stopPropagation();
                            handleStatusChange(patient?.id, 'completed');
                          }}
                          iconName="Check"
                        >
                          Complete
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onSelectPatient(patient);
                        }}
                        iconName="MoreHorizontal"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {patients?.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No patients in queue</p>
            <p className="text-sm text-muted-foreground mt-1">Add patients using the form on the left</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueTable;