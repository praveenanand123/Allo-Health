import { supabase } from '../lib/supabase';

export const signUp = async (email, password, userData = {}) => {
  try {
    const { data, error } = await supabase?.auth?.signUp({
      email,
      password,
      options: {
        data: userData // This goes to raw_user_meta_data
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase?.auth?.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase?.auth?.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getSession = async () => {
  try {
    const { data, error } = await supabase?.auth?.getSession();
    if (error) throw error;
    return data?.session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
function authService(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: authService is not implemented yet.', args);
  return null;
}

export default authService;