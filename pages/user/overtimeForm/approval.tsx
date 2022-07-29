import { Container } from "@mui/material";
import axios from "axios";
import AdminLayout from "components/Layout/AdminLayout";
import BackdropLoading from "components/MUI/BackdropLoading";
import { BASE_URL } from "lib/constants";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const Approval = () => {
	const { data: session, status } = useSession();
	const npp = session?.user?.npp;
	const jabatan = session?.user?.jabatan;
	const groupId = session?.user?.employee.service?.groupId;
	const [suratLembur, setSuratLembur] = React.useState<any[]>();
	console.log(suratLembur);

	useEffect(() => {
		const getSuratLembur = async () => {
			const data = await axios
				.get(`${BASE_URL}/RequestLembur/GetApproval?GroupId=${groupId}`)
				.then((res) => res.data);
			setSuratLembur(data);
		};
		if (groupId) {
			getSuratLembur();
		}
	}, [groupId]);

	if (status === "loading") {
		return <BackdropLoading />;
	}
	if (jabatan !== "MGR" && jabatan !== "AVP") {
		return (
			<div className="h-screen w-screen grid place-items-center">
				<h1>You are not authorized to access this page</h1>
			</div>
		);
	}
	return (
		<AdminLayout title="Approval">
			<Container
				maxWidth="xl"
				sx={{
					py: 4,
					minHeight: "calc(100vh - 64px)",
				}}
			>
				<h1>Approval</h1>
			</Container>
		</AdminLayout>
	);
};

export default Approval;
