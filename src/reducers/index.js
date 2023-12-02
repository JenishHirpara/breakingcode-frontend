import { combineReducers } from "redux";
import userReducer from "./userReducer";
import newDocsReducer from "./newDocsReducer";

export default combineReducers({
  user: userReducer,
  docs: newDocsReducer,
});
