import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  hod_id: null,
  department_id: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.officer_id = action.payload.officer_id;
      state.department_id = action.payload.department_id;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.hod_id = null;
      state.department_id = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    register: (state, action) => {
      state.user = action.payload;
      state.hod_id = action.payload.hod_id;
      state.department_id = action.payload.department_id;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;
