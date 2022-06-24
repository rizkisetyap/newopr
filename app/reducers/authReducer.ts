import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { json } from "stream/consumers";
import type { RootState } from "../store";

export interface IAuthState {
  isLogin: boolean;
  user: string | null;
}

export const authInitialState: IAuthState = {
  isLogin: false,
  user: null,
};

const authReducer = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    login(state, action: PayloadAction<any>) {
      state.isLogin = true;
      state.user = action.payload.userInfo;
      localStorage.setItem("user", JSON.stringify(action.payload.idToken));
    },
    logout(state) {
      state.isLogin = false;
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authReducer.actions;
export default authReducer.reducer;
