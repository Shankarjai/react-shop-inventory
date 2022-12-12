import React, { useEffect } from 'react';
import { useState } from 'react';


import './style/totalsales.css';


import {db} from './../../../../Firebase';
import { collection, getDocs } from 'firebase/firestore';

import icon from './icon/totalsales.png';

function TotalSale() {

  const [totalsale, settotalsale] = useState([]);

  const getProducts = async () => {

    try {
       
      var table_data = [];
      const querySnapshot = await getDocs(collection(db, "pos"));
      //console.log(querySnapshot);
      
      querySnapshot.forEach((doc)=>{
        //console.log(doc.id, doc.data());
        table_data.push({id: doc.id, data: doc.data()})
      });

      //console.log("table inside:",table_data);
      
      settotalsale(table_data); 
      
      /*querySnapshot.forEach((doc) => {
      
          console.log(doc.id,"=>",doc.data());
          setTable({id:doc.id, ...doc.data()});
          
      
      });*/
      
    } catch (e) {
        console.error("Error getting document: ", e);
    }

  }

  useEffect(()=>{

    getProducts();

  },[]);

  return (
    <div id="home-welcome-totalsale-container">
        <div id="home-welcome-totalsale-section1">
          
          <div id="home-welcome-totalsale-icon">
            <img src={icon}></img>
          </div>

          <div id="home-welcome-totalsale-text">
            
            <p> +{totalsale.reduce((old, newData)=> old+newData.data.total, 0)}</p>
          </div>

        </div >

        <div id="home-welcome-totalsale-section2">
          <p>Total Sales</p>
        </div>
        
        
    </div>
  )
}

export default TotalSale