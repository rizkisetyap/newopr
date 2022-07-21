import { CancelRounded, CheckCircleRounded, EditRounded } from "@mui/icons-material";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	LinearProgress,
	ModalProps,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "app/hooks";
import axios from "axios";
import BackdropLoading from "components/MUI/BackdropLoading";
import BaseDataGrid from "components/MUI/BaseDataGrid";
import { useFetch } from "data/Api";
import API from "lib/ApiCrud";
import { BASE_URL } from "lib/constants";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import { useSWRConfig } from "swr";

const columns: GridColDef[] = [
	{
		field: "id",
		hide: true,
	},
	{
		field: "formNumber",
		headerName: "No Reg",
		minWidth: 130,
		hideable: true,
		flex: 1,
	},
	{
		field: "formName",
		headerName: "Nama",
		minWidth: 150,
		flex: 1,
	},
	{
		field: "kelompok",
		headerName: "Kelompok",
		width: 100,
		hide: true,
	},
	{
		field: "layanan",
		headerName: "Layanan",
		width: 200,
		valueGetter(params) {
			return params.row.layanan.name;
		},
	},
	{
		field: "unit",
		headerName: "Kelolaan",
		width: 200,
		valueGetter(params) {
			return params.row.unit.name;
		},
	},
	{
		field: "fileIso",
		headerName: "File Iso",
		width: 100,
		renderCell(params) {
			if (!params.row.fileIso) {
				return <CancelRounded color="error" />;
			}
			return <CheckCircleRounded color="success" />;
		},
	},
	{
		field: "createDate",
		headerName: "Create Date",
		width: 200,
		hide: true,
	},
	{
		field: "lastUpdate",
		headerName: "Last Update",
		width: 200,
		hide: true,
	},
	{
		field: "options",
		headerName: "Options",
		width: 60,
		renderCell(params) {
			const [open, setOpen] = useState(false);

			return (
				<Fragment>
					<IconButton title="Edit" color="info" onClick={() => setOpen(true)}>
						<EditRounded />
					</IconButton>
					<ModalEdit id={params.row.id} open={open} onClose={() => setOpen(false)} />
				</Fragment>
			);
		},
	},
];
export interface RowsInterface {
	id: number;
	formNumber: string;
	formName: string;
	kelompok: string;
	layanan: {
		name: string;
		shortName: string;
	};
	unit: {
		name: string;
		shortName: string;
	};
	fileIso: boolean;
	lastUpdate: string;
	createDate: string;
}
interface Props {
	data?: RowsInterface[];
	loading: boolean;
}
const AdminTabelForms = (props: Props) => {
	const [pageSize, setPageSize] = useState(15);
	// const { data: rows, error } = useFetch<RowsInterface[]>("/RegisteredForms/getall");
	// if (error) {
	// 	return null;
	// }
	return (
		<Paper>
			{props.data ? (
				<BaseDataGrid
					rows={props.data}
					columns={columns}
					pageSize={pageSize}
					rowsPerPageOptions={[10, 15, 20, 25, 30]}
					onPageSizeChange={(s) => setPageSize(s)}
					getRowId={(row) => row.id}
					loading={props.loading}
				/>
			) : (
				<LinearProgress />
			)}
		</Paper>
	);
};

interface PropsEdit {
	id: number;
	onClose: () => void;
	open: boolean;
}
export default AdminTabelForms;
const ModalEdit = (props: PropsEdit) => {
	const { data: session } = useSession();
	const { id, onClose, open } = props;
	const dispatch = useAppDispatch();
	const { mutate } = useSWRConfig();
	const isLoading = useAppSelector((s) => s.action.isLoading);
	const [data, setData] = useState<any | null>(null);
	const [name, setName] = useState(data?.registeredForm?.name ?? "");
	const [NoUrut, setNoUrut] = useState(data?.registeredForm?.noUrut ?? 1);
	const [revisi, setRevisi] = useState(data?.revisi ?? 0);
	const [monthYear, setMonthYear] = useState({
		month: data?.registeredForm?.month ?? new Date().getMonth(),
		year: data?.registeredForm?.year ?? new Date().getFullYear(),
	});
	useEffect(() => {
		const GetDetails = async () => {
			const res = await axios.get(BASE_URL + "/RegisteredForms/DetailRegister?Id=" + id).then((res) => res.data);
			setData(res);
		};
		if (id) {
			GetDetails();
		}

		return () => {
			setData(null);
		};
	}, [id]);
	useEffect(() => {
		if (data) {
			setName(data?.registeredForm?.name);
			setNoUrut(data?.registeredForm?.noUrut);
			setMonthYear({
				month: data?.registeredForm?.month ?? new Date().getMonth(),
				year: data?.registeredForm?.year ?? new Date().getFullYear(),
			});
			setRevisi(data?.revisi);
		}
	}, [data]);
	const onSuccess = () => {
		setTimeout(onClose, 500);
		mutate("/RegisteredForms/getall");
	};
	const handleSave = () => {
		const data = {
			id,
			name,
			NoUrut,
			revisi,
			month: monthYear.month,
			year: monthYear.year,
		};
		// console.log(data);
		API.handleUpdate<any>(data, onSuccess, dispatch, "RegisteredForms/DetailRegister");
		// Update form;
	};
	return (
		<Dialog fullWidth open={open} onClose={onClose} maxWidth="sm">
			<DialogTitle>
				<Typography className="text-lg font-bold">Edit Form</Typography>
			</DialogTitle>
			<DialogContent>
				{isLoading && !data && <LinearProgress className="my-4" />}
				{data && (
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								value={name}
								fullWidth
								margin="dense"
								variant="standard"
								name="name"
								label="Nama Form"
								onChange={(e) => setName(e.target.value)}
								multiline
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								fullWidth
								margin="dense"
								variant="standard"
								name="monthYear"
								label="Tahun Bulan"
								placeholder="YYYY-MM"
								type="month"
								onChange={(e) => {
									const val = e.target.value && e.target.value.split("-"); // * 2022-07
									if (val.length) {
										setMonthYear({
											month: +val[1],
											year: +val[0],
										});
									}
								}}
								// value=}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								fullWidth
								margin="dense"
								variant="standard"
								name="monthYear"
								label="Default"
								placeholder="YYYY-MM"
								aria-readonly
								disabled
								value={monthYear.year + "-" + monthYear.month}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								type="number"
								fullWidth
								margin="dense"
								variant="standard"
								name="NoUrut"
								label="No Urut"
								value={NoUrut}
								onChange={(e) => setNoUrut(Math.abs(+e.target.value))}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								type="number"
								fullWidth
								margin="dense"
								variant="standard"
								name="Revisi"
								label="Revisi"
								value={revisi}
								onChange={(e) => setRevisi(+e.target.value)}
							/>
						</Grid>
					</Grid>
				)}
			</DialogContent>
			<DialogActions>
				<Button className="bg-orange-600" variant="contained" color="warning" onClick={onClose}>
					Cancel
				</Button>
				<Button className="bg-blue-600" variant="contained" color="primary" onClick={handleSave}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};
