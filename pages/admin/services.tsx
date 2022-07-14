import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { useAppDispatch } from "app/hooks";
import { AppDispatch } from "app/store";
import axios from "axios";
import CancelButton from "components/DialogButton/CancelButton";
import SaveButton from "components/DialogButton/SaveButton";
import HOC from "components/HOC/HOC";
import AdminLayout from "components/Layout/AdminLayout";
import BaseDataGrid from "components/MUI/BaseDataGrid";
import ButtonAdd from "components/Page/ButtonAdd";
import { useFetch } from "data/Api";
import API from "lib/ApiCrud";
import { BASE_URL } from "lib/constants";
import { GetStaticProps } from "next";
import React, { FC, useState } from "react";
import { SWRConfig, useSWRConfig } from "swr";
import { columnServices } from "types/Coldef";
import { IFallback, IGroup, IService } from "types/ModelInterface";

interface Props {
	fallback: IFallback;
	groups: IGroup[] | null;
}
const Page: FC<Props> = ({ fallback, groups }) => {
	const [open, setOpen] = useState(false);
	const { data: services } = useFetch<IService[]>("/services");
	const [pageSize, setPageSize] = useState(10);
	const dispatch = useAppDispatch();
	return (
		<SWRConfig value={{ fallback }}>
			<AdminLayout title=" Layanan">
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Paper elevation={0} sx={{ p: 2 }}>
						<Box
							display="flex"
							flexDirection={{
								xs: "column",
								sm: "row",
							}}
							justifyContent="space-between"
						>
							<Typography variant="h5" mb={{ xs: 2, sm: 0 }} className="text-gray-500">
								Layanan
							</Typography>
							<ButtonAdd onClick={() => setOpen(true)} />
						</Box>
						{services ? (
							<Box mt={2} minHeight={400}>
								<BaseDataGrid
									columns={columnServices}
									rows={services}
									autoHeight
									pageSize={pageSize}
									onPageSizeChange={(size) => setPageSize(size)}
									rowsPerPageOptions={[10, 15, 20, 25, 30]}
								/>
							</Box>
						) : (
							<Typography variant="body2" className="text-center">
								Error loading data
							</Typography>
						)}
					</Paper>
					{groups && <ModalForm open={open} onClose={() => setOpen(false)} dispatch={dispatch} groups={groups} />}
				</Container>
			</AdminLayout>
		</SWRConfig>
	);
};

export default HOC(Page);

export const getStaticProps: GetStaticProps = async () => {
	const services = await axios.get(BASE_URL + "/services").then((res) => res.data);
	const groups = await axios.get(BASE_URL + "/groups/getall").then((res) => res.data);

	return {
		props: {
			fallback: {
				"/services": services,
			},
			groups,
		},
		revalidate: 30,
	};
};
interface ModalForm {
	open: boolean;
	onClose: () => void;
	groups: IGroup[];
	dispatch: AppDispatch;
}
const initForm: IService = {
	name: "",
	shortName: "",
};

function ModalForm(props: ModalForm) {
	const [formData, setFormData] = useState(initForm);
	const { groups, onClose, open, dispatch } = props;
	const { mutate } = useSWRConfig();
	const onSuccess = () => {
		mutate("/services");
		setFormData(initForm);
		setTimeout(onClose, 500);
	};
	const handleSave = () => {
		API.handlePost<IService>(formData, onSuccess, dispatch, "services");
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle className="bg-slate-900 text-white"></DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Nama"
							name="name"
							onChange={(e) => setFormData((old) => ({ ...old, name: e.target.value }))}
							value={formData.name}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth margin="dense" variant="standard">
							<InputLabel id="groupId">Kelompok</InputLabel>
							<Select
								name="groupId"
								onChange={(e) => setFormData((old) => ({ ...old, groupId: e.target.value }))}
								value={formData.groupId ?? ""}
							>
								{groups.map((g) => (
									<MenuItem key={g.id} value={g.id}>
										{g.groupName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							name="shortName"
							label="shortName"
							value={formData.shortName}
							onChange={(e) => setFormData((old) => ({ ...old, shortName: e.target.value }))}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth margin="dense" variant="standard">
							<InputLabel id="kategoriService">Jenis Layanan</InputLabel>
							<Select
								name="kategoriservice"
								onChange={(e) =>
									setFormData((old) => ({
										...old,
										kategoriService: e.target.value,
									}))
								}
								value={formData.kategoriService ?? ""}
							>
								<MenuItem value={0}>Transaksi</MenuItem>
								<MenuItem value={1}>Aktivitas</MenuItem>
								<MenuItem value={2}>Laporan</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions className="bg-slate-900 text-white">
				<CancelButton onClick={onClose} />
				<SaveButton onClick={handleSave} />
			</DialogActions>
		</Dialog>
	);
}
