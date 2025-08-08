import React, { useState } from "react";
import { Plus, Search, User, Stethoscope } from "lucide-react";

export default function QuickAddPatient({ 
  patients = [], 
  doctors = [], 
  onAddToQueue, 
  isPreview = false 
}) {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [priority, setPriority] = useState(1);
  const [notes, setNotes] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');

  const filteredPatients = patients?.filter(patient =>
    patient?.full_name?.toLowerCase()?.includes(searchPatient?.toLowerCase() || '') ||
    patient?.phone?.includes(searchPatient || '')
  ) || [];

  const filteredDoctors = doctors?.filter(doctor =>
    doctor?.full_name?.toLowerCase()?.includes(searchDoctor?.toLowerCase() || '') ||
    doctor?.specialization?.toLowerCase()?.includes(searchDoctor?.toLowerCase() || '')
  ) || [];

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!selectedPatient || !selectedDoctor) {
      alert('Please select both patient and doctor');
      return;
    }

    onAddToQueue?.(selectedPatient, selectedDoctor, priority, notes);
    
    // Reset form
    setSelectedPatient('');
    setSelectedDoctor('');
    setPriority(1);
    setNotes('');
    setSearchPatient('');
    setSearchDoctor('');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Plus className="w-5 h-5 text-blue-600 mr-2" />
          Quick Add to Queue
        </h2>
        {isPreview && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
            Preview
          </span>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Select Patient
            </label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search patients by name or phone..."
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e?.target?.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose a patient...</option>
                {filteredPatients?.map(patient => (
                  <option key={patient?.id} value={patient?.id}>
                    {patient?.full_name} - {patient?.phone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Stethoscope className="w-4 h-4 inline mr-1" />
              Select Doctor
            </label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialty..."
                  value={searchDoctor}
                  onChange={(e) => setSearchDoctor(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e?.target?.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose a doctor...</option>
                {filteredDoctors?.map(doctor => (
                  <option key={doctor?.id} value={doctor?.id}>
                    {doctor?.full_name} - {doctor?.specialization?.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Priority Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(parseInt(e?.target?.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>Normal</option>
              <option value={2}>High</option>
              <option value={3}>Urgent</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Add any notes..."
              value={notes}
              onChange={(e) => setNotes(e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!selectedPatient || !selectedDoctor}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add to Queue
          </button>
        </div>
      </form>
      {/* Preview Mode Notice */}
      {isPreview && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Preview Mode:</strong> This form is functional. Sign in to add patients to the actual queue.
          </p>
        </div>
      )}
    </div>
  );
}