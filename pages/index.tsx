import React, { FormEvent, useState } from "react";
import { Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import s from "styles/Login.module.scss";
import cn from "classnames";
import axios from "axios";
import { BASE_URL } from "lib/constants";

const Home = () => {
	const [loginVM, setLoginVM] = useState<{ npp: string; password: string }>({
		npp: "102131",
		password: "BNI102131",
	});
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const res = await axios.post("http://103.101.225.233/devmyopr/api/login", loginVM);
			const data = res.data;
			console.log(data);
		} catch (error) {}
	};
	return (
		<Box className={cn("h-screen bg-violet-700 grid place-items-center overflow-hidden", s.root)}>
			<Container maxWidth="xl">
				<Grid height="100%" container spacing={2}>
					<Grid item xs={12} sm={6} md={7}>
						<Box className="mx-auto text-slate-700">
							<Paper className="p-8">
								<Typography className="font-bold mb-8 text-slate-600" variant="h4" component="h1">
									MY OPR
								</Typography>
								<Typography className="text-slate-600" variant="body1">
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore sequi exercitationem
									perspiciatis. Hic, sit. Ab neque dolorem iusto. Laudantium mollitia dolor soluta ea
									voluptatibus magni quibusdam odio quod aliquid necessitatibus!
								</Typography>
							</Paper>
						</Box>
					</Grid>
					<Grid item xs={12} sm={6} md={5}>
						<Box className="mx-auto">
							<Paper className="p-8">
								<Grid container>
									<Grid item xs={12}>
										<Typography className="text-center font-bold text-violet-900" variant="h6" component="h5">
											LOGIN
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<TextField variant="standard" label="NPP" required fullWidth margin="dense" />
									</Grid>
									<Grid item xs={12}>
										<TextField variant="standard" label="Password" required fullWidth margin="dense" />
									</Grid>
									<Grid mt={4} item xs={12}>
										<Button fullWidth variant="contained" className="bg-violet-700" color="secondary">
											Login
										</Button>
									</Grid>
								</Grid>
							</Paper>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default Home;
