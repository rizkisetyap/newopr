import React, { FC, FormEvent, useState } from "react";

import {
	Container,
	Paper,
	Box,
	Typography,
	Button,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import AdminLayout from "components/Layout/AdminLayout";

import PosisiTable from "components/MUI/Table/PosisiTable";
import HOC from "components/HOC/HOC";
import { useAppDispatch } from "app/hooks";
import { IFallback, IPosition } from "types/ModelInterface";
import { handlePostPosition } from "lib/ApiPosition";
import { AddCircleRounded } from "@mui/icons-material";
import API from "lib/ApiCrud";
import { useFetch } from "data/Api";
import { SWRConfig, useSWRConfig } from "swr";
import { ScopedMutator } from "swr/dist/types";
import { GetStaticProps } from "next";
import axios from "axios";
import { BASE_URL } from "lib/constants";
const formInit: IPosition = {
	positionName: "",
	grade: 0,
};
interface Props {
	fallback: IFallback;
}
const Content: FC<Props> = ({ fallback }) => {
	const { data: jabatans } = useFetch<IPosition[]>("/positions/getall");
	const { mutate } = useSWRConfig();
	const [open, setOpen] = useState(false);
	return (
		<SWRConfig value={{ fallback }}>
			<AdminLayout title="Posisi">
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Paper elevation={0} sx={{ p: 2 }}>
						<Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between">
							<Typography mb={{ xs: 2, md: 0 }} className="text-gray-600" variant="h5">
								Master Jabatan
							</Typography>
							<Button
								variant="contained"
								size="small"
								color="success"
								startIcon={<AddCircleRounded />}
								className="bg-green-600"
								onClick={() => setOpen(true)}
							>
								<span className="text-xs">Tambah Data</span>
							</Button>
						</Box>
						{jabatans ? (
							<Box sx={{ mt: 2 }}>
								<PosisiTable jabatans={jabatans} />
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
interface IForm {
	open: boolean;
	onClose: () => void;
	mutate: ScopedMutator;
}
function ModalForm(props: IForm) {
	const { open, onClose, mutate } = props;
	const [formData, setFormData] = useState<IPosition>({ positionName: "" });
	const dispatch = useAppDispatch();
	const onSuccess = () => {
		setFormData({ positionName: "" });
		mutate("/positions/getall");
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		API.handlePost<IPosition>(formData, onSuccess, dispatch, "positions");
	};
	return (
		<Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
			<DialogTitle>New Jabatan</DialogTitle>
			<DialogContent>
				<TextField
					fullWidth
					margin="dense"
					variant="standard"
					label="Jabatan"
					name="positionName"
					value={formData.positionName}
					onChange={(event) => setFormData((old) => ({ ...old, [event.target.name]: event.target.value }))}
				/>
			</DialogContent>
			<DialogActions>
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
	const data = await axios.get(BASE_URL + "/positions/getall").then((res) => res.data);

	if (!data) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			fallback: {
				"/positions/getall": data,
			},
		},
		revalidate: 10,
	};
};
