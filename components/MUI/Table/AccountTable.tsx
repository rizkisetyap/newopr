import { DeleteRounded, EditRounded, VisibilityRounded } from "@mui/icons-material";
import {
	Paper,
	Box,
	Button,
	IconButton,
	Dialog,
	DialogTitle,
	Typography,
	DialogActions,
	DialogContent,
	Grid,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
} from "@mui/material";
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useFetch } from "data/Api";
import { ChangeEvent, FC, useState } from "react";
import { IEmploye, IGroup, IPosition } from "types/ModelInterface";
import BackdropLoading from "../BackdropLoading";
import BaseDataGrid from "../BaseDataGrid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import API from "lib/ApiCrud";
import { useAppDispatch } from "app/hooks";
export const columnsAccount: GridColDef[] = [
	{
		field: "npp",
		headerName: "NPP",
		minWidth: 150,
		flex: 1,
	},
	{
		field: "fullName",
		headerName: "Nama",
		minWidth: 200,
		flex: 2,
		valueGetter(params: GridValueGetterParams<any, IEmploye>) {
			return params.row.firstName + " " + params.row.lastName;
		},
	},
	{
		field: "position",
		headerName: "Jabatan",
		minWidth: 150,
		valueFormatter(params) {
			return params.value;
		},
		valueGetter: (params: GridValueGetterParams<any, IEmploye>) => {
			// console.log(params);
			return params.row.position?.positionName ?? "-";
		},
	},
	{
		field: "kelompok",
		headerClassName: "Kelompok",
		minWidth: 125,
		valueGetter(params: GridValueGetterParams<any, IEmploye>) {
			return params.row.group?.groupName ?? "-";
		},
	},
	{
		field: "phoneNumber",
		headerName: "No. Telp",
		minWidth: 150,
	},
	{
		field: "lastUpdate",
		headerName: "Update Terakhir",
		minWidth: 200,
		valueGetter(params: GridValueGetterParams<any, IEmploye>) {
			return params.row.updateDate;
		},
		valueFormatter(params) {
			return params.value;
		},
	},
	{
		field: "option",
		headerName: "Options",
		minWidth: 200,
		flex: 1,
		renderCell(params: GridRenderCellParams<any, IEmploye>) {
			const dispatch = useAppDispatch();
			const [open, setOpen] = useState(false);
			const [isView, setIsView] = useState(false);
			const handleOpenModalView = () => {
				setIsView(true);
				setOpen(true);
			};
			const handleOpenModalEdit = () => {
				setIsView(false);
				setOpen(true);
			};
			const hapus = () => {
				API.handleSoftDelete(params.row.npp, () => alert("Item deleted"), dispatch, "Employee");
			};
			return (
				<Box>
					<IconButton className="text-cyan-400" color="info" aria-label="Info" onClick={handleOpenModalView}>
						<VisibilityRounded />
					</IconButton>
					<IconButton color="primary" aria-label="Edit" onClick={handleOpenModalEdit}>
						<EditRounded />
					</IconButton>
					<IconButton onClick={hapus} color="error" aria-label="Hapus">
						<DeleteRounded />
					</IconButton>
					<ModalInfo open={open} data={params.row} onClose={() => setOpen(false)} isView={isView} />
				</Box>
			);
		},
	},
];
interface Props {
	employees: IEmploye[];
}
const AccountTable: FC<Props> = ({ employees }) => {
	const [pageSize, setPageSize] = useState(10);

	return (
		<Box overflow="hidden" minHeight={400}>
			<BaseDataGrid
				columns={columnsAccount}
				rows={employees}
				getRowId={(row) => row.npp}
				pageSize={pageSize}
				onPageSizeChange={(page) => setPageSize(page)}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
			/>
		</Box>
	);
};
export default AccountTable;

