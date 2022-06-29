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
	const { data: events } = useFetch<IEvent[]>("/events/getall");
	const [absen, setAbsen] = useState<EventPresence[]>();
	// console.log(events);
	console.log(data);
	useEffect(() => {
		const getQr = async () => {
			const promises = await events!.map(async (e) => {
				const data = await axios.get(BASE_URL + "/Presence/" + e.id).then((res) => res.data);
				const blob = await fetch(data.qrSrc).then((res) => res.blob());
				console.log(blob);
				return { ...data, qrCode: blob } as Promise<EventPresence>;
			});
			const qrs = await Promise.all<EventPresence>(promises);
			setAbsen(qrs);

			// console.log(qrs);
		};
		if (events) {
			getQr();
		}
	}, [events]);

	return (
		<SWRConfig value={{ fallback: props.fallback }}>
			<AdminLayout title="Hello">
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Paper elevation={0} sx={{ p: 2 }}>
						<div>
							<Typography variant="h5" component="h1">
								Welcome,{data?.user.firstName + " " + data?.user.lastName} ( {data?.user.kelompok} -{" "}
								{data?.user.service} )
							</Typography>
						</div>
						<div>
							<Typography>Events</Typography>
							<Grid container spacing={2} sx={{ p: 4 }}>
								{absen &&
									absen.map((e) => (
										<Grid key={e.id} item xs={12} sm={6} md={4}>
											<Paper elevation={2} sx={{ p: 2 }}>
												<Typography>{e.name}</Typography>
												<img src={URL.createObjectURL(e.qrCode)} />
											</Paper>
										</Grid>
									))}
							</Grid>
						</div>
					</Paper>
				</Container>
			</AdminLayout>
		</SWRConfig>
	);
};

export default HOC(Dashboard);

Dashboard.auth = {
	loading: <BackdropLoading />,
	unauthorized: "/newopr",
};

export const getStaticProps: GetStaticProps = async (ctx) => {
	try {
		const events = await axios.get(BASE_URL + "/events/getall").then((res) => res.data);
		return {
			props: {
				fallback: {
					"/events/getall": events,
				},
			},
		};
	} catch (error) {
		return {
			redirect: {
				destination: "/newopr/400",
				permanent: false,
			},
		};
	}
};
