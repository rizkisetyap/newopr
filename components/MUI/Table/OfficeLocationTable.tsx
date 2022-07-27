import { EditRounded } from "@mui/icons-material";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	TextField,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useAppDispatch } from "app/hooks";
import DeleteButton from "components/ActionButton/DeleteButton";
import { useFetch } from "data/Api";
import API from "lib/ApiCrud";
import { handleDeleteLocation } from "lib/ApiLocation";
import React, { ChangeEvent, FC, SyntheticEvent, useState } from "react";
import { useSWRConfig } from "swr";
import { ScopedMutator } from "swr/dist/types";
import { ILocation } from "types/ModelInterface";
import BackdropLoading from "../BackdropLoading";
import BaseDataGrid from "../BaseDataGrid";
const cols: GridColDef[] = [
	{
		field: "id",
		headerName: "ID",
		width: 50,
	},
	{
		field: "name",
		headerName: "Nama",
		minWidth: 200,
		flex: 1,
	},
	{
		field: "address",
		headerName: "Alamat",
		minWidth: 250,
	},
	{
		field: "latitude",
		headerName: "Latitude",
		minWidth: 150,
	},
	{
		field: "longitude",
		headerName: "Longitude",
		width: 150,
	},
	{
		field: "description",
		headerName: "Deskripsi",
		minWidth: 200,
	},
	{
		field: "options",
		headerName: "Options",
		sortable: false,
		hideable: false,
		type: "actions",
		minWidth: 150,
		renderCell: (params) => {
			const dispatch = useAppDispatch();
			const [open, setOpen] = useState(false);
			const { mutate } = useSWRConfig();
			const onSuccess = () => {
				mutate("/officeLocation");
			};
			const handleDelete = (e: SyntheticEvent) => {
				e.stopPropagation();
				API.handleDelete<ILocation>(onSuccess, dispatch, "officelocation", params.row);
			};

			return (
				<Box>
					<IconButton color="primary" aria-label="Edit" onClick={() => setOpen(true)}>
						<EditRounded />
					</IconButton>
					<DeleteButton onClick={handleDelete} />
					<ModalForm open={open} onClose={() => setOpen(false)} location={params.row} mutate={mutate} />
				</Box>
			);
		},
	},
];

interface TableProps {
	locations: ILocation[];
}
const OfficeTable: FC<TableProps> = ({ locations }) => {
	const [pageSize, setPageSize] = useState(10);

	return (
		<Box overflow="hidden" minHeight={400}>
			<BaseDataGrid
				columns={cols}
				getRowId={(row) => row.id}
				rows={locations}
				autoHeight
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
				pageSize={pageSize}
				onPageSizeChange={(size) => setPageSize(size)}
			/>
		</Box>
	);
};

export default OfficeTable;
interface IModalForm {
	open: boolean;
	onClose: () => void;
	location: ILocation;
	mutate: ScopedMutator;
}
function ModalForm(props: IModalForm) {
	const dispatch = useAppDispatch();
	const { open, onClose, location, mutate } = props;
	const [formData, setFormData] = useState(location);
	const handleInputText = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
	};
	const onSuccess = () => {
		mutate("/officeLocation");
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		API.handleUpdate<ILocation>(formData, onSuccess, dispatch, "OfficeLocation");
	};
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle className="bg-slate-900 text-white">New Location</DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12} sm={4}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Nama"
							name="name"
							onChange={handleInputText}
							value={formData.name}
						/>
					</Grid>
					<Grid item xs={12} sm={8}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Alamat"
							name="address"
							onChange={handleInputText}
							value={formData.address}
							multiline
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Latitude"
							name="latitude"
							value={formData.latitude}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Longitude"
							name="longitude"
							value={formData.longitude}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Deskripsi"
							name="description"
							value={formData.description}
							onChange={handleInputText}
							multiline
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions className="bg-slate-900 text-white">
				<Button variant="contained" color="warning" className="bg-orange-600" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="contained" color="primary" className="bg-blue-600" onClick={handleSave}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
