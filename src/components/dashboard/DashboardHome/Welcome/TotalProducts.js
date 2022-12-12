import React, { useEffect } from 'react';
import { useState } from 'react';


import './style/totalproduct.css';


import {db} from './../../../../Firebase';
import { collection, getDocs } from 'firebase/firestore';

import icon from './icon/totalproduct.png';

function TotalProducts() {

  const [totalproduct, settotalproduct] = useState(0);

  const getProducts = async () => {

    try {
       
      var table_data = [];
      const querySnapshot = await getDocs(collection(db, "products"));
      //console.log(querySnapshot);
      querySnapshot.forEach((doc)=>{
        //console.log(doc.id, doc.data());
        table_data.push({id: doc.id, data: doc.data()})
      });

      //console.log("table inside:",table_data);
      
      settotalproduct(table_data.length); 
      
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
    <div id="home-welcome-totalcatergory-container">
        <div id="home-welcome-totalcatergory-section1">
          
          <div id="home-welcome-totalcatergory-text">
            <p>{totalproduct}</p>
          </div>
          
          <div id="home-welcome-totalcatergory-icon">
            <img src={icon}></img>
          </div>
          
        </div >

        <div id="home-welcome-totalcatergory-section2">
          <p>Total Products</p>
        </div>
        
        
    </div>
  )
}

export default TotalProducts