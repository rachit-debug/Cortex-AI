import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice"
import conversationReduser from "./conversationSlice"
import messageReduser from "./messagesSlice"


export const store = configureStore({
  reducer: {
    user : userReducer,
    conversation : conversationReduser,
    message : messageReduser,

  },
})
