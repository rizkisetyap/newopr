import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./reducers/counterReducer";
import authReducer from "./reducers/authReducer";
import uiReducer from "./reducers/uiReducer";
import actionReducer from "./reducers/actionReducer";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    ui: uiReducer,
    action: actionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
