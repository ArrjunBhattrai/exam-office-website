import { combineReducers } from "redux";
import coReducer from "./coReducer";

const rootReducer = combineReducers({
  co: coReducer, // Add CO Reducer
});

export default rootReducer;
