import {
	Box,
	Paper,
	Container,
	Grid,
	TextField,
	Button,
	Typography,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { useAppDispatch } from "app/hooks";
import HOC from "components/HOC/HOC";

import AdminLayout from "components/Layout/AdminLayout";
import { useFetch } from "data/Api";
import API from "lib/ApiCrud";
import React, { useState } from "react";
import { useSWRConfig } from "swr";
import { IKategoriDocument } from "types/ModelInterface";

const Admin = () => {
	const { data: kategoriDocuments } = useFetch<IKategoriDocument[]>("/kategoriDocument/getall");
	const [formData, setFormData] = useState<IKategoriDocument>({ name: "" });
	const dispatch = useAppDispatch();
	const { mutate } = useSWRConfig();
	const onSuccess = () => {
		mutate("/kategoriDocument/getall");
		setFormData({ name: "" });
	};
	const handleSave = () => {
		API.handlePost<IKategoriDocument>(formData, onSuccess, dispatch, "kategoriDocument");
	};
	return (
		<AdminLayout title="Admin ISO">
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Paper elevation={0} sx={{ p: 2 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Grid container spacing={4}>
								<Grid item xs={12} sm={6}>
									<Box>
										<TextField
											fullWidth
											margin="dense"
											variant="standard"
											name="name"
											label="Kategori Document"
											value={formData.name}
											onChange={(e) => setFormData({ name: e.target.value })}
										/>
										<Button
											onClick={handleSave}
											color="primary"
											variant="contained"
											className="bg-blue-600 text-sm mt-4"
										>
											Save<span className="text-sm"></span>
										</Button>
									</Box>
								</Grid>
								<Grid item xs={12} sm={6}>
									{kategoriDocuments ? (
										<Box>
											<List dense>
												{kategoriDocuments.length > 0 ? (
													kategoriDocuments.map((kd) => (
														<ListItem key={kd.id}>
															<ListItemText>{kd.name}</ListItemText>
														</ListItem>
													))
												) : (
													<Typography variant="body2" className="text-center">
														No data
													</Typography>
												)}
											</List>
										</Box>
									) : (
										<Typography variant="body2">Error loading data</Typography>
									)}
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Paper>
			</Container>
		</AdminLayout>
	);
};

export default HOC(Admin);
