import BackdropLoading from "components/MUI/BackdropLoading";
import { useSession } from "next-auth/react";
import React from "react";

interface Props {
	children: JSX.Element;
}
export default function UserPage({ children }: Props) {
	const { status } = useSession({ required: true });

	if (status === "loading") {
		return <BackdropLoading />;
	}
	return children;
}
