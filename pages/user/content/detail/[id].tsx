import { Box, Container, Paper } from "@mui/material";
import axios from "axios";
import AdminLayout from "components/Layout/AdminLayout";
import moment, { BASE_URL } from "lib/constants";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { IContent } from "types/ModelInterface";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
const MDEditor = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false });
interface Props {
	konten: IContent;
}
const Details = (props: Props) => {
	return (
		<AdminLayout title={props.konten.title ?? "Konten"}>
			<Container
				maxWidth="xl"
				sx={{
					py: 4,
				}}
			>
				<Paper elevation={0} sx={{ p: 2 }}>
					<Box className="">
						<div className="flex justify-between items-center">
							<h1 className="text-3xl mb-4 font-bold uppercase">{props.konten.title}</h1>
							<span className="italic text-sm font-bold">{moment(props.konten.createDate).calendar()}</span>
						</div>
						<div className="h-96 static overflow-hidden object-cover">
							<img
								className="object-cover block"
								src={BASE_URL.replace("/api", "/") + props.konten.pathImage}
								alt={props.konten.title + "image"}
							/>
						</div>
						<div className="relative mt-8">
							<MDEditor source={props.konten.bodyContent} />
						</div>
					</Box>
					<div></div>
				</Paper>
				<div className="bg-white mt-4 p-2">
					<h6 className="font-bold mb-4 text-lg">Lampiran</h6>
					<div className="space-y-2">
						<div className="flex gap-4 items-center">
							<span>Image :</span>
							{props.konten.pathImage && (
								<a
									target="_blank"
									rel="noreferrer"
									className="text-xs bg-cyan-400 text-white rounded-full px-4 py-0.5"
									href={BASE_URL.replace("api", "") + props.konten.pathImage}
								>
									download
								</a>
							)}
						</div>
						<div className="flex gap-4 items-center">
							<span>File :</span>
							{props.konten.pathContent && (
								<a
									target="_blank"
									rel="noreferrer"
									className="text-xs bg-cyan-400 text-white rounded-full px-4 py-0.5"
									href={BASE_URL.replace("api", "") + props.konten.pathContent}
								>
									download
								</a>
							)}
						</div>
					</div>
				</div>
			</Container>
		</AdminLayout>
	);
};

export default Details;

interface IParams extends ParsedUrlQuery {
	id: string;
}

export const getStaticPaths = async () => {
	const kontens: IContent[] = await axios.get(BASE_URL + "/content/getall").then((res) => res.data);
	const paths = kontens.map((konten) => ({
		params: {
			id: konten.id!.toString(),
		},
	}));
	return {
		paths,
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async (ctx) => {
	const { id } = ctx.params as IParams;
	const konten = await axios.get(BASE_URL + "/content/" + id).then((res) => res.data);

	return {
		props: {
			konten,
		},
		revalidate: 10,
	};
};
