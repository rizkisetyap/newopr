import { FolderRounded } from "@mui/icons-material";
import { Grid, TextField, Button, Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useAppDispatch } from "app/hooks";
import { useFetch } from "data/Api";
import API from "lib/ApiCrud";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useSWRConfig } from "swr";
import { IEmploye, IRegisteredForm } from "types/ModelInterface";

interface Props {
	isoForms?: IRegisteredForm[];
}
const RegisterForm = ({ isoForms }: Props) => {
	const [name, setName] = useState("");
	const { data } = useSession();
	const { data: user } = useFetch<IEmploye>("/employee/By?id=" + data?.user.npp);
	const serviceId = user?.service?.id;
	const dispatch = useAppDispatch();
	const { mutate } = useSWRConfig();
	const onSuccess = () => {
		mutate("/registeredForms/filter?id=" + serviceId);
		setName("");
	};
	const handleSubmit = () => {
		API.handlePost<IRegisteredForm>({ name, serviceId }, onSuccess, dispatch, "RegisteredForms");
	};
	return (
		<Box className="p-6 my-6 border bg-purple-50 text-gray-600">
			<Typography variant="h4">Register Form</Typography>
			<Grid container>
				<Grid item xs={12} md={6}>
					<Grid container spacing={2} alignItems="end">
						<Grid item xs={12} sm={6} md={8}>
							<TextField
								value={name}
								onChange={(e) => setName(e.target.value)}
								fullWidth
								margin="dense"
								variant="standard"
								label="Nama"
								name="name"
								type="text"
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<Button
								onClick={handleSubmit}
								disabled={!serviceId}
								variant="contained"
								color="primary"
								className="bg-blue-600"
							>
								save
							</Button>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={6}>
					<Box>
						<Typography>Registered Forms</Typography>
						{isoForms && (
							<List dense>
								{isoForms.map((form) => (
									<ListItem key={form.id}>
										<ListItemIcon>
											<FolderRounded />
										</ListItemIcon>
										<ListItemText>{form.name}</ListItemText>
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

export default RegisterForm;
