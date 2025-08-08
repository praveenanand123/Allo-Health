import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserCheck, 
  Stethoscope,
  AlertTriangle,
  X,
  LogIn,
  UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated, userProfile } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "Queue Management", 
      path: "/queue-management",
      icon: Users
    },
    {
      label: "Emergency Queue",
      path: "/emergency-queue", 
      icon: AlertTriangle
    },
    {
      label: "Appointments",
      path: "/appointments",
      icon: Calendar
    },
    {
      label: "Patient Check-in",
      path: "/patient-checkin",
      icon: UserCheck
    },
    {
      label: "Doctor Management",
      path: "/doctors", 
      icon: Stethoscope
    }
  ];

  const authItems = [
    {
      label: "Sign In",
      path: "/login",
      icon: LogIn
    },
    {
      label: "Sign Up", 
      path: "/signup",
      icon: UserPlus
    }
  ];

  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/") return true;
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">Clinic</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {isAuthenticated && userProfile && (
          <div className="p-4 bg-blue-50 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.full_name || 'User'}
                </p>
                <p className="text-xs text-blue-600 capitalize">
                  {userProfile?.role?.replace('_', ' ') || 'Staff'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Preview Mode Notice for non-authenticated users */}
        {!isAuthenticated && (
          <div className="p-4 bg-yellow-50 border-b border-gray-200">
            <div className="text-sm">
              <p className="font-semibold text-yellow-800 mb-1">Preview Mode</p>
              <p className="text-yellow-700">
                Exploring the clinic system features. Sign in for full access.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {/* Main Menu */}
          <div className="space-y-2 mb-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main Menu
            </h3>
            {menuItems?.map((item) => {
              const Icon = item?.icon;
              return (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => onClose?.()}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive(item?.path)
                      ? 'bg-blue-100 text-blue-700' :'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item?.label}</span>
                  {!isAuthenticated && (
                    <span className="ml-auto px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      Preview
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Authentication Menu (only show if not authenticated) */}
          {!isAuthenticated && (
            <div className="space-y-2">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Account
              </h3>
              {authItems?.map((item) => {
                const Icon = item?.icon;
                return (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={() => onClose?.()}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive(item?.path)
                        ? 'bg-green-100 text-green-700' :'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item?.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Clinic Front Desk System v1.0
          </p>
          {!isAuthenticated && (
            <p className="text-xs text-yellow-600 text-center mt-1">
              Running in preview mode
            </p>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;