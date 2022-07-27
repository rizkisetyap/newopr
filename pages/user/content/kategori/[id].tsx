import { Container, CssBaseline, Grid, Typography } from "@mui/material";
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
			{/* <CssBaseline /> */}
			<Container maxWidth="xl" sx={{ minHeight: "80vh" }}>
				<div className="bg-cyan-600 text-white my-4 p-4">
					<Typography className="text-xl font-bold">Konten</Typography>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
					{kontens &&
						kontens.map((k) => (
							<div key={k.id} className="rounded-md overflow-hidden">
								<div className="flex gap-4 bg-white rounded-sm">
									<div className="w-64 min-w-[256px]">
										<img
											className="object-cover block"
											src={BASE_URL.replace("api", "") + k.pathImage}
											alt="image konten"
										/>
									</div>
									<div className="text-gray-600 py-3 pr-2 overflow-hidden flex flex-col justify-between">
										<div>
											<Link href={"/user/content/detail/" + k.id} passHref>
												<a className="text-xl font-bold transition-all duration-300 ease-in-out hover:text-orange-600 hover:underline">
													{k.title}
												</a>
											</Link>
											<Typography variant="body2">
												posted on: <span className="italic">{moment(k.createDate).calendar()}</span>
											</Typography>
										</div>
										<div className="py-1.5">
											<p className="flex -tracking-2 text-sm">{k.bodyContent?.substring(0, 130) + "..."}</p>
										</div>
									</div>
								</div>
							</div>
						))}
				</div>
			</Container>
		</AdminLayout>
		// </SWRConfig>
	);
};

export default Page;
