import { Container, Grid, Paper, Box, Typography, Button } from "@mui/material";
import axios from "axios";
import AdminLayout from "components/Layout/AdminLayout";
import { useFetch } from "data/Api";
import { BASE_URL } from "lib/constants";
import { GetStaticProps } from "next";
import Link from "next/link";
import React from "react";
import { SWRConfig } from "swr";
import { IContent, IFallback } from "types/ModelInterface";

interface Props {
	fallback: IFallback;
}
const Page = (props: Props) => {
	const { data: kontens } = useFetch<IContent[]>("/content/getall");

	return (
		<SWRConfig value={{ fallback: props.fallback }}>
			<AdminLayout title="Konten">
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Paper elevation={0} sx={{ p: 2 }}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<Box>
									<Typography className="py-2" variant="h5" component="h1">
										Konten
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={12}>
								<Grid container spacing={2}>
									{kontens &&
										kontens.map((k) => (
											<Link key={k.id} href={"/user/content/" + k.id} passHref>
												<Grid item xs={12} maxHeight={300} overflow="hidden" md={6} key={k.id}>
													<Paper>
														<Typography variant="h4">{k.title}</Typography>
														<div className="h-full w-full flex">
															<img
																className="object-cover flex-1"
																src={BASE_URL.replace("/api", "/") + k.pathImage}
															/>
														</div>
													</Paper>
												</Grid>
											</Link>
										))}
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Container>
			</AdminLayout>
		</SWRConfig>
	);
};

export default Page;

export const getStaticProps: GetStaticProps = async () => {
	const kontens = await axios.get(BASE_URL + "/content/getall").then((res) => res.data);

	return {
		props: {
			fallback: {
				"/content/getall": kontens,
			},
		},
	};
};
