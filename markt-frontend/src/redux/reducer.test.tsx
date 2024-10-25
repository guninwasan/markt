import userAuth from "./slices/user-auth-slice";
import device from "./slices/device-slice";
import { reducer } from "./reducer";

describe("reducer", () => {
  it("should return the initial state", () => {
    const initialState = {
      userAuth: userAuth(undefined, { type: "@@INIT" }),
      device: device(undefined, { type: "@@INIT" }),
    };
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("should handle actions for userAuth slice", () => {
    const action = { type: "userAuth/someAction", payload: "test" };
    const expectedState = {
      userAuth: userAuth(undefined, action),
      device: device(undefined, { type: "@@INIT" }),
    };
    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it("should handle actions for device slice", () => {
    const action = { type: "device/someAction", payload: "test" };
    const expectedState = {
      userAuth: userAuth(undefined, { type: "@@INIT" }),
      device: device(undefined, action),
    };
    expect(reducer(undefined, action)).toEqual(expectedState);
  });
});
