import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    onlineUsers: [],
    isConnected: false,
    userId: null
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
      state.isConnected = true;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload || [];
    },
    setSocketConnected: (state, action) => {
      state.isConnected = true;
      state.userId = action.payload.userId;
    },
    setSocketDisconnected: (state) => {
      state.socket = null;
      state.isConnected = false;
      state.userId = null;
      state.onlineUsers = [];
    }
  }
});

export const { 
  setSocket,
  setOnlineUsers, 
  setSocketConnected, 
  setSocketDisconnected 
} = socketSlice.actions;

export default socketSlice.reducer;