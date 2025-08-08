import { supabase } from '../lib/supabase';

// Get all appointments
export const getAppointments = async () => {
  try {
    const { data, error } = await supabase?.from('appointments')?.select(`
        *,
        patients!inner(id, full_name, phone),
        doctors!inner(id, full_name, specialization),
        user_profiles!left(id, full_name)
      `)?.order('appointment_date', { ascending: true })?.order('appointment_time', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

// Get appointments by date
export const getAppointmentsByDate = async (date) => {
  try {
    const { data, error } = await supabase?.from('appointments')?.select(`
        *,
        patients!inner(id, full_name, phone),
        doctors!inner(id, full_name, specialization)
      `)?.eq('appointment_date', date)?.order('appointment_time', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching appointments by date:', error);
    return [];
  }
};

// Get appointments by doctor and date
export const getAppointmentsByDoctorAndDate = async (doctorId, date) => {
  try {
    const { data, error } = await supabase?.from('appointments')?.select(`
        *,
        patients!inner(id, full_name, phone)
      `)?.eq('doctor_id', doctorId)?.eq('appointment_date', date)?.order('appointment_time', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching appointments by doctor and date:', error);
    return [];
  }
};

// Create new appointment
export const createAppointment = async (appointmentData, createdBy) => {
  try {
    const { data, error } = await supabase?.from('appointments')?.insert([{
        ...appointmentData,
        created_by: createdBy
      }])?.select(`
        *,
        patients!inner(id, full_name, phone),
        doctors!inner(id, full_name, specialization)
      `)?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Update appointment
export const updateAppointment = async (id, updates) => {
  try {
    const { data, error } = await supabase?.from('appointments')?.update(updates)?.eq('id', id)?.select(`
        *,
        patients!inner(id, full_name, phone),
        doctors!inner(id, full_name, specialization)
      `)?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

// Cancel appointment
export const cancelAppointment = async (id, reason = '') => {
  try {
    const { data, error } = await supabase?.from('appointments')?.update({
        status: 'cancelled',
        notes: reason
      })?.eq('id', id)?.select(`
        *,
        patients!inner(id, full_name, phone),
        doctors!inner(id, full_name, specialization)
      `)?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

// Delete appointment
export const deleteAppointment = async (id) => {
  try {
    const { error } = await supabase?.from('appointments')?.delete()?.eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

// Get upcoming appointments
export const getUpcomingAppointments = async (days = 7) => {
  try {
    const today = new Date()?.toISOString()?.split('T')?.[0];
    const futureDate = new Date();
    futureDate?.setDate(futureDate?.getDate() + days);
    const futureDateStr = futureDate?.toISOString()?.split('T')?.[0];

    const { data, error } = await supabase?.from('appointments')?.select(`
        *,
        patients!inner(id, full_name, phone),
        doctors!inner(id, full_name, specialization)
      `)?.gte('appointment_date', today)?.lte('appointment_date', futureDateStr)?.in('status', ['booked', 'confirmed'])?.order('appointment_date', { ascending: true })?.order('appointment_time', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return [];
  }
};

// Subscribe to appointment changes
export const subscribeToAppointments = (callback) => {
  const channel = supabase?.channel('appointments-changes')?.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'appointments',
      },
      callback
    )?.subscribe();

  return () => supabase?.removeChannel(channel);
};