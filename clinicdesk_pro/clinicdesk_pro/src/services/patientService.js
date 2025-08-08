import { supabase } from '../lib/supabase';

// Get all patients
export const getPatients = async () => {
  try {
    const { data, error } = await supabase?.from('patients')?.select('*')?.order('full_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
};

// Get patient by id
export const getPatient = async (id) => {
  try {
    const { data, error } = await supabase?.from('patients')?.select('*')?.eq('id', id)?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching patient:', error);
    return null;
  }
};

// Search patients by name or phone
export const searchPatients = async (searchTerm) => {
  try {
    const { data, error } = await supabase?.from('patients')?.select('*')?.or(`full_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)?.order('full_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching patients:', error);
    return [];
  }
};

// Create new patient
export const createPatient = async (patientData) => {
  try {
    const { data, error } = await supabase?.from('patients')?.insert([patientData])?.select()?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

// Update patient
export const updatePatient = async (id, updates) => {
  try {
    const { data, error } = await supabase?.from('patients')?.update(updates)?.eq('id', id)?.select()?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

// Delete patient
export const deletePatient = async (id) => {
  try {
    const { error } = await supabase?.from('patients')?.delete()?.eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};

// Get patient visit history
export const getPatientVisitHistory = async (patientId) => {
  try {
    const { data, error } = await supabase?.from('patient_visits')?.select(`
        *,
        doctors!inner(id, full_name, specialization)
      `)?.eq('patient_id', patientId)?.order('visit_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching patient visit history:', error);
    return [];
  }
};

// Subscribe to patient changes
export const subscribeToPatients = (callback) => {
  const channel = supabase?.channel('patients-changes')?.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'patients',
      },
      callback
    )?.subscribe();

  return () => supabase?.removeChannel(channel);
};
function patientService(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: patientService is not implemented yet.', args);
  return null;
}

export default patientService;