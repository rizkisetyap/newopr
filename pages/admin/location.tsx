import React, { ChangeEvent, FC, useState } from "react";
import {
	Container,
	Paper,
	Box,
	Typography,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	TextField,
} from "@mui/material";
import { AddCircleRounded } from "@mui/icons-material";
import { useAppDispatch } from "app/hooks";
import { IFallback, ILocation } from "types/ModelInterface";
import AdminLayout from "components/Layout/AdminLayout";
import OfficeTable from "components/MUI/Table/OfficeLocationTable";
import HOC from "components/HOC";
import API from "lib/ApiCrud";
import { SWRConfig, useSWRConfig } from "swr";
import { useFetch } from "data/Api";
import { ScopedMutator } from "swr/dist/types";
import { GetStaticProps } from "next";
import axios from "axios";
import { BASE_URL } from "lib/constants";

interface Props {
	fallback: IFallback;
}
const Location: FC<Props> = ({ fallback }) => {
	const [open, setOpen] = useState(false);
	const { data: locations } = useFetch<ILocation[]>("/officeLocation");
	const { mutate } = useSWRConfig();
	return (
		<SWRConfig value={{ fallback }}>
			<AdminLayout title="Lokasi">
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Paper elevation={0} sx={{ p: 2 }}>
						<Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between">
							<Typography mb={{ xs: 2, md: 0 }} className="text-gray-600" variant="h5">
								Lokasi Kantor
							</Typography>
							<Button
								size="small"
								variant="contained"
								color="success"
								className="bg-green-500"
								startIcon={<AddCircleRounded />}
								onClick={() => setOpen(true)}
							>
								Tambah Lokasi
							</Button>
						</Box>
						{locations ? (
							<Box sx={{ mt: 2 }}>
								<OfficeTable locations={locations} />
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
interface IModalForm {
	open: boolean;
	onClose: () => void;
	mutate: ScopedMutator;
}
const initForm: ILocation = {
	address: "",
	description: "",
	latitude: "",
	longitude: "",
	name: "",
};
export default HOC(Location);
function ModalForm(props: IModalForm) {
	const dispatch = useAppDispatch();
	const { open, onClose, mutate } = props;
	const [formData, setFormData] = useState(initForm);
	const handleInputText = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
	};
	const onSuccess = () => {
		mutate("/officeLocation");
		setFormData(initForm);
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		API.handlePost<ILocation>(formData, onSuccess, dispatch, "OfficeLocation");
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle className="bg-slate-900 text-white">New Location</DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12} sm={4}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Nama"
							name="name"
							onChange={handleInputText}
							value={formData.name}
						/>
					</Grid>
					<Grid item xs={12} sm={8}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Alamat"
							name="address"
							onChange={handleInputText}
							value={formData.address}
							multiline
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Latitude"
							name="latitude"
							value={formData.latitude}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Longitude"
							name="longitude"
							value={formData.longitude}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Deskripsi"
							name="description"
							value={formData.description}
							onChange={handleInputText}
							multiline
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
	const data = await axios.get(BASE_URL + "/officeLocation").then((res) => res.data);

	return {
		props: {
			fallback: {
				"/officeLocation": data,
			},
		},
	};
};
