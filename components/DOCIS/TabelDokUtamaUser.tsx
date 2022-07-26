import { EditRounded, VisibilityRounded } from "@mui/icons-material";
import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	TextField,
	Typography,
} from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "app/hooks";
import FileInput from "components/Input/FileInput";
import BaseDataGrid from "components/MUI/BaseDataGrid";
import API, { FILE } from "lib/ApiCrud";
import { useSession } from "next-auth/react";
import { IDokumenUtama } from "pages/documentISO";
import React, { ChangeEvent, useRef, useState } from "react";
import { PDfViewer } from "./PDFViewer";
import moment from "moment";
import "moment/locale/id";

const columns: GridColDef[] = [
	{
		field: "id",
		hide: true,
	},
	{
		field: "name",
		headerName: "Nama",
		width: 200,
		flex: 2,
	},
	{
		field: "LastUpdate",
		headerName: "Last Update",
		width: 200,
		flex: 1,
		valueGetter(params) {
			const date = params.row.updateDate ?? params.row.createDate;

			return date;
		},
		valueFormatter(params) {
			const now = moment(new Date());
			const end = moment(params.value);
			// console.log(params.value);
			var durr = moment.duration(now.diff(end)).asDays();
			if (durr > 3) {
				return moment(params.value).calendar();
			}

			return moment(params.value).fromNow();
		},
	},

	{
		field: "Options",
		headerName: "Options",
		width: 200,
		flex: 1,
		renderCell(params: GridRenderCellParams<any, IDokumenUtama, any>) {
			const [open, setOpen] = useState(false);
			const [modalEditOpen, setModalEditOpen] = useState(false);
			const { data: session } = useSession({ required: true });
			const groupId = session?.user.employee.service?.groupId;
			return (
				<div>
					<IconButton color="info" title="Edit" onClick={() => setModalEditOpen(true)}>
						<EditRounded />
					</IconButton>
					<IconButton color="error" onClick={() => setOpen(true)} title="View">
						<VisibilityRounded />
					</IconButton>
					<PDfViewer
						open={open}
						onClose={() => setOpen(false)}
						doc={{
							fileName: params.row.name,
							filePath: params.row.path,
						}}
					/>
					<ModalEdit
						groupId={groupId!}
						data={params.row}
						open={modalEditOpen}
						onClose={() => setModalEditOpen(false)}
					/>
				</div>
			);
		},
	},
];
interface Props {
	dokumen: IDokumenUtama[];
}
const TabelDokUtamaUser = (props: Props) => {
	const { dokumen } = props;
	const [pageSize, setPageSize] = useState(10);
	return (
		<div>
			<BaseDataGrid
				rows={dokumen!}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
				pageSize={pageSize}
				onPageSizeChange={(size) => setPageSize(size)}
				autoHeight
				getRowId={(row) => row.id}
				columns={columns}
			/>
		</div>
	);
};

export default TabelDokUtamaUser;

interface PropsModal {
	open: boolean;
	onClose: () => void;
	data: IDokumenUtama;
	groupId: number;
}
const ModalEdit = (props: PropsModal) => {
	const { open, onClose, data, groupId } = props;
	const [name, setName] = useState(data.name);
	const [file, setFile] = useState<FILE | null>(null);
	const inputFileRef = useRef<HTMLInputElement>(null);
	const isLoading = useAppSelector((state) => state.action.isLoading);
	const dispatch = useAppDispatch();

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files?.item(0);
		const fileReader = new FileReader();

		if (files) {
			fileReader.onloadend = (result) => {
				const base64 = result.target?.result;
				setFile((file) => ({
					...file,
					base64str: base64?.toString(),
					extension: files!.name.match(/[^\\]*\.(\w+)$/)![1],
					name: files!.name,
					type: files!.type,
				}));
			};
		}
		if (files) {
			fileReader.readAsDataURL(files);
		}
	};
	const onSuccess = () => {
		if (!isLoading) {
			onClose();
		}
	};
	const handleSave = () => {
		if (!file && !name) {
			return alert("Nama File & File harus diisi");
		}
		const formData: any = {
			name,
			file,
		};
		API.handleUpdate<any>(formData, onSuccess, dispatch, "DokumenUtama/update?Id=" + data.isoCoreId);
	};
	console.log(data);
	return (
		<Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
			<DialogTitle>
				<Typography className="border-b-2 border-spacing-2 border-b-orange-600 font-bold" component="span">
					{data.name}
				</Typography>
			</DialogTitle>
			<DialogContent>
				{isLoading ? (
					<div className="grid place-items-center">
						<CircularProgress />
					</div>
				) : (
					<Grid container gap={2}>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								margin="dense"
								name="name"
								label="Name"
								size="small"
								value={name}
								variant="standard"
								onChange={(e) => setName(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<FileInput onChange={handleFileChange} acccept="application/pdf" ref={inputFileRef} />
						</Grid>
					</Grid>
				)}
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="warning" className="bg-orange-600" onClick={onClose}>
					Cancel
				</Button>
				<Button
					variant="contained"
					color="primary"
					disabled={isLoading}
					className="bg-blue-600"
					onClick={handleSave}
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};
