import { createSlice } from "@reduxjs/toolkit";

type DeviceSlice = {
  isMobile: boolean;
  isLoggedIn: boolean;
};

const initialState: DeviceSlice = {
  isMobile: false,
  isLoggedIn: false,
};

const userAuthSlice = createSlice({
  name: "counter",
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

export const { setMobile, setLoggedIn } = userAuthSlice.actions;

export default userAuthSlice.reducer;
