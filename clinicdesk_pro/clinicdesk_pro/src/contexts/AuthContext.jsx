import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import * as authService from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const session = await authService?.getSession();
        if (session?.user) {
          setUser(session?.user);
          const profile = await authService?.getUserProfile(session?.user?.id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes (NON-ASYNC callback)
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setAuthError(null);
        
        if (session?.user) {
          // Fire-and-forget profile fetch
          authService?.getUserProfile(session?.user?.id)?.then(profile => setUserProfile(profile))?.catch(error => console.error('Error fetching profile:', error));
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setAuthError(null);
      setLoading(true);
      const { user } = await authService?.signIn(email, password);
      return user;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
        return null;
      }
      setAuthError(error?.message || 'Sign in failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setAuthError(null);
      setLoading(true);
      const { user } = await authService?.signUp(email, password, userData);
      return user;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
        return null;
      }
      setAuthError(error?.message || 'Sign up failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setAuthError(null);
      await authService?.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      setAuthError(error?.message || 'Sign out failed');
    }
  };

  const updateProfile = async (updates) => {
    try {
      setAuthError(null);
      if (!user?.id) return null;
      
      const updatedProfile = await authService?.updateUserProfile(user?.id, updates);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      setAuthError(error?.message || 'Profile update failed');
      return null;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: userProfile?.role === 'admin',
    isFrontDeskStaff: userProfile?.role === 'front_desk_staff' || userProfile?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};