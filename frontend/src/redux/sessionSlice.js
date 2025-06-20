import { createSlice } from "@reduxjs/toolkit";

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    currentSession: null,
  },
  reducers: {
    setSession: (state, action) => {
      state.currentSession = action.payload;
    },
    clearSession: (state) => {
      state.currentSession = null;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;