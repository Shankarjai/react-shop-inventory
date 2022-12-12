import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import Sidebar from './Sidebar';
import './style/Dashboard.css';






function Dashboard() {

  

  return (
    <>
      <div id="dashboard-container">
          
          <Sidebar />

          <div id="dashboard-view">
            
            <Outlet></Outlet>

          </div>

      </div>
    </>
  )
}

export default Dashboard