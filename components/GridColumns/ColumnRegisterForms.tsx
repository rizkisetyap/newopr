import { CancelRounded, CheckCircleRounded, DeleteRounded, EditRounded } from "@mui/icons-material";
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
	TextField,
	Typography,
} from "@mui/material";
import { GridColDef, GridRenderCellParams, GridValueFormatterParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "app/hooks";
import axios from "axios";
import API from "lib/ApiCrud";
import { BASE_URL } from "lib/constants";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { IDetailRegister } from "../../pages/documentISO";
const columnsRegsiterForms: GridColDef[] = [
	{
		field: "id",
		headerName: "ID",
		width: 50,
	},
	{
		field: "Nama Form",
		headerName: "Nama Form",
		minWidth: 250,
		flex: 1,
		valueGetter(params: GridValueGetterParams<any, any>) {
			return params.row.formName;
		},
	},
	{
		field: "noForms",
		headerName: "No Form",
		width: 270,
		valueGetter(params: GridValueGetterParams<any, any>) {
			return params.row.formNumber;
		},
	},
	{
		field: "createDate",
		headerName: "Create Date",
		width: 150,
		valueGetter(params: GridValueGetterParams<any, any>) {
			return params.row.updateDate;
		},
		valueFormatter(params: GridValueFormatterParams<string>) {
			// console.log(params);
			return moment(params.value).format("DD MMMM YYYY, HH:mm");
		},
	},
	{
		field: "fileIso",
		headerName: "File Iso",
		width: 50,
		renderCell(params) {
			if (!params.row.fileIso) {
				return <CancelRounded color="error" />;
			}
			return <CheckCircleRounded color="success" />;
		},
	},
	{
		field: "Options",
		headerName: "Option",
		width: 70,
		renderCell(params: GridRenderCellParams<any, IDetailRegister, any>) {
			const [open, setOpen] = useState(false);
			return (
				<Box>
					<IconButton title="Edit / View" color="info" onClick={() => setOpen(true)}>
						<EditRounded />
					</IconButton>
					<ModalEdit open={open} onClose={() => setOpen(false)} id={params.row.id!} />
				</Box>
			);
		},
	},
];

export default columnsRegsiterForms;

interface ModalProps {
	id: number;
	open: boolean;
	onClose: () => void;
}

const ModalEdit = (props: ModalProps) => {
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
		mutate("/DocumentIso/DokumenPendukung?GroupId=" + session?.user.employee.service?.groupId);
		mutate("/RegisteredForms/Filter?GroupId=" + session?.user.employee.service?.groupId);
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
