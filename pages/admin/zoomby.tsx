import { AddCircleRounded } from "@mui/icons-material";
import {
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useAppDispatch } from "app/hooks";
import { AppDispatch } from "app/store";
import HOC from "components/HOC/HOC";
import AdminLayout from "components/Layout/AdminLayout";
import ZoomScheduleTable from "components/MUI/Table/ZoomScheduleTable";
import { useFetch } from "data/Api";
import React, { ChangeEvent, useState } from "react";
import { IEmploye, IFallback, IScheduler, IZoom, IZoomStatus } from "types/ModelInterface";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import API from "lib/ApiCrud";
import { SWRConfig, useSWRConfig } from "swr";
import { ScopedMutator } from "swr/dist/types";
import { GetStaticProps } from "next";
import axios from "axios";
import { BASE_URL } from "lib/constants";

interface Props {
	fallbackScheduler: IFallback;
	// zoom: IZoom[];
	// status: IZoomStatus[];
	// pic: IEmploye[];
}
function Zoomby(props: Props) {
	const [open, setOpen] = useState(false);
	const { data: schedulers } = useFetch<IScheduler[]>("/zoomScheduler/getall");
	const { data: zoom } = useFetch<IZoom[]>("/zoom/getall");
	const { data: status } = useFetch<IZoomStatus[]>("/zoomStatus/getall");
	const { data: pic } = useFetch<IEmploye[]>("/employee");
	const dispatch = useAppDispatch();
	const { mutate } = useSWRConfig();
	return (
		<AdminLayout title="ZoomBy">
			<Container
				maxWidth="xl"
				sx={{
					py: 4,
				}}
			>
				<Paper
					elevation={0}
					sx={{
						p: 2,
					}}
				>
					<Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="space-between">
						<Typography className="text-gray-600" variant="h5" mb={{ xs: 2, md: 0 }}>
							Zoom Scheduler
						</Typography>
						<Button
							size="small"
							startIcon={<AddCircleRounded />}
							variant="contained"
							color="success"
							className="bg-green-600"
							onClick={() => setOpen(true)}
						>
							Tambah data
						</Button>
					</Box>
					{schedulers ? (
						<Box mt={2}>
							<ZoomScheduleTable schedule={schedulers} />
						</Box>
					) : (
						<Typography variant="body2">Error loading data</Typography>
					)}
				</Paper>
				<ModalForm
					mutate={mutate}
					pic={pic ?? []}
					zooms={zoom ?? []}
					status={status ?? []}
					open={open}
					onClose={() => setOpen(false)}
					dispatch={dispatch}
				/>
			</Container>
		</AdminLayout>
	);
}

export default HOC(Zoomby);
interface IModalForm {
	open: boolean;
	onClose: () => void;
	dispatch: AppDispatch;
	status: IZoomStatus[];
	zooms: IZoom[];
	pic: IEmploye[];
	mutate: ScopedMutator;
}
const initForm: IScheduler = {
	activity: "",
	link: "",
	startDate: new Date().toISOString(),
	endDate: new Date().toISOString(),
};
function ModalForm(props: IModalForm) {
	const [formData, setFormData] = useState(initForm);
	const { dispatch, onClose, open, zooms, status, pic, mutate } = props;

	const handleInputText = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((old) => ({
			...old,
			[e.target.name]: e.target.value,
		}));
	};
	const handleInputSelect = (e: SelectChangeEvent<string | number>) => {
		setFormData((old) => ({
			...old,
			[e.target.name]: e.target.value,
		}));
	};
	const onSuccess = () => {
		mutate("/zoomScheduler/getall");
		setFormData(initForm);
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		API.handlePost<IScheduler>(formData, onSuccess, dispatch, "ZoomScheduler");
	};
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<DialogTitle className="bg-slate-900 text-white">New Zoom Meeting</DialogTitle>
				<DialogContent className="my-6">
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								margin="dense"
								variant="standard"
								label="Agenda"
								name="activity"
								value={formData.activity}
								onChange={handleInputText}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth margin="dense" variant="standard">
								<InputLabel id="employeeNPP">PIC</InputLabel>
								<Select
									name="employeeNPP"
									value={formData.employeeNPP ?? ""}
									labelId="employeeNPP"
									onChange={handleInputSelect}
								>
									{pic?.map((p) => (
										<MenuItem key={p.npp} value={p.npp}>
											{p.firstName}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								margin="dense"
								variant="standard"
								label="Link"
								name="link"
								value={formData.link}
								onChange={handleInputText}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth margin="dense" variant="standard">
								<InputLabel id="zoomId">Zoom Account</InputLabel>
								<Select
									name="zoomId"
									labelId="zoomId"
									value={formData?.zoomId ?? ""}
									onChange={handleInputSelect}
								>
									{zooms?.map((z) => (
										<MenuItem key={z.id} value={z.id}>
											{z.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth margin="dense" variant="standard">
								<InputLabel id="zoomStatusId">Status</InputLabel>
								<Select
									labelId="zoomStatusId"
									label="Status"
									name="zoomStatusId"
									value={formData.zoomStatusId ?? ""}
									onChange={handleInputSelect}
								>
									{status?.map((s) => (
										<MenuItem key={s.id} value={s.id}>
											{s.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							{/* <DateTimePicker
								value={formData.startDate}
								label="Start date"
								onChange={(date) => setFormData((old) => ({ ...old, startDate: date }))}
								renderInput={(params) => (
									<TextField {...params} fullWidth variant="standard" margin="dense" name="startDate" />
								)}
							/> */}
							<input
								type="datetime-local"
								name="startDate"
								onChange={(e) => setFormData((old) => ({ ...old, startDate: e.target.value }))}
								value={formData.startDate!}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<DateTimePicker
								value={formData.endDate}
								label="End date"
								onChange={(date) => setFormData((old) => ({ ...old, endDate: date }))}
								renderInput={(params) => (
									<TextField {...params} fullWidth variant="standard" margin="dense" name="endDate" />
								)}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions className="bg-slate-900 text-white">
					<Button variant="contained" color="warning" className="bg-orange-600" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSave} variant="contained" color="primary" className="bg-blue-600">
						Save
					</Button>
				</DialogActions>
			</LocalizationProvider>
		</Dialog>
	);
}
