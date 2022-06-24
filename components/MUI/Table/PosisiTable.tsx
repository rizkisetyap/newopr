import { EditRounded } from "@mui/icons-material";
import {
	Paper,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	IconButton,
	DialogActions,
	Button,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useAppDispatch } from "app/hooks";
import DeleteButton from "components/ActionButton/DeleteButton";
import EditLink from "components/EditLink";
import { useFetch } from "data/Api";
import API, { handleSoftDelete } from "lib/ApiCrud";
import { handleDeletePosition } from "lib/ApiPosition";
import Link from "next/link";
import React, { FC, SyntheticEvent, useState } from "react";
import { useSWRConfig } from "swr";
import { IPosition } from "types/ModelInterface";
import BackdropLoading from "../BackdropLoading";
import BaseDataGrid from "../BaseDataGrid";
const cols: GridColDef[] = [
	{
		field: "id",
		headerName: "ID",
		minWidth: 50,
	},
	{
		field: "positionName",
		headerName: "Nama",
		minWidth: 200,
		flex: 1,
	},
	{
		field: "options",
		headerName: "Options",
		sortable: false,
		hideable: false,
		minWidth: 150,
		renderCell: (params) => {
			const dispatch = useAppDispatch();
			const { mutate } = useSWRConfig();
			const [open, setOpen] = useState(false);
			const onSuccess = () => {
				mutate("/positions/getall");
			};
			const handleDelete = (e: SyntheticEvent) => {
				e.stopPropagation();
				handleSoftDelete(params.row.id, onSuccess, dispatch, "positions");
			};
			return (
				<Box>
					<DeleteButton onClick={handleDelete} />
					<IconButton onClick={() => setOpen(true)} color="primary" aria-label="Edit">
						<EditRounded />
					</IconButton>
					<ModalForm open={open} onClose={() => setOpen(false)} jabatan={params.row} />
				</Box>
			);
		},
	},
];
interface Props {
	jabatans: IPosition[];
}
const PosisiTable: FC<Props> = ({ jabatans }) => {
	const [pageSize, setPageSize] = useState(10);

	return (
		<Box overflow="hidden" minHeight={400}>
			<BaseDataGrid
				autoHeight
				columns={cols}
				getRowId={(row) => row.id}
				rows={jabatans}
				pageSize={pageSize}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
				onPageSizeChange={(size) => setPageSize(size)}
			/>
		</Box>
	);
};

export default PosisiTable;

interface IModal {
	open: boolean;
	onClose: () => void;
	jabatan: IPosition;
}
function ModalForm(props: IModal) {
	const { open, onClose, jabatan } = props;
	const [formData, setFormData] = useState(jabatan);
	const { mutate } = useSWRConfig();
	const onSuccess = () => {
		mutate("/positions/getall");
		setTimeout(onClose, 1000);
	};
	const dispatch = useAppDispatch();
	const handleSave = () => {
		API.handleUpdate<IPosition>(formData, onSuccess, dispatch, "positions");
	};

	return (
		<Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
			<DialogTitle>Edit Jabatan</DialogTitle>
			<DialogContent>
				<TextField
					fullWidth
					margin="dense"
					variant="standard"
					value={formData.positionName}
					onChange={(e) => setFormData((old) => ({ ...old, [e.target.name]: e.target.value }))}
					label="Jabatan"
					name="positionName"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="warning" variant="contained" className="bg-orange-600">
					Cancel
				</Button>
				<Button onClick={handleSave} color="primary" variant="contained" className="bg-blue-600">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
