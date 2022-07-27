import {
	Box,
	Button,
	Container,
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
	TextField,
	Typography,
} from "@mui/material";
import AdminLayout from "components/Layout/AdminLayout";
import { ChangeEvent, FC, useState } from "react";
import HOC from "components/HOC/HOC";
import { AddCircleRounded, DeleteRounded, EditRounded } from "@mui/icons-material";
import { IFallback, IGroup, ListApp } from "types/ModelInterface";
import { useAppDispatch } from "app/hooks";
import API from "lib/ApiCrud";
import { useFetch } from "data/Api";
import { mutate, SWRConfig, useSWRConfig } from "swr";
import { ScopedMutator } from "swr/dist/types";
import { GetStaticProps } from "next";
import axios from "axios";
import { BASE_URL } from "lib/constants";
import BaseDataGrid from "components/MUI/BaseDataGrid";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
interface Props {
	fallback: IFallback;
}
const columns: GridColDef[] = [
	{
		field: "id",
		headerName: "ID",
		width: 50,
	},
	{
		field: "name",
		headerName: "Nama Aplikasi",
		minWidth: 200,
		flex: 1,
	},
	{
		field: "group",
		headerName: "Kelompok",
		width: 130,
		valueGetter(params) {
			console.log(params);
			return params.row?.group?.groupName ?? "all";
		},
	},
	{
		field: "link",
		headerName: "Alamat aplikasi",
		minWidth: 250,
		flex: 1,
		renderCell(params) {
			return (
				<a className="text-blue-600 underline" rel="noreferrer" href={params.row.link} target="_blank">
					{params.row.link}
				</a>
			);
		},
	},
	{
		field: "options",
		headerName: "Options",
		width: 200,
		renderCell(params: GridRenderCellParams<any, ListApp>) {
			const [open, setOpen] = useState(false);
			const dispatch = useAppDispatch();
			const { mutate } = useSWRConfig();
			const handleDelete = () => {
				API.handleSoftDelete(params.row.id!.toString(), () => mutate("/listApps/getall"), dispatch, "listapps");
			};
			return (
				<Box>
					<IconButton color="primary" onClick={() => setOpen(true)} title="Edit">
						<EditRounded />
					</IconButton>
					<IconButton color="error" onClick={handleDelete} title="Hapus">
						<DeleteRounded />
					</IconButton>
					<ModalFormEdit app={params.row} mutate={mutate} open={open} onClose={() => setOpen(false)} />
				</Box>
			);
		},
	},
];
const Category: FC<Props> = ({ fallback }) => {
	const [open, setOpen] = useState(false);
	const { data: apps } = useFetch<ListApp[]>("/listapps/getall");
	return (
		<SWRConfig value={{ fallback }}>
			<AdminLayout title="List App ">
				<Container maxWidth="xl" sx={{ p: 4 }}>
					<Paper elevation={0} sx={{ p: 2, minHeight: "80vh" }}>
						<Box display="flex" justifyContent="space-between">
							<Typography className="text-gray-600" fontWeight={500} variant="h5">
								List Aplikasi My OPR
							</Typography>
							<Button
								startIcon={<AddCircleRounded />}
								size="small"
								className="bg-green-600"
								variant="contained"
								color="success"
								onClick={() => setOpen(true)}
							>
								<span className="text-xs">Tambah data</span>
							</Button>
						</Box>

						{apps ? (
							<Box sx={{ mt: 2 }}>
								<BaseDataGrid rows={apps} columns={columns} getRowId={(row) => row.id} />
							</Box>
						) : (
							<Typography variant="body2">Error loading data</Typography>
						)}
					</Paper>
					<ModalForm open={open} onClose={() => setOpen(false)} mutate={mutate} />
				</Container>
			</AdminLayout>
		</SWRConfig>
	);
};

export default HOC(Category);
const initForm: ListApp = {
	name: "",
	link: "",
};
interface IModalProps {
	open: boolean;
	onClose: () => void;
	mutate: ScopedMutator;
}

function ModalForm(props: IModalProps) {
	const { onClose, open, mutate } = props;
	const [formData, setFormData] = useState(initForm);

	const { data: groups } = useFetch<IGroup[]>("/groups/getall");
	const dispatch = useAppDispatch();
	const onSuccess = () => {
		mutate("/listapps/getall");
		setFormData(initForm);
	};
	const handleSave = () => {
		API.handlePost<ListApp>(formData, onSuccess, dispatch, "listapps");
	};
	const handleInputText = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((old) => ({
			...old,
			[e.target.name]: e.target.value,
		}));
	};
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle className="bg-slate-900 text-white">New List App</DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Nama"
							name="name"
							value={formData.name}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<FormControl fullWidth margin="dense" variant="standard">
							<InputLabel id="kelompokId">Kelompok</InputLabel>
							{groups && (
								<Select
									name="groupId"
									value={formData.groupId ?? ""}
									onChange={(e) => setFormData((old) => ({ ...old, groupId: e.target.value }))}
								>
									{groups.map((g) => (
										<MenuItem key={g.id} value={g.id}>
											{g.groupName}
										</MenuItem>
									))}
								</Select>
							)}
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Alamat"
							name="link"
							value={formData.link}
							onChange={handleInputText}
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
interface IModalPropsEdit {
	open: boolean;
	onClose: () => void;
	mutate: ScopedMutator;
	app: ListApp;
}
function ModalFormEdit(props: IModalPropsEdit) {
	const { onClose, open, mutate } = props;
	const [formData, setFormData] = useState(props.app);

	const { data: groups } = useFetch<IGroup[]>("/groups/getall");
	const dispatch = useAppDispatch();
	const onSuccess = () => {
		mutate("/listapps/getall");
		setFormData(initForm);
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		API.handleUpdate<ListApp>(formData, onSuccess, dispatch, "listapps");
	};
	const handleInputText = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((old) => ({
			...old,
			[e.target.name]: e.target.value,
		}));
	};
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle className="bg-slate-900 text-white">New List App</DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Nama"
							name="name"
							value={formData.name}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<FormControl fullWidth margin="dense" variant="standard">
							<InputLabel id="kelompokId">Kelompok</InputLabel>
							{groups && (
								<Select
									name="groupId"
									value={formData.groupId ?? ""}
									onChange={(e) => setFormData((old) => ({ ...old, groupId: e.target.value }))}
								>
									{groups.map((g) => (
										<MenuItem key={g.id} value={g.id}>
											{g.groupName}
										</MenuItem>
									))}
								</Select>
							)}
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Alamat"
							name="link"
							value={formData.link}
							onChange={handleInputText}
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
export const getStaticProps: GetStaticProps = async () => {
	const data = await axios.get(BASE_URL + "/listapps/getall").then((res) => res.data);

	return {
		props: {
			fallback: {
				"/listapps/getall": data,
			},
		},
		revalidate: 10,
	};
};
