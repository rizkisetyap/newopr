import {
	Paper,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	TextField,
	IconButton,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DeleteButton from "components/ActionButton/DeleteButton";
import EditLink from "components/EditLink";
import { useFetch } from "data/Api";
import { handleDeleteSlider } from "lib/ApiSlider";
import Link from "next/link";
import React, { ChangeEvent, FC, SyntheticEvent, useState } from "react";
import BackdropLoading from "../BackdropLoading";
import { CheckCircleRounded, CancelRounded, VisibilityRounded, EditRounded } from "@mui/icons-material";
import BaseDataGrid from "../BaseDataGrid";
import { useAppDispatch } from "app/hooks";
import API from "lib/ApiCrud";
import { ISlider } from "types/ModelInterface";
import slider from "pages/admin/slider";
import { ScopedMutator } from "swr/dist/types";
import { useSWRConfig } from "swr";

const cols: GridColDef[] = [
	{
		field: "id",
		headerName: "ID",
		minWidth: 100,
	},
	{
		field: "title",
		headerName: "Judul",
		minWidth: 200,
		flex: 1,
	},
	{
		field: "path",
		headerName: "Image",
		valueFormatter: (params) => {
			if (params.value) {
				return true;
			}
			return false;
		},
		renderCell: (params) => {
			if (params.formattedValue) {
				return <CheckCircleRounded className="text-green-500" />;
			}
			return <CancelRounded className="text-red-500" />;
		},
	},
	{
		field: "options",
		headerName: "Options",
		sortable: false,
		hideable: false,
		renderCell: (params) => {
			const dispatch = useAppDispatch();
			const { mutate } = useSWRConfig();
			const [open, setOpen] = useState(false);
			// const [isView, setIsView] = useState(false);
			const onSuccess = () => {
				mutate("/sliders/getall");
			};
			const handleDelete = (e: SyntheticEvent) => {
				e.stopPropagation();
				API.handleSoftDelete<ISlider>(params.row.id, onSuccess, dispatch, "sliders");
			};
			return (
				<Box>
					{/* <IconButton aria-label="Info">
						<VisibilityRounded />
					</IconButton> */}
					<IconButton color="primary" aria-label="Edit" onClick={() => setOpen(true)}>
						<EditRounded />
					</IconButton>
					<DeleteButton onClick={handleDelete} />
					<ModalForm open={open} onClose={() => setOpen(false)} slide={params.row} mutate={mutate} />
				</Box>
			);
		},
	},
];
interface TableProps {
	sliders: ISlider[];
}
const SliderTable: FC<TableProps> = ({ sliders }) => {
	const [pageSize, setPageSize] = useState(10);

	return (
		<Box overflow="hidden" minHeight={400}>
			<BaseDataGrid
				autoHeight
				pageSize={pageSize}
				columns={cols}
				rows={sliders}
				getRowId={(row) => row.id}
				onPageSizeChange={(size) => setPageSize(size)}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
			/>
		</Box>
	);
};

export default SliderTable;
interface IModalProps {
	open: boolean;
	onClose: () => void;
	slide: ISlider;
	mutate: ScopedMutator;
}
interface IFile {
	name: string;
	type: string;
	extension: string;
	base64str: string;
}
function ModalForm(props: IModalProps) {
	const { open, onClose, slide, mutate } = props;
	const dispatch = useAppDispatch();
	const [imgData, setImgData] = useState<IFile | null>(null);
	const [title, setTitle] = useState(slide.title);
	const [slider, setSlider] = useState(slide);
	const handleInputImage = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files !== null) {
			const reader = new FileReader();
			reader.onloadend = function (result) {
				setImgData({
					base64str: result.target?.result?.toString()!,
					extension: files[0].name.match(/[^\\]*\.(\w+)$/)![1],
					name: files[0].name,
					type: files[0].type,
				});
				setTitle(files[0].name);
			};
			reader.readAsDataURL(files[0]);
		} else {
			return;
		}
	};
	const onSuccess = () => {
		mutate("/sliders/getall");
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		API.handleUpdate<ISlider>({ ...slider, title }, onSuccess, dispatch, "sliders");
	};
	return (
		<Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
			<DialogTitle className="bg-slate-900 text-white">New Silde</DialogTitle>
			<DialogContent>
				<Grid my={2} container spacing={2}>
					<Grid item xs={12} sm={6} md={4}>
						<Button className="bg-green-600" color="success" component="label" variant="contained">
							<input type="file" hidden accept="image/*" onChange={handleInputImage} />
							Browse image
						</Button>
					</Grid>
					<Grid item xs={12} sm={6} md={8}>
						<TextField
							fullWidth
							size="small"
							value={title}
							variant="standard"
							margin="dense"
							name="title"
							onChange={(e) => setTitle(e.target.value)}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions className="bg-slate-900 text-white">
				<Button color="warning" variant="contained" className="bg-orange-600" onClick={onClose}>
					Cancel
				</Button>
				<Button color="primary" variant="contained" className="bg-blue-600" onClick={handleSave}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
