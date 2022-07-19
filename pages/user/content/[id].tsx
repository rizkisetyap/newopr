import { Box, Container, Paper } from "@mui/material";
import axios from "axios";
import AdminLayout from "components/Layout/AdminLayout";
import { BASE_URL } from "lib/constants";
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
					<Box className="flex flex-col-reverse md:flex-row md:justify-between p-4">
						<div className="flex-1">
							<MDEditor source={props.konten.bodyContent} />
						</div>
						<div>
							<img
								className="mb-2 md:mb-0"
								src={BASE_URL.replace("/api", "/") + props.konten.pathImage}
								alt={props.konten.title + "image"}
							/>
						</div>
					</Box>
				</Paper>
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
