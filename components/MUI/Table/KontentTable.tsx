import {
	Paper,
	Box,
	Typography,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	IconButton,
	ImageList,
	ImageListItem,
	ImageListItemBar,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useAppDispatch } from "app/hooks";
import DeleteButton from "components/ActionButton/DeleteButton";
import EditLink from "components/EditLink";
import { useFetch } from "data/Api";
import { handleDeleteContent } from "lib/ApiContent";
import Link from "next/link";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import React, { ChangeEvent, FC, MouseEvent, useState } from "react";
import BackdropLoading from "../BackdropLoading";
import BaseDataGrid from "../BaseDataGrid";
import { PhotoCameraBackRounded, DriveFolderUploadRounded, VisibilityRounded, EditRounded } from "@mui/icons-material";
import API, { FileInfo, FormINIT } from "lib/ApiCrud";
import { IContent, ICategory } from "types/ModelInterface";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { BASE_URL } from "lib/constants";
import { ScopedMutator } from "swr/dist/types";
import { mutate } from "swr";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const cols: GridColDef[] = [
	{
		field: "id",
		headerName: "ID",
		minWidth: 30,
	},
	{
		field: "title",
		headerName: "Judul",
		flex: 1,
		minWidth: 200,
	},
	{
		field: "bodyContent",
		headerName: "Body Content",
		flex: 1,
		width: 250,
	},
	{
		field: "pathImage",
		headerName: "Image",
		minWidth: 100,
		valueFormatter: (params) => {
			if (!params.value) {
				return false;
			}
			return true;
		},
		renderCell: (params) => {
			if (!params.value) {
				return <CancelRoundedIcon className="text-red-600" />;
			}

			return <CheckCircleRoundedIcon className="text-green-600" />;
		},
	},
	{
		field: "pathContent",
		headerName: "Content",
		minWidth: 100,
		valueFormatter: (params) => {
			if (!params.value) {
				return false;
			}
			return true;
		},
		renderCell: (params) => {
			if (!params.value) {
				return <CancelRoundedIcon className="text-red-600" />;
			}

			return <CheckCircleRoundedIcon className="text-green-600" />;
		},
	},
	{
		field: "options",
		headerName: "Options",
		sortable: false,
		hideable: false,
		minWidth: 150,
		renderCell: (params) => {
			const dispatch = useAppDispatch();
			const [open, setOpen] = useState(false);
			const [isView, setIsView] = useState(true);
			const onSucess = () => {
				mutate("/content/getall");
			};
			const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
				e.stopPropagation();
				handleDeleteContent(params.row.id, dispatch);
				API.handleSoftDelete(params.row.id, onSucess, dispatch, "content");
			};
			const handleClickInfo = () => {
				setIsView(true);
				setOpen(true);
			};
			const handleClickEdit = () => {
				setIsView(false);
				setOpen(true);
			};

			return (
				<Box>
					{/* <IconButton aria-label="Info" color="info" className="text-blue-400" onClick={handleClickInfo}>
						<VisibilityRounded />
					</IconButton> */}
					<IconButton aria-label="Edit" color="primary" className="text-blue-600" onClick={handleClickEdit}>
						<EditRounded />
					</IconButton>
					<DeleteButton onClick={handleDelete} />
					<ModalForm open={open} onClose={() => setOpen(false)} konten={params.row} mutate={mutate} />
				</Box>
			);
		},
	},
];
const KontentTable: FC<{ contents: IContent[] }> = ({ contents }) => {
	const [pageSize, setPageSize] = useState(10);
	return (
		<Box overflow="hidden" minHeight={400}>
			<BaseDataGrid
				columns={cols}
				getRowId={(row) => row.id}
				rows={contents}
				autoHeight
				pageSize={pageSize}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
				onPageSizeChange={(size) => setPageSize(size)}
			/>
		</Box>
	);
};

