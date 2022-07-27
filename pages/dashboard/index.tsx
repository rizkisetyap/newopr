import { Grid, Paper, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useAppSelector } from "app/hooks";
import axios from "axios";
import HOC from "components/HOC/HOC";
import AdminLayout from "components/Layout/AdminLayout";
import BackdropLoading from "components/MUI/BackdropLoading";
import { useFetch, useQuery } from "data/Api";
import { BASE_URL } from "lib/constants";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { SWRConfig } from "swr";
import { EventPresence, IEmploye, IEvent, IFallback, IRegisteredForm } from "types/ModelInterface";

interface Props {
	fallback: IFallback;
}
// url = "http://localhost:3000/newopr/absen?id=idEvent&token=token";

const Dashboard = (props: Props) => {
	const { status, data } = useSession({ required: true });

	if (status === "loading") {
		return <BackdropLoading />;
	}
	return (
		<SWRConfig value={{ fallback: props.fallback }}>
			<AdminLayout title="Hello ">
				<Container maxWidth="xl" sx={{ py: 4, minHeight: "90vh" }}>
					<Paper elevation={0} sx={{ p: 2 }}>
						<div>
							<Typography className="text-lg md:text-xl" variant="h5" component="h1">
								Welcome,{data?.user.firstName + " " + data?.user.lastName} ( {data?.user.kelompok} -{" "}
								{data?.user.service} )
							</Typography>
						</div>
					</Paper>
				</Container>
			</AdminLayout>
		</SWRConfig>
	);
};

export default HOC(Dashboard);
