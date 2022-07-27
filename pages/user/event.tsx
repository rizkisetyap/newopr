import { AssignmentIndOutlined, AssignmentIndRounded, QrCode2Rounded } from "@mui/icons-material";
import {
	Backdrop,
	Box,
	Container,
	Dialog,
	DialogContent,
	Grid,
	IconButton,
	Link,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Paper,
	Tooltip,
	Typography,
} from "@mui/material";
import { useAppDispatch } from "app/hooks";
import { openSnackbar } from "app/reducers/uiReducer";
import { AppDispatch } from "app/store";
import axios from "axios";
import HOC from "components/HOC/HOC";
import AdminLayout from "components/Layout/AdminLayout";
import BackdropLoading from "components/MUI/BackdropLoading";
import TableAbsensiUser, { IAbsen } from "components/TableAbsensiUser";
import { useFetch } from "data/Api";
import { BASE_URL } from "lib/constants";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SWRConfig } from "swr";
import { IEvent, IFallback } from "types/ModelInterface";

interface Props {
	fallback: IFallback;
}
const Event = (props: Props) => {
	const { data: events } = useFetch<IEvent[]>("/events/published");
	const { data: session, status } = useSession({ required: true });
	const [showQr, setShowQr] = useState<{ id: number | null; show: boolean }>({ id: null, show: false });
	const [qr, setQr] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { data: absens } = useFetch<IAbsen[]>("/Presence/employee?npp=" + session?.user.npp);
	const dispatch = useAppDispatch();
	const handleShowQr = (id: number) => {
		setShowQr({ id, show: true });
	};
	const handleCloseQr = () => {
		setShowQr({ id: null, show: false });
	};
	const handlePresence = async (eventId: number) => {
		const token = session?.accessToken;
		if (!token) {
			return alert("Sesi berakhir silakan login kembali");
		}
		try {
			const response = await axios
				.post(BASE_URL + "/presence?id=" + eventId + "&token=" + token)
				.then((res) => res.data);
			if (response === 1) {
				dispatch(
					openSnackbar({ severity: "success", message: "Anda berhasil absen pada " + new Date().toTimeString() })
				);
			}
		} catch (error) {
			const response = (error as any).response;
			const resText = response.data;
			dispatch(
				openSnackbar({ severity: "error", message: resText ?? "Absensi gagal! silakan coba beberapa saat lagi.." })
			);
		}
	};
	useEffect(() => {
		const generateQr = async () => {
			setIsLoading(true);
			try {
				const data = await axios.get(BASE_URL + "/presence/" + showQr.id).then((res) => res.data);
				setQr(data.qrSrc);
				setIsLoading(false);
			} catch (error) {
				dispatch(openSnackbar({ message: "Gagal memuat qr! coba lagi", severity: "error" }));
			}
			setIsLoading(false);
		};
		if (showQr.id) {
			generateQr();
		}
	}, [showQr.id]);
	if (status === "loading") {
		return <BackdropLoading />;
	}
	return (
		<SWRConfig value={{ fallback: props.fallback }}>
			<AdminLayout title="Event">
				<Container maxWidth="xl" sx={{ py: 4, minHeight: "80vh" }}>
					<Paper elevation={0} sx={{ p: 2 }}>
						{/* <Box className="bg-gray-100"> */}
						<Typography className="text-lg md:text-xl font-bold" variant="h4" component="h1">
							Event
						</Typography>
						<Grid container>
							<Grid item xs={12} md={6}>
								<List dense className="bg-white">
									{events &&
										events?.map((e) => (
											<ListItem key={e.id} disablePadding>
												<ListItemText className="flex-1">{e.eventName}</ListItemText>
												<Box className="inline-flex" component="span">
													<ListItemButton className="inline-flex flex-shrink">
														<Tooltip title="Absen event">
															<IconButton onClick={() => handlePresence(e.id!)}>
																<AssignmentIndRounded />
															</IconButton>
														</Tooltip>
													</ListItemButton>
													<ListItemButton className="inline-flex flex-shrink">
														<Tooltip title="show qr">
															<IconButton onClick={() => handleShowQr(e.id!)}>
																<QrCode2Rounded />
															</IconButton>
														</Tooltip>
													</ListItemButton>
												</Box>
											</ListItem>
										))}
								</List>
								{events && events!.length <= 0 && (
									<Typography className="text-center my-4">Tidak ada event berlangsung</Typography>
								)}
							</Grid>
						</Grid>
						{/* </Box> */}
					</Paper>
					<div className="bg-white mt-8 p-2">
						<Typography>Daftar Absen Event</Typography>
						<TableAbsensiUser rows={absens} />
					</div>
					{showQr.id && <QRDialog qr={qr} isLoading={isLoading} onClose={handleCloseQr} open={showQr.show} />}
				</Container>
			</AdminLayout>
		</SWRConfig>
	);
};

export default HOC(Event);

export const getStaticProps: GetStaticProps = async () => {
	const events = await axios.get(BASE_URL + "/events/getall").then((res) => res.data);

	return {
		props: {
			fallback: {
				"/events/getall": events,
			},
		},
	};
};

interface QRDialogProps {
	open: boolean;
	onClose: () => void;
	qr: any;
	isLoading: boolean;
}
const QRDialog = (props: QRDialogProps) => {
	const { qr, isLoading } = props;
	// const [qr, setQr] = useState<any>(null);
	// const [isLoading, setIsLoading] = useState(false);
	// const dispatch = useAppDispatch();

	return (
		<Dialog open={props.open} onClose={props.onClose}>
			<DialogContent>
				{!qr && isLoading ? (
					<Typography>Loading...</Typography>
				) : (
					qr && !isLoading && <Image src={qr} alt="QrCode" width={320} height={320} />
				)}
			</DialogContent>
		</Dialog>
	);
};
