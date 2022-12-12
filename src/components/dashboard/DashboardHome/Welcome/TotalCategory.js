import React, { useEffect } from 'react';
import { useState } from 'react';
import './style/totalcategory.css';

import {db} from './../../../../Firebase';
import { collection, getDocs } from 'firebase/firestore';

import icon from './icon/totalcategory.png';

function TotalCategory() {
  
  const [totalcategory, settotalcategory] = useState(0);

  const getCategory = async () => {

    try {
       
      var table_data = [];
      const querySnapshot = await getDocs(collection(db, "category"));
      //console.log(querySnapshot);
      querySnapshot.forEach((doc)=>{
        //console.log(doc.id, doc.data());
        table_data.push({id: doc.id, data: doc.data()})
      });

      //console.log("table inside:",table_data);
      
      settotalcategory(table_data.length); 
      
      /*querySnapshot.forEach((doc) => {
      
          console.log(doc.id,"=>",doc.data());
          setTable({id:doc.id, ...doc.data()});
          
      
      });*/
      
    } catch (e) {
        console.error("Error getting document: ", e);
    }

  }

  useEffect(()=>{

    getCategory();

  },[]);


  return (
    <div id="home-welcome-totalcatergory-container">
        <div id="home-welcome-totalcatergory-section1">
          
          <div id="home-welcome-totalcatergory-text">
            <p>{totalcategory}</p>
          </div>

          <div id="home-welcome-totalcatergory-icon">
            <img src={icon}></img>
          </div>
          
        </div >

        <div id="home-welcome-totalcatergory-section2">
          <p>Total Category</p>
        </div>
        
        
    </div>
  )
}

export default TotalCategory