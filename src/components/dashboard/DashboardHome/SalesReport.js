import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import './style/salesreport.css';
import {db} from './../../../Firebase';



function SalesReport() {
  
  const [table, setTable] = useState([]);  

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
      setTable(table_data)
     
      
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

  },[])

  return (
    <div id="dashboardHome-salereport-container">
      
      <div id="dashboardHome-reminding-qty-container">

          <table id="dashboardHome-reminding-qty-table">
            <thead id="dashboardHome-reminding-qty-table-thead">
              <tr>
                <th>Product Name</th>
                <th>Remaining Qty</th>
              </tr>
            </thead>

            <tbody id="dashboardHome-reminding-qty-table-tbody">
              {table.map((obj)=>{

              return(
              <tr key={obj.id}>
                <td>{obj.data.name}</td>
                <td className="dashboardHome-reminding-qty-table-tbody-td-qty">{obj.data.qty}</td>
              </tr>)
              })}   
            </tbody>

          </table>
          

      </div>

      <div id="dashboardHome-topselling-qty-container">
        
      </div>

    </div>
  )
}

export default SalesReport