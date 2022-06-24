import {
	Box,
	IconButton,
	Paper,
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	Button,
	TextField,
	DialogContentText,
	DialogActions,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import React, { FC, MouseEvent, useState } from "react";
import { useFetch } from "data/Api";
import { IZoomStatus } from "types/ModelInterface";
import BackdropLoading from "../BackdropLoading";
import { useAppDispatch } from "app/hooks";
import DeleteButton from "components/ActionButton/DeleteButton";
import BaseDataGrid from "../BaseDataGrid";
import * as API from "lib/ApiCrud";
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
		headerName: "Status",
		flex: 1,
		width: 300,
	},
	{
		field: "options",
		headerName: "Options",
		width: 150,
		renderCell(params) {
			const dispatch = useAppDispatch();
			const [modalOpen, setModalOpen] = useState(false);
			const { mutate } = useSWRConfig();
			const openModal = () => {
				setModalOpen(true);
			};
			const closeModal = () => {
				setModalOpen(false);
			};
			const onSuccess = () => {
				mutate("/zoomStatus");
			};
			const hapus = (event: MouseEvent<HTMLButtonElement>) => {
				event.preventDefault();
				event.stopPropagation();
				API.handleDelete<IZoomStatus>(onSuccess, dispatch, "zoomstatus", params.row);
			};
			return (
				<div>
					<DeleteButton onClick={hapus} />
					<IconButton onClick={openModal} color="primary" aria-label="Edit">
						<EditRoundedIcon />
					</IconButton>
					<EditModal zoomStatus={params.row} open={modalOpen} onClose={closeModal} mutate={mutate} />
				</div>
			);
		},
	},
];
interface TableProps {
	status: IZoomStatus[];
}
const ZoomStatustable: FC<TableProps> = ({ status }) => {
	const [pageSize, setPageSize] = useState(10);
	return (
		<Box overflow="hidden" minHeight={400}>
			<BaseDataGrid
				columns={columns}
				rows={status}
				getRowId={(row) => row.id}
				autoHeight
				pageSize={pageSize}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
				onPageSizeChange={(size) => setPageSize(size)}
			/>
		</Box>
	);
};

export default ZoomStatustable;
interface E_ModalProps {
	open: boolean;
	onClose: () => void;
	zoomStatus: IZoomStatus;
	mutate: ScopedMutator;
}
function EditModal(props: E_ModalProps) {
	const { open, onClose, zoomStatus, mutate } = props;
	const [newValue, setNewValue] = useState(zoomStatus);
	const dispatch = useAppDispatch();
	const onSuccess = () => {
		mutate("/zoomStatus");
		setTimeout(onClose, 1000);
	};
	const saveUpdate = () => {
		API.handleUpdate<IZoomStatus>(newValue, onSuccess, dispatch, "ZoomStatus");
	};

	return (
		<Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
			<DialogTitle className="bg-slate-900 text-white">Edit</DialogTitle>
			<DialogContent className="my-6">
				<TextField
					fullWidth
					margin="dense"
					id="name"
					label="Nama"
					variant="standard"
					defaultValue={zoomStatus.name}
					value={newValue.name ?? ""}
					onChange={(e) =>
						setNewValue((old) => ({
							...old,
							name: e.target.value,
						}))
					}
				/>
			</DialogContent>
			<DialogActions className="bg-slate-900 text-white">
				<Button onClick={onClose} color="warning" variant="contained" className="bg-orange-600">
					Cancel
				</Button>
				<Button color="primary" variant="contained" className="bg-blue-600" onClick={saveUpdate}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
