import React, { ChangeEvent, FC, useState } from "react";

import {
	Container,
	Paper,
	Box,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Grid,
	TextField,
} from "@mui/material";
import AdminLayout from "components/Layout/AdminLayout";
import KontentTable from "components/MUI/Table/KontentTable";
import SliderTable from "components/MUI/Table/SliderTable";
import HOC from "components/HOC";
import Link from "next/link";
import { AddCircleRounded } from "@mui/icons-material";
import API from "lib/ApiCrud";
import { useAppDispatch } from "app/hooks";
import { IFallback, ISlider } from "types/ModelInterface";
import { SWRConfig, useSWRConfig } from "swr";
import { useFetch } from "data/Api";
import { ScopedMutator } from "swr/dist/types";
import { GetStaticProps } from "next";
import axios from "axios";
import { BASE_URL } from "lib/constants";
interface Props {
	fallback: IFallback;
}
const Content: FC<Props> = ({ fallback }) => {
	const [open, setOpen] = useState(false);
	const { data: sliders } = useFetch<ISlider[]>("/sliders/getall");
	const { mutate } = useSWRConfig();

	return (
		<SWRConfig value={{ fallback }}>
			<AdminLayout title="Slider">
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Paper elevation={0} sx={{ p: 2 }}>
						<Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between">
							<Typography mb={{ xs: 2, md: 0 }} className="text-gray-600" variant="h5">
								Slider
							</Typography>

							<Button
								size="small"
								startIcon={<AddCircleRounded />}
								color="success"
								variant="contained"
								className="bg-green-500"
								onClick={() => setOpen(true)}
							>
								Tambah data
							</Button>
						</Box>
						{sliders ? (
							<Box sx={{ mt: 2 }}>
								<SliderTable sliders={sliders} />
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
interface IFile {
	name: string;
	type: string;
	extension: string;
	base64str: string;
}
function ModalForm(props: IModalProps) {
	const { open, onClose, mutate } = props;
	const dispatch = useAppDispatch();
	const [imgData, setImgData] = useState<IFile | null>(null);
	const [title, setTitle] = useState("");
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
		const data = {
			slider: {
				title,
			},
			image: imgData,
		};
		API.handlePost<any>(data, onSuccess, dispatch, "sliders/insert");
	};
	return (
		<Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
			<DialogTitle className="bg-slate-900 text-white">New Slide</DialogTitle>
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
							value={imgData?.name ?? title}
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

export const getStaticProps: GetStaticProps = async () => {
	const data = await axios.get(BASE_URL + "/sliders/getall").then((res) => res.data);

	return {
		props: {
			fallback: {
				"/sliders/getall": data,
			},
		},
	};
};
