import React, { ComponentType } from "react";

export default function IsAdmin<T>(Component: ComponentType<T>) {
	console.log("protectedRoute");
	return (props: T) => <Component {...props} />;
}
