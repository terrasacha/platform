import { configureStore } from '@reduxjs/toolkit'
import counterSliceReducer from './counterSliceReducer'

export default configureStore({
  reducer: {
    counter: counterSliceReducer,
  },
})