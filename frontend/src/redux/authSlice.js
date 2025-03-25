import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  officer_id: null,
  department_id: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload; // Store full officer object
      state.officer_name = action.payload.officer_name; // Extract officer_id correctly
      state.officer_id = action.payload.officer_id; // Extract officer_id correctly
      state.user_type = action.payload.user_type; // Extract officer_id correctly
      state.department_id = action.payload.department_id || null; // Ensure department_id is handled
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null; // Store full officer object
      state.officer_name = null; // Extract officer_id correctly
      state.officer_id = null; // Extract officer_id correctly
      state.user_type = null; // Extract officer_id correctly
      state.department_id = null; // Ensure department_id is handled
      state.token = null;
      state.isAuthenticated = false;
    },
    register: (state, action) => {
      state.user = action.payload; // Store full officer object
      state.officer_name = action.payload.officer_name; // Extract officer_id correctly
      state.officer_id = action.payload.officer_id; // Extract officer_id correctly
      state.user_type = action.payload.user_type; // Extract officer_id correctly
      state.department_id = action.payload.department_id || null; // Ensure department_id is handled
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;
