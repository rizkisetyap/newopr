import { setLoading } from "app/reducers/actionReducer";
import { closeModal, openSnackbar } from "app/reducers/uiReducer";
import { AppDispatch } from "app/store";
import axios from "axios";
import { ICategory, IContent } from "types/ModelInterface";
import { BASE_URL } from "./constants";
export type FILE = {
	name?: string;
	type?: string;
	extension?: string;
	base64str?: string;
};

export type FileInfo = {
	image: FILE | null;
	file: FILE | null;
};
export type FormINIT = {
	content: IContent;
	fileData: FileInfo;
};

export const handlePostContent = async (data: FormINIT, onSuccess: () => void, dispatch: AppDispatch) => {
	dispatch(setLoading(true));
	try {
		const res = await axios.post(BASE_URL + "/content/insert", data);
		if (res.status === 200) {
			onSuccess();
			dispatch(
				openSnackbar({
					severity: "success",
					message: "Sukses menambahkan data",
				})
			);
		} else {
			dispatch(
				openSnackbar({
					severity: "error",
					message: "Gagal menambahkan data (Bad Request 400)",
				})
			);
		}
		dispatch(setLoading(false));
	} catch (error) {
		dispatch(
			openSnackbar({
				severity: "error",
				message: "Gagal menambah data (Internal Server Error 500)",
			})
		);
	}
	dispatch(setLoading(false));
};
export const handleUpdateContent = async (data: FormINIT, onSuccess: () => void, dispatch: AppDispatch) => {
	dispatch(setLoading(true));
	try {
		const res = await axios.put(BASE_URL + "/content/insert", data);
		if (res.status === 200) {
			onSuccess();
			dispatch(
				openSnackbar({
					severity: "success",
					message: "Sukses menambahkan data",
				})
			);
		} else {
			dispatch(
				openSnackbar({
					severity: "error",
					message: "Gagal menambahkan data (Bad Request 400)",
				})
			);
		}
		dispatch(setLoading(false));
	} catch (error) {
		dispatch(
			openSnackbar({
				severity: "error",
				message: "Gagal menambah data (Internal Server Error 500)",
			})
		);
	}
	dispatch(setLoading(false));
};
export const handlePost = async <T>(data: T, onSuccess: () => void, dispatch: AppDispatch, endPoint: string) => {
	dispatch(setLoading(true));
	try {
		const res = await axios.post(BASE_URL + "/" + endPoint, data);
		if (res.status === 200) {
			onSuccess();
			dispatch(
				openSnackbar({
					severity: "success",
					message: "Sukses menambahkan data",
				})
			);
		} else {
			dispatch(
				openSnackbar({
					severity: "error",
					message: "Gagal menambahkan data (Bad Request 400)",
				})
			);
		}
		dispatch(setLoading(false));
	} catch (error) {
		dispatch(
			openSnackbar({
				severity: "error",
				message: "Gagal menambah data (Internal Server Error 500)",
			})
		);
	}
	dispatch(setLoading(false));
};

export const handleDelete = async <T>(onSuccess: () => void, dispatch: AppDispatch, endPoint: string, data: T) => {
	dispatch(setLoading(true));
	try {
		const res = await axios.delete(BASE_URL + "/" + endPoint, {
			data,
		});
		if (res.status === 200) {
			onSuccess();
			dispatch(
				openSnackbar({
					severity: "success",
					message: "Sukses menghapus data",
				})
			);
		} else {
			dispatch(
				openSnackbar({
					severity: "error",
					message: "Gagal menghapus data (Bad Request 400)",
				})
			);
		}
		dispatch(setLoading(false));
	} catch (error) {
		dispatch(
			openSnackbar({
				severity: "error",
				message: "Gagal menghapus data (Internal Server Error 500)",
			})
		);
	}
	dispatch(setLoading(false));
};

export const handleUpdate = async <T>(data: T, onSuccess: () => void, dispatch: AppDispatch, endPoint: string) => {
	dispatch(setLoading(true));
	try {
		const res = await axios.put(BASE_URL + "/" + endPoint, data);
		// console.log(res.status);
		if (res.status === 200) {
			onSuccess();
			dispatch(
				openSnackbar({
					severity: "success",
					message: "Sukses mengupdate data",
				})
			);
		} else {
			dispatch(
				openSnackbar({
					severity: "error",
					message: "Gagal mengupdate data (Bad Request 400)",
				})
			);
		}
		dispatch(setLoading(false));
	} catch (error) {
		dispatch(
			openSnackbar({
				severity: "error",
				message: "Gagal mengupdate data (Internal Server Error 500)",
			})
		);
	}
	dispatch(setLoading(false));
};
export const handleSoftDeleteEmploye = async <T>(
	id: string,
	onSuccess: () => void,
	dispatch: AppDispatch,
	endPoint: string
) => {
	dispatch(setLoading(true));
	try {
		const res = await axios.delete(BASE_URL + "/" + endPoint + "?npp=" + id);
		if (res.status === 200) {
			onSuccess();
			dispatch(
				openSnackbar({
					message: "Sukses menghapus data",
					severity: "success",
				})
			);
		} else {
			dispatch(
				openSnackbar({
					message: "Gagal menghapus data",
					severity: "error",
				})
			);
		}
		dispatch(setLoading(false));
	} catch (error) {
		dispatch(
			openSnackbar({
				severity: "error",
				message: "Gagal menghapus data Internal server error",
			})
		);
	}
	dispatch(setLoading(false));
};
export const handleSoftDelete = async <T>(
	id: string,
	onSuccess: () => void,
	dispatch: AppDispatch,
	endPoint: string
) => {
	dispatch(setLoading(true));
	try {
		const res = await axios.delete(BASE_URL + "/" + endPoint + "/delete?id=" + id);
		if (res.status === 200) {
			onSuccess();
			dispatch(
				openSnackbar({
					message: "Sukses menghapus data",
					severity: "success",
				})
			);
		} else {
			dispatch(
				openSnackbar({
					message: "Gagal menghapus data",
					severity: "error",
				})
			);
		}
		dispatch(setLoading(false));
	} catch (error) {
		dispatch(
			openSnackbar({
				severity: "error",
				message: "Gagal menghapus data Internal server error",
			})
		);
	}
	dispatch(setLoading(false));
};
export const handleDeleteById = async <T>(
	id: number,
	onSuccess: () => void,
	dispatch: AppDispatch,
	endPoint: string
) => {
	dispatch(setLoading(true));
	try {
		const res = await axios.delete(BASE_URL + "/" + endPoint + "/" + id);
		if (res.status === 200) {
			onSuccess();
			dispatch(
				openSnackbar({
					message: "Sukses menghapus data",
					severity: "success",
				})
			);
		} else {
			dispatch(
				openSnackbar({
					message: "Gagal menghapus data",
					severity: "error",
				})
			);
		}
		dispatch(setLoading(false));
	} catch (error) {
		dispatch(
			openSnackbar({
				severity: "error",
				message: "Gagal menghapus data Internal server error",
			})
		);
	}
	dispatch(setLoading(false));
};

const API = {
	handleDelete,
	handlePost,
	handleSoftDeleteEmploye,
	handleUpdate,
	handleSoftDelete,
	handlePostContent,
	handleUpdateContent,
	handleDeleteById,
};
export default API;
