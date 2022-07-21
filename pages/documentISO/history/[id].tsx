import {
	ExpandMoreRounded,
	ExpandRounded,
	PictureAsPdf,
	PrintRounded,
	SaveRounded,
	VisibilityRounded,
} from "@mui/icons-material";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	Card,
	CardHeader,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Paper,
	Typography,
} from "@mui/material";
import axios from "axios";
import AdminLayout from "components/Layout/AdminLayout";
import { BASE_URL } from "lib/constants";
import { GetStaticPaths, GetStaticPathsContext, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import React, { useState } from "react";
import moment from "moment";
import "moment/locale/id";
import Link from "next/link";
import { Document, Page as DocPage, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
moment.locale("id");

interface Props {
	historyFiles: any;
}

const History = (props: Props) => {
	const [open, setOpen] = useState(false);
	const { historyFiles } = props;
	return (
		<AdminLayout title="History">
			<Container maxWidth="xl" sx={{ pt: 4 }}>
				{/* <Paper elevation={0} sx={{ p: 2 }}> */}
				<Typography variant="h4" component="h1" className="px-6">
					History
				</Typography>
				<div className="mt-4 p-6 rounded-sm shadow-sm">
					<div className="mx-auto">
						{historyFiles &&
							historyFiles.map((h: any, idx: number) => (
								<Accordion key={h.id}>
									<AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel-content-1">
										<Typography variant="h6" className="font-bold border-b-4 border-b-emerald-500">
											<span>Rev.</span>
										</Typography>
										<Typography variant="h6" className="flex-1 text-right">
											<span className="font-bold">
												#
												{h.detailRegister.revisi < 10
													? "0" + h.detailRegister.revisi
													: h.detailRegister.revisi}
											</span>
										</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Divider />
										<div className="flex justify-between pt-2">
											<div className="flex-1 flex flex-col justify-between">
												<Typography variant="h6" className="text-base mb-2">
													<span className="font-bold">Nama File </span>: {h.fileName}
												</Typography>
												<Typography
													variant="body2"
													className="tracking-tighter text-sm text-gray-500 mb-2 gap-2 flex items-center"
												>
													<span className="font-bold">No Form </span>
													<span className="py-1 text-xs px-2 bg-emerald-400 rounded-full text-white">
														{h.detailRegister.registeredForm.formNumber}
													</span>
												</Typography>
												<Typography variant="body2" className="tracking-tight text-gray-800">
													<span className="font-bold">Terakhir Update File </span>:{" "}
													{moment(h.updateDate ?? h.createDate).format("dddd, Do MMMM YYYY, HH:mm")}
												</Typography>
											</div>
											<div className="flex flex-col">
												{/* <Link passHref href=""> */}
												<IconButton
													href={BASE_URL.replace("api", "") + h.filePath}
													target="_blank"
													rel="norefferer"
													color="primary"
													title="download"
												>
													<SaveRounded />
												</IconButton>
												{/* </Link> */}
												<IconButton color="error" title="view" onClick={() => setOpen(true)}>
													<VisibilityRounded />
												</IconButton>
												<IconButton
													href={BASE_URL.replace("api", "") + h.filePath}
													target="_blank"
													rel="norefferer"
													color="success"
													title="Print"
												>
													<PrintRounded />
												</IconButton>
											</div>
										</div>
									</AccordionDetails>
									<PDFViewer
										open={open}
										onClose={() => setOpen(false)}
										src={BASE_URL.replace("api", "") + h.filePath}
										name={h.fileName}
									/>
								</Accordion>
							))}
					</div>
				</div>
				{/* </Paper> */}
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

interface ViewerProps {
	src: string;
	name: string;
	open: boolean;
	onClose: () => void;
}

const PDFViewer = (props: ViewerProps) => {
	const { src, name, onClose, open } = props;
	const [numOfPage, setNumOfPage] = useState<number | null>(null);
	const onLoadDocSuccess = ({ numPages }: any) => {
		setNumOfPage(numPages);
	};

	return (
		<Dialog fullWidth open={open} onClose={onClose} maxWidth="md">
			<DialogTitle>
				<Typography className="border-b-2 border-spacing-2 border-b-orange-600 font-bold" component="h2">
					{name}
				</Typography>
			</DialogTitle>
			<DialogContent className="mx-auto">
				<Document file={src} onLoadSuccess={onLoadDocSuccess}>
					{[...new Array(numOfPage).fill(1)].map((x, idx) => (
						<DocPage key={idx + 1} pageNumber={idx + 1} />
					))}
				</Document>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="warning" className="bg-orange-600" onClick={onClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};
