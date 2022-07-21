import React, { FormEvent, useEffect, useState } from "react";
import { Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import s from "styles/Login.module.scss";
import cn from "classnames";

import HOC from "components/HOC/HOC";
import { useRouter } from "next/router";
import { signIn, SignInResponse, useSession } from "next-auth/react";
import BackdropLoading from "components/MUI/BackdropLoading";

const Home = () => {
	const [npp, setNpp] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { data: session, status } = useSession();
	const router = useRouter();
	useEffect(() => {
		if (status === "loading") return;
		if (status === "authenticated") {
			router.push("/admin");
		}
	}, [session, status]);

	if (status === "loading" || (status === "authenticated" && session)) {
		return <BackdropLoading />;
	}
	// console.log(status);
	return (
		<Box className={cn("h-screen bg-violet-700 grid place-items-center overflow-hidden", s.root)}>
			<Container maxWidth="xl">
				<Grid height="100%" container spacing={2} justifyContent="center">
					<Grid item xs={12} sm={6} md={5}>
						<Box className="mx-auto">
							<Paper className="p-8">
								<Grid container>
									<Grid item xs={12}>
										<Typography className="text-center mb-3" variant="h5">
											My OPR
										</Typography>
										{error && (
											<Typography variant="body2" color="error">
												{error}
											</Typography>
										)}
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
											type="password"
											fullWidth
											margin="dense"
											onChange={(e) => setPassword(e.target.value)}
										/>
									</Grid>
									<Grid mt={4} item xs={12}>
										<Button
											fullWidth
											variant="contained"
											className="bg-violet-700 disabled:bg-gray-400"
											color="secondary"
											disabled={isLoading}
											onClick={async () => {
												setError(null);
												try {
													setIsLoading(true);
													const { error, ok, status } = (await signIn("credentials", {
														redirect: false,
														npp,
														password,
													})) as SignInResponse;
													setIsLoading(false);
													if (error) {
														setError(error);
													}
													if (ok && status === 200) {
														router.push("/admin");
													}
												} catch (error) {
													alert("An error occured try again");
												}
												setIsLoading(false);
											}}
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