interface IModal {
	open: boolean;
	onClose: () => void;
	data: IEmploye;
	isView: boolean;
}
function ModalInfo(props: IModal) {
	const dispatch = useAppDispatch();
	const { data, onClose, open, isView } = props;
	const [formData, setFormData] = useState(data);
	const { data: jabatans, error: jabatansError } = useFetch<IPosition[]>("/positions/getall");
	const { data: kelompok, error: kelompokError } = useFetch<IGroup[]>("/groups/getall");
	const handleInputText = (event: ChangeEvent<HTMLInputElement>) => {
		setFormData((old) => ({
			...old,
			[event.target.name]: event.target.value,
		}));
	};
	const handleInputSelect = (event: SelectChangeEvent<String>) => {
		setFormData((old) => ({
			...old,
			[event.target.name]: event.target.value,
		}));
	};
	const onSuccess = () => {
		setTimeout(onClose, 1000);
	};
	const handleSaveUpdate = () => {
		API.handleUpdate<IEmploye>(formData, onSuccess, dispatch, "Employee");
	};
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>
				<Typography className="font-medium text-gray-600" variant="h5" component="span">
					{isView ? "Info" : "Edit"}
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							fullWidth
							margin="dense"
							size="small"
							variant="standard"
							name="npp"
							label="NPP"
							value={formData.npp}
							disabled={isView}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							fullWidth
							margin="dense"
							size="small"
							variant="standard"
							label="FIRSTNAME"
							name="firstName"
							value={formData.firstName}
							disabled={isView}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							fullWidth
							margin="dense"
							size="small"
							variant="standard"
							name="lastName"
							label="LASTNAME"
							value={formData.lastName}
							disabled={isView}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							fullWidth
							margin="dense"
							size="small"
							variant="standard"
							label="PHONENUMBER"
							name="phoneNumber"
							value={formData.phoneNumber}
							disabled={isView}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<FormControl variant="standard" fullWidth size="small" margin="dense" disabled={isView}>
							<InputLabel id="gender">GENDER</InputLabel>
							<Select
								variant="standard"
								labelId="gender"
								name="gender"
								id="gender-select"
								value={formData.gender}
								onChange={handleInputSelect}
							>
								<MenuItem value={0}>Male</MenuItem>
								<MenuItem value={1}>Female</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<FormControl variant="standard" fullWidth size="small" margin="dense" disabled={isView}>
							<InputLabel id="jabatan">Jabatan</InputLabel>
							<Select
								variant="standard"
								labelId="jabatan"
								id="jabatan-select"
								name="positionId"
								value={(formData?.positionId ?? "") as String}
								onChange={handleInputSelect}
							>
								<MenuItem value="">--jabatan--</MenuItem>
								{!jabatansError &&
									jabatans?.map((jabatan) => (
										<MenuItem key={jabatan.id} value={jabatan.id}>
											{jabatan.positionName}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<FormControl variant="standard" fullWidth margin="dense" size="small" disabled={isView}>
							<InputLabel id="kelompok">Kelompok</InputLabel>
							<Select
								fullWidth
								margin="dense"
								variant="standard"
								labelId="kelompok"
								name="groupId"
								value={(formData.groupId ?? "") as String}
								onChange={handleInputSelect}
							>
								<MenuItem value="">--kelompok--</MenuItem>
								{!kelompokError &&
									kelompok?.map((k) => (
										<MenuItem key={k.id} value={k.id}>
											{k.groupName}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<DesktopDatePicker
							disabled={isView}
							label="Tanggal Lahir"
							inputFormat="dd/MM/yyy"
							value={formData.dateOfBirth!}
							renderInput={(params) => (
								<TextField variant="standard" size="small" margin="dense" fullWidth {...params} />
							)}
							onChange={(date) => setFormData((old) => ({ ...old, dateOfBirth: date! }))}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				{isView ? (
					<Button className="bg-violet-700" onClick={onClose} color="secondary" variant="contained">
						Close
					</Button>
				) : (
					<>
						<Button className="bg-orange-600" color="warning" variant="contained" onClick={onClose}>
							Cancel
						</Button>
						<Button color="primary" variant="contained" className="bg-blue-600" onClick={handleSaveUpdate}>
							Save
						</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
}
