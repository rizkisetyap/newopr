import { useAppDispatch } from "app/hooks";
import { openSnackbar } from "app/reducers/uiReducer";
import { useRouter } from "next/router";
import React, { ComponentType } from "react";

export default function WithAuth<T>(Component: ComponentType<T>) {
	console.log("protectedRoute");
	return (props: T) => {
		if (typeof window !== "undefined") {
			const router = useRouter();
			const dispatch = useAppDispatch();
			const token = localStorage.getItem("user");
			if (!token) {
				router.replace("/");
				dispatch(openSnackbar({ severity: "error", message: "Login Required" }));
				return null;
			}
			return <Component {...props} />;
		}
	};
}
