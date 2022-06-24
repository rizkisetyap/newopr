import Head from "next/head";
import { FC, useEffect, useState } from "react";
import DashboardCard from "components/Card/DashboardCard";
import AdminLayout from "components/Layout/AdminLayout";
// * Menu Icon
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CategoryIcon from "@mui/icons-material/Category";
import ArticleIcon from "@mui/icons-material/Article";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { Box, Container, Paper, Typography } from "@mui/material";
import HOC from "components/HOC";
import axios from "axios";
import { BASE_URL } from "lib/constants";
import useSWR, { SWRConfig } from "swr";
import { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { fetcher } from "lib";
import { useFetch } from "data/Api";

// *
interface Props {
	fallback: {
		[key: string]: any;
	};
}
type DashboardInfo = {
	user: number;
	events: number;
	category: number;

	contents: number;
	sliders: number;
};

const Home: FC<Props> = ({ fallback }) => {
	const { data: info } = useFetch<DashboardInfo>("/dashboard/info");
	return (
		<SWRConfig value={{ fallback }}>
			<AdminLayout title="Dashboard ">
				<Container maxWidth="xl" sx={{ py: 4, height: 1 }}>
					<Paper elevation={0} sx={{ p: 2, pb: 8 }}>
						<Typography className="text-slate-600" fontWeight={600} fontSize={26} variant="h1">
							Dashboard Admin
						</Typography>

						<Box
							component="div"
							className="mt-4 grid grid-cols-1 mx-auto gap-x-6 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
						>
							<DashboardCard
								Icon={PersonAddAltRoundedIcon}
								title="UserAccount"
								count={info?.user ?? 0}
								color="bg-blue-500"
								linkColor="bg-blue-700"
								link="/admin/account"
							/>

							<DashboardCard
								Icon={EventAvailableIcon}
								title="Event"
								count={info?.events ?? 0}
								color="bg-rose-500"
								linkColor="bg-rose-700"
								link="/admin/event"
							/>
							<DashboardCard
								link="/admin/category"
								Icon={CategoryIcon}
								title="Kategori Konten"
								count={info?.category ?? 0}
								color="bg-green-500"
								linkColor="bg-green-700"
							/>
							<DashboardCard
								link="/admin/content"
								Icon={ArticleIcon}
								title="Konten"
								count={info?.contents ?? 0}
								color="bg-cyan-500"
								linkColor="bg-cyan-700"
							/>
							<DashboardCard
								link="/admin/slider"
								Icon={SlideshowIcon}
								title="Slider"
								count={info?.sliders ?? 0}
								color="bg-indigo-500"
								linkColor="bg-indigo-700"
							/>
						</Box>
					</Paper>
				</Container>
			</AdminLayout>
		</SWRConfig>
	);
};

export default HOC(Home);

export const getStaticProps: GetStaticProps = async (ctx) => {
	const data: DashboardInfo = await axios.get(BASE_URL + "/dashboard/info").then((res) => res.data);

	return {
		props: {
			fallback: {
				["/dashboard/info"]: data,
			},
		},
	};
};
