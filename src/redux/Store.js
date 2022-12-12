import { configureStore } from '@reduxjs/toolkit';
import lastIdReducer from './Reducer';

export default configureStore({
  
  reducer: {
    lastId: lastIdReducer
  }

})