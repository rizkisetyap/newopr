import { Box, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { el } from "date-fns/locale";
import moment, { BASE_URL } from "lib/constants";
import { GetServerSideProps } from "next";
import { ParsedUrl } from "next/dist/shared/lib/router/utils/parse-url";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import { IEvent } from "types/ModelInterface";
import cn from "classnames";
import s from "styles/PresencePage.module.css";
import Image from "next/image";
import img3 from "public/bni4.png";
import Clock, { ClockState } from "components/Clock/Clock";
import AnimatedCheck from "components/CheckAnimated";
interface QR {
	id: number;
	name: string;
	theme: string;
	organizer: string;
	dateLocation: string;
	qrSrc: string;
}
interface Props {
	authenticated: "success" | "failed";
	event?: IEvent;
	qr?: QR;
	clockState: ClockState;
}

moment.locale("id-ID");
const Absense = (props: Props) => {
	const [qrBlob, setQrBlob] = useState<Blob | null>(null);
	const startDate = moment(props.event?.startDate).calendar();
	const endDate = moment(props.event?.endDate).format("HH:mm:ss, dddd MMMM YYYY");

	if (props.authenticated === "success") {
		return (
			<div className={cn("min-h-screen min-w-screen text-white", s.linear)}>
				<div className="flex w-full justify-between">
					<div>
						<div className="h-16 relative object-cover w-40">
							{/* <Image src={brand.src} className="" blurDataURL={brand.blurDataURL} layout="fill" /> */}
						</div>
					</div>
					<div className="flex-1 bg-[#0096a4]"></div>
					<div className="inline-flex space-x-1">
						<div className="h-16 relative object-cover w-40">
							<Image src={img3.src} blurDataURL={img3.blurDataURL} layout="fill" />
						</div>
					</div>
				</div>
				<Container maxWidth="lg" className="mt-16">
					<Grid container spacing={6} justifyContent="center" alignItems="start" className="">
						<Grid item xs={12} md={7} className="-order-1">
							<div className={cn("px-2 py-4 rounded-sm space-y-4")}>
								<Clock clockState={props.clockState} />
								<Paper className="inline-flex flex-col px-24 py-8">
									<div>
										<AnimatedCheck />
									</div>
									<Typography variant="h6" sx={{ mt: -2, p: 0 }} component="h3">
										Absen Sukses
									</Typography>
								</Paper>
							</div>
						</Grid>
						<Grid item xs={12} md={5}>
							<div className="text-white space-y-2">
								<Typography className="font-bold" variant="h4">
									{props.event?.eventTheme}
								</Typography>
								<Typography className="font-bold" variant="h3">
									{props.event?.eventName}
								</Typography>
								<Typography className="" variant="h6">
									{props.event?.organizer}
								</Typography>
								<Typography
									className="bg-white text-base text-gray-600 rounded-full px-6 py-3 max-w-max"
									variant="h5"
								>
									{props.qr?.dateLocation}
								</Typography>
								<Typography
									variant="body2"
									className="bg-white max-w-max text-slate-700 py-1 px-3 rounded-full"
								>
									<span>{startDate}</span>- <span>{endDate}</span>
								</Typography>
							</div>
						</Grid>
					</Grid>
				</Container>
			</div>
		);
	}
	return (
		<div className={cn("min-h-screen min-w-screen text-white", s.linear)}>
			<div className="flex w-full justify-between">
				<div>
					<div className="h-16 relative object-cover w-40">
						{/* <Image src={brand.src} blurDataURL={brand.blurDataURL} layout="fill" /> */}
					</div>
				</div>
				<div className="flex-1 bg-[#0096a4]"></div>
				<div className="inline-flex space-x-1">
					<div className="h-16 relative object-cover w-40">
						<Image src={img3.src} blurDataURL={img3.blurDataURL} layout="fill" />
					</div>
				</div>
			</div>
			<Container maxWidth="lg" className="mt-4">
				<Grid container spacing={6} justifyContent="center" alignItems="center" className="">
					<Grid item xs={12} sm={8} className="-order-1">
						<div className={cn("px-2 py-4 rounded-sm space-y-4")}>
							<Clock clockState={props.clockState} />
							<Paper
								sx={{
									maxWidth: "sm",
								}}
								className="px-4"
							>
								<Grid container width="100%" className="bg-white rounded-md mt-8 ml-0" spacing={2}>
									<Grid item xs={12}>
										<Typography variant="body1" className="text-center font-bold text-xl" component="h1">
											Hello, Silakan Absen manual
										</Typography>
										<TextField fullWidth margin="dense" variant="standard" name="npp" label="NPP" />
									</Grid>
									<Grid className="mb-10" item xs={12}>
										<TextField fullWidth margin="dense" variant="standard" name="npp" label="Paswword" />
									</Grid>
								</Grid>
							</Paper>
						</div>
					</Grid>
					<Grid item xs={12} sm={4}>
						<div className="text-white space-y-2">
							<Typography className="font-bold" variant="h4" component="p">
								{props.event?.eventTheme}
							</Typography>
							<Typography className="font-bold" variant="h3" component="p">
								{props.event?.eventName}
							</Typography>
							<Typography className="" variant="h6" component="p">
								{props.event?.organizer}
							</Typography>
							<Typography
								className="bg-white text-base text-gray-600 rounded-full px-6 py-3 max-w-max"
								variant="h5"
								component="p"
							>
								{props.qr?.dateLocation}
							</Typography>
							<Typography variant="body2" className="bg-white max-w-max text-slate-700 py-1 px-3 rounded-full">
								<span>{startDate}</span>- <span>{endDate}</span>
							</Typography>
						</div>
					</Grid>
				</Grid>
			</Container>
		</div>
	);
};

export default Absense;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { id, token } = ctx.query;
	if (!id) {
		return {
			notFound: true,
			props: {},
		};
	}
	const event = await axios.get(BASE_URL + "/events/" + id).then((res) => res.data);
	const qr = await axios.get(BASE_URL + "/presence/" + id).then((res) => res.data);
	const today = new Date();
	const clockState: ClockState = {
		hours: today.getHours(),
		minutes: today.getMinutes(),
		seconds: today.getSeconds(),
		hoursShuffle: true,
		minutesShuffle: true,
		secondsShuffle: true,
	};
	if (!event) {
		return {
			notFound: true,
			redirect: {
				destination: "/404",
				permanent: false,
				statusCode: 404,
				basePath: "/newopr/",
			},
		};
	}
	// console.log(event);
	if (!token) {
		return {
			props: {
				authenticated: "failed",
				event,
				qr,
				clockState,
			},
		};
	}

	try {
		const pressence = await axios
			.post(BASE_URL + "/" + "presence?id=" + id + "&token=" + token)
			.then((res) => res.data);
		console.log(pressence);
		if (pressence >= 0) {
			return {
				props: {
					authenticated: "success",
					clockState,
					qr,
					event,
				},
			};
		} else {
			return {
				props: {
					authenticated: "failed",
					qr,
					clockState,
				},
			};
		}
	} catch (error) {
		return {
			props: {
				authenticated: "failed",
				qr,
				clockState,
			},
		};
	}
};
