import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  role: null,
  token: null,
  isAuthenticated: false,
  branchId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userId = action.payload.userId; 
      state.role = action.payload.role; 
      state.token = action.payload.token; 
      state.branchId = action.payload.branchId; 
      state.isAuthenticated = true; 

    },

    logout: (state) => {
      state.userId = null; 
      state.role = null;
      state.token = null; 
      state.branchId = null;
      state.isAuthenticated = false; 
    },
    
    register: (state, action) => {
      state.userId = action.payload.userId;
      state.role = action.payload.role; 
      state.token = action.payload.token; 
      state.branchId = action.payload.branchId; 
      state.isAuthenticated = true; 
    },
  },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;