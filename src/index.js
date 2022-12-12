import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Dashboard from './components/dashboard/Dashboard';
import Category from './components/dashboard/Category';
import Brand from './components/dashboard/Brand';
import Products from './components/dashboard/Products';
import POS from './components/dashboard/POS';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import DashboardHome from './components/dashboard/DashboardHome';
import { Provider } from 'react-redux';
import store from './redux/Store';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    
    children:[{
      path:'',
      element:<DashboardHome />
    },{
      path:'*',
      element:<DashboardHome />
    },{
      path: 'home',
      element: <DashboardHome />,
      
    },{
      path: 'category',
      element: <Category />
    },{
      path: 'brand',
      element: <Brand />
    },{
      path: 'products',
      element: <Products />
    },{
      path: 'pos',
      element: <POS />
    }]
  },{
    path: '*',
    element: <Dashboard />
  }
  
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <Provider store={store} > 

    <RouterProvider router={router}/>
    
  
  </Provider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

