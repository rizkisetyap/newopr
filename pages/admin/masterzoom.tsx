import {
	Button,
	Container,
	Divider,
	Grid,
	Paper,
	TextField,
	Typography,
	Box,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
} from "@mui/material";
import HOC from "components/HOC/HOC";
import AdminLayout from "components/Layout/AdminLayout";
import ZoomTable from "components/MUI/Table/ZoomTable";
import React, { useState } from "react";
import { IZoom, IZoomStatus } from "types/ModelInterface";
import * as API from "lib/ApiCrud";
import { useAppDispatch } from "app/hooks";
import ZoomStatustable from "components/MUI/Table/ZoomStatusTable";
import { AppDispatch } from "app/store";
import { AddRounded } from "@mui/icons-material";
import { useFetch } from "data/Api";

const modelZoom: IZoom = {
	name: "",
};
const modelZoomStatus: IZoomStatus = {
	name: "",
};

function MasterZoom() {
	const dispatch = useAppDispatch();
	const [openModal1, setOpenModal1] = useState(false);
	const [openModal2, setOpenModal2] = useState(false);
	const { data: zooms } = useFetch<IZoom[]>("/zoom");
	const { data: status } = useFetch<IZoomStatus[]>("/zoomStatus");

	return (
		<AdminLayout title="MasterZoom">
			<Container
				maxWidth="xl"
				sx={{
					py: 4,
				}}
			>
				<Paper
					sx={{
						p: 2,
					}}
					elevation={0}
				>
					<Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="space-between">
						<Typography className="text-gray-600" variant="h5" mb={{ xs: 2, md: 0 }}>
							Zoom Account
						</Typography>
						<Button
							className="bg-green-600"
							variant="contained"
							size="small"
							color="success"
							startIcon={<AddRounded />}
							onClick={() => setOpenModal1(true)}
						>
							Tambah Data
						</Button>
					</Box>
					<Box mt={2}>
						<ZoomTable zooms={zooms ?? []} />
					</Box>
					<Divider className="my-8" />
					<Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="space-between">
						<Typography className="text-gray-600" variant="h5" mb={{ xs: 2, md: 0 }}>
							Zoom Status
						</Typography>
						<Button
							className="bg-green-600"
							variant="contained"
							size="small"
							color="success"
							startIcon={<AddRounded />}
							onClick={() => setOpenModal2(true)}
						>
							Tambah Data
						</Button>
					</Box>
					<Box mt={2}>
						<ZoomStatustable status={status ?? []} />
					</Box>
				</Paper>
				<ModalZoomAkun open={openModal1} onClose={() => setOpenModal1(false)} dispatch={dispatch} />
				<ModalZoomStatus open={openModal2} onClose={() => setOpenModal2(false)} dispatch={dispatch} />
			</Container>
		</AdminLayout>
	);
}

export default HOC(MasterZoom);
interface IModalForm {
	open: boolean;
	onClose: () => void;
	dispatch: AppDispatch;
}
function ModalZoomAkun(props: IModalForm) {
	const { open, onClose, dispatch } = props;
	const [formData, setFormData] = useState(modelZoom);
	const onSuccess = () => {
		setFormData(modelZoom);
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		API.handlePost<IZoom>(formData, onSuccess, dispatch, "zoom");
	};

	return (
		<Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
			<DialogTitle className="bg-slate-900 text-white">New Account</DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Name"
							name="name"
							value={formData.name}
							onChange={(e) => setFormData({ name: e.target.value })}
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
function ModalZoomStatus(props: IModalForm) {
	const { open, onClose, dispatch } = props;
	const [formData, setFormData] = useState(modelZoomStatus);
	const onSuccess = () => {
		setFormData(modelZoomStatus);
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		API.handlePost<IZoomStatus>(formData, onSuccess, dispatch, "zoomStatus");
	};
	return (
		<Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
			<DialogTitle className="bg-slate-900 text-white">New Status</DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							label="Name"
							name="name"
							value={formData.name}
							onChange={(e) => setFormData({ name: e.target.value })}
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
