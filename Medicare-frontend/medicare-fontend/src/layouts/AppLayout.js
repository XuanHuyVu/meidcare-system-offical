import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../style/Layout.css';
import Dashboard from '../features/coordinator/dashboard/Dashboard';
import DoctorList from '../features/coordinator/doctors/DoctorList';
import ServicesList from '../features/coordinator/services/ServicesList';
import WorkSchedulesList from '../features/coordinator/workschedules/WorkSchedulesList';
import AppointmentList from '../features/coordinator/appointments/AppointmentList';

function AppLayout() {
  const location = useLocation();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <Routes>
            <Route path="/*" element={<Dashboard />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/workschedules" element={<WorkSchedulesList />} />
            <Route path="/services" element={<ServicesList />} />
            <Route path="/appointments" element={<AppointmentList />} />
          </Routes>
        </div>
        {location.pathname !== '/' && <Footer />}
      </div>
    </div>
  );
}

export default AppLayout;
