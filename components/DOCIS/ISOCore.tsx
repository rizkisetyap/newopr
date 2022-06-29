import { FolderRounded } from "@mui/icons-material";
import { Button, Grid, TextField, Typography, Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useAppDispatch } from "app/hooks";
import FileInput from "components/Input/FileInput";
import API from "lib/ApiCrud";
import { BASE_URL } from "lib/constants";
import React, { ChangeEvent, useRef, useState } from "react";
import { mutate } from "swr";
import { FILE, ICoreISO } from "types/ModelInterface";

type FormData = {
	isoCore: ICoreISO;
	serviceId: number;
	file: FILE;
};
interface Props {
	serviceId: number;
	isoCores?: ICoreISO[];
}
const ISOCore = (props: Props) => {
	const { isoCores } = props;
	const [name, setName] = useState("");
	const dispatch = useAppDispatch();
	const isoCoreFileInputRef = useRef<HTMLInputElement>(null);
	const [fileData, setFileData] = useState<FILE | null>(null);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files !== null) {
			// setFile(files[0]);
			const reader = new FileReader();
			reader.onloadend = function (result) {
				const base64 = result.target!.result;
				// console.log(base64);
				setFileData({
					base64str: base64!.toString(),
					type: files[0].type,
					extension: files[0].name.match(/[^\\]*\.(\w+)$/)![1],
					name: files[0].name,
				});
			};

			reader.readAsDataURL(files[0]);
		}
	};
	const onSuccess = () => {
		isoCoreFileInputRef!.current!.value = "";
		mutate("/isocores/getall");
		setName("");
	};
	const handleSubmit = () => {
		const data: FormData = {
			isoCore: {
				filePath: "",
				name: name,
			},
			serviceId: props.serviceId,
			file: { ...fileData, name: name.replace(":", "_") },
		};
		API.handlePost<FormData>(data, onSuccess, dispatch, "isocores/uploadiso");
	};
	return (
		<Box className="p-6 border my-6">
			<Typography variant="h4" component="h5">
				Upload Iso Core
			</Typography>
			<Grid container spacing={2} justifyContent="space-between" alignItems="start">
				<Grid item xs={12} md={6}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								margin="dense"
								value={name}
								onChange={(e) => setName(e.target.value)}
								variant="standard"
								label="name"
							/>
						</Grid>
						<Grid item xs={12}>
							<FileInput onChange={handleFileChange} ref={isoCoreFileInputRef} />
						</Grid>
						<Grid item xs={12}>
							<Button
								variant="contained"
								className="bg-violet-600 mt-6 ml-auto"
								color="secondary"
								type="button"
								onClick={handleSubmit}
							>
								Save
							</Button>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={6}>
					<Box>
						<Typography>Existing ISO Core</Typography>
						{isoCores && (
							<List dense>
								{isoCores.map((iso) => (
									<ListItem key={iso.id}>
										<ListItemIcon>
											<FolderRounded />
										</ListItemIcon>
										<ListItemText>
											<span className="mr-4">{iso.name}</span>
											<a
												className="bg-blue-50 rounded-full text-blue-600"
												href={BASE_URL.replace("/api", "/") + iso.filePath}
											>
												download
											</a>
										</ListItemText>
									</ListItem>
								))}
							</List>
						)}
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ISOCore;
