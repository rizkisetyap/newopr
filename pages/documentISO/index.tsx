import { FolderRounded, Upload } from "@mui/icons-material";
import {
	Box,
	Button,
	Container,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { useAppSelector } from "app/hooks";
import axios from "axios";
import ISOCore from "components/DOCIS/ISOCore";
import IsoSupport from "components/DOCIS/IsoSupport";
import RegisterForm from "components/DOCIS/RegisterForm";
import HOC from "components/HOC/HOC";
import AdminLayout from "components/Layout/AdminLayout";
import { useFetch, useQuery } from "data/Api";
import { BASE_URL } from "lib/constants";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { ICoreISO, IEmploye, IRegisteredForm } from "types/ModelInterface";

interface Props {
	session: Session;
	user: IEmploye;
}

const Page = (props: Props) => {
	const { user } = props;
	const { data: isoForms } = useFetch<IRegisteredForm[]>("/registeredForms/filter?id=" + user.serviceId);
	const { data: isoCore } = useFetch<ICoreISO[]>("/isocores/getall");
	return (
		<AdminLayout title="DOCIS">
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Paper elevation={0} sx={{ p: 2 }}>
					<div>
						<Typography variant="h6" component="h5">
							Register Form
						</Typography>
						<Grid container>
							<Grid item xs={12}>
								<RegisterForm isoForms={isoForms} />
							</Grid>
							<Grid item xs={12}>
								<ISOCore isoCores={isoCore} serviceId={props.user.serviceId!} />
							</Grid>
							<Grid item xs={12}>
								{isoCore && isoForms && <IsoSupport isoCores={isoCore} isoForms={isoForms} />}
							</Grid>
						</Grid>
					</div>
				</Paper>
			</Container>
		</AdminLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await getSession(ctx);

	if (!session) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	const user: IEmploye = await axios.get(BASE_URL + "/employee/by?id=" + session.user.npp).then((res) => res.data);
	return {
		props: {
			session,
			user,
		},
	};
};

export default HOC(Page);
