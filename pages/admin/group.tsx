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
import GroupTable from "components/MUI/Table/GroupTable";
import HOC from "components/HOC";
import { handlePostGroup } from "lib/ApiGroup";
import { useAppDispatch } from "app/hooks";
import { AddCircleRounded, AddRounded } from "@mui/icons-material";
import { IFallback, IGroup } from "types/ModelInterface";
import API from "lib/ApiCrud";
import { GetStaticProps } from "next";
import axios from "axios";

import { BASE_URL } from "lib/constants";
import { useFetch } from "data/Api";
import { SWRConfig, useSWRConfig } from "swr";

const Group: FC<{ fallback: IFallback }> = ({ fallback }) => {
	const [open, setOpen] = useState(false);
	const { data: groups } = useFetch<IGroup[]>("/groups/getall");

	return (
		<SWRConfig value={{ fallback }}>
			<AdminLayout title="Group">
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Paper elevation={0} sx={{ p: 2 }}>
						<Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between">
							<Typography mb={{ xs: 2, md: 0 }} className="font-medium text-gray-600" variant="h5">
								Kelompok
							</Typography>
							<Box>
								<Button
									startIcon={<AddCircleRounded />}
									color="success"
									className="bg-green-600"
									size="small"
									variant="contained"
									onClick={() => setOpen(true)}
								>
									<span className="text-xs">Tambah Data</span>
								</Button>
							</Box>
						</Box>
						{groups ? (
							<Box sx={{ mt: 2 }}>
								<GroupTable groups={groups} />
							</Box>
						) : (
							<Typography variant="body2">Error loading data</Typography>
						)}
					</Paper>
					<ModalForm open={open} onClose={() => setOpen(false)} />
				</Container>
			</AdminLayout>
		</SWRConfig>
	);
};

export default HOC(Group);
interface IModalForm {
	open: boolean;
	onClose: () => void;
}
const initForm: IGroup = {
	groupName: "",
};
function ModalForm(props: IModalForm) {
	const { open, onClose } = props;
	const [formData, setFormData] = useState<IGroup>(initForm);
	const dispatch = useAppDispatch();
	const { mutate } = useSWRConfig();
	const onSuccess = () => {
		setFormData(initForm);
		mutate("/groups/getall");
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		API.handlePost<IGroup>(formData, onSuccess, dispatch, "groups");
	};

	return (
		<Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
			<DialogTitle>
				<span>Kelompok Baru</span>
			</DialogTitle>
			<DialogContent>
				<TextField
					fullWidth
					margin="dense"
					variant="standard"
					value={formData.groupName}
					label="Nama kelompok"
					name="groupName"
					onChange={(event) => setFormData((old) => ({ ...old, [event.target.name]: event.target.value }))}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="warning" variant="contained" className="bg-orange-600">
					Cancel
				</Button>
				<Button onClick={handleSave} color="primary" variant="contained" className="bg-blue-600">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
export const getStaticProps: GetStaticProps = async () => {
	const data = await axios.get(BASE_URL + "/groups/getall").then((res) => res.data);

	return {
		props: {
			fallback: {
				"/groups/getall": data,
			},
		},
	};
};
