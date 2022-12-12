import React, { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import './Login.css';


export default function Login() {
  
  const [userName, setuserName] = useState('');
  const [passWord, setpassWord] = useState('');
  const [alert, setAlert] = useState(false);

  

  const handleAuth = (e)=>{

    console.log(e.target.id);
    
    switch(e.target.id){

      case 'login-username':
        setuserName(e.target.value);
        break;
      case 'login-password':
        setpassWord(e.target.value);
        break;
      default: break;

    }
    //if (userName === '' || passWord === ''){setAlert(true);}
  }

  const loginAuth = ()=>{
    
    if(userName !== '' && passWord !== ''){
      
      console.log("user: ",userName, "password: ",passWord);
      setAlert(false);

    }else{
      console.log("you missed filling a field");
      setAlert(true);
    }

  }


  return (
    <div id="login-container">
        

        <div id="login-form">
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >  
                <h3>User Login</h3>
                <TextField value={userName} onChange={handleAuth}  id="login-username" label="UserName" variant="outlined" />
                <TextField value={passWord} onChange={handleAuth} id="login-password" label="Password" type="password" variant="outlined" />
                <Button variant="contained" onClick={()=> {
                     loginAuth();
                }} >Submit</Button>

                {alert? <Alert severity="error">You Missed to Fill a Field</Alert> : null }

              </Box>  
        </div>

    </div>
  )
}

