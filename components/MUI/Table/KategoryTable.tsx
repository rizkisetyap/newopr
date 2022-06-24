import { handleDeleteCatefory } from "lib/ApiKategori";
import { useAppDispatch } from "app/hooks";
import { ChangeEvent, FC, MouseEvent, useState } from "react";
import {
	Paper,
	Box,
	IconButton,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	TextField,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useFetch } from "data/Api";
import BackdropLoading from "../BackdropLoading";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteButton from "components/ActionButton/DeleteButton";
import Link from "next/link";
import EditLink from "components/EditLink";
import BaseDataGrid from "../BaseDataGrid";
import { EditRounded, VisibilityRounded } from "@mui/icons-material";
import { ICategory } from "types/ModelInterface";
import API from "lib/ApiCrud";
import { ScopedMutator } from "swr/dist/types";
import { useSWRConfig } from "swr";
export const columnsAccount: GridColDef[] = [
	{
		field: "id",
		headerName: "Id",
		minWidth: 100,
	},
	{
		field: "nama",
		headerName: "Nama",
		flex: 1,
		minWidth: 250,
	},
	{
		field: "icon",
		headerName: "Ikon",
		width: 200,
	},
	{
		field: "isMainCategory",
		headerName: "Main Kategori",
		width: 200,
		sortable: false,

		renderCell: (params) => {
			if (params.value) {
				return <CheckCircleRoundedIcon color="success" />;
			}
			return <CancelRoundedIcon color="error" />;
		},
	},
	{
		field: "Options",
		headerName: "Options",
		width: 200,
		sortable: false,
		renderCell: (params) => {
			const dispatch = useAppDispatch();
			const [open, setOpen] = useState(false);
			const [isView, setIsView] = useState(false);
			const { mutate } = useSWRConfig();
			const onSuccess = () => {
				mutate("/categories/getall");
			};
			const handleClickDelete = async (e: MouseEvent<HTMLButtonElement>) => {
				e.stopPropagation();
				API.handleSoftDelete<ICategory>(params.row.id, onSuccess, dispatch, "categories");
			};
			const handleClickInfo = () => {
				setIsView(true);
				setOpen(true);
			};
			const handleClickUpdate = () => {
				setIsView(false);
				setOpen(true);
			};
			return (
				<Box>
					{/* <IconButton aria-label="Info" color="info" className="text-blue-400" onClick={handleClickInfo}>
						<VisibilityRounded />
					</IconButton> */}
					<IconButton aria-label="Edit" color="primary" className="text-blue-600" onClick={handleClickUpdate}>
						<EditRounded />
					</IconButton>
					<DeleteButton onClick={handleClickDelete} />
					<ModalForm
						kategory={params.row}
						open={open}
						onClose={() => setOpen(false)}
						isView={isView}
						mutate={mutate}
					/>
				</Box>
			);
		},
	},
];

const KategoriTable: FC<{ categories: ICategory[] }> = ({ categories }) => {
	const [pageSize, setPageSize] = useState(10);

	return (
		<Box overflow="hidden" minHeight={400}>
			<BaseDataGrid
				columns={columnsAccount}
				rows={categories}
				getRowId={(row) => row.id}
				pageSize={pageSize}
				onPageSizeChange={(page) => setPageSize(page)}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
				autoHeight
			/>
		</Box>
	);
};

export default KategoriTable;
interface IModalProps {
	open: boolean;
	onClose: () => void;
	kategory: ICategory;
	isView: boolean;
	mutate: ScopedMutator;
}

function ModalForm(props: IModalProps) {
	const { onClose, open, kategory, isView, mutate } = props;
	const [formData, setFormData] = useState(kategory);
	const dispatch = useAppDispatch();
	const onSuccess = () => {
		mutate("/categories/getall");
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		API.handleUpdate<ICategory>(formData, onSuccess, dispatch, "categories");
	};
	const handleInputText = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((old) => ({
			...old,
			[e.target.name]: e.target.value,
		}));
	};
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle className="bg-slate-900 text-white">New Category</DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Nama"
							name="nama"
							value={formData.nama}
							onChange={handleInputText}
							disabled={isView}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Ikon"
							name="icon"
							value={formData.icon}
							onChange={handleInputText}
							disabled={isView}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions className="bg-slate-900 text-white">
				{isView ? (
					<Button variant="contained" color="secondary" className="bg-violet-600" onClick={onClose}>
						Close
					</Button>
				) : (
					<>
						<Button variant="contained" color="warning" className="bg-orange-600" onClick={onClose}>
							Cancel
						</Button>
						<Button variant="contained" color="primary" className="bg-blue-600" onClick={handleSave}>
							Save
						</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
}
