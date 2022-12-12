import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './style/Sidebar.css';
import logo from './../../logo.svg'

import DashboardHome from './DashboardHome';
import Category from './Category';
import Brand from './Brand';
import Products from './Products';
import POS from './POS';



function Sidebar() {
  return (
    <>
    
    <div id="sidebar-container">

            <img src={logo}></img>

            <div id="sidebar-menus-container">
              

              <div className="sidebar-menu">
                <NavLink className={({isActive})=> isActive? 'nav-active' : undefined} to={'Home'}>Home</NavLink>
              </div>

              <div className="sidebar-menu">
                
                <NavLink className={({isActive})=> isActive? 'nav-active' : undefined} to={'Category'}>Category</NavLink>
              </div>
              
              <div className="sidebar-menu">
                
                <NavLink className={({isActive})=> isActive? 'nav-active' : undefined} to={'Brand'}>Brand</NavLink>
              </div>
              
              <div className="sidebar-menu">
                
                <NavLink className={({isActive})=> isActive? 'nav-active' : undefined} to={'Products'}>Products</NavLink>
              </div>
              
              <div className="sidebar-menu">
                
                <NavLink className={({isActive})=> isActive? 'nav-active' : undefined} to={'POS'}>POS</NavLink>
              </div>
              
              
              
             
            </div>  
            

    </div>


    </>
  )
}

export default Sidebar