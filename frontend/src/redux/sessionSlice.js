import { createSlice } from "@reduxjs/toolkit";

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    start_month: null,
    start_year: null,
    end_month: null,
    end_year: null,
  },
  reducers: {
    setSession: (state, action) => {
      const { start_month, start_year, end_month, end_year } = action.payload;
      state.start_month = start_month;
      state.start_year = start_year;
      state.end_month = end_month;
      state.end_year = end_year;
    },
    clearSession: (state) => {
      state.start_month = null;
      state.start_year = null;
      state.end_month = null;
      state.end_year = null;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
