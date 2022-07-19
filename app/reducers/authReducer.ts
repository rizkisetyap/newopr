import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEmploye } from "types/ModelInterface";
import type { RootState } from "../store";

export const authInitialState: IAuthState = {
	user: null,
};
export interface User {
	accountRole: string[];
	firstName: string;
	lastName: string;
	npp: string;
	jabatan: string;
	kelompok: string;
	service: string;
	employee: IEmploye;
}
interface IUserInfo {
	user: User;
	token: string;
}
export interface IAuthState {
	user: IEmploye | null;
}

const authReducer = createSlice({
	name: "auth",
	initialState: authInitialState,
	reducers: {
		login(state, action: PayloadAction<IEmploye>) {
			state.user = action.payload.user;
		},
		logout(state) {
			state.user = null;
		},
	},
});

export const { login, logout } = authReducer.actions;
export default authReducer.reducer;
