import { Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import AdminLayout from "components/Layout/AdminLayout";
import { useFetch } from "data/Api";
import moment, { BASE_URL } from "lib/constants";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { SWRConfig } from "swr";
import { IContent, IFallback } from "types/ModelInterface";
interface Props {
	fallback: IFallback;
}
const Page = (props: Props) => {
	const router = useRouter();
	const { id } = router.query;
	const { data: kontens } = useFetch<IContent[]>("/content/GetContentByCategory/" + id);
	console.log(kontens);
	return (
		// <SWRConfig value={{ fallback: props.fallback }}>
		<AdminLayout title="List Konten">
			<Container>
				<div className="bg-cyan-700 text-white my-4 p-4">
					<Typography className=" text-3xl font-bold">Konten</Typography>
				</div>
				<div className="py-8">
					<Grid container spacing={2}>
						{kontens &&
							kontens.map((k) => (
								<Grid key={k.id} item xs={12}>
									<div className="flex gap-4 bg-white rounded-sm overflow-hidden">
										<div className="w-64 min-w-[256px]">
											<img
												className="object-cover block"
												src={BASE_URL.replace("api", "") + k.pathImage}
												alt="image konten"
											/>
										</div>
										<div className="text-gray-600 py-3 pr-2 overflow-hidden flex flex-col justify-between">
											<Link href={"/user/content/detail/" + k.id} passHref>
												<a className="text-xl font-bold transition-all duration-300 ease-in-out hover:text-orange-600 hover:underline">
													{k.title}
												</a>
											</Link>
											<p className="truncate text-sm text-ellipsis">{k.bodyContent}</p>
											<Typography variant="body2">
												posted on: <span className="italic">{moment(k.createDate).calendar()}</span>
											</Typography>
										</div>
									</div>
								</Grid>
							))}
					</Grid>
				</div>
			</Container>
		</AdminLayout>
		// </SWRConfig>
	);
};

export default Page;
