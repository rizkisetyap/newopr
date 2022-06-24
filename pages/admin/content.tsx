import React, { ChangeEvent, FC, useState } from "react";

import {
	Container,
	Paper,
	Box,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	Grid,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import AdminLayout from "components/Layout/AdminLayout";
import KontentTable from "components/MUI/Table/KontentTable";
import HOC from "components/HOC";
import { AddCircleRounded, DriveFolderUploadRounded, PhotoCameraBackRounded } from "@mui/icons-material";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { ICategory, IContent, IFallback } from "types/ModelInterface";
import { useFetch } from "data/Api";
import API from "lib/ApiCrud";
import { useAppDispatch } from "app/hooks";
import { SWRConfig, useSWRConfig } from "swr";
import { ScopedMutator } from "swr/dist/types";
import { GetStaticProps } from "next";
import axios from "axios";
import { BASE_URL } from "lib/constants";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
type FILE = {
	name?: string;
	type?: string;
	extension?: string;
	base64str?: string;
};

type FileInfo = {
	image: FILE | null;
	file: FILE | null;
};
type FormINIT = {
	content: ICategory;
	fileData: FileInfo;
};
const Content: FC<{ fallback: IFallback }> = ({ fallback }) => {
	const [open, setOpen] = useState(false);
	const { data: contents } = useFetch<IContent[]>("/content/getall");
	const { mutate } = useSWRConfig();
	return (
		<SWRConfig value={{ fallback }}>
			<AdminLayout title="Konten">
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Paper elevation={0} sx={{ p: 2 }}>
						<Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between">
							<Typography mb={{ xs: 2, md: 0 }} className="text-gray-600" variant="h5">
								Konten
							</Typography>
							<Button
								size="small"
								className="bg-green-600"
								color="success"
								variant="contained"
								startIcon={<AddCircleRounded />}
								onClick={() => setOpen(true)}
							>
								<span className="text-xs">Tambah data</span>
							</Button>
						</Box>
						{contents ? (
							<Box sx={{ mt: 2 }}>
								<KontentTable contents={contents} />
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

export default HOC(Content);
interface IModalProps {
	open: boolean;
	onClose: () => void;
	mutate: ScopedMutator;
}
const initForm: IContent = {
	bodyContent: "",
	title: "",
};
function ModalForm(props: IModalProps) {
	const { open, onClose, mutate } = props;
	const dispatch = useAppDispatch();
	const [formData, setFormData] = useState(initForm);
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
		setFormData(initForm);
		setFile(null);
		setImage(null);
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		const data: FormINIT = {
			content: formData,
			fileData: fileData,
		};
		API.handlePostContent(data, onSuccess, dispatch);
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

					<Grid item xs={12} sm={6}>
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
					{image && (
						<Grid item xs={12} sm={6}>
							<Box className="max-w-md mx-auto">
								<img className="object-contain" src={URL.createObjectURL(image)} alt="img upload" />
							</Box>
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

export const getStaticProps: GetStaticProps = async () => {
	const data = await axios.get(BASE_URL + "/content/getall").then((res) => res.data);

	return {
		props: {
			fallback: {
				"/content/getall": data,
			},
		},
	};
};
