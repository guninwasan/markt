import { RootState } from "./store";

const selectors = {
  getUserID: (state: RootState) => state.userAuth.userID,
  getName: (state: RootState) => state.userAuth.name,
  getEmail: (state: RootState) => state.userAuth.email,
  getPhone: (state: RootState) => state.userAuth.phone,
  getUserAuthJWT: (state: RootState) => state.userAuth.jwt,
  getIsLoggedIn: (state: RootState) => state.device.isLoggedIn,
  getIsLoading: (state: RootState) => state.device.isLoading,
  getWishList: (state: RootState) => state.device.wishList,
};

export { selectors };
