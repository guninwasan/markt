import { createSlice } from "@reduxjs/toolkit";

type DeviceSliceType = {
  isMobile: boolean;
  isLoggedIn: boolean;
};

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
