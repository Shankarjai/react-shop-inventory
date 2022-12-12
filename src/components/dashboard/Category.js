import { Button, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react'
import './style/Category.css';

import {db} from '../../Firebase';
import { collection, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc, orderBy, limit, query } from "firebase/firestore"; 

// redux imports 
import { useDispatch, useSelector } from 'react-redux';
import lastIdReducer from '../../redux/Reducer';
import {add} from '../../redux/Reducer';
import { Box } from '@mui/system';
import { async } from '@firebase/util';



function Category() {

  const [category_id, setCategory_ID] = useState(1);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('active');
  const [table, setTable] = useState([]);

  /* modal * */
  const [open, setOpen] = useState(false);
  const [modify_id, setModifyId] = useState('');
  const [docData, setDocData] = useState({c_name:'',c_status: ''});

  const [modalCategoryName, setModalCategoryName] = useState('');
  const [modalStatus, setModalStatus] = useState('');
  

  /** redux code */

  const lastCatgoryId = useSelector(state => state.lastId.value);
  const dispatch = useDispatch();

  /* redux code end*/ 

  const getLastCategoryID = async ()=>{

    try {
       
      var last_id = undefined;
      
      const q  = query(collection(db, "category"),orderBy("c_id","desc"),limit(1));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);
      querySnapshot.forEach((doc)=>{
        console.log("glcID: ",doc.id, doc.data().c_id);
        //setCategory_ID(doc.data().c_id + 1);
        //lastCatgoryId = Number(doc.data().c_id);
      });

      console.log("lastcategoryId: ",lastCatgoryId);
      
     
      
      /*querySnapshot.forEach((doc) => {
      
          console.log(doc.id,"=>",doc.data());
          setTable({id:doc.id, ...doc.data()});
          
      
      });*/
      
    } catch (e) {
        console.error("Error getting document: ", e);
    }


  }

  const CategoryName = (e) => {
        
        setName(e.target.value);

  }

  const ModalCategoryName = (e) => {
        
    setModalCategoryName(e.target.value);

  }

  const addCategory = async () =>{
    console.log(name, status);
    //var cat_id = getLastCategoryID()+1;
    
    // make sure the name has some value in it.
    if(name !== ''){

      try {
        const docRef = await addDoc(collection(db, "category"), {
        
        
        c_name : name,
        c_status: status
       
        });


        console.log("Document written with ID: ", docRef.id);
        
        getCategory();
        
        //dispatch(add());
        
        } catch (e) {
            console.error("Error adding document: ", e);
        }


    }
    
    
  }

  const deleteCategory = async (id)=>{
    console.log("deleted: ", id);

    await deleteDoc(doc(db, "category", id));

    /* reprint the new category table*/ 
    getCategory();

  }

  const modifyCategory = async (id)=>{

    console.log("modify: ", id);
    setOpen(true);
    setModifyId(id);
    getDocWithId(id);
    

  }

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
      setTable(table_data)
     
      
      /*querySnapshot.forEach((doc) => {
      
          console.log(doc.id,"=>",doc.data());
          setTable({id:doc.id, ...doc.data()});
          
      
      });*/
      
    } catch (e) {
        console.error("Error getting document: ", e);
    }

  }

  const getDocWithId = async (doc_id)=>{

    try{

      const docRef = doc(db, "category",doc_id);
    
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        
        console.log("Document data for id: ",doc_id, " is ", docSnap.data());
        setDocData(docSnap.data());
        setModalCategoryName(docSnap.data().c_name);
        setModalStatus(docSnap.data().c_status);

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }


    }catch(e){
      console.log("getDocWithId: ", e);
    }
    

  }

  const modifyDocWithId = async (doc_id, mc_name, mc_status) =>{

    console.log("modify the doc with id: ", doc_id);

    try {
      
      const docRef = doc(db, "category", doc_id);

      await updateDoc(docRef, {
        c_name: mc_name,
        c_status: mc_status
      });

      getCategory();
      setOpen(false);

    } catch (error) {
      console.log("modifyDocWithId: ", error);
    }
    

    
  
  } 

  useEffect(()=>{

    getCategory();
    //console.log("table:",table);
    //getLastCategoryID();

  },[]); 

  return (
    
    <div id="category-container">
      
      <div id="category-window">
          
          <div id="category-add-section">

              <fieldset className="category-add-section-fieldset">
                <legend><b>Add a New Category</b></legend>

                <label className="category-add-section-label" >Name</label>
            
                <input type="text" id="categoryname" value={name} placeholder='Category Name...' onChange={CategoryName}  />

                <label className="category-add-section-label" >Status</label>
                
                <select value={status} onChange = {(e)=>{setStatus(e.target.value)}} >
                 
                  <option value="active">Active</option>
                  <option value="stopped">Stopped</option>
                
                </select>
                
                <Button variant="outlined" sx={{mx:2}} onClick={addCategory} >Add</Button>

              </fieldset>
              
           
          </div>

          <div id="category-view-section">

            <label className="category-add-section-label" ><b>List of Category</b></label>  

            <table id="category-view-section-table">
              
              <thead id="category-view-section-table-thead">
                <tr>
                  
                  <th>Category Name</th>
                  <th>Active Status</th>
                  <th>Options</th>
                
                </tr>
              </thead>
              
              <tbody id="category-view-section-table-tbody">
              
              {
           
              table.map((doc)=>{
                  return(
                  <tr key={doc.id} > 
                    
                    <td>{doc.data.c_name} </td>
                    <td>{doc.data.c_status}</td>
                    <td>
                      <Button variant="contained" color="success" size={"small"} sx={{mx:1}} onClick={()=>{ modifyCategory(doc.id)} }  >Modify</Button>
                      <Button variant="contained" color="error" size={"small"} sx={{mx:1}} onClick={()=>{ deleteCategory(doc.id)} } >Delete</Button>
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
                    <label className="category-add-section-label" >Name</label>
                    
                    <input type="text" id="categoryname" value={modalCategoryName} placeholder='Category Name...' onChange={ModalCategoryName}  />

                  </div>

                  <div>
                    <label className="category-add-section-label" >Status</label>
                    
                    <select value={modalStatus} onChange = {(e)=>{setModalStatus(e.target.value)}} >
                    
                      <option value="active">Active</option>
                      <option value="stopped">Stopped</option>
                    
                    </select>
                    
                  </div> 
                  
                  <Button variant="contained" color={"success"} sx={{mx:2}} onClick={()=>{modifyDocWithId(modify_id, modalCategoryName, modalStatus)}}  >Modify</Button>

                  <p>Modify id is {modify_id}</p>

                </div>

              </div>
            
            </Modal>  
            


          </div>


      </div>

    </div>
  
  )
}

export default Category