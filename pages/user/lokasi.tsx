import { DiscountSharp, OpenInNewRounded } from "@mui/icons-material";
import {
	Container,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { useAppDispatch } from "app/hooks";
import { openSnackbar } from "app/reducers/uiReducer";
import axios from "axios";
import HOC from "components/HOC/HOC";
import AdminLayout from "components/Layout/AdminLayout";
import { useFetch } from "data/Api";
import { BASE_URL } from "lib/constants";
import { GetStaticProps } from "next";
import React, { useEffect, useState } from "react";
import { SWRConfig } from "swr";
import { IFallback, ILocation } from "types/ModelInterface";

interface Props {
	fallback: IFallback;
}
const Page = (props: Props) => {
	const { data: locations } = useFetch<ILocation[]>("/officelocation");
	const [location, setLocation] = useState<{ lat: number; lon: number } | null>();
	const dispatch = useAppDispatch();
	useEffect(() => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
				},
				(error) => {
					dispatch(
						openSnackbar({
							severity: "error",
							message: "Gagal mendapat lokasi anda, pastikan browser diijinkan untuk mengakses lokasi",
						})
					);
				}
			);
		}
	}, []);
	return (
		<SWRConfig value={{ fallback: props.fallback }}>
			<AdminLayout title="Lokasi Kantor">
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Paper elevation={0} sx={{ p: 2 }}>
						<Typography className="text-lg fon-bold md:text-xl" variant="h4" component="h1">
							Lokasi Kantor
						</Typography>
						{locations && (
							<TableContainer className="mt-4 md:mt-6" component={Paper}>
								<Table className="text-xs md:text-base" sx={{ minWidth: 320 }} aria-label="table aplikasi opr">
									<TableHead>
										<TableRow>
											<TableCell>No.</TableCell>
											<TableCell>Kantor</TableCell>
											<TableCell>Alamat Kantor</TableCell>
											<TableCell>Aksi</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{locations.map((loc, idx) => (
											<TableRow key={idx}>
												<TableCell>{idx + 1}</TableCell>
												<TableCell>{loc.name}</TableCell>
												<TableCell>{loc.address}</TableCell>
												<TableCell>
													<IconButton
														component="a"
														rel="noopener"
														target="_blank"
														href={`https://www.google.com/maps/dir/?api=1&origin=${location?.lat},${location?.lon}&destination=${loc.latitude},${loc.longitude}`}
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
	const location = await axios.get(BASE_URL + "/officelocation").then((res) => res.data);

	return {
		props: {
			fallback: {
				"/officelocation": location,
			},
		},
	};
};
