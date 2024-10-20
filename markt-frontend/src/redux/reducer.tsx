import { combineReducers } from "@reduxjs/toolkit";
import userAuth from "./slices/user-auth-slice";

const reducer = combineReducers({
  userAuth,
});

export { reducer };
