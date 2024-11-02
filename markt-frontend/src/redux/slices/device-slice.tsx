import { createSlice } from "@reduxjs/toolkit";
import { DeviceSliceType } from "../types";

const initialState: DeviceSliceType = {
  isLoggedIn: false,
  isLoading: false,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoggedIn, setIsLoading } = deviceSlice.actions;

export default deviceSlice.reducer;

export { deviceSlice };
