import { EditRounded, VisibilityRounded } from "@mui/icons-material";
import {
	Paper,
	CircularProgress,
	Box,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	IconButton,
	Grid,
	TextField,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useAppDispatch } from "app/hooks";
import DeleteButton from "components/ActionButton/DeleteButton";
import EditLink from "components/EditLink";
import { useFetch } from "data/Api";
import API, { handleSoftDelete } from "lib/ApiCrud";
import { handleDeleteEvent } from "lib/ApiEvent";
import { formatDate } from "lib/constants";
import Link from "next/link";
import { ChangeEvent, FC, MouseEvent, useState } from "react";
import { useSWRConfig } from "swr";
import { ScopedMutator } from "swr/dist/types";
import { IEvent } from "types/ModelInterface";
import BaseDataGrid from "../BaseDataGrid";

export const columnsAccount: GridColDef[] = [
	{
		field: "eventName",
		headerName: "Nama",
		minWidth: 120,
		flex: 1,
	},
	{
		field: "eventTheme",
		headerName: "Tema",
		minWidth: 120,
		flex: 1,
	},
	{
		field: "startDate",
		headerName: "Tgl Mulai",
		minWidth: 120,
		flex: 1,
	},
	{
		field: "endDate",
		headerName: "Tgl Selesai",
		minWidth: 120,
		flex: 1,
	},
	{
		field: "organizer",
		headerName: "Organizer",
		minWidth: 120,
		flex: 1,
	},
	{
		field: "location",
		headerName: "Tempat",
		minWidth: 120,
		flex: 1,
	},
	{
		field: "isActive",
		headerName: "Status",
		minWidth: 120,
		flex: 1,
		valueFormatter: (params) => {
			if (params.value) {
				return "Active";
			}
			return "Not active";
		},
		renderCell: (params) => {
			return (
				<Typography
					className={`
          rounded text-small text-white py-[4px] px-2
          ${params.row.isActive ? "bg-green-600" : "bg-orange-600"}
          `}
					variant="body2"
				>
					{params.formattedValue}
				</Typography>
			);
		},
	},
	{
		field: "options",
		headerName: "Options",
		sortable: false,
		hideable: false,
		minWidth: 120,
		flex: 1,
		renderCell: (params) => {
			const dispatch = useAppDispatch();
			const { mutate } = useSWRConfig();
			const [open, setOpen] = useState(false);
			const [isView, setIsView] = useState(true);
			const onSuccess = () => {
				mutate("/events/getall");
			};
			const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
				e.stopPropagation();
				handleSoftDelete(params.row.id, onSuccess, dispatch, "events");
			};
			const handleClickInfo = () => {
				setOpen(true);
				setIsView(true);
			};
			const handleClickUpdate = () => {
				setOpen(true);
				setIsView(false);
			};
			return (
				<Box>
					{/* <IconButton onClick={handleClickInfo} className="text-blue-400" aria-label="Info">
						<VisibilityRounded />
					</IconButton> */}
					<IconButton aria-label="Edit" onClick={handleClickUpdate} color="primary">
						<EditRounded />
					</IconButton>
					<DeleteButton onClick={handleDelete} />
					<ModalForm
						open={open}
						onClose={() => setOpen(false)}
						event={params.row}
						isView={isView}
						mutate={mutate}
					/>
				</Box>
			);
		},
	},
];
interface Props {
	events: IEvent[];
}
const EventTable: FC<Props> = ({ events }) => {
	const [pageSize, setPageSize] = useState(10);

	return (
		<Box overflow="hidden" minHeight={400}>
			<BaseDataGrid
				autoHeight
				columns={columnsAccount}
				rows={events}
				getRowId={(row) => row.id}
				pageSize={pageSize}
				onPageSizeChange={(size) => setPageSize(size)}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
			/>
		</Box>
	);
};

export default EventTable;
interface IModalForm {
	open: boolean;
	onClose: () => void;
	event: IEvent;
	isView: boolean;
	mutate: ScopedMutator;
}

function ModalForm(props: IModalForm) {
	const { onClose, open, event, isView, mutate } = props;
	const dispatch = useAppDispatch();

	const [formData, setFormData] = useState(event);
	const handleInputText = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((old) => ({
			...old,
			[e.target.name]: e.target.value,
		}));
	};
	const onSuccess = () => {
		mutate("/events/getall");
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		console.log(formData);
		return;
		API.handleUpdate<IEvent>(formData, onSuccess, dispatch, "events");
	};
	return (
		<Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
			<DialogTitle className="bg-slate-900 text-white">{isView ? "Detail" : "Edit"} Event</DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							name="eventName"
							value={formData.eventName}
							label="Nama Event"
							onChange={handleInputText}
							disabled={isView}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							name="eventTheme"
							label="Tema"
							value={formData.eventTheme}
							onChange={handleInputText}
							disabled={isView}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							name="organizer"
							label="Organizer"
							value={formData.organizer}
							onChange={handleInputText}
							disabled={isView}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							name="location"
							label="Lokasi"
							value={formData.location}
							onChange={handleInputText}
							disabled={isView}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							type="datetime-local"
							disabled={isView}
							value={formData.startDate}
							label="Start date"
							onChange={(e) => setFormData((old) => ({ ...old, startDate: e.target.value }))}
							// renderInput={(params) => <TextField margin="dense" fullWidth variant="standard" {...params} />}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<DateTimePicker
							disabled={isView}
							value={formData.endDate}
							label="End Date"
							onChange={(date) => setFormData((old) => ({ ...old, endDate: formatDate(date!) }))}
							renderInput={(params) => <TextField variant="standard" margin="dense" fullWidth {...params} />}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions className="bg-slate-900 text-white">
				{isView ? (
					<Button variant="contained" color="secondary" className="bg-violet-700" onClick={onClose}>
						Close
					</Button>
				) : (
					<>
						<Button variant="contained" color="warning" className="bg-orange-600" onClick={onClose}>
							Cancel
						</Button>
						<Button variant="contained" color="primary" className="bg-blue-600" onClick={handleSave}>
							Save
						</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
}
