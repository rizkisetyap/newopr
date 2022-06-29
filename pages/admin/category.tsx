import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import KategoriTable from "components/MUI/Table/KategoryTable";
import AdminLayout from "components/Layout/AdminLayout";
import { ChangeEvent, FC, SyntheticEvent, useState } from "react";
import HOC from "components/HOC/HOC";
import Link from "next/link";
import { AddCircleRounded } from "@mui/icons-material";
import { ICategory, IFallback } from "types/ModelInterface";
import { useAppDispatch } from "app/hooks";
import API from "lib/ApiCrud";
import { useFetch } from "data/Api";
import { mutate, SWRConfig } from "swr";
import { ScopedMutator } from "swr/dist/types";
import { GetStaticProps } from "next";
import axios from "axios";
import { BASE_URL } from "lib/constants";
interface Props {
	fallback: IFallback;
}
const Category: FC<Props> = ({ fallback }) => {
	const [open, setOpen] = useState(false);
	const { data: categories } = useFetch<ICategory[]>("/categories/getall");
	return (
		<SWRConfig value={{ fallback }}>
			<AdminLayout title="Kategori ">
				<Container maxWidth="xl" sx={{ p: 4 }}>
					<Paper elevation={0} sx={{ p: 2 }}>
						<Box display="flex" justifyContent="space-between">
							<Typography className="text-gray-600" fontWeight={500} variant="h5">
								Kategori Konten
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

						{categories ? (
							<Box sx={{ mt: 2 }}>
								<KategoriTable categories={categories} />
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
const initForm: ICategory = {
	icon: "",
	isMainCategory: true,
	nama: "",
	isDelete: false,
};
interface IModalProps {
	open: boolean;
	onClose: () => void;
	mutate: ScopedMutator;
}

function ModalForm(props: IModalProps) {
	const { onClose, open, mutate } = props;
	const [formData, setFormData] = useState(initForm);
	const dispatch = useAppDispatch();
	const onSuccess = () => {
		mutate("/categories/getall");
		setFormData(initForm);
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		API.handlePost<ICategory>(formData, onSuccess, dispatch, "categories");
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
	const data = await axios.get(BASE_URL + "/categories/getall").then((res) => res.data);

	return {
		props: {
			fallback: {
				"/categories/getall": data,
			},
		},
	};
};
