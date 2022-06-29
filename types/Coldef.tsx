import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { GridColDef, GridRenderCellParams, GridValueFormatterParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useAppDispatch } from "app/hooks";
import { AppDispatch } from "app/store";
import DeleteButton from "components/ActionButton/DeleteButton";
import EditButton from "components/ActionButton/EditButton";
import CancelButton from "components/DialogButton/CancelButton";
import SaveButton from "components/DialogButton/SaveButton";
import { useFetch } from "data/Api";
import API from "lib/ApiCrud";
import { useState } from "react";
import { mutate, useSWRConfig } from "swr";
import { IGroup, IService } from "./ModelInterface";

export const columnServices: GridColDef[] = [
	{
		field: "id",
		headerName: "ID",
		width: 50,
	},
	{
		field: "name",
		headerName: "Layanan",
		minWidth: 150,
		flex: 1,
	},
	{
		field: "kategoriService",
		headerName: "Jenis Layanan",
		minWidth: 200,
		flex: 1,
		valueGetter(params: GridValueGetterParams<any, IService>) {
			// console.log(params);
			return params.row.kategoriService;
		},
		valueFormatter(params: GridValueFormatterParams<number>) {
			switch (params.value) {
				case 0:
					return "Transasksi";
				case 1:
					return "Aktivitas";
				default:
					return "Laporan";
			}
		},
	},
	{
		field: "group",
		headerName: "Kelompok",
		minWidth: 200,
		valueGetter(params: GridValueGetterParams<any, IService>) {
			return params.row.group?.groupName ?? "-";
		},
	},
	{
		field: "options",
		headerName: "Options",
		renderCell(params: GridRenderCellParams<any, IService>) {
			const dispatch = useAppDispatch();
			const [open, setOpen] = useState(false);
			const { data: groups } = useFetch<IGroup[]>("/groups/getall");
			const onSuccess = () => {
				mutate("/service");
			};
			const hapus = () => {
				API.handleDeleteById(params.row.id!, onSuccess, dispatch, "service");
			};
			return (
				<Box>
					<DeleteButton onClick={(e) => hapus()} />
					<EditButton onClick={() => setOpen(true)} />
					<ModalForm
						open={open}
						onClose={() => setOpen(false)}
						dispatch={dispatch}
						groups={groups ?? []}
						initForm={params.row}
					/>
				</Box>
			);
		},
	},
];

interface ModalForm {
	open: boolean;
	onClose: () => void;
	groups: IGroup[];
	dispatch: AppDispatch;
	initForm: IService;
}

function ModalForm(props: ModalForm) {
	const [formData, setFormData] = useState(props.initForm);
	const { groups, onClose, open, dispatch } = props;
	const { mutate } = useSWRConfig();

	const onSuccess = () => {
		mutate("/service");
		setTimeout(onClose, 500);
	};
	const handleSave = () => {
		API.handleUpdate<IService>(formData, onSuccess, dispatch, "service");
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle className="bg-slate-900 text-white"></DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Nama"
							name="name"
							onChange={(e) => setFormData((old) => ({ ...old, name: e.target.value }))}
							value={formData.name}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth margin="dense" variant="standard">
							<InputLabel id="groupId">Kelompok</InputLabel>
							<Select
								name="groupId"
								onChange={(e) => setFormData((old) => ({ ...old, groupId: e.target.value }))}
								value={formData.groupId ?? ""}
							>
								{groups.map((g) => (
									<MenuItem key={g.id} value={g.id}>
										{g.groupName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth margin="dense" variant="standard">
							<InputLabel id="kategoriService">Jenis Layanan</InputLabel>
							<Select
								name="kategoriservice"
								onChange={(e) =>
									setFormData((old) => ({
										...old,
										kategoriService: e.target.value,
									}))
								}
								value={formData.kategoriService ?? ""}
							>
								<MenuItem value={0}>Transaksi</MenuItem>
								<MenuItem value={1}>Aktivitas</MenuItem>
								<MenuItem value={2}>Laporan</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions className="bg-slate-900 text-white">
				<CancelButton onClick={onClose} />
				<SaveButton onClick={handleSave} />
			</DialogActions>
		</Dialog>
	);
}
