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
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useFetch } from "data/Api";
import { ChangeEvent, FC, useState } from "react";
import { IEmploye, IPosition, IService } from "types/ModelInterface";
import BaseDataGrid from "../BaseDataGrid";
import API from "lib/ApiCrud";
import { useAppDispatch } from "app/hooks";
import { useSWRConfig } from "swr";
import { ScopedMutator } from "swr/dist/types";
import { formatDate } from "lib/constants";
import { DateTimePicker } from "@mui/x-date-pickers";
import { IGroup } from "types/ModelInterface";
export const columnsAccount: GridColDef[] = [
	{
		field: "npp",
		headerName: "NPP",
		minWidth: 70,
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
		field: "layanan",
		headerClassName: "Layanan",
		flex: 2,
		minWidth: 225,
		valueGetter(params: GridValueGetterParams<any, IEmploye>) {
			return params.row.service?.name + " " + "(" + params.row.service?.group?.groupName + ")";
		},
	},
	{
		field: "phoneNumber",
		headerName: "No. Telp",
		minWidth: 150,
	},
	{
		field: "option",
		headerName: "Options",
		minWidth: 200,
		flex: 1,
		renderCell(params: GridRenderCellParams<any, IEmploye>) {
			const dispatch = useAppDispatch();
			const [open, setOpen] = useState(false);
			const { mutate } = useSWRConfig();
			const handleOpenModalEdit = () => {
				setOpen(true);
			};
			const onSuccess = () => {
				mutate("/employee");
			};
			const hapus = () => {
				const confirmed = confirm("Yakin ?");
				if (!confirmed) {
					return;
				}
				API.handleSoftDelete(params.row.npp, onSuccess, dispatch, "Employee");
			};
			return (
				<Box>
					<IconButton color="primary" aria-label="Edit" onClick={handleOpenModalEdit}>
						<EditRounded />
					</IconButton>
					<IconButton onClick={hapus} color="error" aria-label="Hapus">
						<DeleteRounded />
					</IconButton>
					<ModalInfo mutate={mutate} open={open} data={params.row} onClose={() => setOpen(false)} />
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
				autoHeight
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
	mutate: ScopedMutator;
}
function ModalInfo(props: IModal) {
	const dispatch = useAppDispatch();
	const { data, onClose, open, mutate } = props;
	const [formData, setFormData] = useState(data);
	const { data: jabatans, error: jabatansError } = useFetch<IPosition[]>("/positions/getall");
	const { data: layanan, error: servicesError } = useFetch<IService[]>("/services");
	const [isUserIso, setIsUserIso] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isAdminISO, setIsAdminISO] = useState(false);
	const [isUser, setIsUser] = useState(true);
	const { data: kelompoks } = useFetch<IGroup[]>("/groups/getall");
	const handleInputText = (event: ChangeEvent<HTMLInputElement>) => {
		setFormData((old) => ({
			...old,
			[event.target.name]: event.target.value,
		}));
	};
	const handleInputSelect = (event: SelectChangeEvent<String | number>) => {
		setFormData((old) => ({
			...old,
			[event.target.name]: event.target.value,
		}));
	};
	const onSuccess = () => {
		mutate("/employee");
		setTimeout(onClose, 500);
	};
	const handleSaveUpdate = () => {
		if (!isUser && !isAdmin) return alert("Role harus diisi");
		const roleAdmin = {
			id: "1",
			roleName: "Admin",
		};
		const roleUser = {
			id: "2",
			roleName: "User",
		};
		const userIso = {
			id: "3",
			roleName: "UserIso",
		};
		const roleAdminISO = {
			id: "4",
			roleName: "AdminISO",
		};
		const roles = [];
		if (isAdmin) roles.push(roleAdmin);
		if (isUser) roles.push(roleUser);
		if (isUserIso) roles.push(userIso);
		if (isAdminISO) roles.push(roleAdminISO);
		const data = {
			employee: formData,
			roles,
		};
		// return;
		API.handleUpdate<any>(data, onSuccess, dispatch, "Employee");
	};
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>
				<Typography className="font-medium text-gray-600" variant="h5" component="span">
					Edit
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
							onChange={handleInputText}
						/>
					</Grid>
					{!isUserIso && !isAdminISO && (
						<Grid item xs={12} sm={4}>
							<FormControl variant="standard" fullWidth size="small" margin="dense">
								<InputLabel id="groupId">Kelompok</InputLabel>
								<Select
									variant="standard"
									labelId="groupId"
									// id="kelompok-select"
									name="groupId"
									value={formData?.groupId ?? ""}
									onChange={handleInputSelect}
								>
									{/* {isLoadingGroup && <MenuItem value={0}>Loading...</MenuItem>} */}
									{kelompoks?.map((g) => (
										<MenuItem key={g!.id} value={g.id}>
											{g.groupName}
										</MenuItem>
									))}
									{/* <MenuItem value="1">Female</MenuItem> */}
								</Select>
							</FormControl>
						</Grid>
					)}
					<Grid item xs={12} sm={6} md={4}>
						<FormControl variant="standard" fullWidth size="small" margin="dense">
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
						<FormControl variant="standard" fullWidth size="small" margin="dense">
							<InputLabel id="jabatan">Jabatan</InputLabel>
							<Select
								labelId="jabatan"
								id="jabatan-select"
								name="positionId"
								value={formData.positionId}
								onChange={handleInputSelect}
							>
								{!jabatansError &&
									jabatans?.map((jabatan) => (
										<MenuItem key={jabatan.id} value={jabatan.id}>
											{jabatan.positionName}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</Grid>
					{isUserIso ||
						(isAdminISO && (
							<Grid item xs={12} sm={6} md={4}>
								<FormControl variant="standard" fullWidth margin="dense" size="small">
									<InputLabel id="kelompok">Layanan</InputLabel>
									<Select
										fullWidth
										margin="dense"
										variant="standard"
										labelId="kelompok"
										name="serviceId"
										value={formData.serviceId ?? ""}
										onChange={handleInputSelect}
									>
										{layanan?.map((k) => (
											<MenuItem key={k.id} value={k.id}>
												{k.name} {k.group?.groupName}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						))}
					<Grid item xs={12} sm={6} md={4}>
						<DateTimePicker
							label="Tanggal Lahir"
							value={formData.dateOfBirth!}
							renderInput={(params) => (
								<TextField variant="standard" size="small" margin="dense" fullWidth {...params} />
							)}
							onChange={(date) => setFormData((old) => ({ ...old, dateOfBirth: formatDate(date!) }))}
						/>
						{/* <TextField
							type="datetime-local"
							fullWidth
							margin="dense"
							variant="standard"
							label="Tanggal Lahir"
							value={formData.dateOfBirth}
							onChange={(e) => setFormData((old) => ({ ...old, dateOfBirth: e.target.value }))}
						/> */}
					</Grid>
					<Grid item xs={12}>
						<Typography>Kewenagan Modul</Typography>
						<div>
							<FormControlLabel
								label="Admin"
								control={
									<Checkbox
										checked={isAdmin}
										onChange={(e) => setIsAdmin(e.target.checked)}
										inputProps={{
											"aria-label": "Admin",
										}}
										size="medium"
										sx={{
											"&.MuiSvgIcon-root": { fontSize: 28 },
										}}
									/>
								}
							/>
							<FormControlLabel
								label="User"
								control={
									<Checkbox
										checked={isUser}
										onChange={(e) => setIsUser(e.target.checked)}
										inputProps={{
											"aria-label": "User",
										}}
										size="medium"
										sx={{
											"&.MuiSvgIcon-root": { fontSize: 28 },
										}}
									/>
								}
							/>
							<FormControlLabel
								label="User Iso"
								control={
									<Checkbox
										checked={isUserIso}
										onChange={(e) => setIsUserIso(e.target.checked)}
										inputProps={{
											"aria-label": "User Iso",
										}}
										size="medium"
										sx={{
											"&.MuiSvgIcon-root": { fontSize: 28 },
										}}
									/>
								}
							/>
							<FormControlLabel
								label="Admin ISO"
								control={
									<Checkbox
										checked={isAdminISO}
										onChange={(e) => setIsAdminISO(e.target.checked)}
										inputProps={{
											"aria-label": "Peserta",
										}}
										size="medium"
										sx={{
											"&.MuiSvgIcon-root": { fontSize: 28 },
										}}
									/>
								}
							/>
						</div>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button className="bg-orange-600" color="warning" variant="contained" onClick={onClose}>
					Cancel
				</Button>
				<Button color="primary" variant="contained" className="bg-blue-600" onClick={handleSaveUpdate}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
