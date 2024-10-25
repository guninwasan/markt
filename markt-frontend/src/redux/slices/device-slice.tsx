import { createSlice } from "@reduxjs/toolkit";
import { DeviceSliceType } from "../types";

const initialState: DeviceSliceType = {
  isMobile: null,
  isLoggedIn: false,
  isLoading: false,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsMobile, setIsLoggedIn, setIsLoading } = deviceSlice.actions;

export default deviceSlice.reducer;
