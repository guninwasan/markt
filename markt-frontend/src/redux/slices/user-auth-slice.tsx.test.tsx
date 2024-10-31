import userAuthReducer, {
  setUserID,
  setName,
  setEmail,
  setPhone,
  setJWT,
} from "./user-auth-slice";
import { UserAuthType } from "../types";

describe("userAuthSlice", () => {
  const initialState: UserAuthType = {
    userID: -1,
    name: "",
    email: "",
    phone: "",
    jwt: "",
  };

  it("should handle setUserID", () => {
    const userID = 123;
    const nextState = userAuthReducer(initialState, setUserID(userID));
    expect(nextState.userID).toEqual(userID);
  });

  it("should handle setName", () => {
    const name = "John Doe";
    const nextState = userAuthReducer(initialState, setName(name));
    expect(nextState.name).toEqual(name);
  });

  it("should handle setEmail", () => {
    const email = "john.doe@example.com";
    const nextState = userAuthReducer(initialState, setEmail(email));
    expect(nextState.email).toEqual(email);
  });

  it("should handle setPhone", () => {
    const phone = "123-456-7890";
    const nextState = userAuthReducer(initialState, setPhone(phone));
    expect(nextState.phone).toEqual(phone);
  });

  it("should handle setJWT", () => {
    const jwt = "some.jwt.token";
    const nextState = userAuthReducer(initialState, setJWT(jwt));
    expect(nextState.jwt).toEqual(jwt);
  });
});
