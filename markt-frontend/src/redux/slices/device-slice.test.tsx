import {
  setIsMobile,
  setIsLoggedIn,
  setIsLoading,
  deviceSlice,
} from "./device-slice";

import { DeviceSliceType } from "../types";

describe("deviceSlice", () => {
  const initialState: DeviceSliceType = {
    isMobile: null,
    isLoggedIn: false,
    isLoading: false,
  };

  const deviceReducer = deviceSlice.reducer;

  it("should handle setIsMobile", () => {
    const action = { type: setIsMobile.type, payload: true };
    const expectedState = { ...initialState, isMobile: true };
    expect(deviceReducer(initialState, action)).toEqual(expectedState);
  });

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
});
