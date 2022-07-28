import {
	Button,
	CircularProgress,
	Container,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";
import HOC from "components/HOC/HOC";
import AdminLayout from "components/Layout/AdminLayout";
import { BASE_URL, formatDate } from "lib/constants";
import { GetStaticProps } from "next";
import React, { useEffect } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useFetch } from "data/Api";
import { useSession } from "next-auth/react";
import BackdropLoading from "components/MUI/BackdropLoading";
import { useAppDispatch, useAppSelector } from "app/hooks";
import API from "lib/ApiCrud";
import moment from "moment";
import "moment/locale/id";
import cn from "classnames";
export interface IApproval {
	npp: string;
	nama: string;
	jabatan: string;
}
interface Props {}
interface IState {
	nama?: string;
	userId?: string;
	tanggal?: Date;
	jamMulai?: Date;
	jamSelesai?: Date;
	alasan?: string;
	approvalId?: string;
}
const initialState: IState = {
	nama: "",
	userId: "",
	tanggal: new Date(),
	jamMulai: new Date(),
	jamSelesai: new Date(),
	alasan: "",
	approvalId: "",
};

export interface ISurat {
	id: string;
	tanggal: string;
	mulai: string;
	selesai: string;
	approval: string;
	status: string;
	catatan: null | string;
	keterangan: string;
	statusId: number;
}
const Page = (props: Props) => {
	const { data: session, status } = useSession({ required: true });
	const [state, setState] = React.useState<IState>(initialState);
	const isLoading = useAppSelector((s) => s.action.isLoading);
	const dispatch = useAppDispatch();
	const groupId = session?.user?.employee.service?.groupId ?? session?.user.employee.groupId;
	const { data: approvals } = useFetch<IApproval[]>("/RequestLembur/GetApproval?GroupId=" + groupId);
	const [surats, setSurats] = React.useState<ISurat[]>([]);

	const handleChangeDate = (date: Date | null, name: string) => {
		if (date) {
			setState({ ...state, [name]: formatDate(date) });
		}
	};
	const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, [e.target.name]: e.target.value });
	};
	const handleSelectChange = (e: SelectChangeEvent<string>) => {
		setState({ ...state, [e.target.name]: e.target.value });
	};
	const onSuccess = () => {
		setState(initialState);
	};
	const handleSave = () => {
		const d = { ...state, userId: session?.user.npp };
		API.handlePost<IState>(d, onSuccess, dispatch, "RequestLembur/create");
	};

	useEffect(() => {
		const getSurats = async () => {
			const { data } = await axios.get<ISurat[]>(`${BASE_URL}/RequestLembur/GetSurat?npp=${session?.user.npp}`);
			setSurats(data);
		};
		if (session?.user.npp) {
			getSurats();
		}
	}, [session?.user.npp]);

	if (status === "loading") {
		return <BackdropLoading />;
	}
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<AdminLayout title="Buat Form Lembur">
				<Container maxWidth="xl" sx={{ py: 4, minHeight: "80vh" }}>
					<Typography>Form Lembur / Overtime</Typography>

					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										fullWidth
										margin="dense"
										name="nama"
										size="small"
										variant="standard"
										label="nama"
										value={state.nama}
										onChange={handleChangeInput}
									/>
								</Grid>
								<Grid item xs={12}>
									<DateTimePicker
										value={state.tanggal}
										onChange={(date) => handleChangeDate(date!, "tanggal")}
										label="Tanggal"
										renderInput={(params) => (
											<TextField margin="dense" size="small" fullWidth variant="standard" {...params} />
										)}
									/>
								</Grid>
								<Grid item xs={12}>
									<DateTimePicker
										value={state.jamMulai}
										label="Jam Mulai"
										onChange={(date) => handleChangeDate(date!, "jamMulai")}
										renderInput={(params) => (
											<TextField margin="dense" size="small" fullWidth variant="standard" {...params} />
										)}
									/>
								</Grid>
								<Grid item xs={12}>
									<DateTimePicker
										value={state.jamSelesai}
										onChange={(date) => handleChangeDate(date!, "jamSelesai")}
										label="Jam Selesai"
										renderInput={(params) => (
											<TextField margin="dense" size="small" fullWidth variant="standard" {...params} />
										)}
									/>
								</Grid>
								<Grid item xs={12}>
									<FormControl variant="standard" size="small" margin="dense" fullWidth>
										<InputLabel id="approvalId">Pilih Approval</InputLabel>
										<Select
											value={state.approvalId}
											onChange={handleSelectChange}
											name="approvalId"
											labelId="approvalId"
										>
											{approvals?.map((approval) => (
												<MenuItem key={approval.npp} value={approval.npp}>
													{approval.nama}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<TextField
										multiline
										margin="dense"
										name="alasan"
										value={state.alasan}
										onChange={handleChangeInput}
										size="small"
										fullWidth
										variant="standard"
										label="Keterangan"
									/>
								</Grid>
								<Grid item xs={12}>
									<Button
										disabled={isLoading}
										onClick={handleSave}
										className="bg-blue-600"
										variant="contained"
										color="primary"
									>
										Save
										{isLoading && <CircularProgress size="small" />}
									</Button>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} md={6}>
							<div>
								<Typography className="text-center text-lg md:text-xl">Surat Lembur</Typography>
								<div className=" md:max-h-[80vh] md:overflow-auto">
									<div className="flex flex-col p-4">
										{surats?.map((lembur) => (
											<div
												className={cn("w-96 mx-auto  rounded-md shadow-md overflow-hidden", {
													["bg-orange-200 text-orange-700 border-r-[5px] border-r-orange-500"]:
														lembur.statusId === 1,
													["bg-green-200 text-green-700 border-r-[5px] border-r-green-600"]:
														lembur.statusId === 2,
													["bg-red-200 border-r-[5px] text-red-700 border-red-600"]: lembur.statusId === 3,
												})}
											>
												<div className="p-3" key={lembur.id}>
													<div className="relative">
														<Typography className="absolute text-xs bg-orange-600 text-white p-1 rounded-sm top-0 right-0">
															<span>{lembur.status}</span>
															<br />
															<span>
																{lembur.statusId === 1 && lembur.approval}
																{lembur.statusId === 2 && "By " + lembur.approval}
																{lembur.statusId === 3 && "By " + lembur.approval}
															</span>
														</Typography>
														<div>
															<Typography className="text-base md:text-md">
																{lembur.keterangan}
															</Typography>
															<Typography className="text-sm">
																<span>Waktu : </span>
																<span>{moment(lembur.mulai).format("HH:mm")}</span>-
																<span>{moment(lembur.selesai).format("HH:mm")}</span>
															</Typography>
														</div>
														<div>
															<Typography variant="body2">
																{moment(lembur.tanggal).format("DD/MM/YYYY")}
															</Typography>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</Grid>
					</Grid>
				</Container>
			</AdminLayout>
		</LocalizationProvider>
	);
};

export default HOC(Page);
