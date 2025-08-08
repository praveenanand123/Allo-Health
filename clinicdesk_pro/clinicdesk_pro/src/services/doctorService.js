import { supabase } from '../lib/supabase';

// Get all doctors
export const getDoctors = async () => {
  try {
    const { data, error } = await supabase?.from('doctors')?.select('*')?.order('full_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};

// Get doctor by id
export const getDoctor = async (id) => {
  try {
    const { data, error } = await supabase?.from('doctors')?.select('*')?.eq('id', id)?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return null;
  }
};

// Create new doctor
export const createDoctor = async (doctorData) => {
  try {
    const { data, error } = await supabase?.from('doctors')?.insert([doctorData])?.select()?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

// Update doctor
export const updateDoctor = async (id, updates) => {
  try {
    const { data, error } = await supabase?.from('doctors')?.update(updates)?.eq('id', id)?.select()?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
};

// Delete doctor
export const deleteDoctor = async (id) => {
  try {
    const { error } = await supabase?.from('doctors')?.delete()?.eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
};

// Get doctors with availability filter
export const getAvailableDoctors = async () => {
  try {
    const { data, error } = await supabase?.from('doctors')?.select('*')?.eq('is_available', true)?.eq('availability_status', 'available')?.order('full_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching available doctors:', error);
    return [];
  }
};

// Get doctor availability
export const getDoctorAvailability = async (doctorId) => {
  try {
    const { data, error } = await supabase?.from('doctor_availability')?.select(`
        *,
        doctors!inner(id, full_name)
      `)?.eq('doctor_id', doctorId)?.eq('is_active', true)?.order('day_of_week', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    return [];
  }
};

// Create doctor availability
export const createDoctorAvailability = async (availabilityData) => {
  try {
    const { data, error } = await supabase?.from('doctor_availability')?.insert([availabilityData])?.select()?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating doctor availability:', error);
    throw error;
  }
};

// Update doctor availability status
export const updateDoctorAvailabilityStatus = async (doctorId, status) => {
  try {
    const { data, error } = await supabase?.from('doctors')?.update({ availability_status: status })?.eq('id', doctorId)?.select()?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating doctor availability status:', error);
    throw error;
  }
};

// Subscribe to doctor changes
export const subscribeToDoctors = (callback) => {
  const channel = supabase?.channel('doctors-changes')?.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'doctors',
      },
      callback
    )?.subscribe();

  return () => supabase?.removeChannel(channel);
};
function doctorService(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: doctorService is not implemented yet.', args);
  return null;
}

export default doctorService;