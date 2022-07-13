import React, { FormEvent, useEffect, useState } from "react";
import { Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import s from "styles/Login.module.scss";
import cn from "classnames";
import axios from "axios";
import { BASE_URL } from "lib/constants";
import { useAppDispatch } from "app/hooks";
import { login } from "app/reducers/authReducer";
import { openSnackbar } from "app/reducers/uiReducer";
import HOC from "components/HOC/HOC";
import WithAuth from "components/HOC/WithAuth";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useFetch } from "data/Api";
import { IEmploye } from "types/ModelInterface";

// const initForm: { npp: string; password: string } = {
// 	npp: "102131",
// 	password: "BNI102131",
// };
// const NPP = "80001";
// const PASSWORD = "BNI80001";

const Home = () => {
	const [npp, setNpp] = useState("");
	const [password, setPassword] = useState("");
	const { data: session, status } = useSession();
	const router = useRouter();
	const { error } = router.query;
	useEffect(() => {
		if (status === "loading") return;
		if (status === "authenticated") {
			router.push("/dashboard");
		}
	}, [session, status]);

	return (
		<Box className={cn("h-screen bg-violet-700 grid place-items-center overflow-hidden", s.root)}>
			<Container maxWidth="xl">
				<Grid height="100%" container spacing={2} justifyContent="center">
					{/* <Grid item xs={12} sm={6} md={7}>
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
					</Grid> */}
					<Grid item xs={12} sm={6} md={5}>
						<Box className="mx-auto">
							<Paper className="p-8">
								<Grid container>
									<Grid item xs={12}>
										<Typography className="text-center mb-3" variant="h5">
											My OPR
										</Typography>
										<Typography variant="body2" color="error">
											{error}
										</Typography>
										<Typography
											className="text-center font-bold text-violet-900"
											variant="body1"
											component="p"
										>
											LOGIN
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<TextField
											value={npp}
											variant="standard"
											label="NPP"
											required
											fullWidth
											margin="dense"
											onChange={(event) => setNpp(event.target.value)}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											value={password}
											variant="standard"
											label="Password"
											required
											fullWidth
											margin="dense"
											onChange={(e) => setPassword(e.target.value)}
										/>
									</Grid>
									<Grid mt={4} item xs={12}>
										<Button
											fullWidth
											variant="contained"
											className="bg-violet-700"
											color="secondary"
											onClick={() =>
												signIn("credentials", {
													redirect: true,
													npp,
													password,
													callbackUrl: "/newopr/admin",
												})
											}
										>
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

// const WithNtification = HOC(Home);
export default HOC(Home);
