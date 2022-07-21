import { Container, Grid, Paper, Box, Typography, Button, IconButton, Card } from "@mui/material";
import axios from "axios";
import AdminLayout from "components/Layout/AdminLayout";
import { useFetch } from "data/Api";
import { BASE_URL } from "lib/constants";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SWRConfig } from "swr";
import { ICategory, IContent, IFallback } from "types/ModelInterface";
import ocrImg from "public/ocr.jpg";
import style from "styles/sliders.module.scss";
import cn from "classnames";
import { ArrowBackIosRounded, ArrowForwardRounded, ArrowLeftRounded, ArrowRightRounded } from "@mui/icons-material";
import { useRouter } from "next/router";
import siagaCovid from "public/ocr2.jpg";
import defaultImg from "public/oprLogo.png";
import opr from "/public/opr_2.png";
interface Props {
	fallback: IFallback;
}
const IMG_URL = (path: string) => BASE_URL.replace("api", "") + path;
const Page = (props: Props) => {
	const { data: kontens } = useFetch<IContent[]>("/content/getall");
	const { data: kategori } = useFetch<ICategory[]>("/categories/getall");
	const { data: sliders } = useFetch<IContent[]>("/ui/sliderKonten");
	const [currentKonten, setCurrentKonten] = useState(0);
	const [loop, setLoop] = useState<any>();
	const length = sliders?.length;
	const router = useRouter();
	const Next = () => {
		if (length) {
			setCurrentKonten(Math.abs(currentKonten + 1) % length);
		}
	};
	const Prev = () => {
		if (length) {
			setCurrentKonten(Math.abs(currentKonten - 1) % length);
		}
	};
	const navigate = (id: number) => {
		router.push("/user/content/detail/" + id);
	};

	useEffect(() => {
		const Next = () => {
			if (length) {
				setCurrentKonten(Math.abs(currentKonten + 1) % length);
			}
		};
		const timer = setInterval(Next, 6000);

		return () => {
			clearInterval(timer);
		};
	});

	return (
		<SWRConfig value={{ fallback: props.fallback }}>
			<AdminLayout title="Konten">
				<div className="bg-gray-50">
					<div className="w-screen relative overflow-y-hidden">
						{/* Sliders */}{" "}
						<div className="overflow-hidden  bg-slate-900">
							{sliders &&
								sliders.map((s, i) => (
									// <div className={cn("w-screen flex justify-center bg-slate-900")}>
									<div
										key={i}
										onClick={() => navigate(s.id!)}
										className={cn(
											"w-full flex justify-center translate-x-full transition-all duration-300 ease-out cursor-pointer hover:scale-105",
											{
												[style.active]: i === currentKonten,
											}
										)}
									>
										{i === currentKonten && (
											<div className="w-[700px] relative py-4">
												<div className="absolute top-0 left-0 right-0 bottom-0 bg-slate-700 opacity-40" />
												<div className="absolute top-1/4 md:top-1/4 md:-translate-y-1/4 -translate-y-1/2">
													<div className="bg-orange-600 rounded-r-lg text-white max-w-max">
														<Typography
															className="pr-6 text-base md:text-4xl"
															variant="h4"
															component="div"
														>
															{s.title}
														</Typography>
													</div>
												</div>
												<img
													className={cn(
														"object-contain  overflow-hidden rounded-md  transition-all duration-500",
														{
															[style.imgActive]: i === currentKonten,
														}
													)}
													src={IMG_URL(s.pathImage!)}
												/>
											</div>
										)}
									</div>
									// </div>
								))}
						</div>
						{/* end sliders */}
						<div className="absolute bottom-6 left-1/2 flex gap-4 -translate-x-1/2">
							{sliders &&
								sliders.map((s, idx) => (
									<div
										key={idx}
										onClick={() => setCurrentKonten(idx)}
										className={cn(
											"w-3 transition-all duration-300 ease-in-out cursor-pointer h-3 rounded-full",
											{
												["bg-cyan-500"]: idx === currentKonten,
												["bg-cyan-100"]: idx !== currentKonten,
											}
										)}
									/>
								))}
						</div>
						<div
							onClick={Next}
							className="absolute transition-all duration-300 hover:opacity-75 right-10 top-1/2 -translate-y-1/2 opacity-50 bg-gray-50 rounded-full cursor-pointer"
						>
							<ArrowRightRounded
								sx={{
									fontSize: 32,
								}}
							/>
						</div>
						<div
							onClick={Prev}
							className="absolute transition-all duration-300 left-10 top-1/2 opacity-50 -translate-y-1/2 bg-gray-50 rounded-full cursor-pointer hover:opacity-75"
						>
							<ArrowLeftRounded
								sx={{
									fontSize: 32,
								}}
							/>
						</div>
					</div>
					<div className="mt-8 md:mt-12 pb-10">
						<div className="flex justify-center">
							{/* <Typography className={cn("text-center max-w-max text-lg md:text-4xl font-bold", style.title)}>
								MY OPR
							</Typography> */}
							<img src={opr.src} alt="OPR" />
						</div>
						<Container className="py-4 mt-8 bg-gray-100">
							<Grid container justifyContent="center" spacing={{ xs: 2, md: 4 }}>
								{kategori &&
									kategori.map((k) => (
										<Grid key={k.id} className="justify-center flex" item xs={12} sm={6} lg={3}>
											<Link href={"/user/content/kategori/" + k.id} passHref>
												<div className="overflow-hidden rounded-md shadow-md transition-all duration-300 bg-white cursor-pointer group hover:ring-4 hover:ring-offset-2 hover:ring-orange-500/50">
													{/* <div className="absolute top-0 left-0 right-0 bottom-0" /> */}
													<div className="rounded-sm overflow-hidden">
														{k.id === 5 ? (
															<img
																className="object-cover transition-all duration-300 ease-in-out group-hover:scale-110"
																src={siagaCovid.src}
															/>
														) : (
															<img
																className="object-cover transition-all duration-300 ease-in-out group-hover:scale-110"
																src={defaultImg.src}
															/>
														)}
													</div>
													<Typography className=" text-cyan-800 mb-2 text-center text-xl font-bold">
														{k.nama}
													</Typography>
												</div>
											</Link>
										</Grid>
									))}
							</Grid>
						</Container>
					</div>
				</div>
			</AdminLayout>
		</SWRConfig>
	);
};

export default Page;

export const getStaticProps: GetStaticProps = async () => {
	const kontens = await axios.get(BASE_URL + "/content/getall").then((res) => res.data);
	const sliders = await axios.get(BASE_URL + "/ui/sliderKonten").then((res) => res.data);
	return {
		props: {
			fallback: {
				"/content/getall": kontens,
				"/ui/sliderKonten": sliders,
			},
		},
	};
};
