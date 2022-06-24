import axios, { Axios, AxiosResponse } from "axios";
import { BASE_URL } from "../lib/constants";
import { ILoginForm } from "../types/Login";

interface IResponseLogin {
	success: boolean;
	data: any;
	message: string | null;
}

export default async function Login(loginData: ILoginForm) {
	const response: IResponseLogin = {
		success: false,
		data: null,
		message: null,
	};
	try {
		const data = await axios.post(`https://localhost/devmyopr/api/login`, loginData);
		const user = data.data;
		response.success = true;
		response.data = user;
		response.message = "success";
		return data.data;
	} catch (error) {
		response.success = false;
		response.message = (error as any).message;
	}

	return response;
}
