import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import messengerReducer from "./messenger/reducer";
import serviceReducer from "./service/reducer";

const rootReducer = combineReducers({
  chat: messengerReducer,
  service: serviceReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type StateType = ReturnType<typeof rootReducer>;

export default store;
