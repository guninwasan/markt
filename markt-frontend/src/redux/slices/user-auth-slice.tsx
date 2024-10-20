import { createSlice } from "@reduxjs/toolkit";
import { UserAuthType } from "../types";

const initialState: UserAuthType = {
  userID: -1,
  name: "",
  email: "",
  phone: "",
  jwt: "",
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUserID: (state, action) => {
      state.userID = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    setJWT: (state, action) => {
      state.jwt = action.payload;
    },
  },
});

export const { setUserID, setName, setEmail, setPhone, setJWT } =
  userAuthSlice.actions;

export default userAuthSlice.reducer;
