import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  role: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userId = action.payload.userId; // Store userId from the response
      state.role = action.payload.role; // Store role from the response
      state.token = action.payload.token; // Store JWT token
      state.isAuthenticated = true; // Mark the user as authenticated
    },

    logout: (state) => {
      state.userId = null; // Clear userId
      state.role = null; // Clear role
      state.token = null; // Clear token
      state.isAuthenticated = false; // Set authenticated status to false

    },
    
    register: (state, action) => {
      state.userId = action.payload.userId; // Store userId from the registration response
      state.role = action.payload.role; // Store role from the registration response
      state.token = action.payload.token; // Store JWT token
      state.isAuthenticated = true; // Mark the user as authenticated
    },
  },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;