export default KontentTable;
interface IModalProps {
	open: boolean;
	onClose: () => void;
	konten: IContent;
	mutate: ScopedMutator;
}
function ModalForm(props: IModalProps) {
	const { open, onClose, konten } = props;
	const dispatch = useAppDispatch();
	const [formData, setFormData] = useState(konten);
	const { data: categories, error } = useFetch<ICategory[]>("/categories/getall");
	const [fileData, setFileData] = useState<FileInfo>({
		file: null,
		image: null,
	});
	const [image, setImage] = useState<File | null>();
	const [file, setFile] = useState<File | null>(null);
	const handleInputText = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((old) => ({
			...old,
			[e.target.name]: e.target.value,
		}));
	};
	const handleInputFileImage = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files !== null) {
			setImage(files[0]);
			const reader = new FileReader();
			reader.onloadend = function (result) {
				const base64 = result.target?.result;
				setFileData((old) => ({
					...old,
					image: {
						base64str: base64?.toString(),
						extension: files[0].name.match(/[^\\]*\.(\w+)$/)![1],
						name: files[0].name,
						type: files[0].type,
					},
				}));
			};
			reader.readAsDataURL(files[0]);
		}
	};
	const handleInputFile = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files !== null) {
			setFile(files[0]);
			const reader = new FileReader();
			reader.onloadend = function (result) {
				const base64 = result.target?.result;
				setFileData((old) => ({
					...old,
					file: {
						base64str: base64?.toString(),
						extension: files[0].name.match(/[^\\]*\.(\w+)$/)![1],
						name: files[0].name,
						type: files[0].type,
					},
				}));
			};
			reader.readAsDataURL(files[0]);
		}
	};
	const onSuccess = () => {
		mutate("/content/getall");
		setFile(null);
		setImage(null);
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		const data: FormINIT = {
			content: formData,
			fileData: fileData,
		};
		API.handleUpdateContent(data, onSuccess, dispatch);
	};
	return (
		<Dialog open={open} onClose={onClose} fullScreen>
			<DialogTitle className="bg-slate-900 text-white">New Content</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={7}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Judul"
							name="title"
							value={formData.title}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12} sm={5}>
						<FormControl fullWidth margin="dense" variant="standard">
							<InputLabel id="categoryId">Kategori</InputLabel>
							<Select
								value={formData.categoryId ?? "0"}
								onChange={(e) => setFormData((old) => ({ ...old, categoryId: +e.target.value }))}
							>
								<MenuItem value="0">--kategori--</MenuItem>
								{categories &&
									categories.map((category) => (
										<MenuItem key={category.id} value={category.id}>
											{category.nama}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<MDEditor
							value={formData.bodyContent}
							onChange={(e) => setFormData((old) => ({ ...old, bodyContent: e }))}
							enableScroll
							aria-label="Body"
							height={300}
						/>
					</Grid>

					<Grid item xs={12}>
						<div className="mb-6 border-b">
							<Box className="flex  gap-4 justify-between">
								<div>
									<Button
										// size="small"
										variant="contained"
										className="bg-green-700"
										color="success"
										component="label"
										startIcon={<PhotoCameraBackRounded />}
									>
										<span className="text-xs">Upload Gambar</span>
										<input accept="image/*" type="file" hidden onChange={handleInputFileImage} />
									</Button>
								</div>
								<div>
									<Typography variant="body1">{image?.name ?? "choose file"}</Typography>
								</div>
							</Box>
						</div>
						<div className="border-b">
							<Box className="flex gap-4 justify-between">
								<div>
									<Button
										// size="small"
										variant="contained"
										className="bg-green-700"
										color="success"
										component="label"
										startIcon={<DriveFolderUploadRounded />}
									>
										<span className="text-xs">Upload File</span>
										<input type="file" hidden onChange={handleInputFile} />
									</Button>
								</div>
								<div>
									<Typography variant="body1">{file?.name ?? "choose file"}</Typography>
								</div>
							</Box>
						</div>
					</Grid>
					{(image || formData.pathImage) && (
						<Grid item xs={6}>
							<ImageList>
								{formData.pathImage && (
									<ImageListItem className="object-cover">
										<img
											className="object-contain h-52"
											src={BASE_URL.replace("api", "") + formData.pathImage}
										/>
										<ImageListItemBar title="Old Image" />
									</ImageListItem>
								)}
								{image && (
									<ImageListItem className="object-cover">
										<img className="object-contain h-52" src={URL.createObjectURL(image)} />
										<ImageListItemBar title="New Image" />
									</ImageListItem>
								)}
								<ImageListItem></ImageListItem>
							</ImageList>
						</Grid>
					)}
				</Grid>
			</DialogContent>
			<DialogActions className="bg-slate-900 text-white">
				<Button className="bg-orange-600" color="warning" variant="contained" onClick={onClose}>
					Cancel
				</Button>
				<Button className="bg-blue-600" color="primary" variant="contained" onClick={handleSave}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
