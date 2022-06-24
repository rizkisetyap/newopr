import { EditRounded } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useAppDispatch } from "app/hooks";
import DeleteButton from "components/ActionButton/DeleteButton";
import API, { handleSoftDelete } from "lib/ApiCrud";
import { handleDeleteGroup } from "lib/ApiGroup";
import React, { FC, SyntheticEvent, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { IGroup } from "types/ModelInterface";
import BaseDataGrid from "../BaseDataGrid";
const cols: GridColDef[] = [
	{
		field: "id",
		headerName: "ID",
		minWidth: 100,
	},
	{
		field: "groupName",
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
				mutate("/groups/getall");
			};
			const handleDelete = (e: SyntheticEvent) => {
				e.stopPropagation();
				handleSoftDelete<IGroup>(params.row.id, onSuccess, dispatch, "groups");
			};
			return (
				<Box>
					<DeleteButton onClick={handleDelete} />
					<IconButton color="primary" onClick={() => setOpen(true)} aria-label="Edit">
						<EditRounded />
					</IconButton>
					<ModalForm open={open} onClose={() => setOpen(false)} oldGroup={params.row} />
				</Box>
			);
		},
	},
];
interface Props {
	groups: IGroup[];
}
const GroupTable: FC<Props> = ({ groups }) => {
	const [pageSize, setPageSize] = useState(10);
	return (
		<Box overflow="hidden" minHeight={400}>
			<BaseDataGrid
				columns={cols}
				rows={groups}
				getRowId={(row) => row.id}
				pageSize={pageSize}
				onPageSizeChange={(psize) => setPageSize(psize)}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
				autoHeight
			/>
		</Box>
	);
};

export default GroupTable;
interface IModalForm {
	open: boolean;
	onClose: () => void;
	oldGroup: IGroup;
}

function ModalForm(props: IModalForm) {
	const { open, onClose, oldGroup } = props;
	const [formData, setFormData] = useState<IGroup>(oldGroup);
	const dispatch = useAppDispatch();
	const { mutate } = useSWRConfig();
	const onSuccess = () => {
		mutate("/groups/getall");
		setTimeout(onClose, 1000);
	};

	const handleSave = () => {
		API.handleUpdate<IGroup>(formData, onSuccess, dispatch, "groups");
	};

	return (
		<Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
			<DialogTitle>
				<span>Update Kelompok</span>
			</DialogTitle>
			<DialogContent>
				<TextField
					fullWidth
					margin="dense"
					variant="standard"
					value={formData.groupName}
					label="Nama kelompok"
					name="groupName"
					onChange={(event) => setFormData((old) => ({ ...old, [event.target.name]: event.target.value }))}
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
