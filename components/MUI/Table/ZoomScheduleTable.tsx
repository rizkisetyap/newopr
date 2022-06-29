import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	TextField,
} from "@mui/material";
import { GridColDef, GridRenderCellParams, GridValueFormatterParams, GridValueGetterParams } from "@mui/x-data-grid";
import React, { ChangeEvent, FC, useState } from "react";
import { useFetch } from "data/Api";
import { IEmploye, IScheduler, IZoom, IZoomStatus } from "types/ModelInterface";
import BackdropLoading from "../BackdropLoading";
import BaseDataGrid from "../BaseDataGrid";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { useAppDispatch } from "app/hooks";
import API from "lib/ApiCrud";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AppDispatch } from "app/store";
import { ScopedMutator } from "swr/dist/types";
import { useSWRConfig } from "swr";
const columns: GridColDef[] = [
	{
		field: "id",
		headerName: "ID",
		minWidth: 30,
		valueGetter: (val) => {
			return val.id;
		},
	},
	{
		field: "activity",
		headerName: "Kegiatan",
		flex: 1,
		width: 100,
	},
	{
		field: "zoomAccount",
		headerName: "Zoom Account",
		minWidth: 150,
		valueGetter(params: GridValueGetterParams<any, IScheduler>) {
			return params.row.zoomModel?.name;
		},
	},
	{
		field: "link",
		headerName: "Link",
		minWidth: 200,
		flex: 1,
	},
	{
		field: "status",
		headerName: "Status",
		width: 125,
		valueGetter(params: GridValueGetterParams<any, IScheduler>) {
			return params.row.zoomStatus?.name;
		},
	},
	{
		field: "PIC",
		headerName: "PIC",
		minWidth: 200,
		valueGetter(params: GridValueGetterParams<any, IScheduler>) {
			return params.row.employee;
		},
		valueFormatter(params: GridValueFormatterParams<IEmploye>) {
			return params.value?.firstName ?? "" + " " + params.value?.lastName ?? "";
		},
	},
	{
		field: "options",
		headerName: "Options",
		minWidth: 100,
		renderCell(params: GridRenderCellParams<any, IScheduler>) {
			const dispatch = useAppDispatch();
			const { data: zoom } = useFetch<IZoom[]>("/zoom/getall");
			const { data: status } = useFetch<IZoomStatus[]>("/zoomStatus/getall");
			const { data: pic } = useFetch<IEmploye[]>("/employee");
			const [open, setOpen] = useState(false);
			const { mutate } = useSWRConfig();
			const onSuccess = () => {
				mutate("/zoomScheduler/getall");
			};
			const handleDelete = () => {
				API.handleDeleteById<IScheduler>(params.row.id!, onSuccess, dispatch, "ZoomScheduler");
			};
			return (
				<Box>
					<IconButton aria-label="Edit" color="primary">
						<EditRounded />
					</IconButton>
					<IconButton aria-label="Delete" color="error" onClick={handleDelete}>
						<DeleteRounded />
					</IconButton>

					<ModalForm
						dispatch={dispatch}
						mutate={mutate}
						onClose={() => setOpen(false)}
						schedule={params.row}
						open={open}
						zooms={zoom!}
						status={status!}
						pic={pic!}
					/>
				</Box>
			);
		},
	},
];
interface TableProps {
	schedule: IScheduler[];
}
const ZoomScheduleTable: FC<TableProps> = ({ schedule }) => {
	const [pageSize, setPageSize] = useState(10);
	return (
		<Box overflow="hidden" minHeight={400}>
			<BaseDataGrid
				autoHeight
				pageSize={pageSize}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
				onPageSizeChange={(size) => setPageSize(size)}
				columns={columns}
				rows={schedule}
				getRowId={(row) => row.id}
			/>
		</Box>
	);
};

export default ZoomScheduleTable;
interface IModalForm {
	open: boolean;
	onClose: () => void;
	dispatch: AppDispatch;
	status: IZoomStatus[];
	zooms: IZoom[];
	pic: IEmploye[];
	mutate: ScopedMutator;
	schedule: IScheduler;
}
function ModalForm(props: IModalForm) {
	const [formData, setFormData] = useState(props.schedule);
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
