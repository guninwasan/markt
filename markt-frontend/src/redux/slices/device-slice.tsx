import { createSlice } from "@reduxjs/toolkit";
import { DeviceSliceType } from "../types";

const initialState: DeviceSliceType = {
  isMobile: false,
  isLoggedIn: false,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setMobile, setLoggedIn } = deviceSlice.actions;

export default deviceSlice.reducer;
