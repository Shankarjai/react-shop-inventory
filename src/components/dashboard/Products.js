import { Button, IconButton, Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React, { useEffect, useState } from 'react'
import './style/Products.css';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {db, storage} from '../../Firebase';
import { collection, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { async } from '@firebase/util';


function Products() {

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [status, setStatus] = useState('active');
  const [costPrice, setCostPrice] = useState(1);
  const [retailPrice, setRetailPrice] = useState(2);
  const [qty, setQty] = useState(1);
  const [barCode, setBarCode ] = useState(1);
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [imagepath, setImagePath] = useState('');
  const [imageUrl, setimageUrl] = useState('');
  
  const [table, setTable] = useState([]);

  /** modal */
  const [open, setOpen] = useState(false);
  const [productViewId, setProductViewId ] = useState('');
  const [productDetail, setProductDetail] = useState({});
  
  /** modal code end */

  /** modal for modifying product */

  const [modifyModalOpen, setmodifyModalOpen] = useState(false);
  const [modify_id, setModifyId] = useState('');
  

  /**
   * modify product variables
   */

  const [modifedName, setmodifedName] = useState('');
  const [modifedDesc, setmodifedDesc ] = useState('');
  const [modifedCategory, setmodifedCategory ]= useState('');
  const [modifedBrand, setmodifedBrand ]= useState('');
  const [modifedCostPrice, setmodifedCostPrice]= useState('');
  const [modifedRetailPrice, setmodifedRetailPrice]= useState('');
  const [modifedQty, setmodifedQty]= useState('');
  const [modifedBarCode, setmodifedBarCode]= useState('');
  const [modifedStatus, setmodifedStatus]= useState('');
  const [modifedImage, setmodifedImage] = useState('');
  

  /** modify prouct variables end */

  const[brandNames, setBrandNames] = useState([]);
  const[categoryNames, setCategoryNames] = useState([]);

  const generateImageId = ()=>{return `${Date.now()}.jpg`; }  
  
  const getImageUrl = async (image_id)=>{
    
    var url = '';
    try {
 
      const storage = getStorage();
      await getDownloadURL(ref(storage, 'product_images/'+image_id))
      .then((url_link)=>{
        console.log("url: ",url_link);
        setimageUrl(url_link);
        url = url_link;
      })

    } catch (error) {

      console.log("getImageURL error: ", error);

    }
    return url;
    
  }

  const addImage = async(image_name) =>{
      
    if(image === ''){
      return;
    }
    
    try {
    
      const storageRef = ref(storage, 'product_images/'+image_name);

        await uploadBytes(storageRef, image)
        .then((data) =>{
            console.log("uploaded",data);
          

      })

    } catch (error) {
      console.log("image upload error: ", error);
    }
    
    
  }

  const addProduct = async () => {

      var image_id = generateImageId();
      
      if(name !== ''){
        
        try {
        
          const docRef = await addDoc(collection(db, "products"), {
              bar_code : barCode,
              brand : brand,
              category : category,
              cost_price : costPrice,
              desc : desc,
              name : name,
              qty : qty,
              retail_price : retailPrice,
              status : status,
              image_path : image_id

            
          });
          console.log("Document written with ID: ", docRef.id);
          
          addImage(image_id);

        } catch (e) {
            console.error("Error adding document: ", e);
        }
  
  
      }

      getProducts();
      
      console.log("add product pressed");
  }

  const deleteProduct = async (id)=>{
      console.log("delete id : ",id);

      await deleteDoc(doc(db, "products", id));

      getProducts();
  }

  const numberValidater = (e) => {
    
    //console.log(e.target.id);
    
    const re = /^[0-9\b.]+$/;

    // if value is not blank, then test the regex

    if (e.target.value !== ''){

      if(re.test(e.target.value)){
        //console.log("v:",e.target.value,"reg: ",re.test(e.target.value));

        switch(e.target.id){
          case 'costprice':
            setCostPrice(e.target.value);
            break;
          case 'retailprice':
            console.log("retail price running");
            setRetailPrice(e.target.value);
            break;
          case 'qty':
            setQty(e.target.value);
            break;
          case 'barcode':   
            setBarCode(e.target.value);
            break;
          case 'modify_costprice':
            setmodifedCostPrice(e.target.value);
            break;
          case 'modify_retailprice':
            setmodifedRetailPrice(e.target.value);
            break;
          case 'modify_qty':
            setmodifedQty(e.target.value);
            break;
          case 'modify_barcode':
            setmodifedBarCode(e.target.value);
            break;        

          default:
            break;  
          }
        
      }

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
      setTable(table_data)
     
      
      /*querySnapshot.forEach((doc) => {
      
          console.log(doc.id,"=>",doc.data());
          setTable({id:doc.id, ...doc.data()});
          
      
      });*/
      
    } catch (e) {
        console.error("Error getting document: ", e);
    }

  }


  const getBrandCategoryDetails = async()=>{

    try {
       
      var cat_data = [];
      var brand_data = [];
      const querySnapshot = await getDocs(collection(db, "category"));
      //console.log(querySnapshot);
      const querySnapshotForBrand = await getDocs(collection(db, "brand"));

      querySnapshot.forEach((doc)=>{
        //console.log(doc.id, doc.data());
        cat_data.push(doc.data().c_name);
      });

      querySnapshotForBrand.forEach((doc)=>{
        //console.log(doc.id, doc.data());
        brand_data.push(doc.data().b_name);
      });

      console.log("cat data: ",cat_data);
      //console.log("table inside:",table_data);
      setCategoryNames(cat_data);
      setBrandNames(brand_data);
     
      
      /*querySnapshot.forEach((doc) => {
      
          console.log(doc.id,"=>",doc.data());
          setTable({id:doc.id, ...doc.data()});
          
      
      });*/
      
    } catch (e) {
        console.error("Error getting document: ", e);
    }


  }

  const viewProductDetail = async(id)=>{
    console.log("view product detail of ", id);
    setOpen(true);
    setModifyId(id);
    setProductViewId(id);
    showSingleProductDetail(id);

  }

  const showSingleProductDetail = async (doc_id)=>{

    try{

      const docRef = doc(db, "products",doc_id);
    
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        
        console.log("Document data for id: ",doc_id, " is ", docSnap.data());
        //setDocData(docSnap.data());
        //setModalCategoryName(docSnap.data().c_name);
        //setModalStatus(docSnap.data().c_status);
        
        setProductDetail(docSnap.data());
        getImageUrl(docSnap.data().image_path);




      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }


    }catch(e){
      console.log("getDocWithId: ", e);
    }

  }

  const getDocWithId = async(doc_id)=>{
    
    try {
    
      const docRef = doc(db, "products",doc_id);
    
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        
        console.log("Document data for id: ",doc_id, " is ", docSnap.data());
        
        setmodifedName(docSnap.data().name);
        setmodifedDesc(docSnap.data().desc);
        setmodifedCategory(docSnap.data().category);
        setmodifedBrand(docSnap.data().brand);
        setmodifedCostPrice(docSnap.data().cost_price);
        setmodifedRetailPrice(docSnap.data().retail_price);
        setmodifedQty(docSnap.data().qty);
        setmodifedBarCode(docSnap.data().bar_code);
        setmodifedStatus(docSnap.data().status);

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      } 

    } catch (error) {
      
    }
  
  }

  const modifySingleProductDetail = async (doc_id)=>{

    console.log("modify product: ", doc_id);
    setmodifyModalOpen(true);
    setModifyId(doc_id);
    getDocWithId(doc_id);



  }

  const modifyDocWithId = async(
    doc_id,
    m_product_name,
    m_desc,
    m_category,
    m_brand,
    m_cost_price,
    m_retail_price,
    m_qty,
    m_barcode,
    m_status,
    ) => {
      console.log("modify the doc with id: ", doc_id);

      try {
        
        const docRef = doc(db, "products", doc_id);

        await updateDoc(docRef, {
          name: m_product_name, 
          desc: m_desc, 
          category: m_category, 
          brand: m_brand,
          cost_price : m_cost_price,
          retail_price: m_retail_price,
          qty : m_qty,
          bar_code: m_barcode,
          status: m_status
        });
  
        getProducts();
        setmodifyModalOpen(false);
        
      } catch (error) {
        
      }

    }

  useEffect(()=>{

    getBrandCategoryDetails();
    getProducts();

  },[]);

  /**
   * 
            <label className="product-add-section-label" >Description</label>
            <textarea id="product-description" name="description"
            rows="5" cols="33" value={'hello'}>
            </textare>
   * 
   * 
   */

  return (
    <div id="products-container">
      
      <h3 className="page-section-title" >Products</h3>
      
      <div id="product-add-section">

        <fieldset id="product-add-section-fieldset">
          <legend><b>Add New Products</b></legend>
          
          <div className="product-add-section-div">

            <label className="product-add-section-label" >Product Name</label>
            <input type="text" placeholder='Product Name' value={name} onChange={(e)=>setName(e.target.value)}name="product-name" />

            <label className="product-add-section-label" >Description</label>
              <textarea id="product-description" name="description"
              rows="5" cols="33" value={desc} onChange={(e)=>{setDesc(e.target.value)}}>
            </textarea>

            <label className="product-add-section-label" >Select Image - 300x300 in resolution </label>
            <input type="file" onChange={(e)=>setImage(e.target.files[0])}>
            </input>


            
                  
           
          </div>

          <div className="product-add-section-div">

            <label className="product-add-section-label" >Category</label>
            
            <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                  {categoryNames.map((data, i)=>{
                   return(<option key={i} value={data}>{data}</option>) 
                  
                  })}
                  
            </select>

            
            <label className="product-add-section-label" >Brand</label>
            <select value={brand} onChange={(e)=>setBrand(e.target.value)}>

                  {brandNames.map((data, i)=>{
                   return(<option key={i} value={data}>{data}</option>) 
                  
                  })}
                
            </select>
            
            
            
            <label className="product-add-section-label" >Status</label>     
            <select value={status} onChange={(e)=>setStatus(e.target.value)}>
              
              <option value="active">Active</option>
              <option value="stopped">Stopped</option>
            
            </select>

            <label className="product-add-section-label" >Cost Price</label>
            <input type="number" placeholder='0' id="costprice" value={costPrice} onChange = {numberValidater} />
      
            


          </div>
          
          <div className="product-add-section-div">

            <label className="product-add-section-label" >Retail Price</label>
            <input type="number" id="retailprice" value={retailPrice} onChange ={numberValidater} placeholder='0' />

            <label className="product-add-section-label" >Quantity</label>
            <input type="number" id="qty" value={qty} onChange ={numberValidater} placeholder='0' />

            <label className="product-add-section-label" >Bar Code</label>
            <input type="text" id="barcode" value={barCode} onChange ={numberValidater} placeholder='124564125' />

            

            

            <Button variant="contained" color={"success"} sx={{my:3}} onClick={addProduct} >Add Product</Button> 


          </div>

        </fieldset>

      </div>

      <div id="product-show-section">

        <h3 className="product-page-heading"> Product Details</h3>

        <table id="product-view-section-table">
              
              <thead id="product-view-section-table-thead">
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Cost Price</th>
                  <th>Retail Price</th>
                  <th>Quantity</th>
                  <th>Active Status</th>
                  <th>Options</th>
                
                </tr>
              </thead>
              
              <tbody id="product-view-section-table-tbody">

                  {/*console.log("table: ",table)*/}

                  { 
                    
                    table.map((doc)=>{
                      return(
                      <tr key={doc.id} > 
                        
                        {/*console.log("getimageurl console: ",getImageUrl(doc.data.image_path))*/}    
                        <td><img src={`https://firebasestorage.googleapis.com/v0/b/react-shop-inventory.appspot.com/o/product_images%2F${doc.data.image_path}?alt=media&token=0086e9ca-6eae-4a1f-846c-d231219f4073`}></img></td>
                        <td>{doc.data.name} </td>
                        <td>{doc.data.cost_price}</td>
                        <td>{doc.data.retail_price}</td>
                        <td>{doc.data.qty}</td>
                        <td>{doc.data.status}</td>  
                        <td>
                          <IconButton color="success" onClick={()=>{ viewProductDetail(doc.id) }}>
                            <VisibilityIcon />  
                          </IconButton>
                          <IconButton color="success" onClick={()=>{ modifySingleProductDetail(doc.id)} }>
                            <CreateOutlinedIcon />  
                          </IconButton>
                          <IconButton color="error" onClick= {()=>{deleteProduct(doc.id)}} >
                            <HighlightOffOutlinedIcon />  
                          </IconButton>
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
              
              <div id="product-modal-container">
                
                <div id="product-model-window">
                  
                  <table id="modal-product-detail-view-table">

                    <thead>
                      <tr>
                        <th id="modal-product-detail-view-table-title"> {productDetail.name} Details</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td><img src={`https://firebasestorage.googleapis.com/v0/b/react-shop-inventory.appspot.com/o/product_images%2F${productDetail.image_path}?alt=media&token=0086e9ca-6eae-4a1f-846c-d231219f4073`}></img></td>
                      </tr>
                      <tr>
                        <td><b>Name </b> : {productDetail.name}</td>
                      </tr>
                      <tr>
                        <td><b>Desc </b> : {productDetail.desc}</td>
                      </tr>
                      <tr>
                        <td><b>Brand</b> : {productDetail.brand}</td>
                      </tr>
                      <tr>
                        <td><b>Category</b> : {productDetail.category}</td>
                      </tr>
                      <tr>
                        <td><b>Cost Price</b> : {productDetail.cost_price}</td>
                      </tr>
                      <tr>
                        <td><b>Retail Price</b> : {productDetail.retail_price}</td>
                      </tr>
                      <tr>
                        <td><b>Qty</b> : {productDetail.qty}</td>
                      </tr>
                      <tr>
                        <td><b>BarCode</b> : {productDetail.bar_code}</td>
                      </tr>
                      <tr>
                        <td><b>Status</b> : {productDetail.status}</td>
                      </tr>
                    </tbody>

                  </table>

                  <p>Product id is {productViewId}</p>

                </div>

              </div>
            
            </Modal>

            <Modal
              open={modifyModalOpen}
              onClose={()=>setmodifyModalOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              
              <div id="product-modal-modify-container">
                
                <div id="product-model-modify-window">
                  
                  <fieldset id="product-add-section-fieldset">
                    
                      <legend><b>Modify Product</b></legend>
                      
                      <div className="product-add-section-div">

                        <label className="product-add-section-label" >Product Name</label>
                        <input type="text" placeholder='Product Name' value={modifedName} onChange={(e)=>{setmodifedName(e.target.value)}} name="product-name" />

                        <label className="product-add-section-label" >Description</label>
                        <textarea id="product-description" name="description"
                        rows="5" cols="33" value={modifedDesc} onChange={(e)=>{setmodifedDesc(e.target.value)}}>
                        </textarea>

                        <label className="product-add-section-label" >Category</label>
                        
                        <select value={modifedCategory} onChange={(e)=>{setmodifedCategory(e.target.value)}}>
                              {categoryNames.map((data, i)=>{
                              return(<option key={i} value={data}>{data}</option>) 
                              
                              })}
                              
                        </select>

                              
                      
                      </div>

                      <div className="product-add-section-div">

                        
                        <label className="product-add-section-label" >Brand</label>
                        <select value={modifedBrand} onChange={(e)=>{setmodifedBrand(e.target.value)}}>

                              {brandNames.map((data, i)=>{
                              return(<option key={i} value={data}>{data}</option>) 
                              
                              })}
                            
                        </select>
                        
                        
                        <label className="product-add-section-label" >Status</label>     
                        <select value={modifedStatus} onChange={(e)=>{setmodifedStatus(e.target.value)}} >
                          
                          <option value="active">Active</option>
                          <option value="stopped">Stopped</option>
                        
                        </select>

                        <label className="product-add-section-label" >Cost Price</label>
                        <input type="number" placeholder='0' id="modify_costprice" value={modifedCostPrice} onChange = {numberValidater} />
                  
                        <label className="product-add-section-label" >Retail Price</label>
                        <input type="number" id="modify_retailprice" value={modifedRetailPrice} onChange ={numberValidater} placeholder='0' />


                      </div>
                      
                      <div className="product-add-section-div">

                        
                        <label className="product-add-section-label" >Quantity</label>
                        <input type="number" id="modify_qty" value={modifedQty} onChange ={numberValidater} placeholder='0' />

                        <label className="product-add-section-label" >Bar Code</label>
                        <input type="text" id="modify_barcode" value={modifedBarCode} onChange ={numberValidater} placeholder='124564125' />

                        

                        

                        <Button variant="contained" color={"success"} sx={{my:3}} 
                              onClick={()=>{modifyDocWithId(
                              modify_id,
                              modifedName,
                              modifedDesc,
                              modifedCategory,
                              modifedBrand,
                              modifedCostPrice,
                              modifedRetailPrice,
                              modifedQty,
                              modifedBarCode,
                              modifedStatus 


                              )}} >Modify Product</Button> 


                      </div>

                  </fieldset>

                  
                  <p>Product id is {modify_id}</p>

                </div>

              </div>
            
            </Modal>


      </div>
      
    </div>
  )
}

export default Products