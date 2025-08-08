import { supabase } from '../lib/supabase';

// Get today's queue
export const getTodayQueue = async () => {
  try {
    const today = new Date()?.toISOString()?.split('T')?.[0];
    const { data, error } = await supabase?.from('patient_queue')?.select(`
        *,
        patients!inner(id, full_name, phone),
        doctors!inner(id, full_name, specialization)
      `)?.gte('check_in_time', `${today}T00:00:00`)?.lte('check_in_time', `${today}T23:59:59`)?.order('queue_number', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching today queue:', error);
    return [];
  }
};

// Get queue by status
export const getQueueByStatus = async (status) => {
  try {
    const today = new Date()?.toISOString()?.split('T')?.[0];
    const { data, error } = await supabase?.from('patient_queue')?.select(`
        *,
        patients!inner(id, full_name, phone),
        doctors!inner(id, full_name, specialization)
      `)?.eq('status', status)?.gte('check_in_time', `${today}T00:00:00`)?.lte('check_in_time', `${today}T23:59:59`)?.order('queue_number', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching queue by status:', error);
    return [];
  }
};

// Get next queue number
export const getNextQueueNumber = async () => {
  try {
    const { data, error } = await supabase?.rpc('get_next_queue_number');

    if (error) throw error;
    return data || 1;
  } catch (error) {
    console.error('Error getting next queue number:', error);
    return 1;
  }
};

// Add patient to queue
export const addPatientToQueue = async (patientId, doctorId, priority = 1, notes = '', createdBy) => {
  try {
    const nextQueueNumber = await getNextQueueNumber();
    
    const { data, error } = await supabase?.from('patient_queue')?.insert([{
        patient_id: patientId,
        doctor_id: doctorId,
        queue_number: nextQueueNumber,
        priority_level: priority,
        notes,
        created_by: createdBy
      }])?.select(`
        *,
        patients!inner(id, full_name, phone),
        doctors!inner(id, full_name, specialization)
      `)?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding patient to queue:', error);
    throw error;
  }
};

// Update queue status
export const updateQueueStatus = async (id, status, additionalData = {}) => {
  try {
    const updateData = { status, ...additionalData };
    
    // Add timestamps based on status
    if (status === 'with_doctor') {
      updateData.called_time = new Date()?.toISOString();
    } else if (status === 'completed') {
      updateData.completed_time = new Date()?.toISOString();
    }

    const { data, error } = await supabase?.from('patient_queue')?.update(updateData)?.eq('id', id)?.select(`
        *,
        patients!inner(id, full_name, phone),
        doctors!inner(id, full_name, specialization)
      `)?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating queue status:', error);
    throw error;
  }
};

// Remove from queue
export const removeFromQueue = async (id) => {
  try {
    const { error } = await supabase?.from('patient_queue')?.delete()?.eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing from queue:', error);
    throw error;
  }
};

// Get queue statistics for today
export const getTodayQueueStats = async () => {
  try {
    const today = new Date()?.toISOString()?.split('T')?.[0];
    const { data, error } = await supabase?.from('patient_queue')?.select('status')?.gte('check_in_time', `${today}T00:00:00`)?.lte('check_in_time', `${today}T23:59:59`);

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      waiting: 0,
      with_doctor: 0,
      completed: 0,
      cancelled: 0
    };

    data?.forEach(item => {
      if (stats?.hasOwnProperty(item?.status)) {
        stats[item.status]++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching queue stats:', error);
    return { total: 0, waiting: 0, with_doctor: 0, completed: 0, cancelled: 0 };
  }
};

// Get queue by doctor
export const getQueueByDoctor = async (doctorId) => {
  try {
    const today = new Date()?.toISOString()?.split('T')?.[0];
    const { data, error } = await supabase?.from('patient_queue')?.select(`
        *,
        patients!inner(id, full_name, phone)
      `)?.eq('doctor_id', doctorId)?.gte('check_in_time', `${today}T00:00:00`)?.lte('check_in_time', `${today}T23:59:59`)?.order('queue_number', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching queue by doctor:', error);
    return [];
  }
};

// Subscribe to queue changes
export const subscribeToQueue = (callback) => {
  const channel = supabase?.channel('patient-queue-changes')?.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'patient_queue',
      },
      callback
    )?.subscribe();

  return () => supabase?.removeChannel(channel);
};
function queueService(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: queueService is not implemented yet.', args);
  return null;
}

export default queueService;