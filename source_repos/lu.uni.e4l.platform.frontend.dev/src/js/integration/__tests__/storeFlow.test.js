import { createStore } from "redux";
import rootReducer from "../../reducer/index";
import { changeWebsiteLanguage } from "../../action/userAction";

// MOCK 1: We mock the global 'store' import to prevent Circular Dependency loops
// (Because userAction.js imports store.js, which imports this file's dependencies)
jest.mock("../../store", () => ({}));

// MOCK 2: We mock i18n to prevent external side effects during the test
jest.mock("../../i18n", () => ({
  changeLanguage: jest.fn(),
}));

describe("Integration: Redux Data Flow", () => {
  let store;

  beforeEach(() => {
    // We create a REAL Redux store using the REAL application reducers
    // This integrates all reducer files (user, nav, questionnaire, etc.)
    store = createStore(rootReducer);
  });

  it("should handle the full flow of changing language", () => {

    expect(store.getState().userReducer.lang).toEqual("en");

    const action = changeWebsiteLanguage("fr");
    store.dispatch(action);

    const updatedState = store.getState();
    expect(updatedState.userReducer.lang).toEqual("fr");
  });

  it("should initialize with all combined reducers", () => {
    // This proves that the rootReducer correctly integrated all sub-modules
    const state = store.getState();
    
    // Check for existence of different slices of state
    expect(state).toHaveProperty("userReducer");
    expect(state).toHaveProperty("questionnaireReducer");
    expect(state).toHaveProperty("navReducer");
  });
});