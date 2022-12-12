import React from 'react'
import SalesReport from './DashboardHome/SalesReport'
import Welcome from './DashboardHome/Welcome/Welcome'

function DashboardHome() {
  
  return (
    <div id="dashboard-view-container">

        <p><b>Welcome Home</b></p>
        <Welcome />

        <p><b>Sales Report</b></p>
        <SalesReport />
        

  

    </div>
  )
}

export default DashboardHome