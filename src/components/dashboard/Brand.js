import { Button, Modal } from '@mui/material'
import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../Firebase';
import './style/Brand.css';

import { getDoc, updateDoc, doc, deleteDoc, orderBy, limit, query } from "firebase/firestore"; 


function Brand() {
  
  const [brand_id, setBrand_ID] = useState(1);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('active');
  const [table, setTable] = useState([]);

  const [open, setOpen] = useState(false);
  const [modify_id, setModifyId] = useState('');
  const [docData, setDocData] = useState({b_name:'',b_status: ''});

  const [modalBrandName, setModalBrandName] = useState('');
  const [modalStatus, setModalStatus] = useState('');
  

  const getBrand = async () => {

    try {
       
      var table_data = [];
      const querySnapshot = await getDocs(collection(db, "brand"));
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

  const addBrand = async () =>{
    console.log(name, status);
    //var cat_id = getLastCategoryID()+1;
    
    // make sure the name has some value in it.
    if(name !== ''){

      try {
        const docRef = await addDoc(collection(db, "brand"), {
        
        
        b_name : name,
        b_status: status
       
        });


        console.log("Document written with ID: ", docRef.id);
        
        getBrand();
        
        //dispatch(add());
        
        } catch (e) {
            console.error("Error adding document: ", e);
        }


    }
  }

  const BrandName = (e) => {
        
    setName(e.target.value);

  }

  const ModalBrandName = (e) => {
        
    setModalBrandName(e.target.value);

  }

  const getDocWithId = async (doc_id)=>{

    try{

      const docRef = doc(db, "brand",doc_id);
    
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        
        console.log("Document data for id: ",doc_id, " is ", docSnap.data());
        setDocData(docSnap.data());
        setModalBrandName(docSnap.data().b_name);
        setModalStatus(docSnap.data().b_status);

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }


    }catch(e){
      console.log("getDocWithId: ", e);
    }
    

  }


  const modifyBrand = async (id)=>{

    console.log("modify: ", id);
    setOpen(true);
    setModifyId(id);
    getDocWithId(id);
  }

  const deleteBrand = async (id)=>{
    console.log("deleted: ", id);

    await deleteDoc(doc(db, "brand", id));

    /* reprint the new category table*/ 
    getBrand();
  }

  const modifyDocWithId = async (doc_id, mb_name, mb_status) =>{

    console.log("modify the doc with id: ", doc_id);

    try {
      
      const docRef = doc(db, "brand", doc_id);

      await updateDoc(docRef, {
        b_name: mb_name,
        b_status: mb_status
      });

      getBrand();
      setOpen(false);

    } catch (error) {
      console.log("modifyDocWithId: ", error);
    }
  
  } 

  
  useEffect(()=>{

    getBrand();
    //console.log("table:",table);
    //getLastCategoryID();

  },[]); 

  return (
    <div id="brand-container">
      
      <div id="brand-window">
          
          <div id="brand-add-section">

              <fieldset className="brand-add-section-fieldset">
                <legend><b>Add a New Brand</b></legend>

                <label className="brand-add-section-label" >Name</label>
            
                <input type="text" value={name} placeholder='Brand Name...' onChange={BrandName} />

                <label className="brand-add-section-label" >Status</label>
                
                <select value={status} onChange={(e)=>{setStatus(e.target.value)}}>
                 
                  <option value="active">Active</option>
                  <option value="stopped">Stopped</option>
                
                </select>
                
                <Button variant="outlined" sx={{mx:2}} onClick={addBrand} >Add</Button>

              </fieldset>
              
           
          </div>

          <div id="brand-view-section">

            <label className="brand-add-section-label" ><b>List of Brand</b></label>  

            <table id="brand-view-section-table">
              
              <thead id="brand-view-section-table-thead">
                <tr>
                  
                  <th>Brand Name</th>
                  <th>Active Status</th>
                  <th>Options</th>
                
                </tr>
              </thead>
              
              <tbody id="brand-view-section-table-tbody">
              
              {
           
              table.map((doc)=>{
                  return(
                  <tr key={doc.id}> 
                    
                    <td>{doc.data.b_name}</td>
                    <td>{doc.data.b_status}</td>   
                    <td>
                      <Button variant="contained" color="success" size={"small"} sx={{mx:1}} onClick={()=>{ modifyBrand(doc.id)} }  >Modify</Button>
                      <Button variant="contained" color="error" size={"small"} sx={{mx:1}} onClick={()=>{ deleteBrand(doc.id)} } >Delete</Button>
                    </td>
                  
                  </tr>
                  )
              })    
           
              }

              </tbody>

          </table>

          <Modal
              open={open}
              onClose={()=>setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              
              <div id="modal-container">
                
                <div id="model-window">
                  
                  <div>
                    <label className="brand-add-section-label" >Name</label>
                    
                    <input type="text" id="brandname" value={modalBrandName} placeholder='Brand Name...' onChange={ModalBrandName}  />

                  </div>

                  <div>
                    <label className="brand-add-section-label" >Status</label>
                    
                    <select value={modalStatus} onChange = {(e)=>{setModalStatus(e.target.value)}} >
                    
                      <option value="active">Active</option>
                      <option value="stopped">Stopped</option>
                    
                    </select>
                    
                  </div> 
                  
                  <Button variant="contained" color={"success"} sx={{mx:2}} onClick={()=>{modifyDocWithId(modify_id, modalBrandName, modalStatus)}}  >Modify</Button>

                  <p>Modify id is {modify_id}</p>

                </div>

              </div>
            
            </Modal>      


          </div>


      </div>

    </div>
  
  )
}

export default Brand