import { Container, Paper, Typography } from "@mui/material";
import axios from "axios";
import AdminLayout from "components/Layout/AdminLayout";
import { BASE_URL } from "lib/constants";
import { GetStaticPaths, GetStaticPathsContext, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import React from "react";

interface Props {
	historyFiles: any;
}

const History = (props: Props) => {
	// console.log(props);
	return (
		<AdminLayout title="History">
			<Container maxWidth="xl" sx={{ pt: 4 }}>
				<Paper elevation={0} sx={{ p: 2 }}>
					<Typography variant="h4" component="h1">
						History
					</Typography>
					<div></div>
				</Paper>
			</Container>
		</AdminLayout>
	);
};

export default History;

type ResponseISR = {
	id: number;
	path: string;
	name: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
	const files: ResponseISR[] = await axios.get(BASE_URL + "/AdminIso/ISR").then((res) => res.data);
	const paths = files.map((f) => ({
		params: {
			id: f.id.toString(),
		},
	}));

	return {
		paths,
		fallback: false,
	};
};
interface IParams extends ParsedUrlQuery {
	id: string;
}
export const getStaticProps: GetStaticProps = async (ctx) => {
	const { id } = ctx.params as IParams;
	const files = await axios.get(BASE_URL + "/AdminIso/history?fileId=" + id).then((res) => res.data);
	return {
		props: {
			historyFiles: files,
		},
		revalidate: 10,
	};
};
