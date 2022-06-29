import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import FileInput from "components/Input/FileInput";
import React from "react";
import { ICoreISO, IRegisteredForm } from "types/ModelInterface";

interface Props {
	isoCores: ICoreISO[];
	isoForms: IRegisteredForm[];
}
const IsoSupport = ({ isoCores, isoForms }: Props) => {
	return (
		<Box className="p-6 border my-6">
			<Typography variant="h4">Upload Document ISO</Typography>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Grid container spacing={4} alignItems="end">
						<Grid item xs={12}>
							{/* <TextField variant="standard" label="Form Number" margin="dense" fullWidth />
							 */}
							<input type="text" value="FRM" disabled className="border inline-block w-10" />
							<input type="text" value="OPR" disabled className="border w-10" />
						</Grid>
						<Grid item xs={12}>
							<FormControl variant="standard" margin="dense" fullWidth>
								<InputLabel id="RegForm">RegisterForm</InputLabel>
								<Select>
									{isoForms &&
										isoForms.map((form) => (
											<MenuItem key={form.id} value={form.id}>
												{form.name}
											</MenuItem>
										))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl variant="standard" margin="dense" fullWidth>
								<InputLabel id="isoCore">IsoCore</InputLabel>
								<Select>
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
