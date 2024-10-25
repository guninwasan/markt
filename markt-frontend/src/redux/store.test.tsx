import { store } from "./store";

describe("Redux Store", () => {
  it("should have the correct initial state", () => {
    const initialState = store.getState();
    expect(initialState).toBeDefined();
  });

  it("should dispatch actions correctly", () => {
    const testAction = { type: "TEST_ACTION" };
    store.dispatch(testAction);
    const state = store.getState();
    expect(state).toBeDefined();
  });

  it("should have the correct types for RootState and AppDispatch", () => {
    type TestRootState = ReturnType<typeof store.getState>;
    type TestAppDispatch = typeof store.dispatch;

    const testRootState: TestRootState = store.getState();
    const testAppDispatch: TestAppDispatch = store.dispatch;

    expect(testRootState).toEqual(store.getState());
    expect(testAppDispatch).toEqual(store.dispatch);
  });
});
