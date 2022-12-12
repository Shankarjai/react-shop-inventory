import { configureStore } from '@reduxjs/toolkit'
import { createStore } from 'redux'
import { createSlice } from "@reduxjs/toolkit"

import { useSelector, useDispatch } from 'react-redux'


export const lastIdSlice = createSlice({

  name : 'lastId',
  initialState:{value:0},
  reducers: {

    add: (state) => {
      state.value += 1
      console.log("add, ",state.value);
    },
    
  }


})

export const {add} = lastIdSlice.actions;

export default lastIdSlice.reducer
