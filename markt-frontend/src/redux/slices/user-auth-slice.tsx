import { createSlice } from "@reduxjs/toolkit";

type UserAuthType = {
  userID: number;
  name: string;
  email: string;
  phone: string;
  jwt: string;
};

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
