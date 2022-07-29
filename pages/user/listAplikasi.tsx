import { OpenInNewRounded } from "@mui/icons-material";
import {
	Container,
	IconButton,
	List,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import axios from "axios";
import HOC from "components/HOC/HOC";
import AdminLayout from "components/Layout/AdminLayout";
import BackdropLoading from "components/MUI/BackdropLoading";
import { useFetch } from "data/Api";
import { BASE_URL } from "lib/constants";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import { SWRConfig } from "swr";
import { IFallback, ListApp } from "types/ModelInterface";

interface Props {
	fallback: IFallback;
}
const Page = (props: Props) => {
	const { data: session, status } = useSession({ required: true });
	const gid = session?.user.employee.service?.groupId ?? session?.user.employee.groupId;

	const { data: apps } = useFetch<ListApp[]>("/ListApps/GetByGroupId?groupId=" + gid);
	if (status === "loading") {
		return <BackdropLoading />;
	}
	return (
		<SWRConfig value={{ fallback: props.fallback }}>
			<AdminLayout title="List Apps">
				<Container maxWidth="xl" sx={{ py: 4, minHeight: "90vh" }}>
					<Paper elevation={0} sx={{ p: 2 }}>
						<Typography className="text-lg font-bold md:text-xl" variant="h4" component="h1">
							List Aplikasi OPR
						</Typography>
						{apps && (
							<TableContainer className="mt-4 md:mt-6" component={Paper}>
								<Table className="text-xs md:text-base" sx={{ minWidth: 320 }} aria-label="table aplikasi opr">
									<TableHead>
										<TableRow>
											<TableCell>No.</TableCell>
											<TableCell>Nama Aplikasi</TableCell>
											<TableCell>Alamat Aplikasi</TableCell>
											<TableCell>Aksi</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{apps.map((app, idx) => (
											<TableRow key={idx}>
												<TableCell>{idx + 1}</TableCell>
												<TableCell>{app.name}</TableCell>
												<TableCell>{app.link}</TableCell>
												<TableCell>
													<IconButton
														component="a"
														rel="noopener"
														target="_blank"
														href={app.link}
														title="visit"
													>
														<OpenInNewRounded />
													</IconButton>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						)}
					</Paper>
				</Container>
			</AdminLayout>
		</SWRConfig>
	);
};

export default HOC(Page);

export const getStaticProps: GetStaticProps = async () => {
	const apps = await axios.get(BASE_URL + "/listapps/getall").then((res) => res.data);

	return {
		props: {
			fallback: {
				"/listapps/getall": apps,
			},
		},
	};
};
