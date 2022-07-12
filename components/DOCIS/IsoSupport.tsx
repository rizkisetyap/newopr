import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import FileInput from "components/Input/FileInput";
import React, { useState } from "react";
import { FILE, ICoreISO, IRegisteredForm, ISupportISO } from "types/ModelInterface";

interface Props {
	isoCores: ICoreISO[];
	isoForms: IRegisteredForm[];
}

const initForm: ISupportISO = {
	filePath: "",
	formNumber: "",
	revision: 0,
};

const IsoSupport = ({ isoCores, isoForms }: Props) => {
	const [fileIso, setFileIso] = useState<FILE | null>(null);
	const [formData, setFormData] = useState<ISupportISO>();
	return (
		<Box className="p-6 border my-6">
			<Typography variant="h4">Upload Document ISO</Typography>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Grid container spacing={4} alignItems="end">
						<Grid item xs={12}>
							<FormControl variant="standard" margin="dense" fullWidth>
								<InputLabel id="RegForm">RegisterForm</InputLabel>
								<Select
									name="registeredFormId"
									onChange={(e) => setFormData((old) => ({ ...old, registeredFormId: e.target.value }))}
									value={formData?.registeredFormId ?? ""}
								>
									{isoForms &&
										isoForms.map((form) => (
											<MenuItem key={form.id} value={form.id}>
												{form.formNumber}
											</MenuItem>
										))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl variant="standard" margin="dense" fullWidth>
								<InputLabel id="isoCore">IsoCore</InputLabel>
								<Select
									name="isoCoreId"
									onChange={(e) => setFormData((old) => ({ ...old, isoCoreId: e.target.value }))}
									value={formData?.isoCoreId ?? ""}
								>
									{isoCores &&
										isoCores.map((core) => (
											<MenuItem key={core.id} value={core.id}>
												{core.name}
											</MenuItem>
										))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FileInput onChange={(e) => console.log(e)} />
						</Grid>
						<Grid item xs={12}>
							<Button color="secondary" className="bg-violet-600 ml-auto" variant="contained">
								Save
							</Button>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={6}></Grid>
			</Grid>
		</Box>
	);
};

export default IsoSupport;
