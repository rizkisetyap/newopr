import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useAppDispatch } from "app/hooks";
import HOC from "components/HOC/HOC";
import AdminLayout from "components/Layout/AdminLayout";
import API from "lib/ApiCrud";
import React, { useState } from "react";

const Page = () => {
	const [name, setName] = useState("");
	const dispatch = useAppDispatch();
	const onSuccess = () => {
		setName("");
	};
	const handleSaveJenisDocument = () => {
		const data = { name };
		API.handlePost<any>(data, onSuccess, dispatch, "jenisDokumen");
	};
	return (
		<AdminLayout title="master docis">
			<Container sx={{ py: 4 }}>
				<Paper elevation={0} sx={{ p: 2 }}>
					<Typography>Master Data</Typography>
					<div className="md:max-w-sm">
						<Typography>Jenis Dokumen</Typography>
						<TextField
							required
							margin="dense"
							fullWidth
							size="small"
							variant="standard"
							name="name"
							label="Jenis Dokumen"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<Button
							onClick={handleSaveJenisDocument}
							size="small"
							variant="contained"
							color="primary"
							className="bg-blue-600"
						>
							Save
						</Button>
					</div>
				</Paper>
			</Container>
		</AdminLayout>
	);
};

export default HOC(Page);
