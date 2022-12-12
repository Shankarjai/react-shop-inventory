import { Button, FormControl, IconButton, InputLabel, Modal, Select } from '@mui/material'
import { addDoc, collection, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../Firebase';
import TextField from '@mui/material/TextField';
import './style/Pos.css'

import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { async } from '@firebase/util';



function POS() {

  const [selectedProduct, setselectedProduct] = useState('none');
  const [productDetail, setproductDetail ] = useState({id:'', name:'', price: 0});
  const [productList, setproductList] = useState([]);
  const [productQty, setproductQty] = useState(1);
  const [billId, setbillId] = useState('');
  const [productAdded, setproductAdded ] = useState({bill_id: '', products:[]});

  /** modal code */

  const [modalOpen, setmodalOpen] = useState(false);
  const [modify_id, setmodify_id] = useState(0);
  const [modifyQty, setmodifyQty] = useState(productQty);
  const [alreadyExist, setalreadyExist] = useState(false);

  /** modal for bill */
  const [billModal, setbillModal] = useState(false);

  /**  Bill id*/

  const [generate_bill_id, setgenerate_bill_id] = useState(0);

  
  var date_obj = new Date();
  var date = {day:date_obj.getDate(), month:date_obj.getMonth(), year:date_obj.getFullYear()}

  console.log("bill no:",generate_bill_id);

  const updateAnalyticData = async()=>{
    
  }

  const generateBillId = ()=>{

    setgenerate_bill_id(Date.now());

  }

  const getDocWithId = async (id)=>{
    
    try{

      const docRef = doc(db, "products",id);
    
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        
        console.log("updateInventoryProductQty Document data for id: ",id, " is ", docSnap.data());
        return docSnap;

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }


    }catch(e){
      console.log("updateInventoryProductQty get doc error: ", e);
    }

  }

  const modifyDocWithId = async(doc_id, oldQty, reduceQty)=>{
    console.log("update inventory qty modify the doc id: ", doc_id);

    try {
      
      const docRef = doc(db, "products", doc_id);

      await updateDoc(docRef, {
        qty: (oldQty - reduceQty)
      });


    } catch (error) {
      console.log("upadte inventory error modifyDocWithId: ", error);
    }
    
  }

  const updateInventoryProductQty = async (products)=>{
    console.log("update product inventory qty: ", products);

    /** get the data from DB */

    var updatedQty = 0;
    var db_data;

    products.map((data)=>{

      getDocWithId(data.id).
      then((result)=>{
        console.log("update inventory loop data: ",result.data());
        
        /* modify the data*/
        
        modifyDocWithId(data.id, result.data().qty, data.qty );
        
      });
      
      
      



    })

    

     

  }

  const checkForDuplicate = (id)=>{
    console.log("checkforduplicate id: ",id);
    var data = productAdded.products.filter(data => data.id === id)
    console.log(data, "length : ",data.length);
    if (data.length >= 1){
      console.log(id, " is already exist");
      setalreadyExist(true);
      return false;
    }else{
      console.log("no duplicate found");
      return true;
    }
  }

  const removeItem = (id)=>{
    console.log("remove item : ", id);
    var newData = productAdded.products.filter(data=>data.id !== id);
    console.log("new product data: ", newData);

    setproductAdded({bill_id: generate_bill_id, 
      products:newData}
    ) 

  }

  const getmodifyItemDetail = (id)=>{
    setmodalOpen(true);
    setmodify_id(id);

    var product = productAdded.products.filter((data)=>data.id === id);
    var qty = product[0].qty

    console.log("modify qty: ", qty);
    setmodifyQty(qty);


    console.log("modify item id: ",id);
  }

  const modifyItem = (id)=>{
    console.log("modify button press: ",id);
    var index = productAdded.products.findIndex((data)=>data.id === id);
    productAdded.products[index].qty = modifyQty;
    productAdded.products[index].total = productAdded.products[index].qty * productAdded.products[index].price; 

    setmodalOpen(false);
  }

  const newBill = async()=>{
    
    try {

      const docRef = await addDoc(collection(db, "pos"), {
        bill_id: generate_bill_id,
        products: [{
          id: selectedProduct,
          qty: productQty
        }]
      
    });
    
    console.log("Document written with ID: ", docRef.id);  
    
    setbillId(docRef.id);
    
    } catch (error) {
      console.log("newBill error: ", error);    
    }
  }

  const numberValidater = (e) => {
    
    //console.log(e.target.id);
    
    const re = /^[0-9\b.]+$/;

    // if value is not blank, then test the regex

    if (e.target.value !== ''){

      if(re.test(e.target.value)){
        //console.log("v:",e.target.value,"reg: ",re.test(e.target.value));

        switch(e.target.id){
          case 'qty':
            console.log("qty :", e.target.value )  
            setproductQty(e.target.value);
            break;
          case 'modal_qty':
            console.log("qty :", e.target.value )  
            setmodifyQty(e.target.value);
            break;
          default:
            break;  
          }
        
      }

    } 
  
  }
  
  const getDetail = async (product_id) => {
    
    try {
      
      const docRef = doc(db, "products",product_id);
    
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        
        console.log("Document data for id: ",product_id, " is ", docSnap.data());
        //setDocData(docSnap.data());
        //setModalCategoryName(docSnap.data().c_name);
        //setModalStatus(docSnap.data().c_status);
        
        setproductDetail({id:product_id, price: docSnap.data().retail_price, name:docSnap.data().name});



      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }

    } catch (error) {
      console.log("getPrice error: ", error);    
    }
  
  }

  const addProduct = async () =>{

    

    try {
    
      /*const docRef = await addDoc(collection(db, "pos"), {
        bill_id: generate_bill_id,
        products: [{
          id: selectedProduct,
          qty: productQty
        }]
      
    });
    
    console.log("Document written with ID: ", docRef.id);*/
    getDetail(selectedProduct);

    console.log("true of false: ",checkForDuplicate(productDetail.id));
    
    if( checkForDuplicate(productDetail.id)  ){
      
      setproductAdded({bill_id: generate_bill_id, 
        products:[...productAdded.products,{
          id:selectedProduct, 
          name: productDetail.name,
          qty:productQty, 
          price:productDetail.price,
          total: productQty * productDetail.price
        }]}
        )
  
      //console.log(productAdded);
    
    }

      
    
    } catch (error) {
      
      console.error("Error adding document: ", error);
    }


    
    
  } 


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
      setproductList(table_data);
     
      
      /*querySnapshot.forEach((doc) => {
      
          console.log(doc.id,"=>",doc.data());
          setTable({id:doc.id, ...doc.data()});
          
      
      });*/
      
    } catch (e) {
        console.error("Error getting document: ", e);
    }

  }

  const pay = async() =>{
    
    if(productAdded.products.length !== 0){

      

      try {


        const docRef = await addDoc(collection(db, "pos"), {
          bill_id: generate_bill_id,
          products: productAdded.products,
          total: productAdded.products.reduce((old,newObj)=>old+ newObj.total, 0)
        
        });
      
        console.log("Document written with ID: ", docRef.id);
  
        setbillModal(true);
  
        updateInventoryProductQty(productAdded.products);
  
      } catch (error) {
        
        console.log("pay error: ", error);
      }


    }else{
      console.log("please add some product");
    }
  
    
    
  }

  useEffect(()=>{

    getProducts();
  
  },[])


  return (
    <div>
      {/*console.log(productList)*/}
      {/*console.log(selectedProduct)*/ console.log("productAdded: ",productAdded)}
      {console.log(productDetail)}
      
      <label className="pos-section-label" ><b>Point of Sales</b></label>

      <FormControl sx={{ m: 3, minWidth: 120,  flexDirection: 'row' }} >
        
        <InputLabel shrink={true} size={'small'}> Select Product </InputLabel>
      
        <Select 
        native 
        value={selectedProduct} 
        label = "Select Product"
        sx={{mx:1, minWidth: '200px'}}
        onChange={(e)=>{
          setselectedProduct(e.target.value); 
          getDetail(e.target.value);
          }
        
        }
        
        >
          <option value='none'>-- Not Selected --</option>
          {productList.map((doc)=>{
            return (<option key={doc.id} value={doc.id}>{doc.data.name}</option>)
          })}

        
        </Select>

        <TextField sx={{mx:1}} label="Qty" variant="outlined" id={'qty'} onChange={numberValidater} value={productQty}/>
        <Button variant="contained" sx={{mx:1} } onClick={addProduct} > Add </Button>  

        <TextField sx={{mx:1}} label="Bill ID" variant="outlined" id={'billId'} value={generate_bill_id} />
        <Button variant="contained" sx={{mx:1} } onClick={generateBillId} > Generate </Button>
      
      </FormControl>

      <div id="pos-table-container">
        
        <label className="pos-section-label" ><b>Items in cart</b></label>
        
        <table id="pos-product-view-table">
          <thead id="pos-product-view-table-thead">
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Options</th>
            </tr>

          </thead>

          <tbody id="pos-product-view-table-tbody">
            {productAdded.products.map((data)=>{
              return(
                <tr key={data.id}>
                  <td>{data.name}</td>
                  <td>{data.qty}</td>
                  <td>{data.price}</td>
                  <td>{data.total}</td>
                  <td>
                    <IconButton color="success" onClick={()=>{getmodifyItemDetail(data.id)}} >
                      <CreateOutlinedIcon />  
                    </IconButton> 
                    <IconButton color="error" onClick={()=>{removeItem(data.id)}}>
                      <HighlightOffOutlinedIcon />  
                    </IconButton>
                  </td>
                       
                </tr>);
            })} 
          </tbody>
          
          <tfoot id="pos-product-view-table-tfoot">
            <tr>
              <td>Product Added: {productAdded.products.length}</td>
              <td></td>
              <th>Total Sum</th>
              <td>{ productAdded.products.reduce((old,newObj)=>old+ newObj.total, 0)  }</td>
              <td>
                <Button variant="contained"  sx={{mx:2, my:2}} onClick={pay}> Pay </Button>
              </td>
            </tr>
          </tfoot>
        
        </table>

        
        
            <Modal
              open={modalOpen}
              onClose={()=>setmodalOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              
              <div id="modal-container">
                
                <div id="model-window">
                  
                  <div>
                    <label className="pos-modify-section-label" >Modify Qty</label>
                    <TextField sx={{mx:1}} label="Qty" variant="outlined" id={'modal_qty'} onChange={numberValidater} value={modifyQty}/>
                    
                  </div>

                  
                  
                  <Button variant="contained" color={"success"} sx={{mx:2, my:2}} onClick={()=>{modifyItem(modify_id)}}>Modify</Button>

                  <p>Modify id is {modify_id}</p>

                </div>

              </div>
            
            </Modal>  
            
            <Modal
              open={alreadyExist}
              onClose={()=>setalreadyExist(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              
              <div id="modal-container">
                
                <div id="model-window">
                  
                  <div>
                    <p>The Item is Already Added. Can't Add Two Same Item, Please Modify the Item Qty.</p>
                    <Button variant="contained" color={"success"} sx={{mx:2, my:2}} onClick={()=>{setalreadyExist(false)}}>OK</Button>

                  </div>

                </div>

              </div>
            
            </Modal>

            <Modal
              open={billModal}
              onClose={()=>setbillModal(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              
              <div id="modal-container">
                
                <div id="pos-bill-model-window">
                  
                
                    
                    <table id="bill-slip-table">
                      <thead>
                        <tr>
                          <th colSpan={4} >Date: {date.day}/{date.month}/{date.year}</th>
                  
                        </tr>
                        <tr>
                          <th>Bill ID: #{generate_bill_id}</th>
                        </tr>
                      </thead>

                      <tbody>
                        
                        {productAdded.products.map((data)=>{
                          return(
                          <tr key={data.id}>
                            <td>{data.name}</td>
                            <td>x</td>
                            <td>{data.qty}</td>
                            <td>{data.total}</td>
                          </tr>);
                        })}
                      </tbody>

                      <tfoot>
                        
                        <tr>
                          <td>Total </td>
                          <td></td>
                          <td></td>
                          <td>{ productAdded.products.reduce((old,newObj)=>old+ newObj.total, 0) }</td>
                        </tr>
                      </tfoot>

                    </table>
                  

                </div>

              </div>
            
            </Modal>  
        

        


      </div>
      

    </div>
  )
}

export default POS