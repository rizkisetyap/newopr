import {
	Paper,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Button,
	IconButton,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useAppDispatch } from "app/hooks";
import { useFetch } from "data/Api";
import React, { FC, MouseEvent, useState } from "react";
import { IZoom } from "types/ModelInterface";
import BackdropLoading from "../BackdropLoading";
import DeleteButton from "components/ActionButton/DeleteButton";
import API from "lib/ApiCrud";
import BaseDataGrid from "../BaseDataGrid";
import { EditRounded } from "@mui/icons-material";
import { ScopedMutator } from "swr/dist/types";
import { useSWRConfig } from "swr";

const columns: GridColDef[] = [
	{
		field: "id",
		headerName: "ID",
		width: 50,
		valueGetter: (val) => {
			return val.id;
		},
	},
	{
		field: "name",
		headerName: "Nama",
		flex: 1,
		minWidth: 300,
	},
	{
		field: "actions",
		headerName: "Options",
		width: 150,
		renderCell(params) {
			const [open, setOpen] = useState(false);
			const { mutate } = useSWRConfig();
			const dispatch = useAppDispatch();
			const onSuccess = () => {
				mutate("/zoom");
			};
			const hapus = (e: MouseEvent<HTMLButtonElement>) => {
				e.stopPropagation();
				e.preventDefault();
				API.handleDelete<IZoom>(onSuccess, dispatch, `zoom`, params.row);
			};

			return (
				<Box>
					<DeleteButton onClick={hapus} />
					<IconButton aria-label="open modal edit" color="primary" onClick={() => setOpen(true)}>
						<EditRounded />
					</IconButton>
					<ModalEdit open={open} zoom={params.row} onClose={() => setOpen(false)} mutate={mutate} />
				</Box>
			);
		},
	},
];
interface TableProps {
	zooms: IZoom[];
}
const ZoomTable: FC<TableProps> = ({ zooms }) => {
	const [pageSize, setPageSize] = useState(10);

	return (
		<Box overflow="hidden" minHeight={400}>
			<BaseDataGrid
				columns={columns}
				rows={zooms}
				getRowId={(row) => row.id}
				autoHeight
				pageSize={pageSize}
				onPageSizeChange={(size) => setPageSize(size)}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
			/>
		</Box>
	);
};

export default ZoomTable;
interface E_ModalProps {
	open: boolean;
	onClose: () => void;
	zoom: IZoom;
	mutate: ScopedMutator;
}
function ModalEdit(props: E_ModalProps) {
	const { onClose, open, zoom, mutate } = props;
	const [newZoom, setNewZoom] = useState(zoom);
	const dispatch = useAppDispatch();
	const onSuccess = () => {
		mutate("/zoom");
		setTimeout(onClose, 1000);
	};
	const saveUpdate = () => {
		API.handleUpdate<IZoom>(newZoom, onSuccess, dispatch, "zoom");
	};

	return (
		<Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
			<DialogTitle className="bg-slate-900 text-white">Edit</DialogTitle>
			<DialogContent className="my-6">
				<TextField
					fullWidth
					margin="dense"
					label="Nama"
					variant="standard"
					value={newZoom.name}
					onChange={(e) => setNewZoom((old) => ({ ...old, name: e.target.value }))}
				/>
			</DialogContent>
			<DialogActions className="bg-slate-900 text-white">
				<Button onClick={onClose} color="warning" variant="contained" className="bg-orange-600">
					Cancel
				</Button>
				<Button onClick={saveUpdate} variant="contained" color="primary" className="bg-blue-600">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
