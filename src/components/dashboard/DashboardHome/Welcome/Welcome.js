import React from 'react'
import TotalCategory from './TotalCategory'
import TotalProducts from './TotalProducts'
import TotalSale from './TotalSale'
import './style/welcome.css'

function Welcome() {
  return (
    <div id="dashboardHome-welcome-container">
        <TotalCategory />
        <TotalProducts />
        <TotalSale />    
    </div>
  )
}

export default Welcome