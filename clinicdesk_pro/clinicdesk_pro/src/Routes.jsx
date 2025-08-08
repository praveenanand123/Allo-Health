import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";

import PatientQueueManagementDashboard from "./pages/patient-queue-management-dashboard";
import DailyOperationsDashboard from "./pages/daily-operations-dashboard";
import EmergencyQueueManagement from "./pages/emergency-queue-management";
import AppointmentSchedulingInterface from "./pages/appointment-scheduling-interface";
import PatientCheckInAndProgressTracking from "./pages/patient-check-in-and-progress-tracking";
import DoctorProfileManagement from "./pages/doctor-profile-management";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

function Routes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Authentication routes - directly accessible for Rocket platform preview */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Main application routes - directly accessible for preview */}
          <Route path="/" element={<DailyOperationsDashboard />} />
          <Route path="/dashboard" element={<DailyOperationsDashboard />} />
          <Route path="/queue-management" element={<PatientQueueManagementDashboard />} />
          <Route path="/emergency-queue" element={<EmergencyQueueManagement />} />
          <Route path="/appointments" element={<AppointmentSchedulingInterface />} />
          <Route path="/patient-checkin" element={<PatientCheckInAndProgressTracking />} />
          <Route path="/doctors" element={<DoctorProfileManagement />} />
          
          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default Routes;