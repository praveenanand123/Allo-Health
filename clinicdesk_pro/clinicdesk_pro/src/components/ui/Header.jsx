import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function Header({ onMenuToggle }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, userProfile, signOut, isAuthenticated } = useAuth();
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef?.current && !profileRef?.current?.contains(event?.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center justify-between">
      {/* Left side - Menu and Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Clinic Front Desk System
          </h1>
          <p className="text-sm text-gray-500 hidden sm:block">
            Manage patients, appointments, and queue efficiently
          </p>
        </div>
      </div>
      {/* Right side - Notifications and Profile */}
      <div className="flex items-center space-x-4">
        {/* Preview Mode Badge */}
        {!isAuthenticated && (
          <div className="hidden sm:flex bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            Preview Mode
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Authentication Section */}
        {isAuthenticated ? (
          /* User Profile Dropdown */
          (<div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium">
                  {userProfile?.full_name || user?.email?.split('@')?.[0] || 'User'}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {userProfile?.role?.replace('_', ' ') || 'Staff'}
                </div>
              </div>
            </button>
            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    {userProfile?.full_name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email}
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Profile Settings</span>
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>)
        ) : (
          /* Login/Signup Buttons */
          (<div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>)
        )}
      </div>
    </header>
  );
}