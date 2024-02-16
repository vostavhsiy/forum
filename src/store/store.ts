import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import messengerReducer from "./messenger/reducer";

const rootReducer = combineReducers({
  chat: messengerReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type StateType = ReturnType<typeof rootReducer>;

export default store;
