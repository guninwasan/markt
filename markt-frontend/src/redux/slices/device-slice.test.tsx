import {
  setIsLoggedIn,
  setIsLoading,
  deviceSlice,
  setWishList,
} from "./device-slice";

import { DeviceSliceType } from "../types";

describe("deviceSlice", () => {
  const initialState: DeviceSliceType = {
    isLoggedIn: false,
    isLoading: false,
    wishList: [],
  };

  const deviceReducer = deviceSlice.reducer;

  it("should handle setIsLoggedIn", () => {
    const action = { type: setIsLoggedIn.type, payload: true };
    const expectedState = { ...initialState, isLoggedIn: true };
    expect(deviceReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle setIsLoading", () => {
    const action = { type: setIsLoading.type, payload: true };
    const expectedState = { ...initialState, isLoading: true };
    expect(deviceReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle setWishList", () => {
    const action = { type: setWishList.type, payload: [1, 2, 3] };
    const expectedState = { ...initialState, wishList: [1, 2, 3] };
    expect(deviceReducer(initialState, action)).toEqual(expectedState);
  });
});
