import { combineReducers } from "@reduxjs/toolkit";
import userAuth from "./slices/user-auth-slice";
import device from "./slices/device-slice";

const reducer = combineReducers({
  userAuth,
  device,
});

export { reducer };
