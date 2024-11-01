import { selectors } from "./selectors";
import { RootState } from "./store";

describe("Selectors", () => {
  const mockState: RootState = {
    userAuth: {
      userID: 123,
      name: "ABCD",
      email: "someemail@example.com",
      phone: "123-456-7890",
      jwt: "some-jwt-token",
    },
    device: {
      isLoggedIn: false,
      isLoading: false,
    },
    _persist: {
      version: 1,
      rehydrated: true,
    },
  };

  it("should return the user ID", () => {
    const userID = selectors.getUserID(mockState);
    expect(userID).toBe(123);
  });

  it("should return the user name", () => {
    const name = selectors.getName(mockState);
    expect(name).toBe("ABCD");
  });

  it("should return the user email", () => {
    const email = selectors.getEmail(mockState);
    expect(email).toBe("someemail@example.com");
  });

  it("should return the user phone", () => {
    const phone = selectors.getPhone(mockState);
    expect(phone).toBe("123-456-7890");
  });

  it("should return the user auth JWT", () => {
    const jwt = selectors.getUserAuthJWT(mockState);
    expect(jwt).toBe("some-jwt-token");
  });

  it("should return if the user is logged in", () => {
    const isLoggedIn = selectors.getIsLoggedIn(mockState);
    expect(isLoggedIn).toBe(false);
  });
});
